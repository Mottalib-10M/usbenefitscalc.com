/** SNAP maximum allotment by household size and area, FY 2027 against FY 2026.
 *  arg: { prev: Record<area, number[]> } FY 2026 rows (sizes 1 to 8, then each additional person) written by the page. */
import type { MiniSpec } from '../mini-types';
import { bySize } from '../engine/table';
import { P, usd, sizes, parseArg } from './_kit';

type Area = 'us' | 'ak-urban' | 'ak-rural1' | 'ak-rural2' | 'hi';
const AREAS: Array<[Area, string]> = [['us', '48 states and DC'], ['ak-urban', 'Alaska, urban'], ['ak-rural1', 'Alaska, rural 1'], ['ak-rural2', 'Alaska, rural 2'], ['hi', 'Hawaii']];

export default (arg?: string): MiniSpec => {
  const a = parseArg<{ prev: Partial<Record<Area, number[]>> }>(arg, { prev: {} });
  const prev: Partial<Record<Area, number[]>> = { us: P.snap.previous.maxAllotmentUs, ...a.prev };
  return {
    title: 'Maximum SNAP benefit for your household',
    cta: 'Estimate your own SNAP benefit', ctaHref: '/en/snap-calculator/',
    inputs: [
      { id: 'n', label: 'Household size', def: 4, options: sizes(12) },
      { id: 'area', label: 'Where you live', def: 0, options: AREAS.map(([, l], i) => ({ value: String(i), label: l })) },
    ],
    run: (v) => {
      const [area] = AREAS[v.area] ?? AREAS[0];
      const now = bySize(P.snap.maxAllotment[area], v.n);
      const p = prev[area];
      const before = p ? bySize(p, v.n) : null;
      const diff = before == null ? null : now - before;
      return {
        head: [`Maximum per month, FY ${P.snap.fy}`, usd(now)],
        rows: [
          ['Per person', usd(now / v.n)],
          [`FY ${P.snap.previous.fy}`, before == null ? '–' : usd(before)],
          ['Change', diff == null ? '–' : `${diff >= 0 ? '+' : '−'}${usd(Math.abs(diff))}`],
        ],
        note: 'Paid only when net income is zero: each dollar of net income lowers the benefit by 30 cents.',
      };
    },
  };
};
