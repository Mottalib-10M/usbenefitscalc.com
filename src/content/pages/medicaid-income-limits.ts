import { definePage } from '../../lib/page-types';
import { P, STATES, medLimit, bhpOf, fpl, expansionStates, usd, day } from '../../lib/kit';

const M = P.medicaid;
const line = M.expansionPct + M.disregardPct;
const nExp = expansionStates().length;
const nNon = STATES.length - nExp;
// Reference household figures, read from the data (Ohio = a standard expansion state at 133% + 5).
const solo = medLimit('ohio', 'adult', 1);
const fam3 = medLimit('ohio', 'parent', 3);
const fam4 = medLimit('ohio', 'parent', 4);
const txParent = medLimit('texas', 'parent', 3);
const txKids = medLimit('texas', 'child6to18', 3);
const txPreg = medLimit('texas', 'pregnant', 2);
const nyKids = medLimit('new-york', 'child6to18', 3);
const dcAdult = medLimit('district-of-columbia', 'adult', 1);
const wiAdult = medLimit('wisconsin', 'adult', 1);
const akSolo = medLimit('alaska', 'adult', 1);
const hiSolo = medLimit('hawaii', 'adult', 1);
const mnBhp = bhpOf('minnesota', 1);
const nyBhp = bhpOf('new-york', 1);
const minPreg = Math.min(...STATES.map((s) => s.medicaid.pregnant ?? Infinity));
const maxKids = STATES.reduce((a, s) => ((medLimit(s.slug, 'child6to18', 3).monthly ?? 0) > (medLimit(a.slug, 'child6to18', 3).monthly ?? 0) ? s : a));

const cell = (slug: string, group: 'adult' | 'parent' | 'pregnant' | 'child6to18', size: number) => {
  const s = STATES.find((x) => x.slug === slug)!;
  const l = medLimit(slug, group, size);
  if (l.monthly == null) return 'Not expanded';
  let tag = '';
  if (group === 'adult' && !s.medicaid.expansion) tag = ' (waiver)';
  if (group === 'parent' && l.program === 'Medicaid' && s.medicaid.parentDollarStandard) tag = ' ($)';
  if (l.program === 'CHIP') tag = ' (CHIP)';
  return `${usd(l.monthly)}${tag}`;
};

export default definePage({
  id: 'medicaid-income-limits',
  group: 'health',
  kind: 'pillar',
  order: 10,
  slug: 'medicaid-income-limits',
  nav: 'Medicaid income limits',
  card: `Monthly limits for adults, parents, pregnancy and children in all ${STATES.length} jurisdictions`,
  title: `Medicaid Income Limits 2026: ${usd(solo.monthly ?? 0)} a Month for One Adult`,
  description: `Medicaid income limits for 2026 in every state: ${usd(solo.monthly ?? 0)} a month for one adult where Medicaid expanded, ${usd(fam3.monthly ?? 0)} for a family of 3, and pregnancy and CHIP lines.`,
  h1: 'Medicaid income limits by state',
  intro: 'One table for the 50 states and DC, by group, in monthly dollars, with the calculator that applies your state.',
  resume: `In 2026 a single adult can earn up to ${usd(solo.monthly ?? 0)} a month and still get Medicaid in the ${nExp} jurisdictions that expanded it, and a parent in a family of three up to ${usd(fam3.monthly ?? 0)}. Those figures are ${line}% of the 2026 poverty guideline, the ${M.expansionPct}% written in the law plus the ${M.disregardPct}-point income disregard. In the ${nNon} states without expansion the picture changes completely: an adult without children has no income group at all, except under Wisconsin's waiver, and parents qualify only far below poverty, ${usd(txParent.monthly ?? 0)} a month for a family of three in Texas. Children and pregnant women get much higher lines everywhere: in Texas, ${usd(txKids.monthly ?? 0)} a month for a family of three with a child of 6 to 18, through CHIP, and ${usd(txPreg.monthly ?? 0)} for a pregnant woman counted as a household of two. Income means MAGI, gross income with a few additions, measured month by month. The table below lists every state, and the calculator tests your own household.`,
  tool: 'medicaid',
  toolProps: { state: 'florida' },
  faqs: [
    { q: 'What is the Medicaid income limit for a single person in 2026?', a: `In an expansion state, ${usd(solo.monthly ?? 0)} a month, or ${usd(solo.annual ?? 0)} a year, in the 48 contiguous states and DC; Alaska and Hawaii are higher. DC goes further, to ${usd(dcAdult.monthly ?? 0)}. In the ${nNon} states without expansion a single adult under 65 who is not pregnant, disabled or a parent has no Medicaid group, whatever the income, except in Wisconsin, where a waiver covers adults up to ${usd(wiAdult.monthly ?? 0)} a month.` },
    { q: 'Does Medicaid look at gross or net income?', a: `Neither exactly: it uses modified adjusted gross income, or MAGI. That is the adjusted gross income of your tax return, after pre-tax items such as deductible IRA contributions, plus tax-exempt interest, untaxed foreign income and non-taxable Social Security benefits. SSI does not count. Take-home pay is the wrong figure: income tax and payroll tax withheld from a paycheck are still part of MAGI. The agency then subtracts ${M.disregardPct}% of the poverty guideline before comparing income with the limit.` },
    { q: 'How much can a family of 4 make and qualify for Medicaid?', a: `Up to ${usd(fam4.monthly ?? 0)} a month for the parents in a standard expansion state in 2026, which is ${line}% of the ${usd(fpl(4))} guideline for four. Children in the same family usually qualify at a much higher income through Medicaid or CHIP. In a state without expansion the parents' line is a state standard, often a few hundred dollars a month, while the children stay covered up to at least ${line}% of poverty.` },
    { q: 'Can my kids get Medicaid even if I make too much for it?', a: `Yes, and it happens often. Each person is tested against the line of his or her own group, using the same household income. Federal law sets the floor for children at ${M.expansionPct}% of poverty plus the disregard, and most states go well above it through CHIP. In ${maxKids.name} the line for a child of 6 to 18 in a family of three is ${usd(medLimit(maxKids.slug, 'child6to18', 3).monthly ?? 0)} a month, far more than any adult limit.` },
    { q: 'What is the income limit for Medicaid if I am pregnant?', a: `It depends on the state and runs from ${minPreg + M.disregardPct}% of poverty upward once the disregard is added, as of the CMS table of ${day('2023-12-01')}. Count the unborn child in the household: a pregnant woman living alone is a household of two. In Texas that gives ${usd(txPreg.monthly ?? 0)} a month in 2026. After the birth, Medicaid continues through a postpartum period.` },
    { q: 'Why are the Medicaid limits higher in Alaska and Hawaii?', a: `Because HHS publishes separate, higher poverty guidelines for the two states, ${usd(fpl(1, 'ak'))} and ${usd(fpl(1, 'hi'))} for one person in 2026 against ${usd(fpl(1))} elsewhere. The percentages are the same, so the dollar lines rise: a single adult qualifies up to ${usd(akSolo.monthly ?? 0)} a month in Alaska and ${usd(hiSolo.monthly ?? 0)} in Hawaii, both expansion states.` },
    { q: 'Are these Medicaid percentages still current in 2026?', a: `The dollar amounts are computed with the 2026 poverty guidelines, but the percentages come from the latest CMS table of state levels, dated ${day('2023-12-01')}. A state that changed a level since then, for example through a new waiver, may differ. Your state agency's own chart wins, and the state page links to it. Dates in the 2025 law, such as the work requirement from ${day(M.workRequirement.start)}, do not change the income lines.` },
  ],
  body: (h) => {
    const rows = STATES.map((s) => [h.a(`state:${s.slug}`, s.name), cell(s.slug, 'adult', 1), cell(s.slug, 'parent', 3), cell(s.slug, 'pregnant', 2), cell(s.slug, 'child6to18', 3)]);
    return `<h2>One household, several income lines</h2>
<p>Medicaid does not have one income limit. It has a line for each coverage group, and the same family can sit under one and over another. The groups that use MAGI are adults 19 to 64 in the expansion group, parents and caretaker relatives, pregnant women, infants under 1, children 1 to 5 and children 6 to 18. CMS publishes each state's level for each group in percent of the poverty guideline in its ${h.src('cmsLevels', 'table of eligibility levels')}; the calculator above converts them into 2026 dollars for your household size. People 65 and older, and people who qualify through blindness or disability, are tested under other rules, often with an asset test, and are not in this table.</p>
<p>The ${M.disregardPct}% disregard is added to every MAGI line. The ${h.src('cfr435603', 'income rules of 42 CFR 435.603')} tell the agency to subtract an amount equal to ${M.disregardPct}% of the guideline from household income when that makes the difference for a person. The effect is the same as raising the line by five points, which is how the figures below are built. The longer story of the expansion line is on the page about ${h.a('fpl-138-percent', '138% of the poverty level')}.</p>
<h2>The limits in every state</h2>
${h.table(['State', 'Single adult', 'Parent, family of 3', 'Pregnant, household of 2', 'Child 6 to 18, family of 3'], rows, `Monthly income limits in 2026: CMS level plus ${M.disregardPct} points, applied to the 2026 HHS guideline. ($) = the state sets a dollar standard for parents, converted by CMS. (CHIP) = the child line comes from the separate CHIP program. Levels as of ${day('2023-12-01')}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Reading the table</h2>
<p>The single-adult column splits the country in two. Where the state expanded, the limit is ${usd(solo.monthly ?? 0)} in the 48 contiguous states. ${h.a('state:district-of-columbia', 'DC')} is the exception upward, with ${usd(dcAdult.monthly ?? 0)}, because its adult level is 210% of poverty. ${h.a('state:wisconsin', 'Wisconsin')} did not adopt the expansion, but a section 1115 waiver covers adults up to 95% of poverty, ${usd(wiAdult.monthly ?? 0)} a month. Everywhere else marked "not expanded", income does not matter for an adult without children: there is no group to join. The details, state by state, are in ${h.a('medicaid-expansion-states', 'Medicaid expansion states')}.</p>
<p>The parent column shows the widest gaps. In expansion states a parent can always use the adult group, so the line never drops below ${line}% of poverty, ${usd(fam3.monthly ?? 0)} for three. In non-expansion states parents are held to the state's parent and caretaker standard, which many of them express in dollars rather than percentages. CMS converts those dollars into a percentage and shows the highest one, so treat the figure as an upper bound and check the state's chart.</p>
<p>For children and pregnancy, every state is above the federal floor, and most by a wide margin. Where the child column says CHIP, the coverage comes from the state's separate CHIP program, a program with its own name in many states, listed on each state page. ${h.a('state:new-york', 'New York')} reaches ${usd(nyKids.monthly ?? 0)} a month for a child in a family of three.</p>
<h2>Alaska, Hawaii, Minnesota and New York</h2>
<p>Alaska and Hawaii use their own poverty guidelines, so the same percentage buys a higher dollar line: ${usd(akSolo.monthly ?? 0)} for a single adult in ${h.a('state:alaska', 'Alaska')} and ${usd(hiSolo.monthly ?? 0)} in ${h.a('state:hawaii', 'Hawaii')}, against ${usd(solo.monthly ?? 0)} in the other states.</p>
<p>${h.a('state:minnesota', 'Minnesota')} and New York add a step above Medicaid. Adults with income above the expansion line and up to 200% of poverty are covered through a Basic Health Program, which the calculator shows separately: up to ${usd(mnBhp?.monthly ?? 0)} a month for one person in Minnesota and ${usd(nyBhp?.monthly ?? 0)} in New York with the disregard. Minnesota calls it MinnesotaCare. In both states, an adult who earns a little too much for Medicaid does not go straight to the Marketplace.</p>
<h2>What counts as income</h2>
<p>MAGI is the adjusted gross income on the federal tax return plus three items: untaxed foreign income, non-taxable Social Security benefits and tax-exempt interest (${h.src('healthcareFpl', 'HealthCare.gov')}). SSI is left out. Medicaid looks at current monthly income, unlike the Marketplace, which works with a yearly estimate. A seasonal worker can therefore qualify in a slow month and lose eligibility in a busy one, and should report changes. The household follows tax filing: who files a return and who is claimed as a dependent decide whose income is added, rules explained in ${h.a('medicaid-eligibility', 'Medicaid eligibility')}.</p>
<p>Above the line, the next stop for most adults is the premium tax credit, estimated in the ${h.a('aca-subsidy-calculator', 'ACA subsidy calculator')}. Below 100% of poverty in a non-expansion state, the credit is not available either, the gap described in ${h.a('medicaid-expansion-states', 'the expansion guide')}.</p>`;
  },
  related: ['medicaid-eligibility', 'medicaid-expansion-states', 'fpl-138-percent', 'aca-subsidy-calculator', 'state:texas', 'state:florida'],
  sources: ['cmsLevels', 'cfr435603', 'hhsPoverty', 'healthcareFpl'],
});
