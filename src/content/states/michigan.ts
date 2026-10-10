import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, eitcCalc, sua, hudOf, fplAt, usd, usdx } from '../../lib/kit';

const S = sd('michigan');
const b = S.snap.bbce[0];
const adult = medLimit('michigan', 'adult', 1);
const kid5 = medLimit('michigan', 'child6to18', 5);
const preg = medLimit('michigan', 'pregnant', 2);
// Two parents and three children in Grand Rapids (Kent County): $3,900 of wages, $1,300 rent, $300 of after-school care.
const ex = snapCalc('michigan', { size: 5, earned: 3900, housing: 1300, dependentCare: 300 });
const exNoCare = snapCalc('michigan', { size: 5, earned: 3900, housing: 1300 });
const par = medCheck('michigan', 'parent', 5, 3900);
const kidc = medCheck('michigan', 'child6to18', 5, 3900);
const tax = eitcCalc(3, 3900 * 12, true);
const wash = hudOf('michigan', 'Washtenaw County', 4);
const wayne = hudOf('michigan', 'Wayne County', 4);
const kent = hudOf('michigan', 'Kent County', 4);
const ingham = hudOf('michigan', 'Ingham County', 4);
const michild = S.notes.find((x) => x.startsWith('MIChild'));

export default defineStatePage({
  slug: 'michigan',
  title: 'Michigan Food Assistance and Medicaid 2026 for Families',
  description: `Michigan benefits 2026: Food Assistance gross limit ${usd(snapGrossState('michigan', 5))} a month for 5, a ${usdx(sua('michigan', 5) ?? 0)} heat allowance, children covered to ${kid5.effectivePct}% of poverty, adults to ${usd(adult.monthly ?? 0)}.`,
  intro: 'Michigan calls SNAP the Food Assistance Program, has folded its old children\'s program into Medicaid and runs everything through MI Bridges.',
  resume: `Michigan's Food Assistance Program, the state's name for SNAP, lets a family of five earn up to ${usd(snapGrossState('michigan', 5))} a month in gross income in fiscal year ${P.snap.fy}, because the state applies broad-based categorical eligibility at ${b.grossPct}% of poverty and does not test assets. Two parents in Grand Rapids with three children, ${usd(3900)} of wages, ${usd(1300)} in rent and ${usd(300)} a month of after-school care would receive about ${usd(ex.benefit)} a month, using Michigan's heating allowance of ${usdx(sua('michigan', 5) ?? 0)}; the child care bill alone is worth ${usd(ex.benefit - exNoCare.benefit)} of that. Michigan expanded Medicaid, so adults qualify up to ${usd(adult.monthly ?? 0)} a month for one person, and children are covered by Medicaid up to ${kid5.effectivePct}% of poverty, ${usd(kid5.monthly ?? 0)} a month for a family of five. Food Assistance applications go through MI Bridges, the portal of the Michigan Department of Health and Human Services.`,
  body: (h) => `<h2>MIChild became Medicaid</h2>
<p>Michigan used to run a separate children's plan called MIChild. The state's page still carries the name, but the Department of Health and Human Services describes it as converting to Medicaid after a change dated January 1, 2024${michild ? ` (${h.ext('https://www.michigan.gov/mdhhs/assistance-programs/healthcare/childrenteens/michild', 'MDHHS MIChild page')})` : ''}. The CMS table accordingly lists no separate CHIP level for Michigan: children up to 19 are on Medicaid up to ${kid5.effectivePct}% of the poverty guideline with the disregard. For the Grand Rapids family, ${usd(3900)} a month is ${Math.round(kidc.pctIncome)}% of poverty, so the three children ${kidc.eligible ? 'are covered' : 'are not covered'}, and the parents, measured against the adult line of ${par.effectivePct}%, ${par.eligible ? 'are covered too' : 'are not, and turn to HealthCare.gov'}. Pregnant women qualify up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for two people.</p>
<h2>Child care costs and the Food Assistance budget</h2>
<p>SNAP subtracts what a family pays for care that lets the parents work, with no ceiling. In the example, wages of ${usd(3900)} lose ${usd(ex.deductions.earned)} to the earned income deduction and ${usd(ex.deductions.standard)} to the standard deduction for five, then the full ${usd(ex.deductions.dependentCare)} of after-school care. Rent plus the heating allowance is ${usd(ex.shelterCosts)}, giving a shelter deduction of ${usd(ex.deductions.shelter)}. Net income ends at ${usd(ex.net)}, and the allotment at ${usd(ex.benefit)} against ${usd(exNoCare.benefit)} without the care bill. Receipts or a provider statement are what the caseworker asks for. Michigan's utility table has a heating figure and a telephone figure (${usdx(S.snap.sua[0].phone ?? 0)}) but no limited allowance for households paying other utilities only (${h.src('fnaSua', 'USDA SUA table')}).</p>
<p>The same parents, filing jointly with ${usd(3900 * 12)} of wages a year, are ${tax.stage === 'phase-out' ? 'in the phase-out range of' : 'entitled to'} the federal earned income credit for three children: about ${usd(tax.credit)} for tax year 2026, against a maximum of ${usd(tax.maxCredit)} that ends at ${usd(tax.completed)} of income. The reduction starts at ${usd(tax.threshold)} for joint filers, so every extra dollar of wages above that line trims the credit, which is worth knowing before a raise or extra shifts. The ${h.a('eitc-calculator', 'EITC calculator')} runs other cases.</p>
${h.mini('fplThreshold', { pct: kid5.effectivePct })}
<h2>Ann Arbor tops Detroit</h2>
<p>Michigan's ${S.hud.rows} counties form ${S.hud.areas} HUD areas. Washtenaw County, home to Ann Arbor, has the state's highest very low income limit for four, ${usd(wash.vli)}, well above Wayne County and Detroit at ${usd(wayne.vli)}. Kent County is at ${usd(kent.vli)}, Ingham County around Lansing at ${usd(ingham.vli)}, and northern counties such as Alcona at ${usd(S.hud.vli4Min)}. A family of four earning ${usd(60000)} would be eligible on income in Ann Arbor and not in Detroit. Neighbors ${h.a('state:ohio', 'Ohio')}, ${h.a('state:indiana', 'Indiana')} and ${h.a('state:wisconsin', 'Wisconsin')} each name their programs differently; the ${h.a('wic-income-guidelines', 'WIC limit')} for three is ${usd(fplAt(3, 185))} a year in Michigan, as in every state outside Alaska and Hawaii.</p>`,
  faqs: [
    { q: 'What is the income limit for food assistance in Michigan for a family of 5?', a: `${usd(snapGrossState('michigan', 5))} of gross monthly income for fiscal year ${P.snap.fy}, ${b.grossPct}% of the poverty guideline under broad-based categorical eligibility. Michigan's Food Assistance Program has no asset test for most households. The benefit is the federal maximum for five people minus 30% of net income, after deductions for earnings, child care, rent and utilities.` },
    { q: 'Is MIChild still available in Michigan?', a: `The name survives on a state page, but the Michigan Department of Health and Human Services describes MIChild as converting to Medicaid after a change dated January 1, 2024. Children up to 19 are covered by Medicaid up to ${kid5.effectivePct}% of the poverty guideline, about ${usd(kid5.monthly ?? 0)} a month for a family of five in 2026, according to CMS levels.` },
    { q: 'Does Michigan count child care costs for food stamps?', a: `Yes. Money a Michigan family pays for child care so that a parent can work, look for work or attend training is deducted in full from income before the benefit is computed. For a Grand Rapids family of five with ${usd(3900)} of wages and ${usd(300)} of care, the deduction raises the monthly benefit from ${usd(exNoCare.benefit)} to ${usd(ex.benefit)}.` },
    { q: 'What is the Section 8 income limit in Detroit, Michigan?', a: `Wayne County, which includes Detroit, has a fiscal year 2026 very low income limit of ${usd(wayne.vli)} for a family of four and ${usd(hudOf('michigan', 'Wayne County', 1).vli)} for one person. The extremely low limit for four is ${usd(wayne.eli)}. Oakland County shares the Detroit metro figures, while Washtenaw County is higher at ${usd(wash.vli)} for four.` },
  ],
  related: ['state:ohio', 'state:indiana', 'state:wisconsin', 'snap-deductions', 'medicaid-income-limits', 'section-8-income-limits'],
});
