import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, sua, hudRows, usd, usdx } from '../../lib/kit';

const S = sd('vermont');
const g = S.snap.bbce[0].grossPct;
const hc = sua('vermont', 1) ?? 0;
const kid = medLimit('vermont', 'child6to18', 3);
const preg = medLimit('vermont', 'pregnant', 2);
const adult = medLimit('vermont', 'adult', 1);
const par = medLimit('vermont', 'parent', 3);
// A single parent with one child in Rutland: $2,300 of wages, $1,050 rent, oil heat.
const ex = snapCalc('vermont', { size: 2, earned: 2300, housing: 1050 });
const exLua = snapCalc('vermont', { size: 2, earned: 2300, housing: 1050, utilities: S.snap.sua[0].lua ?? 0 });
const rows = hudRows('vermont');
const nAreas = S.hud.areas;

export default defineStatePage({
  slug: 'vermont',
  title: `Vermont 3SquaresVT Limits 2026: ${usdx(hc)} Heating Allowance`,
  description: `Vermont benefits 2026: 3SquaresVT gross limit ${usd(snapGrossState('vermont', 2))} a month for 2 (${g}%), a ${usdx(hc)} heating allowance, Dr. Dynasaur for children up to ${kid.effectivePct}% of poverty.`,
  intro: 'Vermont has one of the largest heating allowances in SNAP, a children\'s program named Dr. Dynasaur and housing limits set town by town.',
  resume: `Vermont runs SNAP as 3SquaresVT, through the ${S.snap.agency ?? 'Department for Children and Families'}, with a gross income test of ${g}% of the poverty guideline: ${usd(snapGrossState('vermont', 2))} a month for two people and ${usd(snapGrossState('vermont', 4))} for four in fiscal year ${P.snap.fy}, without an asset test. What sets the state apart is its heating and cooling allowance of ${usdx(hc)} a month, close to the top of the USDA table, used for any household that pays for heat. A single mother in Rutland earning ${usd(2300)} with one child and ${usd(1050)} in rent would receive about ${usd(ex.benefit)} a month thanks to it, against ${usd(exLua.benefit)} if she paid only electricity and water. Health coverage is broad: Vermont took the Medicaid expansion (adults to ${adult.effectivePct}% of poverty), and Dr. Dynasaur covers children up to ${kid.effectivePct}% and pregnant women up to ${preg.effectivePct}%.`,
  body: (h) => `<h2>Why the heating allowance decides most 3SquaresVT budgets</h2>
<p>SNAP lets a household that pays a heating or cooling bill deduct a fixed amount instead of its real utility costs, and Vermont's is ${usdx(hc)} a month in the USDA table of fiscal year 2026 (${h.src('fnaSua', 'standard utility allowances')}). Added to rent, it usually pushes shelter costs well past half of a family's remaining income, and the excess comes off net income up to the ${usd(P.snap.shelterCap.us)} cap. For the Rutland family: rent plus the allowance makes ${usd(ex.shelterCosts)}, the deduction reaches ${usd(ex.deductions.shelter)}${ex.shelterCapped ? ', the cap' : ''}, and net income falls to ${usd(ex.net)}. The household that pays only electricity, water and trash gets the limited allowance of ${usdx(S.snap.sua[0].lua ?? 0)} instead, and its benefit drops to ${usd(exLua.benefit)}. Bills for heating oil, propane or electric heat are heating costs in that sense.</p>
<h2>Dr. Dynasaur and the adult expansion</h2>
<p>Vermont's Medicaid is branded Green Mountain Care; children and pregnant women apply for Dr. Dynasaur, which CMS lists at ${kid.pct}% of the poverty guideline for children up to 19 and ${preg.pct}% for pregnancy, ${kid.effectivePct}% and ${preg.effectivePct}% with the disregard. For a family of three, that is about ${usd(kid.monthly ?? 0)} a month for the children. Adults 19 to 64 qualify up to ${adult.effectivePct}%, ${usd(adult.monthly ?? 0)} a month for one person, and parents of a family of three up to ${usd(par.monthly ?? 0)}. Above those lines, Vermont Health Connect, the state's own marketplace, sells 2026 plans with the federal premium tax credit (${h.a('aca-subsidy-calculator', 'ACA subsidy calculator')}).</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>${rows.length} towns, ${nAreas} HUD areas</h2>
<p>Like the rest of New England, Vermont appears in HUD's income limit file town by town: ${rows.length} entries grouped into ${nAreas} areas. The very low income limit for a family of four, the usual voucher line, runs from ${usd(S.hud.vli4Min)} in ${S.hud.vli4MinName} to ${usd(S.hud.vli4Max)} in towns of the ${S.hud.vli4MaxArea}. Choose your town, not only your county, in the lookup at the bottom of this page.</p>
<p>For comparison, ${h.a('state:new-hampshire', 'New Hampshire')} also has a heating allowance above a thousand dollars, ${h.a('state:maine', 'Maine')} matches Vermont's, and ${h.a('state:new-york', 'New York')} splits its allowance into three regions. The rules behind the shelter deduction are in ${h.a('snap-deductions', 'SNAP deductions')}.</p>`,
  faqs: [
    { q: 'What is the income limit for 3SquaresVT in Vermont?', a: `Vermont tests gross monthly income at ${g}% of the poverty guideline in fiscal year ${P.snap.fy}: ${usd(snapGrossState('vermont', 1))} for one person, ${usd(snapGrossState('vermont', 2))} for two and ${usd(snapGrossState('vermont', 4))} for four, with no asset limit. The benefit itself still follows the federal formula, the maximum allotment minus 30% of net income after deductions.` },
    { q: 'How much can a family earn for Dr. Dynasaur in Vermont?', a: `Children qualify up to ${kid.effectivePct}% of the 2026 poverty guideline with the 5% disregard, about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('vermont', 'child6to18', 4).monthly ?? 0)} for four. Pregnant women qualify up to ${preg.effectivePct}%. Income is counted under MAGI rules, so child support received is not included.` },
    { q: 'Does heating oil count for the SNAP utility allowance in Vermont?', a: `Yes. Paying a heating bill, whether for oil, propane or electric heat, entitles the household to Vermont's heating and cooling allowance of ${usdx(hc)} a month in the shelter deduction, the largest of its allowances. A household that pays no heating bill but pays other utilities gets the limited allowance of ${usdx(S.snap.sua[0].lua ?? 0)}.` },
  ],
  related: ['state:new-hampshire', 'state:maine', 'state:new-york', 'snap-deductions', 'medicaid-income-limits', 'section-8-income-limits'],
});
