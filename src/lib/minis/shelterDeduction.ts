/** SNAP excess shelter deduction, FY 2027, 48 states and DC (7 CFR 273.9(d)(6)(ii)): shelter costs above half of
 *  income after the other deductions, capped unless a member is 60+ or disabled. Computed by the SNAP engine. */
import type { MiniSpec } from '../mini-types';
import { snap, type SnapParams } from '../engine/snap';
import { guideline } from '../engine/fpl';
import { P, F26, usd, yesNo } from './_kit';

const SP = P.snap as unknown as SnapParams;

export default (): MiniSpec => ({
  title: 'Your SNAP shelter deduction',
  cta: 'See the full SNAP calculation',
  inputs: [
    { id: 'rent', label: 'Rent or mortgage per month', def: 1100, unit: '$', max: 20000 },
    { id: 'util', label: 'Utility allowance or bills', def: 450, unit: '$', max: 5000 },
    { id: 'adj', label: 'Income after other deductions', def: 1500, unit: '$', max: 50000 },
    { id: 'ed', label: 'Someone 60+ or disabled?', def: 0, options: yesNo },
  ],
  run: (v) => {
    // One person, unearned income = adjusted income + standard deduction, so that the engine lands on the adjusted figure entered.
    const r = snap(SP, { area: 'us', bbce: [] }, guideline(F26, 'us', 1), { size: 1, earned: 0, unearned: v.adj + SP.standardDeduction.us[0], elderlyDisabled: v.ed === 1, housing: v.rent, utilities: v.util });
    return {
      head: ['Excess shelter deduction', usd(r.deductions.shelter)],
      rows: [
        ['Shelter costs', usd(r.shelterCosts)],
        [`Half of income (${SP.shelterShareOfIncome}%)`, usd((r.adjusted * SP.shelterShareOfIncome) / 100)],
        ['Above half of income', usd(r.excessShelter)],
        ['Cap', v.ed === 1 ? 'None (60+ or disabled)' : usd(SP.shelterCap.us)],
      ],
      note: r.shelterCapped ? `Capped: ${usd(r.excessShelter - SP.shelterCap.us)} of shelter costs are not deducted.` : undefined,
    };
  },
});
