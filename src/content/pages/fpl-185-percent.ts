import { definePage } from '../../lib/page-types';
import { P, STATES, fpl, fplAt, wicAnnual, wicMonthly, snapGrossState, usd, day, listOf } from '../../lib/kit';

const W = P.wic;
const up = (n: number, area: 'ak' | 'hi') => Math.ceil(fplAt(n, W.pct, area));
const rows = [
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => [`${n}`, `<strong>${usd(wicAnnual(n))}</strong>`, usd(wicMonthly(n)), usd(up(n, 'ak')), usd(up(n, 'hi'))]),
  ['Each additional person', `+${usd(W.annual.us[8])}`, `+${usd(W.monthly.us[8])}`, `+${usd(up(2, 'ak') - up(1, 'ak'))}`, `+${usd(up(2, 'hi') - up(1, 'hi'))}`],
];
const snap185 = STATES.filter((s) => s.snap.bbce.some((b) => b.who === 'all' && b.grossPct === W.pct)).map((s) => s.name);
const kids185 = STATES.filter((s) => Math.max(s.medicaid.chip ?? 0, s.medicaid.child6to18 ?? 0) === W.pct).map((s) => s.name);
// Pregnancy coverage above 185% in the CMS table (before the 5-point MAGI disregard).
const pregAbove = STATES.filter((s) => Math.max(s.medicaid.pregnant ?? 0, s.medicaid.pregnantChip ?? 0) > W.pct);
const pregTop = [...pregAbove].sort((a, b) => Math.max(b.medicaid.pregnant ?? 0, b.medicaid.pregnantChip ?? 0) - Math.max(a.medicaid.pregnant ?? 0, a.medicaid.pregnantChip ?? 0))[0];
const pregTopPct = Math.max(pregTop.medicaid.pregnant ?? 0, pregTop.medicaid.pregnantChip ?? 0);

export default definePage({
  id: 'fpl-185-percent',
  group: 'poverty',
  kind: 'threshold',
  order: 230,
  slug: '185-percent-federal-poverty-level',
  nav: '185% of the poverty level',
  card: `The WIC and reduced-price school meal line: ${usd(wicAnnual(1))} a year for one person until June 30, 2027`,
  title: `185% of Poverty Level 2026: ${usd(wicAnnual(1))} WIC Income Line`,
  description: `185% of the poverty level is ${usd(wicAnnual(1))} a year for one and ${usd(wicAnnual(4))} for four from July 1, 2026: the WIC and reduced-price school meal limit, with Alaska and Hawaii.`,
  h1: '185% of the federal poverty level: WIC and reduced-price meals',
  intro: 'The line that federal law borrowed from the school lunch program and applied to WIC, and that a few states use for food stamps too.',
  resume: `185% of the 2026 poverty guideline is ${usd(wicAnnual(1))} a year for one person, ${usd(wicAnnual(3))} for three and ${usd(wicAnnual(4))} for four in the 48 states and DC, or ${usd(wicMonthly(4))} a month for a family of four. Federal law makes it the income ceiling of WIC by pointing to the standard for reduced-price school meals, which is 185% of the poverty guidelines. USDA published the figures on April 29, 2026, and they apply from ${day(W.from)} to ${day(W.to)}; a state may switch earlier, on the date it updates its Medicaid charts, but not later than July 1. Alaska's ceiling for four is ${usd(up(4, 'ak'))} and Hawaii's ${usd(up(4, 'hi'))}. The line is not absolute for WIC: anyone on SNAP, TANF or Medicaid, or in a family where a pregnant woman or infant is on Medicaid, counts as income eligible automatically. In ${listOf(snap185)}, 185% is also the gross income limit for SNAP.`,
  mini: 'fplThreshold',
  miniArg: { pct: 185 },
  faqs: [
    { q: 'What is 185 percent of the poverty level for a family of 4?', a: `${usd(wicAnnual(4))} a year, or ${usd(wicMonthly(4))} a month, in the 48 states and DC, for the period from ${day(W.from)} to ${day(W.to)}. That is the 2026 guideline of ${usd(fpl(4))} times 1.85, rounded up to the next dollar. In Alaska the figure for four is ${usd(up(4, 'ak'))} a year and in Hawaii ${usd(up(4, 'hi'))}.` },
    { q: 'Can I get WIC if I make more than 185% of poverty?', a: `Yes, if you are on SNAP, TANF or Medicaid. Federal rules require WIC agencies to accept those applicants as income eligible without measuring income again, and the same goes for members of a family where a pregnant woman or an infant is on Medicaid. Because Medicaid for pregnancy reaches above 185% in ${pregAbove.length} jurisdictions, some WIC participants have incomes above the line. You still need a nutritional risk.` },
    { q: 'Do WIC and reduced-price school lunch use the same income limit?', a: `Yes, at the federal level. The Child Nutrition Act makes WIC income eligibility follow the reduced-price meal standard of the National School Lunch Act, which is 185% of the poverty guidelines, and USDA computes both the same way. A state may set WIC at its own health care guidelines instead, but never above 185% nor below 100% of the poverty guidelines.` },
  ],
  body: (h) => `<h2>Why WIC and school meals share the 185% line</h2>
<p>WIC has no income limit of its own in the law. Section 17(d)(2)(A) of the Child Nutrition Act says a person is income eligible if the family meets the standard for reduced-price school meals under section 9(b) of the Richard B. Russell National School Lunch Act, and section 9(b) sets that standard at 185% of the poverty guidelines. The ${h.src('frWic', 'WIC notice of April 29, 2026')} applies it to the HHS guidelines published on January 15, 2026: each guideline is multiplied by 1.85 and rounded upward to the next whole dollar. The monthly, twice-monthly, bi-weekly and weekly columns of the notice are rounded up the same way, so a monthly limit is never a cent below 185%. For one person that gives ${usd(wicAnnual(1))} a year and ${usd(wicMonthly(1))} a month.</p>
<h2>The 2026/2027 amounts at 185%</h2>
${h.table(['Household size', '48 states and DC, per year', 'Per month', 'Alaska, per year', 'Hawaii, per year'], rows, `185% of the 2026 HHS poverty guidelines, rounded up, as published for WIC from ${day(W.from)} to ${day(W.to)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>A state agency may not run WIC above these figures. Under ${h.src('cfr2467', '7 CFR 246.7')} it can instead align WIC with state or local guidelines for free or reduced-price health care, provided they stay between 100% and 185% of the poverty guidelines. The 2026/2027 chart had to be in place by July 1, 2026, and a state was free to adopt it earlier, together with its Medicaid update. Income is compared with the column for the applicant's family size, so the household count matters as much as the paycheck.</p>
<h2>Above the line: automatic eligibility through other programs</h2>
<p>The 185% figure is only one route in. The same regulation requires WIC to accept as income eligible anyone certified for SNAP, for TANF, or for Medicaid (including presumptive eligibility), plus members of a family receiving TANF and members of a family in which a pregnant woman or an infant is on Medicaid. Medicaid lines often reach higher than WIC's: CMS lists pregnancy coverage above 185% of poverty in ${pregAbove.length} of the 50 states and DC, up to ${pregTopPct}% in ${pregTop.name}, before the 5-point MAGI disregard. A pregnant woman enrolled there is income eligible for WIC whatever the 185% chart says, and so is her infant after birth, through the family rule. The ${h.a('wic-income-guidelines', 'WIC income guidelines')} page covers the program itself.</p>
<h2>Other programs drawn at 185%</h2>
<p>SNAP uses the same percentage in a handful of states. ${listOf(snap185)} set their broad-based categorical eligibility at 185% of the poverty guideline, which gives a family of four a gross limit of ${usd(snapGrossState('new-jersey', 4))} a month in fiscal year ${P.snap.fy}, well above the federal ${h.a('fpl-130-percent', '130% test')} but below the ${h.a('fpl-200-percent', '200% line')} of most states. For children, CMS lists a top Medicaid or CHIP line of exactly 185% in ${listOf(kids185)}; other states' figures are on each ${h.a('states', 'state page')}. For the whole table of percentages, see the ${h.a('federal-poverty-level', 'federal poverty level')}.</p>`,
  related: ['wic-income-guidelines', 'federal-poverty-level', 'fpl-130-percent', 'fpl-200-percent', 'state:new-jersey'],
  sources: ['frWic', 'cfr2467', 'hhsPoverty', 'cmsLevels', 'fnaBbce'],
});
