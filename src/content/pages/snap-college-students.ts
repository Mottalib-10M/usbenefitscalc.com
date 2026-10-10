import { definePage } from '../../lib/page-types';
import { P, snapMax, snapGross, snapCalc, usd, usdx } from '../../lib/kit';

const sp = P.snap;
const minWage = P.medicaid.workRequirement.federalMinimumWage;
const selfEmpWeekly = minWage * 20;
// Worked case: a single student in Oregon working 20 hours a week at $15 an hour (about 4.33 weeks a month), rent $750.
const monthlyPay = Math.round(15 * 20 * 4.33);
const or = snapCalc('oregon', { size: 1, earned: monthlyPay, housing: 750 });

export default definePage({
  id: 'snap-college-students',
  group: 'food',
  kind: 'guide',
  order: 80,
  slug: 'snap-college-students',
  nav: 'SNAP for college students',
  card: 'The half-time rule and the exemptions that let a student qualify, read from the regulation',
  title: `SNAP for College Students 2027: 20-Hour Rule and Exemptions`,
  description: `SNAP for college students in FY ${sp.fy}: half-time students need an exemption such as 20 hours of paid work a week or work-study, then up to ${usd(snapMax(1))} a month for one.`,
  h1: 'SNAP for college students: the exemptions that open the door',
  intro: 'A college student can get SNAP, but only by fitting one of the exemptions the regulation lists. Here they are, word for word in substance.',
  resume: `A student enrolled at least half time in college, a university or a trade school that requires a high school diploma is not eligible for SNAP unless one of the exemptions in federal rule 7 CFR 273.5 applies. The most common are working at least 20 hours a week for pay, being approved for state or federal work-study during the school year, being 17 or younger or 50 or older, and caring for a dependent child under 6. A single parent studying full time with a child under 12 also qualifies, as do students on TANF, students physically or mentally unfit for work, and those placed in school by certain job training programs. An exemption only removes the student barrier: the student must still pass the income tests, ${usd(snapGross(1))} a month of gross income for one person under the federal rule in fiscal year ${sp.fy}, and may then receive up to ${usd(snapMax(1))} a month. Students enrolled less than half time are not covered by the rule at all.`,
  mini: 'studentExemption',
  faqs: [
    { q: 'Can a full-time college student get food stamps?', a: `Yes, with an exemption. Under 7 CFR 273.5, a student enrolled at least half time is ineligible unless he or she works at least 20 hours a week for pay, has approved work-study, is 17 or younger or 50 or older, cares for a child under 6, is a single full-time student parent of a child under 12, gets TANF, is unfit for work, or was placed by a qualifying job training program. The income tests still apply.` },
    { q: 'Does federal work-study make a student eligible for SNAP?', a: `It can. The student must be approved for state or federal work-study when applying for SNAP, the work-study must be approved for the term, and the student must expect to actually work. The exemption starts with the month the term begins or the month work-study is approved, whichever is later, and runs to the end of the month the term ends, unless the student refuses an assignment.` },
    { q: 'Does the SNAP student rule apply to part-time students?', a: `Only from half time upward. The regulation covers people enrolled at least half time in an institution of higher education, so a student taking fewer credits than that is treated like any other applicant, with no exemption needed. Income, household and work rules still apply, including the time limit for adults ${sp.abawd.ageMin} to ${sp.abawd.ageMax}.` },
    { q: 'Is a community college or trade school student covered by the SNAP student rule?', a: `A community college student in a regular curriculum is covered, because the rule reaches any college or university offering degree programs, whether or not it requires a high school diploma. A business, technical, trade or vocational school is covered only if its program normally requires a diploma or equivalency for enrollment. A program open without one, such as many adult basic education courses, falls outside the rule.` },
    { q: 'Does the SNAP student rule apply during summer break?', a: `Usually yes. Enrollment begins on the first day of the term and continues through normal vacations and recesses unless the student graduates, is suspended or expelled, drops out, or does not intend to register for the next normal term, summer school excluded. A work-study exemption does not carry over a break of a full month or longer unless the student works during the break.` },
    { q: 'Can a self-employed student meet the SNAP 20-hour work exemption?', a: `Yes, if the student works at least 20 hours a week and earns weekly at least the federal minimum wage times 20 hours, which is ${usdx(selfEmpWeekly)} a week at ${usdx(minWage)} an hour. Employees simply need 20 paid hours a week. A state may average hours over a month, quarter, trimester or semester, and may leave out hours during academic breaks of a month or less.` },
  ],
  body: (h) => `<h2>The rule in the regulation</h2>
<p>The student rule is short. ${h.src('cfr2735', '7 CFR 273.5(a)')} says that a person enrolled at least half time in an institution of higher education is ineligible to participate in SNAP unless he or she qualifies for one of the exemptions in paragraph (b). It then defines higher education in two parts. A business, technical, trade or vocational school counts if it normally requires a high school diploma or equivalency certificate for the curriculum. A college or university that offers degree programs counts for anyone enrolled in a regular curriculum, whether or not a diploma is required. A community college therefore falls under the rule, and so does a four-year university; a high school, a GED class or a course open to anyone does not.</p>
<p>Enrollment status begins on the first day of the school term and continues through normal class periods, vacations and recesses. It ends only if the student graduates, is suspended or expelled, drops out, or does not intend to register for the next normal term, not counting summer school. That is why a student cannot drop out of the rule simply because classes are out for the summer.</p>
<h2>The exemptions, one by one</h2>
<p>Paragraph (b) lists the exemptions. A student needs only one of them.</p>
<ul>
<li><strong>Age:</strong> 17 or younger, or 50 or older.</li>
<li><strong>Health:</strong> physically or mentally unfit.</li>
<li><strong>TANF:</strong> receiving Temporary Assistance for Needy Families, or enrolled as a result of taking part in the Job Opportunities and Basic Skills program under Title IV of the Social Security Act, or its successor program.</li>
<li><strong>Paid work:</strong> employed at least 20 hours a week and paid for it. A self-employed student must work 20 hours a week and earn at least the federal minimum wage times 20 hours, ${usdx(selfEmpWeekly)} a week at ${usdx(minWage)} an hour.</li>
<li><strong>Work-study:</strong> participating in a state or federally financed work-study program during the regular school year.</li>
<li><strong>On-the-job training:</strong> only while the employer is actually training the student.</li>
<li><strong>A young child:</strong> responsible for the care of a dependent household member under 6, or one aged 6 to 11 when the state agency finds that adequate child care is not available for the student to attend class and meet the 20-hour work or work-study condition.</li>
<li><strong>Single parent:</strong> enrolled full time, as the school defines it, and responsible for a dependent child under 12, when only one natural, adoptive or step-parent is in the SNAP household with the child.</li>
<li><strong>Job training placement:</strong> assigned to or placed in college through a qualifying program.</li>
</ul>
<h2>Work hours and work-study in practice</h2>
<p>Twenty hours a week is the condition most students try to meet. The regulation lets a state check it as an average over a month, a quarter, a trimester or a semester, and lets it leave out hours during academic breaks that last a month or less; a state that averages must say so in its plan, so ask your agency which period it uses. Hours must be paid, which excludes unpaid internships and volunteer work.</p>
<p>Work-study has its own timing. The student must be approved for work-study when applying for SNAP, the work-study must be approved for the school term, and the student must expect to actually work. The exemption begins with the month the term begins or the month work-study is approved, whichever is later, and lasts until the end of the month the term ends, or until it becomes known that the student refused an assignment. It does not continue across a break of a full month or longer unless the student works during the break. Being offered work-study in a financial aid letter is not, by itself, the same as being approved and expecting to work.</p>
<h2>Students who are parents</h2>
<p>Two exemptions concern children, and they are worded differently. Any student enrolled half time or more who is responsible for the care of a dependent household member under 6 qualifies. For a child from 6 to 11, the student qualifies only if the state agency determines that adequate child care is not available to let the student attend class and meet the work or work-study condition. Separately, a single parent enrolled full time who cares for a dependent child under 12 qualifies, with no child care finding. The single-parent exemption applies when only one natural, adoptive or step-parent is in the SNAP household with the child; if no parent is there, another full-time student in the household who has parental control over the child and does not live with a spouse can use it.</p>
<h2>Job training programs that place students in school</h2>
<p>A student placed in an institution of higher education through one of four kinds of programs is exempt: a program under the Job Training Partnership Act; a SNAP employment and training program, when the course is part of a career and technical education program designed to be completed in no more than four years, or is limited to remedial courses, basic adult education, literacy or English as a second language; a program under section 236 of the Trade Act of 1974; or a state or local employment and training program for low-income households with a component at least equivalent to a SNAP employment and training component. Self-initiated placements count if the program accepts them, and so do placements of people who volunteered for the program.</p>
<h2>After the exemption: income still decides</h2>
<p>An exempt student is a SNAP applicant like any other. The household is the people the student buys and cooks with, so a student living with parents and under 22 is part of the parents' household, while one sharing an apartment and shopping alone is a household of one. Income must pass the tests on ${h.a('snap-income-limits', 'SNAP income limits')}. A single student in Oregon working 20 hours a week at ${usd(15)} an hour earns about ${usd(monthlyPay)} a month; with ${usd(750)} in rent and the state's utility allowance, the estimated benefit is ${usd(or.benefit)} a month, out of a maximum of ${usd(snapMax(1))}. Without the 20 hours and without another exemption, the same student gets nothing. The regulation adds that the income and resources of an ineligible student are handled under a separate rule, 7 CFR 273.11(d), when that student lives with a SNAP household.</p>
<p>Other conditions are on ${h.a('snap-eligibility', 'SNAP eligibility')}, and the ${h.a('snap-calculator', 'SNAP calculator')} gives the amount once you know you qualify. A student between ${sp.abawd.ageMin} and ${sp.abawd.ageMax} without a young child should also read ${h.a('snap-work-requirements', 'SNAP work requirements')}.</p>`,
  related: ['snap-eligibility', 'snap-calculator', 'snap-work-requirements', 'snap-income-limits', 'state:oregon'],
  sources: ['cfr2735', 'cfr2739', 'usdaCola27'],
});
