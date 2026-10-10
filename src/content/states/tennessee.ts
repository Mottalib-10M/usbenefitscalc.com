import { defineStatePage } from '../../lib/page-types';
import { P, sd, STATES, snapCalc, snapGross, snapNet, bbceAll, medLimit, medCheck, sua, hudOf, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('tennessee');
const nNon = STATES.filter((x) => !x.medicaid.expansion).length;
const lv = S.medicaid;
const par = medLimit('tennessee', 'parent', 4);
const kid = medLimit('tennessee', 'child6to18', 4);
const kid3 = medLimit('tennessee', 'child6to18', 3);
const preg = medLimit('tennessee', 'pregnant', 2);
const s1 = sua('tennessee', 1) ?? 0;
const s4 = sua('tennessee', 4) ?? 0;
const s8 = sua('tennessee', 8) ?? 0;
// Two parents and two children in Knoxville (Knox County): $3,000 of wages, $1,000 rent with an electric bill, $1,500 in savings.
const ex = snapCalc('tennessee', { size: 4, earned: 3000, housing: 1000, assets: 1500 });
const exSmall = snapCalc('tennessee', { size: 4, earned: 3000, housing: 1000, assets: 1500, utilities: s1 });
const parents = medCheck('tennessee', 'parent', 4, 3000);
const kids = medCheck('tennessee', 'child6to18', 4, 3000);
const dav = hudOf('tennessee', 'Davidson County', 4);
const shelby = hudOf('tennessee', 'Shelby County', 4);
const knox = hudOf('tennessee', 'Knox County', 4);
const ham = hudOf('tennessee', 'Hamilton County', 4);
const row = (slug: string): [string, 'us', number | null, number | null, number | null] => [sd(slug).name, 'us', bbceAll(slug)?.grossPct ?? null, medLimit(slug, 'adult', 1).effectivePct, medLimit(slug, 'child6to18', 3).effectivePct];

export default defineStatePage({
  slug: 'tennessee',
  title: `Tennessee TennCare and SNAP 2026: CoverKids to ${kid.effectivePct}%`,
  description: `Tennessee 2026: TennCare without the expansion (parents to ${usd(par.monthly ?? 0)} a month for 4), CoverKids to ${kid.effectivePct}% of poverty, SNAP with the federal ${usdx(P.snap.assets.general)} asset test.`,
  intro: 'TennCare stops short of the expansion, CoverKids picks up children above Medicaid, and SNAP keeps both the federal savings test and a utility allowance that grows with the family.',
  resume: `Tennessee runs Medicaid as TennCare and has not adopted the ACA expansion: parents and caretakers qualify up to ${par.effectivePct}% of the poverty guideline, about ${usd(par.monthly ?? 0)} a month for a family of four in 2026, and adults without children have no income-based group. Children are covered far higher, by TennCare and then CoverKids, the state CHIP, up to ${kid.effectivePct}% (${usd(kid.monthly ?? 0)} a month for four). SNAP, run by the Tennessee Department of Human Services, uses the federal tests without broad-based categorical eligibility: gross income under ${usd(snapGross(4))} a month for four, net income under ${usd(snapNet(4))} and savings under ${usdx(P.snap.assets.general)} in fiscal year ${P.snap.fy}. Its heating allowance rises with household size, from ${usdx(s1)} for one person to ${usdx(s4)} for four. A Knoxville family of four earning ${usd(3000)}, renting for ${usd(1000)} and holding ${usd(1500)} in savings would get about ${usd(ex.benefit)} a month.`,
  body: (h) => `<h2>A utility allowance that grows with the household</h2>
<p>Most states give every household the same heating and cooling allowance. Tennessee is one of the few with a scale by size in the ${h.src('fnaSua', 'USDA allowance table')}: ${usdx(s1)} for one person, ${usdx(s4)} for four, ${usdx(s8)} for eight, and more beyond. For the Knoxville family that means ${usdx(s4)} added to its ${usd(1000)} rent, ${usd(ex.shelterCosts)} of shelter costs in all, and a shelter deduction of ${usd(ex.deductions.shelter)} once half of its adjusted income is set aside. With ${usd(ex.deductions.earned)} off for earnings and a standard deduction of ${usd(ex.deductions.standard)}, net income is ${usd(ex.net)} and the estimate ${usd(ex.benefit)} out of the ${usd(ex.maxAllotment)} maximum. Were the allowance the one-person figure, the benefit would be ${usd(exSmall.benefit)}: a modest gap, but one that grows for larger families.</p>
<p>Without broad-based categorical eligibility, Tennessee households face every federal hurdle (${h.src('cfr2739', '7 CFR 273.9')}): gross income at 130% of poverty, ${usd(ex.gross)} against ${usd(snapGross(4))} here; net income at 100%, ${usd(ex.net)} against ${usd(snapNet(4))}; and resources under ${usdx(P.snap.assets.general)}, which the family's ${usd(1500)} stays under. A household with a member 60 or older or disabled has a ${usdx(P.snap.assets.elderlyDisabled)} limit and no gross test.</p>
<h2>TennCare for parents, CoverKids for children</h2>
<p>For the same family, health coverage splits. On ${usd(3000)} a month the household of four is at ${Math.round(parents.pctIncome)}% of poverty: the parents ${parents.eligible ? `qualify for TennCare, the limit being ${usd(parents.monthly ?? 0)}` : `are above the TennCare limit of ${usd(parents.monthly ?? 0)}`}, while the children ${kids.eligible ? `are covered through ${kids.program === 'CHIP' ? 'CoverKids' : 'TennCare'}` : 'are not covered'}. CMS lists Tennessee's Medicaid lines for children at ${lv.child0to1}% for babies, ${lv.child1to5}% from 1 to 5 and ${lv.child6to18}% from 6 to 18, with CoverKids above them up to ${lv.chip}% (${h.ext('https://www.tn.gov/coverkids.html', 'CoverKids')}). For a family of three the children's ceiling is ${usd(kid3.monthly ?? 0)} a month. Pregnant women qualify up to ${preg.effectivePct}%.</p>
<p>A single adult earning less than ${usd(fplAt(1, P.aca.minPct, 'us', 2025))} a year gets neither TennCare nor the ${h.a('aca-subsidy-calculator', 'premium tax credit')} on HealthCare.gov. Tennessee is one of the ${nNon} states without the expansion; see ${h.a('medicaid-expansion-states', 'Medicaid expansion states')}.</p>
${h.mini('stateCompare', { states: [row('tennessee'), row('texas'), row('kentucky'), row('georgia'), row('arkansas'), row('virginia')] })}
<h2>Nashville at the top, Memphis below the middle</h2>
<p>HUD's Tennessee file covers ${S.hud.rows} counties in ${S.hud.areas} areas. The Nashville metro area holds the highest very low income limit for four, ${usd(dav.vli)}, shared by Davidson, ${S.hud.vli4MaxName} and the other metro counties. Knox County (Knoxville) is at ${usd(knox.vli)}, Hamilton County (Chattanooga) at ${usd(ham.vli)} and Shelby County (Memphis) at ${usd(shelby.vli)}. ${S.hud.vli4MinName} is lowest, ${usd(S.hud.vli4Min)}.</p>`,
  faqs: [
    { q: 'What is the income limit for TennCare in Tennessee?', a: `For parents and caretaker relatives, TennCare covers income up to ${par.effectivePct}% of the 2026 poverty guideline with the disregard, about ${usd(medLimit('tennessee', 'parent', 3).monthly ?? 0)} a month for three and ${usd(par.monthly ?? 0)} for four. Children qualify through TennCare or CoverKids up to ${kid.effectivePct}%, pregnant women up to ${preg.effectivePct}%. Adults without children have no income-based group, as Tennessee has not expanded Medicaid.` },
    { q: 'How much can you have in the bank for food stamps in Tennessee?', a: `${usdx(P.snap.assets.general)} for most households in fiscal year ${P.snap.fy}, or ${usdx(P.snap.assets.elderlyDisabled)} if someone in the household is 60 or older or disabled. Tennessee does not use broad-based categorical eligibility, so these federal resource limits apply. The home you live in and most retirement accounts are excluded; checking, savings and cash count.` },
    { q: 'What is the Section 8 income limit in Nashville, Tennessee?', a: `Nashville is in Davidson County, where a family of four qualifies as very low income, the usual voucher line, up to ${usd(dav.vli)} a year in fiscal year 2026, and as extremely low income up to ${usd(dav.eli)}. Those are the highest limits in Tennessee. In Shelby County, around Memphis, the very low income limit for four is ${usd(shelby.vli)}. HUD limits took effect May 1, 2026.` },
  ],
  related: ['state:kentucky', 'state:georgia', 'state:arkansas', 'state:alabama', 'medicaid-expansion-states', 'snap-income-limits'],
});
