import { definePage } from '../../lib/page-types';
import { P, fpl, fplAt, acaCliff, acaCalc, usd, pct } from '../../lib/kit';

const A = P.aca;
const M = A.maxPct;
const rows = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => [`${n}`, `<strong>${usd(acaCliff(n))}</strong>`, usd(acaCliff(n) / 12), usd(acaCliff(n, 'ak')), usd(acaCliff(n, 'hi')), usd(fplAt(n, M))]);
const old = A.table2021to2025;
const oldTop = old[old.length - 1][2];
const band = A.table2026[A.table2026.length - 1];
// A single adult $1,000 under and $1,000 over the line, with a hypothetical benchmark silver premium of $900 a month.
const bench = 900;
const under = acaCalc(acaCliff(1) - 1000, 1, bench);
const over = acaCalc(acaCliff(1) + 1000, 1, bench);
const overOld = acaCalc(acaCliff(1) + 1000, 1, bench, 'us', true);
// A couple in their sixties, two people, $1,500 over the line, benchmark $2,000 a month for both.
const coupleBench = 2000;
const coupleOld = acaCalc(acaCliff(2) + 1500, 2, coupleBench, 'us', true);
const coupleUnder = acaCalc(acaCliff(2) - 1500, 2, coupleBench);

export default definePage({
  id: 'fpl-400-percent',
  group: 'poverty',
  kind: 'threshold',
  order: 260,
  slug: '400-percent-federal-poverty-level',
  nav: '400% of the poverty level',
  card: `The 2026 ceiling of the premium tax credit: ${usd(acaCliff(1))} for one person, ${usd(acaCliff(4))} for four`,
  title: `400% of Poverty Level 2026: ${usd(acaCliff(1))} ACA Subsidy Cliff`,
  description: `400% of the poverty level for 2026 Marketplace plans is ${usd(acaCliff(1))} for one person and ${usd(acaCliff(4))} for four: above it, no premium tax credit at all. Table by size.`,
  h1: '400% of the federal poverty level: the 2026 subsidy ceiling',
  intro: 'For 2026 health plans, one dollar of income above this line removes the whole premium tax credit. Here is the line for every household size.',
  resume: `For 2026 Marketplace coverage, 400% of the federal poverty level is ${usd(acaCliff(1))} a year for one person, ${usd(acaCliff(2))} for two, ${usd(acaCliff(3))} for three and ${usd(acaCliff(4))} for a family of four in the 48 states and DC. The figures come from the 2025 poverty guidelines, which HealthCare.gov uses for 2026 savings. Above that income, the premium tax credit is zero, whatever the price of the plan. Below it, the benchmark silver plan costs at most ${pct(band[2])} of income, the top of the 2026 table from ${band[0]}% to ${band[1]}%. From 2021 to 2025 there was no ceiling: households above 400% paid at most ${pct(oldTop)} of income for the benchmark plan, and those extra credits expired at the end of 2025. Because the cap on repaying excess advance credits is also gone from tax year ${A.repaymentCapsRemovedFromTaxYear}, a household whose income ends the year above the line repays every dollar of advance credit it received. In Alaska the line for one person is ${usd(acaCliff(1, 'ak'))}, in Hawaii ${usd(acaCliff(1, 'hi'))}.`,
  mini: 'fplThreshold',
  miniArg: { pct: 400, year: 2025 },
  faqs: [
    { q: 'What is 400 percent of the federal poverty level for a family of 4?', a: `For 2026 health plans, ${usd(acaCliff(4))} a year, which is 400% of the 2025 guideline of ${usd(fpl(4, 'us', 2025))}. That is the income ceiling of the premium tax credit in the 48 states and DC. With the 2026 guideline, used by other programs, 400% is ${usd(fplAt(4, M))}. In Alaska the Marketplace line for four is ${usd(acaCliff(4, 'ak'))} and in Hawaii ${usd(acaCliff(4, 'hi'))}.` },
    { q: 'What happens if my income ends up above 400% FPL at tax time?', a: `You were not eligible for any premium tax credit for 2026, so every dollar of advance credit paid to your insurer during the year comes back on your return. From tax year ${A.repaymentCapsRemovedFromTaxYear} the repayment is no longer capped. A single person a few hundred dollars over ${usd(acaCliff(1))} who received ${usd(under.creditMonthly)} a month in advance would owe about ${usd(under.creditAnnual)}. Update your Marketplace income estimate as soon as a raise or bonus appears.` },
    { q: 'Does Social Security count toward the 400% poverty limit?', a: `Yes, all of it. The Marketplace uses modified adjusted gross income: adjusted gross income plus untaxed foreign income, tax-exempt interest and the non-taxable part of Social Security benefits. A retired couple whose taxable income looks well under ${usd(acaCliff(2))} can cross the line once the untaxed Social Security is added back. Supplemental Security Income is not counted.` },
  ],
  body: (h) => `<h2>The 400% line for every household size</h2>
<p>The premium tax credit for 2026 is available from ${A.minPct}% to ${M}% of the poverty guideline, and ${h.src('healthcareFpl', 'HealthCare.gov')} applies the 2025 guidelines to 2026 coverage. The table gives the resulting ceilings. The last column shows 400% of the 2026 guideline, which will not decide 2026 credits but is the figure HealthCare.gov's rule points to for the following coverage year.</p>
${h.table(['Household size', '400%, 48 states and DC', 'Per month', 'Alaska', 'Hawaii', '400% of the 2026 guideline'], rows, `${M}% of the 2025 HHS guidelines, per year: the income ceiling of the premium tax credit for 2026 coverage.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>From a slope to a wall</h2>
<p>For five years the 400% mark meant little. Under the table that applied from 2021 to 2025, written into section 36B of the tax code, the expected contribution climbed to ${pct(oldTop)} of income at ${old[old.length - 1][0]}% and stayed there with no upper limit, so a household above 400% still got a credit whenever the benchmark plan cost more than ${pct(oldTop)} of its income. That table expired after 2025. The 2026 table in ${h.src('irsRp2525', 'IRS Rev. Proc. 2025-25')} runs from ${pct(A.table2026[0][2])} to ${pct(band[2])} and stops at ${M}%.</p>
<p>A single adult with a benchmark plan of ${usd(bench)} a month shows the jump. With ${usd(acaCliff(1) - 1000)} of income, ${usd(1000)} under the line, the credit is about ${usd(under.creditMonthly)} a month. With ${usd(acaCliff(1) + 1000)}, ${usd(1000)} over, it is ${usd(over.creditMonthly)}; under the expired rules the same person would have received ${usd(overOld.creditMonthly)} a month. A couple in their sixties paying ${usd(coupleBench)} a month for the benchmark plan feels it more: ${usd(1500)} under the line they get about ${usd(coupleUnder.creditAnnual)} for the year, ${usd(1500)} over it nothing, where the old table would have given ${usd(coupleOld.creditAnnual)}. The larger the premium, the larger the amount that disappears at the line.</p>
<h2>Income that counts toward the line</h2>
<p>The test uses projected modified adjusted gross income for the whole tax household for the coverage year: the adjusted gross income of the tax return plus untaxed foreign income, non-taxable Social Security benefits and tax-exempt interest. SSI is left out. Contributions that lower AGI, such as those to a traditional IRA, lower MAGI too, which is why the ${h.src('healthcareLowerCosts', 'HealthCare.gov savings pages')} tell you to start from your AGI and adjust it for expected changes. The household is the tax household: you, a spouse if married, and everyone you claim as a dependent.</p>
<p>The year-end reconciliation is where the line bites. Advance credits are based on the estimate you gave; the tax return compares them with the credit your actual income allows. Since tax year ${A.repaymentCapsRemovedFromTaxYear}, excess advance payments are repaid in full, so an income that ends the year above ${M}% turns every advance dollar into tax due. Reporting income changes to the Marketplace during the year limits the surprise. The ${h.a('aca-subsidy-calculator', 'ACA subsidy calculator')} computes the credit at any income, the ${h.a('aca-subsidy-cliff', 'ACA subsidy cliff')} guide covers ways people manage the line, and the ${h.a('fpl-250-percent', '250% page')} explains the other 2026 threshold on the Marketplace. For every percentage, see the ${h.a('federal-poverty-level', 'federal poverty level')}.</p>`,
  related: ['aca-subsidy-cliff', 'aca-subsidy-calculator', 'fpl-250-percent', 'fpl-138-percent', 'federal-poverty-level'],
  sources: ['irsRp2525', 'healthcareFpl', 'healthcareLowerCosts', 'obbba', 'frPoverty2025'],
});
