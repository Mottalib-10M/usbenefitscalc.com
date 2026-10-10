import { definePage } from '../../lib/page-types';
import { P, STATES, fpl, fplAt, snapGrossState, snapCalc, usd, listOf } from '../../lib/kit';

const all200 = STATES.filter((s) => s.snap.bbce.some((b) => b.who === 'all' && b.grossPct === 200));
const states200 = all200.filter((s) => s.slug !== 'district-of-columbia').map((s) => s.name);
const hasDc = all200.some((s) => s.slug === 'district-of-columbia');
const noAsset = all200.filter((s) => s.snap.bbce.some((b) => b.who === 'all' && b.grossPct === 200 && b.assetLimit == null)).length;
const otherPcts = [...new Set(STATES.flatMap((s) => s.snap.bbce.filter((b) => b.who === 'all' && b.grossPct !== 200).map((b) => b.grossPct)))].sort((a, b) => a - b);
const partial200 = STATES.filter((s) => !s.snap.bbce.some((b) => b.who === 'all') && s.snap.bbce.some((b) => b.grossPct === 200)).map((s) => s.name);
// Highest Medicaid or CHIP line for children 6 to 18 in the CMS table (before the 5-point disregard), between 200% and 215%.
const top = (s: (typeof STATES)[number]) => Math.max(s.medicaid.chip ?? 0, s.medicaid.child6to18 ?? 0);
const chipNear = STATES.filter((s) => top(s) >= 200 && top(s) <= 215).sort((a, b) => top(a) - top(b));
const chipList = chipNear.map((s) => `${s.name} (${top(s)}%)`);
const rows = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => [`${n}`, usd(fplAt(n, 200)), usd(fplAt(n, 200) / 12), `<strong>${usd(snapGrossState('pennsylvania', n))}</strong>`, usd(snapGrossState('alaska', n)), usd(snapGrossState('hawaii', n))]);
// A family of four in Pennsylvania (200% state), $1,400 rent, at two income levels.
const at5000 = snapCalc('pennsylvania', { size: 4, earned: 5000, housing: 1400 });
const at4000 = snapCalc('pennsylvania', { size: 4, earned: 4000, housing: 1400 });
const band = P.aca.table2026.find((r) => r[1] === 200) as number[];

export default definePage({
  id: 'fpl-200-percent',
  group: 'poverty',
  kind: 'threshold',
  order: 240,
  slug: '200-percent-federal-poverty-level',
  nav: '200% of the poverty level',
  card: `The most common SNAP ceiling and a frequent CHIP line: ${usd(fplAt(1, 200))} a year for one person`,
  title: `200% of Poverty Level 2026: ${usd(fplAt(1, 200))}, SNAP in ${all200.length} States`,
  description: `200% of the poverty level in 2026 is ${usd(fplAt(1, 200))} for one person and ${usd(fplAt(4, 200))} for four: the SNAP gross limit in ${all200.length} states with BBCE and a frequent CHIP line.`,
  h1: '200% of the federal poverty level: the broad SNAP limit and CHIP',
  intro: 'Double the poverty guideline is where food assistance stops in most states and where several states draw the line for children\'s coverage.',
  resume: `200% of the 2026 poverty guideline is ${usd(fplAt(1, 200))} a year for one person, ${usd(fplAt(3, 200))} for three and ${usd(fplAt(4, 200))} for four in the 48 states and DC, about ${usd(fplAt(4, 200) / 12)} a month for a family of four. It is the most common SNAP income limit in practice: ${states200.length} states${hasDc ? ' and the District of Columbia' : ''} use broad-based categorical eligibility to let every household apply with gross income up to 200% of the guideline, instead of the federal 130%, and drop the asset test or loosen it. In those states the SNAP gross limit for fiscal year ${P.snap.fy} is ${usd(snapGrossState('pennsylvania', 4))} a month for four. Reaching the limit does not mean a large benefit: a Pennsylvania family of four earning ${usd(5000)} a month qualifies but gets ${usd(at5000.benefit)}. For children, ${chipNear.length} states have a top Medicaid or CHIP line between 200% and 215% of poverty in the CMS table, before the 5-point MAGI disregard.`,
  mini: 'fplThreshold',
  miniArg: { pct: 200 },
  faqs: [
    { q: 'What is 200 percent of the federal poverty level for a family of 4?', a: `${usd(fplAt(4, 200))} a year in 2026 in the 48 states and DC, twice the ${usd(fpl(4))} guideline, or ${usd(fplAt(4, 200) / 12)} a month. In Alaska it is ${usd(fplAt(4, 200, 'ak'))} and in Hawaii ${usd(fplAt(4, 200, 'hi'))}. Marketplace subsidies for 2026 use the 2025 guideline instead, so 200% there is ${usd(fplAt(4, 200, 'us', 2025))} for four.` },
    { q: 'Which states have a 200% SNAP income limit?', a: `${listOf(states200)}${hasDc ? ', plus the District of Columbia' : ''}, according to USDA's June 2026 table of broad-based categorical eligibility. ${partial200.length ? `${listOf(partial200)} use${partial200.length === 1 ? 's' : ''} 200% only for some households. ` : ''}Elsewhere the line is ${otherPcts.slice(0, -1).map((x) => `${x}%`).join(', ')} or ${otherPcts[otherPcts.length - 1]}%.` },
    { q: 'If I pass the 200% SNAP limit, am I sure to get benefits?', a: `No. The 200% test only opens the door; the benefit is still the maximum allotment minus 30% of net income. A Pennsylvania family of four earning ${usd(5000)} a month with ${usd(1400)} rent passes the ${usd(snapGrossState('pennsylvania', 4))} limit but gets about ${usd(at5000.benefit)}. At ${usd(4000)} the same family gets about ${usd(at4000.benefit)}. Households of three or more have no minimum benefit.` },
  ],
  body: (h) => `<h2>How 200% became the usual SNAP ceiling</h2>
<p>Federal law sets the SNAP gross income test at 130% of the poverty line, but it also makes households categorically eligible when they receive a benefit funded by TANF or state maintenance-of-effort money. States turned that rule into broad-based categorical eligibility: a brochure, a referral line or another service financed with TANF money is offered to every applicant, and the state sets that service's income limit. ${h.src('fnaBbce', 'USDA lists')} ${states200.length} states${hasDc ? ' and DC' : ''} that set it at 200% for every household: ${listOf(states200)}. ${partial200.length ? `${listOf(partial200)} use${partial200.length === 1 ? 's' : ''} 200% for part of its caseload only.` : ''}</p>
${h.table(['Household size', '200% per year (2026)', '200% per month', 'SNAP gross limit, 200% states', 'Alaska', 'Hawaii'], rows, `200% of the 2026 HHS guidelines and the SNAP gross monthly limits of fiscal year ${P.snap.fy} in states using 200% (monthly, rounded up).`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The option has a second effect that matters as much as the income line: ${noAsset === all200.length ? `none of these ${all200.length} jurisdictions has an asset limit for SNAP` : `${noAsset} of these ${all200.length} jurisdictions have no asset limit for SNAP`}, and categorically eligible households do not face the net income test. The ${h.a('fpl-130-percent', '130% page')} shows what changes in the states that did not take this route.</p>
<h2>Near the top of the range, the benefit shrinks</h2>
<p>Passing at 200% does not guarantee much food money, because the amount is still computed the usual way. A family of four in Pennsylvania with ${usd(1400)} of rent and ${usd(5000)} of monthly earnings has ${usd(at5000.net)} of net income after deductions; 30% of that, ${usd(at5000.thirtyPercent)}, nearly cancels the ${usd(at5000.maxAllotment)} maximum allotment, leaving ${usd(at5000.benefit)}. At ${usd(4000)}, the shelter deduction bites harder and the estimate rises to ${usd(at4000.benefit)}. Families of one or two get at least the minimum benefit of ${usd(P.snap.minBenefit.us)}; larger households can qualify and receive nothing. The eligibility can matter more than the amount: a person certified for SNAP is automatically income eligible for WIC under 7 CFR 246.7, whatever the WIC income chart says.</p>
<h2>Children's coverage drawn near 200%</h2>
<p>CMS lists, for each state, the highest income line at which children aged 6 to 18 get Medicaid or CHIP. In ${chipNear.length} states that line falls between 200% and 215% of the poverty level: ${listOf(chipList)}. These figures come from the ${h.src('cmsLevels', 'CMS table of eligibility levels')}, which states the levels before the 5-point MAGI disregard, so the working line is five points higher. A family just above 200% in one of these states may find its children covered while the parents look to the Marketplace.</p>
<p>The 200% mark also ends a band of the 2026 premium tax credit: between ${band[0]}% and ${band[1]}% of the 2025 guideline, the expected contribution climbs from ${band[2]}% to ${band[3]}% of income. Above it starts the band explained on the ${h.a('fpl-250-percent', '250% page')}. For any household size, the ${h.a('federal-poverty-level', 'federal poverty level')} calculator gives the exact figure, and each ${h.a('states', 'state page')} shows your state's lines side by side.</p>`,
  related: ['snap-income-limits', 'fpl-130-percent', 'fpl-250-percent', 'medicaid-income-limits', 'state:pennsylvania'],
  sources: ['fnaBbce', 'usdaCola27', 'cmsLevels', 'hhsPoverty', 'irsRp2525'],
});
