import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, sua, hudOf, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('kentucky');
const b = S.snap.bbce[0];
const adult = medLimit('kentucky', 'adult', 1);
const kid = medLimit('kentucky', 'child6to18', 4);
const pregM = S.medicaid.pregnant ?? 0;
const preg = medLimit('kentucky', 'pregnant', 2);
// A retired couple in Louisville (Jefferson County): $1,900 of Social Security, $850 rent with a heating bill, $120 of medical costs.
const ex = snapCalc('kentucky', { size: 2, unearned: 1900, elderlyDisabled: true, housing: 850, medical: 120 });
const exNoMed = snapCalc('kentucky', { size: 2, unearned: 1900, elderlyDisabled: true, housing: 850 });
const worker = medCheck('kentucky', 'adult', 1, 1700);
const boone = hudOf('kentucky', 'Boone County', 4);
const jeff = hudOf('kentucky', 'Jefferson County', 4);
const fay = hudOf('kentucky', 'Fayette County', 4);
const pike = hudOf('kentucky', 'Pike County', 4);
const kchip = S.notes.find((n) => n.startsWith('KCHIP'));

export default defineStatePage({
  slug: 'kentucky',
  title: 'Kentucky SNAP, KCHIP and Medicaid 2026: One Door at kynect',
  description: `Kentucky benefits 2026: SNAP up to ${usd(snapGrossState('kentucky', 2))} a month for 2 (${b.grossPct}% rule), Medicaid for adults to ${usd(adult.monthly ?? 0)}, KCHIP to ${kid.effectivePct}% of poverty, one application at kynect.`,
  intro: 'Kentucky sends food aid, Medicaid and Marketplace shoppers to the same website, kynect, which makes the state one of the simplest places to apply for everything at once.',
  resume: `A two-person household in Kentucky can receive SNAP with gross income up to ${usd(snapGrossState('kentucky', 2))} a month in fiscal year ${P.snap.fy}, because the state uses broad-based categorical eligibility at ${b.grossPct}% of the poverty guideline and has no asset limit. A retired couple in Louisville living on ${usd(1900)} of Social Security, paying ${usd(850)} in rent and ${usd(120)} a month for prescriptions, would get about ${usd(ex.benefit)} a month, using the Kentucky heating and cooling allowance of ${usdx(sua('kentucky', 2) ?? 0)}. Kentucky took the ACA Medicaid expansion, so any adult aged 19 to 64 with income under ${usd(adult.monthly ?? 0)} a month qualifies, and children are covered by Medicaid or KCHIP up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for a family of four. The same portal, kynect, takes SNAP and Medicaid applications and sells 2026 Marketplace plans.`,
  body: (h) => `<h2>kynect handles all three applications</h2>
<p>Most states split their front doors: one site for food assistance, another for Medicaid, a third for private insurance. Kentucky routes them through kynect. SNAP and Medicaid applications go to ${h.ext(S.snap.applyUrl ?? 'https://kynect.ky.gov/benefits', 'kynect benefits')}, and CMS lists kynect as a state-based exchange for plan year 2026, so a household that earns too much for Medicaid is shown subsidized plans in the same account. Behind the portal sit two separate offices of the ${S.snap.agency?.split(',')[0] ?? 'Cabinet for Health and Family Services'}: the Department for Community Based Services decides SNAP, the Department for Medicaid Services decides coverage.</p>
<h2>A Louisville couple on Social Security</h2>
<p>Because one spouse is over 60, the couple skips the gross income test and pays no attention to the cap on the shelter deduction, which binds only households without an elderly or disabled member. Their ${usd(1900)} a month is reduced by the standard deduction of ${usd(ex.deductions.standard)} and by medical costs above ${usd(P.snap.medicalThreshold)}, here ${usd(ex.deductions.medical)}. Rent plus the heating allowance comes to ${usd(ex.shelterCosts)}, and the part above half of their remaining income, ${usd(ex.deductions.shelter)}, is deducted in full. Net income lands at ${usd(ex.net)} and the allotment at ${usd(ex.benefit)}. Without the pharmacy receipts the figure would be ${usd(exNoMed.benefit)}, which is why keeping copies of medical bills pays off for older Kentuckians. The ${h.a('snap-for-seniors', 'guide to SNAP for seniors')} lists which costs count.</p>
<h2>Coverage for workers, pregnant women and children</h2>
<p>A single cashier in Lexington earning ${usd(1700)} a month sits at ${Math.round(worker.pctIncome)}% of the 2026 guideline, under the expansion line of ${adult.effectivePct}%, so she ${worker.eligible ? 'qualifies for Medicaid' : 'does not qualify'}. Parents are covered through the same adult group. For pregnancy, CMS lists Kentucky Medicaid at ${pregM}% of poverty and a CHIP level of ${S.medicaid.pregnantChip}% above it, which lifts the effective line to ${preg.effectivePct}%: ${usd(preg.monthly ?? 0)} a month for a woman expecting one child. Children up to 19 qualify at ${kid.effectivePct}%, with KCHIP${kchip ? ` (${h.ext('https://kidshealth.ky.gov/Pages/index.aspx', 'Kentucky Children\'s Health Insurance Program')})` : ''} as the children's brand. Medicaid work rules for expansion adults are scheduled to start on ${h.day(P.medicaid.workRequirement.start)}; the ${h.a('medicaid-work-requirements', 'work requirement guide')} explains who is exempt.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Northern Kentucky versus the mountain counties</h2>
<p>Boone, Kenton and Campbell counties belong to the Cincinnati metro area in HUD's file, which gives them the state's highest very low income limit for four, ${usd(boone.vli)}. Louisville's Jefferson County stands at ${usd(jeff.vli)}, Fayette County around Lexington at ${usd(fay.vli)}, and Pike County in the east at ${usd(pike.vli)}, the floor shared by many rural counties. A family of four earning ${usd(40000)} a year would therefore be under the voucher line in Boone County but over it in Pike County. Across the river, ${h.a('state:ohio', 'Ohio')} uses a lower SNAP gross test, while ${h.a('state:tennessee', 'Tennessee')} never expanded Medicaid. Poverty-level income for a household of two in 2026 is ${usd(fplAt(2, 100))} a year.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in Kentucky for a couple?', a: `For two people the gross limit is ${usd(snapGrossState('kentucky', 2))} a month in fiscal year ${P.snap.fy}, which is ${b.grossPct}% of the poverty guideline under Kentucky's broad-based categorical eligibility, with no asset test. If one partner is 60 or older or disabled, the gross test does not apply at all; only net income after deductions decides the amount, as the USDA eligibility chart shows.` },
    { q: 'Where do I apply for Medicaid and SNAP in Kentucky?', a: `Both go through kynect benefits, the state portal used by the Cabinet for Health and Family Services, or a local DCBS office. One application can cover food assistance, Medicaid and KCHIP. If income is above the Medicaid line of ${usd(adult.monthly ?? 0)} a month for a single adult, kynect, which CMS lists as Kentucky's state-based exchange for 2026, shows Marketplace plans with the premium tax credit.` },
    { q: 'How much can a family of 4 make for KCHIP in Kentucky?', a: `Up to about ${usd(kid.monthly ?? 0)} a month in 2026, ${kid.effectivePct}% of the poverty guideline once the 5% disregard is added to the CMS level of ${S.medicaid.child6to18}%. The limit is the same for babies, toddlers and teenagers in Kentucky. Income is counted with MAGI rules, so child support received and SSI are left out of the total.` },
    { q: 'What is the Section 8 income limit in Louisville, Kentucky?', a: `In Jefferson County, HUD's very low income limit for fiscal year 2026 is ${usd(jeff.vli)} a year for a family of four and ${usd(hudOf('kentucky', 'Jefferson County', 1).vli)} for one person; the extremely low limit for four is ${usd(jeff.eli)}. The local housing authority checks income against these lines when a voucher comes up. Northern Kentucky counties in the Cincinnati area have higher limits, up to ${usd(boone.vli)}.` },
  ],
  related: ['state:ohio', 'state:tennessee', 'state:indiana', 'state:west-virginia', 'snap-for-seniors', 'medicaid-work-requirements'],
});
