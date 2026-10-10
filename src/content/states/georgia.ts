import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, snapNet, sua, medLimit, medCheck, fplAt, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('georgia');
const g = S.snap.bbce[0].grossPct;
const par = medLimit('georgia', 'parent', 4);
const kid = medLimit('georgia', 'child6to18', 3);
const preg = medLimit('georgia', 'pregnant', 2);
// Two parents and two children in Savannah: $3,400 of wages, $1,150 rent. Then after a $300 raise.
const ex = snapCalc('georgia', { size: 4, earned: 3400, housing: 1150 });
const raise = snapCalc('georgia', { size: 4, earned: 3700, housing: 1150 });
// The same family's parents for Medicaid at $1,500 a month (one parent working part time).
const part = medCheck('georgia', 'parent', 4, 1500);
const fulton = hudOf('georgia', 'Fulton County', 4);
const chatham = hudOf('georgia', 'Chatham County', 4);
const richmond = hudOf('georgia', 'Richmond County', 4);
const bibb = hudOf('georgia', 'Bibb County', 4);

export default defineStatePage({
  slug: 'georgia',
  title: `Georgia SNAP and Medicaid 2026: Pathways, PeachCare, ${g}%`,
  description: `Georgia 2026: SNAP gross limit ${usd(snapGrossState('georgia', 4))} a month for 4 (${g}%), no adult expansion but Pathways, PeachCare for Kids to ${kid.effectivePct}%, and Georgia Access for plans.`,
  intro: 'Georgia did not expand Medicaid, runs its own Pathways program with an activity requirement, left HealthCare.gov for its own exchange, and keeps SNAP at the federal income line.',
  resume: `Georgia sets the SNAP gross income line at ${g}% of poverty, ${usd(snapGrossState('georgia', 4))} a month for four people in fiscal year ${P.snap.fy}, with no asset limit, so the cut-off is sharp: a Savannah family of four earning ${usd(3400)} with ${usd(1150)} rent would receive about ${usd(ex.benefit)} a month, and after a raise to ${usd(3700)} it would receive ${usd(raise.benefit)}. On health, Georgia has not adopted the ACA expansion. Parents qualify for regular Medicaid only below about ${usd(par.monthly ?? 0)} a month for a family of four, ${par.effectivePct}% of poverty. Georgia Pathways to Coverage offers another Medicaid route for adults, tied to a qualifying-activities reporting requirement. Children are covered by Medicaid and PeachCare for Kids up to ${kid.effectivePct}% of poverty, ${usd(kid.monthly ?? 0)} a month for three people. For 2026, Marketplace plans are sold on Georgia Access, the state's own exchange, rather than HealthCare.gov.`,
  body: (h) => `<h2>A ${usd(300)} raise and the ${g}% edge</h2>
<p>Georgia's broad-based categorical eligibility removes the asset test but leaves the gross income line where federal law puts it (${h.src('fnaBbce', 'USDA BBCE chart')}). That makes the line a cliff. The Savannah family's ${usd(ex.gross)} of wages is under ${usd(ex.grossLimit ?? 0)}; after the 20% earnings deduction and the ${usd(ex.deductions.standard)} standard deduction, ${usd(ex.adjusted)} remains, rent plus the ${usdx(sua('georgia', 4) ?? 0)} utility allowance brings a ${usd(ex.deductions.shelter)} shelter deduction, and net income of ${usd(ex.net)} gives ${usd(ex.benefit)} out of the ${usd(ex.maxAllotment)} maximum. When one parent's raise lifts wages to ${usd(raise.gross)}, the household is ${usd(raise.gross - (ex.grossLimit ?? 0))} over the line, and the federal gross test, also at ${g}%, gives no second chance: the estimate drops to ${usd(raise.benefit)}. The family gains ${usd(300)} of pay and loses ${usd(ex.benefit)} of food benefits. In a ${h.a('snap-income-limits', '200% state')} the same raise would only trim the benefit. A household with someone 60 or older or disabled is the exception, because it skips the gross test.</p>
<h2>Pathways to Coverage and the parent line</h2>
<p>Regular Georgia Medicaid covers parents through a dollar standard CMS converts to ${S.medicaid.parent}% of poverty, ${par.effectivePct}% with the disregard (${h.src('cmsLevels', 'CMS levels')}). If one Savannah parent worked part time for ${usd(1500)} a month, the family would be at ${Math.round(part.pctIncome)}% of the guideline: ${part.eligible ? 'covered' : 'too much for parent Medicaid'}. Georgia Pathways to Coverage is the state's alternative for adults, a Medicaid route with a qualifying-activities, work or activity, reporting requirement; its site also has a section on changes under H.R. 1 (${h.ext('https://pathways.georgia.gov/', 'pathways.georgia.gov')}). The agency decides who qualifies. Adults who do not, and earn at least 100% of the 2025 guideline, ${usd(fplAt(4, 100, 'us', 2025))} a year for four, can get the ${h.a('aca-subsidy-calculator', 'premium tax credit')} on Georgia Access, a full state-based exchange for 2026 (${h.ext('https://www.cms.gov/cciio/resources/fact-sheets-and-faqs/state-marketplaces', 'CMS list')}).</p>
<p>Children have a much higher line. Medicaid covers babies to ${S.medicaid.child0to1 + P.medicaid.disregardPct}% and older children to ${S.medicaid.child6to18 + P.medicaid.disregardPct}%, and PeachCare for Kids, the state CHIP, continues to ${kid.effectivePct}%. Pregnant women are covered to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month counted as two.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>One Atlanta limit for ${S.hud.vli4MaxName} and its neighbors</h2>
<p>HUD groups the Atlanta metro counties into one area, so Fulton, DeKalb, Cobb, Gwinnett and ${S.hud.vli4MaxName} share the state's top very low income limit for four, ${usd(fulton.vli)}. Chatham County, around Savannah, is at ${usd(chatham.vli)}, Richmond County, around Augusta, at ${usd(richmond.vli)}, and Bibb County, around Macon, at ${usd(bibb.vli)}, the floor shared with most of rural Georgia. Neighbors ${h.a('state:florida', 'Florida')}, ${h.a('state:alabama', 'Alabama')} and ${h.a('state:south-carolina', 'South Carolina')} also did not expand Medicaid, while ${h.a('state:north-carolina', 'North Carolina')} did.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in Georgia for a family of 4?', a: `${usd(snapGrossState('georgia', 4))} of gross monthly income in fiscal year ${P.snap.fy}, which is ${g}% of the 2026 poverty guideline, the federal level. Georgia has no SNAP asset limit, according to the USDA chart. Households with a member 60 or older or disabled skip the gross test and are measured against the net income limit of ${usd(snapNet(4))} for four.` },
    { q: 'What is Georgia Pathways to Coverage?', a: 'Georgia Pathways to Coverage is a Medicaid route for adults that comes with a qualifying-activities reporting requirement, meaning work or other approved activities, according to the official Pathways site. The site also describes changes under H.R. 1, the 2025 federal law. Georgia has not adopted the ACA expansion, and the state agency decides who qualifies for Pathways.' },
    { q: 'How much can you make for PeachCare for Kids in Georgia?', a: `PeachCare for Kids, Georgia's CHIP, covers children up to ${kid.effectivePct}% of the poverty guideline with the disregard: about ${usd(kid.monthly ?? 0)} a month for a family of three and ${usd(medLimit('georgia', 'child6to18', 4).monthly ?? 0)} for four in 2026. Children below the Medicaid line for their age get Medicaid instead, according to the CMS table.` },
    { q: 'What is the Section 8 income limit in Atlanta, Georgia?', a: `For fiscal year 2026, a family of four in Fulton County, which includes most of Atlanta, is very low income up to ${usd(fulton.vli)} a year and extremely low income up to ${usd(fulton.eli)}. The same limits apply across the Atlanta metro counties. HUD limits took effect on ${day(P.hud.effective)}; each housing authority keeps its own waiting list.` },
  ],
  related: ['state:florida', 'state:alabama', 'state:south-carolina', 'state:north-carolina', 'medicaid-work-requirements', 'snap-income-limits'],
});
