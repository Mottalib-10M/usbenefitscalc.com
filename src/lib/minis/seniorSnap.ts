/** SNAP for one person aged 60 or more, FY 2027, 48 states and DC, federal regular rules (no gross test,
 *  medical costs above the threshold, uncapped shelter deduction). arg: { utilities } default allowance. */
import type { MiniSpec } from '../mini-types';
import { snap, type SnapParams } from '../engine/snap';
import { guideline } from '../engine/fpl';
import { P, F26, usd, parseArg } from './_kit';

const SP = P.snap as unknown as SnapParams;

export default (arg?: string): MiniSpec => {
  const a = parseArg<{ utilities: number }>(arg, { utilities: 0 });
  return {
    title: 'SNAP for a person 60 or older living alone',
    cta: 'Open the full SNAP calculator', ctaHref: '/en/snap-calculator/',
    inputs: [
      { id: 'ss', label: 'Social Security or pension per month', def: 1300, unit: '$', max: 20000 },
      { id: 'rent', label: 'Rent or mortgage per month', def: 850, unit: '$', max: 20000 },
      { id: 'med', label: 'Out-of-pocket medical costs per month', def: 100, unit: '$', max: 20000 },
      { id: 'util', label: 'Utility allowance', def: a.utilities, unit: '$', max: 5000 },
    ],
    run: (v) => {
      const r = snap(SP, { area: 'us', bbce: [] }, guideline(F26, 'us', 1), { size: 1, earned: 0, unearned: v.ss, elderlyDisabled: true, housing: v.rent, utilities: v.util, medical: v.med });
      return {
        head: [`Estimated SNAP, FY ${P.snap.fy}`, r.eligible ? `${usd(r.benefit)} a month` : 'Not eligible'],
        rows: [
          ['Medical deduction', usd(r.deductions.medical)],
          ['Shelter deduction (no cap)', usd(r.deductions.shelter)],
          ['Net income', `${usd(r.net)} (limit ${usd(r.netLimit)})`],
        ],
        note: r.eligible ? (r.minimumApplied ? `The minimum benefit of ${usd(SP.minBenefit.us)} applies.` : undefined) : r.reason,
      };
    },
  };
};
