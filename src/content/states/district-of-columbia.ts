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
const young = (S.medicaid.note ?? '').match(/(\d+)% of the FPL/)?.[1];

export default defineStatePage({
  slug,
  title: `District of Columbia Medicaid and SNAP 2026: Adults to ${adult.effectivePct}%`,
  description: `DC 2026: Medicaid for adults up to ${usd(adult.monthly ?? 0)} a month (${adult.effectivePct}% of poverty), parents to ${par.effectivePct}%, SNAP gross limit ${usd(snapGrossState(slug, 2))} a month for 2 people, one HUD limit citywide.`,
  intro: 'The District covers adults on Medicaid at more than one and a half times the expansion line, and as a single HUD area it has one Section 8 limit for every neighborhood.',
  resume: `The District of Columbia has the highest Medicaid line for adults in the CMS table: ${adult.effectivePct}% of poverty with the disregard, about ${usd(adult.monthly ?? 0)} a month for one person in 2026, where most expansion states stop at ${adultMd.effectivePct}%. Parents and caretakers qualify to ${par.effectivePct}%, ${usd(par.monthly ?? 0)} a month for a family of three, and children and pregnant women to ${kid.effectivePct}%, all inside Medicaid itself. Above those lines, DC Health Link sells 2026 Marketplace plans. SNAP, run by the Department of Human Services through District Direct, tests gross income at ${g}% of poverty, ${usd(snapGrossState(slug, 2))} a month for two people in fiscal year ${P.snap.fy}, with no asset limit. A father and his six-year-old in Anacostia, earning ${usd(2700)} with ${usd(1650)} rent, would receive about ${usd(ex.benefit)} a month. For Section 8, HUD treats the whole District as one area: the very low income limit is ${usd(dc.vli)} for a family of four.`,
  body: (h) => `<h2>Medicaid at ${adult.effectivePct}% for adults without children</h2>
<p>CMS lists the District's adult group at ${S.medicaid.adultPct}% of the poverty guideline (${h.src('cmsLevels', 'CMS eligibility levels')}), ${adult.effectivePct}% once the 5% disregard is added. A paralegal in Columbia Heights earning ${usd(2600)} a month sits at ${Math.round(para.pctIncome)}% of the 2026 guideline, ${para.eligible ? 'comfortably inside Medicaid' : 'above the line'}. Across the line in Maryland, the same paycheck ${paraMd.eligible ? 'would also qualify' : `is over that state's ${adultMd.effectivePct}% limit`}, and the paralegal would be pricing a plan instead: with a ${usd(500)} benchmark premium, the 2026 premium tax credit would leave a contribution of about ${usd(paraAca.expectedMonthly)} a month. In the District, the paralegal could take a raise of up to ${usd((adult.monthly ?? 0) - 2600)} a month before reaching the adult limit; a second person in the household, a spouse with no income for instance, would lift that limit to ${usd(medLimit(slug, 'adult', 2).monthly ?? 0)}.</p>
<p>The District goes further for young adults. ${young ? `A CMS footnote says it covers people aged 19 and 20 up to ${young}% of poverty.` : 'A CMS footnote adds a separate line for people aged 19 and 20.'} Parents and caretakers are covered to ${par.effectivePct}%, children up to 19 and pregnant women to ${kid.effectivePct}%, which puts a family of three at ${usd(kid.monthly ?? 0)} a month for the children. No separate CHIP is listed: every child in the table is on Medicaid. The ${h.a('aca-subsidy-calculator', 'subsidy calculator')} covers those above all these lines, who buy through DC Health Link.</p>
${h.mini('fplThreshold', { pct: adult.effectivePct })}
<h2>SNAP in a high-rent city</h2>
<p>District SNAP follows the ${g}% line with no savings test, and its heating and cooling allowance is ${usdx(sua(slug, 2) ?? 0)}, with ${usdx(S.snap.sua[0].electricity)} for a single utility and ${usdx(S.snap.sua[0].phone)} for the telephone (${h.src('fnaSua', 'USDA SUA table')}). For the Anacostia father, ${usd(ex.gross)} of wages less the earnings and standard deductions leaves ${usd(ex.adjusted)}. Rent and utilities total ${usd(ex.shelterCosts)}, so the excess shelter cost is ${usd(ex.excessShelter)}; the federal cap holds the deduction to ${usd(ex.deductions.shelter)}. Net income ${usd(ex.net)}, minus 30% from the ${usd(ex.maxAllotment)} maximum, gives ${usd(ex.benefit)}. Rent above the cap no longer raises the benefit, unless a household member is 60 or older or disabled; ${h.a('snap-deductions', 'SNAP deductions')} explains the cap.</p>
<h2>One limit for the whole District</h2>
<p>HUD's FY 2026 file has a single row for DC, part of the Washington-Arlington-Alexandria metro area. For a family of four, the very low income limit is ${usd(dc.vli)}, the extremely low income limit ${usd(dc.eli)} and the low income limit ${usd(dc.li)}, from Georgetown to Congress Heights alike. Neighbors ${h.a('state:maryland', 'Maryland')} and ${h.a('state:virginia', 'Virginia')} share the metro area but split it by county.</p>`,
  faqs: [
    { q: 'What is the Medicaid income limit in DC for a single adult?', a: `About ${usd(adult.monthly ?? 0)} a month in 2026, which is ${adult.effectivePct}% of the poverty guideline with the 5% disregard. The District covers adults well above the usual expansion line of ${adultMd.effectivePct}%, according to the CMS table of state levels. Income is counted with MAGI rules. Above that line, DC Health Link sells plans with the premium tax credit.` },
    { q: 'What is the SNAP income limit in DC for 2027?', a: `For fiscal year ${P.snap.fy}, the District tests gross monthly income at ${g}% of the poverty guideline: ${usd(snapGrossState(slug, 1))} for one person, ${usd(snapGrossState(slug, 2))} for two and ${usd(snapGrossState(slug, 4))} for four. There is no asset limit. The Department of Human Services then computes the benefit from net income after deductions.` },
    { q: 'What is the Section 8 income limit in Washington DC?', a: `For fiscal year 2026, HUD sets one limit for the whole District: a family of four is very low income up to ${usd(dc.vli)} a year, extremely low income up to ${usd(dc.eli)} and low income up to ${usd(dc.li)}. These limits took effect on ${day(P.hud.effective)}. The District's housing authority keeps the voucher waiting list.` },
  ],
  related: ['state:maryland', 'state:virginia', 'medicaid-income-limits', 'aca-subsidy-calculator', 'snap-deductions', 'section-8-income-limits'],
});
