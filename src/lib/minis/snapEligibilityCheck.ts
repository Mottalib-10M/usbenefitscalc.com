/** SNAP income tests, FY 2027 (7 CFR 273.9(a), 273.2(j)): gross test at the state's BBCE line or the federal 130%,
 *  net test at 100% estimated before shelter costs. The engine decides which route applies. */
import type { MiniSpec } from '../mini-types';
import { snap, bbceLimit, type SnapParams } from '../engine/snap';
import { guideline } from '../engine/fpl';
import { bySize } from '../engine/table';
import { P, F26, usd, sizes, yesNo } from './_kit';

const SP = P.snap as unknown as SnapParams;
const RULES = [130, 150, 160, 165, 185, 200];

export default (): MiniSpec => ({
  title: 'Do you pass the SNAP income tests?',
  cta: 'Estimate your SNAP benefit',
  inputs: [
    { id: 'n', label: 'Household size', def: 3, options: sizes(8) },
    { id: 'pay', label: 'Gross monthly pay (wages)', def: 3200, unit: '$', max: 100000 },
    { id: 'ed', label: 'Someone 60+ or disabled?', def: 0, options: yesNo },
    { id: 'rule', label: "Your state's gross income line", def: 200, options: RULES.map((r) => ({ value: String(r), label: r === 130 ? '130% (federal)' : `${r}% (BBCE)` })) },
  ],
  run: (v) => {
    const fplA = guideline(F26, 'us', v.n);
    const bbce = v.rule > 130 ? [{ who: 'all' as const, grossPct: v.rule, assetLimit: null }] : [];
    const r = snap(SP, { area: 'us', bbce }, fplA, { size: v.n, earned: v.pay, unearned: 0, elderlyDisabled: v.ed === 1, housing: 0, utilities: 0 });
    const line = v.rule > 130 ? bbceLimit(fplA, v.rule) : bySize(SP.grossLimit.us, v.n);
    const gross = r.grossTest === 'not-applied' ? 'No gross test (60+ or disabled)' : `${usd(line)}: ${r.grossTest === 'pass' ? 'pass' : 'fail'}`;
    const net = r.netTest === 'not-applied' ? 'Not required (BBCE)' : `${usd(r.net)} vs ${usd(r.netLimit)}: ${r.netTest === 'pass' ? 'pass' : 'fail'}`;
    const ok = r.grossTest !== 'fail' && r.netTest !== 'fail';
    return {
      head: ['Income tests, FY 2027', ok ? 'Likely pass' : r.grossTest === 'fail' ? 'Over the gross line' : 'Net test not met yet'],
      rows: [
        ['Gross income line', gross],
        ['Net income before rent', net],
        ['Federal net line (100%)', usd(bySize(SP.netLimit.us, v.n))],
      ],
      note: !ok && r.grossTest !== 'fail' ? 'Rent and utilities have not been deducted here: the shelter deduction can bring net income under the line.' : 'Pay is treated as wages (20% deduction). Social Security or unemployment counts in full.',
    };
  },
});
