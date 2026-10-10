import { defineStatePage } from '../../lib/page-types';
import { P, sd, STATES, snapCalc, snapGrossState, sua, medLimit, medCheck, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('colorado');
const g = S.snap.bbce[0].grossPct;
const preg = medLimit('colorado', 'pregnant', 2);
const pregMed = S.medicaid.pregnant;
const nPc = STATES.filter((x) => x.medicaid.pregnantChip).length;
const kid = medLimit('colorado', 'child6to18', 3);
const adult = medLimit('colorado', 'adult', 1);
// A pregnant teacher's aide in Grand Junction, household of two counted with the baby, $4,500 a month.
const aide = medCheck('colorado', 'pregnant', 2, 4500);
// A single father of two in Colorado Springs: $2,900 of wages, $1,300 rent, $400 a month of child care.
const dad = snapCalc('colorado', { size: 3, earned: 2900, housing: 1300, dependentCare: 400 });
const dadNoCare = snapCalc('colorado', { size: 3, earned: 2900, housing: 1300 });
const boulder = hudOf('colorado', 'Boulder County', 4);
const denver = hudOf('colorado', 'Denver County', 4);
const elpaso = hudOf('colorado', 'El Paso County', 4);
const pueblo = hudOf('colorado', 'Pueblo County', 4);
const summit = hudOf('colorado', 'Summit County', 4);

export default defineStatePage({
  slug: 'colorado',
  title: 'Colorado Health First and SNAP 2026: CHP+ Covers Pregnancy',
  description: `Colorado 2026: CHP+ covers pregnant women up to ${usd(preg.monthly ?? 0)} a month (${preg.effectivePct}%), SNAP gross limit ${usd(snapGrossState('colorado', 3))} a month for 3 people, Section 8 up to ${usd(S.hud.vli4Max)} in Boulder.`,
  intro: 'Colorado stretches its children\'s plan, CHP+, to pregnant women well above the Medicaid line, and its mountain resort counties carry Denver-level housing limits.',
  resume: `Colorado is one of ${nPc} states in the CMS table that use CHIP to insure pregnant women: Health First Colorado, the state Medicaid program, covers pregnancy to ${pregMed + P.medicaid.disregardPct}% of poverty, and Child Health Plan Plus (CHP+) continues to ${preg.effectivePct}%, about ${usd(preg.monthly ?? 0)} a month for a woman expecting one baby in 2026. Children get the same ${kid.effectivePct}% line, ${usd(kid.monthly ?? 0)} a month for a family of three. Adults are covered under the expansion up to ${usd(adult.monthly ?? 0)} a month for one person. SNAP, run by the Colorado Department of Human Services through the PEAK portal, tests gross income at ${g}% of poverty, ${usd(snapGrossState('colorado', 3))} for three in fiscal year ${P.snap.fy}, with no asset limit. A Colorado Springs father of two earning ${usd(2900)} with ${usd(1300)} rent and ${usd(400)} of child care would get about ${usd(dad.benefit)} a month. Marketplace plans are sold on Connect for Health Colorado.`,
  body: (h) => `<h2>CHP+ for pregnancy, not only for children</h2>
<p>The CMS table gives Colorado two pregnancy columns (${h.src('cmsLevels', 'CMS eligibility levels')}): Medicaid to ${pregMed}% and CHIP to ${S.medicaid.pregnantChip}%, which become ${pregMed + P.medicaid.disregardPct}% and ${preg.effectivePct}% with the MAGI disregard. Only ${nPc} states fill the CHIP column at all; the rest stop at Medicaid. A teacher's aide in Grand Junction who earns ${usd(4500)} a month and is expecting her first child is counted as a household of two; her income is ${Math.round(aide.pctIncome)}% of the guideline, ${aide.eligible ? `inside the CHP+ band, so the pregnancy is covered` : 'above the CHP+ line'}. Under the Medicaid column alone she would be over the limit and pricing a Marketplace plan in the middle of a pregnancy. After the birth, the baby is assessed on its own line. Children use the same CHP+ ceiling once they pass the Medicaid line for their age, which is ${S.medicaid.child6to18 + P.medicaid.disregardPct}% for school-age children.</p>
<p>Adults without a pregnancy follow the expansion line of ${adult.effectivePct}%. Above it, Connect for Health Colorado, the state-based exchange, sells 2026 plans with the ${h.a('aca-subsidy-calculator', 'premium tax credit')}. PEAK is the application portal listed for both Health First Colorado and SNAP.</p>
${h.mini('fplThreshold', { pct: preg.effectivePct })}
<h2>Child care costs in a Colorado SNAP budget</h2>
<p>Colorado's SNAP line is ${g}% of poverty with no savings test, and its utility table is unusual: besides the ${usdx(sua('colorado', 3) ?? 0)} heating and cooling allowance, it lists a flat amount for each single utility and a ${usdx(S.snap.sua[0].phone)} telephone allowance (${h.src('fnaSua', 'USDA SUA table')}). For the Colorado Springs father, the deduction that changes the result is dependent care. His ${usd(400)} of child care comes off income in full, next to the 20% earnings deduction and the ${usd(dad.deductions.standard)} standard deduction, leaving ${usd(dad.adjusted)}. Shelter costs of ${usd(dad.shelterCosts)} then produce an excess of ${usd(dad.excessShelter)}, ${dad.shelterCapped ? `capped at ${usd(dad.deductions.shelter)}` : `all of it deducted`}. Net income is ${usd(dad.net)} and the estimate ${usd(dad.benefit)}. Without the child care receipt the same family would get ${usd(dadNoCare.benefit)}, so reporting that bill is worth ${usd(dad.benefit - dadNoCare.benefit)} a month. The rules are in ${h.a('snap-deductions', 'SNAP deductions')}.</p>
<h2>Resort counties price like Denver</h2>
<p>Colorado's very low income limit for four tops out at ${usd(boulder.vli)} in Boulder County. Summit County reaches ${usd(summit.vli)} and the Denver metro counties share ${usd(denver.vli)}, while El Paso County, around Colorado Springs, is at ${usd(elpaso.vli)} and Pueblo County at ${usd(pueblo.vli)}, the same floor as ${S.hud.vli4MinName} and most rural counties. Neighbors make useful contrasts: ${h.a('state:wyoming', 'Wyoming')} and ${h.a('state:kansas', 'Kansas')} did not expand Medicaid, and ${h.a('state:utah', 'Utah')} keeps the federal SNAP tests.</p>`,
  faqs: [
    { q: 'What is the income limit for CHP+ in Colorado for a pregnant woman?', a: `Up to ${preg.effectivePct}% of the poverty guideline with the disregard, about ${usd(preg.monthly ?? 0)} a month for a pregnant woman counted as a household of two in 2026. Below ${pregMed + P.medicaid.disregardPct}%, Health First Colorado covers the pregnancy instead. The levels come from the CMS table of state eligibility; Colorado covers pregnancy through CHIP above the Medicaid line.` },
    { q: 'What is the SNAP income limit in Colorado for a family of 3?', a: `${usd(snapGrossState('colorado', 3))} of gross monthly income in fiscal year ${P.snap.fy}, which is ${g}% of the 2026 poverty guideline. Colorado uses broad-based categorical eligibility, so there is no asset test. The amount received depends on net income after deductions for earnings, child care, child support paid and shelter costs above half of income.` },
    { q: 'Did Colorado expand Medicaid?', a: `Yes. Colorado covers adults 19 to 64 up to ${adult.effectivePct}% of the poverty guideline under the ACA expansion, about ${usd(adult.monthly ?? 0)} a month for one person in 2026, according to the CMS table. The program is called Health First Colorado. Children and pregnant women are covered higher, to ${kid.effectivePct}% through CHP+.` },
    { q: 'What is the Section 8 income limit in Denver, Colorado?', a: `For fiscal year 2026, a family of four in Denver County is very low income up to ${usd(denver.vli)} a year and extremely low income up to ${usd(denver.eli)}. Boulder County has the highest Colorado limit, ${usd(boulder.vli)}. HUD limits took effect on ${day(P.hud.effective)}; the local housing authority manages the voucher list.` },
  ],
  related: ['state:wyoming', 'state:kansas', 'state:utah', 'state:new-mexico', 'snap-deductions', 'medicaid-income-limits'],
});
