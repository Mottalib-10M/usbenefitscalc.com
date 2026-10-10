import { definePage } from '../../lib/page-types';
import { P, STATES, fpl, fplAt, snapGross, snapNet, snapGrossState, snapCalc, usd, day, listOf } from '../../lib/kit';

const G = P.snap.grossLimit;
const rows = [
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => [`${n}`, `<strong>${usd(snapGross(n))}</strong>`, usd(snapGross(n, 'ak')), usd(snapGross(n, 'hi')), usd(fplAt(n, 130))]),
  ['Each additional person', `+${usd(G.us[8])}`, `+${usd(G.ak[8])}`, `+${usd(G.hi[8])}`, `+${usd(fplAt(2, 130) - fplAt(1, 130))}`],
];
const at130 = STATES.filter((s) => s.snap.bbce.some((b) => b.who === 'all' && b.grossPct === 130)).map((s) => s.name);
const at130Assets = STATES.flatMap((s) => s.snap.bbce.filter((b) => b.who === 'all' && b.grossPct === 130 && b.assetLimit != null).map((b) => `${usd(b.assetLimit as number)} in ${s.name}`));
const noBbce = STATES.filter((s) => !s.snap.bbce.length).map((s) => s.name);
const nHigher = STATES.filter((s) => s.slug !== 'district-of-columbia' && s.snap.bbce.some((b) => b.who === 'all' && b.grossPct > 130)).length;
// A family of three earning $3,000 a month gross, paying $1,000 rent: Ohio (130%) against California (200%).
const oh = snapCalc('ohio', { size: 3, earned: 3000, housing: 1000 });
const ca = snapCalc('california', { size: 3, earned: 3000, housing: 1000 });

export default definePage({
  id: 'fpl-130-percent',
  group: 'poverty',
  kind: 'threshold',
  order: 210,
  slug: '130-percent-federal-poverty-level',
  nav: '130% of the poverty level',
  card: `The federal SNAP gross income test: ${usd(snapGross(1))} a month for one person from October 2026`,
  title: `130% of Poverty Level 2026: ${usd(snapGross(1))} a Month for SNAP`,
  description: `130% of the poverty level in 2026 is ${usd(fplAt(1, 130))} a year for one person, ${usd(fplAt(4, 130))} for four: SNAP's gross income test, ${usd(snapGross(4))} a month for four since October 2026.`,
  h1: '130% of the federal poverty level: the SNAP gross income line',
  intro: 'The percentage written into the Food and Nutrition Act, and the real ceiling for food stamps in the states that never raised it.',
  resume: `130% of the 2026 federal poverty level is ${usd(fplAt(1, 130))} a year for one person and ${usd(fplAt(4, 130))} for a family of four in the 48 states and DC. Its main use is SNAP: a household without an elderly or disabled member must have gross monthly income at or below 130% of the guideline. USDA's limits for fiscal year ${P.snap.fy}, in force from ${day(P.snap.from)} to ${day(P.snap.to)}, are ${usd(snapGross(1))} a month for one person, ${usd(snapGross(3))} for three and ${usd(snapGross(4))} for four, with higher figures in Alaska and Hawaii. The test counts income before taxes and before any SNAP deduction. ${nHigher} states and DC use broad-based categorical eligibility to raise the line for every household; 130% stays the effective ceiling in states that kept it, such as ${listOf(at130.slice(0, 3))}, and in the ${noBbce.length} states with no such option. Passing it is not the end: net income, after deductions, must also stay under 100% of the guideline in those states.`,
  mini: 'fplThreshold',
  miniArg: { pct: 130 },
  faqs: [
    { q: 'What is 130 percent of the poverty level for a family of 3?', a: `${usd(fplAt(3, 130))} a year in 2026 in the 48 states and DC, which is 130% of the ${usd(fpl(3))} guideline. For SNAP, USDA divides it by 12 and rounds up, giving a gross income limit of ${usd(snapGross(3))} a month for fiscal year ${P.snap.fy}. In Alaska the SNAP limit for three is ${usd(snapGross(3, 'ak'))} and in Hawaii ${usd(snapGross(3, 'hi'))}.` },
    { q: 'Which states still use 130% of poverty for food stamps?', a: `Among states with broad-based categorical eligibility, ${listOf(at130)} keep the gross test at 130% for every household. ${listOf(noBbce)} have no such option at all, so the federal 130% test applies along with the net income test and an asset limit of ${usd(P.snap.assets.general)}. Everywhere else most households get a higher line, often 200%.` },
    { q: 'Do seniors have to pass the 130% SNAP income test?', a: `No. A household with a member who is 60 or older or disabled skips the gross income test and only has to meet the net income test, 100% of the guideline: ${usd(snapNet(1))} a month for one person and ${usd(snapNet(2))} for two in fiscal year ${P.snap.fy}. Its medical costs above ${usd(P.snap.medicalThreshold)} a month and uncapped shelter costs are deducted before that test, which helps many retirees pass.` },
  ],
  body: (h) => `<h2>What the 130% test measures</h2>
<p>The gross income test is the first gate of SNAP, set out in ${h.src('cfr2739', '7 CFR 273.9')}: add the monthly income of everyone who buys and prepares food together, before taxes and before any deduction, and compare it with 130% of the poverty guideline for that household size. Wages, Social Security, SSI, unemployment and most other cash count. If the total is above the line, the household is out, whatever its rent or child care costs. That is what sets 130% apart from the net income test, which comes after the deductions and stops at 100%.</p>
<p>USDA publishes the dollar figures once a year in its ${h.src('usdaCola27', 'cost-of-living memo')}, based on the HHS guidelines of the same calendar year, ${usd(fpl(1))} for one person in 2026. The monthly limit is the guideline times 1.3, divided by 12 and rounded up to the next dollar.</p>
<h2>The fiscal year ${P.snap.fy} limits at 130%</h2>
${h.table(['Household size', 'SNAP gross limit, 48 states and DC (month)', 'Alaska (month)', 'Hawaii (month)', '130% per year, 48 states'], rows, `SNAP gross monthly income limits, ${day(P.snap.from)} to ${day(P.snap.to)}, and 130% of the 2026 HHS guideline per year.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>A raise that costs food stamps in one state and not in the next</h2>
<p>A family of three with ${usd(3000)} of monthly earnings and ${usd(1000)} of rent shows what the line does. In Ohio, which keeps the gross test at 130%, the family is ${usd(3000 - snapGross(3))} above the ${usd(snapGross(3))} limit and gets nothing, even though its net income after deductions would be modest. In California, where the state's broad-based categorical eligibility raises the gross line to ${usd(snapGrossState('california', 3))}, the same family is eligible for an estimated ${usd(ca.benefit)} a month${oh.eligible ? '' : ' while the Ohio family is refused'}. Nothing about the household differs except the state.</p>
<p>That is the reason the 130% figure matters most in the states that never adopted a higher option. The ${noBbce.length} states listed by USDA without broad-based categorical eligibility, ${listOf(noBbce)}, apply 130% gross, 100% net and an asset limit of ${usd(P.snap.assets.general)}, or ${usd(P.snap.assets.elderlyDisabled)} when a member is elderly or disabled. Another group adopted the option but kept the gross line at 130%: ${listOf(at130)}. There, the option changes the asset rule rather than the income line: no asset limit at all in most of them, ${listOf(at130Assets)}.</p>
<h2>Households that do not face the 130% line</h2>
<p>Households with someone aged 60 or more or with a disability skip the gross test entirely, as ${h.src('fnaBbce', "USDA's broad-based categorical eligibility page")} reminds states, and go straight to the net test. Everyone else at the edge of 130% should check two things: whether the state uses a higher line, shown on each ${h.a('states', 'state page')}, and whether the income really counts, since some payments are excluded. The ${h.a('snap-income-limits', 'SNAP income limits')} page lists the line of every state, and the ${h.a('snap-calculator', 'SNAP calculator')} applies the tests in order. For the poverty guidelines themselves, see the ${h.a('federal-poverty-level', 'federal poverty level')}.</p>`,
  related: ['snap-income-limits', 'snap-calculator', 'federal-poverty-level', 'fpl-200-percent', 'snap-for-seniors'],
  sources: ['usdaCola27', 'cfr2739', 'fnaBbce', 'hhsPoverty'],
});
