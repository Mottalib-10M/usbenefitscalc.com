/** Section 8 voucher: total tenant payment (24 CFR 5.628) from annual income and the 2026 deductions of 24 CFR 5.611. */
import type { MiniSpec } from '../mini-types';
import { tenantPayment } from '../engine/section8';
import { P, usd } from './_kit';
const H = P.hud;
const deps = Array.from({ length: 7 }, (_, i) => ({ value: String(i), label: i === 0 ? 'None' : String(i) }));
export default (): MiniSpec => ({
  title: 'Your monthly share with a Housing Choice Voucher',
  cta: 'Check the income limit in your county',
  inputs: [
    { id: 'income', label: 'Household income per year, before tax', def: 24000, unit: '$', max: 500000 },
    { id: 'dep', label: 'Dependents in the household', def: 2, options: deps },
    { id: 'ed', label: 'Head or spouse 62+ or disabled?', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
    { id: 'care', label: 'Child care paid per year', def: 0, unit: '$', max: 100000 },
  ],
  run: (v) => {
    const r = tenantPayment(H, { annualIncome: v.income, dependents: v.dep, elderlyDisabled: v.ed === 1, childCare: v.care });
    return {
      head: ['Total tenant payment, per month', usd(r.ttp)],
      rows: [
        ['Adjusted income per year', usd(r.adjusted)],
        ['30% of adjusted monthly income', usd(r.thirtyAdjusted)],
        ['10% of gross monthly income', usd(r.tenGross)],
        ['Rule that applies', r.rule],
      ],
      note: r.ttp < H.maxMinimumRent ? `Your housing authority may charge a minimum rent of up to ${usd(H.maxMinimumRent)} a month, with a hardship exemption.` : undefined,
    };
  },
});
