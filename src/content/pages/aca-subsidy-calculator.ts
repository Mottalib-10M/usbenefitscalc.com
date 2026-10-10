import { definePage } from '../../lib/page-types';
import { P, STATES, T26, fpl, fplAt, acaCalc, acaCliff, medLimit, usd, pct, listOf } from '../../lib/kit';

const A = P.aca;
const lo = A.table2026[0][2];
const hi = A.requiredContribution2026;
// Worked cases: incomes, household sizes and benchmark premiums are assumptions for the examples, not official figures.
const CASES: Array<[string, number, number, number]> = [
  ['Single adult', 20000, 1, 500],
  ['Single adult', 30000, 1, 500],
  ['Single adult', 45000, 1, 600],
  ['Couple', 66000, 2, 1700],
  ['Family of 4', 45000, 4, 1500],
  ['Family of 4', 90000, 4, 1600],
];
const ex = (i: number) => acaCalc(CASES[i][1], CASES[i][2], CASES[i][3]);
const exOld = (i: number) => acaCalc(CASES[i][1], CASES[i][2], CASES[i][3], 'us', true);
const nc = acaCalc(45000, 1, 600);
const ohioLine = (medLimit('ohio', 'adult', 1).annual ?? 0);
const CSR = 'https://www.healthcare.gov/lower-costs/save-on-out-of-pocket-costs/';
const own = STATES.filter((s) => s.marketplace.type === 'state');

export default definePage({
  id: 'aca-subsidy-calculator',
  group: 'health',
  kind: 'pillar',
  order: 50,
  slug: 'aca-subsidy-calculator',
  nav: 'ACA subsidy calculator',
  card: `Your 2026 premium tax credit: ${pct(lo)} to ${pct(hi)} of income for the benchmark plan, up to 400% of poverty`,
  title: 'ACA Subsidy Calculator 2026: Your Premium Tax Credit',
  description: `ACA subsidy calculator for 2026: pay ${pct(lo)} to ${pct(hi)} of income for the benchmark silver plan, with a credit up to ${usd(acaCliff(1))} of income for one person and none above.`,
  h1: 'ACA subsidy calculator: your 2026 premium tax credit',
  intro: 'Enter your expected 2026 income, your household and the benchmark premium: the calculator applies the 2026 IRS table.',
  resume: `Your 2026 premium tax credit is the price of the benchmark silver plan in your area minus an expected contribution that runs from ${pct(lo)} to ${pct(hi)} of your household income. The share depends on income measured against the 2025 poverty guideline, ${usd(fpl(1, 'us', 2025))} for one person: ${pct(lo)} below 133%, rising to ${pct(hi)} from 300% to 400%. Above 400%, ${usd(acaCliff(1))} for a single person and ${usd(acaCliff(4))} for a family of four, there is no credit at all in 2026, because the enhanced rules of 2021 to 2025 expired. A single adult earning ${usd(45000)} in North Carolina, with a benchmark of ${usd(600)} a month, is expected to pay ${usd(nc.expectedMonthly)} and receives ${usd(nc.creditMonthly)} a month; under the expired table the credit would have been ${usd(acaCalc(45000, 1, 600, 'us', true).creditMonthly)}. From tax year ${A.repaymentCapsRemovedFromTaxYear}, any advance credit above what you are owed is repaid in full on your tax return.`,
  tool: 'aca',
  toolProps: { state: 'north-carolina', income: 45000 },
  faqs: [
    { q: 'How is the Obamacare subsidy calculated in 2026?', a: `Take your expected household MAGI and divide it by the 2025 poverty guideline for your household size. The IRS table turns that percentage into an applicable percentage between ${pct(lo)} and ${pct(hi)}. Multiply it by your income to get your yearly expected contribution. The credit is the benchmark silver premium minus that contribution, never more than the premium of the plan you choose. Income above 400% of poverty gives no credit in 2026.` },
    { q: 'What is the income limit for ACA subsidies for a family of 4 in 2026?', a: `${usd(acaCliff(4))} of household MAGI, which is 400% of the 2025 guideline of ${usd(fpl(4, 'us', 2025))} for four. One dollar above, the credit drops to zero in 2026. The floor is ${usd(fpl(4, 'us', 2025))}, 100% of the guideline. In Alaska and Hawaii both limits are higher because their guidelines are: ${usd(acaCliff(4, 'ak'))} and ${usd(acaCliff(4, 'hi'))} for four.` },
    { q: 'Why does the Marketplace use 2025 poverty figures for 2026 coverage?', a: `That is the rule HealthCare.gov spells out: the previous year's poverty guidelines are used to calculate Marketplace savings for the next year. For 2026 plans the base is therefore the 2025 guideline, ${usd(fpl(1, 'us', 2025))} for one person and ${usd(fpl(4, 'us', 2025))} for four. Medicaid and CHIP, by contrast, use the 2026 guideline, ${usd(fpl(1))} for one, so the two programs measure the same income against slightly different yardsticks.` },
    { q: 'Do I have to pay back the premium tax credit if I earn more than I estimated?', a: `Yes, and in full from tax year ${A.repaymentCapsRemovedFromTaxYear}. Section 71305 of Public Law 119-21 removed the caps that used to limit repayment for households under 400% of poverty. When you file Form 8962 with your return, the credit is recomputed on your actual income; if your advance payments were higher, the difference is added to your tax. Updating your income with the Marketplace during the year keeps the gap small.` },
    { q: 'Who gets cost-sharing reductions on a silver plan?', a: `Households eligible for the premium tax credit with income up to ${A.csrSilverMaxPct}% of the poverty guideline, ${usd(fplAt(1, A.csrSilverMaxPct, 'us', 2025))} for one person and ${usd(fplAt(4, A.csrSilverMaxPct, 'us', 2025))} for four for 2026 coverage. The reductions lower deductibles, copays and the out-of-pocket maximum, but only on silver plans bought through the Marketplace. You have to pick a silver plan to get them; a bronze or gold plan carries none.` },
    { q: 'Can I get a premium tax credit if my employer offers health insurance?', a: `Only if the employer plan is unaffordable or does not provide minimum value. For 2026 plans, employee-only coverage is unaffordable when its cost exceeds ${pct(A.requiredContribution2026)} of household income, the required contribution percentage set by IRS Rev. Proc. 2025-25. If you are offered affordable coverage and decline it, you cannot claim the credit for a Marketplace plan instead.` },
    { q: 'Why is my Marketplace premium so much higher in 2026?', a: `Mostly because the larger credits of 2021 to 2025 ended. Under that table people under 150% of poverty paid nothing for the benchmark plan and everyone above 400% paid at most 8.5% of income; in 2026 the shares run from ${pct(lo)} to ${pct(hi)} and stop at 400%. A family of four on ${usd(90000)} with a ${usd(1600)} benchmark gets ${usd(ex(5).creditMonthly)} a month instead of ${usd(exOld(5).creditMonthly)}. Insurers' own price changes come on top.` },
  ],
  body: (h) => {
    const bandRows = T26.map(([from, to, a, b]) => [
      from === 0 ? `Under ${to}%` : to >= 400 ? `${from}% to ${to}%` : `${from}% to under ${to}%`,
      a === b ? pct(a) : `${pct(a)} to ${pct(b)}`,
      from === 0 ? `up to ${usd(fplAt(1, to, 'us', 2025))}` : `${usd(fplAt(1, from, 'us', 2025))} to ${usd(fplAt(1, to, 'us', 2025))}`,
      from === 0 ? `up to ${usd(fplAt(4, to, 'us', 2025))}` : `${usd(fplAt(4, from, 'us', 2025))} to ${usd(fplAt(4, to, 'us', 2025))}`,
    ]);
    const caseRows = CASES.map(([who, inc, n, b], i) => { const r = ex(i), o = exOld(i); return [`${who}, ${usd(inc)}`, `${Math.round(r.fplPct)}%`, usd(b), usd(r.expectedMonthly), usd(r.creditMonthly), usd(o.creditMonthly)]; });
    return `<h2>How the credit is built</h2>
<p>The premium tax credit of section 36B pays the difference between two numbers. The first is the monthly premium of the second-lowest-cost silver plan available to your household, called the benchmark; it depends on where you live, your age and who is covered, and the Marketplace shows it when you shop. The second is your expected contribution, a percentage of your yearly household income set by the ${h.src('irsRp2525', 'IRS applicable percentage table for 2026')}. If the benchmark costs more than your contribution, the gap is your credit. You can use it on any metal level: a bronze plan cheaper than the benchmark may cost you little or nothing, a gold plan costs more.</p>
<p>Income means modified adjusted gross income for the whole tax household, estimated for 2026. It is compared with the 2025 poverty guideline, the one in effect when open enrollment started (${h.src('healthcareFpl', 'HealthCare.gov')}). The credit can be paid in advance, month by month, straight to the insurer, or claimed in one piece when you file. Either way it is settled on your tax return.</p>
<h2>The 2026 table in dollars</h2>
${h.table(['Income, % of poverty', 'Share of income for the benchmark', 'One person', 'Family of 4'], bandRows, `Applicable percentages for 2026 (IRS Rev. Proc. 2025-25) with yearly income bands on the 2025 guidelines, 48 states and DC. Within a band the share rises in a straight line. No credit under 100% or above 400%.`, ['l', 'r', 'r', 'r'])}
<h2>Worked examples</h2>
<p>The table below runs the 2026 formula for six households. The incomes and benchmark premiums are assumptions chosen to show the range, not quotes: a ${usd(500)} benchmark is plausible for a young single adult in many areas, ${usd(1700)} for a couple in their sixties. Your Marketplace gives the real figure.</p>
${h.table(['Household', 'Income vs poverty', 'Benchmark per month', 'You pay for benchmark', 'Credit 2026', 'Credit under 2021-2025 table'], caseRows, 'Monthly amounts. Benchmark premiums are hypotheses for the examples.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Three patterns stand out. At low income the credit covers most of the premium: the family of four on ${usd(45000)} pays ${usd(ex(4).expectedMonthly)} a month toward a ${usd(1500)} benchmark. In the middle of the table the share climbs quickly, so a single adult moving from ${usd(30000)} to ${usd(45000)} sees the expected payment go from ${usd(ex(1).expectedMonthly)} to ${usd(ex(2).expectedMonthly)}. And for older couples, high benchmarks keep the credit large right up to 400% of poverty, then it vanishes, a cliff explained in ${h.a('aca-subsidy-cliff', 'the ACA subsidy cliff')}.</p>
<h2>What changed from 2025</h2>
<p>From 2021 to 2025, a temporary table in section 36B(b)(3)(A)(iii) set the share at zero up to 150% of poverty, capped it at 8.5% of income and removed the 400% ceiling. That table applied only to taxable years beginning before January 1, 2026, and Congress did not extend it, so the permanent table, indexed each year, came back. The last column above shows what each household would have received under the old rules. HealthCare.gov now describes eligibility for the credit as income between 100% and 400% of the poverty level.</p>
<p>The 2025 budget law, ${h.src('obbba', 'Public Law 119-21')}, adds four rules. Repayment caps on excess advance credits disappear from tax year ${A.repaymentCapsRemovedFromTaxYear} (section 71305). A plan bought during a special enrollment period opened only because of low income no longer qualifies for the credit, for plan years after 2025 (section 71304). Lawfully present immigrants under 100% of poverty who are barred from Medicaid by their status lose the credit from 2026 (section 71302), and from ${A.immigrantPtcLimitFromTaxYear} the credit is limited to citizens, green card holders, Cuban and Haitian entrants and COFA migrants (section 71301), as detailed in ${h.a('benefits-for-immigrants', 'benefits for immigrants')}.</p>
<h2>Medicaid, cost-sharing reductions and job-based coverage</h2>
<p>Anyone eligible for Medicaid or CHIP cannot take the credit. In an expansion state a single adult is on Medicaid up to ${usd(ohioLine)} of yearly income in 2026, so the credit really starts above that, not at 100%. In a non-expansion state the credit starts at ${usd(fpl(1, 'us', 2025))}, and adults below it may have no help at all, see ${h.a('medicaid-expansion-states', 'Medicaid expansion states')}.</p>
<p>Up to ${A.csrSilverMaxPct}% of poverty, ${usd(fplAt(1, A.csrSilverMaxPct, 'us', 2025))} for one person, silver plans come with cost-sharing reductions that lower the deductible, the copayments and the out-of-pocket maximum (${h.ext(CSR, 'HealthCare.gov')}); you must pick a silver plan to get them. That is why a silver plan often beats a cheaper bronze plan at modest incomes even when the bronze premium is lower. People offered job-based coverage can claim the credit only if that coverage costs more than ${pct(A.requiredContribution2026)} of household income for the employee alone or fails the minimum value test.</p>
<h2>Where to enroll</h2>
<p>Most states use HealthCare.gov. ${own.length} jurisdictions run their own Marketplace: ${listOf(own.map((s) => `${s.marketplace.name} (${s.name})`))}. The credit and the table are the same everywhere; only the benchmark premium changes with the state, the county and your age. Each ${h.a('states', 'state page')} links to its Marketplace and shows the Medicaid line just below it.</p>`;
  },
  related: ['aca-subsidy-cliff', 'medicaid-income-limits', 'fpl-400-percent', 'medicaid-expansion-states', 'benefits-for-immigrants', 'state:north-carolina'],
  sources: ['irsRp2525', 'irsPtcBasics', 'healthcareFpl', 'healthcareLowerCosts', 'obbba'],
  extraSources: [{ name: 'HealthCare.gov, Cost-sharing reductions: lower deductibles, copayments and out-of-pocket maximum on silver plans', url: CSR }],
});
