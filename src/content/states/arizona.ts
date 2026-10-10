import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, sua, medLimit, medCheck, fplAt, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('arizona');
const g = S.snap.bbce[0].grossPct;
const small = sua('arizona', 3) ?? 0;
const big = sua('arizona', 4) ?? 0;
// A Phoenix household on $3,100 of wages and $1,400 rent: first as three people, then after a baby arrives.
const three = snapCalc('arizona', { size: 3, earned: 3100, housing: 1400 });
const four = snapCalc('arizona', { size: 4, earned: 3100, housing: 1400 });
const adult = medLimit('arizona', 'adult', 1);
const kid = medLimit('arizona', 'child6to18', 3);
const baby = medLimit('arizona', 'infant', 3);
const preg = medLimit('arizona', 'pregnant', 2);
// A single warehouse worker in Tucson earning $1,700 a month.
const worker = medCheck('arizona', 'adult', 1, 1700);
const mar = hudOf('arizona', 'Maricopa County', 4);
const pima = hudOf('arizona', 'Pima County', 4);
const coco = hudOf('arizona', 'Coconino County', 4);
const yuma = hudOf('arizona', 'Yuma County', 4);

export default defineStatePage({
  slug: 'arizona',
  title: 'Arizona Nutrition Assistance and AHCCCS 2026 Income Limits',
  description: `Arizona 2026: Nutrition Assistance (SNAP) gross limit ${usd(snapGrossState('arizona', 3))} a month for 3, utility allowance ${usdx(small)} or ${usdx(big)} by size, AHCCCS for adults to ${usd(adult.monthly ?? 0)} a month.`,
  intro: 'Arizona renames SNAP Nutrition Assistance and Medicaid AHCCCS, and it is one of the few states whose utility allowance depends on how many people live in the home.',
  resume: `Arizona's food program is called Nutrition Assistance and its Medicaid program AHCCCS, and one application on Health-e-Arizona Plus reaches both. Nutrition Assistance uses a gross income test of ${g}% of the poverty guideline, ${usd(snapGrossState('arizona', 3))} a month for three people in fiscal year ${P.snap.fy}, with no asset limit. What sets Arizona apart is its utility allowance: ${usdx(small)} for households of one to three and ${usdx(big)} from four members, both low by national standards. A Phoenix household earning ${usd(3100)} with ${usd(1400)} rent would receive about ${usd(three.benefit)} as three people and ${usd(four.benefit)} as four. Arizona expanded Medicaid, so a single adult is covered by AHCCCS up to ${usd(adult.monthly ?? 0)} a month, and children are covered by Medicaid and then KidsCare up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for a family of three.`,
  body: (h) => `<h2>An allowance that steps up at four people</h2>
<p>The USDA table gives Arizona two utility rows instead of one (${h.src('fnaSua', 'USDA SUA table')}): ${S.snap.sua.map((r) => `${r.variant}, ${usdx(r.hcsua ?? 0)} for heating or cooling`).join('; ')}. Only a handful of states size their allowance this way. The amounts are modest, so in Arizona the shelter deduction rests mostly on rent. Because the USDA lists the allowance as mandatory, a large summer cooling bill still counts at the flat figure, not at its real amount.</p>
<p>The Phoenix example shows the step at work. With three members, rent of ${usd(1400)} plus ${usdx(small)} makes ${usd(three.shelterCosts)} of shelter costs. After the 20% earnings deduction and the ${usd(three.deductions.standard)} standard deduction, adjusted income is ${usd(three.adjusted)}, the shelter deduction ${usd(three.deductions.shelter)} and net income ${usd(three.net)}. Thirty percent of that, ${usd(three.thirtyPercent)}, comes off the ${usd(three.maxAllotment)} maximum: ${usd(three.benefit)}. When a baby arrives, three things move together: the allowance becomes ${usdx(big)}, the standard deduction ${usd(four.deductions.standard)} and the maximum ${usd(four.maxAllotment)}. Net income drops to ${usd(four.net)} and the estimate rises to ${usd(four.benefit)}, ${usd(four.benefit - three.benefit)} more with the same pay. The ${g}% gross line, ${usd(four.grossLimit ?? 0)} for four, is far away. Try your own numbers in the ${h.a('snap-calculator', 'SNAP calculator')}.</p>
<h2>AHCCCS for adults, KidsCare for children</h2>
<p>The Arizona Health Care Cost Containment System covers expansion adults to ${adult.effectivePct}% of poverty with the disregard (${h.src('cmsLevels', 'CMS levels')}), ${usd(adult.monthly ?? 0)} a month for one person in 2026. A single warehouse worker in Tucson earning ${usd(1700)} sits at ${Math.round(worker.pctIncome)}% of the guideline, ${worker.eligible ? 'inside AHCCCS' : 'above AHCCCS'}; a raise of ${usd(Math.max(0, (adult.monthly ?? 0) - 1700))} a month would move that worker to the ${h.a('aca-subsidy-calculator', '2026 premium tax credit')} on HealthCare.gov, available from 100% of the 2025 guideline (${usd(fplAt(1, 100, 'us', 2025))} a year). Children follow age steps inside Medicaid, babies to ${baby.effectivePct}% for instance, before KidsCare, the state CHIP, takes every child to ${kid.effectivePct}%. Pregnant women qualify to ${preg.effectivePct}%, about ${usd(preg.monthly ?? 0)} a month for two. The AHCCCS homepage offers one application for Medicaid or KidsCare (${h.ext('https://www.azahcccs.gov/', 'azahcccs.gov')}).</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>A wide gap between counties</h2>
<p>Arizona's ${S.hud.rows} counties spread the very low income limit for four from ${usd(mar.vli)} in Maricopa County, matched by Pinal, to ${usd(S.hud.vli4Min)} in ${S.hud.vli4MinName} on the border. Coconino County, around Flagstaff, is at ${usd(coco.vli)}, Pima County at ${usd(pima.vli)} and Yuma County at ${usd(yuma.vli)}. For neighbors, ${h.a('state:new-mexico', 'New Mexico')} and ${h.a('state:nevada', 'Nevada')} also expanded Medicaid, while ${h.a('state:utah', 'Utah')} keeps the federal SNAP tests.</p>`,
  faqs: [
    { q: 'What is the income limit for Nutrition Assistance in Arizona?', a: `For fiscal year ${P.snap.fy}, Arizona tests gross monthly income at ${g}% of the poverty guideline: ${usd(snapGrossState('arizona', 1))} for one person, ${usd(snapGrossState('arizona', 3))} for three and ${usd(snapGrossState('arizona', 4))} for four. There is no asset limit, according to the USDA chart of broad-based categorical eligibility. The Department of Economic Security decides the benefit from net income after deductions.` },
    { q: 'What is the AHCCCS income limit for a single person in Arizona?', a: `About ${usd(adult.monthly ?? 0)} a month in 2026, which is ${adult.effectivePct}% of the poverty guideline including the 5% disregard. Arizona expanded Medicaid, so adults 19 to 64 qualify on income alone. Income is counted with MAGI rules. Above that line, a premium tax credit on HealthCare.gov can lower the cost of a Marketplace plan.` },
    { q: 'How much can a family earn for KidsCare in Arizona?', a: `KidsCare, Arizona's CHIP, covers children up to ${kid.effectivePct}% of the poverty guideline: about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('arizona', 'child6to18', 4).monthly ?? 0)} for four in 2026. Children under the Medicaid line for their age are placed on AHCCCS Medicaid instead. One application through AHCCCS covers both.` },
    { q: 'What is the Section 8 income limit in Phoenix, Arizona?', a: `In Maricopa County, which includes Phoenix, a family of four qualifies as very low income up to ${usd(mar.vli)} a year and extremely low income up to ${usd(mar.eli)} for fiscal year 2026. These are the highest Arizona limits, shared with Pinal County. HUD published them effective ${day(P.hud.effective)}; the city or county housing authority runs the voucher list.` },
  ],
  related: ['state:new-mexico', 'state:nevada', 'state:utah', 'state:california', 'snap-deductions', 'medicaid-income-limits'],
});
