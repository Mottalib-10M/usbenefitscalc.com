import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, sua, hudOf, hudRows, usd, usdx } from '../../lib/kit';

const S = sd('rhode-island');
const g = S.snap.bbce[0].grossPct;
const hc = sua('rhode-island', 3) ?? 0;
const phone = S.snap.sua[0].phone ?? 0;
const lv = S.medicaid;
const kid = medLimit('rhode-island', 'child6to18', 3);
const preg = medLimit('rhode-island', 'pregnant', 2);
const adult = medLimit('rhode-island', 'adult', 1);
// A mother and two children in Pawtucket: $2,900 of wages, $1,350 rent, a gas heating bill.
const ex = snapCalc('rhode-island', { size: 3, earned: 2900, housing: 1350 });
const exPhone = snapCalc('rhode-island', { size: 3, earned: 2900, housing: 1350, utilities: phone });
// Same mother at $4,000 a month.
const kids = medCheck('rhode-island', 'child6to18', 3, 4000);
const mom = medCheck('rhode-island', 'adult', 3, 4000);
const pvd = hudOf('rhode-island', 'Providence city', 4);
const newport = hudOf('rhode-island', 'Newport city', 4);
const westerly = hudOf('rhode-island', 'Westerly town', 4);
const towns = hudRows('rhode-island').length;

export default defineStatePage({
  slug: 'rhode-island',
  title: `Rhode Island RIte Care and SNAP 2026: Kids Covered to ${kid.effectivePct}%`,
  description: `Rhode Island 2026: RIte Care and Medicaid for children up to ${kid.effectivePct}% of poverty, SNAP gross limit ${usd(snapGrossState('rhode-island', 3))} a month for 3 (${g}%), and a heating allowance of ${usdx(hc)}.`,
  intro: `A SNAP line at ${g}% of poverty, a utility allowance with no middle tier, RIte Care for families, and only ${S.hud.areas} HUD areas for ${towns} cities and towns.`,
  resume: `Rhode Island sets its SNAP gross income test at ${g}% of the poverty guideline, between the federal 130% and the 200% most states use: ${usd(snapGrossState('rhode-island', 3))} a month for a household of three and ${usd(snapGrossState('rhode-island', 4))} for four in fiscal year ${P.snap.fy}, with no asset limit. The Rhode Island Department of Human Services runs the program. Its utility allowance has only two levels, ${usdx(hc)} for a household paying heat or air conditioning and ${usdx(phone)} for a phone alone, so the heating bill weighs heavily. A Pawtucket mother of two earning ${usd(2900)} with ${usd(1350)} rent and a gas bill would get about ${usd(ex.benefit)} a month; if her only utility were a phone, ${usd(exPhone.benefit)}. Health coverage is broad: the state took the Medicaid expansion (${adult.effectivePct}% of poverty for adults), children qualify through Medicaid and RIte Care up to ${kid.effectivePct}%, and HealthSource RI sells private plans.`,
  body: (h) => `<h2>No limited allowance: heat or nothing but the phone</h2>
<p>In most states the USDA table gives three utility figures: a large one for heating or cooling, a middle one for households that pay other utilities such as electricity or water, and a small one for the telephone. Rhode Island's row in the ${h.src('fnaSua', 'fiscal year 2026 table')} has the first and the last, ${usdx(hc)} and ${usdx(phone)}, and no middle tier. For the Pawtucket household that gap is worth ${usd(ex.benefit - exPhone.benefit)} a month. With the heating allowance, shelter costs reach ${usd(ex.shelterCosts)} and the excess over half of her adjusted income is ${ex.shelterCapped ? `capped at ${usd(P.snap.shelterCap.us)}` : usd(ex.deductions.shelter)}; net income falls to ${usd(ex.net)} and the benefit is ${usd(ex.benefit)} of a ${usd(ex.maxAllotment)} maximum. With only a phone bill, the shelter deduction shrinks to ${usd(exPhone.deductions.shelter)} and the estimate to ${usd(exPhone.benefit)}. A tenant whose heat is included in the rent should ask the agency how a separate air conditioning or heating cost is treated.</p>
<p>The income test itself is rarely the obstacle at ${g}%: her ${usd(ex.gross)} is far below the ${usd(ex.grossLimit)} line. Households that pass it skip the net income test and the asset test under the state's broad-based rule (${h.src('fnaBbce', 'USDA chart')}).</p>
<h2>RIte Care and Medicaid for Rhode Island families</h2>
<p>Children in Rhode Island qualify for Medicaid up to ${lv.child6to18}% of poverty at every age, ${kid.effectivePct}% with the disregard, which is ${usd(kid.monthly ?? 0)} a month for a family of three. RIte Care is the name under which the state delivers this coverage to children and families, as described on the ${h.ext('https://eohhs.ri.gov/consumer/families-children/health-care-programs', 'EOHHS health care programs page')}. Pregnancy has two layers: Medicaid up to ${lv.pregnant}% and CHIP-funded coverage up to ${lv.pregnantChip}%, so a pregnant woman counted as two qualifies up to ${usd(preg.monthly ?? 0)} a month.</p>
<p>Raise the Pawtucket mother's pay to ${usd(4000)} and the household is at ${Math.round(kids.pctIncome)}% of poverty. Her children ${kids.eligible ? 'keep their coverage' : 'lose it'}; she ${mom.eligible ? 'keeps hers as well' : `moves off Medicaid, the adult limit for three being ${usd(mom.monthly ?? 0)}`}. She would shop on HealthSource RI, listed by CMS as a state-based exchange for 2026, with the ${h.a('aca-subsidy-calculator', 'premium tax credit')} measured on the 2025 guideline.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>${towns} cities and towns, three HUD areas</h2>
<p>Rhode Island appears in the HUD file by municipality, ${towns} of them, but only ${S.hud.areas} areas set the figures. Towns of the Newport area, Middletown and Newport city among them, have the highest very low income limit for four, ${usd(newport.vli)}. Westerly, Hopkinton and New Shoreham, on Block Island, are at ${usd(westerly.vli)}. All the other towns, grouped in the Providence metro area, share ${usd(pvd.vli)}, which explains why a town like ${S.hud.vli4MinName.replace(/ town$/, '')} shows the same limit as Providence city and ranks lowest. Choose your town in the lookup below.</p>
<p>For comparison, ${h.a('state:massachusetts', 'Massachusetts')} tests SNAP income at 200%, ${h.a('state:connecticut', 'Connecticut')} has a heating allowance above Rhode Island's, and ${h.a('state:new-jersey', 'New Jersey')} also uses a ${g}% line.</p>`,
  faqs: [
    { q: 'What is the income limit for SNAP in Rhode Island?', a: `Rhode Island tests gross monthly income at ${g}% of the 2026 poverty guideline for fiscal year ${P.snap.fy}: ${usd(snapGrossState('rhode-island', 1))} for one person, ${usd(snapGrossState('rhode-island', 2))} for two, ${usd(snapGrossState('rhode-island', 3))} for three and ${usd(snapGrossState('rhode-island', 4))} for four. No asset limit applies. A household with a member 60 or older or disabled that is above that line can still qualify on net income.` },
    { q: 'Who qualifies for RIte Care in Rhode Island?', a: `RIte Care is the name under which Rhode Island covers children and families through Medicaid. Children qualify up to ${kid.effectivePct}% of the 2026 poverty guideline, about ${usd(kid.monthly ?? 0)} a month for a family of three, and pregnant women up to ${preg.effectivePct}%. Parents qualify under the expansion up to ${adult.effectivePct}%. EOHHS and the CMS eligibility table are the sources.` },
    { q: 'What is the Section 8 income limit in Providence, RI?', a: `For fiscal year 2026, a family of four in Providence qualifies as very low income up to ${usd(pvd.vli)} a year and as extremely low income up to ${usd(pvd.eli)}. The same limits apply to every town in the Providence metro area. In Newport the very low income limit for four is higher, ${usd(newport.vli)}. HUD limits took effect on May 1, 2026.` },
  ],
  related: ['state:massachusetts', 'state:connecticut', 'state:new-jersey', 'snap-deductions', 'medicaid-income-limits', 'section-8-income-limits'],
});
