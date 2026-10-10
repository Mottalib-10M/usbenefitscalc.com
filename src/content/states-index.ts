/** Text of /en/states/. Figures from the kit. */
import type { FAQ, Helpers } from '../lib/page-types';
import { STATES, P, listOf, medLimit, snapGrossState, usd, usdx } from '../lib/kit';
const nB = STATES.filter((s) => s.snap.bbce.length).length;
const no = STATES.filter((s) => !s.snap.bbce.length).map((s) => s.name);
const withAsset = STATES.filter((s) => s.snap.bbce.some((b) => b.assetLimit != null)).map((s) => s.name);
const kids = STATES.map((s) => ({ name: s.name, pct: medLimit(s.slug, 'child6to18', 3).effectivePct ?? 0 })).sort((a, b) => a.pct - b.pct);
const lo = kids[0], hi = kids[kids.length - 1];
const nonExp = STATES.filter((s) => !s.medicaid.expansion).map((s) => s.name);
export const STATES_INDEX = {
  faqs: [
    { q: 'Which state has the highest SNAP income limit?', a: `The states using a gross test of 200% of the poverty guideline share the highest limit: ${usd(snapGrossState('california', 3))} a month for three people in fiscal year ${P.snap.fy}, against ${usd(P.snap.grossLimit.us[2])} under the federal rule. Alaska and Hawaii have higher dollar amounts because their poverty guidelines are higher. The maximum benefit does not change with the limit.` },
    { q: 'Which states have not expanded Medicaid in 2026?', a: `Going by the CMS table of state levels, ${listOf(nonExp)}. In those states adults without children have no income-based Medicaid group, except Wisconsin's waiver up to the poverty line, and parents qualify only at low incomes. Children and pregnant women are covered in every state.` },
    { q: 'Do I apply for SNAP and Medicaid in the state where I work or where I live?', a: `Where you live. Both programs are run by the state of residence, and you apply to its agency, usually with one online application for both. Moving to another state means closing the case and applying again there, where the income limits, the utility allowance and the Medicaid groups may be different. Federal benefits like SSI and the EITC do not depend on the state.` },
  ] as FAQ[],
  title: 'Benefits by State 2026: SNAP, Medicaid, WIC and HUD Limits',
  description: 'SNAP, Medicaid, CHIP, WIC and Section 8 limits for the 50 states and DC in 2026: each page applies its own SNAP options, Medicaid levels and HUD county data.',
  h1: 'Benefits by state: pick yours',
  intro: 'Fifty states and the District of Columbia, each with its own SNAP options, Medicaid choices and HUD county limits.',
  resume: `Federal law sets the frame for SNAP, Medicaid, the premium tax credit, the EITC, WIC and Section 8, and the amounts in that frame are national: the same maximum SNAP benefit in 48 states and DC, the same poverty guideline, the same tax credit. The states then fill it in. ${nB} of them use broad-based categorical eligibility to raise or remove SNAP income and asset tests, each sets its own utility allowances, each decides how far Medicaid and CHIP reach above the federal floors, and HUD publishes income limits for every county and New England town. A state page gathers those choices in one place, prints the tables, and runs the screener and the county lookup with that state locked in, so that a family in Arkansas and a family in Oregon with the same income see the answer that applies to them.`,
  body: (h: Helpers, exp: string[], non: string[]) => `<h2>Where the state rules differ most</h2>
<p><strong>SNAP tests.</strong> Without broad-based categorical eligibility, the federal tests apply: gross income at 130% of the poverty guideline, net income at 100%, and an asset limit of ${h.usd(P.snap.assets.general)}. The states that do not use it are ${listOf(no)}. Elsewhere the gross test runs from 130% to 200% and most states have no asset test at all; ${listOf(withAsset)} keep one.</p>
<p><strong>Utility allowances.</strong> SNAP lets households that pay for heating or cooling deduct a flat allowance instead of their real bills. The amount is set by each state and approved by USDA, and it moves the shelter deduction, so the benefit, more than any other state choice.</p>
<p><strong>Medicaid for adults.</strong> ${exp.length} jurisdictions cover low-income adults under the ACA expansion: ${listOf(exp)}. The other ${non.length}, ${listOf(non)}, cover parents only at much lower levels and adults without children not at all, except Wisconsin, which covers adults up to the poverty line under a waiver.</p>
<p><strong>Children.</strong> Every state covers children above the adult limits, through Medicaid or a separate CHIP, but the ceiling for school-age children ranges from ${lo.pct}% of the poverty line in ${lo.name} to ${hi.pct}% in ${hi.name}.</p>
<p><strong>Housing.</strong> Section 8 limits are not set by states but by HUD, for each metro area and rural county. Large states therefore carry dozens of different limits, and New England states hundreds of towns.</p>
<h2>What every state page contains</h2>
<p>The key figures for the state, an answer written for its residents, the household screener with the state locked, the SNAP tables (gross and net limits, maximum benefits, utility allowances), the Medicaid and CHIP limits for each group and household size, the marketplace you use for 2026, the agencies to apply to, and the Section 8 lookup for every county or town. Sources are listed at the bottom of each page with the date we read them.</p>`,
};
