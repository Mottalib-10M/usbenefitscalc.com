import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('west-virginia');
const g = S.snap.bbce[0].grossPct;
const hc = sua('west-virginia', 1) ?? 0;
const kid = medLimit('west-virginia', 'child6to18', 3);
const preg = medLimit('west-virginia', 'pregnant', 2);
const adult = medLimit('west-virginia', 'adult', 1);
const par = medLimit('west-virginia', 'parent', 3);
// A disabled miner's widow in Logan County: $1,350 of Social Security, $550 rent, electric heat, $90 of prescriptions.
const ex = snapCalc('west-virginia', { size: 1, unearned: 1350, housing: 550, elderlyDisabled: true, medical: 90 });
// A home health aide in Charleston, single, $1,700 a month.
const aide = medCheck('west-virginia', 'adult', 1, 1700);
const jeff = hudOf('west-virginia', 'Jefferson County', 4);
const kan = hudOf('west-virginia', 'Kanawha County', 4);

export default defineStatePage({
  slug: 'west-virginia',
  title: 'West Virginia SNAP and WVCHIP Income Limits 2026 in Dollars',
  description: `West Virginia 2026: SNAP gross limit ${usd(snapGrossState('west-virginia', 3))} a month for 3 (${g}%), Medicaid adults to ${adult.effectivePct}%, WVCHIP and pregnancy coverage to ${kid.effectivePct}%, HUD limits by county.`,
  intro: `West Virginia pairs a ${g}% SNAP income test with low HUD housing limits, and covers pregnancy well above the usual adult line.`,
  resume: `West Virginia's ${S.snap.agency ?? 'Department of Human Services'} runs SNAP with a gross income test of ${g}% of the poverty guideline, ${usd(snapGrossState('west-virginia', 3))} a month for three people in fiscal year ${P.snap.fy}, and no asset test. The heating and cooling allowance is ${usdx(hc)} a month. A widow in Logan County who receives ${usd(1350)} of disability benefits, pays ${usd(550)} rent with electric heat and ${usd(90)} a month for prescriptions would get about ${usd(ex.benefit)} a month, because people with a disability keep the full shelter deduction and deduct medical costs above ${usd(P.snap.medicalThreshold)}. West Virginia expanded Medicaid, so adults qualify up to ${adult.effectivePct}% of poverty, ${usd(adult.monthly ?? 0)} a month for one person. WVCHIP covers children up to ${kid.effectivePct}%, and pregnant women can be covered up to the same ${preg.effectivePct}% line, about ${usd(preg.monthly ?? 0)} a month for a household of two.`,
  body: (h) => `<h2>Disability and the SNAP shelter deduction</h2>
<p>A household with a member who receives disability benefits is treated like a household with someone 60 or older: no gross income test under the federal route, a resource limit of ${usdx(P.snap.assets.elderlyDisabled)} if the federal tests apply, a medical deduction, and a shelter deduction without the ${usd(P.snap.shelterCap.us)} cap (${h.src('cfr2739', '7 CFR 273.9')}). For the Logan County widow, ${usd(ex.gross)} of income minus the ${usd(ex.deductions.standard)} standard deduction and ${usd(ex.deductions.medical)} of medical costs leaves ${usd(ex.adjusted)}. Rent plus the ${usdx(hc)} allowance is ${usd(ex.shelterCosts)}; the part above half of her remaining income, ${usd(ex.deductions.shelter)}, is deducted in full. Net income: ${usd(ex.net)}. Her estimate, ${usd(ex.benefit)} of the ${usd(ex.maxAllotment)} maximum for one person. Pharmacy receipts, insurance premiums and travel to medical appointments are the kind of costs that count; listing them at the interview is worth the effort.</p>
<h2>Medicaid after the expansion, and the jump for pregnancy</h2>
<p>A single home health aide in Charleston earning ${usd(1700)} a month is at ${Math.round(aide.pctIncome)}% of the 2026 poverty guideline, ${aide.eligible ? 'inside' : 'above'} the adult Medicaid line of ${usd(adult.monthly ?? 0)}. Parents of a family of three qualify up to ${usd(par.monthly ?? 0)} a month through the adult group, which is higher than the old parent standard of ${par.pct === adult.pct ? adult.pct : S.medicaid.parent}%. The CMS table shows West Virginia covering pregnant women through Medicaid up to ${S.medicaid.pregnant}% of poverty and through CHIP up to ${S.medicaid.pregnantChip}%, an unusually wide band: a pregnant woman earning ${usd(4000)} a month in a household of two is within it. Children use the same ${kid.effectivePct}% line, through Medicaid first and WVCHIP above it.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Housing limits close to the national floor</h2>
<p>HUD splits West Virginia into ${S.hud.areas} areas over ${S.hud.rows} counties. Jefferson County, in the Eastern Panhandle, has the state's highest very low income limit for a family of four, ${usd(jeff.vli)}. Kanawha County, around Charleston, is at ${usd(kan.vli)}, and several rural counties sit at ${usd(S.hud.vli4Min)}. Low limits cut both ways: rents are lower too, but a family earning ${usd(40000)} can be above the voucher line in a rural county while qualifying in Jefferson County. The lookup below shows every county.</p>
<p>Neighbors compare differently: ${h.a('state:virginia', 'Virginia')} has the same ${g}% SNAP test with a household-size utility allowance, ${h.a('state:kentucky', 'Kentucky')} and ${h.a('state:ohio', 'Ohio')} also expanded Medicaid, and ${h.a('state:pennsylvania', 'Pennsylvania')} has a CHIP line above 300%.</p>`,
  faqs: [
    { q: 'What is the SNAP income limit in West Virginia for 2027?', a: `In fiscal year ${P.snap.fy}, which started October 1, 2026, West Virginia tests gross monthly income at ${g}% of the poverty guideline: ${usd(snapGrossState('west-virginia', 1))} for one person, ${usd(snapGrossState('west-virginia', 2))} for two and ${usd(snapGrossState('west-virginia', 4))} for four. There is no asset test. Households with a member 60 or older or disabled can also qualify through the federal net income test.` },
    { q: 'Can a pregnant woman get Medicaid in West Virginia above the normal limit?', a: `Yes. The CMS table lists pregnancy coverage through Medicaid up to ${S.medicaid.pregnant}% of the poverty guideline and through CHIP up to ${S.medicaid.pregnantChip}%, which is ${preg.effectivePct}% with the 5% disregard: about ${usd(preg.monthly ?? 0)} a month for a woman expecting one baby, who counts as a household of two. That is far above the ${adult.effectivePct}% line for other adults.` },
    { q: 'How much can I make for WVCHIP in West Virginia?', a: `Children qualify for WVCHIP up to ${kid.effectivePct}% of the 2026 poverty guideline including the disregard, about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('west-virginia', 'child6to18', 4).monthly ?? 0)} for four. Below the Medicaid line for their age, children are placed on Medicaid instead. One application covers both.` },
  ],
  related: ['state:virginia', 'state:kentucky', 'state:ohio', 'state:pennsylvania', 'snap-for-seniors', 'medicaid-income-limits'],
});
