import { defineStatePage } from '../../lib/page-types';
import { P, sd, STATES, snapCalc, snapGrossState, sua, medLimit, medCheck, fplAt, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('florida');
const g = S.snap.bbce[0].grossPct;
const nNon = STATES.filter((x) => !x.medicaid.expansion).length;
const par = medLimit('florida', 'parent', 3);
const baby = medLimit('florida', 'infant', 3);
const kid = medLimit('florida', 'child6to18', 3);
const preg = medLimit('florida', 'pregnant', 2);
const floor3 = fplAt(3, 100, 'us', 2025) / 12;
// A mother of two in Ocala cleaning offices part time for $900 a month.
const mom = medCheck('florida', 'parent', 3, 900);
// A family of four in Orlando: $3,900 of wages, $1,500 rent.
const ex = snapCalc('florida', { size: 4, earned: 3900, housing: 1500 });
const young = (S.medicaid.note ?? '').match(/(\d+)% of the FPL/)?.[1];
const monroe = hudOf('florida', 'Monroe County', 4);
const miami = hudOf('florida', 'Miami-Dade County', 4);
const orange = hudOf('florida', 'Orange County', 4);
const duval = hudOf('florida', 'Duval County', 4);
const hills = hudOf('florida', 'Hillsborough County', 4);

export default defineStatePage({
  slug: 'florida',
  title: 'Florida Food Stamps and Medicaid 2026: No Adult Expansion',
  description: `Florida benefits 2026: no Medicaid expansion, parents covered only below ${usd(par.monthly ?? 0)} a month for 3, KidCare to ${kid.effectivePct}% of poverty, SNAP gross limit ${usd(snapGrossState('florida', 4))} a month for 4.`,
  intro: 'Florida pairs a generous SNAP income line with one of the tightest Medicaid rules for working parents, and a parent can earn too little for subsidies while still earning too much for Medicaid.',
  resume: `Florida is one of the ${nNon} states that have not adopted the Medicaid expansion, and its line for parents is a dollar standard CMS converts to ${par.effectivePct}% of poverty with the disregard: about ${usd(par.monthly ?? 0)} a month for a family of three in 2026. Adults without children have no income-based group. Subsidies on HealthCare.gov start at 100% of the 2025 guideline, about ${usd(floor3)} a month for three, so a parent earning between those two amounts gets neither. Children are much better placed: Medicaid and Florida KidCare cover them up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for three people. SNAP is broader than the health rules suggest. The Department of Children and Families tests gross income at ${g}% of poverty, ${usd(snapGrossState('florida', 4))} a month for four in fiscal year ${P.snap.fy}, with no asset limit, and an Orlando family of four earning ${usd(3900)} with ${usd(1500)} rent would receive about ${usd(ex.benefit)} a month.`,
  body: (h) => `<h2>Between ${usd(par.monthly ?? 0)} and ${usd(floor3)}: Florida's coverage gap</h2>
<p>CMS marks the Florida parent group with a dollar sign: the state sets amounts by family size, which convert to ${S.medicaid.parent}% of the guideline, ${par.effectivePct}% with the 5% disregard (${h.src('cmsLevels', 'CMS eligibility levels')}). A mother of two in Ocala who cleans offices part time for ${usd(900)} a month is at ${Math.round(mom.pctIncome)}% of poverty: ${mom.eligible ? 'under the line, so she is covered' : `over the ${usd(par.monthly ?? 0)} line, so she has no Medicaid`}. She is also under the ${h.a('aca-subsidy-calculator', 'premium tax credit')} floor of ${usd(fplAt(3, 100, 'us', 2025))} a year, so HealthCare.gov offers her no subsidy. Her children, by contrast, are covered. ${young ? `A CMS note adds that Florida covers ages 19 and 20 at ${young}% of poverty, the same narrow line as parents.` : ''} Pregnancy is the main exception for adults: Medicaid covers pregnant women to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for two. More on the gap in ${h.a('medicaid-expansion-states', 'Medicaid expansion states')}.</p>
<h2>Florida KidCare above Medicaid</h2>
<p>Babies under one are on Medicaid to ${baby.effectivePct}%. From age one, Medicaid stops at ${S.medicaid.child1to5 + P.medicaid.disregardPct}% for young children and ${S.medicaid.child6to18 + P.medicaid.disregardPct}% for school-age ones, and the separate CHIP under the Florida KidCare name takes children aged ${S.medicaid.chipAges ?? '1 up to 19'} to ${kid.effectivePct}%. For a family of four that is ${usd(medLimit('florida', 'child6to18', 4).monthly ?? 0)} a month.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>SNAP in Florida: the ${g}% line</h2>
<p>The SNAP rules are far less restrictive than the health rules. Florida uses broad-based categorical eligibility at ${g}% of poverty with no asset limit (${h.src('fnaBbce', 'USDA BBCE chart')}), and its utility allowance is ${usdx(sua('florida', 4) ?? 0)}. The Orlando family of four earns ${usd(ex.gross)}; after the 20% earnings deduction of ${usd(ex.deductions.earned)} and the ${usd(ex.deductions.standard)} standard deduction for four, ${usd(ex.adjusted)} remains. Rent plus utilities is ${usd(ex.shelterCosts)}, and the part above half of that income, ${usd(ex.deductions.shelter)}, is deducted. Net income is ${usd(ex.net)}; the ${usd(ex.maxAllotment)} maximum minus ${usd(ex.thirtyPercent)} leaves ${usd(ex.benefit)}. Applications go through MyACCESS at the Department of Children and Families. Note what this family looks like on the health side: its parents earn ${usd(ex.gross)} a month, far above the parent Medicaid line, so they would buy subsidized Marketplace coverage while their children use KidCare.</p>
<h2>The Keys and Miami at the top of the HUD scale</h2>
<p>Monroe County, the Florida Keys, has the highest very low income limit for four, ${usd(monroe.vli)}, followed by Miami-Dade at ${usd(miami.vli)}. Orange County, around Orlando, is at ${usd(orange.vli)}, Hillsborough, around Tampa, at ${usd(hills.vli)} and Duval, around Jacksonville, at ${usd(duval.vli)}. ${S.hud.vli4MinName} and many inland counties share the floor of ${usd(S.hud.vli4Min)}. ${h.a('state:georgia', 'Georgia')} and ${h.a('state:alabama', 'Alabama')}, the two neighbors, also declined the expansion.</p>`,
  faqs: [
    { q: 'Did Florida expand Medicaid?', a: `No. The CMS table lists Florida among the states that have not adopted the ACA Medicaid expansion. Parents qualify only up to about ${usd(par.monthly ?? 0)} a month for a family of three in 2026, ${par.effectivePct}% of poverty, and adults without children have no income-based group. Pregnant women qualify to ${preg.effectivePct}% and children to ${kid.effectivePct}%.` },
    { q: 'What is the food stamp income limit in Florida for a family of 4?', a: `${usd(snapGrossState('florida', 4))} of gross monthly income in fiscal year ${P.snap.fy}, which is ${g}% of the 2026 poverty guideline. Florida has no SNAP asset limit under broad-based categorical eligibility. For three people the line is ${usd(snapGrossState('florida', 3))}. The Department of Children and Families computes the benefit from net income after deductions.` },
    { q: 'What is the income limit for Florida KidCare?', a: `Florida KidCare covers children up to ${kid.effectivePct}% of the poverty guideline, about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('florida', 'child6to18', 4).monthly ?? 0)} for four in 2026, according to the CMS table. Children under the Medicaid line for their age get Medicaid; above it, KidCare's CHIP coverage applies to ages one to eighteen.` },
    { q: 'What is the Section 8 income limit in Miami-Dade County, Florida?', a: `For fiscal year 2026, a family of four in Miami-Dade County is very low income up to ${usd(miami.vli)} a year and extremely low income up to ${usd(miami.eli)}. Only Monroe County, the Keys, is higher in Florida, at ${usd(monroe.vli)}. HUD limits took effect on ${day(P.hud.effective)}; the county housing agency keeps the voucher list.` },
  ],
  related: ['state:georgia', 'state:alabama', 'medicaid-expansion-states', 'aca-subsidy-calculator', 'snap-income-limits', 'section-8-income-limits'],
});
