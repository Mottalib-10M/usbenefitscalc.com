import { definePage } from '../../lib/page-types';
import { P, ssiCalc, usd, usdx, pct } from '../../lib/kit';

const S = P.ssi;
// Worked cases (hypothetical monthly incomes).
const ssOnly = ssiCalc(0, 300);
const wageOnly = ssiCalc(317, 0);
const mixed = ssiCalc(500, 600);
const coupleSs = ssiCalc(0, 900, true);
const wage1200 = ssiCalc(1200, 0);
// Income at which the federal payment reaches zero.
const zeroUnearned = S.individual + S.generalExclusion;
const zeroEarned = (S.individual * 100) / S.earnedShareCounted + S.generalExclusion + S.earnedExclusion;
const zeroUnearnedCouple = S.couple + S.generalExclusion;
const cases = [
  ['Social Security of ' + usd(300), usd(300), usd(ssOnly.countable), `<strong>${usdx(ssOnly.payment)}</strong>`],
  ['Wages of ' + usd(317), usd(317), usd(wageOnly.countable), `<strong>${usdx(wageOnly.payment)}</strong>`],
  [`Wages of ${usd(1200)}`, usd(1200), usdx(wage1200.countable), `<strong>${usdx(wage1200.payment)}</strong>`],
  [`Social Security of ${usd(600)} and wages of ${usd(500)}`, usd(1100), usdx(mixed.countable), `<strong>${usdx(mixed.payment)}</strong>`],
  [`Couple, Social Security of ${usd(900)} together`, usd(900), usd(coupleSs.countable), `<strong>${usdx(coupleSs.payment)}</strong>`],
];

export default definePage({
  id: 'ssi-payment-amount',
  group: 'cash',
  kind: 'pillar',
  order: 310,
  slug: 'ssi-payment-amount',
  nav: 'SSI payment amount',
  card: `The 2026 federal SSI rate is ${usd(S.individual)} a month; see what is left after your other income`,
  title: `SSI Payment Amount 2026: ${usd(S.individual)} a Month, ${usd(S.couple)} for Couples`,
  description: `SSI payment amount 2026: ${usd(S.individual)} a month for one person and ${usd(S.couple)} for a couple after the ${pct(S.cola)} COLA, how other income lowers it, and the ${usd(S.resourceIndividual)} resource limit.`,
  h1: 'SSI payment amount in 2026 and what your income leaves of it',
  intro: 'The federal rate is the most SSI pays. Your own income, counted after the exclusions, is subtracted from it.',
  resume: `In 2026 the maximum federal SSI payment is ${usd(S.individual)} a month for an eligible individual and ${usd(S.couple)} for an eligible couple, after a ${pct(S.cola)} cost-of-living increase that took effect in January 2026; the rates were ${usd(S.previousIndividual)} and ${usd(S.previousCouple)} in 2025. An essential person living with a recipient adds up to ${usd(S.essentialPerson)}. Few people receive the full rate, because Social Security subtracts countable income: unearned income such as a Social Security benefit, minus a ${usd(S.generalExclusion)} general exclusion, and half of wages above ${usd(S.earnedExclusion)}. A person with a ${usd(300)} Social Security check receives ${usdx(ssOnly.payment)} from SSI; a worker earning ${usd(1200)} a month still gets ${usdx(wage1200.payment)}. The federal payment reaches zero at ${usd(zeroUnearned)} of unearned income or ${usd(zeroEarned)} of wages alone. Countable resources must stay at or under ${usd(S.resourceIndividual)} for one person and ${usd(S.resourceCouple)} for a couple, and some states add a supplement on top.`,
  tool: 'ssi',
  faqs: [
    { q: 'How much will SSI pay me if I also get Social Security?', a: `The federal rate of ${usd(S.individual)} minus your Social Security benefit, plus ${usd(S.generalExclusion)} that is not counted. With a ${usd(300)} benefit, countable income is ${usd(ssOnly.countable)} and SSI pays ${usdx(ssOnly.payment)}, so the two checks total ${usd(300 + ssOnly.payment)}. Once the Social Security benefit reaches ${usd(zeroUnearned)} a month, no federal SSI is left, although a state supplement may continue in some states.` },
    { q: 'How much can I earn from a job and still get SSI in 2026?', a: `With no other income, up to ${usd(zeroEarned - 1)} of gross wages a month still leaves a federal payment. Social Security ignores ${usd(S.generalExclusion)} plus ${usd(S.earnedExclusion)} of earnings and counts only half of the rest, so ${usd(1200)} of pay still leaves ${usdx(wage1200.payment)} of SSI. Students under 22 have an extra exclusion of earnings, up to $2,410 a month in 2026.` },
    { q: 'What was the SSI cost-of-living increase for 2026?', a: `${pct(S.cola)}, effective January 2026, the same percentage as Social Security benefits. The individual rate went from ${usd(S.previousIndividual)} to ${usd(S.individual)} a month, an increase of ${usd(S.individual - S.previousIndividual)}, and the couple rate from ${usd(S.previousCouple)} to ${usd(S.couple)}. SSA raises the unrounded yearly amounts by the COLA, divides by 12 and rounds down to the dollar.` },
    { q: 'Can I have more than $2,000 in the bank and keep SSI?', a: `Not for long. If countable resources are above ${usd(S.resourceIndividual)} (${usd(S.resourceCouple)} for a couple) at the beginning of a month, no SSI is paid for that month. Some money is set aside, though: up to $100,000 in an ABLE account, a tax refund for 12 months, retroactive SSI or Social Security for nine months. Your home and one vehicle used for transportation are not counted.` },
    { q: 'Does living with family lower my SSI check?', a: 'It can. Free or below-cost shelter from the people you live with counts as in-kind support and maintenance, a form of unearned income that reduces the payment. Since September 30, 2024, food is no longer part of that calculation, so meals your family provides no longer cut the check. SSA looks at your actual living arrangement when it decides whether and how much to reduce.' },
    { q: 'Does a married couple on SSI get double the single amount?', a: `No. The couple rate is ${usd(S.couple)} a month in 2026, while two single rates would be ${usd(S.individual * 2)}. SSA subtracts the couple's countable income from the couple rate and divides what remains equally between the two spouses. The resource limit for a couple is ${usd(S.resourceCouple)}, not twice ${usd(S.resourceIndividual)}. A couple with ${usd(900)} of Social Security together receives ${usdx(coupleSs.payment)} of federal SSI.` },
    { q: 'Does my state add money to the SSI check?', a: 'Some states do. SSA notes that some states supplement SSI, and its 2026 income guide shows how a federally administered state supplement is added on top of the federal payment after the same income exclusions. Supplement amounts and the people who qualify vary by state and by living arrangement, so check with SSA or your state social services agency. The calculator on this page shows the federal part only.' },
  ],
  body: (h) => `<h2>The 2026 federal benefit rates</h2>
<p>The ${h.src('ssaSsi', 'SSA table of federal payment amounts')} sets three monthly maximums for 2026: ${usd(S.individual)} for an eligible individual, ${usd(S.couple)} for an eligible individual with an eligible spouse, and ${usd(S.essentialPerson)} for an essential person. SSA does not simply add the COLA to last year's monthly figure. It raises the unrounded yearly amounts by ${pct(S.cola)}, divides by 12 and rounds down to the next whole dollar, so the monthly figures never carry cents. For an individual the result is ${usd(S.individual - S.previousIndividual)} more each month than in 2025, or ${usd((S.individual - S.previousIndividual) * 12)} over the year.</p>
${h.table(['Recipient', '2025, per month', '2026, per month', '2026, per year'], [
    ['Eligible individual', usd(S.previousIndividual), `<strong>${usd(S.individual)}</strong>`, usd(S.individual * 12)],
    ['Eligible couple', usd(S.previousCouple), `<strong>${usd(S.couple)}</strong>`, usd(S.couple * 12)],
  ], `Federal benefit rates before any state supplement. COLA effective January 2026: ${pct(S.cola)}.`, ['l', 'r', 'r', 'r'])}
<p>These are ceilings. The amount actually deposited is the rate minus countable income, and for a couple the result is split equally between the two spouses. A person who receives free shelter from others can also see a lower amount, because SSA treats that help as in-kind support and maintenance, a form of unearned income.</p>
<h2>How your other income lowers the payment</h2>
<p>Social Security applies the exclusions in a fixed order, described in its ${h.src('ssaSsiIncome', 'SSI income guide')} and in ${h.src('cfr4161124', '20 CFR 416.1124')}. The first ${usd(S.generalExclusion)} of almost any income is ignored, starting with unearned income. Unearned income left after that counts dollar for dollar: Social Security, pensions, unemployment, state disability payments, cash from relatives. On earnings, Social Security takes off whatever is left of the ${usd(S.generalExclusion)}, then ${usd(S.earnedExclusion)}, then counts only ${S.earnedShareCounted}% of the remainder. Work is therefore treated far more gently than other income.</p>
${h.table(['Monthly situation (2026)', 'Gross income', 'Countable income', 'Federal SSI'], cases, 'Federal SSI computed with the 2026 rates and the general and earned income exclusions; state supplements not included.', ['l', 'r', 'r', 'r'])}
<p>The first two lines reproduce the examples SSA prints in its 2026 income guide. In the mixed case, the ${usd(600)} of Social Security uses up the ${usd(S.generalExclusion)} exclusion, so ${usd(580)} counts; from the ${usd(500)} of wages, ${usd(S.earnedExclusion)} is set aside and half of the remaining ${usd(500 - S.earnedExclusion)} counts. Many items are not income at all for SSI: SNAP benefits, income tax refunds and refundable tax credits, home energy assistance, need-based help from a state or local government, and loans you must repay. A student under 22 can also exclude earnings up to $2,410 a month and $9,730 a year in 2026.</p>
<h2>The resource limits: ${usd(S.resourceIndividual)} and ${usd(S.resourceCouple)}</h2>
<p>SSI also has an asset test: countable resources of ${usd(S.resourceIndividual)} for one person and ${usd(S.resourceCouple)} for a couple, measured at the start of each month (${h.src('ssaSsiResources', 'SSA, SSI resources')}). Cash, bank accounts, stocks, savings bonds, digital currency, land and some life insurance count. The home you live in, household goods, one vehicle used for transportation, burial spaces, and burial funds of up to $1,500 each for you and your spouse do not. Up to $100,000 in an ABLE account is excluded, federal tax refunds and advance tax credits are ignored for 12 months, and retroactive SSI or Social Security for nine months. Giving away a resource or selling it below its value can cost up to 36 months of benefits. For a child under 18 living with parents, part of the parents' resources is deemed to the child, after leaving out ${usd(S.resourceIndividual)} for one parent or ${usd(S.resourceCouple)} for two.</p>
<h2>State supplements, SNAP and Medicaid</h2>
<p>SSA states that some states supplement SSI. Its income guide shows the mechanics for a federally administered supplement: the federal payment is computed first, then the state amount for the person's living arrangement is added. Amounts differ by state and living arrangement, and this page does not list them; the calculator returns the federal part.</p>
<p>SSI and ${h.a('snap-calculator', 'SNAP')} work together in one direction only. SNAP counts the SSI payment as unearned income under ${h.src('cfr2739', '7 CFR 273.9')}, but SSI does not count SNAP benefits as income. A SNAP household with a member who receives SSI because of disability is treated as having a disabled member, which gives it the medical deduction and a shelter deduction without the usual cap; see ${h.a('snap-for-seniors', 'SNAP for seniors')} for how those deductions work. For health coverage, SSI is left out of MAGI, the income measure used for expansion adults, CHIP and Marketplace plans, according to ${h.src('healthcareFpl', 'HealthCare.gov')}. Medicaid for people on SSI is decided under each state's rules; the ${h.a('medicaid-eligibility', 'Medicaid eligibility')} guide and your ${h.a('states', 'state page')} name the agency to ask.</p>
<p>Unlike most programs on this site, SSI does not use the ${h.a('federal-poverty-level', 'federal poverty level')}: HHS lists it among the cash programs that do not. Working recipients who file a tax return may also be owed the ${h.a('eitc-calculator', 'earned income tax credit')}, which SSI ignores as a resource for 12 months.</p>`,
  related: ['federal-poverty-level', 'snap-for-seniors', 'medicaid-eligibility', 'eitc-calculator', 'snap-calculator'],
  sources: ['ssaSsi', 'ssaSsiIncome', 'ssaSsiResources', 'cfr4161124', 'cfr2739', 'healthcareFpl'],
});
