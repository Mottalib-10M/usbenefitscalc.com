import { definePage } from '../../lib/page-types';
import { P, STATES, fpl, fplAt, fplPctOf, snapGross, wicAnnual, acaCliff, expansionStates, usd, pct, day } from '../../lib/kit';

const sizes = [1, 2, 3, 4, 5, 6, 7, 8];
const add = (area: 'us' | 'ak' | 'hi', y: 2025 | 2026 = 2026) => P.fpl[String(y) as '2025' | '2026'][area][1];
const rows26 = [
  ...sizes.map((n) => [`${n}`, usd(fpl(n)), usd(fpl(n) / 12), usd(fpl(n, 'ak')), usd(fpl(n, 'ak') / 12), usd(fpl(n, 'hi')), usd(fpl(n, 'hi') / 12)]),
  ['Each additional person', `+${usd(add('us'))}`, `+${usd(add('us') / 12)}`, `+${usd(add('ak'))}`, `+${usd(add('ak') / 12)}`, `+${usd(add('hi'))}`, `+${usd(add('hi') / 12)}`],
];
const rows25 = [
  ...sizes.map((n) => [`${n}`, usd(fpl(n, 'us', 2025)), usd(fpl(n, 'ak', 2025)), usd(fpl(n, 'hi', 2025)), `+${usd(fpl(n) - fpl(n, 'us', 2025))}`]),
  ['Each additional person', `+${usd(add('us', 2025))}`, `+${usd(add('ak', 2025))}`, `+${usd(add('hi', 2025))}`, `+${usd(add('us') - add('us', 2025))}`],
];
const multiples = [100, 130, 138, 150, 185, 200, 250, 300, 400];
const multRows = multiples.map((m) => [`${m}%`, ...[1, 2, 3, 4].map((n) => usd(fplAt(n, m)))]);
const pageOf: Record<number, string> = { 130: 'fpl-130-percent', 138: 'fpl-138-percent', 185: 'fpl-185-percent', 200: 'fpl-200-percent', 250: 'fpl-250-percent', 400: 'fpl-400-percent' };
// The calculator's default case on this page: four people, $50,000 a year.
const ex26 = fplPctOf(4, 50000);
const ex25 = fplPctOf(4, 50000, 'us', 2025);
const rise = ((fpl(1) - fpl(1, 'us', 2025)) / fpl(1, 'us', 2025)) * 100;
const n200 = STATES.filter((s) => s.snap.bbce.some((b) => b.who === 'all' && b.grossPct === 200)).length;

export default definePage({
  id: 'federal-poverty-level',
  group: 'poverty',
  kind: 'pillar',
  order: 200,
  slug: 'federal-poverty-level',
  nav: 'Federal poverty level',
  card: `The 2026 HHS guidelines: ${usd(fpl(1))} for one person, ${usd(fpl(4))} for four, every percentage and every program`,
  title: `Federal Poverty Level 2026: ${usd(fpl(1))} for 1, ${usd(fpl(4))} for 4`,
  description: `Federal poverty level 2026: ${usd(fpl(1))} for one, ${usd(fpl(4))} for four, Alaska and Hawaii tables, the 2025 chart used for ACA plans and the 100% to 400% amounts.`,
  h1: 'Federal poverty level: the 2026 guidelines and how programs use them',
  intro: 'One table decides who qualifies for Medicaid, SNAP, WIC, CHIP and Marketplace help. Here it is for every household size, with the percentages programs actually apply.',
  resume: `The federal poverty level for 2026 is ${usd(fpl(1))} a year for one person in the 48 contiguous states and DC, plus ${usd(add('us'))} for each extra person: ${usd(fpl(2))} for two, ${usd(fpl(3))} for three and ${usd(fpl(4))} for a family of four. Alaska's figures are higher, ${usd(fpl(4, 'ak'))} for four, and Hawaii's sit in between at ${usd(fpl(4, 'hi'))}. HHS published these poverty guidelines in the Federal Register on January 15, 2026. Programs rarely use 100% itself: SNAP tests gross income at 130%, adult Medicaid in expansion states stops at 138%, WIC at 185%, and the premium tax credit runs from 100% to 400%. The year matters as much as the percentage. Medicaid, CHIP, SNAP and WIC now use the 2026 table, but 2026 Marketplace coverage is still measured against the 2025 guidelines, ${usd(fpl(4, 'us', 2025))} for four. A family of four earning ${usd(50000)} is at ${pct(Math.round(ex26 * 10) / 10)} of the 2026 guideline and ${pct(Math.round(ex25 * 10) / 10)} of the 2025 one.`,
  tool: 'fpl',
  toolProps: { size: 4, income: 50000 },
  faqs: [
    { q: 'What is the federal poverty level for a family of 4 in 2026?', a: `${usd(fpl(4))} a year in the 48 contiguous states and DC, which is about ${usd(fpl(4) / 12)} a month. In Alaska the 2026 guideline for four people is ${usd(fpl(4, 'ak'))} and in Hawaii ${usd(fpl(4, 'hi'))}. For health plans bought on the Marketplace for 2026, the older 2025 figure of ${usd(fpl(4, 'us', 2025))} still applies, because premium tax credits use the guidelines of the year before coverage.` },
    { q: 'When does HHS release the new poverty guidelines each year?', a: `In January, in the Federal Register. The 2026 guidelines appeared on January 15, 2026. Each program then switches on its own calendar: WIC applies them from July 1 at the latest, SNAP builds them into the limits that start each October 1, and Medicaid and CHIP use the current year's table. The Marketplace waits a full year, so the 2026 table will serve for 2027 coverage.` },
    { q: 'Why does the Marketplace still use the 2025 poverty guidelines?', a: `Because enrollment for a coverage year opens in November, before HHS publishes the new table. HealthCare.gov therefore measures income against the guidelines of the previous year: for 2026 plans, ${usd(fpl(1, 'us', 2025))} for one person and ${usd(fpl(4, 'us', 2025))} for four. The premium tax credit covers incomes from 100% to 400% of those figures, so ${usd(acaCliff(4))} is the 2026 ceiling for a family of four in the 48 states.` },
    { q: 'How do I calculate what percent of the poverty level I am?', a: `Divide your yearly household income by the guideline for your household size, then multiply by 100. A family of four with ${usd(50000)} divides by ${usd(fpl(4))} and gets about ${pct(Math.round(ex26 * 10) / 10)} of the 2026 level. Use the income each program counts: gross income for SNAP, modified adjusted gross income (MAGI) for Medicaid and the Marketplace. Monthly programs divide the yearly guideline by 12.` },
    { q: 'Do Puerto Rico and the other territories have a federal poverty level?', a: 'No. HHS does not define poverty guidelines for Puerto Rico, the U.S. Virgin Islands, Guam, American Samoa, the Northern Mariana Islands and the freely associated states. When a federal program serves one of them, the agency that runs it decides whether to apply the 48-state figures or another method. That is why benefit charts for the territories come from the program, not from HHS.' },
    { q: 'Why are the poverty guidelines higher in Alaska and Hawaii?', a: `HHS keeps separate figures for the two states as a continuation of a practice of the Office of Economic Opportunity that began in the 1966 to 1970 period. The gap is large: in 2026 one person is at ${usd(fpl(1, 'ak'))} in Alaska and ${usd(fpl(1, 'hi'))} in Hawaii, against ${usd(fpl(1))} elsewhere. The Census Bureau's statistical thresholds have never had separate Alaska or Hawaii amounts.` },
    { q: 'Does SSI or the EITC depend on the federal poverty level?', a: `No. HHS points out that cash assistance programs such as Supplemental Security Income and TANF do not use the poverty guidelines to decide eligibility, and neither does the Earned Income Tax Credit. SSI starts from a federal benefit rate of ${usd(P.ssi.individual)} a month in 2026, and the EITC from income brackets the IRS sets each year by number of children.` },
  ],
  body: (h) => `<h2>The 2026 poverty guidelines for every household size</h2>
<p>HHS issues three tables each January: one for the 48 contiguous states and the District of Columbia, one for Alaska and one for Hawaii. Each starts with a figure for one person and adds the same amount for each extra member, which is why a household of nine or ten is easy to work out. The monthly columns below are the yearly figure divided by 12; HHS publishes only yearly amounts, and agencies that run monthly tests do the division and rounding themselves. The ${h.src('hhsPoverty', '2026 guidelines on the ASPE site')} were printed in the ${h.src('frPoverty2026', 'Federal Register of January 15, 2026')}.</p>
${h.table(['Household size', '48 states and DC, per year', 'Per month', 'Alaska, per year', 'Per month', 'Hawaii, per year', 'Per month'], rows26, '2026 HHS poverty guidelines. Monthly amounts are the yearly guideline divided by 12, rounded to the dollar.', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The single-person guideline rose about ${pct(Math.round(rise * 10) / 10)} from 2025, from ${usd(fpl(1, 'us', 2025))} to ${usd(fpl(1))}, and the amount per additional person went from ${usd(add('us', 2025))} to ${usd(add('us'))}. Those increments are rounded and standardized on purpose: the statistical poverty measure behind them does not move in even steps, and program offices asked for a table that does.</p>
<h2>2025 or 2026: which table each program applies</h2>
<p>The table you need depends on the program and on the date, and mixing them up is an easy way to get a wrong answer. ${h.src('healthcareFpl', 'HealthCare.gov')} states the rule for health coverage plainly: the current year's guidelines decide Medicaid and CHIP, while the previous year's guidelines measure Marketplace savings for the next year. Food programs follow their own calendars.</p>
${h.table(['Program', 'Period', 'Guidelines used', 'Percentage that matters'], [
    [h.a('medicaid-income-limits', 'Medicaid'), '2026', '2026', `${P.medicaid.expansionPct + P.medicaid.disregardPct}% for expansion adults, other lines for children and pregnancy`],
    ['CHIP', '2026', '2026', 'set by each state'],
    [h.a('snap-income-limits', 'SNAP'), `${day(P.snap.from)} to ${day(P.snap.to)}`, '2026', `130% gross test, up to 200% in ${n200} states`],
    [h.a('wic-income-guidelines', 'WIC'), `${day(P.wic.from)} to ${day(P.wic.to)}`, '2026', `${P.wic.pct}%`],
    [h.a('aca-subsidy-calculator', 'Premium tax credit'), '2026 coverage', '2025', `${P.aca.minPct}% to ${P.aca.maxPct}%`],
  ], 'The year of the guidelines each program uses in 2026.', ['l', 'l', 'l', 'l'])}
<p>For SNAP, USDA turns the guidelines into monthly limits once a year: the gross limit for one person in fiscal year ${P.snap.fy} is ${usd(snapGross(1))}, which is 130% of ${usd(fpl(1))} divided by 12 and rounded up. WIC does the same at 185%, giving ${usd(wicAnnual(1))} a year for one person from ${day(P.wic.from)}. The Marketplace is the outlier, because open enrollment for a year starts in November, before HHS has the new figures. Here is the 2025 table, still in force for every 2026 premium tax credit and for the cost-sharing reductions on silver plans.</p>
${h.table(['Household size', '48 states and DC', 'Alaska', 'Hawaii', 'Change in 2026 (48 states)'], rows25, '2025 HHS poverty guidelines, per year: the reference for 2026 Marketplace coverage.', ['l', 'r', 'r', 'r', 'r'])}
<p>The gap creates odd results. The family of four in the calculator above, with ${usd(50000)} a year, is at ${pct(Math.round(ex26 * 10) / 10)} of poverty for its Medicaid or CHIP application and at ${pct(Math.round(ex25 * 10) / 10)} on its Marketplace application, both in the same year and both correct.</p>
<h2>Percentages of the poverty level from 100% to 400%</h2>
<p>Almost no program stops at 100%. Laws and regulations write a multiple of the guideline instead, so a household needs the dollar value of that multiple. The table gives the 2026 yearly amounts for one to four people in the 48 states and DC; the calculator above does any size, Alaska and Hawaii included.</p>
${h.table(['Percentage', '1 person', '2 people', '3 people', '4 people'], multRows, 'Multiples of the 2026 HHS poverty guidelines, 48 states and DC, per year.', ['l', 'r', 'r', 'r', 'r'])}
<p>Each line has its own page that explains who uses it and what happens just above it:</p>
<ul>
<li>${h.a(pageOf[130], '130% of the poverty level')}: the federal SNAP gross income test, and the real ceiling in states without a higher option.</li>
<li>${h.a(pageOf[138], '138% of the poverty level')}: Medicaid for adults in the ${expansionStates().length} expansion jurisdictions.</li>
<li>${h.a(pageOf[185], '185% of the poverty level')}: WIC and reduced-price school meals.</li>
<li>${h.a(pageOf[200], '200% of the poverty level')}: the broad SNAP limit of ${n200} states and the CHIP line in many others.</li>
<li>${h.a(pageOf[250], '250% of the poverty level')}: the end of cost-sharing reductions on Marketplace silver plans.</li>
<li>${h.a(pageOf[400], '400% of the poverty level')}: the 2026 ceiling of the premium tax credit, ${usd(acaCliff(4))} for four.</li>
</ul>
<h2>Guidelines, thresholds and the October 2025 gap</h2>
<p>"Federal poverty level" is the everyday name for two different measures. The Census Bureau's poverty thresholds are the original version: they are used for statistics, such as the official count of people in poverty, and they vary by family composition and by the age of the householder. The HHS poverty guidelines are a simplified version built for administration, with one figure per household size and no age distinction. HHS itself calls the phrase "federal poverty level" ambiguous and prefers "poverty guidelines" where precision matters, but agencies and HealthCare.gov use FPL for the guidelines, as this site does.</p>
<p>The guidelines carry a year lag in their substance. Those issued in January 2026 take the Census thresholds for 2024 and adjust them for price changes between 2024 and 2025 using the Consumer Price Index for All Urban Consumers (CPI-U). The 2026 edition has a quirk HHS flags in a note: because of the federal government shutdown in October 2025, the Bureau of Labor Statistics did not publish the CPI-U for that month. HHS therefore compared the average of the 11 available months of 2025 with the average of all 12 months of 2024. The guidelines published on January 15 are the ones programs apply, whatever the method behind them.</p>
<h3>Programs that do not use the guidelines</h3>
<p>HHS lists Head Start, SNAP, the National School Lunch Program, the Low-Income Home Energy Assistance Program and CHIP among the users of the guidelines or their multiples. It also names the exceptions. Cash assistance through TANF and ${h.a('ssi-payment-amount', 'Supplemental Security Income')} does not use them; SSI works from a federal benefit rate of ${usd(P.ssi.individual)} a month in 2026. The ${h.a('eitc-calculator', 'Earned Income Tax Credit')} does not use them either: the IRS sets its own brackets by number of children. Housing assistance follows a third logic, local income limits that HUD derives from each area's median income, explained in ${h.a('section-8-income-limits', 'Section 8 income limits')}.</p>
<p>When you compare your income with any of these figures, count it the way the program does. SNAP looks at gross monthly income of everyone who buys and prepares food together. Medicaid and the Marketplace use MAGI for the tax household, which leaves out SSI. A household of four in one program can be a household of three in another, so the percentage can differ even with the same paycheck. The ${h.a('home', 'benefits screener')} applies each rule side by side, and your ${h.a('states', 'state page')} shows the limits that apply where you live.</p>`,
  related: ['fpl-138-percent', 'fpl-400-percent', 'snap-income-limits', 'medicaid-income-limits', 'aca-subsidy-calculator', 'wic-income-guidelines'],
  sources: ['hhsPoverty', 'frPoverty2026', 'frPoverty2025', 'healthcareFpl', 'usdaCola27', 'frWic'],
});
