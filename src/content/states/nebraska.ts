import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, snapGross, medLimit, medCheck, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('nebraska');
const b = S.snap.bbce[0];
const cap = b.assetLimit ?? 0;
const adult = medLimit('nebraska', 'adult', 1);
const kid = medLimit('nebraska', 'child6to18', 3);
const preg = medLimit('nebraska', 'pregnant', 2);
// A single father of two in Omaha (Douglas County): $3,300 of wages, $1,100 rent, gas heat, $20,000 left from a home sale.
const ex = snapCalc('nebraska', { size: 3, earned: 3300, housing: 1100, assets: 20000 });
const exOver = snapCalc('nebraska', { size: 3, earned: 3300, housing: 1100, assets: 30000 });
const dad = medCheck('nebraska', 'parent', 3, 3300);
const kids = medCheck('nebraska', 'child6to18', 3, 3300);
const sau = hudOf('nebraska', 'Saunders County', 4);
const dou = hudOf('nebraska', 'Douglas County', 4);
const lan = hudOf('nebraska', 'Lancaster County', 4);
const hall = hudOf('nebraska', 'Hall County', 4);

export default defineStatePage({
  slug: 'nebraska',
  title: `Nebraska SNAP 2027: ${b.grossPct}% Income Test and a ${usd(cap)} Asset Cap`,
  description: `Nebraska benefits 2026: SNAP gross limit ${usd(snapGrossState('nebraska', 3))} a month for 3 (${b.grossPct}% of poverty), with liquid assets up to ${usd(cap)}, Medicaid for adults to ${usd(adult.monthly ?? 0)} a month.`,
  intro: `Nebraska sits between the strict and the open states: a gross income test at ${b.grossPct}% of poverty, and a savings cap high enough that few working families ever reach it.`,
  resume: `Nebraska uses broad-based categorical eligibility with an unusual pair of settings: a gross income limit at ${b.grossPct}% of poverty, ${usd(snapGrossState('nebraska', 3))} a month for a household of three in fiscal year ${P.snap.fy}, and a liquid asset limit of ${usd(cap)}. Below both lines a household skips the federal net income test and the usual ${usdx(P.snap.assets.general)} resource limit. A single father in Omaha with two children, ${usd(3300)} of wages, ${usd(1100)} of rent and ${usd(20000)} in the bank from a home sale would receive about ${usd(ex.benefit)} a month with the state's heating allowance of ${usdx(sua('nebraska', 3) ?? 0)}. At ${usd(30000)} of savings the same household ${exOver.eligible ? 'would still qualify' : 'would not qualify'}, because the federal tests take over. Nebraska expanded Medicaid: adults qualify up to ${usd(adult.monthly ?? 0)} a month for one person, and children up to ${kid.effectivePct}% of poverty, all within Medicaid.`,
  body: (h) => `<h2>Two Nebraska lines: ${b.grossPct}% and ${usd(cap)}</h2>
<p>The USDA chart of June 2026 lists Nebraska with a gross limit of ${b.grossPct}% and ${b.assetText.toLowerCase()} (${h.src('fnaBbce', 'USDA BBCE chart')}). Most states that use categorical eligibility set the gross line at 200% and drop the asset test entirely; Nebraska picked a lower income line and kept a savings ceiling, though at a level that only a household with a large lump sum is likely to reach. For three people, ${usd(snapGrossState('nebraska', 3))} sits between the federal 130% line of ${usd(snapGross(3))} and what 200% would give. The Omaha father passes both lines, so no net income test applies: his allotment of ${usd(ex.benefit)} comes from net income of ${usd(ex.net)} after a shelter deduction of ${usd(ex.deductions.shelter)}.</p>
<h2>What happens above ${usd(cap)}</h2>
<p>With ${usd(30000)} saved, the father loses categorical eligibility and falls back on the federal tests. They are harsher on two counts: the resource limit becomes ${usdx(P.snap.assets.general)}, and gross income must be under ${usd(snapGross(3))}. His ${usd(3300)} of wages is above that gross line, so the case ${exOver.eligible ? 'survives' : 'fails on income before the savings are even weighed'}. A household with a member 60 or older or disabled is treated more gently by federal rules, which skip the gross test and allow ${usdx(P.snap.assets.elderlyDisabled)} in resources. Only liquid assets count toward Nebraska's ${usd(cap)}: cash, bank accounts and similar funds.</p>
<h2>Medicaid in Nebraska, children included</h2>
<p>Nebraska has no separate CHIP in the CMS table: children are on Medicaid up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for a family of three, so the Omaha children ${kids.eligible ? 'are covered' : 'are not covered'}. The father, at ${Math.round(dad.pctIncome)}% of poverty, ${dad.eligible ? 'is covered as well' : 'is above the adult line'} of ${adult.effectivePct}%${dad.eligible ? '' : ' and can use HealthCare.gov with the premium tax credit'}. Pregnant women qualify up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for two. Applications for SNAP and Medicaid go through iServe Nebraska, run by the ${S.medicaid.agency}.</p>
${h.mini('fplThreshold', { pct: b.grossPct })}
<h2>A narrow housing range</h2>
<p>Nebraska's HUD limits vary less than in most states. Saunders County has the top very low income limit for four, ${usd(sau.vli)}; Douglas County and Omaha are at ${usd(dou.vli)}, Lancaster County and Lincoln at ${usd(lan.vli)}, Hall County and Grand Island at ${usd(hall.vli)}, the rural floor. Neighbors ${h.a('state:iowa', 'Iowa')} (160%) and ${h.a('state:kansas', 'Kansas')} (no categorical eligibility) set SNAP differently; ${h.a('state:colorado', 'Colorado')} uses 200%.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in Nebraska?', a: `For fiscal year ${P.snap.fy}, Nebraska's gross limit is ${b.grossPct}% of the poverty guideline: ${usd(snapGrossState('nebraska', 1))} a month for one person, ${usd(snapGrossState('nebraska', 3))} for three and ${usd(snapGrossState('nebraska', 4))} for four. Households under it, with liquid assets under ${usd(cap)}, qualify through broad-based categorical eligibility and skip the net income test.` },
    { q: 'Does Nebraska have an asset limit for SNAP?', a: `Yes, but a high one. Under its broad-based categorical eligibility, Nebraska allows up to ${usd(cap)} in liquid assets such as cash and bank accounts, according to the USDA chart of June 2026. A household above it is tested under federal rules, with a ${usdx(P.snap.assets.general)} limit, or ${usdx(P.snap.assets.elderlyDisabled)} with a member 60 or older or disabled.` },
    { q: 'What is the Medicaid income limit in Nebraska for a single adult?', a: `About ${usd(adult.monthly ?? 0)} a month in 2026, ${adult.effectivePct}% of the poverty guideline with the 5% disregard, under the ACA expansion that the CMS table lists for Nebraska. Parents use the same line. Above it, adults can buy a HealthCare.gov plan with the premium tax credit, which in 2026 stops at ${P.aca.maxPct}% of the 2025 guideline.` },
    { q: 'What is the Section 8 income limit in Omaha, Nebraska?', a: `Douglas County, which includes Omaha, has a fiscal year 2026 very low income limit of ${usd(dou.vli)} for a family of four and ${usd(hudOf('nebraska', 'Douglas County', 1).vli)} for one person, with an extremely low limit of ${usd(dou.eli)} for four. Sarpy County shares the Omaha metro figures. Saunders County is the highest in Nebraska at ${usd(sau.vli)}.` },
  ],
  related: ['state:iowa', 'state:kansas', 'state:colorado', 'state:south-dakota', 'snap-income-limits', 'snap-eligibility'],
});
