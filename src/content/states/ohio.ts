import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, snapGross, medLimit, medCheck, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('ohio');
const b = S.snap.bbce[0];
const hc = sua('ohio', 1) ?? 0;
const kid = medLimit('ohio', 'child6to18', 4);
const preg = medLimit('ohio', 'pregnant', 2);
const adult = medLimit('ohio', 'adult', 1);
// A single warehouse worker in Columbus (Franklin County): $1,700 of wages, $850 rent with a gas heating bill, $8,000 saved.
const ex = snapCalc('ohio', { size: 1, earned: 1700, housing: 850, assets: 8000 });
const exRaise = snapCalc('ohio', { size: 1, earned: 1800, housing: 850 });
// A mother of three in Cleveland earning $4,300 a month: are the children still covered?
const kids4 = medCheck('ohio', 'child6to18', 4, 4300);
const mom4 = medCheck('ohio', 'adult', 4, 4300);
const franklin = hudOf('ohio', 'Franklin County', 4);
const cuyahoga = hudOf('ohio', 'Cuyahoga County', 4);
const hamilton = hudOf('ohio', 'Hamilton County', 4);

export default defineStatePage({
  slug: 'ohio',
  title: `Ohio Food Stamps and Medicaid 2026: ${b.grossPct}% Test, No Asset Cap`,
  description: `Ohio SNAP in 2026: gross income under ${usd(snapGrossState('ohio', 3))} a month for 3 people, no asset limit, a ${usdx(hc)} heating allowance, and children's Medicaid up to ${kid.effectivePct}% of poverty.`,
  intro: 'Ohio removed the SNAP savings test but kept the strict 130% income line, so earnings matter far more than a bank balance here.',
  resume: `Ohio SNAP is decided almost entirely by income: the state uses broad-based categorical eligibility to drop the asset test, yet it keeps the gross income line at ${b.grossPct}% of the poverty guideline, ${usd(snapGrossState('ohio', 1))} a month for one person and ${usd(snapGrossState('ohio', 3))} for three in fiscal year ${P.snap.fy}. A single worker in Columbus earning ${usd(1700)} and paying ${usd(850)} in rent, with ${usd(8000)} in savings, still qualifies for about ${usd(ex.benefit)} a month, helped by Ohio's heating and cooling allowance of ${usdx(hc)}; a raise to ${usd(1800)} would end the benefit. The Ohio Department of Job and Family Services runs the program. On health coverage Ohio took the Medicaid expansion, so adults qualify up to ${adult.effectivePct}% of poverty (${usd(adult.monthly ?? 0)} a month alone), children up to ${kid.effectivePct}% and pregnant women up to ${preg.effectivePct}%, all handled by the Ohio Department of Medicaid.`,
  body: (h) => `<h2>A savings account does not count, a small raise does</h2>
<p>Most states that switch off the SNAP asset test also raise the gross income line, often to 200% of poverty. Ohio did only the first half. Its broad-based rule, listed in the ${h.src('fnaBbce', 'USDA chart of state options')}, waives the ${usdx(P.snap.assets.general)} resource limit for every household while the gross test stays at ${b.grossPct}%, the same ${usd(snapGross(1))} a month for one person that a state without the option would apply. The net income test is skipped for households that pass that gross line.</p>
<p>Take the Columbus worker from the summary. ${usd(1700)} of wages sits ${usd(ex.grossLimit - ex.gross)} below the limit. After the 20% earned income deduction (${usd(ex.deductions.earned)}), the standard deduction (${usd(ex.deductions.standard)}) and a shelter deduction that hits the ${usd(P.snap.shelterCap.us)} cap once rent and the ${usdx(hc)} allowance are added, net income comes to ${usd(ex.net)}, and the estimate is ${usd(ex.benefit)} of the ${usd(ex.maxAllotment)} maximum. The ${usd(8000)} in the bank changes nothing. Raise the paycheck to ${usd(1800)}, though, and gross income passes ${usd(exRaise.grossLimit)}: the result drops to ${usd(exRaise.benefit)}, with no phase-out in between. A worker close to the line should report income carefully and ask the county office how overtime months are averaged. Run your own numbers with the ${h.a('snap-calculator', 'SNAP calculator')}.</p>
<p>Two groups escape the cliff under federal rules. A household with a member aged 60 or older or disabled skips the gross test and is judged on net income, and a household where everyone receives SSI or TANF cash is eligible by that fact alone.</p>
<h2>Medicaid lines that run high for children</h2>
<p>Ohio lists no separate CHIP name: children are covered through Medicaid up to ${kid.pct}% of the guideline, ${kid.effectivePct}% once the 5% disregard is added. Picture a Cleveland mother of three earning ${usd(4300)} a month. Her household of four sits at ${Math.round(kids4.pctIncome)}% of poverty, so the children ${kids4.eligible ? 'remain eligible' : 'are over the line'}, while she ${mom4.eligible ? 'qualifies too' : `does not, the adult line being ${usd(mom4.monthly ?? 0)} a month for four`}. Her coverage then comes from HealthCare.gov, the marketplace Ohio uses for 2026, with the ${h.a('aca-subsidy-calculator', 'premium tax credit')} calculated on the 2025 guideline. Pregnancy coverage reaches ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for a woman expecting one child.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>From Union County to the Ohio Valley</h2>
<p>HUD spreads Ohio's ${S.hud.rows} counties over ${S.hud.areas} areas. The very low income limit for four peaks at ${usd(S.hud.vli4Max)} in ${S.hud.vli4MaxName}, northwest of Columbus, and bottoms out at ${usd(S.hud.vli4Min)} in ${S.hud.vli4MinName}, which HUD groups with Wheeling across the river. The three big metros land in between: ${usd(franklin.vli)} in Franklin County (Columbus), ${usd(hamilton.vli)} in Hamilton County (Cincinnati) and ${usd(cuyahoga.vli)} in Cuyahoga County (Cleveland). Applications go to the local public housing agency, not to the state.</p>
<p>Every neighbor drew the SNAP line differently: ${h.a('state:pennsylvania', 'Pennsylvania')}, ${h.a('state:michigan', 'Michigan')} and ${h.a('state:kentucky', 'Kentucky')} test income at ${sd('kentucky').snap.bbce[0].grossPct}%, and ${h.a('state:indiana', 'Indiana')} matches Ohio's ${b.grossPct}% but keeps a ${usdx(sd('indiana').snap.bbce[0].assetLimit ?? 0)} asset limit.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in Ohio?', a: `For fiscal year ${P.snap.fy}, Ohio caps gross monthly income at ${b.grossPct}% of the poverty guideline: ${usd(snapGrossState('ohio', 1))} for one person, ${usd(snapGrossState('ohio', 2))} for two, ${usd(snapGrossState('ohio', 3))} for three and ${usd(snapGrossState('ohio', 4))} for four. There is no asset limit. Households with a member 60 or older or disabled are measured on net income instead, after deductions for rent, utilities and medical bills.` },
    { q: 'Does Ohio count savings for SNAP?', a: `No. Ohio applies broad-based categorical eligibility to every household, which removes the federal resource limit of ${usdx(P.snap.assets.general)}. A bank account, a car or a retirement fund does not affect eligibility. Income still has to be under ${b.grossPct}% of poverty, ${usd(snapGrossState('ohio', 1))} a month for a single person, according to the USDA chart of state options dated June 2026.` },
    { q: 'Did Ohio expand Medicaid?', a: `Yes. Ohio covers adults aged 19 to 64 under the ACA expansion up to ${adult.effectivePct}% of the poverty guideline with the disregard, about ${usd(adult.monthly ?? 0)} a month for one person in 2026, according to the CMS table of state eligibility levels. Above that line, adults buy coverage on HealthCare.gov with the premium tax credit. Children qualify for Medicaid up to ${kid.effectivePct}%.` },
    { q: 'How much is the Section 8 income limit in Columbus, Ohio?', a: `Columbus is in Franklin County, where a family of four qualifies as very low income, the usual Housing Choice Voucher line, up to ${usd(franklin.vli)} a year for fiscal year 2026, and as extremely low income up to ${usd(franklin.eli)}. The limits took effect on May 1, 2026. The Columbus area housing authority decides who comes off its waiting list and when.` },
  ],
  related: ['state:pennsylvania', 'state:michigan', 'state:kentucky', 'state:indiana', 'snap-calculator', 'section-8-income-limits'],
});
