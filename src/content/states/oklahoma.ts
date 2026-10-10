import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, bbceAll, medLimit, medCheck, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('oklahoma');
const g = S.snap.bbce[0].grossPct;
const hc = sua('oklahoma', 5) ?? 0;
const lua = S.snap.sua[0].lua ?? 0;
const kid = medLimit('oklahoma', 'child6to18', 3);
const preg = medLimit('oklahoma', 'pregnant', 3);
const adult = medLimit('oklahoma', 'adult', 1);
// A family of five in Tulsa: one paycheck of $3,400 a month, $1,100 rent, gas heat.
const ex = snapCalc('oklahoma', { size: 5, earned: 3400, housing: 1100 });
const exLua = snapCalc('oklahoma', { size: 5, earned: 3400, housing: 1100, utilities: lua });
// A married couple in Lawton expecting their first baby, $3,900 a month: counted as three for pregnancy coverage.
const mom = medCheck('oklahoma', 'pregnant', 3, 3900);
const dad = medCheck('oklahoma', 'adult', 3, 3900);
const okc = hudOf('oklahoma', 'Oklahoma County', 4);
const tulsa = hudOf('oklahoma', 'Tulsa County', 4);
const exchangeNote = S.notes.find((n) => n.startsWith('Oklahoma became'));
const row = (slug: string): [string, 'us', number | null, number | null, number | null] => [sd(slug).name, 'us', bbceAll(slug)?.grossPct ?? null, medLimit(slug, 'adult', 1).effectivePct, medLimit(slug, 'child6to18', 3).effectivePct];

export default defineStatePage({
  slug: 'oklahoma',
  title: `Oklahoma SoonerCare and SNAP 2026: Limits for a Family of 5`,
  description: `Oklahoma benefits in 2026: SNAP up to ${usd(snapGrossState('oklahoma', 5))} a month for 5 people (${g}% test, no asset limit), SoonerCare for adults to ${adult.effectivePct}% and children to ${kid.effectivePct}% of poverty.`,
  intro: 'SoonerCare covers adults since the expansion, SNAP keeps the federal income line without a savings test, and the marketplace is moving away from the federal platform.',
  resume: `Oklahoma Human Services approves SNAP for households under ${g}% of the poverty guideline, ${usd(snapGrossState('oklahoma', 3))} a month for three and ${usd(snapGrossState('oklahoma', 5))} for five in fiscal year ${P.snap.fy}, and it does not look at savings because every household is covered by broad-based categorical eligibility. A Tulsa family of five living on one ${usd(3400)} paycheck with ${usd(1100)} in rent would receive about ${usd(ex.benefit)} a month, using the state's heating and cooling allowance of ${usdx(hc)}, one of the smaller ones in the USDA table. Health coverage goes through SoonerCare, run by the Oklahoma Health Care Authority: adults qualify up to ${adult.effectivePct}% of poverty under the expansion, ${usd(adult.monthly ?? 0)} a month for one person, while children and pregnant women share a line of ${kid.effectivePct}%. For 2026 Oklahomans still buy private plans on HealthCare.gov.`,
  body: (h) => `<h2>SoonerCare: one line for children and expectant mothers</h2>
<p>The CMS table gives Oklahoma the same ${kid.pct}% for babies, children up to 19 and pregnant women, which becomes ${kid.effectivePct}% with the 5% disregard. That puts a family of three at ${usd(kid.monthly ?? 0)} a month for the children's coverage. Pregnancy is counted generously: the unborn child is part of the household, so a married couple in Lawton expecting their first baby is a family of three. On ${usd(3900)} a month they sit at ${Math.round(mom.pctIncome)}% of poverty. The mother ${mom.eligible ? `is covered by SoonerCare, the limit being ${usd(mom.monthly ?? 0)}` : 'is over the line'}, and her husband ${dad.eligible ? 'qualifies too' : `is not, since the expansion limit for three is ${usd(dad.monthly ?? 0)}`}. He turns to a private plan with the ${h.a('aca-subsidy-calculator', 'premium tax credit')}. CMS also notes a section 1115 demonstration in Oklahoma that covers some additional low-income adults; the Health Care Authority decides who fits it.</p>
${h.mini('stateCompare', { states: [row('oklahoma'), row('texas'), row('kansas'), row('arkansas'), row('missouri')] })}
<h2>A low utility allowance shapes the Oklahoma SNAP budget</h2>
<p>Oklahoma's broad-based rule keeps the federal ${g}% gross test but drops the asset limit and the separate net test for households under that line (${h.src('fnaBbce', 'USDA chart, June 2026')}). The benefit then depends on deductions, and here the state's allowances are modest: ${usdx(hc)} for a household paying heating or cooling, ${usdx(lua)} for other utilities only. For the Tulsa family the arithmetic runs as follows. From ${usd(ex.gross)} of wages, the earned income deduction removes ${usd(ex.deductions.earned)} and the standard deduction for five ${usd(ex.deductions.standard)}. Rent plus the allowance makes ${usd(ex.shelterCosts)} of shelter costs, but only the part above half of the remaining income counts, a deduction of ${usd(ex.deductions.shelter)}. Net income is ${usd(ex.net)}, and 30% of it comes off the ${usd(ex.maxAllotment)} maximum for five, leaving ${usd(ex.benefit)}. If the family's rent included heat and it paid only electricity, the estimate would be ${usd(exLua.benefit)}. The ${h.a('snap-calculator', 'SNAP calculator')} runs the same steps with your figures.</p>
<h2>Marketplace and housing</h2>
<p>${exchangeNote ? `CMS lists Oklahoma as a state-based exchange on the federal platform since May 1, 2026, with a full state exchange planned for plan year 2028 (${h.ext('https://www.cms.gov/cciio/resources/fact-sheets-and-faqs/state-marketplaces', 'CMS state marketplaces')}). Nothing changes for 2026 coverage: enrollment still happens on HealthCare.gov.` : 'For 2026 coverage Oklahomans enroll on HealthCare.gov.'}</p>
<p>HUD limits vary less in Oklahoma than in many states. Canadian, Cleveland, Logan, McClain and Oklahoma counties form the Oklahoma City metro area and share the top very low income limit for four, ${usd(okc.vli)}. Tulsa County follows at ${usd(tulsa.vli)}, and ${S.hud.vli4MinName} has the lowest, ${usd(S.hud.vli4Min)}. The full county list for one to eight people is in the lookup below.</p>`,
  faqs: [
    { q: 'What is the income limit for SoonerCare in Oklahoma?', a: `For adults aged 19 to 64, SoonerCare covers income up to ${adult.effectivePct}% of the 2026 poverty guideline, about ${usd(adult.monthly ?? 0)} a month for one person and ${usd(medLimit('oklahoma', 'adult', 2).monthly ?? 0)} for two. Children and pregnant women qualify up to ${kid.effectivePct}%, ${usd(kid.monthly ?? 0)} a month for a family of three. These are CMS levels with the 5% disregard, counted under MAGI rules.` },
    { q: 'How much food stamps does a family of 5 get in Oklahoma?', a: `The maximum for five people is ${usd(ex.maxAllotment)} a month in fiscal year ${P.snap.fy}, paid when net income is close to zero. Each dollar of net income lowers it by 30 cents. A Tulsa family with ${usd(3400)} of monthly wages and ${usd(1100)} in rent would get about ${usd(ex.benefit)}. Gross income must stay under ${usd(snapGrossState('oklahoma', 5))} a month for five.` },
    { q: 'Does Oklahoma have its own health insurance marketplace in 2026?', a: 'Not yet for enrollment. CMS lists Oklahoma as a state-based exchange using the federal platform from May 1, 2026, and the state is seeking a full exchange for plan year 2028. For 2026 coverage, residents still apply on HealthCare.gov and receive the premium tax credit there, between 100% and 400% of the 2025 poverty guideline.' },
  ],
  related: ['state:texas', 'state:kansas', 'state:arkansas', 'state:missouri', 'aca-subsidy-calculator', 'snap-calculator'],
});
