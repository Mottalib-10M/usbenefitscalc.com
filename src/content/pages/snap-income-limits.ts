import { definePage } from '../../lib/page-types';
import { P, STATES, snapGross, snapNet, snapGross165, snapGrossState, snapCalc, bbceAll, fpl, usd, usdx, day, listOf } from '../../lib/kit';
import type { StateData } from '../../lib/kit';

const sp = P.snap;
const SIZES = [1, 2, 3, 4, 5, 6, 7, 8];
// Each row of the three federal tables: sizes 1 to 8, then the amount for each additional member (last cell of the params arrays).
const fedRows = (f: (n: number, a: 'us' | 'ak' | 'hi') => number, key: 'grossLimit' | 'netLimit' | 'gross165') => [
  ...SIZES.map((n) => [`${n}`, usd(f(n, 'us')), usd(f(n, 'ak')), usd(f(n, 'hi'))]),
  ['Each additional member', `+${usd(sp[key].us[8])}`, `+${usd(sp[key].ak[8])}`, `+${usd(sp[key].hi[8])}`],
];

const WHO: Record<string, string> = {
  all: 'all households',
  'elderly-disabled': 'households with a member 60+ or disabled',
  'non-elderly-disabled': 'other households',
  'dependent-care': 'households paying for dependent care',
  'earned-income': 'households with earnings',
};
const ruleText = (s: StateData) => {
  const b = s.snap.bbce;
  if (!b.length) return 'No BBCE: 130% gross and 100% net';
  if (b.length === 1 && b[0].who === 'all') return `${b[0].grossPct}% for all households`;
  const parts = b.map((x) => `${x.grossPct}% for ${WHO[x.who]}`);
  if (!b.some((x) => x.who === 'all' || x.who === 'non-elderly-disabled')) parts.push('130% and the net test for others');
  return parts.join('; ');
};
const assetText = (s: StateData) => {
  const b = s.snap.bbce;
  const fed = `${usdx(sp.assets.general)}, or ${usdx(sp.assets.elderlyDisabled)} with a member 60+ or disabled`;
  if (!b.length) return fed;
  const lims = [...new Set(b.map((x) => x.assetLimit))];
  const txt = lims.map((l) => (l == null ? 'No limit' : usd(l))).join(' or ');
  return b.some((x) => x.who === 'all' || x.who === 'non-elderly-disabled') ? txt : `${txt} under BBCE; otherwise federal`;
};
const stateRows = STATES.map((s) => [`${s.name}`, ruleText(s), usd(snapGrossState(s.slug, 4)), assetText(s)]);

const withBbce = STATES.filter((s) => s.snap.bbce.length);
const noBbce = STATES.filter((s) => !s.snap.bbce.length).map((s) => s.name);
const at200 = STATES.filter((s) => s.snap.bbce.some((b) => b.who === 'all' && b.grossPct === 200)).length;
const at130 = STATES.filter((s) => s.snap.bbce.some((b) => b.who === 'all' && b.grossPct === 130)).map((s) => s.name);
const noAsset = STATES.filter((s) => s.snap.bbce.length && s.snap.bbce.every((b) => b.assetLimit == null)).length;
// Worked case: a family of four in Pennsylvania (200% line) earning $3,400, against Kansas (no BBCE).
const PAY = 3400;
const pa = snapCalc('pennsylvania', { size: 4, earned: PAY, housing: 1300 });
const ks = snapCalc('kansas', { size: 4, earned: PAY, housing: 1300 });
const txAsset = bbceAll('texas')?.assetLimit ?? 0;

export default definePage({
  id: 'snap-income-limits',
  group: 'food',
  kind: 'pillar',
  order: 20,
  slug: 'snap-income-limits',
  nav: 'SNAP income limits',
  card: `Gross, net and 165% limits for FY ${sp.fy}, with the line each state actually applies`,
  title: `SNAP Income Limits 2027: ${usd(snapGross(4))} a Month for a Family of 4`,
  description: `SNAP income limits for FY ${sp.fy}: ${usd(snapGross(4))} gross and ${usd(snapNet(4))} net a month for 4 people, ${usd(snapGross(1))} gross for one, and the line used in each of the 50 states and DC.`,
  h1: 'SNAP income limits by household size and state',
  intro: `New federal limits apply from ${day(sp.from)}. Most states then raise the gross line, and the table below says by how much.`,
  resume: `A family of four can have up to ${usd(snapGross(4))} a month of gross income and ${usd(snapNet(4))} of net income to qualify for SNAP under the federal rules of fiscal year ${sp.fy}, which run from ${day(sp.from)} to ${day(sp.to)} in the 48 states and DC. For one person the lines are ${usd(snapGross(1))} gross and ${usd(snapNet(1))} net. Gross means pay and other income before taxes; net is what is left after the SNAP deductions for earnings, rent, child care and medical costs. Those are federal floors, set at 130% and 100% of the poverty guideline. ${withBbce.length} states and DC use broad-based categorical eligibility to test gross income at a higher line, up to 200% of poverty in ${at200} of them, and then skip the net test: in those, a family of four can earn up to ${usd(snapGrossState('pennsylvania', 4))} a month. A household with someone aged 60 or older or disabled has no gross test at all and only has to pass the net test. The asset limit, where one still exists, is ${usdx(sp.assets.general)}, or ${usdx(sp.assets.elderlyDisabled)} with an older or disabled member.`,
  tool: 'snap',
  toolProps: { state: 'pennsylvania', size: 4, income: 3000 },
  faqs: [
    { q: 'What is the SNAP income limit for a single person in 2027?', a: `From ${day(sp.from)}, a person living alone in the 48 states or DC can have up to ${usd(snapGross(1))} a month of gross income and ${usd(snapNet(1))} of net income under the federal tests. States that use the 200% line raise the gross limit to ${usd(snapGrossState('california', 1))}. In Alaska the federal gross limit is ${usd(snapGross(1, 'ak'))} and in Hawaii ${usd(snapGross(1, 'hi'))}. A single adult aged 18 to 64 should also check the SNAP work rules.` },
    { q: 'Is the SNAP income limit based on gross or net income?', a: `Both, under federal rules. Gross income, before taxes and deductions, must be at or under 130% of poverty (${usd(snapGross(3))} for three people in fiscal year ${sp.fy}), and net income after deductions must be at or under 100% (${usd(snapNet(3))}). In a state with broad-based categorical eligibility only the gross line counts, set by the state. A household with a member 60+ or disabled only takes the net test.` },
    { q: 'How much can a family of 6 make and still get food stamps?', a: `Up to ${usd(snapGross(6))} a month of gross income under the federal 130% test in fiscal year ${sp.fy}, or ${usd(snapGrossState('pennsylvania', 6))} in states that use 200% of poverty, such as Pennsylvania. Net income must also stay under ${usd(snapNet(6))} where the federal rules apply. A family of six that passes can receive up to ${usd(P.snap.maxAllotment.us[5])} a month, minus 30% of its net income.` },
    { q: 'Can I get SNAP if I have money in a savings account?', a: `In most states, yes. ${noAsset} of the ${withBbce.length} jurisdictions with broad-based categorical eligibility have no asset limit at all for their BBCE households. Under the federal rules that apply elsewhere, countable resources such as cash and bank balances must stay under ${usdx(sp.assets.general)}, or ${usdx(sp.assets.elderlyDisabled)} when a member is 60 or older or disabled, amounts set in the USDA memo for fiscal year ${sp.fy}. A few BBCE states keep their own limit, such as ${usd(txAsset)} in Texas.` },
    { q: 'Why are SNAP income limits higher in Alaska and Hawaii?', a: `Because they follow the poverty guidelines, which HHS sets higher for those two states. For a family of four the federal gross test is ${usd(snapGross(4, 'ak'))} a month in Alaska and ${usd(snapGross(4, 'hi'))} in Hawaii, against ${usd(snapGross(4))} in the other states, all for fiscal year ${sp.fy}. Both states also use the 200% line under broad-based categorical eligibility, which takes Alaska to ${usd(snapGrossState('alaska', 4))} for four.` },
    { q: 'What is the 165% SNAP income limit used for?', a: `It decides whether a person aged 60 or older who cannot buy and cook food because of a permanent disability may form a separate SNAP household from the relatives he or she lives with. The income of those relatives must not exceed 165% of poverty: ${usd(snapGross165(3))} a month for three people in fiscal year ${sp.fy}. It is not a general income limit, and it is used only for that request.` },
    { q: 'If I earn a little over the SNAP gross limit, is there any way to qualify?', a: `Possibly. If someone in the household is 60 or older or receives disability benefits, the gross test does not apply and only net income counts, after deductions for rent, utilities and medical costs above ${usd(sp.medicalThreshold)}. In a state with a 200% line, the federal 130% chart is not the one that matters. Everyone else must pass the gross test first: the agency decides on the income it expects for the coming months.` },
  ],
  body: (h) => `<h2>The three federal limits for fiscal year ${sp.fy}</h2>
<p>USDA publishes three income charts each August in its cost-of-living memo, and the ${h.src('usdaCola27', 'memo of August 21, 2026')} sets the ones used from ${day(sp.from)}. All are monthly amounts. The gross test compares total income before any deduction with 130% of the poverty guideline. The net test compares income after the SNAP deductions with 100% of the guideline. A third chart, at 165%, serves only one special case described further down. The guideline itself is the 2026 HHS figure (${usd(fpl(1))} a year for one person in the 48 states), divided by twelve and rounded, which is why the federal SNAP chart and the ${h.a('fpl-130-percent', '130% of poverty table')} give nearly the same numbers.</p>
${h.table(['Household size', '48 states and DC', 'Alaska', 'Hawaii'], fedRows(snapGross, 'grossLimit'), `Gross monthly income limits (130% of poverty), October 1, 2026, to September 30, 2027. Source: USDA FY ${sp.fy} COLA memo.`, ['l', 'r', 'r', 'r'])}
${h.table(['Household size', '48 states and DC', 'Alaska', 'Hawaii'], fedRows(snapNet, 'netLimit'), `Net monthly income limits (100% of poverty), same period.`, ['l', 'r', 'r', 'r'])}
${h.table(['Household size', '48 states and DC', 'Alaska', 'Hawaii'], fedRows(snapGross165, 'gross165'), `Gross monthly limits for an elderly and disabled person applying as a separate household (165% of poverty), same period.`, ['l', 'r', 'r', 'r'])}
<p>Passing a limit opens the door; it does not fix the amount. The benefit is the maximum allotment minus 30% of net income, explained in ${h.a('snap-benefit-amounts', 'SNAP benefit amounts')}, and the deductions that turn gross into net are listed in ${h.a('snap-deductions', 'SNAP deductions')}.</p>
<h2>The line each state applies</h2>
<p>Broad-based categorical eligibility, or BBCE, lets a state make a household categorically eligible for SNAP because it qualifies for a benefit funded by TANF, often a brochure or a referral service. The state sets the gross line of that benefit, anywhere from 130% to 200% of poverty, and the federal net test and asset test then drop out. ${h.src('fnaBbce', 'USDA\'s BBCE chart')}, updated in June 2026, is the source of the table below. ${noBbce.length} states use no BBCE at all (${listOf(noBbce)}), and ${at130.length} use it while keeping the 130% gross line, which removes the net and asset tests without raising the limit: ${listOf(at130)}. Two states apply it to some households only. Arkansas sets 165% for households with an older or disabled member and 130% for others; New York sets 200% for households paying dependent care and 150% for households with earnings.</p>
${h.table(['State', 'Gross income rule', 'Gross limit, 4 people', 'Asset rule'], stateRows.map((r, i) => [h.a(`state:${STATES[i].slug}`, String(r[0])), r[1], r[2], r[3]]), `Monthly gross limit for a household of four in fiscal year ${sp.fy}: the state's BBCE line when it covers every household, otherwise the federal 130% test.`, ['l', 'l', 'r', 'l'])}
<p>The gap is easy to see on one family. Four people in Pennsylvania earning ${usd(PAY)} a month and paying ${usd(1300)} in rent pass the state's 200% line and would receive an estimated ${usd(pa.benefit)}. The same family in Kansas, which applies federal rules, is under the 130% line of ${usd(snapGross(4))} by ${usd(snapGross(4) - PAY)}, and its net income of ${usd(ks.net)} also clears the ${usd(snapNet(4))} net test, so it gets ${usd(ks.benefit)}. Raise its pay above ${usd(snapGross(4))} and Kansas says no, while Pennsylvania still pays a reduced amount. Each ${h.a('states', 'state page')} gives the full chart with its utility allowance.</p>
<h2>Households with a member 60 or older or disabled</h2>
<p>Federal rules exempt these households from the gross test. The regulation, ${h.src('cfr2739', '7 CFR 273.9(a)')}, says they meet the net income standard only, so a retired couple can have gross income well above the 130% chart and still qualify if rent, utilities and medical bills bring net income under ${usd(snapNet(2))} a month for two. They also keep two deductions others lose: medical costs above ${usd(sp.medicalThreshold)} a month, and a shelter deduction without a cap. In a BBCE state they can use either route, whichever works. The rules are set out in ${h.a('snap-for-seniors', 'SNAP for seniors')}.</p>
<p>The 165% chart serves a narrower case. Under ${h.ext('https://www.ecfr.gov/current/title-7/section-273.1', '7 CFR 273.1(b)(2)')}, a person aged 60 or older who lives with others but cannot buy and prepare meals because of a permanent disability may apply as a separate household with his or her spouse, as long as the others' income does not exceed 165% of poverty, ${usd(snapGross165(2))} a month for two of them.</p>
<h2>Asset limits</h2>
<p>Where the federal test still applies, countable resources such as cash and bank accounts must not exceed ${usdx(sp.assets.general)} per household, or ${usdx(sp.assets.elderlyDisabled)} when at least one member is 60 or older or disabled. The second figure rose from ${usdx(sp.previous.assetsElderlyDisabled)} in fiscal year ${sp.previous.fy}, and the memo notes it also serves as the threshold for substantial lottery or gambling winnings. In ${noAsset} BBCE jurisdictions there is no asset limit at all for households that qualify that way; a handful keep one of their own, shown in the table.</p>
<h2>Reading the charts without mistakes</h2>
<p>Count everyone who buys and cooks food with you, not everyone under the roof: a roommate who shops separately is a different household, while a spouse or a child under 22 living with a parent always counts. Use monthly income before taxes and before Medicare premiums. Irregular pay is averaged by the agency over the months it expects. The limits are the same for working and non-working households; earnings simply get a 20% deduction later, at the net stage. To test your own figures with your state's line and allowance, use the ${h.a('snap-calculator', 'SNAP calculator')} or check the other conditions in ${h.a('snap-eligibility', 'SNAP eligibility')}.</p>`,
  related: ['snap-calculator', 'snap-eligibility', 'snap-deductions', 'fpl-130-percent', 'state:pennsylvania', 'state:kansas'],
  sources: ['usdaCola27', 'fnaBbce', 'cfr2739', 'hhsPoverty'],
  extraSources: [{ name: '7 CFR § 273.1: household concept, including the elderly and disabled separate household rule', url: 'https://www.ecfr.gov/current/title-7/section-273.1' }],
});
