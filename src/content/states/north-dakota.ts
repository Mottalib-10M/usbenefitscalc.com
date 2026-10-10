import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, snapNet, medLimit, sua, hudOf, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('north-dakota');
const g = S.snap.bbce[0].grossPct;
const hc = sua('north-dakota', 2) ?? 0;
const lua = S.snap.sua[0].lua ?? 0;
const kid = medLimit('north-dakota', 'child6to18', 3);
const baby = medLimit('north-dakota', 'infant', 3);
const preg = medLimit('north-dakota', 'pregnant', 2);
const adult = medLimit('north-dakota', 'adult', 1);
const couple = medLimit('north-dakota', 'adult', 2);
// A retired couple in Bismarck (Burleigh County): $2,100 of Social Security, $900 rent with heat, $150 of medical bills a month.
const ex = snapCalc('north-dakota', { size: 2, unearned: 2100, elderlyDisabled: true, housing: 900, medical: 150 });
const exNoMed = snapCalc('north-dakota', { size: 2, unearned: 2100, elderlyDisabled: true, housing: 900 });
const dunn = hudOf('north-dakota', 'Dunn County', 4);
const burleigh = hudOf('north-dakota', 'Burleigh County', 4);
const cass = hudOf('north-dakota', 'Cass County', 4);
const williams = hudOf('north-dakota', 'Williams County', 4);

export default defineStatePage({
  slug: 'north-dakota',
  title: `North Dakota SNAP and Medicaid 2026: ${g}% Line, Kids to ${kid.effectivePct}%`,
  description: `North Dakota 2026: SNAP for 2 people up to ${usd(snapGrossState('north-dakota', 2))} a month of gross income, a ${usdx(hc)} heating allowance, Medicaid for adults to ${usd(adult.monthly ?? 0)} and children to ${kid.effectivePct}%.`,
  intro: 'A generous SNAP income line, one Medicaid limit shared by every child and pregnant woman, and housing limits pushed up by the western oil counties.',
  resume: `North Dakota lets households earn up to ${g}% of the poverty guideline before SNAP stops, ${usd(snapGrossState('north-dakota', 2))} a month for two people and ${usd(snapGrossState('north-dakota', 4))} for four in fiscal year ${P.snap.fy}, with no asset limit. North Dakota Health and Human Services runs the program and gives anyone paying for heat a utility allowance of ${usdx(hc)}. A retired couple in Bismarck living on ${usd(2100)} of Social Security, renting for ${usd(900)} and paying ${usd(150)} a month in medical bills would get about ${usd(ex.benefit)}; without the medical costs the figure falls to ${usd(exNoMed.benefit)}. Medicaid follows the ACA expansion: adults qualify up to ${adult.effectivePct}% of poverty, ${usd(adult.monthly ?? 0)} a month alone, while children of every age and pregnant women share a single line of ${kid.effectivePct}%, ${usd(kid.monthly ?? 0)} a month for a family of three.`,
  body: (h) => `<h2>Medical bills turn into food money for older North Dakotans</h2>
<p>SNAP treats a household with someone aged 60 or more, or disabled, differently from everyone else, and the Bismarck couple shows how much that is worth. Their ${usd(2100)} of Social Security is well under the ${g}% line, but what decides the amount is the list of deductions. Out-of-pocket medical spending above ${usd(P.snap.medicalThreshold)} a month is deductible for them (${usd(ex.deductions.medical)} of their ${usd(150)}), and their shelter deduction is not capped at ${usd(P.snap.shelterCap.us)}: it reaches ${usd(ex.deductions.shelter)} once the ${usdx(hc)} heating allowance is added to the rent. Net income ends at ${usd(ex.net)}, far below the ${usd(snapNet(2))} net limit, and the estimate is ${usd(ex.benefit)} a month out of a maximum of ${usd(ex.maxAllotment)}. Leave the medical bills out and it is ${usd(exNoMed.benefit)}. Pharmacy co-pays, Medicare premiums, dental work and mileage to appointments all count, so keeping receipts pays off. The rules are in ${h.a('snap-for-seniors', 'SNAP for seniors')}.</p>
<p>The allowance itself depends on the bills: ${usdx(hc)} with a heating or cooling cost, ${usdx(lua)} for a household that pays only other utilities, according to the ${h.src('fnaSua', 'USDA allowance table')}. In a state with long winters, most renters who pay for heat directly claim the larger figure.</p>
${h.mini('seniorSnap', { utilities: hc })}
<h2>One Medicaid line for children and pregnancy</h2>
<p>Many states use a ladder: a high line for babies, a lower one for school-age kids, CHIP on top. In the CMS table North Dakota shows the same ${kid.pct}% for babies under one, for children 1 to 18 and for pregnant women, ${kid.effectivePct}% with the 5% disregard. For a family of three that is ${usd(baby.monthly ?? 0)} a month whatever the children's ages, and a pregnant woman counted as two qualifies up to ${usd(preg.monthly ?? 0)}. Parents and other adults fall under the expansion group: ${usd(couple.monthly ?? 0)} a month for a couple without children. Above that, adults shop on HealthCare.gov, where the ${h.a('aca-subsidy-calculator', '2026 premium tax credit')} starts at ${usd(fplAt(1, 100, 'us', 2025))} a year for one person and ends at ${P.aca.maxPct}% of the 2025 guideline.</p>
<h2>Oil country sets the housing ceiling</h2>
<p>North Dakota has ${S.hud.rows} counties in the HUD file, ${S.hud.areas} of them treated as separate areas. The highest very low income limit for four, ${usd(dunn.vli)}, belongs to ${S.hud.vli4MaxName} in the western oil region; ${S.hud.vli4MinName} has the lowest at ${usd(S.hud.vli4Min)}. The cities sit close together: ${usd(cass.vli)} in Cass County (Fargo), ${usd(burleigh.vli)} in Burleigh County (Bismarck) and ${usd(williams.vli)} in Williams County (Williston). Each housing authority keeps its own waiting list.</p>
<p>Across the borders, ${h.a('state:south-dakota', 'South Dakota')} still applies the federal SNAP asset test, ${h.a('state:minnesota', 'Minnesota')} adds a Basic Health Program above Medicaid, and ${h.a('state:montana', 'Montana')} uses the same ${g}% SNAP line.</p>`,
  faqs: [
    { q: 'What is the SNAP income limit in North Dakota for 2 people?', a: `${usd(snapGrossState('north-dakota', 2))} a month of gross income in fiscal year ${P.snap.fy}, which is ${g}% of the 2026 poverty guideline. North Dakota has no asset limit for SNAP. A couple where one partner is 60 or older or disabled is judged on net income instead, after deductions for medical costs and an uncapped shelter deduction, so retirees with higher pensions can still qualify.` },
    { q: 'How much can a family make for Medicaid in North Dakota?', a: `Children of any age qualify up to ${kid.effectivePct}% of the 2026 poverty guideline with the disregard, about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('north-dakota', 'child6to18', 4).monthly ?? 0)} for four. Parents qualify through the expansion group up to ${adult.effectivePct}%, ${usd(medLimit('north-dakota', 'parent', 3).monthly ?? 0)} a month for three. These are the CMS levels applied by North Dakota Health and Human Services.` },
    { q: 'What is the Section 8 income limit in Fargo, North Dakota?', a: `Fargo is in Cass County, where HUD set the fiscal year 2026 very low income limit for a family of four at ${usd(cass.vli)} a year and the extremely low income limit at ${usd(cass.eli)}. Housing authorities must give ${P.hud.elisShareOfNewVouchers}% of new vouchers to extremely low income families. In Burleigh County, around Bismarck, the very low income limit for four is ${usd(burleigh.vli)}.` },
  ],
  related: ['state:south-dakota', 'state:minnesota', 'state:montana', 'snap-for-seniors', 'medicaid-income-limits', 'section-8-income-limits'],
});
