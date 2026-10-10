import { definePage } from '../../lib/page-types';
import { P, STATES, fpl, fplAt, apct, acaCalc, usd, pct, listOf } from '../../lib/kit';

const A = P.aca;
const L = A.csrSilverMaxPct;
const at = (n: number, area: 'us' | 'ak' | 'hi' = 'us') => fplAt(n, L, area, 2025);
const rows = [1, 2, 3, 4, 5, 6].map((n) => [`${n}`, `<strong>${usd(at(n))}</strong>`, usd(at(n) / 12), usd((at(n) * apct(L)) / 100 / 12), usd(at(n, 'ak')), usd(at(n, 'hi'))]);
const b1 = A.table2026.find((r) => r[1] === L) as number[];
const b2 = A.table2026.find((r) => r[0] === L) as number[];
// A single adult at exactly 250% of the 2025 guideline, with a hypothetical benchmark silver premium of $600 a month.
const bench = 600;
const single = acaCalc(at(1), 1, bench);
const single300 = acaCalc(fplAt(1, 300, 'us', 2025), 1, bench);
const top = (s: (typeof STATES)[number]) => Math.max(s.medicaid.chip ?? 0, s.medicaid.child6to18 ?? 0);
const chip250 = STATES.filter((s) => top(s) >= 245 && top(s) <= 255).map((s) => `${s.name} (${top(s)}%)`);
const csrUrl = 'https://www.healthcare.gov/lower-costs/save-on-out-of-pocket-costs/';

export default definePage({
  id: 'fpl-250-percent',
  group: 'poverty',
  kind: 'threshold',
  order: 250,
  slug: '250-percent-federal-poverty-level',
  nav: '250% of the poverty level',
  card: `Where silver-plan cost-sharing reductions end in 2026: ${usd(at(1))} for one person`,
  title: `250% of Poverty Level 2026: ${usd(at(1))} Silver Plan Line`,
  description: `250% of the poverty level for 2026 health plans is ${usd(at(1))} for one person and ${usd(at(4))} for four (2025 chart): the end of silver cost-sharing reductions.`,
  h1: '250% of the federal poverty level: the cost-sharing reduction limit',
  intro: 'Below this line a silver Marketplace plan comes with a lower deductible and lower copays. Above it, only the premium tax credit is left.',
  resume: `For 2026 Marketplace coverage, 250% of the federal poverty level is ${usd(at(1))} a year for one person, ${usd(at(2))} for two and ${usd(at(4))} for a family of four, because health plans for 2026 are measured against the 2025 guidelines. It is the upper limit of cost-sharing reductions, the extra savings that lower deductibles, copayments and out-of-pocket maximums, and that come only with a silver plan. Up to 250%, a household that picks silver gets both the premium tax credit and those reductions; above it, the credit remains but the plan's cost sharing is the standard one. The same point is a hinge of the 2026 credit table: the expected contribution rises from ${pct(b1[2])} to ${pct(b1[3])} of income between ${b1[0]}% and ${b1[1]}% of poverty, then from ${pct(b2[2])} to ${pct(b2[3])} up to ${b2[1]}%. A single adult right at 250% pays about ${usd(single.expectedMonthly)} a month for the benchmark silver plan. In the 2026 poverty table, used for Medicaid and CHIP, 250% is ${usd(fplAt(1, L))} for one person.`,
  mini: 'fplThreshold',
  miniArg: { pct: 250, year: 2025 },
  faqs: [
    { q: 'What is 250 percent of the poverty level for a single person?', a: `For 2026 Marketplace plans, ${usd(at(1))} a year, which is 250% of the 2025 guideline of ${usd(fpl(1, 'us', 2025))}. For programs that use the 2026 guideline, such as Medicaid and CHIP, it is ${usd(fplAt(1, L))}. In Alaska the Marketplace figure for one person is ${usd(at(1, 'ak'))} and in Hawaii ${usd(at(1, 'hi'))}. Divide by 12 for the monthly amount.` },
    { q: 'Do I lose cost-sharing reductions above 250% of poverty?', a: `Yes. Cost-sharing reductions stop once projected household income for the year is above ${L}% of the poverty guideline, ${usd(at(4))} for four in 2026. You keep the premium tax credit up to ${A.maxPct}%. If you already have a silver plan and lose the reductions during the year, HealthCare.gov says you qualify for a Special Enrollment Period to change to a bronze, silver or gold plan.` },
    { q: 'Should I pick a silver plan if my income is under 250% FPL?', a: `It is the only way to get the cost-sharing reductions you qualify for. HealthCare.gov stresses that the extra savings on deductibles, copayments and coinsurance apply only to silver plans; with a bronze or gold plan you keep the premium tax credit but lose those savings. The lower your income within the range, the larger the reduction, so the gain is biggest well below ${L}%.` },
  ],
  body: (h) => `<h2>The cost-sharing reduction line</h2>
<p>Cost-sharing reductions are the second form of Marketplace help, separate from the premium tax credit. According to ${h.ext(csrUrl, 'HealthCare.gov')}, they lower the deductible, the copayments or coinsurance and the out-of-pocket maximum, and they apply only if you enroll in a silver plan. They are available up to ${L}% of the poverty guideline, measured on your income estimate for the coverage year. HealthCare.gov illustrates the effect with a silver plan whose $750 deductible could drop to $300 or $500, and an out-of-pocket maximum of $5,000 that could fall to $3,000; the real figures depend on the plan and on how far below the line your income is.</p>
${h.table(['Household size', '250% per year (2025 chart)', 'Per month', 'Benchmark cost at 250%, per month', 'Alaska, per year', 'Hawaii, per year'], rows, `${L}% of the 2025 HHS guidelines, the reference for 2026 Marketplace coverage. Benchmark cost: ${pct(apct(L))} of income, the 2026 applicable percentage at ${L}%.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Two bands of the 2026 credit meet here</h2>
<p>The premium tax credit makes the benchmark silver plan cost a set share of income, the applicable percentage published in ${h.src('irsRp2525', 'IRS Rev. Proc. 2025-25')}. Between ${b1[0]}% and ${b1[1]}% of poverty it climbs from ${pct(b1[2])} to ${pct(b1[3])}; between ${b2[0]}% and ${b2[1]}%, from ${pct(b2[2])} to ${pct(b2[3])}. So at exactly ${L}%, a single adult with ${usd(at(1))} of income is expected to pay ${usd(single.expectedMonthly)} a month. If the benchmark plan costs ${usd(bench)}, the credit is about ${usd(single.creditMonthly)} a month. At 300% of poverty, the same adult would pay ${usd(single300.expectedMonthly)} and get ${usd(single300.creditMonthly)}. The credit fades gradually; the cost-sharing reductions, by contrast, stop at the line.</p>
<p>That makes ${L}% one of the few places where a small raise has a visible cost in 2026. A worker who moves from just under to just over the line keeps nearly the same credit but, on a silver plan, loses the reduced deductible and copays. Updating the income estimate on the Marketplace application when pay changes keeps the help aligned with reality, and avoids a credit taken too high, which since tax year ${A.repaymentCapsRemovedFromTaxYear} must be repaid in full on the tax return.</p>
<h2>250% outside the Marketplace</h2>
<p>Several states draw children's coverage near the same point. In the ${h.src('cmsLevels', 'CMS table of eligibility levels')}, the highest Medicaid or CHIP line for children aged 6 to 18 is between 245% and 255% of poverty in ${listOf(chip250)}, before the 5-point MAGI disregard. Those limits use the 2026 guideline, ${usd(fplAt(4, L))} for a family of four at ${L}%, not the 2025 one. A family in that range can see its children in CHIP and the parents on a silver plan with reduced cost sharing at the same time. The ${h.a('aca-subsidy-calculator', 'ACA subsidy calculator')} computes the credit for your household, the ${h.a('fpl-400-percent', '400% page')} covers the ceiling of the credit, and the ${h.a('federal-poverty-level', 'federal poverty level')} page gives every percentage.</p>`,
  related: ['aca-subsidy-calculator', 'fpl-400-percent', 'fpl-200-percent', 'federal-poverty-level', 'aca-subsidy-cliff'],
  sources: ['irsRp2525', 'healthcareFpl', 'healthcareLowerCosts', 'cmsLevels', 'frPoverty2025'],
  extraSources: [{ name: 'HealthCare.gov, Cost-sharing reductions', url: csrUrl }],
});
