import { defineStatePage } from '../../lib/page-types';
import { P, sd, STATES, snapCalc, snapGrossState, sua, medLimit, medCheck, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('idaho');
const b = S.snap.bbce[0];
const preg = medLimit('idaho', 'pregnant', 2);
const pregOr = medLimit('oregon', 'pregnant', 2);
const floorStates = STATES.filter((x) => x.medicaid.pregnant === S.medicaid.pregnant).map((x) => x.name);
const kid = medLimit('idaho', 'child6to18', 3);
const adult = medLimit('idaho', 'adult', 1);
// A pregnant cashier in Twin Falls, counted as two, earning $2,500 a month.
const cashier = medCheck('idaho', 'pregnant', 2, 2500);
// A family of five in Nampa: $3,500 of wages, $1,250 rent, $4,200 saved; then $6,500 saved.
const ex = snapCalc('idaho', { size: 5, earned: 3500, housing: 1250, assets: 4200 });
const exMore = snapCalc('idaho', { size: 5, earned: 3500, housing: 1250, assets: 6500 });
const teton = hudOf('idaho', 'Teton County', 4);
const ada = hudOf('idaho', 'Ada County', 4);
const kootenai = hudOf('idaho', 'Kootenai County', 4);
const bonneville = hudOf('idaho', 'Bonneville County', 4);

export default defineStatePage({
  slug: 'idaho',
  title: `Idaho SNAP and Medicaid 2026: ${usdx(b.assetLimit ?? 0)} Savings Cap, ${preg.effectivePct}% Lines`,
  description: `Idaho benefits 2026: SNAP gross limit ${usd(snapGrossState('idaho', 5))} a month for 5 people with a ${usdx(b.assetLimit ?? 0)} asset test, pregnancy Medicaid only to ${preg.effectivePct}% of poverty, children to ${kid.effectivePct}%.`,
  intro: 'Idaho keeps a savings test in SNAP and covers pregnancy only at the federal minimum, yet it expanded Medicaid for adults, so a pregnant woman and a childless adult share the same income line.',
  resume: `Idaho tests SNAP at the federal ${b.grossPct}% gross income line, ${usd(snapGrossState('idaho', 5))} a month for five people in fiscal year ${P.snap.fy}, and keeps an asset limit of ${usdx(b.assetLimit ?? 0)} under its broad-based categorical eligibility. A Nampa family of five earning ${usd(3500)} with ${usd(1250)} rent and ${usd(4200)} in the bank would receive about ${usd(ex.benefit)} a month from the Department of Health and Welfare; with ${usd(6500)} saved it would receive ${usd(exMore.benefit)}. Medicaid is unusual in a different way. Idaho adopted the expansion, so adults qualify up to ${usd(adult.monthly ?? 0)} a month for one person, but its pregnancy line is the federal minimum of ${preg.effectivePct}% of poverty, ${usd(preg.monthly ?? 0)} a month for a woman counted as two, among the lowest in the CMS table. Children are covered by Medicaid and CHIP up to ${kid.effectivePct}%, ${usd(kid.monthly ?? 0)} a month for three. Marketplace plans for 2026 are sold on Your Health Idaho.`,
  body: (h) => `<h2>Pregnancy at the federal floor</h2>
<p>The CMS table lists Idaho's pregnancy group at ${S.medicaid.pregnant}% of poverty, ${preg.effectivePct}% with the disregard (${h.src('cmsLevels', 'CMS eligibility levels')}), the lowest level in the table, shared with ${floorStates.filter((n) => n !== 'Idaho').join(' and ')}. Neighboring Oregon covers pregnancy to ${pregOr.effectivePct}%. A cashier in Twin Falls who earns ${usd(2500)} a month and is expecting her first child is at ${cashier.pctIncome.toFixed(1)}% of the guideline for two, ${cashier.eligible ? 'just inside the line' : `just over the ${usd(preg.monthly ?? 0)} limit`}. Because Idaho expanded Medicaid, her line is the same as that of any adult; what she cannot get is the higher pregnancy band that most states offer. Above it, the ${h.a('aca-subsidy-calculator', 'premium tax credit')} on Your Health Idaho, the state-based exchange, is the route. Counting the unborn child changes the household size: as a household of three she would have a line of ${usd(medLimit('idaho', 'pregnant', 3).monthly ?? 0)}, so the agency's count matters.</p>
<p>Children start higher. Babies and young children are on Medicaid to ${S.medicaid.child0to1 + P.medicaid.disregardPct}%, school-age children to ${S.medicaid.child6to18 + P.medicaid.disregardPct}%, and a separate CHIP takes every child to ${kid.effectivePct}%.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Idaho's ${usdx(b.assetLimit ?? 0)} SNAP resource rule</h2>
<p>Idaho is among the few states that use broad-based categorical eligibility but keep an asset test, here ${usdx(b.assetLimit ?? 0)} with the ${b.grossPct}% gross line (${h.src('fnaBbce', 'USDA BBCE chart')}). For the Nampa family of five, ${usd(ex.gross)} of wages pass the ${usd(snapGrossState('idaho', 5))} line. The 20% earnings deduction and the ${usd(ex.deductions.standard)} standard deduction for five leave ${usd(ex.adjusted)}; rent plus the ${usdx(sua('idaho', 5) ?? 0)} utility allowance, ${usd(ex.shelterCosts)}, produces a shelter deduction of ${usd(ex.deductions.shelter)}. Net income is ${usd(ex.net)} and the benefit ${usd(ex.benefit)} out of ${usd(ex.maxAllotment)}. Raise the savings to ${usd(6500)} and the categorical route closes; the federal ${usdx(P.snap.assets.general)} limit then applies and the estimate falls to ${usd(exMore.benefit)}. Idaho's utility table also lists ${usdx(S.snap.sua[0].electricity)} for each single utility (${h.src('fnaSua', 'USDA SUA table')}). Applications go through idalink.</p>
<h2>From Teton County to the panhandle</h2>
<p>Teton County, on the Wyoming border near Jackson, has Idaho's highest very low income limit for four, ${usd(teton.vli)}. The Boise area, Ada and Canyon counties, is at ${usd(ada.vli)}, Kootenai County around Coeur d'Alene at ${usd(kootenai.vli)} and Bonneville County around Idaho Falls at ${usd(bonneville.vli)}. The floor, ${usd(S.hud.vli4Min)}, covers ${S.hud.vli4MinName} and much of the state. For contrasts, ${h.a('state:wyoming', 'Wyoming')} keeps the federal SNAP tests and no expansion, ${h.a('state:oregon', 'Oregon')} and ${h.a('state:washington', 'Washington')} use a 200% SNAP line, and ${h.a('state:utah', 'Utah')} has no categorical eligibility.</p>`,
  faqs: [
    { q: 'Does Idaho have an asset limit for food stamps?', a: `Yes. Idaho uses broad-based categorical eligibility with a ${usdx(b.assetLimit ?? 0)} asset limit and a gross income line of ${b.grossPct}% of poverty, according to the USDA chart of June 2026. A household above ${usdx(b.assetLimit ?? 0)} is tested under federal rules instead, with a ${usdx(P.snap.assets.general)} limit, or ${usdx(P.snap.assets.elderlyDisabled)} with a member 60 or older or disabled.` },
    { q: 'What is the Medicaid income limit for pregnant women in Idaho?', a: `About ${usd(preg.monthly ?? 0)} a month for a pregnant woman counted as a household of two in 2026, which is ${preg.effectivePct}% of the poverty guideline with the disregard. That is the federal minimum, per the CMS table. With the expected baby counted, a household of three has a line of ${usd(medLimit('idaho', 'pregnant', 3).monthly ?? 0)}.` },
    { q: 'Did Idaho expand Medicaid?', a: `Yes. The CMS table lists Idaho as an expansion state, with adults 19 to 64 covered up to ${adult.effectivePct}% of the poverty guideline including the disregard, about ${usd(adult.monthly ?? 0)} a month for one person in 2026. Above that, the premium tax credit is available on Your Health Idaho, the state's exchange for 2026.` },
    { q: 'What is the Section 8 income limit in Boise, Idaho?', a: `For fiscal year 2026, a family of four in Ada County, which includes Boise, is very low income up to ${usd(ada.vli)} a year and extremely low income up to ${usd(ada.eli)}. Only Teton County is higher in Idaho, at ${usd(teton.vli)}. HUD limits took effect on ${day(P.hud.effective)}; the local housing authority keeps the waiting list.` },
  ],
  related: ['state:oregon', 'state:washington', 'state:utah', 'state:wyoming', 'medicaid-eligibility', 'snap-eligibility'],
});
