import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, snapMax, medLimit, sua, hudOf, hudRows, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('maine');
const b = S.snap.bbce[0];
const hc = sua('maine', 1) ?? 0;
const adult = medLimit('maine', 'adult', 1);
const kid = medLimit('maine', 'child6to18', 3);
const preg = medLimit('maine', 'pregnant', 2);
const young = Number(S.medicaid.note?.match(/(\d+)% of the FPL/)?.[1] ?? 0);
const youngMonthly = Math.floor(fplAt(1, young + P.medicaid.disregardPct) / 12);
// A widow living alone in Bangor: $1,450 of Social Security, $700 rent, oil heat, $80 of medical costs.
const ex = snapCalc('maine', { size: 1, unearned: 1450, elderlyDisabled: true, housing: 700, medical: 80 });
const portland = hudOf('maine', 'Portland city', 4);
const bangor = hudOf('maine', 'Bangor city', 4);
const augusta = hudOf('maine', 'Augusta city', 4);
const lewiston = hudOf('maine', 'Lewiston city', 4);
const towns = hudRows('maine').length;

export default defineStatePage({
  slug: 'maine',
  title: `Maine SNAP and MaineCare 2026: ${usdx(hc)} Heat Allowance`,
  description: `Maine benefits 2026: SNAP gross limit ${usd(snapGrossState('maine', 1))} a month for one, a ${usdx(hc)} heating allowance, MaineCare for children to ${kid.effectivePct}% of poverty and adults to ${usd(adult.monthly ?? 0)}.`,
  intro: 'A heating allowance above a thousand dollars, MaineCare up to age 20 at a high income line, and housing limits that change from one town to the next.',
  resume: `Maine's SNAP rules lean heavily on heating costs: any household that pays for heat gets a standard utility allowance of ${usdx(hc)} a month in its shelter deduction, among the highest in the country. Gross income can reach ${usd(snapGrossState('maine', 1))} a month for one person and ${usd(snapGrossState('maine', 3))} for three in fiscal year ${P.snap.fy}, under broad-based categorical eligibility at ${b.grossPct}% of poverty, with no asset test. A widow in Bangor living on ${usd(1450)} of Social Security, renting for ${usd(700)} and heating with oil, ends up with zero countable net income and the full one-person allotment of ${usd(ex.benefit)}. MaineCare, the state's Medicaid, covers adults 19 to 64 under the expansion up to ${usd(adult.monthly ?? 0)} a month for one, children up to ${kid.effectivePct}% of poverty without a separate CHIP, and young adults of 19 and 20 at a higher line than other adults.`,
  body: (h) => `<h2>How a ${usdx(hc)} allowance wipes out net income</h2>
<p>The Bangor widow is 60 or older, so SNAP lets her deduct all shelter costs above half of her adjusted income, with no ceiling. Her ${usd(1450)} drops to ${usd(ex.adjusted)} after the standard deduction of ${usd(ex.deductions.standard)} and the medical deduction of ${usd(ex.deductions.medical)} (costs above ${usd(P.snap.medicalThreshold)}). Rent plus Maine's heating allowance makes ${usd(ex.shelterCosts)}, so the shelter deduction is ${usd(ex.deductions.shelter)}, more than what was left. Net income falls to ${usd(ex.net)}, and 30% of zero is zero: she receives the maximum of ${usd(snapMax(1))}. The same arithmetic helps a working family, but there the excess shelter amount stops at ${usd(P.snap.shelterCap.us)}. The allowance figure comes from the USDA table of fiscal year 2026 (${h.src('fnaSua', 'standard utility allowances')}); fiscal year 2027 values are approved state by state.</p>
<h2>MaineCare for 19 and 20 year olds</h2>
<p>CMS notes that Maine extends its children's level to ages 19 and 20, up to ${young}% of poverty, which works out to about ${usd(youngMonthly)} a month for a single young adult once the 5% disregard is added. Every other adult is measured against the expansion line of ${adult.effectivePct}%, ${usd(adult.monthly ?? 0)} a month, so a 20-year-old waiting tables in Portland can earn more than twice what a 25-year-old can and keep MaineCare. Children under 19 qualify up to ${kid.effectivePct}%, about ${usd(kid.monthly ?? 0)} a month for a family of three, all inside MaineCare. Pregnancy coverage reaches ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for an expectant mother counted as two. Above those lines, CoverME.gov, Maine's own exchange for 2026, sells plans with the ${h.a('aca-subsidy-calculator', 'premium tax credit')}.</p>
<p>MaineCare and SNAP both belong to the Maine Department of Health and Human Services, and one application on My Maine Connection reaches both offices. For a retiree on Social Security, the piece of paper that matters most is proof that the household pays for heat, such as an oil delivery receipt or a utility bill in her name: without it, the budget can fall back to the limited allowance and the allotment shrinks.</p>
${h.mini('fplThreshold', { pct: young + P.medicaid.disregardPct })}
<h2>${towns} towns in HUD's Maine file</h2>
<p>Maine is listed town by town. Portland and the towns of its metro area, from Westbrook to Yarmouth, share the state's highest very low income limit for four, ${usd(portland.vli)}. Bangor is at ${usd(bangor.vli)}, Augusta at ${usd(augusta.vli)} and Lewiston at ${usd(lewiston.vli)}, while the towns of Piscataquis County sit at the bottom with ${usd(S.hud.vli4Min)}. A family earning ${usd(50000)} would clear the line in Portland and miss it in Augusta. For the heating rules in nearby states, see ${h.a('state:new-hampshire', 'New Hampshire')} and ${h.a('state:vermont', 'Vermont')}; seniors will find more on deductions in ${h.a('snap-for-seniors', 'SNAP for seniors')}.</p>`,
  faqs: [
    { q: 'How much food stamps does a senior get in Maine?', a: `It depends on income and housing costs, but many seniors in Maine reach the maximum, ${usd(snapMax(1))} a month for one person in fiscal year ${P.snap.fy}. A household with a member 60 or older can deduct all shelter costs above half of its income, and Maine adds ${usdx(hc)} for heating. A widow with ${usd(1450)} of Social Security and ${usd(700)} rent gets the full amount.` },
    { q: 'What is the income limit for MaineCare for a single person?', a: `An adult aged 21 to 64 qualifies for MaineCare under the Medicaid expansion with income up to ${usd(adult.monthly ?? 0)} a month in 2026, ${adult.effectivePct}% of the poverty guideline with the disregard. Young adults of 19 and 20 have a higher line, about ${usd(youngMonthly)} a month, according to a CMS note. Above that, CoverME.gov plans come with a premium tax credit.` },
    { q: 'What is the SNAP heating allowance in Maine?', a: `Maine's heating and cooling standard utility allowance is ${usdx(hc)} a month in the USDA table for fiscal year 2026, used in place of actual utility bills for any household that pays for heat. A household paying only other utilities gets the limited allowance of ${usdx(S.snap.sua[0].lua ?? 0)}. Both enter the shelter deduction, not the income test.` },
    { q: 'What is the Section 8 income limit in Portland, Maine?', a: `HUD's fiscal year 2026 very low income limit in Portland is ${usd(portland.vli)} for a family of four and ${usd(hudOf('maine', 'Portland city', 1).vli)} for one person; the extremely low limit for four is ${usd(portland.eli)}. The towns of the Portland metro area share those figures, the highest in Maine. In Augusta the very low limit for four is ${usd(augusta.vli)}.` },
  ],
  related: ['state:new-hampshire', 'state:vermont', 'state:massachusetts', 'snap-for-seniors', 'snap-deductions', 'section-8-income-limits'],
});
