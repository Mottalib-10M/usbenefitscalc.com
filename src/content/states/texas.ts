import { defineStatePage } from '../../lib/page-types';
import { P, sd, STATES, snapCalc, snapGrossState, snapGross, medLimit, sua, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('texas');
const nNon = STATES.filter((x) => !x.medicaid.expansion).length;
const b = S.snap.bbce[0];
const par = medLimit('texas', 'parent', 3);
const kid = medLimit('texas', 'child6to18', 3);
const preg = medLimit('texas', 'pregnant', 2);
// Worked case: a single mother with two children in Houston, $2,600 of wages, $1,250 rent with an electric bill.
const ex = snapCalc('texas', { size: 3, earned: 2600, housing: 1250 });
const exAsset = snapCalc('texas', { size: 3, earned: 2600, housing: 1250, assets: 6000 });

export default defineStatePage({
  slug: 'texas',
  title: `Texas SNAP and Medicaid Limits 2026: ${usd(snapGrossState('texas', 3))} Gross for 3`,
  description: `Texas benefits 2026: SNAP gross limit ${usd(snapGrossState('texas', 3))} a month for 3 (${b.grossPct}%), a ${usdx(b.assetLimit ?? 0)} asset test, CHIP to ${kid.effectivePct}% for kids, no adult Medicaid, Section 8 by county.`,
  intro: `One of the ${nNon} states without the Medicaid expansion, and one of the few that still tests SNAP savings.`,
  resume: `In Texas, a household of three can have up to ${usd(snapGrossState('texas', 3))} of gross monthly income and still qualify for SNAP in fiscal year ${P.snap.fy}, because the state applies a gross test of ${b.grossPct}% of the poverty guideline instead of the federal ${usd(snapGross(3))}. Unlike most states using that option, Texas keeps an asset limit of ${usdx(b.assetLimit ?? 0)}, with one vehicle excluded up to a set value. A mother of two in Houston earning ${usd(2600)} a month and paying ${usd(1250)} in rent with an electric bill would receive about ${usd(ex.benefit)} a month, using the Texas utility allowance of ${usdx(sua('texas', 3) ?? 0)}. Health coverage is narrower: Texas has not expanded Medicaid, so a working parent of two qualifies only below ${usd(par.monthly ?? 0)} a month and adults without children do not qualify at all, while the children are covered by Medicaid or CHIP up to ${usd(kid.monthly ?? 0)} a month for that family.`,
  body: (h) => `<h2>The Texas asset test, in practice</h2>
<p>Broad-based categorical eligibility lets Texas test gross income at ${b.grossPct}% of poverty, but the program that confers it in Texas carries its own resource rule: ${b.assetText.toLowerCase()} (${h.src('fnaBbce', 'USDA chart of June 2026')}). For the Houston family above, ${usd(6000)} in a savings account would not change the income math, yet it would take the household out of the ${b.grossPct}% route and back to the federal tests, where the asset limit is ${usdx(P.snap.assets.general)}: the estimate drops to ${usd(exAsset.benefit)}. Because one vehicle is excluded up to the set value and only the excess counts, the test bites mostly on cash in the bank and second cars.</p>
<h2>Why a Texas parent can earn too much for Medicaid on a part-time wage</h2>
<p>Texas covers parents and caretaker relatives through a dollar standard that CMS converts to ${par.pct}% of the poverty guideline, ${par.effectivePct}% with the disregard. For a family of three that is about ${usd(par.monthly ?? 0)} a month, roughly what ${Math.round((par.monthly ?? 0) / 7.25)} hours at the federal minimum wage pays. Above it, the parents fall into the Marketplace, where help starts at 100% of the 2025 poverty guideline (${usd(fplAt(3, 100, 'us', 2025))} a year for three). Between those two lines there is a band where neither applies: an adult without children earning ${usd(900)} a month in Texas has no Medicaid group and is below the subsidy floor. Pregnancy changes the picture: Medicaid for pregnant women reaches ${preg.effectivePct}% of poverty, ${usd(preg.monthly ?? 0)} a month for a woman expecting one baby.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Children: Medicaid first, then CHIP</h2>
<p>School-age children are on Medicaid up to ${medLimit('texas', 'child6to18', 3).pct === 133 ? 'the federal floor of 133% plus the disregard' : `${medLimit('texas', 'child6to18', 3).pct}%`}, and above that on the Texas CHIP up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for a family of three in 2026. Babies under one qualify for Medicaid up to ${medLimit('texas', 'infant', 3).effectivePct}%. The mini-calculator above turns the CHIP line into dollars for any family size.</p>
<h2>Where Texas housing limits differ</h2>
<p>HUD splits Texas into ${S.hud.areas} areas over ${S.hud.rows} counties. The very low income limit for four, which opens a Housing Choice Voucher, reaches ${usd(S.hud.vli4Max)} in ${S.hud.vli4MaxName} and falls to ${usd(S.hud.vli4Min)} in ${S.hud.vli4MinName}. The county lookup further down this page gives every limit for one to eight people; waiting lists are run by each local housing authority.</p>
<p>Other programs follow the federal rules in Texas: the ${h.a('eitc-calculator', 'EITC')} (Texas has no state income tax, so no state version), ${h.a('wic-income-guidelines', 'WIC')} at 185% of poverty, and ${h.a('ssi-payment-amount', 'SSI')}. To compare with a neighbor that took the other road on Medicaid, see ${h.a('state:new-mexico', 'New Mexico')}.</p>`,
  faqs: [
    { q: 'What is the SNAP income limit in Texas for a family of 4 in 2027?', a: `${usd(snapGrossState('texas', 4))} of gross monthly income, which is ${b.grossPct}% of the 2026 poverty guideline, for fiscal year ${P.snap.fy} (October 2026 to September 2027). The household must also have no more than ${usdx(b.assetLimit ?? 0)} in countable assets under the Texas rule. A household with someone 60 or older or disabled that fails these tests can still qualify under the federal net income test of ${usd(P.snap.netLimit.us[3])}.` },
    { q: 'Can a single adult with no children get Medicaid in Texas?', a: `In most cases no. Texas has not adopted the ACA expansion, so there is no Medicaid group for adults 19 to 64 without children based on income alone. They may qualify through pregnancy, disability or age 65 and over. With income from 100% of the 2025 poverty guideline, ${usd(fplAt(1, 100, 'us', 2025))} a year for one person, they can get a premium tax credit on HealthCare.gov instead.` },
    { q: 'How much can a family of 3 earn for CHIP in Texas?', a: `Up to about ${usd(kid.monthly ?? 0)} a month in 2026, which is ${kid.effectivePct}% of the poverty guideline with the 5% disregard. Below the Medicaid line for their age the children are on Medicaid instead; the state decides which program applies when you apply once for both. Income is measured with MAGI rules, so child support received does not count.` },
  ],
  related: ['state:oklahoma', 'state:louisiana', 'state:new-mexico', 'snap-income-limits', 'medicaid-expansion-states', 'section-8-income-limits'],
});
