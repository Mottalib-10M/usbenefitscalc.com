import { defineStatePage } from '../../lib/page-types';
import { P, sd, STATES, snapCalc, snapGrossState, snapNet, medLimit, medCheck, sua, hudOf, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('south-carolina');
const g = S.snap.bbce[0].grossPct;
const hc = sua('south-carolina', 3) ?? 0;
const nNon = STATES.filter((x) => !x.medicaid.expansion).length;
const par = medLimit('south-carolina', 'parent', 3);
const kid = medLimit('south-carolina', 'child6to18', 3);
const preg = medLimit('south-carolina', 'pregnant', 2);
// A 62-year-old grandmother in Columbia raising two grandchildren: $1,400 of Social Security, $750 rent, power bill.
const ex = snapCalc('south-carolina', { size: 3, unearned: 1400, elderlyDisabled: true, housing: 750 });
const gran = medCheck('south-carolina', 'parent', 3, 1400);
const kids = medCheck('south-carolina', 'child6to18', 3, 1400);
const gapIncome = 1000;
const credit1 = fplAt(1, P.aca.minPct, 'us', 2025);
const chs = hudOf('south-carolina', 'Charleston County', 4);
const rich = hudOf('south-carolina', 'Richland County', 4);
const gvl = hudOf('south-carolina', 'Greenville County', 4);
const horry = hudOf('south-carolina', 'Horry County', 4);

export default defineStatePage({
  slug: 'south-carolina',
  title: `South Carolina Medicaid and SNAP 2026: Parents Under ${par.effectivePct}%`,
  description: `South Carolina in 2026: no Medicaid expansion, parents covered only to ${usd(par.monthly ?? 0)} a month for 3, children to ${kid.effectivePct}% of poverty, SNAP gross limit ${usd(snapGrossState('south-carolina', 3))} for 3.`,
  intro: `One of the ${nNon} states that have not adopted the Medicaid expansion: a parent here loses coverage at roughly two-thirds of the poverty line.`,
  resume: `South Carolina has not expanded Medicaid, so the line that matters most for working adults is the one for parents and caretaker relatives: ${par.effectivePct}% of the poverty guideline with the disregard, about ${usd(par.monthly ?? 0)} a month for a family of three in 2026, and nothing at all for adults without children at home. Children are covered far higher, up to ${kid.effectivePct}% (${usd(kid.monthly ?? 0)} a month for three), and pregnant women up to ${preg.effectivePct}%. SNAP is run by the South Carolina Department of Social Services with the federal 130% gross test and no asset limit, ${usd(snapGrossState('south-carolina', 3))} a month for three in fiscal year ${P.snap.fy}. A 62-year-old grandmother in Columbia raising two grandchildren on ${usd(1400)} of Social Security, with ${usd(750)} in rent, would get about ${usd(ex.benefit)} a month in SNAP, and her income is low enough for Medicaid as their caretaker.`,
  body: (h) => `<h2>Who falls between Medicaid and the marketplace in South Carolina</h2>
<p>In the ${h.src('cmsLevels', 'CMS table of eligibility levels')}, South Carolina covers parents up to ${par.pct}% of the poverty guideline, ${par.effectivePct}% once the 5% disregard is added, and lists no group for adults 19 to 64 without dependent children. CMS also notes a section 1115 demonstration that covers some additional low-income adults, with limits; the Department of Health and Human Services decides who fits it. Two consequences follow. A mother of two who earns more than ${usd(par.monthly ?? 0)} a month leaves Medicaid while her children stay. And a single adult earning ${usd(gapIncome)} a month, ${usd(gapIncome * 12)} a year, is below the ${usd(credit1)} floor of the ${h.a('aca-subsidy-calculator', 'premium tax credit')} on HealthCare.gov: no Medicaid, no subsidy. That is the coverage gap described in ${h.a('medicaid-expansion-states', 'Medicaid expansion states')}. From ${usd(credit1)} upward, the same adult can buy a subsidized plan.</p>
${h.mini('coverageGap')}
<h2>A grandmother raising two grandchildren</h2>
<p>Caretaker relatives count as parents for Medicaid, which helps the Columbia grandmother. Her ${usd(1400)} a month puts the household of three at ${Math.round(gran.pctIncome)}% of poverty, ${gran.eligible ? `under the ${usd(gran.monthly ?? 0)} line, so she qualifies` : `above the ${usd(gran.monthly ?? 0)} line`}, and the grandchildren ${kids.eligible ? 'qualify easily' : 'do not'}. Social Security counts as income under MAGI rules for her.</p>
<p>For SNAP her age matters. At 62 she is treated as an elderly member, so the household skips the gross income test, the ${usd(P.snap.shelterCap.us)} cap on the shelter deduction no longer applies, and medical bills above ${usd(P.snap.medicalThreshold)} a month would be deductible too. Rent plus South Carolina's heating and cooling allowance of ${usdx(hc)} makes ${usd(ex.shelterCosts)}; after the standard deduction of ${usd(ex.deductions.standard)}, the shelter deduction is ${usd(ex.deductions.shelter)} and net income ${usd(ex.net)}, below the ${usd(snapNet(3))} net limit. The estimate: ${usd(ex.benefit)} of the ${usd(ex.maxAllotment)} maximum for three. South Carolina's allowance is among the lower ones in the ${h.src('fnaSua', 'USDA table')}, which trims the deduction for households that pay their own power bill. The ${h.a('snap-calculator', 'SNAP calculator')} handles other cases.</p>
<h2>Charleston's limits and the rest of the state</h2>
<p>HUD splits South Carolina's ${S.hud.rows} counties into ${S.hud.areas} areas. The very low income limit for four is highest in the Charleston metro area, ${usd(chs.vli)} in both Charleston County and ${S.hud.vli4MaxName}. Greenville County follows at ${usd(gvl.vli)}, Richland County (Columbia) at ${usd(rich.vli)} and Horry County, around Myrtle Beach, at ${usd(horry.vli)}. ${S.hud.vli4MinName} has the lowest limit, ${usd(S.hud.vli4Min)}.</p>
<p>${h.a('state:north-carolina', 'North Carolina')} expanded Medicaid and tests SNAP at 200%; ${h.a('state:georgia', 'Georgia')} shares South Carolina's 130% SNAP line and has not expanded either.</p>`,
  faqs: [
    { q: 'Did South Carolina expand Medicaid?', a: `No. South Carolina is one of the ${nNon} states without the ACA expansion in the CMS table. Parents and caretaker relatives qualify up to ${par.effectivePct}% of the poverty guideline, about ${usd(par.monthly ?? 0)} a month for a family of three, and adults without children have no regular income-based group. CMS notes a limited section 1115 demonstration for some additional low-income adults.` },
    { q: 'What is the income limit for food stamps in South Carolina for a family of 3?', a: `${usd(snapGrossState('south-carolina', 3))} a month of gross income in fiscal year ${P.snap.fy}, which is 130% of the 2026 poverty guideline. South Carolina has no SNAP asset limit, because every household is covered by broad-based categorical eligibility. A household with a member aged 60 or over or disabled skips that gross test and only has to pass the net income limit of ${usd(snapNet(3))}.` },
    { q: 'How much can a family make for Medicaid for kids in South Carolina?', a: `Children qualify for Medicaid up to ${kid.effectivePct}% of the 2026 poverty guideline with the 5% disregard, about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('south-carolina', 'child6to18', 4).monthly ?? 0)} for four. That line is the same for babies, toddlers and teenagers, according to the CMS table, and income is counted under MAGI rules.` },
    { q: 'What is the Section 8 income limit in Charleston, SC?', a: `In Charleston County a family of four qualifies as very low income up to ${usd(chs.vli)} a year for fiscal year 2026, and as extremely low income up to ${usd(chs.eli)}. These are the highest limits in South Carolina, shared with ${S.hud.vli4MaxName}. At least ${P.hud.elisShareOfNewVouchers}% of new vouchers must go to extremely low income families. The limits took effect on May 1, 2026.` },
  ],
  related: ['state:north-carolina', 'state:georgia', 'medicaid-expansion-states', 'aca-subsidy-calculator', 'snap-for-seniors', 'section-8-income-limits'],
});
