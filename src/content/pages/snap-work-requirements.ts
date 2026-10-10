import { definePage } from '../../lib/page-types';
import { P, snapMax, usd, day } from '../../lib/kit';

const A = P.snap.abawd;
const O = P.snap.obbb;

export default definePage({
  id: 'snap-work-requirements',
  group: 'food',
  kind: 'guide',
  order: 40,
  slug: 'snap-work-requirements',
  nav: 'SNAP work requirements',
  card: `The time limit now runs to age ${A.ageMax}: who it covers and how to keep benefits`,
  title: `SNAP Work Requirements 2026: Time Limit Now Up to Age ${A.ageMax}`,
  description: `SNAP work requirements in 2026: the 3-month time limit now covers adults ${A.ageMin} to ${A.ageMax}, parents of kids ${A.childUnder} and older and veterans. ${A.hoursPerMonth} hours a month keeps benefits.`,
  h1: 'SNAP work requirements: who the time limit covers now',
  intro: `The 2025 budget law stretched the SNAP time limit to older adults and to parents of teenagers, and removed three exemptions added in 2023.`,
  resume: `Since ${day(A.effective)}, an adult aged ${A.ageMin} to ${A.ageMax} who has no child under ${A.childUnder} in the SNAP household and no other exemption can receive SNAP for only ${A.countableMonths} months in ${A.periodMonths} unless he or she works, trains or volunteers at least ${A.hoursPerMonth} hours a month. Before the change, the limit stopped at 54 and a child of any age under 18 exempted the parent. The law also ended the exemptions for veterans, people experiencing homelessness and young adults who aged out of foster care, and added one for American Indians and Alaska Natives. States applied the new rules at each new application and renewal. The months counted are months with benefits, not calendar months, so someone who loses SNAP after three months can regain it by reaching ${A.hoursPerMonth} hours in a 30-day period. Waivers for areas with few jobs now require an unemployment rate of at least ${A.waiverUnemploymentRate}%.`,
  mini: 'abawdCheck',
  faqs: [
    { q: `I am 58 and my SNAP renewal mentions a time limit for the first time. Why?`, a: `Because the time limit, which used to stop at 54, now applies through age ${A.ageMax} since the law of ${day(A.effective)}. Unless you have a child under ${A.childUnder} in your SNAP household, are medically certified as unfit for work or have another exemption, you need ${A.hoursPerMonth} hours a month of work, training or volunteer work to keep benefits beyond ${A.countableMonths} months in ${A.periodMonths}. At 60 you stay subject to it, but you are no longer required to join an employment and training program.` },
    { q: 'Does having a 15-year-old at home still exempt me from SNAP work rules?', a: `No. The exemption now covers only a parent or other household member responsible for a child under ${A.childUnder}. With a child of 14 to 17, you are subject to the time limit unless another exemption applies, such as caring for an incapacitated person or being unfit for work. A younger child in the same household still exempts you, even if the older child does not.` },
    { q: 'Are veterans and homeless people still exempt from the SNAP time limit?', a: `Not since ${day(A.effective)}. The 2025 law removed the temporary exemptions that the Fiscal Responsibility Act of 2023 had given to veterans, people experiencing homelessness and adults up to 24 who were in foster care at 18. They now follow the general rule: ${A.hoursPerMonth} hours a month or ${A.countableMonths} months of benefits in ${A.periodMonths}, unless another exemption, such as a medical one, applies.` },
    { q: 'What counts toward the 80 hours a month for SNAP?', a: `Paid work, including self-employment and work paid in kind, a work program such as SNAP employment and training or a workforce program, or any combination totaling ${A.hoursPerMonth} hours. Unpaid community service through a state workfare program also counts. Twenty hours a week averaged over the month meets the rule, so a slow week can be made up later in the month.` },
    { q: 'How do I get SNAP back after losing it to the time limit?', a: `Meet the work requirement for 30 days in a row, for example by working ${A.hoursPerMonth} hours in a 30-day period, then reapply. Your eligibility returns while you keep meeting it. If you then lose the job, federal rules allow up to ${A.countableMonths} more months once in the ${A.periodMonths}-month period. A change that makes you exempt, like a doctor's statement or a child joining the household, also restores benefits.` },
  ],
  body: (h) => `<h2>The rule in one paragraph</h2>
<p>The SNAP time limit, written in section 6(o) of the Food and Nutrition Act and in ${h.src('cfr27324', '7 CFR 273.24')}, applies to adults the law calls able-bodied adults without dependents. They can receive benefits for ${A.countableMonths} countable months in a ${A.periodMonths}-month period. A month counts only if benefits were received and the person did not meet the work requirement that month. Meeting the requirement means working ${A.hoursPerMonth} hours a month, taking part in a work program for the same hours, combining the two, or doing workfare. Nothing in the rule depends on income: a person earning enough to meet the hours keeps SNAP as long as the household still qualifies.</p>
<h2>What changed on July 4, 2025</h2>
<p>Section 10102 of ${h.src('obbba', 'Public Law 119-21')} rewrote the exceptions. USDA explained them to the states in its ${h.src('abawdMemo', 'memo of October 3, 2025')}:</p>
<ul>
<li><strong>Age:</strong> the limit covers ages ${A.ageMin} through ${A.ageMax}. The 2023 debt-ceiling law had been raising the upper age step by step toward 54; the 2025 law jumped it ten years.</li>
<li><strong>Children:</strong> only responsibility for a child under ${A.childUnder} exempts an adult, instead of a child under 18.</li>
<li><strong>Removed:</strong> the exemptions for veterans, homeless individuals, and young adults aged 24 or less who were in foster care on their 18th birthday.</li>
<li><strong>Added:</strong> exemptions for Indians, Urban Indians and California Indians as defined in the Indian Health Care Improvement Act.</li>
<li><strong>Waivers:</strong> an area can be exempted only if its unemployment rate is at least ${A.waiverUnemploymentRate}%; Alaska and Hawaii may use 150% of the national rate, and may ask for a temporary exemption that ends no later than December 31, 2028.</li>
</ul>
<p>The general work requirements, a separate set of rules that apply from 16 to 59 (registering for work, not quitting a job without good cause, accepting a suitable job offer), were not changed. That is why someone aged 60 to 64 now faces the time limit but cannot be ordered into a mandatory employment and training program: USDA told states they may not require it.</p>
<h2>Who is still exempt</h2>
<p>The age and child rules are the ones most people hit. The other exemptions in the regulation remain: being medically certified as physically or mentally unfit for employment, being pregnant, and being exempt from the general work requirements, which covers, among others, people caring for an incapacitated person, people receiving or applying for unemployment benefits, students enrolled at least half time who meet the student rules, and people in a drug or alcohol treatment program. The state decides on the evidence it accepts; a short statement from a doctor or a social worker is often enough for a medical exemption, and asking for it costs nothing.</p>
${h.box('A household is not cut off as a whole', `<p>The time limit removes only the person who is subject to it. If a 50-year-old man lives with his 70-year-old mother and buys food with her, the mother keeps her SNAP even if he loses his. The household simply shrinks by one for the calculation: the maximum allotment for one person is ${usd(snapMax(1))} instead of ${usd(snapMax(2))} for two in fiscal year ${P.snap.fy}.</p>`)}
<h2>Proving your hours</h2>
<p>States ask for evidence that matches the activity: pay stubs or an employer statement for a job, a signed log for volunteer work at a food bank or a church, an attendance sheet from a training provider. Hours from several sources add up, so ten hours of paid work a week plus a weekly volunteer shift can reach the monthly total. If an employer cuts your schedule below the threshold through no fault of yours, tell the agency at once: the regulation lets a state treat a short month as met when a person would have reached the hours but for good cause, such as illness or a family emergency, and some states also run work programs that fill the gap.</p>
<h2>How the months are counted</h2>
<p>The ${A.periodMonths}-month period is fixed by each state, either as a calendar window used for everyone or as a rolling look-back from each month. A month in which the person met the work requirement, was exempt, or lived in a waived area does not count. A partial month of benefits at application, when benefits are prorated, does not count either. Keeping your pay stubs or timesheets matters, because the state checks hours when it counts months.</p>
<h2>Regaining SNAP after the three months</h2>
<p>A person who used up the countable months gets SNAP back by meeting the requirement for 30 consecutive days, for example ${A.hoursPerMonth} hours of work within 30 days, and keeps it while still meeting it. If the job then ends, the rules allow up to ${A.countableMonths} additional consecutive months, once per ${A.periodMonths}-month period. Becoming exempt (turning ${A.ageMax + 1}, a child under ${A.childUnder} joining the household, a doctor's certification) restores eligibility immediately.</p>
<h2>The state side of the law</h2>
<p>The same law changes what states pay. From fiscal year ${O.adminShareFromFy}, which began on October 1, 2026, the federal government covers ${O.federalAdminSharePct}% of SNAP administrative costs instead of half, and from fiscal year ${O.stateMatchFromFy} states with higher payment error rates pay up to ${O.stateMatchMaxPct}% of benefits (${h.src('obbbSnap', 'USDA information memo')}). Neither changes your benefit directly, but both give states a reason to check hours and exemptions closely, so answer requests for information quickly and keep copies of what you send.</p>
<p>To see what you would receive while meeting the rule, use the ${h.a('snap-calculator', 'SNAP calculator')}; for the other conditions, from income to immigration status, see ${h.a('snap-eligibility', 'SNAP eligibility')}. People 60 and older have other advantages in the benefit formula, explained in ${h.a('snap-for-seniors', 'SNAP for seniors')}.</p>`,
  related: ['snap-eligibility', 'snap-calculator', 'snap-for-seniors', 'medicaid-work-requirements', 'snap-college-students'],
  sources: ['abawdMemo', 'obbbSnap', 'cfr27324', 'obbba'],
});
