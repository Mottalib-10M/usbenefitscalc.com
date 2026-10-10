import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, sua, hudOf, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('louisiana');
const b = S.snap.bbce[0];
const row = S.snap.sua[0];
const adult = medLimit('louisiana', 'adult', 1);
const kid = medLimit('louisiana', 'child6to18', 3);
const kidMed = S.medicaid.child6to18 ?? 0;
const preg = medLimit('louisiana', 'pregnant', 2);
// A mother of two in Baton Rouge: $2,400 of wages, $950 rent, pays for electricity used for air conditioning.
const ex = snapCalc('louisiana', { size: 3, earned: 2400, housing: 950 });
const exNoBill = snapCalc('louisiana', { size: 3, earned: 2400, housing: 950, utilities: 0 });
const tam = hudOf('louisiana', 'St. Tammany Parish', 4);
const ebr = hudOf('louisiana', 'East Baton Rouge Parish', 4);
const orl = hudOf('louisiana', 'Orleans Parish', 4);
const caddo = hudOf('louisiana', 'Caddo Parish', 4);
const moved = S.notes.find((n) => n.startsWith('SNAP is now administered'));

export default defineStatePage({
  slug: 'louisiana',
  title: 'Louisiana SNAP and LaCHIP Limits 2026, Parish by Parish',
  description: `Louisiana benefits 2026: SNAP gross limit ${usd(snapGrossState('louisiana', 3))} a month for 3, one ${usdx(row.hcsua ?? 0)} utility allowance, LaCHIP to ${kid.effectivePct}% of poverty, adult Medicaid to ${usd(adult.monthly ?? 0)} a month.`,
  intro: 'Louisiana moved food assistance under its health department, keeps a single utility allowance and counts its housing limits by parish.',
  resume: `Louisiana families of three qualify for SNAP with gross income up to ${usd(snapGrossState('louisiana', 3))} a month in fiscal year ${P.snap.fy}, the ${b.grossPct}% line of broad-based categorical eligibility, and savings are not tested. The program is now run by the ${S.snap.agency}, the same agency as Medicaid. A Baton Rouge mother with two children earning ${usd(2400)} a month and paying ${usd(950)} in rent plus a power bill would receive about ${usd(ex.benefit)} a month, using the state's heating and cooling allowance of ${usdx(sua('louisiana', 3) ?? 0)}. Louisiana adopted the ACA Medicaid expansion, so adults 19 to 64 qualify below ${usd(adult.monthly ?? 0)} a month for one person. LaCHIP covers children up to ${kid.effectivePct}% of poverty, about ${usd(kid.monthly ?? 0)} a month for a family of three, while the Medicaid line for pregnancy is lower, at ${preg.effectivePct}%.`,
  body: (h) => `<h2>SNAP under the Louisiana Department of Health</h2>
<p>Food assistance in Louisiana no longer sits with the children and family services department. The ${S.snap.agency} now publishes the SNAP rules and handles cases${moved ? ` (${h.ext('https://ldh.la.gov/page/snap-eligibility-application', 'LDH SNAP application page')})` : ''}, although the online application still opens on the LA CAFE self-service portal hosted on a dcfs.la.gov address. For applicants this mostly means that letters, phone numbers and office names may differ from older instructions; eligibility follows the same federal formula and the same ${b.grossPct}% gross test.</p>
<h2>One allowance, no middle tier</h2>
<p>Many states publish a heating allowance and a smaller limited one for households that pay only water, trash or electricity without heating or cooling. The USDA table for Louisiana lists ${usdx(row.hcsua ?? 0)} for heating or cooling and ${usdx(row.phone ?? 0)} for telephone, with no limited allowance in between (${h.src('fnaSua', 'USDA utility allowance table')}). So the question that matters at the interview is simply whether the household pays for heating or cooling, and an electric bill that runs an air conditioner counts. For the Baton Rouge family, rent plus the allowance makes ${usd(ex.shelterCosts)} of shelter costs, the deduction reaches ${usd(ex.deductions.shelter)}, and the allotment is ${usd(ex.benefit)}. If the landlord paid every utility, the household would claim rent alone and get ${usd(exNoBill.benefit)}.</p>
<h2>Pregnancy, LaCHIP and the adult group</h2>
<p>Louisiana's children are covered by Medicaid up to ${kidMed + P.medicaid.disregardPct}% of poverty and by LaCHIP above that, up to ${kid.effectivePct}%: ${usd(kid.monthly ?? 0)} a month for three people, ${usd(medLimit('louisiana', 'child6to18', 4).monthly ?? 0)} for four (${h.ext('https://ldh.la.gov/medicaid/lachip', 'LaCHIP page')}). Pregnant women have a much lower Medicaid line of ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for a woman expecting one baby, which is the same level as the expansion group. A pregnant worker earning more than that should still apply, because the agency reviews every group, and above Medicaid HealthCare.gov plans carry the ${h.a('aca-subsidy-calculator', 'premium tax credit')} from ${usd(fplAt(2, 100, 'us', 2025))} a year for two.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Parishes and their HUD limits</h2>
<p>HUD lists Louisiana by its ${S.hud.rows} parishes, grouped into ${S.hud.areas} areas. St. Tammany Parish, across Lake Pontchartrain, has the top very low income limit for four, ${usd(tam.vli)}. East Baton Rouge Parish sits at ${usd(ebr.vli)}, Orleans Parish at ${usd(orl.vli)} and Caddo Parish around Shreveport at ${usd(caddo.vli)}. New Orleans therefore has a lower voucher line than the parish on the north shore. Neighbors ${h.a('state:mississippi', 'Mississippi')} and ${h.a('state:texas', 'Texas')} never expanded Medicaid; ${h.a('state:arkansas', 'Arkansas')} did.</p>`,
  faqs: [
    { q: 'What is the maximum income for food stamps in Louisiana for a family of 3?', a: `${usd(snapGrossState('louisiana', 3))} of gross income a month for fiscal year ${P.snap.fy}, which is ${b.grossPct}% of the 2026 poverty guideline. Louisiana uses broad-based categorical eligibility, so there is no asset limit and no separate net income test for most households. The amount you receive still depends on deductions for earnings, rent, utilities and child care, and the maximum for three people is the federal allotment.` },
    { q: 'Who runs SNAP in Louisiana now?', a: `The ${S.snap.agency} administers SNAP, according to its own SNAP pages on ldh.la.gov. The online application still goes through the LA CAFE self-service portal, hosted on a dcfs.la.gov address. Eligibility rules did not change with the move: a family of three must stay under ${usd(snapGrossState('louisiana', 3))} of gross monthly income in fiscal year ${P.snap.fy}.` },
    { q: 'What is the income limit for LaCHIP in Louisiana?', a: `LaCHIP covers children up to ${kid.effectivePct}% of the poverty guideline including the 5% disregard, roughly ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('louisiana', 'child6to18', 4).monthly ?? 0)} for four in 2026. Below ${kidMed + P.medicaid.disregardPct}% the children are on regular Medicaid instead. The levels come from the CMS table of state eligibility levels; one application to the Louisiana Department of Health covers both.` },
    { q: 'How much is the Section 8 income limit in New Orleans, Louisiana?', a: `For fiscal year 2026, Orleans Parish has a very low income limit of ${usd(orl.vli)} a year for a family of four and ${usd(hudOf('louisiana', 'Orleans Parish', 1).vli)} for one person, with an extremely low limit of ${usd(orl.eli)} for four. Jefferson Parish shares those figures as part of the same HUD metro area, while St. Tammany Parish is higher at ${usd(tam.vli)}.` },
  ],
  related: ['state:mississippi', 'state:texas', 'state:arkansas', 'snap-deductions', 'medicaid-income-limits', 'section-8-income-limits'],
});
