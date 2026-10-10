import { definePage } from '../../lib/page-types';
import { P, EITC26, EITC25, eitcCalc, usd, pct } from '../../lib/kit';

const E = P.eitc;
const y26 = E['2026'];
const y25 = E['2025'];
const kids = [0, 1, 2, 3];
const col = (i: number) => (i === 3 ? '3 or more' : i === 0 ? 'No child' : i === 1 ? '1 child' : '2 children');
// Worked cases (hypothetical earnings, amounts of tax year 2026 unless stated).
const parent2 = eitcCalc(2, 25000);
const parent2y25 = eitcCalc(2, 25000, false, 2025);
const couple1 = eitcCalc(1, 40000, true);
const solo = eitcCalc(0, 12000);
const low3 = eitcCalc(3, 10000);
const plateau1 = eitcCalc(1, 18000);
const rows26 = [
  ['Credit rate (phase-in)', ...kids.map((k) => pct(E.phaseIn[k]))],
  ['Earned income amount (maximum reached)', ...kids.map((k) => usd(y26.earnedIncomeAmount[k]))],
  ['Maximum credit', ...kids.map((k) => `<strong>${usd(y26.maxCredit[k])}</strong>`)],
  ['Phaseout rate', ...kids.map((k) => pct(E.phaseOut[k]))],
  ['Phaseout begins: single, head of household, other', ...kids.map((k) => usd(y26.thresholdSingle[k]))],
  ['Credit ends: single, head of household, other', ...kids.map((k) => usd(y26.completedSingle[k]))],
  ['Phaseout begins: married filing jointly', ...kids.map((k) => usd(y26.thresholdJoint[k]))],
  ['Credit ends: married filing jointly', ...kids.map((k) => usd(y26.completedJoint[k]))],
];
const rows25 = [
  ['Maximum credit', ...kids.map((k) => usd(y25.maxCredit[k]))],
  ['Credit ends: single, head of household, other', ...kids.map((k) => usd(y25.completedSingle[k]))],
  ['Credit ends: married filing jointly', ...kids.map((k) => usd(y25.completedJoint[k]))],
  ['Change in the maximum for 2026', ...kids.map((k) => `+${usd(EITC26.maxCredit[k] - EITC25.maxCredit[k])}`)],
];
const qcUrl = 'https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit/qualifying-child-rules';
const mainUrl = 'https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc';

export default definePage({
  id: 'eitc-calculator',
  group: 'cash',
  kind: 'pillar',
  order: 300,
  slug: 'eitc-calculator',
  nav: 'EITC calculator',
  card: `Earned income credit for 2026 and 2025: up to ${usd(y26.maxCredit[3])} with three children`,
  title: `EITC Calculator 2026: Up to ${usd(y26.maxCredit[3])} With Three Children`,
  description: `EITC calculator for tax year 2026: up to ${usd(y26.maxCredit[0])} with no child and ${usd(y26.maxCredit[3])} with three children, fully phased out at ${usd(y26.completedJoint[3])} for couples. 2025 amounts too.`,
  h1: 'EITC calculator: your earned income credit for 2026 and 2025',
  intro: 'Enter your earnings, your filing status and your children: the credit is computed with the IRS amounts for each tax year, stage by stage.',
  resume: `For tax year 2026, the earned income tax credit pays up to ${usd(y26.maxCredit[0])} to a worker without a qualifying child, ${usd(y26.maxCredit[1])} with one child, ${usd(y26.maxCredit[2])} with two and ${usd(y26.maxCredit[3])} with three or more. The credit grows with each dollar earned until the earned income amount (${usd(y26.earnedIncomeAmount[2])} with two children), stays flat, then shrinks once income passes ${usd(y26.thresholdSingle[2])} for a single parent or ${usd(y26.thresholdJoint[2])} for a married couple filing jointly. It disappears at ${usd(y26.completedSingle[3])} for a single filer with three children and ${usd(y26.completedJoint[3])} for a couple. A single parent of two earning ${usd(25000)} gets about ${usd(parent2.credit)}. Investment income above ${usd(y26.investmentIncomeLimit)} rules the credit out, and a worker with no child must be ${E.childlessAgeMin} to ${E.childlessAgeMax}. The 2026 credit is claimed on the return filed in 2027; for the 2025 return, filed in 2026, the maximum is ${usd(y25.maxCredit[3])}.`,
  tool: 'eitc',
  faqs: [
    { q: 'How much is the earned income credit with 2 kids in 2026?', a: `Up to ${usd(y26.maxCredit[2])}. A parent of two reaches that maximum with ${usd(y26.earnedIncomeAmount[2])} of earned income and keeps it until income passes ${usd(y26.thresholdSingle[2])} (single or head of household) or ${usd(y26.thresholdJoint[2])} (married filing jointly). After that it falls by ${pct(E.phaseOut[2])} of each extra dollar and ends at ${usd(y26.completedSingle[2])} or ${usd(y26.completedJoint[2])}. With ${usd(25000)} of wages, a single parent gets about ${usd(parent2.credit)}.` },
    { q: 'What is the income limit for the EITC in 2026?', a: `It depends on children and filing status. For a single filer or head of household: ${usd(y26.completedSingle[0])} with no child, ${usd(y26.completedSingle[1])} with one, ${usd(y26.completedSingle[2])} with two and ${usd(y26.completedSingle[3])} with three or more. Married couples filing jointly can earn more: ${usd(y26.completedJoint[0])} to ${usd(y26.completedJoint[3])}. The test uses the larger of adjusted gross income and earned income.` },
    { q: 'Can I get the EITC with no children if I am under 25?', a: `No, not under the current rules. To claim the credit without a qualifying child you must be at least ${E.childlessAgeMin} and under ${E.childlessAgeMax + 1} at the end of the tax year, have lived in the United States more than half the year and not be someone else's qualifying child or dependent. On a joint return, one spouse meeting the age rule is enough. The maximum for this group is ${usd(y26.maxCredit[0])} in 2026.` },
    { q: 'When will I get my EITC refund?', a: `Not before mid-February: by law the IRS must hold refunds on returns that claim the earned income credit until then, even if you file in January. That applies to the 2025 credit claimed in 2026 and to the 2026 credit claimed on the return you file in 2027. The hold covers the whole refund on such a return, not only the part that comes from the credit.` },
    { q: 'Does investment income stop me from getting the EITC?', a: `Only above a limit: ${usd(y26.investmentIncomeLimit)} for tax year 2026 and ${usd(y25.investmentIncomeLimit)} for 2025. Below it, investment income does not reduce the credit gradually; above it, section 32(i) of the tax code allows no credit at all, whatever your earnings and children. The calculator asks for it for that reason and shows a zero with the reason when you cross it.` },
    { q: 'Can I claim the EITC if I am married filing separately?', a: 'Yes, in a narrow case. You must have a qualifying child who lived with you more than half the year, and either you lived apart from your spouse for the last 6 months of the year, or you were legally separated under a written agreement or decree and did not live together at year end. Married people who do not meet these conditions must file jointly to claim the credit.' },
    { q: 'Does an EITC refund count against SSI benefits?', a: `No. Social Security does not count refundable federal tax credits as income for SSI, and it ignores earned income tax credit payments as a resource for 12 months after you receive them. A person on SSI who works and gets a refund can therefore keep it in the bank for a year without crossing the ${usd(P.ssi.resourceIndividual)} resource limit because of it.` },
  ],
  body: (h) => `<h2>The 2026 EITC table</h2>
<p>The amounts below come from section 3.06 of ${h.src('irsRp2532', 'IRS Revenue Procedure 2025-32')}, which adjusts the credit for inflation for tax years beginning in 2026. The two rates are written in the law itself, section 32(b) of the Internal Revenue Code, and do not change from year to year.</p>
${h.table(['Tax year 2026', ...kids.map(col)], rows26, 'Earned income tax credit, tax year 2026 (returns filed in 2027). The phaseout tests the larger of adjusted gross income and earned income.', ['l', 'r', 'r', 'r', 'r'])}
<p>The "earned income amount" is where the credit tops out, and the "threshold phaseout amount" is where it starts to decline. Married couples filing jointly see the phaseout begin ${usd(y26.thresholdJoint[1] - y26.thresholdSingle[1])} later than other filers, the increase written into section 32(b)(2)(B) and adjusted for inflation. The IRS turns these figures into look-up tables printed in the Form 1040 instructions. Those tables work in small income bands, so the amount on your return can differ by a few dollars from the exact formula the calculator uses.</p>
<h2>How the credit is computed, with examples</h2>
<p>The formula has three stages. In the phase-in, the credit equals a share of earnings: ${pct(E.phaseIn[0])} with no child, ${pct(E.phaseIn[1])} with one, ${pct(E.phaseIn[2])} with two and ${pct(E.phaseIn[3])} with three or more. On the plateau it equals the maximum. In the phaseout, the maximum is reduced by ${pct(E.phaseOut[1])} (one child), ${pct(E.phaseOut[2])} (two or more) or ${pct(E.phaseOut[0])} (no child) of income above the threshold.</p>
<p><strong>A single parent of three earning ${usd(10000)}.</strong> Still in the phase-in: ${pct(E.phaseIn[3])} of ${usd(10000)} gives ${usd(low3.credit)}. Every extra dollar of pay up to ${usd(y26.earnedIncomeAmount[3])} adds ${Math.round(E.phaseIn[3])} cents of credit.</p>
<p><strong>A single parent of one earning ${usd(18000)}.</strong> Past the earned income amount of ${usd(y26.earnedIncomeAmount[1])} and below the threshold of ${usd(y26.thresholdSingle[1])}: the full ${usd(plateau1.credit)}.</p>
<p><strong>A single parent of two earning ${usd(25000)}.</strong> The maximum of ${usd(parent2.maxCredit)} is reduced by ${pct(E.phaseOut[2])} of the ${usd(25000 - parent2.threshold)} above ${usd(parent2.threshold)}, leaving about ${usd(parent2.credit)}. The same household got ${usd(parent2y25.credit)} for 2025.</p>
<p><strong>A married couple with one child earning ${usd(40000)} together.</strong> The joint threshold of ${usd(couple1.threshold)} applies, and the ${usd(40000 - couple1.threshold)} above it costs ${pct(E.phaseOut[1])}, so the credit is about ${usd(couple1.credit)}.</p>
<p><strong>A 30-year-old with no child earning ${usd(12000)}.</strong> The small credit for workers without children peaks at ${usd(y26.maxCredit[0])} and starts falling at ${usd(y26.thresholdSingle[0])}; at ${usd(12000)} it is about ${usd(solo.credit)}.</p>
<h2>The 2025 amounts, for the return filed in 2026</h2>
<p>If you are still preparing or amending a 2025 return, use the figures the IRS published in its ${h.src('irsEitcTables', 'earned income and EITC tables')}. The investment income limit for 2025 was ${usd(y25.investmentIncomeLimit)}.</p>
${h.table(['Tax year 2025', ...kids.map(col)], rows25, 'Earned income tax credit, tax year 2025. The calculator derives the 2025 thresholds from these amounts and the statutory rates.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Who can claim it: children, age and the basic rules</h2>
<p>Everyone who claims the credit must have earned income, investment income under the limit, a valid Social Security number issued by the due date of the return (including extensions), and U.S. citizenship or resident alien status for the whole year; filing Form 2555 for foreign earned income rules it out (${h.src('irsEitcWho', 'IRS, who qualifies')}). A Social Security number issued only to receive a federally funded benefit, without work authorization, does not count.</p>
<p>A child counts only if the four tests of the ${h.ext(qcUrl, 'IRS qualifying child rules')} are met. <strong>Age:</strong> under 19 at the end of the year and younger than you, or under 24 and a full-time student for at least 5 months, or any age if permanently and totally disabled. <strong>Relationship:</strong> son, daughter, stepchild, adopted or eligible foster child, brother, sister, half-sibling or step-sibling, grandchild, niece or nephew. <strong>Residency:</strong> living with you in the United States for more than half the year; a homeless shelter counts as a home. <strong>Joint return:</strong> the child cannot file a joint return to claim credits. The child also needs a valid Social Security number, and only one person can claim the same child; tie-breaker rules favor the parent the child lived with longer, then the parent with the higher AGI.</p>
<p>Without a qualifying child, the conditions are narrower: age ${E.childlessAgeMin} to ${E.childlessAgeMax} at the end of the year (one spouse is enough on a joint return), main home in the United States for more than half the year, and not being claimable as someone else's qualifying child or dependent. A parent who loses a child to the tie-breaker rules may still claim this smaller credit.</p>
<h2>A refundable credit with a February hold</h2>
<p>The credit first reduces the tax you owe, and whatever is left is paid to you as a refund, so a worker who owes little or no income tax can still receive it. The ${h.ext(mainUrl, 'IRS reminds filers')} that by law it must wait until mid-February to issue refunds on returns claiming it. The 2026 credit described above will be claimed on the 2026 return, filed in 2027.</p>
<p>The credit sits outside the poverty guidelines entirely: HHS lists it among the programs that do not use them, which is why its brackets look nothing like the ${h.a('federal-poverty-level', 'federal poverty level')}. It interacts with other benefits mainly through savings rules. For ${h.a('ssi-payment-amount', 'SSI')}, a refund is not income and the EITC part is not counted as a resource for 12 months. Families with children may also be owed the child tax credit, which ${h.src('irsRp2532', 'Revenue Procedure 2025-32')} sets at up to $2,200 per child for 2026, of which up to $1,700 can be refunded. To see how your earnings play against food and health programs at the same time, try the ${h.a('home', 'benefits screener')}.</p>`,
  related: ['federal-poverty-level', 'ssi-payment-amount', 'snap-calculator', 'aca-subsidy-calculator', 'home'],
  sources: ['irsRp2532', 'irsEitcTables', 'irsEitcWho', 'hhsPoverty', 'ssaSsiResources', 'ssaSsiIncome'],
  extraSources: [
    { name: 'IRS, Qualifying child rules for the EITC', url: qcUrl },
    { name: 'IRS, Earned Income Tax Credit (refund timing)', url: mainUrl },
  ],
});
