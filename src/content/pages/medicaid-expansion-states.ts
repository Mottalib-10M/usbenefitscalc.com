import { definePage } from '../../lib/page-types';
import { P, STATES, sd, medLimit, bhpOf, fplAt, acaCalc, expansionStates, usd, day, listOf } from '../../lib/kit';

const M = P.medicaid;
const line = M.expansionPct + M.disregardPct;
const exp = expansionStates();
const nExp = exp.length;
const nExpStates = exp.filter((s) => s.slug !== 'district-of-columbia').length;
const non = STATES.filter((s) => !s.medicaid.expansion);
const solo = medLimit('ohio', 'adult', 1);
const gap1 = fplAt(1, 100, 'us', 2025);
const gap3 = fplAt(3, 100, 'us', 2025);
const dc = medLimit('district-of-columbia', 'adult', 1);
const wi = medLimit('wisconsin', 'adult', 1);
const flParent = medLimit('florida', 'parent', 3);
const flKid = medLimit('florida', 'child6to18', 3);
const txParent = medLimit('texas', 'parent', 3);
const mn = bhpOf('minnesota', 1);
// Worked cases (hypotheses: yearly incomes written in the text; benchmark premium of $500 a month for one adult).
const lowWage = 12000;
const justOver = 16000;
const ptcJust = acaCalc(justOver, 1, 500);
const flFamily = 20000;
const mid = 24000;
const ptcMid = acaCalc(mid, 1, 500);
const nonHcg = non.filter((s) => s.marketplace.type === 'healthcare.gov').map((s) => s.name);
const nonOwn = non.filter((s) => s.marketplace.type !== 'healthcare.gov');
const waiverNotes = ['oklahoma', 'utah'].map((s) => sd(s).name);

export default definePage({
  id: 'medicaid-expansion-states',
  group: 'health',
  kind: 'guide',
  order: 30,
  slug: 'medicaid-expansion-states',
  nav: 'Medicaid expansion states',
  card: `The ${nExp} jurisdictions that expanded Medicaid, the ${non.length} that did not, and the gap in between`,
  title: `Medicaid Expansion States 2026: ${nExp} Have It, ${non.length} Do Not`,
  description: `Medicaid expansion states in 2026: ${nExp} jurisdictions cover adults to ${usd(solo.monthly ?? 0)} a month. In the ${non.length} others, adults under ${usd(gap1)} a year fall in the coverage gap.`,
  h1: 'Medicaid expansion states and the coverage gap',
  intro: 'Which states cover low-income adults without children, which do not, and what happens to the people caught between Medicaid and the Marketplace.',
  resume: `${nExpStates} states and DC, ${nExp} jurisdictions in all, have adopted the Medicaid expansion of the Affordable Care Act, according to the CMS table of state levels as of ${day('2023-12-01')}. In those places any adult aged 19 to 64 with income up to ${line}% of the poverty line can get Medicaid: ${usd(solo.monthly ?? 0)} a month for one person in 2026, more in Alaska and Hawaii, and ${usd(dc.monthly ?? 0)} in DC, which set its adult level at 210%. The ${non.length} states that have not expanded are ${listOf(non.map((s) => s.name))}. Wisconsin covers adults up to 95% of poverty through a waiver; the others leave adults without children uncovered at any income and hold parents to low state standards. Below 100% of the 2025 guideline, ${usd(gap1)} a year for one person, the Marketplace tax credit does not start either, so adults in that band face the coverage gap.`,
  mini: 'coverageGap',
  faqs: [
    { q: 'What is the Medicaid coverage gap?', a: `It is the income band where an adult gets neither Medicaid nor the Marketplace premium tax credit. It exists only in states that did not expand Medicaid: the tax credit starts at 100% of the poverty guideline, ${usd(gap1)} a year for one person and ${usd(gap3)} for three for 2026 coverage, while those states cover parents only far below that and adults without children not at all. Children and pregnant women in the same family can still qualify.` },
    { q: 'Is Georgia a Medicaid expansion state?', a: `Not in the CMS table of state levels as of ${day('2023-12-01')}, which lists Georgia with no expansion. Georgia covers parents up to a dollar standard that CMS puts at ${sd('georgia').medicaid.parent}% of poverty, ${usd(medLimit('georgia', 'parent', 3).monthly ?? 0)} a month for a family of three in 2026, and children through ${sd('georgia').medicaid.chipName} up to ${usd(medLimit('georgia', 'child6to18', 3).monthly ?? 0)} for a child in a family of three. Adults above the poverty line can use the ${sd('georgia').marketplace.name} Marketplace.` },
    { q: 'Can I buy a Marketplace plan if I earn less than the poverty line?', a: `You can enroll, but without the premium tax credit, which in 2026 requires household income of at least 100% of the 2025 guideline, ${usd(gap1)} for one person. HealthCare.gov puts it plainly: below that level you probably will not qualify for Marketplace savings but may qualify for Medicaid. In an expansion state you would, up to ${line}% of poverty. Earning a little more can open the credit: at ${usd(justOver)} a single adult pays about ${usd(ptcJust.expectedMonthly)} a month toward the benchmark plan.` },
    { q: 'Does Wisconsin have Medicaid expansion or not?', a: `Not the ACA expansion, but something close. ${sd('wisconsin').medicaid.programName} covers adults up to 95% of poverty under a section 1115 waiver, which with the 5-point disregard means ${usd(wi.monthly ?? 0)} a month for one person in 2026. That reaches ${usd((wi.annual ?? 0))} a year, just above the ${usd(gap1)} where the Marketplace credit starts, so Wisconsin avoids the coverage gap that the other non-expansion states have.` },
    { q: 'Do the new Medicaid work requirements apply in states that did not expand?', a: `Mostly no. Section 71119 of Public Law 119-21 targets the expansion group and adults covered by a waiver that gives them equivalent coverage, starting no later than ${day(M.workRequirement.start)}. A state without either has nobody to apply it to. Parents, children, pregnant women and people with disabilities in those states are not concerned. A waiver state such as Wisconsin is the case to check with the agency.` },
  ],
  body: (h) => {
    const expRows = exp.map((s) => [h.a(`state:${s.slug}`, s.name), s.medicaid.programName || 'Medicaid', usd(medLimit(s.slug, 'adult', 1).monthly ?? 0), s.medicaid.bhpPct != null ? `BHP to ${usd(bhpOf(s.slug, 1)?.monthly ?? 0)}` : s.medicaid.note && /1115/.test(s.medicaid.note) ? 'Waiver for some adults' : '']);
    const nonRows = non.map((s) => { const p = medLimit(s.slug, 'parent', 3); const a = medLimit(s.slug, 'adult', 1); return [h.a(`state:${s.slug}`, s.name), a.monthly != null ? `${usd(a.monthly)} (waiver)` : 'None', `${usd(p.monthly ?? 0)}${s.medicaid.parentDollarStandard ? ' ($)' : ''}`, usd(medLimit(s.slug, 'child6to18', 3).monthly ?? 0)]; });
    return `<h2>What expansion changed</h2>
<p>Medicaid's traditional groups for working-age people are parents and caretakers, pregnant women and people with disabilities. The Affordable Care Act added one more: every adult aged 19 to 64 with income up to ${M.expansionPct}% of the poverty line, who is not pregnant, not on Medicare and not eligible under another group. Adopting that group is a state decision. CMS records the choice in the last column of its ${h.src('cmsLevels', 'table of eligibility levels')}, the one this site reads, dated ${day('2023-12-01')}. With the ${M.disregardPct}-point disregard from ${h.src('cfr435603', '42 CFR 435.603')}, the line works out to ${line}% of the 2026 guideline.</p>
<p>The difference for a low-wage worker is stark. A single adult earning ${usd(lowWage)} a year, about ${usd(lowWage / 12)} a month, qualifies for Medicaid in ${h.a('state:ohio', 'Ohio')} or ${h.a('state:north-carolina', 'North Carolina')}. The same person in ${h.a('state:texas', 'Texas')} has no Medicaid group and, being under ${usd(gap1)}, no Marketplace tax credit either. Try your own figures in the mini-calculator above.</p>
<h2>The ${nExp} expansion jurisdictions</h2>
${h.table(['State', 'Program', 'Single adult, per month', 'Above Medicaid'], expRows, `Expansion jurisdictions in the CMS table (levels as of ${day('2023-12-01')}), monthly limit for one adult in 2026 with the disregard. BHP = Basic Health Program.`, ['l', 'l', 'r', 'l'])}
<p>Three cases stand apart. ${h.a('state:district-of-columbia', 'DC')} set its adult level at 210% of poverty, so a single adult qualifies up to ${usd(dc.monthly ?? 0)} a month, and it also covers 19- and 20-year-olds up to 216%. ${h.a('state:minnesota', 'Minnesota')} and ${h.a('state:new-york', 'New York')} keep the standard Medicaid line but cover adults above it and up to 200% of poverty through a Basic Health Program, up to ${usd(mn?.monthly ?? 0)} a month for one person; Minnesota's version is MinnesotaCare. For ${listOf(waiverNotes)}, CMS flags a section 1115 demonstration that covers some additional low-income adults, with conditions that vary.</p>
<h2>The ${non.length} states without expansion</h2>
${h.table(['State', 'Adult without children', 'Parent, family of 3', 'Child 6 to 18, family of 3'], nonRows, `Monthly limits in 2026 with the disregard. ($) = dollar standard converted by CMS into a percentage. Children's lines include CHIP.`, ['l', 'r', 'r', 'r'])}
<p>In these states the parent and caretaker group is the only door for working-age adults who are not pregnant or disabled. The standards are low: ${usd(txParent.monthly ?? 0)} a month for a parent in a family of three in Texas and ${usd(flParent.monthly ?? 0)} in ${h.a('state:florida', 'Florida')}. Many of these states set the standard in dollars by household size, and CMS shows the highest equivalent percentage, so the real figure for your household can be lower. Children, by contrast, are covered generously everywhere: ${usd(flKid.monthly ?? 0)} a month for a child of 6 to 18 in a Florida family of three.</p>
<p>${h.a('state:wisconsin', 'Wisconsin')} is the borderline case. It did not adopt the expansion, but its waiver covers adults up to 95% of poverty, ${usd(wi.monthly ?? 0)} a month for one person with the disregard. ${h.a('state:south-carolina', 'South Carolina')} has a waiver as well, which CMS describes as covering some additional low-income adults with limits on eligibility or benefits. ${h.a('state:georgia', 'Georgia')} is listed without expansion in the CMS table.</p>
<h2>Who falls into the coverage gap</h2>
<p>The premium tax credit, under ${h.src('irsPtcBasics', 'section 36B of the tax code')}, starts at 100% of the poverty guideline of the year before coverage, so for 2026 plans the threshold is ${usd(gap1)} for one person and ${usd(gap3)} for three (${h.src('healthcareFpl', 'HealthCare.gov')}). In an expansion state, income under that threshold means Medicaid. In a non-expansion state, it means nothing for an adult without children, and for a parent whose income is above the state's low standard. That band is the coverage gap.</p>
<p>Take a Florida parent with two children and ${usd(flFamily)} of yearly income. The parent is over the state standard of ${usd((flParent.monthly ?? 0) * 12)} a year and under the ${usd(gap3)} where the credit begins: no coverage help for the parent. The two children qualify for Medicaid or ${sd('florida').medicaid.chipName}, because their line is ${usd((flKid.monthly ?? 0) * 12)} a year. If the parent's income rose to ${usd(gap3)}, the credit would start, and a benchmark silver plan would cost about ${P.aca.table2026[0][2]}% of income at that level under the 2026 table.</p>
<p>Two exceptions to the gap matter. A pregnant woman in the same situation qualifies for pregnancy Medicaid, whose lines are high in every state. And an adult with a disability may qualify through the disability pathways, which exist whether or not the state expanded.</p>
<h2>From Medicaid to the Marketplace in an expansion state</h2>
<p>In an expansion state there is no gap, but there is a handoff. Income between 100% of the 2025 guideline and ${line}% of the 2026 guideline could in theory open both programs; Medicaid comes first, because a person eligible for Medicaid cannot claim the premium tax credit. The credit takes over only above the Medicaid line, ${usd((solo.monthly ?? 0) * 12)} a year for one adult in 2026. A single adult earning ${usd(mid)} a year is just past it. With a benchmark silver premium of ${usd(500)} a month, an assumption for the example since premiums vary by county and age, the 2026 table sets her contribution at ${usd(ptcMid.expectedMonthly)} a month and the credit at ${usd(ptcMid.creditMonthly)}. Silver plans also carry cost-sharing reductions at that income, which lowers deductibles.</p>
<p>Because Medicaid counts monthly income and the credit yearly income, a worker whose hours swing can move between the two in the same year. Reporting changes on time keeps the switch clean; an advance credit paid in a month of Medicaid eligibility may have to be paid back when the return is filed, since repayment caps no longer apply from tax year ${P.aca.repaymentCapsRemovedFromTaxYear}.</p>
<h2>Where people in non-expansion states shop for coverage</h2>
<p>Adults above the poverty line in the ${non.length} non-expansion states buy subsidized plans through a Marketplace like everyone else. ${listOf(nonHcg)} use HealthCare.gov. ${nonOwn.map((s) => `${s.name} runs its own, ${s.marketplace.name}`).join('; ')}. The 2026 credit there follows the same federal table as in any state, so a household at 150% of poverty pays the same share of income in Texas as in Ohio, even though the benchmark premium differs.</p>
<h2>The 2025 law in expansion states</h2>
<p>${h.src('obbba', 'Public Law 119-21')} adds conditions that apply only to the expansion group and to adults covered by an equivalent waiver. From ${day(M.redeterminationStart)}, renewals come every ${M.redeterminationMonths} months instead of every twelve (section 71107), adults 19 to 64 must meet a ${M.workRequirement.hoursPerMonth}-hour community engagement requirement unless exempt (section 71119), and coverage before the application month shrinks to ${M.retroactiveMonthsExpansion} month for new applications (section 71112). From ${day(M.costSharingStart)}, those above the poverty line pay copays set by the state (section 71120).</p>
<p>The work rule has a consequence for the Marketplace. An adult who would have been eligible for expansion Medicaid but for failing the community engagement requirement is treated as eligible for Medicaid when the tax credit is computed, so the credit is not available as a fallback. The details are in ${h.a('medicaid-work-requirements', 'Medicaid work requirements')}, the exact limits by group in ${h.a('medicaid-income-limits', 'Medicaid income limits')}, and the credit for those above the line in the ${h.a('aca-subsidy-calculator', 'ACA subsidy calculator')}.</p>`;
  },
  related: ['medicaid-income-limits', 'medicaid-eligibility', 'aca-subsidy-calculator', 'medicaid-work-requirements', 'state:texas', 'state:wisconsin'],
  sources: ['cmsLevels', 'cfr435603', 'obbba', 'healthcareFpl', 'irsPtcBasics'],
});
