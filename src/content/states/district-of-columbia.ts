import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, sua, medLimit, medCheck, acaCalc, hudOf, usd, usdx, day } from '../../lib/kit';

const slug = 'district-of-columbia';
const S = sd(slug);
const g = S.snap.bbce[0].grossPct;
const adult = medLimit(slug, 'adult', 1);
const adultMd = medLimit('maryland', 'adult', 1);
const par = medLimit(slug, 'parent', 3);
const kid = medLimit(slug, 'child6to18', 3);
const preg = medLimit(slug, 'pregnant', 2);
// A single paralegal in Columbia Heights earning $2,600 a month.
const para = medCheck(slug, 'adult', 1, 2600);
const paraMd = medCheck('maryland', 'adult', 1, 2600);
// What the same income would bring on a Marketplace plan with a $500 benchmark premium, if Medicaid did not apply.
const paraAca = acaCalc(2600 * 12, 1, 500);
// A father and his 6-year-old in Anacostia: $2,700 of wages, $1,650 rent.
const ex = snapCalc(slug, { size: 2, earned: 2700, housing: 1650 });
const dc = hudOf(slug, 'District of Columbia', 4);
const src = S.medicaid.update?.sources ?? [];

export default defineStatePage({
  slug,
  title: `District of Columbia Medicaid and SNAP 2026: New ${adult.effectivePct}% Line`,
  description: `DC 2026: Medicaid for adults up to ${usd(adult.monthly ?? 0)} a month (${adult.effectivePct}% of poverty), parents to ${par.effectivePct}%, SNAP gross limit ${usd(snapGrossState(slug, 2))} a month for 2 people, one HUD limit citywide.`,
  intro: 'The District cut its Medicaid lines for adults and parents on January 1, 2026, and as a single HUD area it has one Section 8 limit for every neighborhood.',
  resume: `Since January 1, 2026, the District of Columbia covers adults without children and parents on Medicaid up to ${adult.effectivePct}% of poverty with the disregard, about ${usd(adult.monthly ?? 0)} a month for one person and ${usd(par.monthly ?? 0)} for a parent in a family of three. Until then its adult line was far higher than in any state; adults above the new limit now look to the Marketplace or to District programs. Children and pregnant women keep a high line, ${kid.effectivePct}%, all inside Medicaid itself. Above those lines, DC Health Link sells 2026 Marketplace plans. SNAP, run by the Department of Human Services through District Direct, tests gross income at ${g}% of poverty, ${usd(snapGrossState(slug, 2))} a month for two people in fiscal year ${P.snap.fy}, with no asset limit. A father and his six-year-old in Anacostia, earning ${usd(2700)} with ${usd(1650)} rent, would receive about ${usd(ex.benefit)} a month. For Section 8, HUD treats the whole District as one area: the very low income limit is ${usd(dc.vli)} for a family of four.`,
  body: (h) => `<h2>The January 2026 cut to adult Medicaid</h2>
<p>The CMS table of state levels, dated December 2023, still shows the District covering adults far above the expansion line. That is no longer true. The Department of Health Care Finance now states that adults 21 to 64 without dependent children qualify with household income up to ${adult.effectivePct}% of the poverty guideline, a level it marks as new as of January 1, 2026, and that the parent and caretaker limit decreased the same day (${src[0] ? h.ext(src[0].url, 'DHCF, childless adults') : 'DHCF'}${src[1] ? `, ${h.ext(src[1].url, 'DHCF, parents and caretakers')}` : ''}). DHCF publishes the dollar table itself: ${usd(adult.monthly ?? 0)} a month for one person in 2026 by our computation, the same line as ${h.a('state:maryland', 'Maryland')} and other expansion states. A paralegal in Columbia Heights earning ${usd(2600)} a month is at ${Math.round(para.pctIncome)}% of the 2026 guideline, ${para.eligible ? 'inside Medicaid' : 'above the new line'}; with a ${usd(500)} benchmark premium, the 2026 premium tax credit on DC Health Link would leave a contribution of about ${usd(paraAca.expectedMonthly)} a month. DHCF also runs the DC Healthcare Alliance, a District program for residents with no other insurance who are not eligible for Medicaid or Medicare.</p>
<p>Children up to 19 and pregnant women were not part of the cut: they qualify up to ${kid.effectivePct}% of poverty, which puts a family of three at ${usd(kid.monthly ?? 0)} a month for the children and a pregnant woman counted as two at ${usd(preg.monthly ?? 0)}. No separate CHIP is listed: every child is on Medicaid. The ${h.a('aca-subsidy-calculator', 'subsidy calculator')} covers adults above the new line, who buy through DC Health Link.</p>
${h.mini('fplThreshold', { pct: adult.effectivePct })}
<h2>SNAP in a high-rent city</h2>
<p>District SNAP follows the ${g}% line with no savings test, and its heating and cooling allowance is ${usdx(sua(slug, 2) ?? 0)}, with ${usdx(S.snap.sua[0].electricity)} for a single utility and ${usdx(S.snap.sua[0].phone)} for the telephone (${h.src('fnaSua', 'USDA SUA table')}). For the Anacostia father, ${usd(ex.gross)} of wages less the earnings and standard deductions leaves ${usd(ex.adjusted)}. Rent and utilities total ${usd(ex.shelterCosts)}, so the excess shelter cost is ${usd(ex.excessShelter)}; the federal cap holds the deduction to ${usd(ex.deductions.shelter)}. Net income ${usd(ex.net)}, minus 30% from the ${usd(ex.maxAllotment)} maximum, gives ${usd(ex.benefit)}. Rent above the cap no longer raises the benefit, unless a household member is 60 or older or disabled; ${h.a('snap-deductions', 'SNAP deductions')} explains the cap.</p>
<h2>One limit for the whole District</h2>
<p>HUD's FY 2026 file has a single row for DC, part of the Washington-Arlington-Alexandria metro area. For a family of four, the very low income limit is ${usd(dc.vli)}, the extremely low income limit ${usd(dc.eli)} and the low income limit ${usd(dc.li)}, from Georgetown to Congress Heights alike. Neighbors ${h.a('state:maryland', 'Maryland')} and ${h.a('state:virginia', 'Virginia')} share the metro area but split it by county.</p>`,
  faqs: [
    { q: 'What is the Medicaid income limit in DC for a single adult?', a: `About ${usd(adult.monthly ?? 0)} a month in 2026, which is ${adult.effectivePct}% of the poverty guideline with the 5% disregard. The Department of Health Care Finance set that line for adults 21 to 64 without dependent children on January 1, 2026, replacing a much higher one. Income is counted with MAGI rules. Above the line, DC Health Link sells plans with the premium tax credit.` },
    { q: 'What is the SNAP income limit in DC for 2027?', a: `For fiscal year ${P.snap.fy}, the District tests gross monthly income at ${g}% of the poverty guideline: ${usd(snapGrossState(slug, 1))} for one person, ${usd(snapGrossState(slug, 2))} for two and ${usd(snapGrossState(slug, 4))} for four. There is no asset limit. The Department of Human Services then computes the benefit from net income after deductions.` },
    { q: 'What is the Section 8 income limit in Washington DC?', a: `For fiscal year 2026, HUD sets one limit for the whole District: a family of four is very low income up to ${usd(dc.vli)} a year, extremely low income up to ${usd(dc.eli)} and low income up to ${usd(dc.li)}. These limits took effect on ${day(P.hud.effective)}. The District's housing authority keeps the voucher waiting list.` },
  ],
  related: ['state:maryland', 'state:virginia', 'medicaid-income-limits', 'aca-subsidy-calculator', 'snap-deductions', 'section-8-income-limits'],
});
