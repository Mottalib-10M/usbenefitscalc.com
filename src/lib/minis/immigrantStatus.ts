/** Benefits for immigrants guide: SNAP (sec. 10108, since July 4, 2025), federal Medicaid funding (sec. 71109, from
 *  October 1, 2026), premium tax credit 2026 and 2027 (secs. 71301, 71302). One status, four answers. */
import type { MiniSpec } from '../mini-types';
import { P } from './_kit';
const ptcYear = P.aca.immigrantPtcLimitFromTaxYear;
// [label, SNAP, federal Medicaid from Oct. 1, 2026, PTC 2026, PTC from 2027]
const S: Array<[string, string, string, string, string]> = [
  ['U.S. citizen or national', 'Yes', 'Yes', 'Yes', 'Yes'],
  ['Green card, under 5 years', 'After 5 years*', 'After 5 years*', 'Yes', 'Yes'],
  ['Green card, 5 years or more', 'Yes', 'Yes', 'Yes', 'Yes'],
  ['Refugee or asylee, no green card', 'No', 'Emergency care', 'Yes', 'No'],
  ['Cuban or Haitian entrant', 'Yes', 'Yes', 'Yes', 'Yes'],
  ['COFA citizen', 'Yes', 'Yes', 'Yes', 'Yes'],
  ['Other lawfully present', 'No', 'Emergency care', 'Yes', 'No'],
  ['Undocumented', 'No', 'Emergency care', 'No', 'No'],
];
export default (): MiniSpec => ({
  title: 'What your immigration status allows',
  cta: 'Medicaid income limits by state',
  inputs: [{ id: 's', label: 'Status of the person applying', def: 1, options: S.map((s, i) => ({ value: String(i), label: s[0] })) }],
  run: (v) => {
    const r = S[v.s] ?? S[0];
    return {
      head: ['Federal Medicaid from Oct. 1, 2026', r[2]],
      rows: [
        ['SNAP today', r[1]],
        ['Premium tax credit, 2026', r[3]],
        [`Premium tax credit, from ${ptcYear}`, r[4]],
      ],
      note: v.s === 1 ? '*Exceptions apply: for SNAP, children under 18, disabled people, 40 work quarters, a military connection; for Medicaid, former refugees or asylees, and state options for children and pregnancy.'
        : r[2] === 'Emergency care' && v.s !== 7 ? 'Federal funding also stays for the state option that covers lawfully residing children and pregnant women.'
        : v.s > 0 && r[3] === 'Yes' ? 'From 2026, a lawfully present immigrant under 100% of poverty no longer gets the credit.' : undefined,
    };
  },
});
