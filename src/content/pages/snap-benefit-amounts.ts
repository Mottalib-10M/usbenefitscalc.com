import { definePage } from '../../lib/page-types';
import { P, snapMax, snapMaxPrev, snapNet, snapCalc, usd, day } from '../../lib/kit';

const sp = P.snap;
const O = sp.obbb;
type Area = 'ak-urban' | 'ak-rural1' | 'ak-rural2' | 'hi';
// FY 2026 maximum allotments and minimum benefits for Alaska and Hawaii, read in research/usda-snap-cola-fy2026.txt
// (USDA memo of August 14, 2025, source key usdaCola26): sizes 1 to 8, then each additional person.
const PREV: Record<Area, number[]> = {
  'ak-urban': [385, 707, 1015, 1285, 1529, 1838, 2031, 2314, 282],
  'ak-rural1': [491, 901, 1295, 1639, 1950, 2344, 2590, 2950, 360],
  'ak-rural2': [598, 1097, 1576, 1995, 2374, 2853, 3152, 3591, 438],
  hi: [506, 929, 1334, 1689, 2010, 2415, 2668, 3040, 371],
};
const PREV_MIN: Record<Area, number> = { 'ak-urban': 31, 'ak-rural1': 39, 'ak-rural2': 48, hi: 41 };
// Hawaii standard deduction for 1 to 4 people in FY 2026, same memo.
const HI_STD_PREV = 295;
// Guam and U.S. Virgin Islands four-person maximums for FY 2027, read in research/usda-snap-cola-fy2027.txt (usdaCola27).
const GUAM4 = 1507, USVI4 = 1315;
const SIZES = [1, 2, 3, 4, 5, 6, 7, 8];
const pctUp = (a: number, b: number) => (((a - b) / b) * 100).toFixed(1);
const hiDrop = PREV.hi[3] - snapMax(4, 'hi');
// Statutory cap for very large households (FY 2027 memo): 200% of the four-person maximum above the eight-person amount.
const capUs = snapMax(8) + 2 * snapMax(4);
// Worked case: three people in Missouri (federal rules) with $1,500 of wages and $900 rent.
const mo = snapCalc('missouri', { size: 3, earned: 1500, housing: 900 });
const solo = snapCalc('missouri', { size: 1, unearned: 1500, housing: 0, utilities: 0 });
// Benefit of a household sitting exactly on the federal net income line (30% rounded up, as in the engine).
const atLine = (n: number) => snapMax(n) - Math.ceil((snapNet(n) * sp.benefitReductionRate) / 100);

export default definePage({
  id: 'snap-benefit-amounts',
  group: 'food',
  kind: 'guide',
  order: 50,
  slug: 'snap-benefit-amounts',
  nav: 'SNAP benefit amounts',
  card: `Maximum allotments for FY ${sp.fy} by household size, with Alaska, Hawaii and last year's chart`,
  title: `SNAP Maximum Benefit 2027: ${usd(snapMax(4))} for 4, Full Amount Chart`,
  description: `SNAP maximum benefit for FY ${sp.fy}: ${usd(snapMax(1))} for one person and ${usd(snapMax(4))} for four, up ${usd(snapMax(4) - snapMaxPrev(4))}, while Hawaii falls to ${usd(snapMax(4, 'hi'))}. Chart for household sizes 1 to 8 and beyond.`,
  h1: 'SNAP benefit amounts: the maximum allotment chart',
  intro: `The chart that took effect on ${day(sp.from)}, next to the one it replaced, with what the numbers mean for an ordinary household.`,
  resume: `The maximum SNAP benefit for fiscal year ${sp.fy}, from ${day(sp.from)} to ${day(sp.to)}, is ${usd(snapMax(1))} a month for one person, ${usd(snapMax(2))} for two, ${usd(snapMax(3))} for three and ${usd(snapMax(4))} for four in the 48 states and DC, plus ${usd(sp.maxAllotment.us[8])} for each person beyond eight. The four-person amount rose by ${usd(snapMax(4) - snapMaxPrev(4))}, or ${pctUp(snapMax(4), snapMaxPrev(4))}%, from ${usd(snapMaxPrev(4))}. Alaska's three zones rose too, to between ${usd(snapMax(4, 'ak-urban'))} and ${usd(snapMax(4, 'ak-rural2'))} for four, but Hawaii's maximum went down, from ${usd(PREV.hi[3])} to ${usd(snapMax(4, 'hi'))}. Only households with no net income receive the maximum: SNAP subtracts 30% of net income from it, so most families get less. Eligible households of one or two receive at least ${usd(sp.minBenefit.us)}. The amounts follow the cost of the Thrifty Food Plan, which the 2025 budget law now limits to inflation updates until a re-evaluation that cannot raise its cost.`,
  mini: 'snapMaxBySize',
  miniArg: { prev: PREV },
  faqs: [
    { q: 'How much is SNAP for a family of 5 in 2027?', a: `At most ${usd(snapMax(5))} a month in the 48 states and DC for fiscal year ${sp.fy}, up from ${usd(snapMaxPrev(5))}. In Hawaii the maximum for five is ${usd(snapMax(5, 'hi'))} and in urban Alaska ${usd(snapMax(5, 'ak-urban'))}. The actual payment is that maximum minus 30% of the family's net income, so a family of five with ${usd(1000)} of net income would receive ${usd(snapMax(5) - 300)}.` },
    { q: 'Why did the SNAP maximum in Hawaii go down for 2027?', a: `The USDA memo of August 21, 2026, announces that the maximum for a family of four in Hawaii "will decrease" to ${usd(snapMax(4, 'hi'))}, from ${usd(PREV.hi[3])} in fiscal year ${sp.previous.fy}, without giving a reason. Hawaii has its own allotment table, separate from the 48 states. It fell the year before as well. The minimum benefit there went from ${usd(PREV_MIN.hi)} to ${usd(sp.minBenefit.hi)}.` },
    { q: 'Does everyone on SNAP get the maximum amount?', a: `No. The maximum goes only to households whose net income, after all deductions, is zero. Everyone else gets the maximum minus 30% of net income. A family of three in Missouri earning ${usd(1500)} a month with ${usd(900)} rent has ${usd(mo.net)} of net income and an estimated ${usd(mo.benefit)}, against a maximum of ${usd(snapMax(3))}. Households of one or two that qualify get at least ${usd(sp.minBenefit.us)}.` },
    { q: 'How much SNAP can a household of 10 receive?', a: `Up to ${usd(snapMax(10))} a month in the 48 states and DC in fiscal year ${sp.fy}: the eight-person maximum of ${usd(snapMax(8))} plus ${usd(sp.maxAllotment.us[8])} for each extra person. The law caps the total for very large households at ${usd(capUs)}, which is reached at 18 people. In Hawaii a household of ten can receive up to ${usd(snapMax(10, 'hi'))}.` },
    { q: 'Can the Thrifty Food Plan still raise SNAP benefits?', a: `Only through inflation from now on, unless Congress changes the law again. Section 10101 of the 2025 budget law requires a yearly adjustment each October for the change in consumer prices over the 12 months ending in June, and says a re-evaluation of the market baskets cannot increase the plan's cost and may not happen before ${day(O.tfpReevaluationNotBefore)}. This year's rise of ${pctUp(snapMax(4), snapMaxPrev(4))}% for four is that inflation update.` },
  ],
  body: (h) => `<h2>The fiscal year ${sp.fy} chart</h2>
<p>USDA set the new maximum allotments in its ${h.src('usdaCola27', 'cost-of-living memo of August 21, 2026')}. They apply to benefits for October 2026 through September 2027. The first table compares the 48 states and DC with the year before; the per-person column shows that a larger household gets less per head, because each size is set as a fixed share of the four-person amount, a scale the 2025 law wrote into the statute.</p>
${h.table(['Household size', `FY ${sp.fy}`, `FY ${sp.previous.fy}`, 'Change', 'Per person'], [
    ...SIZES.map((n) => [`${n}`, usd(snapMax(n)), usd(snapMaxPrev(n)), `+${usd(snapMax(n) - snapMaxPrev(n))}`, usd(snapMax(n) / n)]),
    ['Each additional person', `+${usd(sp.maxAllotment.us[8])}`, `+${usd(sp.previous.maxAllotmentUs[8])}`, `+${usd(sp.maxAllotment.us[8] - sp.previous.maxAllotmentUs[8])}`, ''],
  ], `Maximum monthly SNAP allotments, 48 states and DC. Sources: USDA FY ${sp.fy} and FY ${sp.previous.fy} COLA memos.`, ['l', 'r', 'r', 'r', 'r'])}
<p>From a single person at ${usd(snapMax(1))} to four people at ${usd(snapMax(4))}, the amount per person falls from ${usd(snapMax(1))} to ${usd(snapMax(4) / 4)}. Beyond eight people each extra member adds ${usd(sp.maxAllotment.us[8])}, which the memo describes as 22 percent of the four-person maximum, and the total for those extra members is capped at twice the four-person maximum. That puts the ceiling at ${usd(capUs)} for a household of 18 or more in the 48 states and DC.</p>
<h2>Alaska and Hawaii</h2>
<p>Alaska has three allotment zones, urban, rural 1 and rural 2, and rural 2 carries the highest amounts in the country. Hawaii has a single table. Both moved in opposite directions this year.</p>
${h.table(['Household size', 'Alaska urban', 'Alaska rural 1', 'Alaska rural 2', `Hawaii FY ${sp.fy}`, `Hawaii FY ${sp.previous.fy}`], [
    ...SIZES.map((n) => [`${n}`, usd(snapMax(n, 'ak-urban')), usd(snapMax(n, 'ak-rural1')), usd(snapMax(n, 'ak-rural2')), usd(snapMax(n, 'hi')), usd(PREV.hi[n - 1])]),
    ['Each additional person', `+${usd(sp.maxAllotment['ak-urban'][8])}`, `+${usd(sp.maxAllotment['ak-rural1'][8])}`, `+${usd(sp.maxAllotment['ak-rural2'][8])}`, `+${usd(sp.maxAllotment.hi[8])}`, `+${usd(PREV.hi[8])}`],
  ], `Maximum monthly allotments for fiscal year ${sp.fy}, with Hawaii's FY ${sp.previous.fy} column for comparison (${h.src('usdaCola26', 'USDA FY 2026 memo')}).`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>In urban Alaska the four-person maximum went from ${usd(PREV['ak-urban'][3])} to ${usd(snapMax(4, 'ak-urban'))}, in rural 1 from ${usd(PREV['ak-rural1'][3])} to ${usd(snapMax(4, 'ak-rural1'))}, and in rural 2 from ${usd(PREV['ak-rural2'][3])} to ${usd(snapMax(4, 'ak-rural2'))}. Per person, a rural 2 household of four can receive up to ${usd(snapMax(4, 'ak-rural2') / 4)}, about twice the ${usd(snapMax(4) / 4)} available in the 48 states. Hawaii lost ${usd(hiDrop)} for a family of four, and every size fell: one person now gets at most ${usd(snapMax(1, 'hi'))} instead of ${usd(PREV.hi[0])}. The memo states the decrease without explaining it, as the fiscal year ${sp.previous.fy} memo did when Hawaii's amount dropped to ${usd(PREV.hi[3])}. For a household whose income did not change, the drop in the maximum passes straight into the benefit. It is softened a little by Hawaii's standard deduction, which rose from ${usd(HI_STD_PREV)} to ${usd(sp.standardDeduction.hi[0])} for one to four people: ${usd(sp.standardDeduction.hi[0] - HI_STD_PREV)} less net income is worth about ${usd(Math.ceil(((sp.standardDeduction.hi[0] - HI_STD_PREV) * sp.benefitReductionRate) / 100))} more a month. A family of four with no net income loses the full ${usd(hiDrop)}.</p>
<h2>The minimum benefit</h2>
<p>An eligible household of one or two people never receives less than the minimum, even when the formula gives less or nothing: ${usd(sp.minBenefit.us)} a month in the 48 states and DC (it was ${usd(sp.previous.minBenefitUs)}), ${usd(sp.minBenefit['ak-urban'])}, ${usd(sp.minBenefit['ak-rural1'])} and ${usd(sp.minBenefit['ak-rural2'])} in the three Alaska zones, and ${usd(sp.minBenefit.hi)} in Hawaii, down from ${usd(PREV_MIN.hi)}. Households of three or more have no minimum, as ${h.src('cfr27310', '7 CFR 273.10(e)')} provides: if 30% of their net income exceeds the maximum, they receive nothing even though they pass the income tests. A person living alone on ${usd(1500)} a month of Social Security with no housing costs in Missouri shows how it works: net income is ${usd(solo.net)}, 30% of it is ${usd(solo.thirtyPercent)}, more than the ${usd(snapMax(1))} maximum, and yet the payment is ${usd(solo.benefit)}.</p>
<h2>Where the maximum comes from</h2>
<p>The maximum allotment is the cost of the Thrifty Food Plan, USDA's model of a low-cost healthy diet, for a reference family of four, scaled to each household size. The 2025 budget law, ${h.src('obbba', 'Public Law 119-21')}, rewrote that link in section 10101. As the ${h.src('obbbSnap', 'USDA information memo of September 4, 2025')} explains, the cost of the plan is now adjusted every October by the change in the Consumer Price Index for All Urban Consumers over the 12 months ending in June; future re-evaluations of the plan cannot increase its cost; the market baskets may be re-evaluated no earlier than ${day(O.tfpReevaluationNotBefore)}; and the household-size adjustments are now written into the statute. The rise of ${pctUp(snapMax(4), snapMaxPrev(4))}% in the four-person maximum this year is that inflation update at work.</p>
<p>Two practical consequences follow. The yearly change will track grocery prices, nothing more, unless Congress acts. And the ${O.federalAdminSharePct}% federal share of administrative costs that began this fiscal year, with state benefit cost sharing planned from fiscal year ${O.stateMatchFromFy}, does not touch the allotment chart: the maximum stays federal and identical in every one of the 48 states.</p>
<h2>What a household near the income line receives</h2>
<p>Because the payment shrinks by 30 cents for each dollar of net income, the amount left at the edge of eligibility depends on household size. A family of four whose net income sits exactly on the federal line of ${usd(snapNet(4))} still receives ${usd(atLine(4))}; a family of three at ${usd(snapNet(3))} receives ${usd(atLine(3))}. For one or two people the formula gives ${atLine(2) > 0 ? usd(atLine(2)) : 'nothing'} or less at the line, and the minimum of ${usd(sp.minBenefit.us)} takes over. Larger families keep more at the margin: six people on the line of ${usd(snapNet(6))} get ${usd(atLine(6))}. That is why a raise rarely wipes out a large household's benefit at once, while a small household can drop from a few dozen dollars to the minimum with a modest pension increase.</p>
<p>The same arithmetic explains why rent matters so much. Every dollar of shelter deduction lowers net income by a dollar, and so raises the benefit by 30 cents, until the shelter cap of ${usd(sp.shelterCap.us)} is reached, or without limit for a household with a member 60 or older or disabled.</p>
<h2>When the new amounts reach your card</h2>
<p>The memo makes the new chart effective on ${day(sp.from)}, so benefits issued for October 2026 already use it; households did not need to reapply or report anything. Your state recomputes your case automatically with the new maximum, the new standard deduction and its own updated utility allowance. If your October amount went down, the cause is usually a change you reported, a new utility allowance, or, in Hawaii, the lower maximum. The memo also sets separate charts for Guam, ${usd(GUAM4)} for four, and the U.S. Virgin Islands, ${usd(USVI4)} for four, which this site does not cover in detail.</p>
<h2>From the maximum to your amount</h2>
<p>Your benefit is the maximum for your household size minus 30% of your net income, rounded. The work is in the net income, which depends on the earned income deduction, the standard deduction, child care, child support, medical costs for older and disabled members, and above all the shelter deduction; each is explained in ${h.a('snap-deductions', 'SNAP deductions')}. The ${h.a('snap-calculator', 'SNAP calculator')} applies all of them with your state's utility allowance. If you are not sure you qualify, start with ${h.a('snap-income-limits', 'SNAP income limits')}.</p>`,
  related: ['snap-calculator', 'snap-deductions', 'snap-income-limits', 'state:hawaii', 'state:alaska'],
  sources: ['usdaCola27', 'usdaCola26', 'obbbSnap', 'obbba', 'cfr27310'],
});
