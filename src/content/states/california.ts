import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, sua, medLimit, medCheck, fplAt, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('california');
const g = S.snap.bbce[0].grossPct;
// A single home health aide in Los Angeles: $2,100 a month, $1,500 rent for a room in a shared apartment.
const aide = snapCalc('california', { size: 1, earned: 2100, housing: 1500 });
// A family of three in Oakland: $3,600 of wages, $2,100 rent.
const fam = snapCalc('california', { size: 3, earned: 3600, housing: 2100 });
const adult = medLimit('california', 'adult', 1);
const kid = medLimit('california', 'child6to18', 3);
const preg = medLimit('california', 'pregnant', 2);
// A single barista in Sacramento earning $1,900 a month: Medi-Cal or Covered California?
const barista = medCheck('california', 'adult', 1, 1900);
const scz = hudOf('california', 'Santa Cruz County', 4);
const sf = hudOf('california', 'San Francisco County', 4);
const la = hudOf('california', 'Los Angeles County', 4);
const sd_ = hudOf('california', 'San Diego County', 4);
const fresno = hudOf('california', 'Fresno County', 4);

export default defineStatePage({
  slug: 'california',
  title: 'California CalFresh and Medi-Cal 2026: Limits by County',
  description: `California 2026: CalFresh gross limit ${usd(snapGrossState('california', 3))} a month for 3, Medi-Cal to ${usd(adult.monthly ?? 0)} a month for one adult, Section 8 limits from ${usd(S.hud.vli4Min)} to ${usd(S.hud.vli4Max)} for four.`,
  intro: 'In California the program names change, CalFresh and Medi-Cal, and so does the scale: the Section 8 limit for the same family more than doubles from the Central Valley to the coast.',
  resume: `California runs SNAP as CalFresh and Medicaid as Medi-Cal. CalFresh tests gross income at ${g}% of the poverty guideline, ${usd(snapGrossState('california', 3))} a month for three people in fiscal year ${P.snap.fy}, with no asset limit, and uses a heating and cooling allowance of ${usdx(sua('california', 1) ?? 0)}. Rents are the problem: a single home health aide in Los Angeles earning ${usd(2100)} with ${usd(1500)} rent hits the federal cap on the shelter deduction and gets about ${usd(aide.benefit)} a month, and a family of three in Oakland on ${usd(3600)} with ${usd(2100)} rent gets about ${usd(fam.benefit)}. Medi-Cal covers adults up to ${usd(adult.monthly ?? 0)} a month for one person and children up to ${kid.effectivePct}% of poverty inside Medi-Cal itself. Above those lines, Covered California sells Marketplace plans for 2026. Section 8 very low income limits for four range from ${usd(S.hud.vli4Min)} to ${usd(S.hud.vli4Max)} depending on the county.`,
  body: (h) => `<h2>CalFresh when rent outruns the shelter cap</h2>
<p>CalFresh subtracts housing costs above half of a household's adjusted income, but for households without an older or disabled member that excess shelter deduction stops at ${usd(P.snap.shelterCap.us)} a month in fiscal year ${P.snap.fy} (${h.src('cfr2739', '7 CFR 273.9')}). In much of coastal California, rent alone passes that point. The Los Angeles aide has ${usd(aide.adjusted)} of income after the earnings and standard deductions; rent plus the ${usdx(sua('california', 1) ?? 0)} utility allowance is ${usd(aide.shelterCosts)}, so the excess would be ${usd(aide.excessShelter)}, but only ${usd(aide.deductions.shelter)} counts. Net income lands at ${usd(aide.net)} and the benefit at ${usd(aide.benefit)} of the ${usd(aide.maxAllotment)} maximum. The Oakland family is in the same position: an uncapped deduction of ${usd(fam.excessShelter)} is cut to ${usd(fam.deductions.shelter)}, leaving ${usd(fam.benefit)}. Each extra dollar of rent beyond the cap changes nothing, which is why two Californian households with very different housing bills can receive the same CalFresh amount. A member who is 60 or older or disabled removes the cap; see ${h.a('snap-deductions', 'SNAP deductions')}.</p>
<p>The ${g}% gross line itself is rarely the obstacle: ${usd(snapGrossState('california', 1))} for one person is more than the aide earns. Applications go through BenefitsCal (${h.ext('https://benefitscal.com/', 'benefitscal.com')}), and the California Department of Social Services oversees the program.</p>
<h2>Medi-Cal, Covered California and the children's lines</h2>
<p>Medi-Cal covers expansion adults to ${adult.effectivePct}% of poverty with the disregard, ${usd(adult.monthly ?? 0)} a month for one person in 2026. A barista in Sacramento earning ${usd(1900)} is at ${Math.round(barista.pctIncome)}%, ${barista.eligible ? 'inside Medi-Cal' : 'above it'}, and would shop on Covered California, the state-based exchange, with the ${h.a('aca-subsidy-calculator', 'premium tax credit')} that starts at 100% of the 2025 guideline (${usd(fplAt(1, 100, 'us', 2025))} a year). Children up to 19 are on Medi-Cal itself to ${kid.effectivePct}%, ${usd(kid.monthly ?? 0)} a month for a family of three. CMS adds a footnote: a separate CHIP covers certain children under 2 up to 317% of poverty statewide, and children up to 19 at the same level in three counties only (${h.src('cmsLevels', 'CMS table, note 6')}). Pregnant women qualify to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month counted as two.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>The widest Section 8 range on this site</h2>
<p>HUD's FY 2026 file splits California into ${S.hud.areas} areas over ${S.hud.rows} counties. For a family of four, the very low income limit is ${usd(scz.vli)} in Santa Cruz County, ${usd(sf.vli)} in San Francisco, ${usd(sd_.vli)} in San Diego County and ${usd(la.vli)} in Los Angeles County. Fresno County, like Kern, Tulare and much of the north, sits at ${usd(fresno.vli)}, the state floor. A family earning ${usd(70000)} is therefore eligible for a voucher list in Los Angeles and well over the line in Fresno. Waiting lists are run locally, city by city or county by county. For neighbors, ${h.a('state:oregon', 'Oregon')} and ${h.a('state:nevada', 'Nevada')} use the same ${g}% SNAP gross line, and ${h.a('state:arizona', 'Arizona')} sizes its utility allowance by household.</p>`,
  faqs: [
    { q: 'What is the income limit for CalFresh in California for 2027?', a: `For fiscal year ${P.snap.fy}, October 2026 to September 2027, CalFresh accepts gross monthly income up to ${g}% of the poverty guideline: ${usd(snapGrossState('california', 1))} for one person, ${usd(snapGrossState('california', 2))} for two and ${usd(snapGrossState('california', 4))} for four. There is no asset test. The benefit then depends on net income after the earnings, standard, dependent care and shelter deductions.` },
    { q: 'What is the Medi-Cal income limit for a single person in California?', a: `About ${usd(adult.monthly ?? 0)} a month in 2026, which is ${adult.effectivePct}% of the poverty guideline with the 5% disregard, under the ACA expansion California adopted. Income is counted with MAGI rules. Above that line, a single adult can buy a plan on Covered California with a premium tax credit if income is under 400% of the 2025 guideline.` },
    { q: 'Do children get Medi-Cal in California at higher incomes?', a: `Yes. Children up to age 19 are covered by Medi-Cal up to ${kid.effectivePct}% of the poverty guideline, about ${usd(kid.monthly ?? 0)} a month for a family of three in 2026, according to the CMS table. A separate CHIP covers certain children under 2 up to 317% statewide and older children at that level in three counties only.` },
    { q: 'What is the Section 8 income limit in Los Angeles, California?', a: `For fiscal year 2026, a family of four in Los Angeles County is very low income up to ${usd(la.vli)} a year and extremely low income up to ${usd(la.eli)}. The highest California limit is ${usd(S.hud.vli4Max)} in ${S.hud.vli4MaxName}. HUD limits took effect on ${day(P.hud.effective)}; the housing authority for your city or county keeps the voucher list.` },
  ],
  related: ['state:oregon', 'state:nevada', 'state:arizona', 'snap-deductions', 'aca-subsidy-calculator', 'section-8-income-limits'],
});
