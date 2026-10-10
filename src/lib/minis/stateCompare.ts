/** Two states side by side for one household: SNAP gross test, Medicaid line for adults, children's line.
 *  arg: { states: Array<[name, area, snapGrossPct|null, adultPct|null, childPct|null]> } (percentages already include the disregard). */
import type { MiniSpec } from '../mini-types';
import { guideline } from '../engine/fpl';
import { bbceLimit } from '../engine/snap';
import { bySize } from '../engine/table';
import { P, F26, usd, sizes, parseArg } from './_kit';
type Row = [string, 'us' | 'ak' | 'hi', number | null, number | null, number | null];
export default (arg?: string): MiniSpec => {
  const a = parseArg<{ states: Row[] }>(arg, { states: [] });
  const opts = a.states.map((s, i) => ({ value: String(i), label: s[0] }));
  const gross = (s: Row, n: number) => (s[2] != null ? bbceLimit(guideline(F26, s[1], n), s[2]) : bySize(P.snap.grossLimit[s[1]], n));
  const med = (s: Row, n: number, pct: number | null) => (pct == null ? 'none' : usd((guideline(F26, s[1], n) * pct) / 100 / 12));
  const first = Math.max(0, a.states.findIndex((s) => s[0] === 'Texas'));
  const second = Math.max(0, a.states.findIndex((s) => s[0] === 'California'));
  return {
    title: 'Compare two states for the same household',
    cta: 'Open the household screener', ctaHref: '/en/',
    inputs: [
      { id: 'a', label: 'First state', def: first, options: opts },
      { id: 'b', label: 'Second state', def: second, options: opts },
      { id: 'n', label: 'Household size', def: 3, options: sizes(8) },
    ],
    run: (v) => {
      const A = a.states[v.a] ?? a.states[0], B = a.states[v.b] ?? a.states[0];
      if (!A || !B) return { head: ['SNAP gross limit', '–'], rows: [] };
      return {
        head: [`SNAP gross income limit, ${A[0]} / ${B[0]}`, `${usd(gross(A, v.n))} / ${usd(gross(B, v.n))}`],
        rows: [
          ['Medicaid, adult in this household', `${med(A, v.n, A[3])} / ${med(B, v.n, B[3])}`],
          ['Children 6 to 18 (Medicaid or CHIP)', `${med(A, v.n, A[4])} / ${med(B, v.n, B[4])}`],
          ['Monthly amounts', 'FY 2027 SNAP, 2026 guideline'],
        ],
      };
    },
  };
};
