import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('washington');
const g = S.snap.bbce[0].grossPct;
const hc = sua('washington', 1) ?? 0;
const kid = medLimit('washington', 'child6to18', 4);
const adult = medLimit('washington', 'adult', 1);
const preg = medLimit('washington', 'pregnant', 2);
// A Spokane couple, one working: $3,100 of wages, $1,400 rent, gas heat, $400 of daycare for their toddler.
const ex = snapCalc('washington', { size: 3, earned: 3100, housing: 1400, dependentCare: 400 });
const noCare = snapCalc('washington', { size: 3, earned: 3100, housing: 1400 });
const king = hudOf('washington', 'King County', 4);
const spok = hudOf('washington', 'Spokane County', 4);
const yak = hudOf('washington', 'Yakima County', 4);

export default defineStatePage({
  slug: 'washington',
  title: 'Washington Basic Food and Apple Health Limits 2026 Explained',
  description: `Washington State 2026: Basic Food (SNAP) gross limit ${usd(snapGrossState('washington', 3))} a month for 3, Apple Health adults to ${adult.effectivePct}% and children to ${kid.effectivePct}%, plus King County HUD limits.`,
  intro: 'Washington names SNAP Basic Food and Medicaid Apple Health, and its children\'s coverage reaches more than three times the poverty line.',
  resume: `Washington's SNAP program is called Basic Food and is run by the ${S.snap.agency ?? 'Department of Social and Health Services'}. It tests gross income at ${g}% of the poverty guideline, ${usd(snapGrossState('washington', 3))} a month for three people in fiscal year ${P.snap.fy}, with no asset test, and uses a heating and cooling allowance of ${usdx(hc)}. In Spokane, a family of three living on one paycheck of ${usd(3100)}, with ${usd(1400)} of rent and ${usd(400)} of daycare, would receive about ${usd(ex.benefit)} a month; without the daycare deduction the figure would be ${usd(noCare.benefit)}. Medicaid goes by Apple Health: adults qualify up to ${adult.effectivePct}% of poverty, pregnant women up to ${preg.effectivePct}% and children up to ${kid.effectivePct}%, about ${usd(kid.monthly ?? 0)} a month for a family of four. Above Medicaid, Washington Healthplanfinder sells 2026 plans with federal premium tax credits.`,
  body: (h) => `<h2>Child care is a full deduction in Basic Food</h2>
<p>Dependent care that lets a parent work, look for work or attend training comes off income dollar for dollar, with no cap, before the shelter deduction is computed (${h.src('cfr2739', '7 CFR 273.9')}). That double effect is easy to miss. For the Spokane family, ${usd(400)} of daycare lowers adjusted income from ${usd(noCare.adjusted)} to ${usd(ex.adjusted)}; because half of a smaller income is subtracted from shelter costs, the shelter deduction grows from ${usd(noCare.deductions.shelter)} to ${usd(ex.deductions.shelter)}. Net income ends at ${usd(ex.net)} instead of ${usd(noCare.net)}, and the benefit rises by ${usd(ex.benefit - noCare.benefit)} a month. Keep receipts or a statement from the provider: the agency asks for them.</p>
<h2>Apple Health lines for each age</h2>
<p>CMS lists Washington children in Medicaid up to ${S.medicaid.child6to18}% of the poverty guideline at every age and in a separate CHIP up to ${S.medicaid.chip}%, which is ${kid.effectivePct}% with the disregard. For a family of four, that means the children keep Apple Health up to about ${usd(kid.monthly ?? 0)} a month of household income. Pregnant women qualify up to ${usd(preg.monthly ?? 0)} a month for a household of two, and adults 19 to 64 up to ${usd(adult.monthly ?? 0)} for one person, under the ACA expansion. Washington runs its own marketplace, Washington Healthplanfinder, where people above those lines buy coverage; the ${h.a('aca-subsidy-calculator', 'ACA subsidy calculator')} applies the 2026 federal table.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Seattle and the rest of the state</h2>
<p>HUD's FY 2026 file gives King County, which includes Seattle, a very low income limit of ${usd(king.vli)} for a family of four, the same as Snohomish County. Spokane County is at ${usd(spok.vli)}, Yakima County at ${usd(yak.vli)}, and the lowest county in the state at ${usd(S.hud.vli4Min)}. A Seattle family of four earning ${usd(75000)} a year is still very low income by HUD's standard and can join a voucher waiting list; the same income would be above the limit in Spokane. The lookup below covers all ${S.hud.rows} counties.</p>
<p>For comparison, ${h.a('state:oregon', 'Oregon')} uses the same ${g}% SNAP test, and ${h.a('state:idaho', 'Idaho')} keeps an asset limit under its broad-based rule. ${h.a('snap-deductions', 'SNAP deductions')} explains each line of the Basic Food budget.</p>`,
  faqs: [
    { q: 'What is the income limit for Basic Food in Washington State?', a: `For fiscal year ${P.snap.fy}, Washington tests gross monthly income at ${g}% of the poverty guideline: ${usd(snapGrossState('washington', 1))} for one person, ${usd(snapGrossState('washington', 3))} for three and ${usd(snapGrossState('washington', 4))} for four, with no asset test. Basic Food is Washington's name for SNAP, so the federal benefit formula and maximum amounts apply.` },
    { q: "How much can a family of 4 earn for children's Apple Health in Washington?", a: `Up to about ${usd(kid.monthly ?? 0)} a month in 2026, which is ${kid.effectivePct}% of the poverty guideline including the 5% disregard. Below the Medicaid line the children are on Medicaid, above it on the state's CHIP, both under the Apple Health name. Income is counted with MAGI rules, as on a tax return.` },
    { q: 'What is the Section 8 income limit in Seattle, Washington?', a: `In King County, which includes Seattle, the FY 2026 very low income limit is ${usd(king.vli)} a year for a family of four and ${usd(hudOf('washington', 'King County', 1).vli)} for one person; the extremely low income limit for four is ${usd(king.eli)}. Housing authorities use these limits for vouchers and public housing from May 1, 2026.` },
  ],
  related: ['state:oregon', 'state:idaho', 'snap-deductions', 'medicaid-income-limits', 'aca-subsidy-calculator', 'section-8-income-limits'],
});
