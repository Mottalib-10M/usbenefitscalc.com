import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGross, suaRow, medLimit, medCheck, bhpOf, fplAt, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('new-york');
const earnRule = S.snap.bbce.find((x) => x.who === 'earned-income');
const careRule = S.snap.bbce.find((x) => x.who === 'dependent-care');
const lim = (pct: number, n: number) => Math.ceil(Math.round((fplAt(n, pct) / 12) * 100) / 100);
const rest = suaRow('new-york', 3, 'Rest of New York State');
const nyc = suaRow('new-york', 3, 'New York City');
const li = suaRow('new-york', 3, 'Nassau and Suffolk Counties');
const restHc = rest?.hcsua ?? 0;
// Buffalo (Erie County), household of three, $1,050 rent, heat billed to them.
const wage = snapCalc('new-york', { size: 3, earned: 3300, housing: 1050, utilities: restHc });
const noWage = snapCalc('new-york', { size: 3, unearned: 3300, housing: 1050, utilities: restHc });
const care = snapCalc('new-york', { size: 3, earned: 4000, dependentCare: 400, housing: 1050, utilities: restHc });
const adult = medLimit('new-york', 'adult', 1);
const bhp = bhpOf('new-york', 1);
const kid = medLimit('new-york', 'child6to18', 3);
const kidMed = (S.medicaid.child6to18 ?? 0) + P.medicaid.disregardPct;
const preg = medLimit('new-york', 'pregnant', 2);
const clerk = medCheck('new-york', 'adult', 1, 2300);
const man = hudOf('new-york', 'New York County', 4);
const alb = hudOf('new-york', 'Albany County', 4);
const erie = hudOf('new-york', 'Erie County', 4);
const mon = hudOf('new-york', 'Monroe County', 4);

export default defineStatePage({
  slug: 'new-york',
  title: 'New York SNAP and Child Health Plus Limits 2026 Explained',
  description: `New York benefits 2026: SNAP gross limit ${usd(lim(earnRule?.grossPct ?? 130, 3))} a month for 3 with wages, ${usd(snapGross(3))} without, three utility regions, Child Health Plus up to ${kid.effectivePct}% of poverty.`,
  intro: 'New York has a SNAP income limit that depends on where the money comes from, utility allowances that depend on the region, and the highest children\'s coverage line in the country.',
  resume: `New York does not have one SNAP income limit but three. A household with earnings can have gross income up to ${earnRule?.grossPct}% of poverty, ${usd(lim(earnRule?.grossPct ?? 130, 3))} a month for three in fiscal year ${P.snap.fy}; one that pays for child or dependent care goes up to ${careRule?.grossPct}%, ${usd(lim(careRule?.grossPct ?? 130, 3))}; every other household faces the federal ${usd(snapGross(3))}, the 130% test, plus the net income test. In Buffalo, a family of three with ${usd(3300)} of wages and ${usd(1050)} rent would get about ${usd(wage.benefit)} a month, while the same ${usd(3300)} from unemployment benefits ${noWage.eligible ? `would give ${usd(noWage.benefit)}` : 'would not qualify'}. Utility allowances depend on the region, from ${usdx(restHc)} upstate to ${usdx(nyc?.hcsua ?? 0)} in New York City. Child Health Plus covers children up to ${kid.effectivePct}% of poverty, and adults above Medicaid have a Basic Health Program up to ${bhp?.effectivePct}%.`,
  body: (h) => `<h2>Wages, child care, or neither</h2>
<p>The USDA chart lists two categorical eligibility rules for New York, both conferred by the "Helping Hands" brochure the state mails yearly: one for households with earned income, at ${earnRule?.grossPct}% of poverty, and one for households with dependent care costs, at ${careRule?.grossPct}%, neither with an asset limit (${h.src('fnaBbce', 'USDA BBCE chart')}). A household with neither, for example one living on unemployment, child support or a pension, goes through the ${h.src('cfr2739', 'federal tests')} instead. The three Buffalo cases make this concrete. With ${usd(3300)} of wages, gross income is under the ${earnRule?.grossPct}% line and the family receives ${usd(wage.benefit)}. With the same amount in unemployment benefits, it is over the 130% line of ${usd(snapGross(3))} and ${noWage.eligible ? `still gets ${usd(noWage.benefit)}` : 'gets nothing'}. With ${usd(4000)} of wages and ${usd(400)} of child care, the ${careRule?.grossPct}% rule applies and the benefit is ${usd(care.benefit)}. Members 60 or older or disabled skip the gross test in every case.</p>
<h2>Three utility regions</h2>
<p>New York's standard utility allowance for a household that pays for heat is ${usdx(nyc?.hcsua ?? 0)} in New York City, ${usdx(li?.hcsua ?? 0)} in Nassau and Suffolk counties and ${usdx(restHc)} in the rest of the state, according to the USDA table of fiscal year 2026 (${h.src('fnaSua', 'USDA SUA table')}). The limited allowances are ${usdx(nyc?.lua ?? 0)}, ${usdx(li?.lua ?? 0)} and ${usdx(rest?.lua ?? 0)}. The Buffalo examples use the upstate figure; a Bronx household with the same rent would count ${usd((nyc?.hcsua ?? 0) - restHc)} more in shelter costs. Applications go through myBenefits, run by the Office of Temporary and Disability Assistance.</p>
<h2>Child Health Plus and the Basic Health Program</h2>
<p>New York children are on Medicaid up to ${kidMed}% of poverty for school ages and on Child Health Plus above that, up to ${kid.effectivePct}%: ${usd(kid.monthly ?? 0)} a month for a family of three, the highest line in the CMS table. Adults 19 to 64 are on Medicaid up to ${adult.effectivePct}%, ${usd(adult.monthly ?? 0)} a month for one, and from there the CMS table records a Basic Health Program up to ${bhp?.effectivePct}%, ${usd(bhp?.monthly ?? 0)}. A single retail clerk earning ${usd(2300)} is at ${Math.round(clerk.pctIncome)}% of poverty: ${clerk.eligible ? 'on Medicaid' : clerk.bhpEligible ? 'too much for Medicaid but inside the Basic Health Program' : 'above both lines and on the Marketplace'}. NY State of Health, the state exchange, handles all of these. Pregnant women qualify up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for two. ${h.a('state:minnesota', 'Minnesota')} is the other state with a Basic Health Program.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>From the Southern Tier to Manhattan</h2>
<p>The five boroughs, Westchester, Rockland and Putnam share HUD's New York metro area and the state's top very low income limit for four, ${usd(man.vli)}. Albany County is at ${usd(alb.vli)}, Monroe County and Rochester at ${usd(mon.vli)}, Erie County and Buffalo at ${usd(erie.vli)}, and counties such as Allegany and Broome at ${usd(S.hud.vli4Min)}. Neighbors: ${h.a('state:new-jersey', 'New Jersey')}, ${h.a('state:pennsylvania', 'Pennsylvania')}, ${h.a('state:connecticut', 'Connecticut')}.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in New York State?', a: `It depends on the household. In fiscal year ${P.snap.fy}, a household of three with earnings qualifies up to ${usd(lim(earnRule?.grossPct ?? 130, 3))} of gross monthly income (${earnRule?.grossPct}% of poverty), one paying dependent care up to ${usd(lim(careRule?.grossPct ?? 130, 3))} (${careRule?.grossPct}%), and others up to ${usd(snapGross(3))} under the federal 130% test. New York applies no asset limit to the first two groups.` },
    { q: 'What is the income limit for Child Health Plus in New York?', a: `Child Health Plus covers children up to ${kid.effectivePct}% of the poverty guideline with the 5% disregard, about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('new-york', 'child6to18', 4).monthly ?? 0)} for four in 2026, the highest children's line in the CMS table. Below ${kidMed}% for school-age children, they are on Medicaid instead. Apply through NY State of Health.` },
    { q: 'What is the SNAP utility allowance in New York City?', a: `${usdx(nyc?.hcsua ?? 0)} a month for a household that pays for heating or cooling, and ${usdx(nyc?.lua ?? 0)} for one paying other utilities only, according to the USDA table of fiscal year 2026. New York sets separate figures for Nassau and Suffolk counties (${usdx(li?.hcsua ?? 0)}) and for the rest of the state (${usdx(restHc)}). The allowance enters the shelter deduction.` },
    { q: 'What is the Section 8 income limit in New York City?', a: `For fiscal year 2026, the very low income limit in the five boroughs is ${usd(man.vli)} a year for a family of four and ${usd(hudOf('new-york', 'New York County', 1).vli)} for one person, and the extremely low limit for four is ${usd(man.eli)}. Westchester, Rockland and Putnam counties share the figures. Upstate, Erie County's very low limit for four is ${usd(erie.vli)}.` },
  ],
  related: ['state:new-jersey', 'state:pennsylvania', 'state:connecticut', 'state:minnesota', 'snap-income-limits', 'medicaid-income-limits'],
});
