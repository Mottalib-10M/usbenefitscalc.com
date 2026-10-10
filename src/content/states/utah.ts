import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapNet, snapGross, medLimit, medCheck, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('utah');
const hc = sua('utah', 1) ?? 0;
const lv = S.medicaid;
const kid = medLimit('utah', 'child6to18', 3);
const preg = medLimit('utah', 'pregnant', 3);
const adult = medLimit('utah', 'adult', 1);
// A 70-year-old widow in Salt Lake City: $1,250 of Social Security, $800 rent with a gas bill, $120 of medical costs a month.
const ex = snapCalc('utah', { size: 1, unearned: 1250, elderlyDisabled: true, housing: 800, medical: 120 });
const exAssets = snapCalc('utah', { size: 1, unearned: 1250, elderlyDisabled: true, housing: 800, medical: 120, assets: 5000 });
// A couple in Provo expecting their first child, $3,200 a month: three people for pregnancy coverage.
const mom = medCheck('utah', 'pregnant', 3, 3200);
const dad = medCheck('utah', 'adult', 3, 3200);
const summit = hudOf('utah', 'Summit County', 4);
const wasatch = hudOf('utah', 'Wasatch County', 4);
const slc = hudOf('utah', 'Salt Lake County', 4);
const utahCo = hudOf('utah', 'Utah County', 4);
const stg = hudOf('utah', 'Washington County', 4);

export default defineStatePage({
  slug: 'utah',
  title: `Utah SNAP and Medicaid 2026: Summit County Tops ${usd(summit.vli)}`,
  description: `Utah in 2026: SNAP with the federal tests (${usd(snapGross(1))} gross for 1, ${usdx(P.snap.assets.elderlyDisabled)} assets for seniors), Medicaid for adults to ${adult.effectivePct}%, kids' CHIP to ${kid.effectivePct}% of poverty.`,
  intro: 'Utah keeps the federal SNAP savings test, covers adults through the expansion, and sees its Section 8 limits stretched far apart by Park City.',
  resume: `Utah applies the federal SNAP rules without broad-based categorical eligibility, through the Department of Workforce Services: gross income under 130% of poverty (${usd(snapGross(1))} a month for one person in fiscal year ${P.snap.fy}), net income under ${usd(snapNet(1))}, and resources under ${usdx(P.snap.assets.general)}, or ${usdx(P.snap.assets.elderlyDisabled)} when someone is 60 or older or disabled. A 70-year-old widow in Salt Lake City living on ${usd(1250)} of Social Security, paying ${usd(800)} in rent and ${usd(120)} a month in medical costs would receive about ${usd(ex.benefit)} a month, close to the ${usd(ex.maxAllotment)} maximum, with Utah's heating allowance of ${usdx(hc)}. Utah has expanded Medicaid: adults qualify up to ${adult.effectivePct}% of poverty, ${usd(adult.monthly ?? 0)} a month alone, and children are covered by Medicaid and then CHIP up to ${kid.effectivePct}%. On housing, Summit County's very low income limit for four, ${usd(summit.vli)}, is the highest in the state.`,
  body: (h) => `<h2>Park City sets a ceiling no other Utah county approaches</h2>
<p>HUD lists ${S.hud.rows} Utah counties in ${S.hud.areas} areas, and the gap between them is wide. ${S.hud.vli4MaxName}, home to Park City, has a very low income limit for four of ${usd(summit.vli)}. Next door, Wasatch County reaches ${usd(wasatch.vli)}. Salt Lake County is at ${usd(slc.vli)}, Utah County (Provo and Orem) at ${usd(utahCo.vli)}, and Washington County, around St. George, at ${usd(stg.vli)}, the same as ${S.hud.vli4MinName}, which marks the state's floor. A Summit County family of four earning ${usd(summit.vli - 1)} a year is therefore within the voucher line, while the same income in St. George is far above it. The lookup at the bottom of the page lists every county for one to eight people; waiting lists belong to each housing authority.</p>
<h2>Utah SNAP for a senior living alone</h2>
<p>Federal rules favor older applicants, and Utah applies them as written. At 70, the Salt Lake City widow has no gross income test to pass. Her medical spending above ${usd(P.snap.medicalThreshold)} a month counts (${usd(ex.deductions.medical)} of her ${usd(120)}), and her shelter deduction has no cap: rent plus the ${usdx(hc)} allowance from the ${h.src('fnaSua', 'USDA table')} makes ${usd(ex.shelterCosts)}, and the deduction comes to ${usd(ex.deductions.shelter)}. Her net income falls to ${usd(ex.net)}, well under the ${usd(snapNet(1))} net limit, so she receives ${usd(ex.benefit)}. Savings are the risk. Without broad-based eligibility, the ${h.src('cfr2739', 'federal resource limit')} of ${usdx(P.snap.assets.elderlyDisabled)} applies to her household: ${usd(5000)} in a bank account would ${exAssets.eligible ? 'still be acceptable' : 'make her ineligible'}. Her home and retirement accounts would not count. More on these rules in ${h.a('snap-for-seniors', 'SNAP for seniors')}.</p>
${h.mini('seniorSnap', { utilities: hc })}
<h2>Pregnancy and children in Utah Medicaid</h2>
<p>CMS lists Utah's pregnancy line at ${lv.pregnant}%, only a little above the expansion line, ${preg.effectivePct}% with the disregard. A Provo couple expecting their first child counts as three for the mother's coverage; on ${usd(3200)} a month they are at ${Math.round(mom.pctIncome)}% of poverty, so she ${mom.eligible ? `qualifies, the limit being ${usd(mom.monthly ?? 0)}` : 'does not qualify'}, and her husband ${dad.eligible ? 'qualifies as well' : `does not, the adult limit for three being ${usd(dad.monthly ?? 0)}`}. ${dad.eligible ? '' : `He would look at the ${h.a('aca-subsidy-calculator', 'premium tax credit')} on HealthCare.gov.`} Children have a higher line: Medicaid to ${lv.child0to1}% for the youngest and ${lv.child6to18}% for school ages, then ${h.ext('https://chip.utah.gov/', 'Utah CHIP')} up to ${lv.chip}%, ${usd(kid.monthly ?? 0)} a month for a family of three. CMS also notes a section 1115 demonstration covering some additional low-income adults.</p>
<p>${h.a('state:idaho', 'Idaho')} and ${h.a('state:nevada', 'Nevada')} use broad-based eligibility for SNAP, while ${h.a('state:wyoming', 'Wyoming')} shares Utah's federal tests.</p>`,
  faqs: [
    { q: 'What is the food stamp asset limit in Utah?', a: `${usdx(P.snap.assets.general)} in countable resources for most households in fiscal year ${P.snap.fy}, or ${usdx(P.snap.assets.elderlyDisabled)} when a member is 60 or older or disabled. Utah does not use broad-based categorical eligibility, so the federal limits apply. Cash and bank accounts count; the home, household goods and most retirement accounts are excluded under federal rules.` },
    { q: 'How much does a senior get in food stamps in Utah?', a: `It depends on net income after deductions. A 70-year-old in Salt Lake City with ${usd(1250)} of Social Security, ${usd(800)} rent and ${usd(120)} of monthly medical costs would get about ${usd(ex.benefit)} in fiscal year ${P.snap.fy}, against a maximum of ${usd(ex.maxAllotment)} for one person. Seniors skip the gross income test and can deduct medical costs above ${usd(P.snap.medicalThreshold)} a month.` },
    { q: 'What is the income limit for CHIP in Utah?', a: `Utah CHIP covers children up to ${kid.effectivePct}% of the 2026 poverty guideline with the 5% disregard, about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('utah', 'child6to18', 4).monthly ?? 0)} for four. Below the Medicaid line for the child's age, Medicaid applies instead. Families apply through the Department of Workforce Services for both programs.` },
    { q: 'What is the Section 8 income limit in Salt Lake County, Utah?', a: `In Salt Lake County a family of four qualifies as very low income, the general line for a Housing Choice Voucher, up to ${usd(slc.vli)} a year in fiscal year 2026, and as extremely low income up to ${usd(slc.eli)}. Summit County, around Park City, has the highest very low income limit in Utah, ${usd(summit.vli)}. The limits took effect May 1, 2026.` },
  ],
  related: ['state:idaho', 'state:nevada', 'state:wyoming', 'state:colorado', 'snap-for-seniors', 'section-8-income-limits'],
});
