/** Expansion states guide: does a yearly income land in Medicaid, the premium tax credit window or the coverage gap?
 *  Medicaid: 133% + 5 of the 2026 guideline (expansion states). Credit: 100% to 400% of the 2025 guideline (2026 coverage). */
import type { MiniSpec } from '../mini-types';
import { guideline } from '../engine/fpl';
import { applicablePct, type PctTable } from '../engine/aca';
import { P, F25, F26, usd, sizes, yesNo, pct } from './_kit';
const line = P.medicaid.expansionPct + P.medicaid.disregardPct;
export default (): MiniSpec => ({
  title: 'Medicaid, tax credit or coverage gap?',
  cta: 'See the Medicaid limits of your state', ctaHref: '/en/medicaid-income-limits/',
  inputs: [
    { id: 'n', label: 'Household size', def: 1, options: sizes(8) },
    { id: 'inc', label: 'Yearly household income (MAGI)', def: 12000, unit: '$', max: 1000000 },
    { id: 'exp', label: 'Has your state expanded Medicaid?', def: 0, options: yesNo },
  ],
  run: (v) => {
    const g25 = guideline(F25, 'us', v.n), g26 = guideline(F26, 'us', v.n);
    const p25 = (v.inc / g25) * 100, p26 = (v.inc / g26) * 100;
    let where = 'No credit';
    if (v.exp === 1 && p26 <= line) where = 'Medicaid';
    else if (p25 >= P.aca.minPct && p25 <= P.aca.maxPct) where = 'Tax credit';
    else if (p25 < P.aca.minPct) where = v.exp === 1 ? 'Medicaid' : 'Coverage gap';
    const rows: Array<[string, string]> = [
      ['Income vs 2025 guideline (credit)', `${Math.round(p25)}%`],
      ['Income vs 2026 guideline (Medicaid)', `${Math.round(p26)}%`],
      ['Credit starts at', usd(g25)],
    ];
    if (where === 'Tax credit') rows.push(['Expected share of income', pct(applicablePct(P.aca.table2026 as PctTable, p25))]);
    return {
      head: ['Where this income lands', where],
      rows,
      note: where === 'Coverage gap' ? 'Below 100% of poverty in a state without expansion, adults get neither Medicaid nor the credit, unless a parent, pregnancy or disability group applies.' : where === 'No credit' ? 'Above 400% of poverty the 2026 credit is zero.' : undefined,
    };
  },
});
