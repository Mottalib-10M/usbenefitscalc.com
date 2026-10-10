import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGross, snapNet, medLimit, sua, fplAt, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('wyoming');
const par = medLimit('wyoming', 'parent', 4);
const kid = medLimit('wyoming', 'child6to18', 4);
const preg = medLimit('wyoming', 'pregnant', 2);
// A two-parent family of four in Casper (Natrona County): $3,300 of wages, $1,150 rent, heating bill, $2,500 in savings.
const ex = snapCalc('wyoming', { size: 4, earned: 3300, housing: 1150, assets: 2500 });
const exSaver = snapCalc('wyoming', { size: 4, earned: 3300, housing: 1150, assets: 3500 });
const teton = hudOf('wyoming', 'Teton County', 4);
const natrona = hudOf('wyoming', 'Natrona County', 4);
const laramie = hudOf('wyoming', 'Laramie County', 4);
const paper = S.notes.find((n) => n.startsWith('DFS SNAP page'));

export default defineStatePage({
  slug: 'wyoming',
  title: 'Wyoming Food Stamps and Medicaid 2026: Federal Tests Apply',
  description: `Wyoming benefits 2026: SNAP uses the federal 130% test (${usd(snapGross(3))} for 3) and a ${usdx(P.snap.assets.general)} asset limit, no adult Medicaid, children to ${kid.effectivePct}% of poverty, paper forms.`,
  intro: 'No broad-based eligibility, no Medicaid expansion and no online SNAP application: Wyoming runs the federal rules close to the letter.',
  resume: `Wyoming is one of the few states that applies the federal SNAP tests without broad-based categorical eligibility. A household of four must keep gross income under ${usd(snapGross(4))} a month and net income under ${usd(snapNet(4))}, and countable resources under ${usdx(P.snap.assets.general)}, or ${usdx(P.snap.assets.elderlyDisabled)} when someone is 60 or older or disabled. For a Casper family of four earning ${usd(3300)} a month and renting for ${usd(1150)}, the estimate is ${usd(ex.benefit)} a month in fiscal year ${P.snap.fy} with Wyoming's heating and cooling allowance of ${usdx(sua('wyoming', 4) ?? 0)}; with ${usd(3500)} in savings the same family would get ${usd(exSaver.benefit)}. Health coverage follows the same pattern: Wyoming has not expanded Medicaid, parents qualify only below about ${usd(par.monthly ?? 0)} a month for a family of four, and children are covered up to ${kid.effectivePct}% of the poverty guideline.`,
  body: (h) => `<h2>Savings count in Wyoming SNAP</h2>
<p>In most states a family with a few thousand dollars in the bank never meets an asset test, because broad-based categorical eligibility switches it off. Wyoming does not use that option, so the ${h.src('cfr2739', 'federal resource rules')} apply in full: ${usdx(P.snap.assets.general)} for most households and ${usdx(P.snap.assets.elderlyDisabled)} with a member 60 or older or disabled. The Casper family above shows what that means. With ${usd(2500)} saved it qualifies for ${usd(ex.benefit)} a month; with ${usd(3500)} it gets ${usd(exSaver.benefit)}, even though its income is identical. Income has two hurdles too, a gross test at 130% of poverty and a net test at 100%, and the family passes both: ${usd(ex.gross)} against ${usd(snapGross(4))}, then ${usd(ex.net)} of net income against ${usd(snapNet(4))}.</p>
<h2>Applying without an online portal</h2>
<p>The Department of Family Services publishes a SNAP application to print and return to a local DFS office by mail, fax or e-mail; when we checked, its program page offered no online SNAP application${paper ? ` (${h.ext('https://dfs.wyo.gov/assistance-programs/food-assistance/supplemental-nutrition-assistance-program-snap/', 'DFS SNAP page')})` : ''}. Submitting the first page with your name, address and signature starts the clock on the application, so a household in a hurry can send that page first and the rest later. The federal processing rules are the same as elsewhere, including expedited service for households with very little income and cash.</p>
<h2>Coverage when Medicaid stops at the parents</h2>
<p>Wyoming covers parents and caretakers through a dollar standard that CMS converts to ${par.pct}% of the poverty guideline, ${par.effectivePct}% with the disregard: about ${usd(par.monthly ?? 0)} a month for a family of four. A parent earning more, or any adult without children at home, has no income-based Medicaid group. From 100% of the 2025 guideline, ${usd(fplAt(1, 100, 'us', 2025))} a year for a single adult, HealthCare.gov offers the ${h.a('aca-subsidy-calculator', '2026 premium tax credit')}; below that, a single worker earning ${usd(1000)} a month falls in the gap explained in ${h.a('medicaid-expansion-states', 'Medicaid expansion states')}. Pregnancy opens Medicaid up to ${preg.effectivePct}% of poverty, ${usd(preg.monthly ?? 0)} a month for a woman expecting one baby.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Teton County is a different housing market</h2>
<p>HUD treats each of Wyoming's ${S.hud.rows} counties as its own area. For a family of four, the very low income limit that opens a Housing Choice Voucher is ${usd(teton.vli)} in Teton County, home to Jackson, against ${usd(natrona.vli)} in Natrona County and ${usd(laramie.vli)} in Laramie County, where Cheyenne sits. The lookup below gives every county for one to eight people. Children's coverage shown in the mini-calculator above uses the ${kid.effectivePct}% line, which Wyoming families apply for through the same Medicaid application; the state calls its children's plan ${S.medicaid.chipName ?? 'CHIP'}.</p>
<p>Neighbors went other ways: ${h.a('state:montana', 'Montana')} and ${h.a('state:colorado', 'Colorado')} expanded Medicaid and use broad-based eligibility for SNAP, while ${h.a('state:south-dakota', 'South Dakota')} also keeps the federal SNAP tests.</p>`,
  faqs: [
    { q: 'Does Wyoming have an asset limit for food stamps?', a: `Yes. Wyoming does not use broad-based categorical eligibility, so the federal limits apply: ${usdx(P.snap.assets.general)} in countable resources, or ${usdx(P.snap.assets.elderlyDisabled)} if a household member is 60 or older or disabled, in fiscal year ${P.snap.fy}. Cash, checking and savings accounts count. Federal rules leave out the home you live in and most retirement accounts, so the limit mainly reaches money in the bank.` },
    { q: 'Can I apply for SNAP online in Wyoming?', a: 'When we checked in October 2026, the Department of Family Services offered a printable SNAP application to return to a local DFS office by mail, fax or e-mail, and no online SNAP portal on its program page. The date your signed first page reaches the office is the application date that starts the processing deadline, so sending it early protects your benefits.' },
    { q: 'Did Wyoming expand Medicaid for adults?', a: `No. According to the CMS table of state eligibility levels, Wyoming has not adopted the ACA Medicaid expansion. Parents qualify up to ${par.effectivePct}% of the poverty guideline, about ${usd(par.monthly ?? 0)} a month for four people, and adults without children have no income-based group. Children qualify up to ${kid.effectivePct}% and pregnant women up to ${preg.effectivePct}%.` },
    { q: 'What is the Section 8 income limit in Teton County, Wyoming?', a: `For fiscal year 2026, a family of four in Teton County qualifies as very low income, the usual line for a Housing Choice Voucher, up to ${usd(teton.vli)} a year, and as extremely low income up to ${usd(teton.eli)}. That is the highest limit in Wyoming; Natrona County's very low income limit for four is ${usd(natrona.vli)}. HUD limits took effect on May 1, 2026.` },
  ],
  related: ['state:montana', 'state:colorado', 'state:south-dakota', 'snap-income-limits', 'medicaid-expansion-states', 'section-8-income-limits'],
});
