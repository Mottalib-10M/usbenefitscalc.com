import { definePage } from '../../lib/page-types';
import { P, STATES, snapMax, snapMaxPrev, snapStd, snapCalc, sua, usd, usdx, day } from '../../lib/kit';

const sp = P.snap;
const nNoBbce = STATES.filter((s) => !s.snap.bbce.length).length;
// Worked case shown in the answer block and the body: three people in Ohio, $2,000 of earnings, $950 rent.
const ex = snapCalc('ohio', { size: 3, earned: 2000, housing: 950 });
const exNoUtil = snapCalc('ohio', { size: 3, earned: 2000, housing: 950, utilities: 0 });
const solo = snapCalc('florida', { size: 1, unearned: 1100, housing: 800, elderlyDisabled: true });

export default definePage({
  id: 'snap-calculator',
  group: 'food',
  kind: 'pillar',
  order: 10,
  slug: 'snap-calculator',
  nav: 'SNAP calculator',
  card: `Your monthly food benefit with FY ${sp.fy} amounts and your state's options`,
  title: `SNAP Calculator 2027: How Much Food Stamps You Will Get`,
  description: `SNAP calculator with FY ${sp.fy} amounts (from October 1, 2026): up to ${usd(snapMax(4))} a month for 4, your state's income test and utility allowance, every deduction shown.`,
  h1: 'SNAP calculator: how much you will get in food stamps',
  intro: `The amounts changed on ${day(sp.from)}. Enter your household and see the benefit line by line, with the rules of your state.`,
  resume: `SNAP pays the maximum allotment for your household size minus 30% of your net income. For fiscal year ${sp.fy}, which runs from ${day(sp.from)} to ${day(sp.to)}, the maximum is ${usd(snapMax(1))} for one person, ${usd(snapMax(3))} for three and ${usd(snapMax(4))} for four in the 48 states and DC. Net income is what is left after a 20% cut on earnings, the standard deduction of ${usd(snapStd(1))}, child care, child support you pay, some medical costs and the shelter deduction. In Ohio, a family of three earning ${usd(2000)} a month and paying ${usd(950)} in rent with heating bills ends up with ${usd(ex.net)} of net income and an estimated ${usd(ex.benefit)} a month. The same family gets ${usd(exNoUtil.benefit)} if it pays no utilities, which shows how much the state's utility allowance weighs. The calculator applies your state's gross income test and allowance, and shows each step so you can check it against your notice.`,
  tool: 'snap',
  toolProps: { state: 'ohio', size: 3, income: 2000 },
  faqs: [
    { q: 'How much food stamps will I get if I have no income at all?', a: `The full maximum for your household size: ${usd(snapMax(1))} a month for one person, ${usd(snapMax(2))} for two and ${usd(snapMax(4))} for four in fiscal year ${sp.fy}. With zero net income, 30% of net income is zero, so nothing is subtracted. Alaska and Hawaii have higher maximums, ${usd(snapMax(4, 'hi'))} for four in Hawaii. Households with little or no income and cash can ask for expedited service, which speeds up the first payment.` },
    { q: 'Why did my SNAP benefit change in October 2026?', a: `Every October 1 USDA adjusts the maximum allotments and deductions. For fiscal year ${sp.fy} the maximum for four went from ${usd(snapMaxPrev(4))} to ${usd(snapMax(4))}, the standard deduction for small households from ${usd(sp.previous.standardDeductionUs[0])} to ${usd(snapStd(1))} and the shelter cap from ${usd(sp.previous.shelterCapUs)} to ${usd(sp.shelterCap.us)}. Your state may also have updated its utility allowance. A raise in your own income since your last report can pull the other way.` },
    { q: 'Does the SNAP calculator count my rent and utility bills?', a: `Yes, through the shelter deduction. Rent or mortgage, property tax and home insurance are added to your state's utility allowance, then half of your remaining income is subtracted. What is left is deducted, up to ${usd(sp.shelterCap.us)} a month, with no cap if someone is 60 or older or disabled. In Ohio the heating and cooling allowance is ${usdx(sua('ohio', 3) ?? 0)} a month.` },
    { q: 'What is the smallest SNAP benefit a person can get?', a: `An eligible household of one or two people gets at least ${usd(sp.minBenefit.us)} a month in the 48 states and DC in fiscal year ${sp.fy}, even when the formula gives less. Larger households have no minimum: if 30% of their net income is above the maximum allotment, the result is zero even though they pass the income tests.` },
    { q: 'Do I report my income before or after taxes for SNAP?', a: 'Before taxes. SNAP starts from gross income: wages before withholding, Social Security before the Medicare premium, unemployment before tax. The program then removes its own deductions, including 20% of earnings, which roughly stands in for payroll taxes and work costs. Self-employed people report receipts minus the costs of doing business.' },
    { q: 'Is the SNAP amount from this calculator what the state will pay?', a: `It is an estimate built on the official amounts and your state's published options. The agency decides after checking pay stubs, rent, household members and, in some states, assets. Differences usually come from income averaged over several months, a utility allowance you do not qualify for, or deductions the calculator did not know about. The line-by-line breakdown helps you spot where your notice differs.` },
  ],
  body: (h) => `<h2>What the calculator does with your figures</h2>
<p>It follows the order a caseworker uses. First the tests: in most states gross income must be under ${h.a('snap-income-limits', 'the state income limit')}, between 130% and 200% of the poverty guideline depending on the state, and in the ${nNoBbce} states without broad-based categorical eligibility net income must also stay under 100% and assets under ${usdx(sp.assets.general)}. Then the deductions, then the benefit. A household with someone 60 or older or disabled skips the gross income test and keeps its whole shelter deduction; the calculator asks that question because it changes both steps.</p>
<p>For the Ohio family of the answer above, the steps are: ${usd(ex.gross)} of gross income, minus ${usd(ex.deductions.earned)} for the earned income deduction and ${usd(ex.deductions.standard)} of standard deduction, leaves ${usd(ex.adjusted)}. Rent of ${usd(950)} plus the ${usdx(sua('ohio', 3) ?? 0)} utility allowance makes ${usd(ex.shelterCosts)} of shelter costs, of which ${usd(ex.deductions.shelter)} exceeds half the adjusted income. Net income: ${usd(ex.net)}. Thirty percent of it is ${usd(ex.thirtyPercent)}, and ${usd(ex.maxAllotment)} minus ${usd(ex.thirtyPercent)} gives ${usd(ex.benefit)}.</p>
<h2>The inputs that move the result most</h2>
<p><strong>Utilities.</strong> Paying a heating or cooling bill, even part of it, usually entitles you to the full heating and cooling allowance, which is the largest. Paying only water, trash or a phone gives a smaller one. Since the 2025 budget law, a small energy assistance payment no longer unlocks the large allowance unless someone in the household is 60+ or disabled (${h.src('obbbSnap', 'USDA memo of September 4, 2025')}), and internet costs can no longer be counted at all.</p>
<p><strong>Earnings against other income.</strong> A dollar of wages counts as 80 cents because of the 20% deduction; a dollar of Social Security or unemployment counts in full. Two households with the same total income can therefore get different amounts.</p>
<p><strong>Age and disability.</strong> For a woman of 70 living alone in Florida on ${usd(1100)} of Social Security with ${usd(800)} in rent, the uncapped shelter deduction brings net income down to ${usd(solo.net)} and the estimate to ${usd(solo.benefit)}. Out-of-pocket medical costs above ${usd(sp.medicalThreshold)} a month would raise it further; see ${h.a('snap-for-seniors', 'SNAP for seniors')}.</p>
<h2>When the estimate and your notice disagree</h2>
<p>Agencies average irregular pay, count income you expect in the coming months, and sometimes do not give the utility allowance unless you show a bill. Ask for the budget sheet that shows how your benefit was computed: it lists the same lines as this calculator, so the difference is usually easy to find. You can ask for a fair hearing if you think the agency made a mistake; the deadline is printed on the notice.</p>
<p>Your state may use its own name for SNAP, such as CalFresh in California or Basic Food in Washington. Each ${h.a('states', 'state page')} gives the name, the agency, the online application and the full tables.</p>`,
  related: ['snap-income-limits', 'snap-deductions', 'snap-benefit-amounts', 'snap-eligibility', 'state:ohio', 'state:florida'],
  sources: ['usdaCola27', 'fnaBbce', 'fnaSua', 'cfr2739', 'cfr27310', 'obbbSnap'],
});
