import { defineStatePage } from '../../lib/page-types';
import { P, sd, STATES, listOf, snapCalc, snapGrossState, snapGross, sua, medLimit, medCheck, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('illinois');
const g = S.snap.bbce[0].grossPct;
const same = STATES.filter((x) => x.snap.bbce.some((r) => r.who === 'all' && r.grossPct === g)).map((x) => x.name);
// A Chicago mother of two, $3,400 of wages, $1,300 rent. Same family in Indiana for comparison.
const ex = snapCalc('illinois', { size: 3, earned: 3400, housing: 1300 });
const ex100 = snapCalc('illinois', { size: 3, earned: 3500, housing: 1300 });
const exIn = snapCalc('indiana', { size: 3, earned: 3400, housing: 1300 });
const kid = medLimit('illinois', 'child6to18', 3);
const kidIn = medLimit('indiana', 'child6to18', 3);
const adult = medLimit('illinois', 'adult', 1);
const preg = medLimit('illinois', 'pregnant', 2);
// A single courier in Peoria earning $1,800 a month.
const courier = medCheck('illinois', 'adult', 1, 1800);
const kendall = hudOf('illinois', 'Kendall County', 4);
const cook = hudOf('illinois', 'Cook County', 4);
const sang = hudOf('illinois', 'Sangamon County', 4);
const champ = hudOf('illinois', 'Champaign County', 4);
const winn = hudOf('illinois', 'Winnebago County', 4);

export default defineStatePage({
  slug: 'illinois',
  title: `Illinois SNAP and All Kids 2027: ${g}% Gross Income Test`,
  description: `Illinois 2026-27: SNAP gross limit ${usd(snapGrossState('illinois', 3))} a month for 3 (${g}%), All Kids to ${kid.effectivePct}% of poverty, Medicaid to ${usd(adult.monthly ?? 0)} a month for one adult, Get Covered Illinois.`,
  intro: 'Illinois sits between the federal SNAP line and the common 200% one, insures children inside Medicaid at more than three times the poverty level, and opened its own health exchange for 2026.',
  resume: `Illinois tests SNAP gross income at ${g}% of the poverty guideline, a level few states use: ${usd(snapGrossState('illinois', 3))} a month for three people in fiscal year ${P.snap.fy}, with no asset limit. That middle line matters to working families just above the federal ${usd(snapGross(3))}. A Chicago mother of two earning ${usd(3400)} with ${usd(1300)} rent would receive about ${usd(ex.benefit)} a month from the Illinois Department of Human Services; across the border in Indiana the same family would get ${usd(exIn.benefit)}. On health, Illinois expanded Medicaid, so a single adult qualifies up to ${usd(adult.monthly ?? 0)} a month, and All Kids covers children up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for a family of three, entirely within Medicaid. For 2026, Marketplace plans moved from HealthCare.gov to Get Covered Illinois, the state's own exchange.`,
  body: (h) => `<h2>The ${g}% line in a working family's budget</h2>
<p>The USDA chart lists Illinois at ${g}% with no limit on assets (${h.src('fnaBbce', 'USDA BBCE chart')}). For the Chicago family, ${usd(ex.gross)} of wages is above the federal ${usd(snapGross(3))} cut-off but under the Illinois ${usd(ex.grossLimit ?? 0)}. The 20% earnings deduction of ${usd(ex.deductions.earned)} and the ${usd(ex.deductions.standard)} standard deduction leave ${usd(ex.adjusted)}. Rent plus the ${usdx(sua('illinois', 3) ?? 0)} utility allowance makes ${usd(ex.shelterCosts)} of shelter costs, ${usd(ex.deductions.shelter)} of which is deducted. Net income is ${usd(ex.net)}; 30% of it, ${usd(ex.thirtyPercent)}, subtracted from the ${usd(ex.maxAllotment)} maximum gives ${usd(ex.benefit)}. A ${usd(100)} raise would bring the estimate to ${usd(ex100.benefit)}, so the family keeps most of each raise until it reaches the ${g}% line. In ${h.a('state:indiana', 'Indiana')}, which tests at the federal level, ${usd(ex.gross)} fails the gross test and the estimate is ${usd(exIn.benefit)}. On the current chart, ${g}% for every household is used only by ${listOf(same)}. Try other incomes in the ${h.a('snap-calculator', 'SNAP calculator')}.</p>
<h2>All Kids: Medicaid to ${kid.effectivePct}%</h2>
<p>CMS shows no separate CHIP column for Illinois: children up to 19 are covered by Medicaid itself to ${S.medicaid.child6to18}% of poverty, ${kid.effectivePct}% with the disregard (${h.src('cmsLevels', 'CMS levels')}). The state brands that coverage All Kids. For a family of three the line is ${usd(kid.monthly ?? 0)} a month, against ${usd(kidIn.monthly ?? 0)} in Indiana. Babies share the same level, and pregnant women qualify to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month counted as two. Adults are covered under the expansion to ${adult.effectivePct}%: a courier in Peoria earning ${usd(1800)} is at ${Math.round(courier.pctIncome)}% of poverty and ${courier.eligible ? 'qualifies' : 'does not qualify'}. Applications for SNAP and medical coverage share the ABE portal.</p>
<p>Illinois moved to its own state-based exchange, Get Covered Illinois, for plan year 2026 (${h.ext('https://getcovered.illinois.gov/', 'getcovered.illinois.gov')}). The ${h.a('aca-subsidy-calculator', '2026 premium tax credit')} is computed the same way; only the enrollment site changed.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Kendall County above Chicago</h2>
<p>HUD splits Illinois into ${S.hud.areas} areas over ${S.hud.rows} counties. Kendall County, southwest of Chicago, has its own area and the top very low income limit for four, ${usd(kendall.vli)}. Cook County and the collar counties share ${usd(cook.vli)}. Sangamon County, around Springfield, is at ${usd(sang.vli)}, Champaign County at ${usd(champ.vli)}, and Winnebago County, around Rockford, at ${usd(winn.vli)}, the state floor with Boone County and much of the south. For more neighbors, see ${h.a('state:wisconsin', 'Wisconsin')}, ${h.a('state:iowa', 'Iowa')} and ${h.a('state:missouri', 'Missouri')}.</p>`,
  faqs: [
    { q: 'What is the income limit for SNAP in Illinois for a family of 3?', a: `${usd(snapGrossState('illinois', 3))} of gross monthly income in fiscal year ${P.snap.fy}, which is ${g}% of the 2026 poverty guideline. Illinois has no SNAP asset limit, according to the USDA chart. For four people the line is ${usd(snapGrossState('illinois', 4))}. The Illinois Department of Human Services then computes the benefit from net income after deductions.` },
    { q: 'What is the income limit for All Kids in Illinois?', a: `All Kids covers children up to ${kid.effectivePct}% of the poverty guideline with the disregard: about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('illinois', 'child6to18', 4).monthly ?? 0)} for four in 2026, according to the CMS table. Illinois covers these children within Medicaid rather than through a separate CHIP.` },
    { q: 'Is Illinois still on HealthCare.gov for 2026?', a: `No. Illinois moved to its own state-based exchange, Get Covered Illinois, for plan year 2026, according to CMS. Residents buy Marketplace plans and claim the premium tax credit there. Adults with income up to ${adult.effectivePct}% of the poverty guideline, about ${usd(adult.monthly ?? 0)} a month for one person, qualify for Medicaid instead.` },
    { q: 'How much is the Section 8 income limit in Chicago, Illinois?', a: `For fiscal year 2026, a family of four in Cook County, which includes Chicago, is very low income up to ${usd(cook.vli)} a year and extremely low income up to ${usd(cook.eli)}. Kendall County is the only Illinois county higher, at ${usd(kendall.vli)}. HUD limits took effect on ${day(P.hud.effective)}; the housing authority serving your address keeps the list.` },
  ],
  related: ['state:indiana', 'state:wisconsin', 'state:iowa', 'state:missouri', 'snap-income-limits', 'medicaid-income-limits'],
});
