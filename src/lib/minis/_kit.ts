/**
 * Shared tools for the mini-simulators (ignored by the registry: "_" prefix).
 * RULE: a mini never imports src/lib/kit.ts (eager loaders: every state file would ship to the browser).
 * It may import src/data/params-2026.json and the engines. State figures arrive through `arg`
 * (JSON written by the page from the data with the kit).
 */
import { formatMoney, formatNumber } from '../format';
import P from '../../data/params-2026.json';
import type { FplTable } from '../engine/fpl';
export { pct } from '../fmt';
export { P };
export const F26 = P.fpl['2026'] as unknown as FplTable;
export const F25 = P.fpl['2025'] as unknown as FplTable;
export const usd = (x: number, d = 0) => formatMoney(x, d);
export const num = (x: number, d = 0) => formatNumber(x, d);
export const yesNo = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export const sizes = (max = 8) => Array.from({ length: max }, (_, i) => ({ value: String(i + 1), label: i === 0 ? '1 person' : `${i + 1} people` }));
export function parseArg<T>(arg: string | undefined, fallback: T): T {
  if (!arg) return fallback;
  try { return JSON.parse(arg) as T; } catch { return fallback; }
}
