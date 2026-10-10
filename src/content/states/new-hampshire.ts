import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, acaCalc, sua, hudOf, hudRows, usd, usdx } from '../../lib/kit';

const S = sd('new-hampshire');
const b = S.snap.bbce[0];
const hc = sua('new-hampshire', 2) ?? 0;
const lua = S.snap.sua[0].lua ?? 0;
const adult = medLimit('new-hampshire', 'adult', 1);
const kid = medLimit('new-hampshire', 'child6to18', 2);
const kid4 = medLimit('new-hampshire', 'child6to18', 4);
const preg = medLimit('new-hampshire', 'pregnant', 2);
// A father and his 8-year-old in Manchester: $2,600 of wages, $1,400 rent, oil heat on his account.
const dad = snapCalc('new-hampshire', { size: 2, earned: 2600, housing: 1400 });
const dadLua = snapCalc('new-hampshire', { size: 2, earned: 2600, housing: 1400, utilities: lua });
// His retired neighbor, alone, $1,600 of Social Security, $1,100 rent, heat included or not.
const nb = snapCalc('new-hampshire', { size: 1, unearned: 1600, elderlyDisabled: true, housing: 1100 });
const nbLua = snapCalc('new-hampshire', { size: 1, unearned: 1600, elderlyDisabled: true, housing: 1100, utilities: lua });
const dadMed = medCheck('new-hampshire', 'parent', 2, 2600);
// His Marketplace plan: household of two, $2,600 a month, a benchmark silver plan for him alone assumed at $500 a month.
const plan = acaCalc(2600 * 12, 2, 500);
const sea = hudOf('new-hampshire', 'Seabrook town', 4);
const man = hudOf('new-hampshire', 'Manchester city', 4);
const con = hudOf('new-hampshire', 'Concord city', 4);
const nas = hudOf('new-hampshire', 'Nashua city', 4);
const n = hudRows('new-hampshire').length;

export default defineStatePage({
  slug: 'new-hampshire',
  title: `New Hampshire SNAP and Medicaid 2026: ${usdx(hc)} for Heat`,
  description: `New Hampshire benefits 2026: SNAP up to ${usd(snapGrossState('new-hampshire', 2))} a month for 2, a ${usdx(hc)} heating allowance, Medicaid for children to ${kid.effectivePct}% of poverty and adults to ${usd(adult.monthly ?? 0)}.`,
  intro: 'New Hampshire pairs a heating allowance above a thousand dollars with one of the highest Medicaid lines for children, and it buys Marketplace coverage through HealthCare.gov.',
  resume: `New Hampshire households that pay for heat get a SNAP utility allowance of ${usdx(hc)} a month, one of the five largest in the USDA table, and gross income can reach ${usd(snapGrossState('new-hampshire', 2))} a month for two people in fiscal year ${P.snap.fy} under broad-based categorical eligibility at ${b.grossPct}% of poverty, with no asset test. For working families the allowance can run into the federal shelter cap: a father in Manchester raising an eight-year-old on ${usd(2600)} a month, with ${usd(1400)} rent, would receive about ${usd(dad.benefit)} whether he claims the heating figure or the smaller one. A retired neighbor living alone gets the full value of it, ${usd(nb.benefit)} against ${usd(nbLua.benefit)}. On health coverage, New Hampshire expanded Medicaid for adults up to ${usd(adult.monthly ?? 0)} a month for one person and covers children up to ${kid.effectivePct}% of poverty, ${usd(kid4.monthly ?? 0)} a month for a family of four, entirely within Medicaid.`,
  body: (h) => `<h2>When a big allowance stops counting</h2>
<p>SNAP deducts shelter costs above half of a household's adjusted income, but for a household with no member 60 or older or disabled, that deduction stops at ${usd(P.snap.shelterCap.us)} in fiscal year ${P.snap.fy}. The Manchester father's rent alone, ${usd(1400)}, already sits well above half of his adjusted income. With the heating allowance his shelter costs are ${usd(dad.shelterCosts)}; with the limited allowance of ${usdx(lua)}, ${usd(dadLua.shelterCosts)}. Both exceed half of his adjusted income (${usd(dad.adjusted / 2)}) by more than the cap, so the deduction is ${usd(dad.deductions.shelter)} either way and the benefit ${dad.benefit === dadLua.benefit ? `is ${usd(dad.benefit)} in both cases` : `moves only from ${usd(dadLua.benefit)} to ${usd(dad.benefit)}`}. The retiree is different. Her ${usd(1600)} of Social Security and ${usd(1100)} rent produce an uncapped deduction of ${usd(nb.deductions.shelter)} with the heating figure, and an allotment of ${usd(nb.benefit)}; if heat were included in her rent, she would get ${usd(nbLua.benefit)}. The ${h.src('fnaSua', 'USDA allowance table')} lists the figures, and ${h.a('snap-deductions', 'SNAP deductions')} explains the cap.</p>
<h2>Children's Medicaid at ${kid.effectivePct}%</h2>
<p>CMS records New Hampshire's children's Medicaid at ${S.medicaid.child6to18}% of poverty for every age up to 19, and no separate CHIP: ${kid.effectivePct}% with the disregard, among the highest lines in the country. For the Manchester father and son, that is ${usd(kid.monthly ?? 0)} a month, so the boy ${medCheck('new-hampshire', 'child6to18', 2, 2600).eligible ? 'is covered' : 'is not covered'}. The father, at ${Math.round(dadMed.pctIncome)}% of poverty, ${dadMed.eligible ? 'is under' : 'is above'} the expansion line of ${adult.effectivePct}%${dadMed.eligible ? '' : `; he can buy a plan on HealthCare.gov with the ${h.a('aca-subsidy-calculator', 'premium tax credit')}`}. Pregnant women qualify up to ${preg.effectivePct}%, ${usd(preg.monthly ?? 0)} a month for two. Applications go through NH EASY, the portal of the ${S.medicaid.agency}.</p>
<p>On HealthCare.gov the father's household of two is measured against the 2025 guideline, as all 2026 Marketplace coverage is: ${usd(2600 * 12)} a year is ${Math.round(plan.fplPct)}% of it. At that level the 2026 table asks him to contribute ${plan.applicablePct.toFixed(2)}% of income, ${usd(plan.expectedMonthly)} a month, toward the benchmark silver plan. His son is on Medicaid, so only he enrolls; if the benchmark plan for him alone cost ${usd(500)} a month, the premium tax credit would cover ${usd(plan.creditMonthly)} of it. Below ${P.aca.csrSilverMaxPct}% of the guideline a silver plan also comes with reduced deductibles and co-pays.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>${n} towns, and two that belong to Boston</h2>
<p>HUD lists New Hampshire town by town. Seabrook and South Hampton, on the Massachusetts line, are part of the Boston metro area and carry the state's top very low income limit for four, ${usd(sea.vli)}. Nashua is at ${usd(nas.vli)}, Concord at ${usd(con.vli)}, Manchester at ${usd(man.vli)}, and the towns of Sullivan County at ${usd(S.hud.vli4Min)}. Compare with ${h.a('state:vermont', 'Vermont')}, ${h.a('state:maine', 'Maine')} and ${h.a('state:massachusetts', 'Massachusetts')}.</p>`,
  faqs: [
    { q: 'What is the income limit for food stamps in New Hampshire for 2 people?', a: `${usd(snapGrossState('new-hampshire', 2))} of gross monthly income in fiscal year ${P.snap.fy}, ${b.grossPct}% of the 2026 poverty guideline, with no asset test. New Hampshire uses broad-based categorical eligibility, so most households face only this gross test. The benefit for two is the federal maximum minus 30% of net income after deductions, including the ${usdx(hc)} heating allowance.` },
    { q: 'What is the Medicaid income limit for children in New Hampshire?', a: `Children up to 19 qualify for New Hampshire Medicaid up to ${kid.effectivePct}% of the poverty guideline including the 5% disregard, about ${usd(kid.monthly ?? 0)} a month for a parent and one child and ${usd(kid4.monthly ?? 0)} for a family of four in 2026. The CMS table shows the same level for every age and no separate CHIP. Income is counted under MAGI rules.` },
    { q: 'Does New Hampshire have its own health insurance marketplace?', a: `No. For 2026 New Hampshire residents buy Marketplace plans on HealthCare.gov, unlike Vermont, Maine and Massachusetts, which run state exchanges. The premium tax credit applies from 100% to ${P.aca.maxPct}% of the 2025 poverty guideline. Below the Medicaid expansion line of ${usd(adult.monthly ?? 0)} a month for a single adult, New Hampshire Medicaid applies instead.` },
    { q: 'What is the Section 8 income limit in Manchester, New Hampshire?', a: `For fiscal year 2026, Manchester's very low income limit is ${usd(man.vli)} for a family of four and ${usd(hudOf('new-hampshire', 'Manchester city', 1).vli)} for one person; the extremely low limit for four is ${usd(man.eli)}. Nashua is higher at ${usd(nas.vli)} for four, and the two towns in the Boston metro area, Seabrook and South Hampton, top the state at ${usd(sea.vli)}.` },
  ],
  related: ['state:vermont', 'state:maine', 'state:massachusetts', 'snap-deductions', 'medicaid-income-limits', 'section-8-income-limits'],
});
