import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('maryland');
const b = S.snap.bbce[0];
const row = S.snap.sua[0];
const adult = medLimit('maryland', 'adult', 1);
const kid = medLimit('maryland', 'child6to18', 4);
const preg = medLimit('maryland', 'pregnant', 2);
// Two parents and two children in Baltimore: $4,200 of wages, $1,500 rent, gas heat.
const ex = snapCalc('maryland', { size: 4, earned: 4200, housing: 1500 });
const exLua = snapCalc('maryland', { size: 4, earned: 4200, housing: 1500, utilities: row.lua ?? 0 });
const parentCheck = medCheck('maryland', 'parent', 4, 4200);
const kidCheck = medCheck('maryland', 'child6to18', 4, 4200);
const mont = hudOf('maryland', 'Montgomery County', 4);
const balt = hudOf('maryland', 'Baltimore city', 4);
const alle = hudOf('maryland', 'Allegany County', 4);
const worc = hudOf('maryland', 'Worcester County', 4);

export default defineStatePage({
  slug: 'maryland',
  title: 'Maryland SNAP, MCHP and Medicaid Income Limits 2026',
  description: `Maryland 2026: SNAP gross limit ${usd(snapGrossState('maryland', 4))} a month for 4, a ${usdx(row.hcsua ?? 0)} utility allowance set each January, MCHP for children to ${kid.effectivePct}% of poverty, vouchers by county.`,
  intro: 'Maryland resets its SNAP utility allowance on a calendar year, covers children far above the national norm and splits its housing limits between two metro areas.',
  resume: `In Maryland a family of four can earn up to ${usd(snapGrossState('maryland', 4))} a month before tax and qualify for SNAP in fiscal year ${P.snap.fy}, under broad-based categorical eligibility at ${b.grossPct}% of poverty and without an asset test. Two parents in Baltimore with two children, ${usd(4200)} of wages and ${usd(1500)} in rent would receive about ${usd(ex.benefit)} a month with the heating allowance of ${usdx(sua('maryland', 4) ?? 0)}. Unlike almost every other state, Maryland's utility allowances change on January 1 rather than October 1. Health coverage is wide: the Medicaid expansion covers adults up to ${usd(adult.monthly ?? 0)} a month for one person, and the Maryland Children's Health Program (MCHP) covers children up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for a family of four, ${parentCheck.eligible ? 'so the whole Baltimore family is covered' : 'so the Baltimore children stay insured even though their parents earn too much for Medicaid'}.`,
  body: (h) => `<h2>A utility allowance on the calendar year</h2>
<p>The USDA table of standard utility allowances flags a single state with a calendar-year schedule: Maryland, whose allowance takes effect on January 1 (${h.src('fnaSua', 'USDA SUA table, fiscal year 2026')}). The current figures are ${usdx(row.hcsua ?? 0)} for a household that pays for heating or cooling, ${usdx(row.lua ?? 0)} for one paying other utilities only, and ${usdx(row.phone ?? 0)} for a telephone. In practice, a Maryland household recertifying in the autumn may see its allotment move twice in a few months: once in October with the new federal maximums and deductions, again in January when the state allowance is updated. Checking both notices is worth the trouble when a benefit looks off.</p>
<h2>The Baltimore family in figures</h2>
<p>With ${usd(4200)} of earnings, the family keeps 80% after the earned income deduction of ${usd(ex.deductions.earned)}, then subtracts the standard deduction for four, ${usd(ex.deductions.standard)}. Rent and the heating allowance add up to ${usd(ex.shelterCosts)}, and the excess over half of the remaining income gives a shelter deduction of ${usd(ex.deductions.shelter)}${ex.shelterCapped ? ', the federal cap' : ''}. Net income is ${usd(ex.net)}; the allotment, ${usd(ex.benefit)}. If the building included heat and the family paid only electricity, the limited allowance would apply and the amount would fall to ${usd(exLua.benefit)}. The ${h.a('snap-calculator', 'SNAP calculator')} reruns this with your own numbers.</p>
<h2>MCHP covers the children when the parents earn too much</h2>
<p>At ${usd(4200)} a month, the Baltimore parents are at ${Math.round(parentCheck.pctIncome)}% of the poverty guideline, ${parentCheck.eligible ? 'under' : 'above'} the adult line of ${adult.effectivePct}%, so they ${parentCheck.eligible ? 'qualify for Medicaid as expansion adults' : `turn to Maryland Health Connection for 2026 coverage, where plans come with the ${h.a('aca-subsidy-calculator', 'premium tax credit')}`}. Their children ${kidCheck.eligible ? 'remain covered' : 'are not covered'}: Maryland sets children's Medicaid at ${S.medicaid.child6to18}% of poverty in the CMS table, ${kid.effectivePct}% with the disregard, one of the highest levels in the country (${h.ext('https://health.maryland.gov/mmcp/chp', 'MCHP page')}). Pregnant women qualify up to ${preg.effectivePct}%, about ${usd(preg.monthly ?? 0)} a month for a household of two.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Washington suburbs, Baltimore and the mountains</h2>
<p>Maryland counties near the capital, Montgomery, Prince George's, Frederick and Charles, are in HUD's Washington metro area and share a very low income limit for four of ${usd(mont.vli)}. Baltimore city and the surrounding counties are at ${usd(balt.vli)}. Worcester County on the shore is at ${usd(worc.vli)}, and Allegany County in the west at ${usd(alle.vli)}. A household earning ${usd(70000)} would be under the voucher line in Silver Spring but over it in Baltimore. Compare with ${h.a('state:virginia', 'Virginia')}, ${h.a('state:delaware', 'Delaware')} and the ${h.a('state:district-of-columbia', 'District of Columbia')}.</p>`,
  faqs: [
    { q: 'What is the SNAP income limit in Maryland for a family of 4?', a: `${usd(snapGrossState('maryland', 4))} of gross monthly income in fiscal year ${P.snap.fy}, which is ${b.grossPct}% of the 2026 poverty guideline. Maryland uses broad-based categorical eligibility, so assets are not counted and most households face no net income test. The benefit is the maximum allotment for four minus 30% of net income after deductions, set by the USDA for the year starting October 1, 2026.` },
    { q: 'What is the income limit for MCHP in Maryland?', a: `Children qualify for the Maryland Children's Health Program up to ${kid.effectivePct}% of the poverty guideline with the 5% disregard, about ${usd(kid.monthly ?? 0)} a month for a family of four and ${usd(medLimit('maryland', 'child6to18', 3).monthly ?? 0)} for three in 2026. The level comes from the CMS table of state eligibility. Income is counted under MAGI rules, and the parents can be above Medicaid while the children are covered.` },
    { q: 'When does the SNAP utility allowance change in Maryland?', a: `On January 1. The USDA table of standard utility allowances notes that Maryland does not follow the federal fiscal year for its allowance, unlike states whose figures change on October 1. The amounts currently listed are ${usdx(row.hcsua ?? 0)} for heating or cooling and ${usdx(row.lua ?? 0)} for other utilities, used in the shelter deduction.` },
    { q: 'What is the Section 8 income limit in Montgomery County, Maryland?', a: `For fiscal year 2026, a family of four in Montgomery County is very low income up to ${usd(mont.vli)} a year and extremely low income up to ${usd(mont.eli)}; for one person the very low limit is ${usd(hudOf('maryland', 'Montgomery County', 1).vli)}. The county is part of HUD's Washington metro area, which gives it the highest limits in Maryland, shared with Prince George's, Frederick and Charles counties.` },
  ],
  related: ['state:virginia', 'state:delaware', 'state:district-of-columbia', 'state:pennsylvania', 'snap-calculator', 'section-8-income-limits'],
});
