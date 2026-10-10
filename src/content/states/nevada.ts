import { defineStatePage } from '../../lib/page-types';
import { P, STATES, sd, snapCalc, snapGrossState, medLimit, medCheck, acaCalc, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('nevada');
const b = S.snap.bbce[0];
const adult = medLimit('nevada', 'adult', 1);
const kid = medLimit('nevada', 'child6to18', 3);
const kidMed = (S.medicaid.child6to18 ?? 0) + P.medicaid.disregardPct;
const tot = medLimit('nevada', 'child1to5', 3);
const preg = medLimit('nevada', 'pregnant', 2);
// A couple aged 61 and 63 in Las Vegas (Clark County): $2,100 of Social Security and a pension, $1,200 rent with air conditioning, $200 of medical costs.
const ex = snapCalc('nevada', { size: 2, unearned: 2100, elderlyDisabled: true, housing: 1200, medical: 200 });
const couple = medCheck('nevada', 'adult', 2, 2100);
// A self-employed couple in Reno with $70,000 of income and an assumed $1,200 benchmark premium.
const reno = acaCalc(70000, 2, 1200);
const clark = hudOf('nevada', 'Clark County', 4);
const washoe = hudOf('nevada', 'Washoe County', 4);
const carson = hudOf('nevada', 'Carson City', 4);
const elko = hudOf('nevada', 'Elko County', 4);
const ratio = S.hud.vli4Max / S.hud.vli4Min;
const narrowest = STATES.filter((x) => x.slug !== 'nevada' && x.slug !== 'district-of-columbia').every((x) => x.hud.vli4Max / x.hud.vli4Min > ratio);
const rename = S.notes.find((n) => n.startsWith('Former Division'));
const change = S.notes.find((n) => n.includes('January 1, 2027'));

export default defineStatePage({
  slug: 'nevada',
  title: 'Nevada SNAP, Medicaid and Check Up Limits 2026 to 2027',
  description: `Nevada benefits 2026: SNAP gross limit ${usd(snapGrossState('nevada', 2))} a month for 2, Medicaid for adults to ${usd(adult.monthly ?? 0)} a month, Nevada Check Up to ${kid.effectivePct}% of poverty, new agency names.`,
  intro: 'Nevada renamed the offices that run its benefits, moved applications to a new portal and announces Medicaid rule changes for January 2027.',
  resume: `Nevada households of two can receive SNAP with gross income up to ${usd(snapGrossState('nevada', 2))} a month in fiscal year ${P.snap.fy}, under broad-based categorical eligibility at ${b.grossPct}% of poverty, without an asset test. Applications now go through Access Nevada, and the office that decides them is the Division of Social Services, the new name of the former welfare division. A Las Vegas couple aged 61 and 63 living on ${usd(2100)} a month, paying ${usd(1200)} in rent and ${usd(200)} for medical care, would receive about ${usd(ex.benefit)} a month with Nevada's heating and cooling allowance of ${usdx(sua('nevada', 2) ?? 0)}. Nevada expanded Medicaid, so the same couple ${couple.eligible ? 'qualifies for Medicaid' : 'is above the Medicaid line'} until Medicare starts at 65; adults qualify up to ${usd(adult.monthly ?? 0)} a month for one. Nevada Check Up covers children up to ${kid.effectivePct}% of poverty, and Nevada Health Link sells Marketplace plans.`,
  body: (h) => `<h2>New names, new portal</h2>
<p>Older instructions for Nevada send applicants to the Division of Welfare and Supportive Services. That division is now the Division of Social Services within the Nevada Department of Human Services, and its former address redirects to the new site${rename ? ` (${h.ext('https://www.dss.nv.gov/', 'Division of Social Services')})` : ''}. Online applications for SNAP and Medicaid moved to ${h.ext('https://accessnevada.nv.gov/public/landing-page', 'Access Nevada')}. On the health side, the Medicaid website is branded Nevada Health Authority and carries a notice that Medicaid eligibility rules change on January 1, 2027${change ? ` (${h.ext('https://www.nevadamedicaid.nv.gov/', 'Nevada Medicaid site')})` : ''}. The figures on this page are the 2026 levels from the CMS table; check the agency's notice for what changes after that date.</p>
<h2>The Las Vegas couple</h2>
<p>Both spouses are over 60, so federal rules spare them the gross income test and the cap on the shelter deduction. Their ${usd(2100)} loses the standard deduction of ${usd(ex.deductions.standard)} and the medical costs above ${usd(P.snap.medicalThreshold)}, here ${usd(ex.deductions.medical)}. Rent plus the allowance comes to ${usd(ex.shelterCosts)}, and the deduction for the part above half of their adjusted income is ${usd(ex.deductions.shelter)}. Net income: ${usd(ex.net)}. Allotment: ${usd(ex.benefit)}. Cooling counts like heating in SNAP, so an air-conditioning bill qualifies for the allowance, and the couple can document medical spending such as co-pays and prescriptions to raise the deduction. At ${Math.round(couple.pctIncome)}% of poverty for two, they ${couple.eligible ? 'fall under' : 'are above'} the Medicaid expansion line of ${adult.effectivePct}%.</p>
<h2>Nevada Check Up and the children's ladder</h2>
<p>Nevada's Medicaid for children stops lower than in many states: ${tot.effectivePct === kidMed ? `${kidMed}%` : `${(S.medicaid.child1to5 ?? 0) + P.medicaid.disregardPct}% for children under six and ${kidMed}% for older children`}, with the disregard. Nevada Check Up, the state's CHIP, fills the gap up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for a family of three. Pregnant women qualify up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} for two.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Above Medicaid: Nevada Health Link</h2>
<p>Nevada runs its own exchange, Nevada Health Link, listed by CMS as a state-based marketplace for 2026. A self-employed couple in Reno earning ${usd(70000)} is at ${Math.round(reno.fplPct)}% of the 2025 guideline; with a benchmark silver plan assumed at ${usd(1200)} a month they would pay ${usd(reno.expectedMonthly)} and receive a credit of about ${usd(reno.creditMonthly)} a month. Nevada has no state income tax, so the federal ${h.a('eitc-calculator', 'EITC')} is the only one available.</p>
<h2>${narrowest ? 'The narrowest housing spread of any state' : 'A narrow housing spread'}</h2>
<p>HUD's Nevada table has only ${S.hud.rows} entries. Washoe and Storey counties around Reno share the top very low income limit for four, ${usd(washoe.vli)}; Elko County is at ${usd(elko.vli)}, Clark County and Las Vegas at ${usd(clark.vli)}, and the capital, Carson City, at the bottom with ${usd(carson.vli)}. Neighbors ${h.a('state:california', 'California')}, ${h.a('state:arizona', 'Arizona')} and ${h.a('state:utah', 'Utah')} set their SNAP and Medicaid lines differently.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in Nevada for 2 people?', a: `${usd(snapGrossState('nevada', 2))} of gross income a month in fiscal year ${P.snap.fy}, ${b.grossPct}% of the 2026 poverty guideline, with no asset test under Nevada's broad-based categorical eligibility. A couple with a member 60 or older or disabled does not face the gross test at all. Applications go through Access Nevada and are decided by the Division of Social Services.` },
    { q: 'What is the income limit for Nevada Check Up?', a: `Nevada Check Up, the state's CHIP, covers children up to ${kid.effectivePct}% of the poverty guideline including the 5% disregard, about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('nevada', 'child6to18', 4).monthly ?? 0)} for four in 2026. Below the Medicaid line, which is ${kidMed}% for school-age children, the children are on Medicaid instead. Levels come from the CMS table.` },
    { q: 'Is Nevada Medicaid changing in 2027?', a: `The Nevada Medicaid website, branded Nevada Health Authority, announces that Medicaid eligibility rules change on January 1, 2027. In 2026, adults 19 to 64 qualify under the expansion up to ${usd(adult.monthly ?? 0)} a month for one person, ${adult.effectivePct}% of poverty with the disregard. Federal work requirements for expansion adults are also scheduled to start that day.` },
    { q: 'What is the Section 8 income limit in Las Vegas, Nevada?', a: `Clark County, which includes Las Vegas and Henderson, has a fiscal year 2026 very low income limit of ${usd(clark.vli)} for a family of four and ${usd(hudOf('nevada', 'Clark County', 1).vli)} for one person. The extremely low limit for four is ${usd(clark.eli)}. Washoe County around Reno is higher at ${usd(washoe.vli)}, and Carson City lower at ${usd(carson.vli)}.` },
  ],
  related: ['state:california', 'state:arizona', 'state:utah', 'state:oregon', 'aca-subsidy-calculator', 'snap-for-seniors'],
});
