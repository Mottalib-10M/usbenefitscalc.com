import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, sua, medLimit, medCheck, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('indiana');
const b = S.snap.bbce[0];
// A disabled woman in Indianapolis living alone on $1,350 of SSDI, $725 rent, $110 of monthly medical costs: $4,900 saved, then $5,200.
const ex = snapCalc('indiana', { size: 1, unearned: 1350, housing: 725, elderlyDisabled: true, medical: 110, assets: 4900 });
const exOver = snapCalc('indiana', { size: 1, unearned: 1350, housing: 725, elderlyDisabled: true, medical: 110, assets: 5200 });
const adult = medLimit('indiana', 'adult', 1);
const kid = medLimit('indiana', 'child6to18', 3);
const baby = medLimit('indiana', 'infant', 3);
const preg = medLimit('indiana', 'pregnant', 2);
// A father of two in Fort Wayne working part time for $1,500 a month.
const dad = medCheck('indiana', 'parent', 3, 1500);
const marion = hudOf('indiana', 'Marion County', 4);
const lake = hudOf('indiana', 'Lake County', 4);
const allen = hudOf('indiana', 'Allen County', 4);
const stjoe = hudOf('indiana', 'St. Joseph County', 4);
const vand = hudOf('indiana', 'Vanderburgh County', 4);

export default defineStatePage({
  slug: 'indiana',
  title: `Indiana SNAP and Medicaid Limits 2026: The ${usdx(b.assetLimit ?? 0)} Asset Test`,
  description: `Indiana 2026: SNAP gross limit ${usd(snapGrossState('indiana', 1))} a month for 1 with a ${usdx(b.assetLimit ?? 0)} asset test, Indiana Medicaid to ${usd(adult.monthly ?? 0)} a month for one adult, Hoosier Healthwise to ${kid.effectivePct}%.`,
  intro: 'Indiana keeps a savings test in SNAP under a slightly higher ceiling than federal law, expanded Medicaid for adults, and runs children\'s coverage above Medicaid as Hoosier Healthwise.',
  resume: `Indiana tests SNAP at the federal ${b.grossPct}% gross income line, ${usd(snapGrossState('indiana', 1))} a month for one person and ${usd(snapGrossState('indiana', 3))} for three in fiscal year ${P.snap.fy}, and keeps a ${usdx(b.assetLimit ?? 0)} asset limit under its broad-based categorical eligibility. The Division of Family Resources at the Family and Social Services Administration runs the program. A disabled woman in Indianapolis living alone on ${usd(1350)} of disability benefits, with ${usd(725)} rent and ${usd(110)} of monthly medical costs, would receive about ${usd(ex.benefit)} a month with ${usd(4900)} saved, and ${usd(exOver.benefit)} with ${usd(5200)}. Indiana expanded Medicaid, so adults qualify up to ${usd(adult.monthly ?? 0)} a month for one person and parents to the same ${adult.effectivePct}% of poverty. Children are covered by Medicaid and Hoosier Healthwise up to ${kid.effectivePct}%, ${usd(kid.monthly ?? 0)} a month for a family of three, and Marketplace plans are on HealthCare.gov.`,
  body: (h) => `<h2>${usd(5200 - (b.assetLimit ?? 0))} over the savings line</h2>
<p>The USDA chart gives Indiana a ${usdx(b.assetLimit ?? 0)} resource limit alongside the ${b.grossPct}% gross test (${h.src('fnaBbce', 'USDA BBCE chart')}). For a household with an older or disabled member, federal law already allows ${usdx(P.snap.assets.elderlyDisabled)}, so the categorical rule adds only ${usd((b.assetLimit ?? 0) - P.snap.assets.elderlyDisabled)} of room; for other households it raises the federal ${usdx(P.snap.assets.general)} by ${usd((b.assetLimit ?? 0) - P.snap.assets.general)}. A savings balance just above ${usdx(b.assetLimit ?? 0)} fails both routes.</p>
<p>The Indianapolis example shows the effect. Her ${usd(ex.gross)} of disability income is under the ${usd(snapGrossState('indiana', 1))} line. The ${usd(ex.deductions.standard)} standard deduction and ${usd(ex.deductions.medical)} of medical costs above the ${usd(P.snap.medicalThreshold)} threshold leave ${usd(ex.adjusted)}. Rent plus the ${usdx(sua('indiana', 1) ?? 0)} utility allowance is ${usd(ex.shelterCosts)}; as a disabled person she has no cap, so ${usd(ex.deductions.shelter)} is deducted. Net income is ${usd(ex.net)}, 30% of it ${usd(ex.thirtyPercent)}, and the one-person maximum of ${usd(ex.maxAllotment)} gives ${usd(ex.benefit)}. With ${usd(5200)} in the bank, her income does not change at all, yet she is over both the Indiana and the federal resource limit and the estimate becomes ${usd(exOver.benefit)}. What counts as a resource is set by federal rules; the home and most retirement accounts are excluded. For people on fixed incomes, the ${h.a('snap-for-seniors', 'senior and disability rules')} explain the uncapped shelter deduction.</p>
<h2>Indiana Medicaid, parents and Hoosier Healthwise</h2>
<p>On paper, Indiana's parent group is a dollar standard CMS converts to ${S.medicaid.parent}% of poverty (${h.src('cmsLevels', 'CMS eligibility levels')}). Since the expansion, parents also fall in the adult group to ${adult.effectivePct}%. A father of two in Fort Wayne earning ${usd(1500)} part time is at ${Math.round(dad.pctIncome)}% of the guideline and ${dad.eligible ? 'qualifies as an expansion adult' : 'is over the line'}. Pregnant women and babies are covered to ${preg.effectivePct}% and ${baby.effectivePct}%; older children are on Medicaid to ${S.medicaid.child6to18 + P.medicaid.disregardPct}%, and Hoosier Healthwise carries them to ${kid.effectivePct}% (${h.ext('https://www.in.gov/medicaid/members/member-programs/hoosier-healthwise/', 'Hoosier Healthwise')}). Above those lines, HealthCare.gov sells 2026 plans with the ${h.a('aca-subsidy-calculator', 'premium tax credit')}.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Indianapolis and the county floor</h2>
<p>The Indianapolis metro counties share Indiana's top very low income limit for four, ${usd(marion.vli)}, which also applies to ${S.hud.vli4MaxName} and Hamilton. Lake County, in the Chicago orbit, is at ${usd(lake.vli)}, Allen County, around Fort Wayne, at ${usd(allen.vli)}, Vanderburgh County, around Evansville, at ${usd(vand.vli)} and St. Joseph County, around South Bend, at ${usd(stjoe.vli)}. ${S.hud.vli4MinName} and many rural counties sit at ${usd(S.hud.vli4Min)}. ${h.a('state:illinois', 'Illinois')} uses a 165% SNAP line, ${h.a('state:ohio', 'Ohio')} the federal one without a savings test, and ${h.a('state:michigan', 'Michigan')} 200%.</p>`,
  faqs: [
    { q: 'What is the asset limit for food stamps in Indiana?', a: `${usdx(b.assetLimit ?? 0)} in countable resources, under Indiana's broad-based categorical eligibility, according to the USDA chart of June 2026. A household over that amount is tested under federal rules, where the limits are ${usdx(P.snap.assets.general)}, or ${usdx(P.snap.assets.elderlyDisabled)} with a member 60 or older or disabled. Bank accounts and cash count; the home does not.` },
    { q: 'What is the SNAP income limit in Indiana for one person?', a: `${usd(snapGrossState('indiana', 1))} of gross monthly income in fiscal year ${P.snap.fy}, which is ${b.grossPct}% of the 2026 poverty guideline. For a family of three the line is ${usd(snapGrossState('indiana', 3))} and for four ${usd(snapGrossState('indiana', 4))}. A household with a member 60 or older or disabled that is over the gross line can still qualify under the federal net income test.` },
    { q: 'How much can you make for Hoosier Healthwise in Indiana?', a: `Hoosier Healthwise covers children up to ${kid.effectivePct}% of the poverty guideline with the disregard, about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('indiana', 'child6to18', 4).monthly ?? 0)} for four in 2026, according to the CMS table. Below the Medicaid line for their age, children are on Indiana Medicaid itself.` },
    { q: 'What is the Section 8 income limit in Indianapolis, Indiana?', a: `For fiscal year 2026, a family of four in Marion County, which is Indianapolis, is very low income up to ${usd(marion.vli)} a year and extremely low income up to ${usd(marion.eli)}. That is the highest Indiana limit, shared with the surrounding metro counties. HUD limits took effect on ${day(P.hud.effective)}.` },
  ],
  related: ['state:illinois', 'state:ohio', 'state:michigan', 'state:kentucky', 'snap-for-seniors', 'snap-eligibility'],
});
