import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, bhpOf, acaCliff, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('minnesota');
const b = S.snap.bbce[0];
const adult = medLimit('minnesota', 'adult', 1);
const bhp1 = bhpOf('minnesota', 1);
const bhp3 = bhpOf('minnesota', 3);
const baby = medLimit('minnesota', 'infant', 3);
const kid = medLimit('minnesota', 'child6to18', 3);
const preg = medLimit('minnesota', 'pregnant', 2);
// Two parents and a baby in St. Cloud (Stearns County): $3,000 of wages, $1,150 rent, heat billed to them.
const ex = snapCalc('minnesota', { size: 3, earned: 3000, housing: 1150 });
const now = medCheck('minnesota', 'parent', 3, 3000);
const raise = medCheck('minnesota', 'parent', 3, 3500);
const olm = hudOf('minnesota', 'Olmsted County', 4);
const hen = hudOf('minnesota', 'Hennepin County', 4);
const ste = hudOf('minnesota', 'Stearns County', 4);
const stl = hudOf('minnesota', 'St. Louis County', 4);

export default defineStatePage({
  slug: 'minnesota',
  title: 'Minnesota SNAP and MinnesotaCare Income Limits 2026',
  description: `Minnesota benefits 2026: SNAP gross limit ${usd(snapGrossState('minnesota', 3))} a month for 3, Medical Assistance to ${adult.effectivePct}% of poverty, then MinnesotaCare to ${bhp1?.effectivePct}%, babies under two to ${baby.effectivePct}%.`,
  intro: 'Minnesota is one of two states where adults above the Medicaid line move into a Basic Health Program, MinnesotaCare, instead of going straight to the Marketplace.',
  resume: `Minnesota adds a rung most states lack: an adult who earns too much for Medical Assistance, the state's Medicaid, can enroll in MinnesotaCare, a Basic Health Program covering incomes up to ${bhp1?.effectivePct}% of the poverty guideline, about ${usd(bhp1?.monthly ?? 0)} a month for one person and ${usd(bhp3?.monthly ?? 0)} for a family of three in 2026. Medical Assistance itself covers adults up to ${usd(adult.monthly ?? 0)} a month for one, babies up to ${baby.effectivePct}% of poverty and pregnant women up to ${preg.effectivePct}%. For food, SNAP is run by the Department of Children, Youth, and Families with a gross test of ${b.grossPct}% of poverty, ${usd(snapGrossState('minnesota', 3))} a month for three in fiscal year ${P.snap.fy}, and no asset limit. Two parents with a baby in St. Cloud earning ${usd(3000)} and paying ${usd(1150)} in rent would get about ${usd(ex.benefit)} a month with the state's heating allowance of ${usdx(sua('minnesota', 3) ?? 0)}.`,
  body: (h) => `<h2>MinnesotaCare, between Medical Assistance and MNsure</h2>
<p>CMS records Minnesota's adult level as ${S.medicaid.bhpPct}% of poverty, with a note that everyone above ${S.medicaid.adultPct}% is covered through the Basic Health Program rather than Medicaid. In dollars for 2026: Medical Assistance up to ${usd(adult.monthly ?? 0)} a month for a single adult, MinnesotaCare from there up to ${usd(bhp1?.monthly ?? 0)}. Only above that line does a Minnesotan shop on MNsure, the state's exchange, with the ${h.a('aca-subsidy-calculator', 'premium tax credit')}. Take the St. Cloud parents: at ${usd(3000)} a month they are at ${Math.round(now.pctIncome)}% of poverty and ${now.eligible ? 'stay on Medical Assistance' : 'leave Medical Assistance'}. If a raise brought them to ${usd(3500)}, or ${Math.round(raise.pctIncome)}%, they would ${raise.bhpEligible ? 'move to MinnesotaCare' : raise.eligible ? 'remain on Medical Assistance' : 'move to MNsure'}, not to the Marketplace. Only ${h.a('state:new-york', 'New York')} has a comparable program. On MNsure itself, the 2026 premium tax credit stops at ${P.aca.maxPct}% of the 2025 guideline, ${usd(acaCliff(1))} a year for one person and ${usd(acaCliff(3))} for three, so a Minnesota household can move from MinnesotaCare to subsidized coverage and then to full price as its income climbs.</p>
<h2>Babies to age two, and pregnancy</h2>
<p>A CMS note says Minnesota covers children up to age two at ${S.medicaid.child0to1}% of poverty, ${baby.effectivePct}% with the disregard: ${usd(baby.monthly ?? 0)} a month for a family of three. From two to eighteen the line is ${kid.effectivePct}%, ${usd(kid.monthly ?? 0)} for the same family. The state has no separate CHIP in the CMS table; the children's coverage is Medical Assistance. Pregnant women qualify up to ${preg.effectivePct}%, which is ${usd(preg.monthly ?? 0)} a month for an expectant mother counted as two, far above the national floor.</p>
${h.mini('fplThreshold', { pct: bhp1?.effectivePct ?? adult.effectivePct ?? 138 })}
<h2>SNAP moved to a new department</h2>
<p>Since the creation of the Department of Children, Youth, and Families, food support in Minnesota is administered there and not by the Department of Human Services, which keeps Medical Assistance (${h.ext('https://dcyf.mn.gov/snap', 'DCYF SNAP page')}). Applications go through MNbenefits. The St. Cloud budget: wages of ${usd(3000)}, minus ${usd(ex.deductions.earned)} for earnings and ${usd(ex.deductions.standard)} standard; rent plus the heating allowance of ${usdx(sua('minnesota', 3) ?? 0)} is ${usd(ex.shelterCosts)}, producing a shelter deduction of ${usd(ex.deductions.shelter)}; net income ${usd(ex.net)}, benefit ${usd(ex.benefit)}. The ${h.a('snap-calculator', 'SNAP calculator')} handles other cases.</p>
<h2>Rochester above the Twin Cities</h2>
<p>HUD puts Olmsted and Dodge counties, the Rochester area, at the top of Minnesota with a very low income limit for four of ${usd(olm.vli)}. Hennepin and Ramsey counties are at ${usd(hen.vli)}, Stearns County at ${usd(ste.vli)} and St. Louis County, around Duluth, at ${usd(stl.vli)}; the lowest counties, such as Aitkin, are at ${usd(S.hud.vli4Min)}. For neighbors, see ${h.a('state:wisconsin', 'Wisconsin')} and ${h.a('state:iowa', 'Iowa')}.</p>`,
  faqs: [
    { q: 'What is the income limit for MinnesotaCare in Minnesota?', a: `MinnesotaCare covers adults above the Medical Assistance line up to ${bhp1?.effectivePct}% of the poverty guideline with the disregard, about ${usd(bhp1?.monthly ?? 0)} a month for one person and ${usd(bhp3?.monthly ?? 0)} for three in 2026. CMS lists it as Minnesota's Basic Health Program. Below ${adult.effectivePct}% adults are on Medical Assistance; above the MinnesotaCare line they shop on MNsure.` },
    { q: 'What is the SNAP income limit in Minnesota for a family of 3?', a: `${usd(snapGrossState('minnesota', 3))} of gross income a month in fiscal year ${P.snap.fy}, ${b.grossPct}% of the poverty guideline, with no asset test under broad-based categorical eligibility. Minnesota's Department of Children, Youth, and Families runs SNAP. The benefit for three is the federal maximum minus 30% of net income after the earned income, standard and shelter deductions.` },
    { q: 'How much can a pregnant woman make for Medical Assistance in Minnesota?', a: `Up to ${preg.effectivePct}% of the 2026 poverty guideline including the 5% disregard, about ${usd(preg.monthly ?? 0)} a month for a woman expecting one baby, who counts as a household of two. With twins the household counts as three and the line is ${usd(medLimit('minnesota', 'pregnant', 3).monthly ?? 0)}. The level comes from the CMS table of state eligibility.` },
    { q: 'What is the Section 8 income limit in Minneapolis, Minnesota?', a: `Hennepin County, home to Minneapolis, has a fiscal year 2026 very low income limit of ${usd(hen.vli)} for a family of four and ${usd(hudOf('minnesota', 'Hennepin County', 1).vli)} for one person; the extremely low limit for four is ${usd(hen.eli)}. Ramsey County and St. Paul share those figures. The Rochester area is higher, at ${usd(olm.vli)} for four.` },
  ],
  related: ['state:wisconsin', 'state:iowa', 'state:north-dakota', 'state:new-york', 'medicaid-income-limits', 'aca-subsidy-calculator'],
});
