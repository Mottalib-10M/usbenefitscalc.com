import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, snapMax, snapStd, suaRow, medLimit, medCheck, fpl, fplAt, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('hawaii');
const g = S.snap.bbce[0].grossPct;
const r3 = suaRow('hawaii', 3);
const r1 = suaRow('hawaii', 1);
// A family of three in Hilo: $3,300 of wages, $1,500 rent, an electric bill (their only utility bill).
const ex = snapCalc('hawaii', { size: 3, earned: 3300, housing: 1500, utilities: r3?.electricity ?? 0 });
const exNone = snapCalc('hawaii', { size: 3, earned: 3300, housing: 1500, utilities: 0 });
const adult = medLimit('hawaii', 'adult', 1);
const kid = medLimit('hawaii', 'child6to18', 3);
const preg = medLimit('hawaii', 'pregnant', 2);
// A single line cook in Kahului earning $2,000 a month.
const cook = medCheck('hawaii', 'adult', 1, 2000);
const hnl = hudOf('hawaii', 'Honolulu County', 4);
const maui = hudOf('hawaii', 'Maui County', 4);
const kauai = hudOf('hawaii', 'Kauai County', 4);
const big = hudOf('hawaii', 'Hawaii County', 4);

export default defineStatePage({
  slug: 'hawaii',
  title: 'Hawaii SNAP and Med-QUEST 2027: Island Poverty Guideline',
  description: `Hawaii 2026-27: own poverty guideline (${usd(fpl(4, 'hi'))} for 4), SNAP gross limit ${usd(snapGrossState('hawaii', 3))} a month for 3, maximum ${usd(snapMax(4, 'hi'))} for 4, Med-QUEST to ${usd(adult.monthly ?? 0)} a month for one adult.`,
  intro: 'Hawaii runs every program on its own poverty guideline and SNAP scale, and its SNAP utility table has no heating and cooling allowance at all: bills count item by item.',
  resume: `Hawaii's figures are built on a poverty guideline of its own, ${usd(fpl(4, 'hi'))} a year for four people in 2026 against ${usd(fpl(4))} in the 48 contiguous states, and SNAP uses a Hawaii scale as well. The gross income test is ${g}% of that guideline, ${usd(snapGrossState('hawaii', 3))} a month for three in fiscal year ${P.snap.fy}, with no asset limit, and the maximum for four is ${usd(snapMax(4, 'hi'))}. Hawaii has no heating and cooling allowance; instead the USDA table lists one standard per utility, such as ${usdx(r3?.electricity ?? 0)} for electricity in a three-person home. A Hilo family of three earning ${usd(3300)} with ${usd(1500)} rent and an electric bill would receive about ${usd(ex.benefit)} a month. Hawaii expanded Medicaid, called Med-QUEST: a single adult qualifies up to ${usd(adult.monthly ?? 0)} a month, and children are covered up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for a family of three.`,
  body: (h) => `<h2>No heating allowance, one standard per bill</h2>
<p>In the USDA table, Hawaii is the only state whose rows carry no heating and cooling figure (New Jersey's are marked pending). Hawaii's rows are sized by household instead, and each lists separate standards for electricity, gas, water, sewage and trash (${h.src('fnaSua', 'USDA SUA table')}). For one person, electricity is ${usdx(r1?.electricity ?? 0)} and water ${usdx(r1?.water ?? 0)}; for three, ${usdx(r3?.electricity ?? 0)} and ${usdx(r3?.water ?? 0)}; telephone is ${usdx(r3?.phone ?? 0)} at every size. The table also marks these standards as optional, so a household's actual costs can be used instead when they are higher. How several bills combine is for the agency to decide; the example below uses electricity alone.</p>
<p>The Hilo family has ${usd(ex.gross)} of wages. Hawaii's SNAP deductions are larger than on the mainland: the standard deduction is ${usd(snapStd(3, 'hi'))} instead of ${usd(snapStd(3))}, and the shelter cap ${usd(P.snap.shelterCap.hi)}. After the 20% earnings deduction, ${usd(ex.adjusted)} is left. Rent and the ${usdx(r3?.electricity ?? 0)} electricity standard make ${usd(ex.shelterCosts)}, the excess over half of income is ${usd(ex.deductions.shelter)}, net income ${usd(ex.net)}, and the Hawaii maximum for three, ${usd(ex.maxAllotment)}, minus ${usd(ex.thirtyPercent)} gives ${usd(ex.benefit)}. If the landlord paid the electricity, the estimate would fall to ${usd(exNone.benefit)}. Even so, Hawaii's maximum is about ${Math.round((snapMax(4, 'hi') / snapMax(4) - 1) * 100)}% above the mainland figure of ${usd(snapMax(4))} for four. The ${h.a('snap-calculator', 'SNAP calculator')} handles the Hawaii scale.</p>
<h2>Med-QUEST on the Hawaii guideline</h2>
<p>The Med-QUEST Division covers expansion adults at ${adult.effectivePct}% of the Hawaii guideline, ${usd(adult.monthly ?? 0)} a month for one person, where the same percentage is ${usd(medLimit('ohio', 'adult', 1).monthly ?? 0)} in Ohio. A line cook in Kahului earning ${usd(2000)} a month is at ${Math.round(cook.pctIncome)}% of poverty and ${cook.eligible ? 'qualifies' : 'is over the line'}. Children up to 19 stay on Medicaid to ${kid.effectivePct}% (${h.src('cmsLevels', 'CMS levels')}), with no separate CHIP listed, and pregnant women qualify to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for two. Above Med-QUEST, Hawaii uses HealthCare.gov; the premium tax credit starts at ${usd(fplAt(1, 100, 'hi', 2025))} a year for one person on the 2025 Hawaii guideline (${h.a('aca-subsidy-calculator', 'subsidy calculator')}).</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Five counties, Honolulu on top</h2>
<p>HUD gives Hawaii five rows. For a family of four, the very low income limit is ${usd(hnl.vli)} in Honolulu County, ${usd(maui.vli)} in Maui County, ${usd(kauai.vli)} on Kauai and ${usd(big.vli)} on the Big Island, with tiny Kalawao County at ${usd(hudOf('hawaii', 'Kalawao County', 4).vli)}. The other state with its own guideline is ${h.a('state:alaska', 'Alaska')}; for a West Coast comparison, see ${h.a('state:california', 'California')}.</p>`,
  faqs: [
    { q: 'What is the SNAP income limit in Hawaii for 2027?', a: `For fiscal year ${P.snap.fy}, Hawaii tests gross monthly income at ${g}% of the Hawaii poverty guideline: ${usd(snapGrossState('hawaii', 1))} for one person, ${usd(snapGrossState('hawaii', 3))} for three and ${usd(snapGrossState('hawaii', 4))} for four. Hawaii has no SNAP asset limit. These lines are higher than on the mainland because HHS publishes a separate guideline for Hawaii.` },
    { q: 'How much are food stamps in Hawaii for a family of 4?', a: `The maximum SNAP benefit in Hawaii is ${usd(snapMax(4, 'hi'))} a month for four people in fiscal year ${P.snap.fy}, from ${day(P.snap.from)}, against ${usd(snapMax(4))} in the 48 contiguous states. A family with income receives the maximum minus 30% of its net income, computed with Hawaii's own standard deduction and utility standards.` },
    { q: 'What is the Med-QUEST income limit in Hawaii?', a: `Adults 19 to 64 qualify up to ${adult.effectivePct}% of the Hawaii poverty guideline with the disregard, about ${usd(adult.monthly ?? 0)} a month for one person in 2026, under the ACA expansion. Children are covered to ${kid.effectivePct}%, about ${usd(kid.monthly ?? 0)} a month for three people, and pregnant women to ${preg.effectivePct}%, according to the CMS table.` },
    { q: 'What is the Section 8 income limit in Honolulu, Hawaii?', a: `For fiscal year 2026, a family of four in Honolulu County is very low income up to ${usd(hnl.vli)} a year and extremely low income up to ${usd(hnl.eli)}. It is the highest of Hawaii's five counties; Hawaii County is the lowest at ${usd(big.vli)}. HUD limits took effect on ${day(P.hud.effective)}.` },
  ],
  related: ['state:alaska', 'state:california', 'snap-calculator', 'snap-benefit-amounts', 'federal-poverty-level', 'section-8-income-limits'],
});
