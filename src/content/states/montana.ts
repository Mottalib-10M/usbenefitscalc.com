import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, wicCheck, sua, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('montana');
const b = S.snap.bbce[0];
const row = S.snap.sua[0];
const hc = sua('montana', 4) ?? 0;
const lua = row.lua ?? 0;
const adult = medLimit('montana', 'adult', 1);
const kid = medLimit('montana', 'child6to18', 4);
const kidMed = (S.medicaid.child6to18 ?? 0) + P.medicaid.disregardPct;
const preg = medLimit('montana', 'pregnant', 2);
// Two parents and two children in Billings (Yellowstone County): $3,400 of wages, $1,250 rent, natural gas heat on their own meter.
const ex = snapCalc('montana', { size: 4, earned: 3400, housing: 1250 });
const exHeatIncluded = snapCalc('montana', { size: 4, earned: 3400, housing: 1250, utilities: lua });
const par = medCheck('montana', 'parent', 4, 3400);
const wic = wicCheck(4, 3400 * 12);
const gal = hudOf('montana', 'Gallatin County', 4);
const yel = hudOf('montana', 'Yellowstone County', 4);
const lc = hudOf('montana', 'Lewis and Clark County', 4);
const fal = hudOf('montana', 'Fallon County', 4);
const mis = hudOf('montana', 'Missoula County', 4);
const W = P.medicaid.workRequirement;

export default defineStatePage({
  slug: 'montana',
  title: 'Montana SNAP and Healthy Montana Kids Income Limits 2026',
  description: `Montana benefits 2026: SNAP gross limit ${usd(snapGrossState('montana', 4))} a month for 4, a ${usdx(hc)} heating allowance against ${usdx(lua)} without heat, Healthy Montana Kids to ${kid.effectivePct}% of poverty.`,
  intro: `In Montana, who pays the heating bill can move a working family's food benefit by ${usd(ex.benefit - exHeatIncluded.benefit)} a month.`,
  resume: `Montana families of four can have up to ${usd(snapGrossState('montana', 4))} of gross monthly income and still receive SNAP in fiscal year ${P.snap.fy}, under broad-based categorical eligibility at ${b.grossPct}% of the poverty guideline and with no asset limit. The detail that matters most is the gap between the state's two utility allowances: ${usdx(hc)} a month for a household that pays for heating or cooling, ${usdx(lua)} for one that pays only other utilities. Two parents in Billings with two children, ${usd(3400)} of wages and ${usd(1250)} of rent, would get about ${usd(ex.benefit)} a month if the gas bill is in their name and ${usd(exHeatIncluded.benefit)} if heat is included in the rent. Montana Medicaid covers adults under the expansion up to ${usd(adult.monthly ?? 0)} a month for one, so these parents ${par.eligible ? 'qualify' : 'do not qualify'}, and Healthy Montana Kids covers children up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for four.`,
  body: (h) => `<h2>Heat in your name, or in the rent</h2>
<p>The USDA table gives Montana a heating and cooling allowance of ${usdx(hc)} and a limited allowance of ${usdx(lua)}, a difference of ${usd(hc - lua)} a month in the shelter costs SNAP counts (${h.src('fnaSua', 'USDA SUA table')}). For the Billings family the larger figure brings shelter costs to ${usd(ex.shelterCosts)} and the deduction to ${usd(ex.deductions.shelter)}${ex.shelterCapped ? ', the federal cap' : ''}; net income is ${usd(ex.net)} and the allotment ${usd(ex.benefit)}. With heat included in the rent, the same family counts ${usd(exHeatIncluded.shelterCosts)}, deducts ${usd(exHeatIncluded.deductions.shelter)} and receives ${usd(exHeatIncluded.benefit)}. A lease or a utility bill showing who pays for heat is the document that settles it. Propane or heating oil bought by the household is a heating cost as well.</p>
<h2>Healthy Montana Kids above Medicaid</h2>
<p>Montana's children are on Medicaid up to ${kidMed}% of poverty and on Healthy Montana Kids, the state's CHIP, from there up to ${kid.effectivePct}%. For the Billings family that is ${usd(kid.monthly ?? 0)} a month, so the children ${medCheck('montana', 'child6to18', 4, 3400).eligible ? 'are covered' : 'are not covered'}. The parents, at ${Math.round(par.pctIncome)}% of poverty, ${par.eligible ? 'fit under' : 'are above'} the expansion line of ${adult.effectivePct}%. Pregnant women have a lower line than in many states, ${preg.effectivePct}%, or ${usd(preg.monthly ?? 0)} a month for two. Above Medicaid, Montanans buy coverage on HealthCare.gov with the ${h.a('aca-subsidy-calculator', 'premium tax credit')}. Federal work requirements for expansion adults begin on ${h.day(W.start)}.</p>
<p>If the younger Billings child is under five, WIC is open to that child too: the family's ${usd(3400 * 12)} a year is ${wic.byIncome ? 'under' : 'over'} the WIC line of ${usd(wic.limit)} for four, valid until ${day(P.wic.to)}. A household already enrolled in SNAP or Montana Medicaid meets the WIC income test automatically, whatever its income; enrollment in Healthy Montana Kids, a CHIP program, is not on the federal list, so families in that band should bring pay stubs. See the ${h.a('wic-income-guidelines', 'WIC income guidelines')}.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Bozeman, Helena and a small eastern county</h2>
<p>HUD treats nearly every Montana county as its own area. Gallatin County, around Bozeman, has the highest very low income limit for four, ${usd(gal.vli)}. Next comes an unusual entry: Fallon County, a small county on the eastern border, at ${usd(fal.vli)}, ahead of Lewis and Clark County and Helena at ${usd(lc.vli)}. Missoula County is at ${usd(mis.vli)}, Yellowstone County at ${usd(yel.vli)}, and the lowest counties at ${usd(S.hud.vli4Min)}. HUD starts from each area's median family income, so a small county with high local earnings can rank above a state capital. Neighbors: ${h.a('state:wyoming', 'Wyoming')} and ${h.a('state:south-dakota', 'South Dakota')} did not expand Medicaid; ${h.a('state:idaho', 'Idaho')} and ${h.a('state:north-dakota', 'North Dakota')} did.</p>`,
  faqs: [
    { q: 'What is the income limit for SNAP in Montana for a family of 4?', a: `${usd(snapGrossState('montana', 4))} of gross income a month in fiscal year ${P.snap.fy}, ${b.grossPct}% of the 2026 poverty guideline, with no asset test because Montana uses broad-based categorical eligibility. The amount received is the federal maximum for four minus 30% of net income; a Billings family earning ${usd(3400)} with ${usd(1250)} rent and its own heating bill gets about ${usd(ex.benefit)}.` },
    { q: 'What is the income limit for Healthy Montana Kids?', a: `Healthy Montana Kids, Montana's CHIP, covers children up to ${kid.effectivePct}% of the poverty guideline with the 5% disregard, about ${usd(kid.monthly ?? 0)} a month for a family of four and ${usd(medLimit('montana', 'child6to18', 3).monthly ?? 0)} for three in 2026. Below ${kidMed}% the children are on Medicaid. Levels come from the CMS table of state eligibility; one application covers both programs.` },
    { q: 'Does Montana count heating costs for food stamps?', a: `Yes, through a fixed allowance. A Montana household that pays for heating or cooling deducts ${usdx(hc)} a month as utility costs in the shelter deduction; one that pays only other utilities deducts ${usdx(lua)}. Propane or fuel oil bought by the household counts as heating. The allowance amounts come from the USDA table of fiscal year 2026.` },
  ],
  related: ['state:wyoming', 'state:idaho', 'state:north-dakota', 'state:south-dakota', 'snap-deductions', 'aca-subsidy-calculator'],
});
