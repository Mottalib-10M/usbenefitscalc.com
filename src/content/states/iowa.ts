import { defineStatePage } from '../../lib/page-types';
import { P, sd, STATES, snapCalc, snapGrossState, snapGross, snapNet, sua, medLimit, medCheck, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('iowa');
const g = S.snap.bbce[0].grossPct;
const sameG = STATES.filter((x) => x.snap.bbce.some((r) => r.grossPct === g)).length;
const preg = medLimit('iowa', 'pregnant', 2);
const baby = medLimit('iowa', 'infant', 3);
const kid = medLimit('iowa', 'child6to18', 3);
const adult = medLimit('iowa', 'adult', 1);
// A pregnant nurse in Cedar Rapids, counted as two, earning $6,000 a month.
const nurse = medCheck('iowa', 'pregnant', 2, 6000);
// Two parents and two children in Des Moines: $3,700 of wages, $1,050 rent, $300 of child care.
const ex = snapCalc('iowa', { size: 4, earned: 3700, housing: 1050, dependentCare: 300 });
const exNoCare = snapCalc('iowa', { size: 4, earned: 3700, housing: 1050 });
const story = hudOf('iowa', 'Story County', 4);
const johnson = hudOf('iowa', 'Johnson County', 4);
const polk = hudOf('iowa', 'Polk County', 4);
const linn = hudOf('iowa', 'Linn County', 4);
const blackhawk = hudOf('iowa', 'Black Hawk County', 4);

export default defineStatePage({
  slug: 'iowa',
  title: `Iowa Food Assistance and Medicaid 2026: ${g}% SNAP Line`,
  description: `Iowa 2026: Medicaid for babies to ${baby.effectivePct}% and pregnancy to ${preg.effectivePct}% of poverty, Hawki to ${kid.effectivePct}%, Food Assistance (SNAP) gross limit ${usd(snapGrossState('iowa', 4))} a month for 4 at ${g}%.`,
  intro: `Iowa runs SNAP, called Food Assistance, at a ${g}% gross line no other state uses, and lowered its Medicaid line for pregnancy in 2025.`,
  resume: `Iowa's Medicaid line for babies under one is ${baby.effectivePct}% of the poverty guideline with the disregard, ${usd(baby.monthly ?? 0)} a month for a family of three with a newborn, while pregnant women now qualify up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month counted as two, after the state's own income guidelines lowered the pregnancy line in April 2025. Older children are covered by Medicaid and then Hawki, the state CHIP, up to ${kid.effectivePct}%. Iowa also expanded Medicaid for adults, to ${usd(adult.monthly ?? 0)} a month for one person. SNAP, which the Department of Health and Human Services calls Food Assistance, tests gross income at ${g}% of poverty, ${usd(snapGrossState('iowa', 4))} a month for four in fiscal year ${P.snap.fy}, with no asset limit. A Des Moines family of four earning ${usd(3700)} with ${usd(1050)} rent and ${usd(300)} of child care would receive about ${usd(ex.benefit)} a month, an amount the federal ${usd(snapGross(4))} line would have ruled out.`,
  body: (h) => `<h2>Pregnancy at ${preg.effectivePct}%, babies at ${baby.effectivePct}%</h2>
<p>The CMS table of December 2023 showed Iowa with the highest pregnancy line of any state. Iowa's Department of Health and Human Services now publishes lower figures: ${S.medicaid.pregnant}% of poverty for pregnant women and ${S.medicaid.child0to1}% for infants, before the 5% disregard, in force from April 1, 2025 (${h.ext(S.medicaid.update?.sources[0]?.url ?? 'https://hhs.iowa.gov/', 'Iowa HHS income guidelines')}). A nurse in Cedar Rapids who earns ${usd(6000)} a month and is expecting her first baby is at ${Math.round(nurse.pctIncome)}% of the guideline for two and ${nurse.eligible ? 'qualifies for Medicaid during the pregnancy' : 'is above the pregnancy line, so she would buy a Marketplace plan with the premium tax credit'}. Once born, the baby has a higher line than the mother had, ${baby.effectivePct}% until the first birthday. After that, Medicaid covers children to ${S.medicaid.child1to5 + P.medicaid.disregardPct}%, and Hawki, for ages ${S.medicaid.chipAges ?? '1 up to 19'}, continues to ${kid.effectivePct}%, ${usd(kid.monthly ?? 0)} a month for a family of three. The family's income is measured each time with MAGI rules.</p>
<p>Adults outside pregnancy are covered under the expansion to ${adult.effectivePct}%; Iowa's old parent standard, a dollar amount CMS converts to ${S.medicaid.parent}%, no longer sets the limit for parents. Above Medicaid, Iowans use HealthCare.gov and the ${h.a('aca-subsidy-calculator', 'premium tax credit')}.</p>
${h.mini('fplThreshold', { pct: preg.effectivePct })}
<h2>Food Assistance at ${g}% of poverty</h2>
<p>The USDA chart lists ${sameG === 1 ? 'only Iowa' : `${sameG} states`} at ${g}% (${h.src('fnaBbce', 'USDA BBCE chart')}), between the federal 130% and the 165% used by Illinois. For four people, the Iowa line is ${usd(snapGrossState('iowa', 4))}, against ${usd(snapGross(4))} under federal rules. The Des Moines family's ${usd(ex.gross)} of wages falls between the two. Its deductions: ${usd(ex.deductions.earned)} for earnings, ${usd(ex.deductions.standard)} standard, ${usd(ex.deductions.dependentCare)} of child care, leaving ${usd(ex.adjusted)}. Rent plus the ${usdx(sua('iowa', 4) ?? 0)} utility allowance is ${usd(ex.shelterCosts)}, and ${usd(ex.deductions.shelter)} of it is deducted. Net income is ${usd(ex.net)} and the benefit ${usd(ex.benefit)} out of ${usd(ex.maxAllotment)}. Categorical eligibility spares the family the ${usd(snapNet(4))} net test. Without the child care bill on file the estimate would be ${usd(exNoCare.benefit)}: each dollar of care is worth about ${Math.round(((ex.benefit - exNoCare.benefit) / 300) * 100)} cents of benefit here, because lowering income also enlarges the shelter deduction. More in ${h.a('snap-deductions', 'SNAP deductions')}.</p>
<h2>Ames and Iowa City lead the HUD table</h2>
<p>Story County, home to Ames, has Iowa's highest very low income limit for four, ${usd(story.vli)}, just ahead of Johnson County, around Iowa City, at ${usd(johnson.vli)}. Polk County and the Des Moines metro share ${usd(polk.vli)}; Linn County, around Cedar Rapids, is at ${usd(linn.vli)}. Black Hawk County, home to Waterloo, sits at ${usd(blackhawk.vli)}, the same floor as ${S.hud.vli4MinName} and most rural counties. For comparison, see ${h.a('state:illinois', 'Illinois')}, ${h.a('state:nebraska', 'Nebraska')} and ${h.a('state:minnesota', 'Minnesota')}.</p>`,
  faqs: [
    { q: 'What is the income limit for Food Assistance in Iowa?', a: `For fiscal year ${P.snap.fy}, Iowa tests gross monthly income at ${g}% of the poverty guideline: ${usd(snapGrossState('iowa', 1))} for one person, ${usd(snapGrossState('iowa', 3))} for three and ${usd(snapGrossState('iowa', 4))} for four. There is no asset limit, according to the USDA chart. The Iowa Department of Health and Human Services then computes the benefit from net income.` },
    { q: 'How much can a pregnant woman make for Medicaid in Iowa?', a: `Up to ${preg.effectivePct}% of the poverty guideline with the disregard, about ${usd(preg.monthly ?? 0)} a month for a pregnant woman counted as a household of two in 2026, or ${usd(medLimit('iowa', 'pregnant', 3).monthly ?? 0)} for three. Iowa set that level on April 1, 2025, below the old line in the CMS table. The baby is then covered to ${baby.effectivePct}% until age one.` },
    { q: 'What is the income limit for Hawki in Iowa?', a: `Hawki, Iowa's CHIP, covers children aged one to eighteen up to ${kid.effectivePct}% of the poverty guideline, about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('iowa', 'child6to18', 4).monthly ?? 0)} for four in 2026, according to the CMS table. Children under the Medicaid line for their age are on Medicaid instead.` },
    { q: 'What is the Section 8 income limit in Des Moines, Iowa?', a: `For fiscal year 2026, a family of four in Polk County, which includes Des Moines, is very low income up to ${usd(polk.vli)} a year and extremely low income up to ${usd(polk.eli)}. The highest Iowa limit is ${usd(story.vli)} in Story County. HUD limits took effect on ${day(P.hud.effective)}.` },
  ],
  related: ['state:illinois', 'state:nebraska', 'state:minnesota', 'state:missouri', 'snap-deductions', 'medicaid-eligibility'],
});
