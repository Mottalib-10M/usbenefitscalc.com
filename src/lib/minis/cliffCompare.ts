/** ACA subsidy cliff guide: the 2026 premium tax credit against the expired 2021 to 2025 table, same household. */
import type { MiniSpec } from '../mini-types';
import { guideline } from '../engine/fpl';
import { ptc, type PctTable } from '../engine/aca';
import { P, F25, usd, sizes } from './_kit';
export default (): MiniSpec => ({
  title: 'Your 2026 credit against the expired rules',
  cta: 'Medicaid limits by state',
  inputs: [
    { id: 'n', label: 'Household size', def: 2, options: sizes(8) },
    { id: 'inc', label: 'Yearly household income (MAGI)', def: 88000, unit: '$', max: 2000000 },
    { id: 'b', label: 'Benchmark silver premium, per month', def: 1700, unit: '$', max: 20000 },
  ],
  run: (v) => {
    const fplAnnual = guideline(F25, 'us', v.n);
    const now = ptc(P.aca.table2026 as PctTable, { income: v.inc, fplAnnual, benchmarkMonthly: v.b }, { minPct: P.aca.minPct, maxPct: P.aca.maxPct });
    const old = ptc(P.aca.table2021to2025 as PctTable, { income: v.inc, fplAnnual, benchmarkMonthly: v.b }, { minPct: 100, maxPct: null });
    return {
      head: ['Credit in 2026, per month', usd(now.creditMonthly)],
      rows: [
        ['Under the 2021-2025 table', usd(old.creditMonthly)],
        ['Difference over a year', usd((old.creditMonthly - now.creditMonthly) * 12)],
        ['Income vs 2025 guideline', `${Math.round(now.fplPct)}%`],
        ['Cliff for this household', usd((fplAnnual * P.aca.maxPct) / 100)],
      ],
      note: now.reason || undefined,
    };
  },
});
