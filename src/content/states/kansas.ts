import { defineStatePage } from '../../lib/page-types';
import { P, sd, STATES, listOf, snapCalc, snapGross, snapNet, sua, medLimit, medCheck, fplAt, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('kansas');
const noBbce = STATES.filter((x) => !x.snap.bbce.length).map((x) => x.name);
const par = medLimit('kansas', 'parent', 3);
const kid = medLimit('kansas', 'child6to18', 3);
const preg = medLimit('kansas', 'pregnant', 2);
const adultMo = medLimit('missouri', 'adult', 1);
// A Wichita mother of two: $2,700 of wages, $900 rent, $1,800 in a savings account; then $3,400 saved.
const ex = snapCalc('kansas', { size: 3, earned: 2700, housing: 900, assets: 1800 });
const exSaved = snapCalc('kansas', { size: 3, earned: 2700, housing: 900, assets: 3400 });
// Her neighbor works part time for $800 a month, then picks up shifts to reach $950.
const low = medCheck('kansas', 'parent', 3, 800);
const more = medCheck('kansas', 'parent', 3, 950);
const johnson = hudOf('kansas', 'Johnson County', 4);
const sedgwick = hudOf('kansas', 'Sedgwick County', 4);
const shawnee = hudOf('kansas', 'Shawnee County', 4);
const douglas = hudOf('kansas', 'Douglas County', 4);

export default defineStatePage({
  slug: 'kansas',
  title: 'Kansas Food Assistance and KanCare 2026: Federal SNAP Tests',
  description: `Kansas benefits 2026: SNAP keeps the federal tests (${usd(snapGross(3))} gross, ${usd(snapNet(3))} net for 3) and a ${usdx(P.snap.assets.general)} asset limit; KanCare parents only to ${usd(par.monthly ?? 0)} a month for 3.`,
  intro: 'Kansas runs its Food Assistance program without broad-based categorical eligibility and has not expanded KanCare, so both programs apply narrow federal or near-federal lines.',
  resume: `Kansas calls SNAP Food Assistance and does not use broad-based categorical eligibility, so every household meets the federal tests: gross income under ${usd(snapGross(3))} a month for three people in fiscal year ${P.snap.fy}, net income under ${usd(snapNet(3))}, and countable resources under ${usdx(P.snap.assets.general)}, or ${usdx(P.snap.assets.elderlyDisabled)} with a member 60 or older or disabled. A Wichita mother of two earning ${usd(2700)} with ${usd(900)} rent and ${usd(1800)} in savings would receive about ${usd(ex.benefit)} a month from the Department for Children and Families; with ${usd(3400)} saved she would receive ${usd(exSaved.benefit)}. KanCare, the state's Medicaid program, has not been expanded: parents qualify only below about ${usd(par.monthly ?? 0)} a month for a family of three, ${par.effectivePct}% of poverty, and adults without children have no income-based group. Children are covered by Medicaid and CHIP up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for three people.`,
  body: (h) => `<h2>Three federal tests for Kansas households</h2>
<p>Only ${noBbce.length} states skip broad-based categorical eligibility on the USDA chart: ${listOf(noBbce)} (${h.src('fnaBbce', 'USDA BBCE chart')}). In Kansas, that means a gross test at 130% of poverty, a net test at 100% and a resource test (${h.src('cfr2739', '7 CFR 273.9')}). The Wichita mother passes all three. Her ${usd(ex.gross)} of wages is below ${usd(snapGross(3))}. After ${usd(ex.deductions.earned)} for earnings and the ${usd(ex.deductions.standard)} standard deduction, ${usd(ex.adjusted)} remains; rent plus the ${usdx(sua('kansas', 3) ?? 0)} utility allowance is ${usd(ex.shelterCosts)}, and ${usd(ex.deductions.shelter)} comes off as shelter. Her net income of ${usd(ex.net)} is under the ${usd(snapNet(3))} line, and ${usd(1800)} in the bank is under ${usdx(P.snap.assets.general)}. Benefit: ${usd(ex.maxAllotment)} minus ${usd(ex.thirtyPercent)}, or ${usd(ex.benefit)}.</p>
<p>Two changes would end it. Savings of ${usd(3400)}, perhaps a tax refund she has not yet spent, push her over the resource limit and the estimate becomes ${usd(exSaved.benefit)}. A raise that lifts wages above ${usd(snapGross(3))} fails the gross test with no higher line to fall back on. Households with a member 60 or older or disabled are spared the gross test and have the higher ${usdx(P.snap.assets.elderlyDisabled)} resource limit. Our ${h.a('snap-eligibility', 'SNAP eligibility guide')} lists what counts as a resource.</p>
<h2>KanCare without the expansion</h2>
<p>CMS lists the Kansas parent group at ${S.medicaid.parent}% of poverty, ${par.effectivePct}% with the disregard (${h.src('cmsLevels', 'CMS eligibility levels')}): ${usd(par.monthly ?? 0)} a month for a family of three. A parent working part time for ${usd(800)} a month is at ${Math.round(low.pctIncome)}% and ${low.eligible ? 'covered' : 'not covered'}; picking up shifts to reach ${usd(950)} moves the family to ${Math.round(more.pctIncome)}%, ${more.eligible ? 'still covered' : 'and the parent loses KanCare'}. The ${h.a('aca-subsidy-calculator', 'premium tax credit')} on HealthCare.gov starts only at ${usd(fplAt(3, 100, 'us', 2025))} a year for three, so between the two lies the gap described in ${h.a('medicaid-expansion-states', 'Medicaid expansion states')}. Across the state line, Missouri expanded and covers adults to ${adultMo.effectivePct}%.</p>
<p>Children are covered much higher. Medicaid takes babies to ${S.medicaid.child0to1 + P.medicaid.disregardPct}% and school-age children to ${S.medicaid.child6to18 + P.medicaid.disregardPct}%, and CHIP continues to ${kid.effectivePct}%. Pregnant women qualify to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month counted as two.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>The Kansas City side tops the HUD table</h2>
<p>Johnson and Wyandotte counties, with Leavenworth, Miami and Linn, belong to the Kansas City metro area and share the top very low income limit for four, ${usd(johnson.vli)}. Douglas County, around Lawrence, is at ${usd(douglas.vli)}, Shawnee County, around Topeka, at ${usd(shawnee.vli)} and Sedgwick County, around Wichita, at ${usd(sedgwick.vli)}. ${S.hud.vli4MinName} and many rural counties share ${usd(S.hud.vli4Min)}. Neighbors: ${h.a('state:missouri', 'Missouri')}, ${h.a('state:nebraska', 'Nebraska')}, ${h.a('state:oklahoma', 'Oklahoma')} and ${h.a('state:colorado', 'Colorado')}.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in Kansas for a family of 3?', a: `Kansas applies the federal tests in fiscal year ${P.snap.fy}: gross monthly income up to ${usd(snapGross(3))}, which is 130% of poverty, and net income up to ${usd(snapNet(3))}, 100% of poverty, for three people. Kansas does not use broad-based categorical eligibility, so the ${usdx(P.snap.assets.general)} resource limit also applies, or ${usdx(P.snap.assets.elderlyDisabled)} with an older or disabled member.` },
    { q: 'Did Kansas expand Medicaid?', a: `No. The CMS table lists Kansas among the states that have not adopted the ACA expansion. KanCare covers parents up to ${par.effectivePct}% of the poverty guideline, about ${usd(par.monthly ?? 0)} a month for a family of three in 2026, and adults without children do not qualify on income alone. Children are covered to ${kid.effectivePct}% and pregnant women to ${preg.effectivePct}%.` },
    { q: 'Is there an asset limit for SNAP in Kansas?', a: `Yes. Because Kansas does not use broad-based categorical eligibility, the federal resource limits apply: ${usdx(P.snap.assets.general)} for most households and ${usdx(P.snap.assets.elderlyDisabled)} if a member is 60 or older or disabled, in fiscal year ${P.snap.fy}. Cash and bank accounts count; the home and most retirement savings do not, under federal rules.` },
    { q: 'What is the Section 8 income limit in Wichita, Kansas?', a: `For fiscal year 2026, a family of four in Sedgwick County, which includes Wichita, is very low income up to ${usd(sedgwick.vli)} a year and extremely low income up to ${usd(sedgwick.eli)}. The highest Kansas limit, ${usd(johnson.vli)}, applies in Johnson County and the other Kansas City metro counties. HUD limits took effect on ${day(P.hud.effective)}.` },
  ],
  related: ['state:missouri', 'state:nebraska', 'state:oklahoma', 'state:colorado', 'snap-eligibility', 'medicaid-expansion-states'],
});
