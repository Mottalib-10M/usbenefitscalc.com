import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, snapGross, medLimit, medCheck, acaCalc, hudOf, usd } from '../../lib/kit';

const S = sd('new-jersey');
const b = S.snap.bbce[0];
const adult = medLimit('new-jersey', 'adult', 1);
const kid = medLimit('new-jersey', 'child6to18', 4);
const kidMed = (S.medicaid.child6to18 ?? 0) + P.medicaid.disregardPct;
const preg = medLimit('new-jersey', 'pregnant', 2);
const pregMed = (S.medicaid.pregnant ?? 0) + P.medicaid.disregardPct;
// Two parents and two children in Newark (Essex County): $3,800 of wages, $1,700 rent, an assumed $400 of utility bills counted at cost.
const UTIL = 400;
const ex = snapCalc('new-jersey', { size: 4, earned: 3800, housing: 1700, utilities: UTIL });
const par = medCheck('new-jersey', 'parent', 4, 3800);
const kids = medCheck('new-jersey', 'child6to18', 4, 3800);
const aca = acaCalc(3800 * 12, 4, 1500);
const ess = hudOf('new-jersey', 'Essex County', 4);
const hud = hudOf('new-jersey', 'Hudson County', 4);
const hun = hudOf('new-jersey', 'Hunterdon County', 4);
const cum = hudOf('new-jersey', 'Cumberland County', 4);
const cam = hudOf('new-jersey', 'Camden County', 4);

export default defineStatePage({
  slug: 'new-jersey',
  title: `New Jersey SNAP and NJ FamilyCare 2026: ${b.grossPct}% Income Test`,
  description: `New Jersey benefits 2026: NJ SNAP gross limit ${usd(snapGrossState('new-jersey', 4))} a month for 4 (${b.grossPct}% of poverty), NJ FamilyCare for children to ${kid.effectivePct}% of poverty, adults to ${usd(adult.monthly ?? 0)} a month.`,
  intro: `New Jersey sets its SNAP gross test at ${b.grossPct}% of poverty, a level shared by only a handful of states, and runs Medicaid and CHIP under one name, NJ FamilyCare.`,
  resume: `New Jersey's food program, NJ SNAP, uses broad-based categorical eligibility at ${b.grossPct}% of the poverty guideline: a family of four can have up to ${usd(snapGrossState('new-jersey', 4))} of gross income a month in fiscal year ${P.snap.fy}, above the federal ${usd(snapGross(4))} but below the 200% used by most states, and savings are not tested. Two parents in Newark with two children, ${usd(3800)} of wages, ${usd(1700)} in rent and about ${usd(UTIL)} of utility bills would receive roughly ${usd(ex.benefit)} a month. New Jersey's line in the USDA table of standard utility allowances is marked pending, so this example counts the bills at cost. NJ FamilyCare covers the children up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for four, one of the highest lines in the country; adults qualify under the Medicaid expansion up to ${usd(adult.monthly ?? 0)} a month for one, and Get Covered New Jersey sells plans above that.`,
  body: (h) => `<h2>Between 130% and 200%: New Jersey's ${b.grossPct}% line</h2>
<p>The USDA chart of June 2026 lists New Jersey among the states that confer categorical eligibility on all households, with the gross line at ${b.grossPct}% of poverty and no asset limit (${h.src('fnaBbce', 'USDA BBCE chart')}). For four people that is ${usd(snapGrossState('new-jersey', 4))} a month, against ${usd(snapGross(4))} under the federal rule. A household above ${b.grossPct}% is not automatically out: it can still be tested under the federal rules, but at that income it would fail the federal 130% test as well, unless a member is 60 or older or disabled, in which case only the net test applies.</p>
<h2>The Newark family, with utilities at cost</h2>
<p>The USDA table of standard utility allowances for fiscal year 2026 shows New Jersey as pending (${h.src('fnaSua', 'USDA SUA table')}), so we do not print a state allowance here. The example uses an assumed ${usd(UTIL)} of monthly bills instead. Wages of ${usd(3800)} lose ${usd(ex.deductions.earned)} to the earned income deduction and ${usd(ex.deductions.standard)} to the standard deduction. Rent plus utilities make ${usd(ex.shelterCosts)}, the shelter deduction is ${usd(ex.deductions.shelter)}${ex.shelterCapped ? ', the cap' : ''}, net income ${usd(ex.net)}, and the allotment about ${usd(ex.benefit)}. The county board of social services applies New Jersey's approved allowance when it computes the real amount; the result can differ from this estimate in either direction.</p>
<h2>NJ FamilyCare from pregnancy to age 19</h2>
<p>NJ FamilyCare is the single brand for Medicaid and CHIP in New Jersey. School-age children are on Medicaid up to ${kidMed}% of poverty and on the CHIP part up to ${kid.effectivePct}%, so the Newark children, at ${Math.round(kids.pctIncome)}% of poverty, ${kids.eligible ? 'are covered with a wide margin' : 'are not covered'}. Pregnant women are covered up to ${pregMed}% through Medicaid and up to ${preg.effectivePct}% through the CHIP level CMS lists, ${usd(preg.monthly ?? 0)} a month for two. The parents sit right at the edge of the adult line of ${adult.effectivePct}%: at ${par.pctIncome.toFixed(1)}% they are ${par.eligible ? 'just inside it' : 'just above it'}${par.eligible ? '' : `, and on Get Covered New Jersey a benchmark plan assumed at ${usd(1500)} a month would cost them about ${usd(aca.expectedMonthly)} after a ${usd(aca.creditMonthly)} credit`}. A small change in hours can move them across, so reporting income changes promptly matters. The ${h.a('aca-subsidy-calculator', 'ACA subsidy calculator')} handles other premiums.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>From Hunterdon to Cumberland</h2>
<p>New Jersey's ${S.hud.rows} counties fall into ${S.hud.areas} HUD areas. Hunterdon, Middlesex and Somerset counties share the top very low income limit for four, ${usd(hun.vli)}; Hudson County is at ${usd(hud.vli)}, Essex County and Newark at ${usd(ess.vli)}, Camden County, in the Philadelphia metro area, at ${usd(cam.vli)}, and Cumberland County at ${usd(cum.vli)}. Neighbors ${h.a('state:new-york', 'New York')}, ${h.a('state:pennsylvania', 'Pennsylvania')} and ${h.a('state:delaware', 'Delaware')} use different SNAP lines.</p>`,
  faqs: [
    { q: 'What is the income limit for NJ SNAP for a family of 4?', a: `${usd(snapGrossState('new-jersey', 4))} of gross monthly income in fiscal year ${P.snap.fy}, which is ${b.grossPct}% of the 2026 poverty guideline. New Jersey uses broad-based categorical eligibility, so there is no asset limit and no net income test for households under that line. The benefit equals the federal maximum for four minus 30% of net income after deductions.` },
    { q: 'What is the income limit for NJ FamilyCare in New Jersey?', a: `For children, NJ FamilyCare reaches ${kid.effectivePct}% of the poverty guideline with the disregard, about ${usd(kid.monthly ?? 0)} a month for a family of four in 2026. Adults 19 to 64 qualify up to ${adult.effectivePct}%, ${usd(adult.monthly ?? 0)} a month for one person, and pregnant women up to ${preg.effectivePct}%. The levels come from the CMS table; NJ FamilyCare covers both Medicaid and CHIP.` },
    { q: 'What is the SNAP utility allowance in New Jersey?', a: `The USDA table of standard utility allowances for fiscal year 2026 marks New Jersey as pending, so no figure is published there. The county board of social services applies the allowance New Jersey has approved when it computes the shelter deduction. Ask the board for the current amount, or use actual utility costs in an estimate as this page does.` },
    { q: 'What is the Section 8 income limit in Newark, New Jersey?', a: `Essex County, which includes Newark, has a fiscal year 2026 very low income limit of ${usd(ess.vli)} for a family of four and ${usd(hudOf('new-jersey', 'Essex County', 1).vli)} for one person, and an extremely low limit of ${usd(ess.eli)} for four. Hudson County, with Jersey City, is higher at ${usd(hud.vli)}; Hunterdon, Middlesex and Somerset counties top the state at ${usd(hun.vli)}.` },
  ],
  related: ['state:new-york', 'state:pennsylvania', 'state:delaware', 'snap-income-limits', 'medicaid-income-limits', 'aca-subsidy-calculator'],
});
