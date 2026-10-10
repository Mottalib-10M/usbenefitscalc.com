import { definePage } from '../../lib/page-types';
import { P, medLimit, expansionStates, usd, usdx, day } from '../../lib/kit';

const M = P.medicaid;
const W = M.workRequirement;
const bar = W.hoursPerMonth * W.federalMinimumWage;
const solo = medLimit('ohio', 'adult', 1);
const nExp = expansionStates().length;
const weekly = W.hoursPerMonth / 4;

export default definePage({
  id: 'medicaid-work-requirements',
  group: 'health',
  kind: 'guide',
  order: 40,
  slug: 'medicaid-work-requirements',
  nav: 'Medicaid work requirements',
  card: `${W.hoursPerMonth} hours a month or ${usd(bar)} of income for expansion adults from ${day(W.start)}, and who is exempt`,
  title: `Medicaid Work Requirements 2027: ${W.hoursPerMonth} Hours or ${usd(bar)} a Month`,
  description: `Medicaid work requirements start by ${day(W.start)} for expansion adults ${W.ageMin} to ${W.ageMax}: ${W.hoursPerMonth} hours a month of work, school or service, or ${usd(bar)} earned. Who is exempt.`,
  h1: 'Medicaid work requirements: the community engagement rule',
  intro: 'The 2025 budget law makes Medicaid for expansion adults depend on work, school or service, with a long list of exemptions.',
  resume: `From ${day(W.start)} at the latest, adults aged ${W.ageMin} to ${W.ageMax} covered by the Medicaid expansion must show ${W.hoursPerMonth} hours a month of work, community service, a work program or a mix of them, or half-time enrollment in college or career training, to get or keep coverage. Monthly income of at least ${W.hoursPerMonth} times the federal minimum wage, ${usd(bar)} at ${usdx(W.federalMinimumWage)} an hour, also satisfies the rule. Section 71119 of Public Law 119-21 calls it a community engagement requirement, and states may start earlier. Exempt people include parents and caretakers of a child 13 or younger or of a disabled person, pregnant and postpartum women, people who are medically frail, veterans with a total disability rating, Indians and Urban Indians, people in addiction treatment, and SNAP or TANF participants who meet those programs' work rules. Anyone who fails gets a notice and 30 days to fix it before losing coverage. The rule applies in the ${nExp} expansion jurisdictions and to equivalent waivers, not to children or to the elderly.`,
  mini: 'medicaidHours',
  faqs: [
    { q: 'When do Medicaid work requirements start?', a: `No later than ${day(W.start)}, the first day of the first quarter after December 31, 2026, under section 71119 of Public Law 119-21. A state may begin earlier through its state plan or a section 1115 waiver. HHS can give a state that shows a good-faith effort extra time, but any such exemption ends by ${day('2028-12-31')} at the latest. Your state's notices will give the exact date where you live.` },
    { q: 'Does a part-time job count for the Medicaid work requirement?', a: `Yes, two ways. The hours count: ${weekly} hours a week adds up to about ${W.hoursPerMonth} a month. And income counts on its own: earning at least ${usd(bar)} in a month, ${W.hoursPerMonth} times the federal minimum wage of ${usdx(W.federalMinimumWage)}, meets the rule whatever the hours. Seasonal workers can use their average monthly income over the past six months instead. Hours of work, volunteering and training can be added together.` },
    { q: 'Are parents exempt from the Medicaid work requirement?', a: `Parents, guardians, caretaker relatives and family caregivers of a dependent child aged 13 or under are exempt, as are those caring for a disabled person. A parent whose youngest child is 14 or older has to meet the rule unless another exemption applies, such as pregnancy or a serious medical condition. Parents whose income is under their state's parent standard are covered by the parent group instead of the expansion group, and that group is not subject to the requirement.` },
    { q: 'Does being a college student count for the Medicaid work requirement?', a: `Yes, if you are enrolled at least half time. The law counts enrollment in an educational program, defined as an institution of higher education or a program of career and technical education, as meeting the requirement for the month without any hour count. A student enrolled less than half time can add class hours to work or volunteer hours to reach ${W.hoursPerMonth}. Your state sets how you prove enrollment.` },
    { q: 'What happens if Medicaid cannot verify my work hours?', a: `The state must first try to verify from its own data, such as payroll records. If it still cannot, it sends a notice of noncompliance and gives you 30 calendar days from receipt to show you met the rule or are exempt; coverage continues during that time. If nothing is shown, coverage ends no later than the end of the following month, after the state checks every other way you could qualify and offers a fair hearing.` },
    { q: 'Can I get an Obamacare subsidy if I lose Medicaid over the work rule?', a: `No. The law states that a person who would be eligible for Medicaid except for failing the community engagement requirement is treated as eligible for Medicaid when the premium tax credit is computed. Being eligible for Medicaid rules out the credit, so the Marketplace is not a subsidized fallback. Meeting the rule again, or qualifying for an exemption, is the way back to coverage.` },
  ],
  body: (h) => `<h2>Who the rule covers</h2>
<p>Section 71119 of ${h.src('obbba', 'Public Law 119-21')} adds a new subsection (xx) to section 1902 of the Social Security Act. It applies to an "applicable individual": a person eligible for or enrolled in the ACA expansion group, or an adult with the same profile, aged ${W.ageMin} to ${W.ageMax}, not pregnant and not on Medicare, enrolled under a waiver that gives coverage equivalent to minimum essential coverage. Children, people 65 and older, pregnant women and people covered through another Medicaid group, such as the parent group or the disability groups, are outside it from the start. In practice that means the rule bites in the ${nExp} jurisdictions that adopted the expansion, where a single adult qualifies with income up to ${usd(solo.monthly ?? 0)} a month in 2026, and in states that cover the same adults through a waiver. The law forbids HHS to waive it.</p>
<h2>Six ways to meet it in a month</h2>
<p>A person demonstrates community engagement for a month by meeting at least one of these conditions, according to criteria HHS sets by regulation:</p>
<ul>
<li>working at least ${W.hoursPerMonth} hours;</li>
<li>completing at least ${W.hoursPerMonth} hours of community service;</li>
<li>taking part in a work program for at least ${W.hoursPerMonth} hours, a term borrowed from the SNAP time limit rules;</li>
<li>being enrolled at least half time in an educational program, meaning a college or university or a career and technical education program;</li>
<li>any combination of the four, adding up to ${W.hoursPerMonth} hours;</li>
<li>having monthly income of at least the federal minimum wage times ${W.hoursPerMonth} hours, ${usd(bar)} at today's ${usdx(W.federalMinimumWage)}, or, for a seasonal worker, that much on average over the previous six months.</li>
</ul>
<p>The income route matters for people with irregular hours. A gig worker or a self-employed person whose hours are hard to document can rely on earnings instead. The mini-calculator above tests both routes at once.</p>
<h2>Exemptions written into the law</h2>
<p>The state must treat a person as compliant, and may skip verification, for any month in which he or she was for part or all of the month:</p>
<ul>
<li>under 19, or entitled to Medicare Part A or enrolled in Part B;</li>
<li>a parent, guardian, caretaker relative or family caregiver of a dependent child aged 13 or under or of a disabled individual;</li>
<li>pregnant or entitled to postpartum Medicaid;</li>
<li>a veteran with a disability rated as total;</li>
<li>medically frail or with special medical needs, including people who are blind or disabled, people with a substance use disorder, a disabling mental disorder, a physical, intellectual or developmental disability that significantly limits daily activities, or a serious or complex medical condition;</li>
<li>in compliance with the TANF work requirements, or a member of a SNAP household who is not exempt from SNAP work rules, that is, someone already meeting them;</li>
<li>in a drug addiction or alcohol treatment and rehabilitation program;</li>
<li>an Indian, Urban Indian or California Indian, or found eligible for the Indian Health Service;</li>
<li>a young adult in the former foster care group, or an inmate of a public institution, including anyone who was one at any point in the previous three months.</li>
</ul>
<p>States may also excuse a month of short-term hardship: a stay in a hospital, nursing facility or psychiatric hospital, travel away from home for serious medical care, or living in a county under a federal disaster declaration or with unemployment at or above 8% or 1.5 times the national rate, whichever is lower. The county option requires a request from the state to HHS.</p>
<h2>How the state checks, and what happens if you fall short</h2>
<p>For a new application, the state decides whether to look at one, two or three consecutive months before the month you apply. For people already enrolled, it checks one or more months between renewals and may check more often. Renewals themselves speed up for this group: section 71107 requires a redetermination every ${M.redeterminationMonths} months for renewals scheduled on or after ${day(M.redeterminationStart)}, with an exemption for Indians and Urban Indians.</p>
<p>The state has to use data it already holds, such as payroll records or Medicaid claims, before asking you for papers. If it cannot confirm compliance, the law prescribes the steps. You get a notice explaining how to show compliance or an exemption and how to reapply. You then have 30 calendar days from receipt to respond, and an enrolled person keeps coverage during those days. If nothing is shown, the state must check whether you qualify under any other Medicaid group or another insurance affordability program, give written notice and a fair hearing, and only then deny or end coverage, no later than the end of the month after the 30 days run out. States must warn enrollees ahead of the start date by regular mail, or electronically if chosen, plus at least one other channel such as text messages or phone calls.</p>
${h.box('No subsidy as a fallback', `<p>An adult refused Medicaid only because of the community engagement rule is deemed eligible for Medicaid for the purposes of the premium tax credit. The result: no credit for a Marketplace plan either. In a state that expanded Medicaid, failing the rule therefore leaves a person under ${usd(solo.monthly ?? 0)} a month without subsidized coverage. The interaction with the credit is explained in the ${h.a('aca-subsidy-calculator', 'ACA subsidy calculator')}.</p>`)}
<h2>What is still to be settled</h2>
<p>The law left a lot to rule-making. It required HHS to issue an interim final rule by ${day('2026-06-01')} and lets HHS define "medically frail", set the criteria for counting hours and set standards for verification. CMS also had to issue guidance on the six-month renewals within 180 days of enactment. This page describes the statute itself; the federal rule and each state's choices (how many months it checks, whether it starts before ${day(W.start)}, which hardship options it adopts) decide the day-to-day details. A state can obtain an exemption from HHS by showing a good-faith effort to comply, but only until ${day('2028-12-31')}. Watch for notices from your state agency, and keep pay stubs, school enrollment records or volunteer logs.</p>
<p>The rule resembles the SNAP time limit, but it is not the same. SNAP counts ${P.snap.abawd.hoursPerMonth} hours too, exempts parents of children under ${P.snap.abawd.childUnder} and allows ${P.snap.abawd.countableMonths} months of benefits before cutting anyone off; Medicaid exempts parents of children 13 or under and has no grace months, only the 30-day notice. Someone who meets the SNAP work rule is exempt from the Medicaid one. Compare with ${h.a('snap-work-requirements', 'SNAP work requirements')}, and see the other 2027 changes in ${h.a('medicaid-eligibility', 'Medicaid eligibility')}.</p>`,
  related: ['medicaid-eligibility', 'snap-work-requirements', 'medicaid-expansion-states', 'medicaid-income-limits', 'aca-subsidy-calculator'],
  sources: ['obbba', 'cmsLevels', 'abawdMemo'],
});
