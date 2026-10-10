import { defineStatePage } from '../../lib/page-types';
import { P, STATES, sd, snapCalc, snapGrossState, medLimit, medCheck, wicCheck, sua, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('new-mexico');
const b = S.snap.bbce[0];
const adult = medLimit('new-mexico', 'adult', 1);
const young = medLimit('new-mexico', 'child1to5', 3);
const older = medLimit('new-mexico', 'child6to18', 3);
const preg = medLimit('new-mexico', 'pregnant', 2);
// A mother with a 4-year-old and a 10-year-old in Albuquerque (Bernalillo County): $2,700 of wages, $1,000 rent, gas heat.
const ex = snapCalc('new-mexico', { size: 3, earned: 2700, housing: 1000 });
const mom = medCheck('new-mexico', 'parent', 3, 2700);
// The same family after a better job: $6,000 a month.
const t = medCheck('new-mexico', 'child1to5', 3, 6000);
const k = medCheck('new-mexico', 'child6to18', 3, 6000);
const wic = wicCheck(3, 6000 * 12, 0, t.eligible);
const ratio = S.hud.vli4Max / S.hud.vli4Min;
const widest = STATES.filter((x) => x.slug !== 'new-mexico').every((x) => x.hud.vli4Max / x.hud.vli4Min < ratio);
const la = hudOf('new-mexico', 'Los Alamos County', 4);
const sf = hudOf('new-mexico', 'Santa Fe County', 4);
const bern = hudOf('new-mexico', 'Bernalillo County', 4);
const dona = hudOf('new-mexico', 'Dona Ana County', 4);
const tq = S.notes.find((n) => n.startsWith('Turquoise Care'));

export default defineStatePage({
  slug: 'new-mexico',
  title: 'New Mexico SNAP and Medicaid 2026: Limits by Child Age',
  description: `New Mexico benefits 2026: SNAP gross limit ${usd(snapGrossState('new-mexico', 3))} a month for 3, Medicaid for kids under 6 to ${young.effectivePct}% and older kids to ${older.effectivePct}% of poverty, adults to ${usd(adult.monthly ?? 0)}.`,
  intro: 'New Mexico gives its youngest children a higher Medicaid line than their older siblings and has the widest gap in housing limits of any state.',
  resume: `New Mexico covers children under six in Medicaid up to ${young.effectivePct}% of poverty but children from six to eighteen only up to ${older.effectivePct}%, so in a family of three earning ${usd(6000)} a month the four-year-old ${t.eligible ? 'is covered' : 'is not covered'} while the ten-year-old ${k.eligible ? 'is covered too' : 'is not'}. The state expanded Medicaid for adults, up to ${usd(adult.monthly ?? 0)} a month for one person, and its managed care program is called Turquoise Care. SNAP, run by the same New Mexico Health Care Authority, uses broad-based categorical eligibility at ${b.grossPct}% of poverty: ${usd(snapGrossState('new-mexico', 3))} of gross income a month for three in fiscal year ${P.snap.fy}, with no asset test. An Albuquerque mother of two earning ${usd(2700)} and paying ${usd(1000)} in rent would receive about ${usd(ex.benefit)} a month with the state's heating allowance of ${usdx(sua('new-mexico', 3) ?? 0)}. HUD's voucher lines run from ${usd(S.hud.vli4Min)} to ${usd(S.hud.vli4Max)} for four.`,
  body: (h) => `<h2>A Medicaid line that drops at age six</h2>
<p>The CMS table gives New Mexico ${S.medicaid.child1to5}% of poverty for babies and children up to five and ${S.medicaid.child6to18}% for school-age children, ${young.effectivePct}% and ${older.effectivePct}% with the disregard. There is no separate CHIP in the table, so above the older children's line there is no second program to catch them. For a family of three, the gap is ${usd((young.monthly ?? 0) - (older.monthly ?? 0))} a month: ${usd(young.monthly ?? 0)} for the young child, ${usd(older.monthly ?? 0)} for the sibling. The Albuquerque family shows what it means after a raise to ${usd(6000)}: at ${Math.round(t.pctIncome)}% of poverty the four-year-old ${t.eligible ? 'stays on Medicaid' : 'loses Medicaid'} and the ten-year-old ${k.eligible ? 'stays as well' : 'needs a plan from beWellnm, the state exchange, with the premium tax credit'}. Pregnant women are covered up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for two.</p>
<h2>One agency for food and health</h2>
<p>The New Mexico Health Care Authority runs both SNAP and Medicaid, and applications for either go through YES New Mexico. Medicaid members are enrolled in Turquoise Care, the name of the managed care program since July 1, 2024${tq ? ` (${h.ext('https://www.hca.nm.gov/turquoise-care/', 'HCA Turquoise Care page')})` : ''}. For the Albuquerque mother at ${usd(2700)} a month, the budget runs like this: ${usd(ex.deductions.earned)} off for earnings, ${usd(ex.deductions.standard)} standard deduction, rent and the heating allowance of ${usdx(sua('new-mexico', 3) ?? 0)} producing a shelter deduction of ${usd(ex.deductions.shelter)}, net income of ${usd(ex.net)} and an allotment of ${usd(ex.benefit)}. She herself, at ${Math.round(mom.pctIncome)}% of poverty, ${mom.eligible ? 'qualifies for Medicaid as a parent under the expansion line' : 'is above the adult Medicaid line'}. The ${h.a('snap-calculator', 'SNAP calculator')} reruns the numbers with your own costs.</p>
<p>The high line for young children has a side effect on WIC, which serves children until their fifth birthday. A household enrolled in Medicaid meets the WIC income test automatically, so the Albuquerque family at ${usd(6000 * 12)} a year, well above the WIC limit of ${usd(wic.limit)} for three, ${wic.viaAdjunctive ? 'can still enroll the four-year-old through the Medicaid card' : wic.byIncome ? 'passes on income alone' : 'does not qualify'}. The WIC limit applies until ${day(P.wic.to)}; see ${h.a('wic-income-guidelines', 'WIC income guidelines')}.</p>
${h.mini('fplThreshold', { pct: older.effectivePct })}
<h2>${widest ? 'The widest housing gap of any state' : 'A very wide housing gap'}</h2>
<p>Los Alamos County, home to the national laboratory, has a very low income limit for four of ${usd(la.vli)}, ${ratio.toFixed(1)} times the ${usd(S.hud.vli4Min)} of Catron County and other rural counties. Santa Fe County is at ${usd(sf.vli)}, Bernalillo County and Albuquerque at ${usd(bern.vli)}, Doña Ana County and Las Cruces at ${usd(dona.vli)}. A family of four earning ${usd(60000)} could be eligible in Los Alamos and over the line everywhere else in New Mexico. Neighbors ${h.a('state:texas', 'Texas')} and ${h.a('state:oklahoma', 'Oklahoma')}, ${h.a('state:arizona', 'Arizona')} and ${h.a('state:colorado', 'Colorado')} draw their lines differently.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in New Mexico?', a: `For fiscal year ${P.snap.fy}, New Mexico's gross limit is ${b.grossPct}% of the poverty guideline: ${usd(snapGrossState('new-mexico', 1))} a month for one person, ${usd(snapGrossState('new-mexico', 3))} for three and ${usd(snapGrossState('new-mexico', 4))} for four. There is no asset test under broad-based categorical eligibility. The New Mexico Health Care Authority decides applications filed through YES New Mexico.` },
    { q: 'Up to what age is the higher Medicaid limit for children in New Mexico?', a: `Up to age five. CMS lists New Mexico Medicaid at ${S.medicaid.child1to5}% of poverty for children under six and ${S.medicaid.child6to18}% from six to eighteen, or ${young.effectivePct}% and ${older.effectivePct}% with the disregard. For a family of three in 2026, that is ${usd(young.monthly ?? 0)} a month for a younger child and ${usd(older.monthly ?? 0)} for an older one.` },
    { q: 'What is Turquoise Care in New Mexico?', a: `Turquoise Care is the name of New Mexico's Medicaid managed care program since July 1, 2024, run by the New Mexico Health Care Authority. Eligibility is unchanged: adults 19 to 64 qualify up to ${usd(adult.monthly ?? 0)} a month for one person in 2026, and children up to ${young.effectivePct}% or ${older.effectivePct}% of poverty depending on age.` },
    { q: 'What is the Section 8 income limit in Albuquerque, New Mexico?', a: `Bernalillo County, which includes Albuquerque, has a fiscal year 2026 very low income limit of ${usd(bern.vli)} for a family of four and ${usd(hudOf('new-mexico', 'Bernalillo County', 1).vli)} for one person, with an extremely low limit of ${usd(bern.eli)} for four. Santa Fe County is higher at ${usd(sf.vli)}, and Los Alamos County tops the state at ${usd(la.vli)}.` },
  ],
  related: ['state:texas', 'state:arizona', 'state:colorado', 'state:oklahoma', 'medicaid-income-limits', 'section-8-income-limits'],
});
