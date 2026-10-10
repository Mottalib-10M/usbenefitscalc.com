/** Threshold pages: one percentage of the poverty guideline, in dollars for a household size. arg: { pct, year?: 2025 | 2026 } */
import type { MiniSpec } from '../mini-types';
import { guideline } from '../engine/fpl';
import { F25, F26, usd, sizes, parseArg } from './_kit';
export default (arg?: string): MiniSpec => {
  const a = parseArg<{ pct: number; year?: 2025 | 2026 }>(arg, { pct: 138 });
  const T = a.year === 2025 ? F25 : F26;
  return {
    title: `${a.pct}% of the ${a.year ?? 2026} poverty guideline for your household`,
    cta: 'Full poverty level calculator',
    inputs: [
      { id: 'n', label: 'Household size', def: 3, options: sizes(10) },
      { id: 'area', label: 'Where you live', def: 0, options: [{ value: '0', label: '48 states and DC' }, { value: '1', label: 'Alaska' }, { value: '2', label: 'Hawaii' }] },
    ],
    run: (v) => {
      const area = v.area === 1 ? 'ak' : v.area === 2 ? 'hi' : 'us';
      const g = guideline(T, area, v.n);
      const at = (g * a.pct) / 100;
      return { head: [`${a.pct}% of poverty, per year`, usd(at)], rows: [['Per month', usd(at / 12)], ['Per week', usd(at / 52)], [`100% guideline (${a.year ?? 2026})`, usd(g)]] };
    },
  };
};
