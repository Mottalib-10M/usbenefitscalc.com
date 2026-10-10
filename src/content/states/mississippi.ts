import { defineStatePage } from '../../lib/page-types';
import { P, STATES, sd, snapCalc, snapGross, snapNet, medLimit, sua, hudOf, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('mississippi');
const row = S.snap.sua[0];
const hc = sua('mississippi', 3) ?? 0;
const lowest = STATES.every((x) => x.slug === 'mississippi' || x.snap.sua.every((r) => r.pending || !r.hcsua || r.hcsua >= hc));
const par3 = medLimit('mississippi', 'parent', 3);
const par4 = medLimit('mississippi', 'parent', 4);
const kid = medLimit('mississippi', 'child6to18', 3);
const kidMed = (S.medicaid.child6to18 ?? 0) + P.medicaid.disregardPct;
const preg = medLimit('mississippi', 'pregnant', 2);
// A grandmother aged 62 raising two grandchildren in Jackson (Hinds County): $1,100 of Social Security, $650 rent, $4,000 saved.
const ex = snapCalc('mississippi', { size: 3, unearned: 1100, elderlyDisabled: true, housing: 650, assets: 4000 });
const exYounger = snapCalc('mississippi', { size: 3, unearned: 1100, housing: 650, assets: 4000 });
const annual = 1100 * 12;
const laf = hudOf('mississippi', 'Lafayette County', 4);
const hinds = hudOf('mississippi', 'Hinds County', 4);
const desoto = hudOf('mississippi', 'DeSoto County', 4);
const harr = hudOf('mississippi', 'Harrison County', 4);

export default defineStatePage({
  slug: 'mississippi',
  title: `Mississippi SNAP and Medicaid 2026: ${usdx(hc)} Utility Allowance`,
  description: `Mississippi 2026: SNAP federal tests (${usd(snapGross(3))} gross for 3), a ${usdx(P.snap.assets.general)} asset limit, a ${usdx(hc)} utility allowance, no Medicaid expansion, parents only to ${usd(par3.monthly ?? 0)}.`,
  intro: 'Mississippi keeps the strict version of nearly everything: federal SNAP tests with an asset limit, the smallest heating allowance in the USDA table and no Medicaid expansion.',
  resume: `Mississippi applies the federal SNAP rules without broad-based categorical eligibility, so a household of three must stay under ${usd(snapGross(3))} of gross income and ${usd(snapNet(3))} of net income a month in fiscal year ${P.snap.fy}, with countable savings under ${usdx(P.snap.assets.general)}, or ${usdx(P.snap.assets.elderlyDisabled)} when someone is 60 or older or disabled. Its heating and cooling allowance, ${usdx(hc)}, is ${lowest ? 'the lowest' : 'one of the lowest'} in the USDA table. A grandmother of 62 raising two grandchildren in Jackson on ${usd(1100)} of Social Security, with ${usd(650)} rent and ${usd(4000)} in the bank, would still receive about ${usd(ex.benefit)} a month because her age raises the asset limit. Mississippi has not expanded Medicaid: a parent or caretaker in a family of three qualifies only below ${usd(par3.monthly ?? 0)} a month, while the children are covered by Medicaid or CHIP up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for three.`,
  body: (h) => `<h2>A ${usdx(hc)} allowance and what it costs households</h2>
<p>Where other states let a household that pays for heating or cooling deduct several hundred dollars a month, and in New England more than a thousand, Mississippi's figure in the USDA table is ${usdx(hc)}, with ${usdx(row.lua ?? 0)} for other utilities and ${usdx(row.phone ?? 0)} for a telephone (${h.src('fnaSua', 'USDA utility allowance table')}). The smaller the allowance, the smaller the shelter deduction and the larger the share of income SNAP assumes a family can spend on food. For the Jackson grandmother, rent plus the allowance is only ${usd(ex.shelterCosts)}, and her shelter deduction ${usd(ex.deductions.shelter)}. She still nets ${usd(ex.benefit)}, because her income is low: net income after deductions is ${usd(ex.net)}, against a net limit of ${usd(snapNet(3))}.</p>
<h2>Savings: the age line matters</h2>
<p>With no categorical eligibility to switch it off, the ${h.src('cfr2739', 'federal resource test')} applies to every Mississippi household. The grandmother is over 60, so her limit is ${usdx(P.snap.assets.elderlyDisabled)} and her ${usd(4000)} passes. If the same household had no member 60 or older or disabled, the limit would be ${usdx(P.snap.assets.general)} and ${exYounger.eligible ? `the estimate would drop to ${usd(exYounger.benefit)}` : 'the household would not qualify at all until its savings fell under it'}. Her household also skips the gross income test for the same reason; a younger caretaker would first have to show gross income under ${usd(snapGross(3))}. Cash, checking and savings accounts count; the home and most retirement accounts do not.</p>
<h2>Medicaid without the expansion</h2>
<p>Mississippi covers parents and caretakers through a dollar standard that CMS converts to ${S.medicaid.parent}% of poverty, ${par3.effectivePct}% with the disregard: ${usd(par3.monthly ?? 0)} a month for three people and ${usd(par4.monthly ?? 0)} for four. The grandmother's ${usd(1100)} is above it. Her own coverage would come from HealthCare.gov, but her household income of ${usd(annual)} a year is under 100% of the 2025 guideline for three, ${usd(fplAt(3, 100, 'us', 2025))}, where the premium tax credit starts: the gap described in ${h.a('medicaid-expansion-states', 'Medicaid expansion states')}. Her grandchildren are covered: Medicaid up to ${kidMed}% for school-age children, then CHIP up to ${kid.effectivePct}% (${h.ext('https://medicaid.ms.gov/programs/childrens-health-insurance-program-chip/', 'Division of Medicaid CHIP page')}). Pregnant women qualify up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for two.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Oxford, the Gulf Coast and the Memphis suburbs</h2>
<p>Among ${S.hud.rows} Mississippi counties, Lafayette County, home to Oxford, has the highest very low income limit for four, ${usd(laf.vli)}. DeSoto County, part of the Memphis metro area, follows at ${usd(desoto.vli)}, Hinds County and Jackson are at ${usd(hinds.vli)}, Harrison County on the coast at ${usd(harr.vli)}, and the lowest counties at ${usd(S.hud.vli4Min)}. Neighbors ${h.a('state:louisiana', 'Louisiana')} and ${h.a('state:arkansas', 'Arkansas')} expanded Medicaid; ${h.a('state:alabama', 'Alabama')} and ${h.a('state:tennessee', 'Tennessee')} did not.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in Mississippi for a family of 3?', a: `${usd(snapGross(3))} of gross income and ${usd(snapNet(3))} of net income a month in fiscal year ${P.snap.fy}, the federal tests at 130% and 100% of poverty. Mississippi does not use broad-based categorical eligibility, so savings must also stay under ${usdx(P.snap.assets.general)}, or ${usdx(P.snap.assets.elderlyDisabled)} with a member 60 or older or disabled. Elderly or disabled households skip the gross test.` },
    { q: 'Did Mississippi expand Medicaid?', a: `No. The CMS table of state eligibility levels shows no expansion group for Mississippi. Parents and caretakers qualify only up to ${par3.effectivePct}% of poverty, about ${usd(par3.monthly ?? 0)} a month for a family of three in 2026, and adults without children have no income-based group. Children are covered up to ${kid.effectivePct}% through Medicaid and CHIP, and pregnant women up to ${preg.effectivePct}%.` },
    { q: 'Is there an asset limit for SNAP in Mississippi?', a: `Yes. Because Mississippi does not use broad-based categorical eligibility, the federal resource limits apply in fiscal year ${P.snap.fy}: ${usdx(P.snap.assets.general)} for most households and ${usdx(P.snap.assets.elderlyDisabled)} when a member is 60 or older or disabled. Bank accounts and cash count, while the home you live in and most retirement savings are excluded under federal rules.` },
    { q: 'What is the Section 8 income limit in Jackson, Mississippi?', a: `Hinds County, which includes Jackson, has a fiscal year 2026 very low income limit of ${usd(hinds.vli)} for a family of four and ${usd(hudOf('mississippi', 'Hinds County', 1).vli)} for one person, and an extremely low limit of ${usd(hinds.eli)} for four. Madison and Rankin counties share the Jackson metro figures. Lafayette County is the highest in the state at ${usd(laf.vli)}.` },
  ],
  related: ['state:louisiana', 'state:alabama', 'state:tennessee', 'state:arkansas', 'medicaid-expansion-states', 'snap-eligibility'],
});
