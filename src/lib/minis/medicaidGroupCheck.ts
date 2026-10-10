/** Medicaid eligibility guide: the federal line that applies to a group (expansion 133% + 5, children and pregnancy floor 133% + 5).
 *  State levels are often higher for children and pregnancy: the full calculator applies them. 2026 guideline, 48 states and DC. */
import type { MiniSpec } from '../mini-types';
import { guideline } from '../engine/fpl';
import { P, F26, usd, sizes, yesNo } from './_kit';
const M = P.medicaid;
const line = M.expansionPct + M.disregardPct;
const groups = [
  { value: '0', label: 'Adult 19 to 64, no child' },
  { value: '1', label: 'Parent or caretaker' },
  { value: '2', label: 'Pregnant' },
  { value: '3', label: 'Child under 19' },
];
export default (): MiniSpec => ({
  title: 'Which federal Medicaid line applies to you?',
  cta: 'Apply your state level in the full calculator',
  inputs: [
    { id: 'g', label: 'Who needs coverage', def: 0, options: groups },
    { id: 'n', label: 'Household size (count an unborn child)', def: 1, options: sizes(8) },
    { id: 'inc', label: 'Monthly household income', def: 1600, unit: '$', max: 100000 },
    { id: 'exp', label: 'Has your state expanded Medicaid?', def: 1, options: yesNo },
  ],
  run: (v) => {
    const g = guideline(F26, 'us', v.n);
    const pctInc = ((v.inc * 12) / g) * 100;
    const monthlyLine = (g * line) / 100 / 12;
    const under = pctInc <= line;
    const rows: Array<[string, string]> = [
      ['Your income', `${Math.round(pctInc)}% of the 2026 guideline`],
      [`${line}% line, per month`, usd(monthlyLine)],
      [`2026 guideline for ${v.n}`, usd(g)],
    ];
    if (v.g >= 2) {
      return {
        head: [`Federal floor for ${v.g === 2 ? 'pregnancy' : 'children'}`, under ? 'Under it' : 'Above it'],
        rows,
        note: under ? 'Every state covers this group at least up to this line.' : 'Most states go higher for this group, often through CHIP: check your state level.',
      };
    }
    if (v.exp === 1) {
      return { head: ['Adult expansion line', under ? 'Under it' : 'Above it'], rows, note: under ? undefined : 'Above the line, the Marketplace premium tax credit is the next step.' };
    }
    return {
      head: [v.g === 1 ? 'Parent group' : 'Adult group', v.g === 1 ? 'State standard' : 'None'],
      rows,
      note: v.g === 1 ? 'Non-expansion states cover parents only up to their own standard, far below this line in most of them.' : 'Without expansion there is no group for adults without children (Wisconsin has a waiver).',
    };
  },
});
