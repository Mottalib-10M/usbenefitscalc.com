import { definePage } from '../../lib/page-types';
import { P, fpl, acaCalc, acaCliff, usd, pct } from '../../lib/kit';

const A = P.aca;
const top = A.requiredContribution2026;
// Worked cases: incomes and benchmark premiums are assumptions for the examples, not quotes.
const under = acaCalc(84000, 2, 1700);
const over = acaCalc(85000, 2, 1700);
const overOld = acaCalc(85000, 2, 1700, 'us', true);
const above = acaCalc(88000, 2, 1700);
const aboveOld = acaCalc(88000, 2, 1700, 'us', true);
const fam = acaCalc(128000, 4, 1800);
const famOver = acaCalc(129000, 4, 1800);
const soloHi = acaCalc(62000, 1, 900);
const soloLo = acaCalc(62000, 1, 450);
const soloLoOld = acaCalc(62000, 1, 450, 'us', true);
const lostYear = under.creditMonthly * 12;

export default definePage({
  id: 'aca-subsidy-cliff',
  group: 'health',
  kind: 'guide',
  order: 60,
  slug: 'aca-subsidy-cliff',
  nav: 'ACA subsidy cliff',
  card: `One dollar over 400% of poverty ends the 2026 credit: ${usd(acaCliff(2))} for a couple`,
  title: `ACA Subsidy Cliff 2026: No Credit Above ${usd(acaCliff(2))} for a Couple`,
  description: `The ACA subsidy cliff is back in 2026: one dollar over 400% of poverty, ${usd(acaCliff(1))} for one or ${usd(acaCliff(4))} for four, ends the premium tax credit. Who it hits.`,
  h1: 'The ACA subsidy cliff at 400% of poverty',
  intro: 'With the end of the enhanced credits, the premium tax credit stops dead at 400% of the poverty line in 2026, and the drop can be worth thousands of dollars.',
  resume: `In 2026 the premium tax credit ends abruptly at 400% of the 2025 poverty guideline: ${usd(acaCliff(1))} of household income for one person, ${usd(acaCliff(2))} for a couple and ${usd(acaCliff(4))} for a family of four. Below that line you pay at most ${pct(top)} of income for the benchmark silver plan; one dollar above it, you pay the full premium. From 2021 to 2025 there was no such cliff, because the temporary table capped everyone's share at 8.5% of income. The loss is largest where the benchmark premium is high relative to income, typically for older enrollees and in expensive areas. A couple earning ${usd(84000)} with an assumed ${usd(1700)} benchmark receives ${usd(under.creditMonthly)} a month; at ${usd(85000)} they receive nothing, about ${usd(lostYear)} a year lost for ${usd(1000)} of extra income. Because excess advance payments are repaid in full from tax year ${A.repaymentCapsRemovedFromTaxYear}, crossing the line by surprise means paying back the whole year's credit.`,
  mini: 'cliffCompare',
  faqs: [
    { q: 'What happens if my income is just over 400% of the poverty level in 2026?', a: `You lose the whole premium tax credit, not just part of it. At ${usd(acaCliff(1))} for one person or ${usd(acaCliff(2))} for two, the credit stops; there is no phase-out. You can still buy a Marketplace plan at the full price. If you received advance payments during the year, you repay them all on your ${A.repaymentCapsRemovedFromTaxYear} return, since section 71305 of Public Law 119-21 ended the repayment caps.` },
    { q: 'Can contributing to a 401(k) keep me under the ACA subsidy cliff?', a: `It can, because the test uses modified adjusted gross income. Pre-tax contributions to a traditional 401(k) or 403(b) are left out of taxable wages, and deductible contributions to a traditional IRA are an adjustment to income, so both lower AGI and therefore MAGI. Roth contributions do not. The couple in our example at ${usd(85000)} would be back under ${usd(acaCliff(2))} with a few hundred dollars of pre-tax savings.` },
    { q: 'Do I have to repay my whole subsidy if I end up over 400% FPL?', a: `Yes. If your final MAGI for ${A.year} is above 400% of the 2025 guideline, your allowed credit is zero, and every dollar of advance credit paid to your insurer becomes extra tax on Form 8962. From tax year ${A.repaymentCapsRemovedFromTaxYear} there is no cap on that repayment for anyone. Reporting a raise or a new job to the Marketplace as soon as it happens limits the damage.` },
    { q: 'Does Social Security count toward the 400% subsidy limit?', a: `All of it does, including the part that is not taxed. MAGI for the premium tax credit is adjusted gross income plus non-taxable Social Security benefits, tax-exempt interest and untaxed foreign income, as HealthCare.gov defines it. SSI is not counted. A retired couple with pensions, benefits and municipal bond interest can therefore pass ${usd(acaCliff(2))} even if their taxable income looks lower.` },
    { q: 'Is the subsidy cliff higher in Alaska and Hawaii?', a: `Yes, because the two states have their own, higher poverty guidelines. For 2026 coverage the 400% line is ${usd(acaCliff(1, 'ak'))} for one person and ${usd(acaCliff(4, 'ak'))} for four in Alaska, ${usd(acaCliff(1, 'hi'))} and ${usd(acaCliff(4, 'hi'))} in Hawaii, against ${usd(acaCliff(1))} and ${usd(acaCliff(4))} elsewhere. The applicable percentages are the same, so the share of income expected for the benchmark plan just under the line is ${pct(top)} in every state.` },
  ],
  body: (h) => {
    const rows = [1, 2, 3, 4, 5, 6].map((n) => [`${n}`, usd(acaCliff(n)), usd(acaCliff(n) / 12), usd(acaCliff(n, 'ak')), usd(acaCliff(n, 'hi'))]);
    return `<h2>Where the line falls</h2>
<p>The premium tax credit has always had an upper income limit in the statute: household income may not exceed 400% of the poverty line. The American Rescue Plan suspended that limit for 2021 and 2022, as the ${h.src('irsPtcBasics', 'IRS explains')}, and later legislation carried the suspension through 2025. That temporary rule applied only to taxable years beginning before January 1, 2026. It was not renewed, so the limit is back for 2026, together with the permanent table of the ${h.src('irsRp2525', 'IRS for 2026')}. HealthCare.gov now describes the credit as available between 100% and 400% of the poverty level (${h.src('healthcareFpl', 'glossary')}).</p>
<p>The guideline used is the 2025 one, ${usd(fpl(1, 'us', 2025))} for one person plus ${usd(fpl(2, 'us', 2025) - fpl(1, 'us', 2025))} for each extra person. The cliff therefore sits at these yearly incomes for 2026 coverage:</p>
${h.table(['Household size', '48 states and DC', 'Per month', 'Alaska', 'Hawaii'], rows, '400% of the 2025 HHS poverty guidelines: the highest household MAGI that still qualifies for a 2026 premium tax credit.', ['l', 'r', 'r', 'r', 'r'])}
<h2>One thousand dollars, twelve thousand lost</h2>
<p>A cliff is different from a phase-out. Below 400%, the share of income you are expected to pay for the benchmark plan tops out at ${pct(top)}, and the credit covers the rest of the premium, however large. At 400.01%, the credit is zero. Take a couple whose benchmark silver premium is ${usd(1700)} a month, an assumption that fits older enrollees in a high-cost area. At ${usd(84000)} of MAGI, ${Math.round(under.fplPct)}% of poverty, they are expected to pay ${usd(under.expectedMonthly)} a month and the credit covers ${usd(under.creditMonthly)}. At ${usd(85000)}, ${Math.round(over.fplPct)}% of poverty, they pay the full ${usd(1700)}. A raise of ${usd(1000)} costs them about ${usd(lostYear)} a year in premium help, which no tax bracket comes close to.</p>
<p>A family of four shows the same jump at a higher income. With an assumed ${usd(1800)} benchmark, ${usd(128000)} of income brings a credit of ${usd(fam.creditMonthly)} a month and ${usd(129000)} brings ${usd(famOver.creditMonthly)}. Try other figures in the mini-calculator above; it puts the expired table next to the 2026 one for the same household.</p>
<h2>Who is hit hardest</h2>
<p>The size of the drop equals the credit you had just below the line, which is the benchmark premium minus ${pct(top)} of income. Two things make it large: a high benchmark premium, and income that is high enough to reach 400% but not high enough to make the premium feel small. Marketplace premiums rise with age, so people in their fifties and early sixties, before Medicare, face the biggest benchmarks. Premiums also vary a lot by area, so the same income can mean a large credit in one county and none in another.</p>
<p>A single person at ${usd(62000)}, just under the ${usd(acaCliff(1))} cliff, illustrates it. With an assumed benchmark of ${usd(900)} a month the credit is ${usd(soloHi.creditMonthly)}; with ${usd(450)}, a level more typical of a younger enrollee, it is ${usd(soloLo.creditMonthly)}, because ${pct(top)} of income already exceeds the premium. That younger person barely notices the cliff. Under the expired table, the same younger person would have received ${usd(soloLoOld.creditMonthly)}: the 8.5% cap mattered mostly to those with expensive premiums.</p>
<h2>What the old rules gave</h2>
<p>From 2021 to 2025 nobody paid more than 8.5% of income for the benchmark plan, whatever the income. The couple at ${usd(85000)} would have received ${usd(overOld.creditMonthly)} a month under that table, and at ${usd(88000)} still ${usd(aboveOld.creditMonthly)}, where the 2026 rules give ${usd(above.creditMonthly)}. That is the change most households near the line will see when they compare their 2025 and 2026 statements.</p>
<h2>Keeping MAGI under the line</h2>
<p>MAGI is adjusted gross income plus untaxed foreign income, non-taxable Social Security and tax-exempt interest. Anything that legitimately lowers AGI therefore lowers MAGI. AGI is total income minus certain adjustments, such as IRA contributions and student loan interest (${h.src('healthcareFpl', 'HealthCare.gov')}), and pre-tax contributions to an employer retirement plan never reach taxable wages in the first place. Roth contributions, by contrast, come out of taxed income and do not help. Because the test uses the income for the whole calendar year, a contribution made late in the year counts as much as one made in January, within the plan's own deadlines.</p>
<p>The other lever is timing. The credit is computed on the income of the tax year, so income that shifts from one year to the next shifts the test too. A tax professional can weigh the trade-offs, which depend on your whole situation. What does not work is leaving income out of the estimate: the credit is settled on the return, and from tax year ${A.repaymentCapsRemovedFromTaxYear} every dollar of excess advance payment comes back, without the caps that used to protect households under 400%.</p>
<h2>Estimating your income near the line</h2>
<p>HealthCare.gov suggests starting from your most recent adjusted gross income and adjusting it for the income and household changes you expect in the coverage year. Near the cliff, the household part deserves as much care as the income part. Each additional person in the tax household raises the line by ${usd(acaCliff(3) - acaCliff(2))} for 2026 coverage, so a baby born during the year, or a parent you start claiming as a dependent, can move a family back under 400%. The reverse also happens: a child who files alone and is no longer your dependent lowers your line.</p>
<p>Two filing rules matter as well. A married couple must file jointly to claim the credit, apart from exceptions for victims of domestic abuse or spousal abandonment, and a person who can be claimed as a dependent by someone else cannot claim it at all (${h.src('irsPtcBasics', 'IRS')}). Splitting incomes between two separate returns is therefore not a way around the cliff.</p>
<h2>Other changes that touch the same households</h2>
<p>${h.src('obbba', 'Public Law 119-21')} adds three more conditions. Plans bought in a special enrollment period opened only because of low expected income no longer qualify for the credit, for plan years after 2025 (section 71304). For tax years after 2027, a month counts for the credit only if the Marketplace has verified income, household size, immigration status, other coverage and residence for it, before or after the fact (section 71303). And from ${A.immigrantPtcLimitFromTaxYear} the credit is reserved for citizens, green card holders, Cuban and Haitian entrants and COFA migrants (section 71301), a change covered in ${h.a('benefits-for-immigrants', 'benefits for immigrants')}.</p>
<p>For the full calculation at any income, use the ${h.a('aca-subsidy-calculator', 'ACA subsidy calculator')}; for the figure itself, see ${h.a('fpl-400-percent', '400% of the poverty level')}. At the other end of the scale, the move from Medicaid to the credit is described in ${h.a('medicaid-expansion-states', 'Medicaid expansion states')}.</p>`;
  },
  related: ['aca-subsidy-calculator', 'fpl-400-percent', 'medicaid-expansion-states', 'benefits-for-immigrants', 'medicaid-income-limits'],
  sources: ['irsRp2525', 'irsPtcBasics', 'healthcareFpl', 'obbba'],
});
