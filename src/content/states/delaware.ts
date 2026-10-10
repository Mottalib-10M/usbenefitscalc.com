import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, sua, medLimit, medCheck, fplAt, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('delaware');
const g = S.snap.bbce[0].grossPct;
const M = S.medicaid;
const d = P.medicaid.disregardPct;
const baby = medLimit('delaware', 'infant', 3);
const kid = medLimit('delaware', 'child6to18', 3);
const preg = medLimit('delaware', 'pregnant', 2);
const adult = medLimit('delaware', 'adult', 1);
// A pregnant receptionist in Wilmington, counted as two, earning $3,800 a month.
const rec = medCheck('delaware', 'pregnant', 2, 3800);
// A mother and her 8-year-old in Dover: $2,300 of wages, $1,050 rent.
const ex = snapCalc('delaware', { size: 2, earned: 2300, housing: 1050 });
const nc = hudOf('delaware', 'New Castle County', 4);
const kent = hudOf('delaware', 'Kent County', 4);
const sussex = hudOf('delaware', 'Sussex County', 4);

export default defineStatePage({
  slug: 'delaware',
  title: 'Delaware Benefits 2026: SNAP, Medicaid and 3 HUD Counties',
  description: `Delaware 2026: SNAP gross limit ${usd(snapGrossState('delaware', 2))} a month for 2 people, pregnancy and babies covered to ${preg.effectivePct}% of poverty, Section 8 from ${usd(sussex.vli)} to ${usd(nc.vli)} for 4.`,
  intro: 'With three counties, Delaware has the shortest Section 8 table of the 50 states, and a children\'s ladder where the Healthy Children Program fills the steps Medicaid leaves.',
  resume: `Delaware's benefits fit on one page: three counties, one SNAP line and a single ${S.medicaid.chipName} for children Medicaid does not reach. SNAP, run by the Division of Social Services, tests gross income at ${g}% of poverty, ${usd(snapGrossState('delaware', 2))} a month for two people in fiscal year ${P.snap.fy}, with no asset limit and a heating and cooling allowance of ${usdx(sua('delaware', 2) ?? 0)}. A Dover mother with one child earning ${usd(2300)} and paying ${usd(1050)} rent would receive about ${usd(ex.benefit)} a month. Delaware expanded Medicaid, so adults qualify up to ${usd(adult.monthly ?? 0)} a month for one person, and pregnant women and babies are covered up to ${preg.effectivePct}% of poverty, ${usd(preg.monthly ?? 0)} a month for a pregnant woman counted as two. Section 8 very low income limits for four run from ${usd(sussex.vli)} in Sussex County to ${usd(nc.vli)} in New Castle County.`,
  body: (h) => `<h2>A ladder by age for Delaware children</h2>
<p>Delaware's Medicaid line for children falls as they grow, and the CHIP fills the gap (${h.src('cmsLevels', 'CMS eligibility levels')}). Babies under one are on Medicaid to ${M.child0to1 + d}% of poverty. From age one to five, Medicaid stops at ${M.child1to5 + d}%, and from six to eighteen at ${M.child6to18 + d}%, the federal floor. Between those lines and ${kid.effectivePct}%, the ${M.chipName} covers ages ${M.chipAges ?? '1 up to 19'}. For a family of three, the top of the ladder is ${usd(kid.monthly ?? 0)} a month at every age; what changes is whether the coverage is Medicaid or CHIP. A sibling pair aged two and ten in the same home can end up in different programs while the parents fill in one application on ASSIST, the state portal.</p>
<p>Pregnancy follows the infant line: ${preg.effectivePct}%, or ${usd(preg.monthly ?? 0)} a month. A receptionist in Wilmington earning ${usd(3800)} who is expecting is at ${Math.round(rec.pctIncome)}% of the guideline and ${rec.eligible ? 'qualifies' : 'does not qualify'}. Adults without a pregnancy have the expansion line of ${adult.effectivePct}%, ${usd(adult.monthly ?? 0)} a month alone; above it, Delaware residents buy 2026 plans on HealthCare.gov with the ${h.a('aca-subsidy-calculator', 'premium tax credit')}, which starts at ${usd(fplAt(1, 100, 'us', 2025))} a year for one person.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>A Dover SNAP budget, step by step</h2>
<p>Delaware's SNAP rule is the common ${g}% line with no savings test (${h.src('fnaBbce', 'USDA BBCE chart')}). Its utility table also gives a flat ${usdx(S.snap.sua[0].electricity)} for each single utility when a household pays only one, next to the ${usdx(sua('delaware', 2) ?? 0)} heating figure. The Dover mother earns ${usd(ex.gross)}; minus 20% for work and the ${usd(ex.deductions.standard)} standard deduction, ${usd(ex.adjusted)} is left. Rent and utilities make ${usd(ex.shelterCosts)}, and the excess over half of income, ${usd(ex.excessShelter)}, ${ex.shelterCapped ? `is capped at ${usd(ex.deductions.shelter)}` : 'is deducted in full'}. With ${usd(ex.net)} of net income, the ${usd(ex.maxAllotment)} two-person maximum minus ${usd(ex.thirtyPercent)} gives ${usd(ex.benefit)}. Child support she pays out, or child care while she works, would lower net income further; the ${h.a('snap-calculator', 'SNAP calculator')} accepts both.</p>
<h2>New Castle, Kent and Sussex</h2>
<p>HUD needs only three rows for Delaware. New Castle County is part of the Philadelphia metropolitan area and has the highest very low income limit for four, ${usd(nc.vli)}; Kent County, around Dover, is at ${usd(kent.vli)}; Sussex County, the beach county, at ${usd(sussex.vli)}. Extremely low income limits, the group to which housing authorities must give ${P.hud.elisShareOfNewVouchers}% of new vouchers, are ${usd(nc.eli)}, ${usd(kent.eli)} and ${usd(sussex.eli)} for four. Next door, ${h.a('state:maryland', 'Maryland')} and ${h.a('state:new-jersey', 'New Jersey')} run their own exchanges and ${h.a('state:pennsylvania', 'Pennsylvania')} uses the same ${g}% SNAP line.</p>`,
  faqs: [
    { q: 'What is the food stamp income limit in Delaware for 2 people?', a: `${usd(snapGrossState('delaware', 2))} of gross monthly income in fiscal year ${P.snap.fy}, which is ${g}% of the 2026 poverty guideline. Delaware has no SNAP asset limit under broad-based categorical eligibility. For three people the line is ${usd(snapGrossState('delaware', 3))}. The Division of Social Services then computes the benefit from net income after deductions.` },
    { q: 'What is the income limit for the Delaware Healthy Children Program?', a: `The ${M.chipName}, Delaware's CHIP, covers children aged one to eighteen up to ${kid.effectivePct}% of the poverty guideline, about ${usd(kid.monthly ?? 0)} a month for a family of three in 2026. Children below the Medicaid line for their age, ${M.child1to5 + d}% from one to five and ${M.child6to18 + d}% from six, get Medicaid instead.` },
    { q: 'How much can a pregnant woman make for Medicaid in Delaware?', a: `Up to ${preg.effectivePct}% of the poverty guideline with the disregard, about ${usd(preg.monthly ?? 0)} a month for a pregnant woman counted as a household of two in 2026, according to the CMS table. For a household of three including the expected baby, the limit is ${usd(medLimit('delaware', 'pregnant', 3).monthly ?? 0)}. Babies are then covered to the same level until their first birthday.` },
    { q: 'What is the Section 8 income limit in Wilmington, Delaware?', a: `Wilmington is in New Castle County, where a family of four is very low income up to ${usd(nc.vli)} a year and extremely low income up to ${usd(nc.eli)} for fiscal year 2026. That is the highest of Delaware's three counties. HUD limits took effect on ${day(P.hud.effective)}; the local housing authority keeps the waiting list.` },
  ],
  related: ['state:maryland', 'state:new-jersey', 'state:pennsylvania', 'snap-calculator', 'medicaid-eligibility', 'section-8-income-limits'],
});
