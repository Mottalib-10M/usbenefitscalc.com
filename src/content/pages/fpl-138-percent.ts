import { definePage } from '../../lib/page-types';
import { P, fpl, fplAt, expansionStates, STATES, usd, listOf } from '../../lib/kit';

const pctLine = P.medicaid.expansionPct + P.medicaid.disregardPct;
const non = STATES.filter((s) => !s.medicaid.expansion).map((s) => s.name);
const rows = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => [`${n}`, usd(fplAt(n, pctLine)), usd(fplAt(n, pctLine) / 12), usd(fplAt(n, pctLine, 'ak') / 12), usd(fplAt(n, pctLine, 'hi') / 12)]);

export default definePage({
  id: 'fpl-138-percent',
  group: 'poverty',
  kind: 'threshold',
  order: 220,
  slug: '138-percent-federal-poverty-level',
  nav: '138% of the poverty level',
  card: `The Medicaid expansion line: ${usd(fplAt(1, pctLine))} a year for one person in 2026`,
  title: `138% of Poverty Level 2026: ${usd(fplAt(1, pctLine))} Medicaid Income Line`,
  description: `138% of the federal poverty level in 2026 is ${usd(fplAt(1, pctLine))} a year for one person and ${usd(fplAt(4, pctLine))} for four: the income line for adult Medicaid in expansion states.`,
  h1: '138% of the federal poverty level in 2026',
  intro: 'The number that decides whether an adult in an expansion state gets Medicaid or has to look at the Marketplace.',
  resume: `In 2026, 138% of the federal poverty level is ${usd(fplAt(1, pctLine))} a year, or ${usd(fplAt(1, pctLine) / 12)} a month, for a single adult in the 48 states and DC, and ${usd(fplAt(4, pctLine))} a year for a family of four. It is the income ceiling for Medicaid for adults aged 19 to 64 in the ${expansionStates().length} jurisdictions that adopted the ACA expansion. The law sets the expansion at ${P.medicaid.expansionPct}% of the poverty line, and federal rules add a disregard of ${P.medicaid.disregardPct} percentage points to every MAGI-based test, which is why the working figure is ${pctLine}%. States apply the current year's guideline, ${usd(fpl(1))} for one person in 2026, so the line moves up each spring when they switch tables. Above it, an adult can turn to the Marketplace, where the 2026 premium tax credit begins at 100% of the 2025 guideline and the lowest expected contribution applies.`,
  mini: 'fplThreshold',
  miniArg: { pct: pctLine },
  faqs: [
    { q: 'Why is the Medicaid limit 138% and not 133% of poverty?', a: `The Affordable Care Act wrote ${P.medicaid.expansionPct}% into the law, then required states to disregard income equal to ${P.medicaid.disregardPct}% of the poverty line when they measure income with MAGI rules. In practice the line is ${pctLine}%: a single adult with ${usd(fplAt(1, pctLine))} of yearly income in 2026 sits exactly at it. The disregard applies once, to the highest threshold for which the person could qualify.` },
    { q: 'What happens if my income goes just above 138% of the poverty level?', a: `You leave adult Medicaid at your next renewal or when you report the change, and you can enroll in a Marketplace plan in a special enrollment period. At that income your expected contribution for the benchmark silver plan is about ${P.aca.table2026[1][2]}% of income in 2026, and silver plans carry cost-sharing reductions, so the step is real but not a cliff.` },
    { q: 'Does 138% of poverty matter in states without Medicaid expansion?', a: `Not for adults: in ${listOf(non.slice(0, 4))} and the other non-expansion states, adults without children have no Medicaid group at that level, and parents are covered only far below it. The ${pctLine}% figure still shows up for children, because federal law sets their Medicaid floor at ${P.medicaid.expansionPct}% plus the disregard in every state.` },
  ],
  body: (h) => `<h2>Where the 138% line comes from</h2>
<p>The ACA expansion group covers adults 19 to 64 who are not pregnant, not on Medicare and have income up to ${P.medicaid.expansionPct}% of the federal poverty level. The ${h.src('cfr435603', 'MAGI rules of 42 CFR 435.603')} then subtract ${P.medicaid.disregardPct}% of the poverty line from income before comparing it with the limit, which is the same as raising the limit to ${pctLine}%. CMS lists every state at "133%" in its ${h.src('cmsLevels', 'table of eligibility levels')}, and the agencies publish monthly charts that already include the disregard. Both describe the same rule.</p>
<h2>The 2026 amounts</h2>
${h.table(['Household size', 'Per year (48 states, DC)', 'Per month', 'Per month, Alaska', 'Per month, Hawaii'], rows, `${pctLine}% of the 2026 HHS poverty guidelines. States round their charts in their own way, usually to the dollar.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>A raise at the edge of the line</h2>
<p>Medicaid looks at current monthly income, not the year. A single worker in an expansion state earning ${usd(1800)} a month is under the 2026 line of ${usd(fplAt(1, pctLine) / 12)}; a raise to ${usd(1900)} puts her over it. Her Marketplace credit would then be computed on yearly income against the 2025 guideline, and the benchmark plan would cost her roughly ${usd((P.aca.table2026[1][2] / 100) * 1900)} a month before cost-sharing help. Reporting the change on time avoids a coverage gap and an end-of-year surprise, since an advance credit taken too high is now repaid in full.</p>
<h2>Which income counts at 138%</h2>
<p>MAGI is the adjusted gross income of the tax return plus untaxed foreign income, tax-exempt interest and the untaxed part of Social Security benefits. SSI, child support received, veterans' disability payments and most gifts are left out. Self-employed workers count profit, not receipts. A household is built around tax filing: a single adult who is claimed as a dependent by a parent may be counted in the parent's household, which can push the family's income over the line even when the adult earns little.</p>
<h2>Who is outside the 138% rule</h2>
<p>Children, pregnant women and parents have their own groups, usually with higher limits for children and pregnancy and lower ones for parents in non-expansion states. People 65 and older and people qualifying through disability are tested under different rules, often with an asset limit. From ${P.medicaid.workRequirement.start.slice(0, 4)}, expansion adults will also have to meet a work or activity requirement, explained in ${h.a('medicaid-work-requirements', 'Medicaid work requirements')}. Your state's own chart is on its ${h.a('states', 'state page')}, and the ${h.a('medicaid-income-limits', 'Medicaid income limits')} calculator applies it to your household.</p>`,
  related: ['medicaid-income-limits', 'medicaid-expansion-states', 'federal-poverty-level', 'fpl-400-percent', 'aca-subsidy-calculator'],
  sources: ['cmsLevels', 'cfr435603', 'hhsPoverty', 'irsRp2525'],
});
