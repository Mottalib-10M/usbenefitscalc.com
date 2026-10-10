import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, sua, hudOf, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('pennsylvania');
const g = S.snap.bbce[0].grossPct;
const hc = sua('pennsylvania', 4) ?? 0;
const phone = S.snap.sua[0].phone ?? 0;
const lv = S.medicaid;
const chip4 = medLimit('pennsylvania', 'child6to18', 4);
const baby = medLimit('pennsylvania', 'infant', 4);
const preg = medLimit('pennsylvania', 'pregnant', 2);
const adult = medLimit('pennsylvania', 'adult', 1);
// Two parents and two children in Pittsburgh (Allegheny County): $3,900 of wages, $400 of daycare, $1,200 rent with gas heat.
const ex = snapCalc('pennsylvania', { size: 4, earned: 3900, housing: 1200, dependentCare: 400 });
const exNoCare = snapCalc('pennsylvania', { size: 4, earned: 3900, housing: 1200 });
// The same family after a raise to $5,800 a month.
const kidsRaise = medCheck('pennsylvania', 'child6to18', 4, 5800);
const parentsRaise = medCheck('pennsylvania', 'parent', 4, 5800);
const phl = hudOf('pennsylvania', 'Philadelphia County', 4);
const alle = hudOf('pennsylvania', 'Allegheny County', 4);
const dauphin = hudOf('pennsylvania', 'Dauphin County', 4);
const centre = hudOf('pennsylvania', 'Centre County', 4);

export default defineStatePage({
  slug: 'pennsylvania',
  title: `Pennsylvania CHIP, Medical Assistance and SNAP Limits 2026`,
  description: `Pennsylvania in 2026: CHIP covers children up to ${chip4.effectivePct}% of poverty (${usd(chip4.monthly ?? 0)} a month for 4 people), Medical Assistance for adults to ${adult.effectivePct}%, a SNAP test at ${g}%.`,
  intro: 'Pennsylvania keeps children insured far above the Medicaid lines, runs its own marketplace, Pennie, and gives SNAP households one of the larger utility allowances.',
  resume: `Pennsylvania's strongest benefit line is for children: after Medical Assistance, the state CHIP covers kids up to ${chip4.effectivePct}% of the poverty guideline, about ${usd(chip4.monthly ?? 0)} a month for a family of four in 2026. Adults aged 19 to 64 qualify for Medical Assistance under the ACA expansion up to ${adult.effectivePct}%, ${usd(adult.monthly ?? 0)} a month for one person, and those above it buy plans through Pennie, the state marketplace. SNAP, run by the Pennsylvania Department of Human Services and applied for through COMPASS, tests gross income at ${g}% of poverty with no asset limit: ${usd(snapGrossState('pennsylvania', 4))} a month for four in fiscal year ${P.snap.fy}. A Pittsburgh couple with two young children earning ${usd(3900)}, paying ${usd(400)} for daycare and ${usd(1200)} in rent would get about ${usd(ex.benefit)} a month, with a heating allowance of ${usdx(hc)} in the calculation.`,
  body: (h) => `<h2>Medical Assistance first, CHIP above it</h2>
<p>Medical Assistance is Pennsylvania's name for Medicaid. For children, the CMS table sets its limits by age: ${lv.child0to1}% of poverty for babies, ${lv.child1to5}% from 1 to 5 and ${lv.child6to18}% from 6 to 18. Above those lines CHIP takes over, up to ${lv.chip}% for every child, or ${chip4.effectivePct}% once the 5% disregard applies. The result is a long ladder in which a family's income decides the program but rarely whether a child is insured at all. Babies under one stay in Medical Assistance itself up to ${usd(fplAt(4, lv.child0to1 + P.medicaid.disregardPct) / 12)} a month in a family of four, and CHIP covers them above that, as it does older children, up to ${usd(baby.monthly ?? 0)}.</p>
<p>Suppose the Pittsburgh family later earns ${usd(5800)} a month. At ${Math.round(kidsRaise.pctIncome)}% of poverty, the children ${kidsRaise.eligible ? `stay covered, now through ${kidsRaise.program}` : 'lose public coverage'}. The parents ${parentsRaise.eligible ? 'remain on Medical Assistance' : `do not, the limit for four being ${usd(parentsRaise.monthly ?? 0)} a month`}, so they turn to Pennie, which CMS lists as a state-based exchange for plan year 2026 (${h.ext('https://www.cms.gov/cciio/resources/fact-sheets-and-faqs/state-marketplaces', 'CMS state marketplaces')}). The ${h.a('aca-subsidy-calculator', 'premium tax credit')} there follows the federal 2026 table. Pregnancy coverage reaches ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for a woman expecting one child.</p>
${h.mini('fplThreshold', { pct: chip4.effectivePct })}
<h2>Daycare costs and the Pittsburgh SNAP estimate</h2>
<p>With a gross line of ${g}% of poverty, the Pittsburgh family passes the test easily: ${usd(ex.gross)} against ${usd(ex.grossLimit)}. What lowers its net income is a set of deductions, and daycare is the one families most often forget to report. The ${usd(400)} paid to a provider comes off in full (${usd(ex.deductions.dependentCare)}), next to the earnings deduction of ${usd(ex.deductions.earned)} and the standard deduction for four of ${usd(ex.deductions.standard)}. Shelter costs, rent plus Pennsylvania's ${usdx(hc)} heating allowance, come to ${usd(ex.shelterCosts)}; the deduction ${ex.shelterCapped ? `reaches the ${usd(P.snap.shelterCap.us)} cap` : `is ${usd(ex.deductions.shelter)}`}. Net income is ${usd(ex.net)} and the benefit ${usd(ex.benefit)}. Without the daycare deduction it would be ${usd(exNoCare.benefit)}.</p>
<p>The ${h.src('fnaSua', 'USDA allowance table')} also gives Pennsylvania a telephone allowance of ${usdx(phone)}, the highest in that table, for households whose only utility bill is a phone. Use the ${h.a('snap-calculator', 'SNAP calculator')} for a household with other costs.</p>
<h2>Housing limits from Bucks County to the western hills</h2>
<p>HUD divides Pennsylvania's ${S.hud.rows} counties into ${S.hud.areas} areas. Philadelphia and Bucks counties, both in the Philadelphia metro area, share the highest very low income limit for four, ${usd(phl.vli)}. Centre County, home to State College, reaches ${usd(centre.vli)}, Allegheny County (Pittsburgh) ${usd(alle.vli)} and Dauphin County (Harrisburg) ${usd(dauphin.vli)}. ${S.hud.vli4MinName} is lowest at ${usd(S.hud.vli4Min)}.</p>
<p>Neighbors ${h.a('state:new-jersey', 'New Jersey')} and ${h.a('state:new-york', 'New York')} also run their own marketplaces, ${h.a('state:ohio', 'Ohio')} uses HealthCare.gov and a 130% SNAP line, and ${h.a('state:maryland', 'Maryland')} tests SNAP at ${g}% like Pennsylvania.</p>`,
  faqs: [
    { q: 'What is the income limit for CHIP in Pennsylvania?', a: `Pennsylvania's CHIP covers children up to ${chip4.effectivePct}% of the 2026 poverty guideline with the 5% disregard, about ${usd(medLimit('pennsylvania', 'child6to18', 3).monthly ?? 0)} a month for a family of three and ${usd(chip4.monthly ?? 0)} for four. Below the Medical Assistance line for the child's age, coverage comes from Medicaid instead. The Department of Human Services decides which program applies from a single application.` },
    { q: 'How much do you have to make to get food stamps in Pennsylvania?', a: `Gross income must be under ${g}% of the poverty guideline in fiscal year ${P.snap.fy}: ${usd(snapGrossState('pennsylvania', 1))} a month for one person, ${usd(snapGrossState('pennsylvania', 2))} for two and ${usd(snapGrossState('pennsylvania', 4))} for four. Pennsylvania has no SNAP asset limit. The amount you receive depends on net income after deductions for earnings, daycare, rent and utilities, and is applied for through COMPASS.` },
    { q: 'Is Pennie the same as HealthCare.gov in Pennsylvania?', a: 'No. Pennie is Pennsylvania\'s own health insurance marketplace, listed by CMS as a state-based exchange for plan year 2026, so Pennsylvanians buy private plans with the premium tax credit there rather than on HealthCare.gov. The federal rules for the credit are the same: it is available from 100% to 400% of the 2025 poverty guideline for 2026 coverage.' },
    { q: 'What is the Section 8 income limit in Philadelphia, PA?', a: `For fiscal year 2026, a family of four in Philadelphia qualifies as very low income, the general line for a Housing Choice Voucher, up to ${usd(phl.vli)} a year, and as extremely low income up to ${usd(phl.eli)}. The low income limit is ${usd(phl.li)}. These HUD limits took effect on May 1, 2026, and are the highest in Pennsylvania.` },
  ],
  related: ['state:new-jersey', 'state:new-york', 'state:ohio', 'state:maryland', 'medicaid-income-limits', 'snap-income-limits'],
});
