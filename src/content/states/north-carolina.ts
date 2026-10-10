import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, rentCalc, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('north-carolina');
const b = S.snap.bbce[0];
const rows = S.snap.sua;
const s1 = sua('north-carolina', 1) ?? 0;
const s5 = sua('north-carolina', 5) ?? 0;
const adult = medLimit('north-carolina', 'adult', 1);
const kid = medLimit('north-carolina', 'child6to18', 5);
const preg = medLimit('north-carolina', 'pregnant', 2);
// Two parents and three children in Charlotte (Mecklenburg County): $3,800 of wages, $1,100 rent, electric heat.
const ex = snapCalc('north-carolina', { size: 5, earned: 3800, housing: 1100 });
const exSmall = snapCalc('north-carolina', { size: 5, earned: 3800, housing: 1100, utilities: s1 });
const par = medCheck('north-carolina', 'parent', 5, 3800);
const meck5 = hudOf('north-carolina', 'Mecklenburg County', 5);
const rent = rentCalc({ annualIncome: 3800 * 12, dependents: 3, elderlyDisabled: false });
const wake = hudOf('north-carolina', 'Wake County', 4);
const dur = hudOf('north-carolina', 'Durham County', 4);
const meck = hudOf('north-carolina', 'Mecklenburg County', 4);
const gui = hudOf('north-carolina', 'Guilford County', 4);
const bun = hudOf('north-carolina', 'Buncombe County', 4);

export default defineStatePage({
  slug: 'north-carolina',
  title: 'North Carolina FNS and NC Medicaid Limits 2026 by Household',
  description: `North Carolina benefits 2026: FNS gross limit ${usd(snapGrossState('north-carolina', 5))} a month for 5, heating allowance from ${usdx(s1)} to ${usdx(s5)} by size, NC Medicaid for adults to ${usd(adult.monthly ?? 0)} a month.`,
  intro: 'North Carolina calls SNAP Food and Nutrition Services and is one of the few states whose utility allowance grows with the size of the household.',
  resume: `North Carolina runs SNAP as Food and Nutrition Services (FNS), with broad-based categorical eligibility at ${b.grossPct}% of poverty: a household of five can have up to ${usd(snapGrossState('north-carolina', 5))} of gross income a month in fiscal year ${P.snap.fy}, and savings are not tested. Its heating and cooling allowance is set by household size, from ${usdx(s1)} for one person to ${usdx(s5)} for five or more. Two parents in Charlotte with three children, ${usd(3800)} of wages and ${usd(1100)} of rent would receive about ${usd(ex.benefit)} a month; with the one-person allowance the same budget would give ${usd(exSmall.benefit)}, so the larger figure is worth ${usd(ex.benefit - exSmall.benefit)} to them. NC Medicaid covers adults under the expansion up to ${usd(adult.monthly ?? 0)} a month for one person, which ${par.eligible ? 'includes' : 'excludes'} these parents, and children up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for five.`,
  body: (h) => `<h2>An allowance that grows with the family</h2>
<p>Most states publish one heating and cooling allowance for everyone. The USDA table gives North Carolina ${rows.length} rows by household size (${h.src('fnaSua', 'USDA SUA table')}): ${rows.map((r) => `${usdx(r.hcsua ?? 0)} for ${r.variant?.replace(' members', '').replace(' member', '')}`).join(', ')}, with matching limited allowances from ${usdx(rows[0].lua ?? 0)} to ${usdx(rows[rows.length - 1].lua ?? 0)}. The Charlotte family shows the effect. Wages of ${usd(3800)} minus the earned income deduction (${usd(ex.deductions.earned)}) and the standard deduction for five (${usd(ex.deductions.standard)}) leave ${usd(ex.adjusted)}. Rent plus the five-person allowance is ${usd(ex.shelterCosts)}; the excess over half of that adjusted income, ${usd(ex.deductions.shelter)}, is ${ex.shelterCapped ? 'capped' : 'under the cap of ' + usd(P.snap.shelterCap.us)} and fully deducted. Net income: ${usd(ex.net)}. Allotment: ${usd(ex.benefit)}. With a one-person allowance, as in a flat-rate state at that level, the result would be ${usd(exSmall.benefit)}. Applications go through ePASS or a county social services office.</p>
<h2>NC Medicaid after the expansion</h2>
<p>The CMS table lists North Carolina with the expansion group at ${S.medicaid.adultPct}% of poverty, ${adult.effectivePct}% with the disregard, while its own parent standard is a dollar amount equal to ${S.medicaid.parent}%. For the Charlotte parents, ${usd(3800)} a month is ${Math.round(par.pctIncome)}% of the guideline for five, so they ${par.eligible ? 'qualify through the adult group' : 'are above the adult group and shop on HealthCare.gov'}. Children are covered by NC Medicaid up to ${kid.effectivePct}% at every age, with no separate CHIP in the table. Pregnant women qualify up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for two. Expansion adults face federal work rules from ${h.day(P.medicaid.workRequirement.start)}, described in ${h.a('medicaid-work-requirements', 'Medicaid work requirements')}.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>The Triangle above Charlotte</h2>
<p>Wake, Johnston and Franklin counties, the Raleigh area, have North Carolina's highest very low income limit for four, ${usd(wake.vli)}. Durham County is close at ${usd(dur.vli)}, while Mecklenburg County, the largest city's county, stands lower at ${usd(meck.vli)}. Buncombe County around Asheville is at ${usd(bun.vli)}, Guilford County at ${usd(gui.vli)} and the lowest counties, Alleghany among them, at ${usd(S.hud.vli4Min)}. For the Charlotte family of five, the very low income line is ${usd(meck5.vli)} a year and their ${usd(3800 * 12)} ${3800 * 12 <= meck5.vli ? 'fits under it' : 'is above it'}. If a voucher came through, HUD's formula would set their share of rent at ${usd(rent.ttp)} a month: 30% of income after the ${usd(P.hud.dependentDeduction)} deduction for each of the three children, ${usd(rent.deductions.dependents)} in all. The ${h.a('section-8-rent', 'Section 8 rent guide')} explains the rest of the formula. Neighbors ${h.a('state:south-carolina', 'South Carolina')} and ${h.a('state:tennessee', 'Tennessee')} have not expanded Medicaid; ${h.a('state:virginia', 'Virginia')} has.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in North Carolina for a family of 5?', a: `${usd(snapGrossState('north-carolina', 5))} of gross monthly income in fiscal year ${P.snap.fy}, ${b.grossPct}% of the poverty guideline. North Carolina's Food and Nutrition Services program uses broad-based categorical eligibility, so savings are not counted. For five people the allowance for heating or cooling is ${usdx(s5)} a month, which raises the shelter deduction and therefore the benefit.` },
    { q: 'What is FNS in North Carolina?', a: `Food and Nutrition Services is North Carolina's name for SNAP, run by the Department of Health and Human Services and county social services offices. Rules and amounts are federal, with state options: a gross income limit of ${b.grossPct}% of poverty and a heating allowance by household size, from ${usdx(s1)} for one person to ${usdx(s5)} for five or more, in the USDA table.` },
    { q: 'What is the income limit for NC Medicaid for a single adult?', a: `About ${usd(adult.monthly ?? 0)} a month in 2026, which is ${adult.effectivePct}% of the poverty guideline including the 5% disregard, under the ACA expansion shown in the CMS table for North Carolina. Parents use the same line. Above it, HealthCare.gov plans come with the premium tax credit, starting at 100% of the 2025 guideline.` },
    { q: 'What is the Section 8 income limit in Charlotte, North Carolina?', a: `Mecklenburg County, which includes Charlotte, has a fiscal year 2026 very low income limit of ${usd(meck.vli)} for a family of four and ${usd(hudOf('north-carolina', 'Mecklenburg County', 1).vli)} for one person, with an extremely low limit of ${usd(meck.eli)} for four. Raleigh's Wake County is higher at ${usd(wake.vli)}, the top in North Carolina.` },
  ],
  related: ['state:south-carolina', 'state:virginia', 'state:tennessee', 'state:georgia', 'snap-deductions', 'medicaid-work-requirements'],
});
