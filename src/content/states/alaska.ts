import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, snapMax, snapStd, suaRow, medLimit, medCheck, fpl, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('alaska');
const g = S.snap.bbce[0].grossPct;
const regions = S.snap.sua.filter((r) => r.hcsua);
const top = regions.reduce((a, b) => ((b.hcsua ?? 0) > (a.hcsua ?? 0) ? b : a));
const low = regions.reduce((a, b) => ((b.hcsua ?? 0) < (a.hcsua ?? 0) ? b : a));
const sc = suaRow('alaska', 4, 'Southcentral');
const sw = suaRow('alaska', 4, 'Southwest');
// The same family of four in two places: $3,800 of wages, $1,100 rent. Anchorage (urban, Southcentral) and a rural 2 village in the Southwest utility region.
const town = snapCalc('alaska', { size: 4, earned: 3800, housing: 1100, akArea: 'ak-urban', utilities: sc?.hcsua ?? 0 });
const bush = snapCalc('alaska', { size: 4, earned: 3800, housing: 1100, akArea: 'ak-rural2', utilities: sw?.hcsua ?? 0 });
const adult = medLimit('alaska', 'adult', 1);
const adultUs = medLimit('arizona', 'adult', 1);
const kid = medLimit('alaska', 'child6to18', 3);
const preg = medLimit('alaska', 'pregnant', 2);
// A single deckhand earning $2,500 a month: inside or above the adult line?
const deck = medCheck('alaska', 'adult', 1, 2500);
const anc = hudOf('alaska', 'Anchorage Municipality', 4);
const jnu = hudOf('alaska', 'Juneau City and Borough', 4);
const fbx = hudOf('alaska', 'Fairbanks North Star Borough', 4);

export default defineStatePage({
  slug: 'alaska',
  title: 'Alaska SNAP and Medicaid 2027: Three Allotment Zones',
  description: `Alaska benefits 2026-27: own poverty guideline (${usd(fpl(4, 'ak'))} for 4), SNAP up to ${usd(snapMax(4, 'ak-rural2'))} a month for 4 in rural 2 areas, Medicaid to ${usd(adult.monthly ?? 0)} a month for one adult.`,
  intro: 'Alaska has its own poverty guideline, three SNAP allotment zones and six utility regions, so the same paycheck buys very different help in Anchorage and in a village off the road system.',
  resume: `Alaska does not use the poverty guideline of the other states: HHS sets a higher one, ${usd(fpl(4, 'ak'))} a year for four people in 2026 against ${usd(fpl(4))} elsewhere, and every Alaska figure is built on it. SNAP, run by the Division of Public Assistance, tests gross income at ${g}% of that line, ${usd(snapGrossState('alaska', 4))} a month for four in fiscal year ${P.snap.fy}, with no asset limit. The maximum allotment for four is ${usd(snapMax(4, 'ak-urban'))} in urban areas and climbs to ${usd(snapMax(4, 'ak-rural2'))} in rural 2 areas. A family of four earning ${usd(3800)} with ${usd(1100)} rent would get about ${usd(town.benefit)} in Anchorage and ${usd(bush.benefit)} in a rural 2 village of the Southwest utility region. Alaska expanded Medicaid: a single adult qualifies up to ${usd(adult.monthly ?? 0)} a month, and Denali KidCare covers children up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for a family of three.`,
  body: (h) => `<h2>Three allotment zones and a larger deduction</h2>
<p>The USDA publishes separate SNAP figures for urban Alaska, rural 1 and rural 2 (${h.src('usdaCola27', 'FY 2027 COLA memo')}). For four people the monthly maximum runs ${usd(snapMax(4, 'ak-urban'))}, ${usd(snapMax(4, 'ak-rural1'))} and ${usd(snapMax(4, 'ak-rural2'))}, the higher two applying to more remote communities. Deductions are Alaskan too: the standard deduction is ${usd(snapStd(4, 'ak'))} for a household of four instead of ${usd(snapStd(4))} in the lower 48, and the cap on the excess shelter deduction is ${usd(P.snap.shelterCap.ak)}. The Division of Public Assistance decides which zone your community belongs to; this page does not assign villages.</p>
<h2>Six utility regions, from ${usdx(low.hcsua ?? 0)} to ${usdx(top.hcsua ?? 0)}</h2>
<p>Most states have a single heating and cooling allowance. Alaska's table has six regional rows (${h.src('fnaSua', 'USDA SUA table')}): ${regions.map((r) => `${r.variant} ${usdx(r.hcsua ?? 0)}`).join(', ')}. The ${top.variant} figure is ${((top.hcsua ?? 0) / (low.hcsua ?? 1)).toFixed(1)} times the ${low.variant} one. The allowance enters the shelter deduction, so each extra dollar of it adds about 30 cents of SNAP once shelter costs pass half of adjusted income, as long as the deduction stays under its cap.</p>
<p>Here is how far apart two identical families land. Each has ${usd(3800)} of wages, four members and ${usd(1100)} of rent. In Anchorage, Southcentral utilities of ${usdx(sc?.hcsua ?? 0)} bring shelter costs to ${usd(town.shelterCosts)}, the shelter deduction is ${usd(town.deductions.shelter)}, net income ${usd(town.net)}, and the urban maximum of ${usd(town.maxAllotment)} minus ${usd(town.thirtyPercent)} leaves ${usd(town.benefit)}. In the rural 2 village with the Southwest allowance of ${usdx(sw?.hcsua ?? 0)}, the deduction grows to ${usd(bush.deductions.shelter)}, net income falls to ${usd(bush.net)}, and the ${usd(bush.maxAllotment)} maximum yields ${usd(bush.benefit)}: ${usd(bush.benefit - town.benefit)} more per month for the same paycheck. Both pass the ${g}% gross line of ${usd(town.grossLimit ?? 0)} easily. Our ${h.a('snap-calculator', 'SNAP calculator')} lets you pick the zone.</p>
<h2>Medicaid on the Alaska guideline</h2>
<p>Alaska covers expansion adults at the usual ${adult.pct}% plus the 5% disregard, but on the Alaska guideline that means ${usd(adult.monthly ?? 0)} a month for one person, against ${usd(adultUs.monthly ?? 0)} for the same percentage in Arizona. A deckhand earning ${usd(2500)} a month is at ${Math.round(deck.pctIncome)}% of poverty, ${deck.eligible ? 'inside the adult group' : 'just above the adult group'}, and would look at the ${h.a('aca-subsidy-calculator', 'premium tax credit')} on HealthCare.gov instead. Children up to 19 stay on Medicaid itself, under the Denali KidCare name, to ${kid.effectivePct}% of poverty; pregnant women qualify to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month counted as two (${h.ext('https://health.alaska.gov/en/services/denali-kidcare/', 'Denali KidCare')}).</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Housing limits by borough</h2>
<p>HUD treats each of the ${S.hud.rows} boroughs and census areas as its own area. For a family of four, the very low income limit is ${usd(S.hud.vli4Max)} in ${S.hud.vli4MaxName}, ${usd(jnu.vli)} in Juneau, ${usd(anc.vli)} in Anchorage and ${usd(fbx.vli)} in the Fairbanks North Star Borough, with ${S.hud.vli4MinName} and several census areas at ${usd(S.hud.vli4Min)}. For comparison with the other state on its own guideline, see ${h.a('state:hawaii', 'Hawaii')}; ${h.a('state:washington', 'Washington')} is the nearest lower-48 state.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in Alaska for a family of 4?', a: `${usd(snapGrossState('alaska', 4))} of gross monthly income in fiscal year ${P.snap.fy}, which is ${g}% of the 2026 Alaska poverty guideline. Alaska uses broad-based categorical eligibility with no asset limit, according to the USDA chart. The guideline used is the Alaska one, ${usd(fpl(4, 'ak'))} a year for four, so the line is higher than in the lower 48 states.` },
    { q: 'How much are food stamps in rural Alaska?', a: `For fiscal year ${P.snap.fy}, the maximum for four people is ${usd(snapMax(4, 'ak-rural1'))} a month in rural 1 areas and ${usd(snapMax(4, 'ak-rural2'))} in rural 2 areas, against ${usd(snapMax(4, 'ak-urban'))} in urban Alaska. A household's actual benefit is the maximum minus 30% of its net income. The Division of Public Assistance determines which zone applies to your community.` },
    { q: 'Did Alaska expand Medicaid?', a: `Yes. The CMS table lists Alaska among the expansion states, with adults covered up to ${adult.effectivePct}% of the poverty guideline including the disregard. Because Alaska has its own guideline, that equals about ${usd(adult.monthly ?? 0)} a month for one person in 2026. Children are covered to ${kid.effectivePct}% through Denali KidCare and pregnant women to ${preg.effectivePct}%.` },
    { q: 'What is the Section 8 income limit in Anchorage, Alaska?', a: `For fiscal year 2026, a family of four in the Anchorage Municipality is very low income up to ${usd(anc.vli)} a year and extremely low income up to ${usd(anc.eli)}. The highest very low income limit in Alaska is in ${S.hud.vli4MaxName}, ${usd(S.hud.vli4Max)}. HUD limits took effect on ${day(P.hud.effective)}; the housing authority serving your area keeps the voucher waiting list.` },
  ],
  related: ['state:hawaii', 'state:washington', 'snap-calculator', 'snap-benefit-amounts', 'medicaid-income-limits', 'section-8-income-limits'],
});
