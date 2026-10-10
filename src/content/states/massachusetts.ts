import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, eitcCalc, sua, hudOf, hudRows, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('massachusetts');
const b = S.snap.bbce[0];
const hc = sua('massachusetts', 1) ?? 0;
const adult = medLimit('massachusetts', 'adult', 1);
const kid = medLimit('massachusetts', 'child6to18', 3);
const baby = medLimit('massachusetts', 'infant', 3);
const preg = medLimit('massachusetts', 'pregnant', 2);
const young = Number(S.medicaid.note?.match(/(\d+)% of the FPL/)?.[1] ?? 0);
// A single home health aide in Worcester: $1,500 of wages, $1,100 rent for a room with heat billed separately.
const ex = snapCalc('massachusetts', { size: 1, earned: 1500, housing: 1100 });
const aide = medCheck('massachusetts', 'adult', 1, 1500);
const credit = eitcCalc(0, 1500 * 12);
const nan = hudOf('massachusetts', 'Nantucket town', 4);
const bos = hudOf('massachusetts', 'Boston city', 4);
const spr = hudOf('massachusetts', 'Springfield city', 4);
const fr = hudOf('massachusetts', 'Fall River city', 4);
const n = hudRows('massachusetts').length;

export default defineStatePage({
  slug: 'massachusetts',
  title: 'Massachusetts SNAP and MassHealth Limits 2026 for One Adult',
  description: `Massachusetts 2026: SNAP up to ${usd(snapGrossState('massachusetts', 1))} a month for one, a ${usdx(hc)} heat allowance, MassHealth to ${usd(adult.monthly ?? 0)} for adults, Nantucket voucher line ${usd(nan.vli)} for four.`,
  intro: 'For single adults Massachusetts is generous on paper and tight in practice: food aid and MassHealth open wide, but rents eat the shelter deduction long before the end of the month.',
  resume: `A single adult in Massachusetts can earn up to ${usd(snapGrossState('massachusetts', 1))} a month and still pass the SNAP income test in fiscal year ${P.snap.fy}, thanks to broad-based categorical eligibility at ${b.grossPct}% of poverty, with no limit on savings. The Department of Transitional Assistance (DTA) runs the program and adds a heating allowance of ${usdx(hc)} a month to rent. A home health aide in Worcester earning ${usd(1500)} and renting a room for ${usd(1100)} would get about ${usd(ex.benefit)} a month: her housing costs are so high that the shelter deduction hits the federal cap of ${usd(P.snap.shelterCap.us)}. On health coverage, MassHealth covers adults 19 to 64 up to ${usd(adult.monthly ?? 0)} a month for one person, so she ${aide.eligible ? 'qualifies' : 'does not qualify'}. Children are covered up to ${kid.effectivePct}% of poverty and young adults of 19 and 20 at a higher line than other adults.`,
  body: (h) => `<h2>When Massachusetts rent outruns the shelter cap</h2>
<p>For a one-person household without an elderly or disabled member, the excess shelter deduction stops at ${usd(P.snap.shelterCap.us)} in fiscal year ${P.snap.fy}, whatever the rent. In Worcester, the aide's room and the heating allowance come to ${usd(ex.shelterCosts)}; half of her adjusted income is ${usd(ex.adjusted / 2)}, so the uncapped excess would be ${usd(ex.excessShelter)}, but only ${usd(ex.deductions.shelter)} counts. Net income ends at ${usd(ex.net)} and the benefit at ${usd(ex.benefit)}, below the one-person maximum. With Massachusetts rents, the cap can weigh more than the income limit on what a single worker receives. A household with a member 60 or older or disabled escapes it entirely, which is why the same rent produces larger benefits for retirees; see ${h.a('snap-deductions', 'SNAP deductions')}.</p>
<h2>MassHealth by age</h2>
<p>MassHealth reads the CMS levels in steps. Medicaid proper covers babies under one up to ${(S.medicaid.child0to1 ?? 0) + P.medicaid.disregardPct}% of poverty and older children up to ${(S.medicaid.child6to18 ?? 0) + P.medicaid.disregardPct}%; the CHIP level of ${S.medicaid.chip}% then lifts every child to ${baby.effectivePct}%, which for a family of three is ${usd(kid.monthly ?? 0)} a month. CMS also notes that Massachusetts covers 19 and 20 year olds up to ${young}% of poverty, roughly ${usd(Math.floor(fplAt(1, young + P.medicaid.disregardPct) / 12))} a month for one person with the disregard, a little above the line of ${adult.effectivePct}% that applies from 21 onward. Parents are covered at the same ${adult.effectivePct}% as other adults, and pregnant women up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for two. Above MassHealth, the Massachusetts Health Connector is the state's 2026 exchange; the ${h.a('aca-subsidy-calculator', 'ACA subsidy calculator')} estimates the federal credit.</p>
<h2>The aide's tax credit</h2>
<p>Food aid and MassHealth are monthly; the federal earned income credit arrives once a year with the tax refund. A worker without children who is between ${P.eitc.childlessAgeMin} and ${P.eitc.childlessAgeMax} can claim it, and on ${usd(1500 * 12)} of annual wages the Worcester aide would get about ${usd(credit.credit)} for tax year 2026, where the childless maximum is ${usd(credit.maxCredit)}. ${credit.stage === 'phase-out' ? 'Her wages are already past the point where that credit starts shrinking, which is why the amount is modest.' : 'At her wage level the credit has not started to shrink yet.'} The ${h.a('eitc-calculator', 'EITC calculator')} covers other incomes and family sizes, and with one qualifying child the maximum would be ${usd(eitcCalc(1, 1500 * 12).maxCredit)}.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>${n} cities and towns, and an island at the top</h2>
<p>HUD lists Massachusetts by municipality. Nantucket holds the state's highest very low income limit for four, ${usd(nan.vli)}, higher even than Boston and Cambridge at ${usd(bos.vli)}. Springfield is at ${usd(spr.vli)}, and Fall River and Attleboro, which HUD attaches to the Providence metro area, share the floor of ${usd(fr.vli)}. Applicants in Bristol County should therefore check their town rather than assume Boston figures. Neighbors: ${h.a('state:new-hampshire', 'New Hampshire')} uses HealthCare.gov, ${h.a('state:rhode-island', 'Rhode Island')} and ${h.a('state:connecticut', 'Connecticut')} run their own exchanges like Massachusetts.</p>`,
  faqs: [
    { q: 'What is the income limit for SNAP in Massachusetts for a single person?', a: `${usd(snapGrossState('massachusetts', 1))} of gross income a month in fiscal year ${P.snap.fy}, ${b.grossPct}% of the poverty guideline, with no asset test under Massachusetts' broad-based categorical eligibility. Passing the limit does not guarantee a large benefit: one person receives at most the federal maximum allotment, reduced by 30% of net income after the earned income, standard and shelter deductions.` },
    { q: 'How much can I make and still get MassHealth in Massachusetts?', a: `A single adult aged 21 to 64 qualifies for MassHealth up to ${usd(adult.monthly ?? 0)} a month in 2026, ${adult.effectivePct}% of the poverty guideline including the 5% disregard. Massachusetts covers 19 and 20 year olds up to ${young}% of poverty plus the disregard, per a CMS note, and children up to ${kid.effectivePct}%. Above those lines, the Massachusetts Health Connector sells plans with the premium tax credit.` },
    { q: 'Why is my SNAP benefit low in Massachusetts when my rent is high?', a: `Because the shelter deduction is capped at ${usd(P.snap.shelterCap.us)} a month in fiscal year ${P.snap.fy} for households without a member 60 or older or disabled. Rent above that level stops raising the benefit. A Worcester worker earning ${usd(1500)} with ${usd(1100)} in rent receives about ${usd(ex.benefit)}. Elderly and disabled households in Massachusetts have no cap on this deduction.` },
    { q: 'What is the Section 8 income limit in Boston, Massachusetts?', a: `In Boston, the fiscal year 2026 very low income limit is ${usd(bos.vli)} a year for a family of four and ${usd(hudOf('massachusetts', 'Boston city', 1).vli)} for one person, and the extremely low limit for four is ${usd(bos.eli)}. Cambridge and the rest of the Boston metro area share those figures. Only Nantucket is higher in Massachusetts, at ${usd(nan.vli)} for four.` },
  ],
  related: ['state:new-hampshire', 'state:rhode-island', 'state:connecticut', 'state:new-york', 'snap-deductions', 'aca-subsidy-calculator'],
});
