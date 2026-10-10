import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, snapGross, medLimit, medCheck, sua, hudOf, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('oregon');
const g = S.snap.bbce[0].grossPct;
const hc = sua('oregon', 2) ?? 0;
const kid = medLimit('oregon', 'child6to18', 2);
const kid3 = medLimit('oregon', 'child6to18', 3);
const baby = medLimit('oregon', 'infant', 3);
const preg = medLimit('oregon', 'pregnant', 2);
const adult = medLimit('oregon', 'adult', 1);
const lv = S.medicaid;
// A father and his 15-year-old in Eugene (Lane County): $2,700 of wages, $1,300 rent, electric heat.
const ex = snapCalc('oregon', { size: 2, earned: 2700, housing: 1300 });
const teen = medCheck('oregon', 'child6to18', 2, 2700);
const dad = medCheck('oregon', 'adult', 2, 2700);
const lane = hudOf('oregon', 'Lane County', 4);
const marion = hudOf('oregon', 'Marion County', 4);
const deschutes = hudOf('oregon', 'Deschutes County', 4);
const portland = hudOf('oregon', 'Multnomah County', 4);
const switchNote = S.notes.find((n) => n.includes('ExploreHealthOR'));

export default defineStatePage({
  slug: 'oregon',
  title: `Oregon Health Plan and SNAP 2027: ${usd(snapGrossState('oregon', 2))} for 2 People`,
  description: `Oregon in 2026: SNAP gross limit ${usd(snapGrossState('oregon', 2))} a month for 2 people (${g}%), Oregon Health Plan for adults to ${adult.effectivePct}%, children to ${kid.effectivePct}%, and a new marketplace for 2027.`,
  intro: 'Oregon is switching marketplaces this fall, covers children up to three times the poverty line and tests SNAP income at twice it.',
  resume: `Oregon households can earn up to ${g}% of the poverty guideline and keep SNAP, ${usd(snapGrossState('oregon', 2))} a month for two people and ${usd(snapGrossState('oregon', 4))} for four in fiscal year ${P.snap.fy}, with no limit on savings; the Oregon Department of Human Services runs the program and applications go through the state portal at one.oregon.gov. A father in Eugene raising a teenager on ${usd(2700)} a month, with ${usd(1300)} in rent, would get about ${usd(ex.benefit)}. Health coverage comes from the Oregon Health Plan, run by the Oregon Health Authority: adults qualify up to ${adult.effectivePct}% of poverty (${usd(adult.monthly ?? 0)} a month alone), and children up to ${kid.effectivePct}%, ${usd(kid3.monthly ?? 0)} a month for a family of three. One change matters right now: 2026 plans are sold on HealthCare.gov, but coverage for 2027 is bought on ExploreHealthOR.gov from November 1, 2026.`,
  body: (h) => `<h2>Open enrollment moves to ExploreHealthOR.gov</h2>
<p>${switchNote ? `Oregon is a state-based exchange that has used the federal platform, so residents enrolled through HealthCare.gov for 2026. According to ${h.ext('https://www.healthcare.gov/marketplace-in-your-state/', 'HealthCare.gov')} and the ${h.ext('https://www.cms.gov/cciio/resources/fact-sheets-and-faqs/state-marketplaces', 'CMS list of state marketplaces')}, enrollment for 2027 coverage opens on ExploreHealthOR.gov on November 1, 2026.` : 'Oregon residents enroll through HealthCare.gov for 2026.'} Anyone renewing for 2027 should look for their plan there rather than on HealthCare.gov. The ${h.a('aca-subsidy-calculator', 'premium tax credit')} follows the federal rules on either site, which in 2026 means no help above ${P.aca.maxPct}% of the 2025 poverty guideline. Check the ${h.a('aca-subsidy-cliff', 'subsidy cliff')} if your income is near that line.</p>
<h2>The Eugene household, line by line</h2>
<p>The father earns ${usd(ex.gross)}, comfortably under the ${usd(ex.grossLimit)} line for two; at the federal 130% he would be close to the ${usd(snapGross(2))} ceiling instead. The 20% earnings deduction takes off ${usd(ex.deductions.earned)}, the standard deduction ${usd(ex.deductions.standard)}. Shelter costs are rent plus the Oregon heating and cooling allowance of ${usdx(hc)} from the ${h.src('fnaSua', 'USDA table')}, ${usd(ex.shelterCosts)} in all, and the deduction is what exceeds half of the remaining income: ${usd(ex.deductions.shelter)}. Net income lands at ${usd(ex.net)}, so the benefit is ${usd(ex.benefit)} out of ${usd(ex.maxAllotment)}. A smaller amount than the maximum, but one that arrives every month on the EBT card.</p>
<p>The same paycheck splits the family for health coverage. The teenager ${teen.eligible ? 'is covered' : 'is not covered'}, because children's coverage reaches ${kid.effectivePct}% of poverty, about ${usd(kid.monthly ?? 0)} a month for two. The father, at ${Math.round(dad.pctIncome)}% of poverty, ${dad.eligible ? 'qualifies as well' : `is above the adult line of ${usd(dad.monthly ?? 0)} and needs a marketplace plan`}.</p>
<h2>How children's coverage is stacked</h2>
<p>CMS lists Oregon's Medicaid at ${lv.child0to1}% for babies and ${lv.child6to18}% for older children, with CHIP funding coverage above that up to ${lv.chip}%, all delivered through the Oregon Health Plan. In a family of three, Medicaid itself covers a baby up to ${usd(fplAt(3, lv.child0to1 + P.medicaid.disregardPct) / 12)} a month and a school-age child up to ${usd(fplAt(3, lv.child6to18 + P.medicaid.disregardPct) / 12)}; CHIP funding carries both to ${usd(baby.monthly ?? 0)}. A pregnant woman counted as two qualifies up to ${usd(preg.monthly ?? 0)}. Families apply once; the agency sorts out which funding stream applies.</p>
${h.mini('shelterDeduction')}
<h2>Portland's limits and the coast</h2>
<p>HUD lists ${S.hud.rows} Oregon counties in ${S.hud.areas} areas. The five counties of the Portland metro area share the top very low income limit for four, ${usd(portland.vli)}; Deschutes County, around Bend, follows at ${usd(deschutes.vli)}, Marion County (Salem) at ${usd(marion.vli)} and Lane County (Eugene) at ${usd(lane.vli)}. ${S.hud.vli4MinName} on the south coast is lowest at ${usd(S.hud.vli4Min)}.</p>
<p>${h.a('state:washington', 'Washington')} shares the Portland metro area with Oregon, ${h.a('state:california', 'California')} runs SNAP as CalFresh at the same ${g}% line, and ${h.a('state:idaho', 'Idaho')} stops at 130% with an asset limit.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in Oregon for 2 people?', a: `${usd(snapGrossState('oregon', 2))} a month of gross income in fiscal year ${P.snap.fy}, from October 2026 to September 2027. That is ${g}% of the 2026 poverty guideline, the line Oregon applies to all households through broad-based categorical eligibility. There is no asset test. For one person the limit is ${usd(snapGrossState('oregon', 1))}, for three ${usd(snapGrossState('oregon', 3))}.` },
    { q: 'Where do Oregon residents sign up for health insurance for 2027?', a: 'On ExploreHealthOR.gov, from November 1, 2026, according to HealthCare.gov and the CMS list of state marketplaces. Plans for 2026 were sold on HealthCare.gov, because Oregon ran a state-based exchange on the federal platform. The premium tax credit follows the same federal rules on the new site, so income still has to be between 100% and 400% of the poverty guideline.' },
    { q: 'How much can you make to qualify for the Oregon Health Plan?', a: `An adult aged 19 to 64 qualifies up to ${adult.effectivePct}% of the 2026 poverty guideline, about ${usd(adult.monthly ?? 0)} a month alone or ${usd(medLimit('oregon', 'adult', 2).monthly ?? 0)} for two, according to the CMS levels with the 5% disregard. Children qualify up to ${kid.effectivePct}% and pregnant women up to ${preg.effectivePct}%. The Oregon Health Authority counts income with MAGI rules.` },
  ],
  related: ['state:washington', 'state:california', 'state:idaho', 'aca-subsidy-cliff', 'medicaid-income-limits', 'section-8-income-limits'],
});
