import { defineStatePage } from '../../lib/page-types';
import { P, sd, STATES, snapCalc, snapGrossState, sua, medLimit, medCheck, hudOf, usd, usdx, day, num } from '../../lib/kit';

const S = sd('connecticut');
const g = S.snap.bbce[0].grossPct;
const ct = sua('connecticut', 1) ?? 0;
const rank = STATES.filter((x) => (x.snap.sua.find((r) => !r.variant)?.hcsua ?? 0) > ct).length + 1;
const median = STATES.map((x) => x.snap.sua.find((r) => !r.variant)?.hcsua ?? 0).filter((v) => v > 0).sort((a, b) => a - b);
const mid = median[Math.floor(median.length / 2)];
// A widow in Hartford, 72, living on $1,500 of Social Security, $700 rent, paying her own heat.
const widow = snapCalc('connecticut', { size: 1, unearned: 1500, housing: 700, elderlyDisabled: true });
const widowMid = snapCalc('connecticut', { size: 1, unearned: 1500, housing: 700, elderlyDisabled: true, utilities: mid });
const par = medLimit('connecticut', 'parent', 3);
const adult = medLimit('connecticut', 'adult', 1);
const kid = medLimit('connecticut', 'child6to18', 3);
const preg = medLimit('connecticut', 'pregnant', 2);
// A mother of two in New Britain earning $3,500 a month.
const mom = medCheck('connecticut', 'parent', 3, 3500);
const darien = hudOf('connecticut', 'Darien town', 4);
const hartford = hudOf('connecticut', 'Hartford town', 4);
const bridgeport = hudOf('connecticut', 'Bridgeport town', 4);
const newhaven = hudOf('connecticut', 'New Haven town', 4);

export default defineStatePage({
  slug: 'connecticut',
  title: `Connecticut SNAP and HUSKY 2026: ${usdx(ct)} Heating Allowance`,
  description: `Connecticut 2026: SNAP heating allowance ${usdx(ct)}, gross limit ${usd(snapGrossState('connecticut', 3))} a month for 3 people, HUSKY for parents to ${usd(par.monthly ?? 0)} a month, HUSKY B to ${kid.effectivePct}% of poverty.`,
  intro: 'Connecticut credits SNAP households with one of the largest utility allowances in the country and moved parents back to the standard expansion line in HUSKY Health in October 2024.',
  resume: `Connecticut's SNAP heating and cooling allowance is ${usdx(ct)} a month, among the highest in the USDA table, and it drives the shelter deduction for anyone who pays a heating bill. The gross income test is ${g}% of poverty, ${usd(snapGrossState('connecticut', 3))} a month for three in fiscal year ${P.snap.fy}, with no asset limit, and the Department of Social Services runs the program. A Hartford widow living on ${usd(1500)} of Social Security with ${usd(700)} rent and her own heat would get about ${usd(widow.benefit)} a month; with a mid-range allowance of ${usdx(mid)} she would get ${usd(widowMid.benefit)}. On health, HUSKY Health covers adults under the expansion to ${usd(adult.monthly ?? 0)} a month for one person, and parents to the same ${par.effectivePct}% of poverty, ${usd(par.monthly ?? 0)} a month for a family of three, since a state law lowered the old parent line on October 1, 2024. Children are covered by HUSKY B up to ${kid.effectivePct}%, and Marketplace plans are sold on Access Health CT.`,
  body: (h) => `<h2>The weight of a ${usdx(ct)} allowance</h2>
<p>In the USDA's FY 2026 utility table (${h.src('fnaSua', 'USDA SUA table')}), Connecticut's heating and cooling figure ranks ${rank === 1 ? 'first' : `number ${rank}`} among single-figure states and is about ${num(ct / mid, 1)} times the middle value of ${usdx(mid)}. Households that pay for heat or air conditioning separately from rent use it; those with other utility bills but no heating or cooling cost use the limited allowance of ${usdx(S.snap.sua[0].lua)} or the telephone allowance of ${usdx(S.snap.sua[0].phone)}. The state sets the FY 2027 values with USDA approval.</p>
<p>The Hartford widow shows why the number matters to older residents. Her ${usd(widow.gross)} of Social Security minus the ${usd(widow.deductions.standard)} standard deduction leaves ${usd(widow.adjusted)}. Rent plus the allowance is ${usd(widow.shelterCosts)}; because she is over 60, the shelter deduction is not capped, and ${usd(widow.deductions.shelter)} comes off. Net income falls to ${usd(widow.net)}, 30% of it is ${usd(widow.thirtyPercent)}, and the one-person maximum of ${usd(widow.maxAllotment)} gives ${usd(widow.benefit)}. Replace the allowance with ${usdx(mid)} and the estimate drops to ${usd(widowMid.benefit)}. If she has medical bills above ${usd(P.snap.medicalThreshold)} a month, those come off too; ${h.a('snap-for-seniors', 'SNAP for seniors')} details it.</p>
<h2>HUSKY A for parents: the 2024 transition</h2>
<p>The CMS table, dated December 2023, still shows Connecticut parents and caretakers covered well above the expansion line. The Department of Social Services explains that a 2024 state law brought the HUSKY A parent and caretaker limit down to ${S.medicaid.parent}% of poverty, ${par.effectivePct}% with the disregard, from October 1, 2024 (${h.ext(S.medicaid.update?.sources[0]?.url ?? 'https://portal.ct.gov/dss', 'DSS, 2024 HUSKY A transition')}). A mother of two in New Britain earning ${usd(3500)} a month is at ${Math.round(mom.pctIncome)}% of the 2026 guideline: ${mom.eligible ? 'within HUSKY A' : 'over the parent line, so she would compare plans on Access Health CT with the premium tax credit'}. Adults without children stop at ${adult.effectivePct}%, ${usd(adult.monthly ?? 0)} a month for one. Pregnant women qualify to ${preg.effectivePct}%, and children move from Medicaid to HUSKY B, the state CHIP, up to ${kid.effectivePct}%, ${usd(kid.monthly ?? 0)} a month for three people. Above these lines, Access Health CT sells 2026 plans with the ${h.a('aca-subsidy-calculator', 'premium tax credit')}.</p>
${h.mini('fplThreshold', { pct: par.effectivePct })}
<h2>${S.hud.rows} towns, a narrow housing range</h2>
<p>HUD lists Connecticut by town, not county: ${S.hud.rows} towns in ${S.hud.areas} areas. The floor is high, ${usd(S.hud.vli4Min)} for a family of four in ${S.hud.vli4MinName.replace(' town', '')} and most of the Waterbury and New Haven areas, ${usd(newhaven.vli)} in New Haven itself. Hartford is at ${usd(hartford.vli)}, Bridgeport at ${usd(bridgeport.vli)}, and Darien, Greenwich and Stamford at ${usd(darien.vli)}. Among neighbors, ${h.a('state:new-york', 'New York')} adds a Basic Health Program above Medicaid, ${h.a('state:massachusetts', 'Massachusetts')} shares the ${g}% SNAP line, and ${h.a('state:rhode-island', 'Rhode Island')} uses a 185% SNAP line.</p>`,
  faqs: [
    { q: 'What is the SNAP heating allowance in Connecticut?', a: `${usdx(ct)} a month in the USDA table of standard utility allowances for fiscal year 2026, one of the highest in the country. Connecticut households that pay heating or cooling costs separately from rent use it in the shelter deduction. The state updates the figure each October with USDA approval; the FY 2027 value applies from ${day(P.snap.from)}.` },
    { q: 'What is the HUSKY income limit for parents in Connecticut?', a: `Parents and caretaker relatives qualify for HUSKY Health up to ${par.effectivePct}% of the poverty guideline with the disregard, about ${usd(par.monthly ?? 0)} a month for a family of three in 2026, the level in force since October 1, 2024. Adults without children qualify up to ${adult.effectivePct}%, about ${usd(adult.monthly ?? 0)} a month for one person, under the ACA expansion.` },
    { q: 'How much can a family earn for HUSKY B in Connecticut?', a: `HUSKY B, Connecticut's CHIP, covers children up to ${kid.effectivePct}% of the poverty guideline: about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('connecticut', 'child6to18', 4).monthly ?? 0)} for four in 2026. Children below the Medicaid line for their age are covered by HUSKY Medicaid instead. Apply through Access Health CT or the Department of Social Services.` },
    { q: 'What is the Section 8 income limit in Hartford, Connecticut?', a: `For fiscal year 2026, a family of four in the town of Hartford is very low income up to ${usd(hartford.vli)} a year and extremely low income up to ${usd(hartford.eli)}. HUD sets Connecticut limits town by town; the highest, ${usd(darien.vli)}, applies in Darien, Greenwich and Stamford. The limits took effect on ${day(P.hud.effective)}.` },
  ],
  related: ['state:new-york', 'state:massachusetts', 'state:rhode-island', 'snap-for-seniors', 'snap-deductions', 'medicaid-income-limits'],
});
