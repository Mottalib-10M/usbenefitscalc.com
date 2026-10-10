import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, suaRow, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('virginia');
const g = S.snap.bbce[0].grossPct;
const small = suaRow('virginia', 3)!;
const big = suaRow('virginia', 4)!;
const kid = medLimit('virginia', 'child6to18', 4);
const preg = medLimit('virginia', 'pregnant', 2);
const adult = medLimit('virginia', 'adult', 1);
// The same Richmond household before and after a baby: $2,900 of wages, $1,300 rent, electric heat.
const three = snapCalc('virginia', { size: 3, earned: 2900, housing: 1300 });
const four = snapCalc('virginia', { size: 4, earned: 2900, housing: 1300 });
const arl = hudOf('virginia', 'Arlington County', 4);
const rich = hudOf('virginia', 'Richmond city', 4);
const acc = hudOf('virginia', 'Accomack County', 4);

export default defineStatePage({
  slug: 'virginia',
  title: 'Virginia SNAP, Cardinal Care and FAMIS Limits 2026 by Family',
  description: `Virginia benefits 2026: SNAP gross limit ${usd(snapGrossState('virginia', 4))} a month for 4 (${g}%), a utility allowance by family size, Cardinal Care adults to ${adult.effectivePct}%, FAMIS for kids.`,
  intro: 'Virginia sets its SNAP utility allowance by household size, calls Medicaid Cardinal Care and covers children through FAMIS.',
  resume: `In Virginia, a family of four can have up to ${usd(snapGrossState('virginia', 4))} of gross monthly income and qualify for SNAP in fiscal year ${P.snap.fy}, since the state tests gross income at ${g}% of the poverty guideline and has no asset test. Its heating and cooling allowance depends on household size: ${usdx(small.hcsua ?? 0)} for one to three people and ${usdx(big.hcsua ?? 0)} for four or more, which means a new baby raises both the maximum benefit and the utility deduction. A Richmond family earning ${usd(2900)} with ${usd(1300)} in rent would go from about ${usd(three.benefit)} a month as three to ${usd(four.benefit)} as four. Medicaid, branded Cardinal Care, covers adults to ${adult.effectivePct}% of poverty under the expansion, and FAMIS insures children up to ${kid.effectivePct}%. Housing limits range widely, from ${usd(acc.vli)} for four in Accomack County to ${usd(arl.vli)} in Arlington.`,
  body: (h) => `<h2>A utility allowance that grows with the family</h2>
<p>Most states use one heating and cooling allowance for every household. Virginia's USDA-approved table has two: ${usdx(small.hcsua ?? 0)} a month for households of one to three and ${usdx(big.hcsua ?? 0)} for four or more, plus ${usdx(small.phone ?? 0)} for a household that only pays a telephone bill, and no limited allowance between the two (${h.src('fnaSua', 'USDA SUA table')}). For the Richmond family, the birth of a third child changes three lines at once: the maximum allotment rises from ${usd(three.maxAllotment)} to ${usd(four.maxAllotment)}, the standard deduction from ${usd(three.deductions.standard)} to ${usd(four.deductions.standard)}, and shelter costs from ${usd(three.shelterCosts)} to ${usd(four.shelterCosts)}. Net income falls from ${usd(three.net)} to ${usd(four.net)}, and the estimate moves from ${usd(three.benefit)} to ${usd(four.benefit)}.</p>
<h2>Cardinal Care and FAMIS, one application</h2>
<p>The Department of Medical Assistance Services uses the name Cardinal Care for Virginia Medicaid and FAMIS for children's coverage. The CMS table lists children in Medicaid up to ${S.medicaid.child6to18}% of the poverty guideline and in the separate CHIP up to ${S.medicaid.chip}%, so a family of four keeps the children covered up to about ${usd(kid.monthly ?? 0)} a month. Pregnant women qualify up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for a woman expecting one baby, through Medicaid or the CHIP pregnancy coverage. Adults 19 to 64 qualify up to ${usd(adult.monthly ?? 0)} a month for one person. Above those lines, Virginia now runs its own exchange, Virginia's Insurance Marketplace, for 2026 coverage with the federal premium tax credit.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Northern Virginia against the rest of the state</h2>
<p>HUD's FY 2026 file has ${S.hud.rows} counties and independent cities in Virginia, grouped in ${S.hud.areas} areas. The very low income limit for a family of four is ${usd(arl.vli)} in Arlington County, the level of the Washington metro area, ${usd(rich.vli)} in the city of Richmond and ${usd(acc.vli)} in Accomack County on the Eastern Shore. A household of four earning ${usd(55000)} a year is very low income in Arlington and above the line in Richmond. Independent cities have their own row in the lookup below, so pick the city if you live in one.</p>
<p>Neighbors: ${h.a('state:maryland', 'Maryland')} and the ${h.a('state:district-of-columbia', 'District of Columbia')} share the Washington housing area, ${h.a('state:north-carolina', 'North Carolina')} also sizes its allowance by household, and ${h.a('state:west-virginia', 'West Virginia')} has some of the lowest housing limits in the region.</p>`,
  faqs: [
    { q: 'What is the SNAP income limit in Virginia for a family of 4?', a: `${usd(snapGrossState('virginia', 4))} of gross monthly income in fiscal year ${P.snap.fy}, which is ${g}% of the 2026 poverty guideline, with no asset limit. For three people the limit is ${usd(snapGrossState('virginia', 3))}. The benefit is then computed from net income; a four-person household with no income receives the maximum, ${usd(four.maxAllotment)}.` },
    { q: 'Is FAMIS the same as Medicaid in Virginia?', a: `No. FAMIS is Virginia's children's health insurance program for families whose income is above the Medicaid line for children but below ${kid.effectivePct}% of the poverty guideline, about ${usd(kid.monthly ?? 0)} a month for four people. Medicaid, called Cardinal Care, covers children below the lower line. One application through the state decides which program applies.` },
    { q: 'What is the Section 8 income limit in Arlington, Virginia?', a: `For fiscal year 2026, the very low income limit in Arlington County is ${usd(arl.vli)} a year for a family of four and ${usd(hudOf('virginia', 'Arlington County', 1).vli)} for one person; the extremely low income limit for four is ${usd(arl.eli)}. Arlington shares these limits with the other jurisdictions of HUD's Washington metro area. Limits took effect on May 1, 2026.` },
  ],
  related: ['state:maryland', 'state:district-of-columbia', 'state:north-carolina', 'state:west-virginia', 'snap-deductions', 'section-8-income-limits'],
});
