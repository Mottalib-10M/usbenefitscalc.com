/** Medicaid work requirements guide (Public Law 119-21, sec. 71119): 80 hours a month, or income of at least
 *  80 x the federal minimum wage, unless an exemption applies. */
import type { MiniSpec } from '../mini-types';
import { P, usd, yesNo } from './_kit';
const W = P.medicaid.workRequirement;
const incomeBar = W.hoursPerMonth * W.federalMinimumWage;
export default (): MiniSpec => ({
  title: 'Would you meet the Medicaid community engagement rule?',
  cta: 'Check the Medicaid income limit of your state',
  inputs: [
    { id: 'h', label: 'Hours of work, school, training or volunteering per month', def: 60, unit: 'h', max: 744 },
    { id: 'inc', label: 'Monthly earnings', def: 450, unit: '$', max: 100000 },
    { id: 'ex', label: 'Exempt (child 13 or under, pregnant, medically frail...)?', def: 0, options: yesNo },
  ],
  run: (v) => {
    if (v.ex === 1) return { head: ['80-hour rule', 'Exempt'], rows: [['Hours needed', '0'], ['Income test', 'Not needed']], note: 'The state decides on the exemption and may verify it from its own records.' };
    const byHours = v.h >= W.hoursPerMonth;
    const byIncome = v.inc >= incomeBar;
    return {
      head: ['80-hour rule', byHours || byIncome ? 'Met' : 'Not met'],
      rows: [
        ['Hours needed each month', `${W.hoursPerMonth}`],
        ['Your hours', `${v.h}${byHours ? '' : `, ${W.hoursPerMonth - v.h} short`}`],
        ['Income that also counts', `${usd(incomeBar)} a month`],
        ['Your earnings', `${usd(v.inc)}${byIncome ? ', enough' : ''}`],
      ],
      note: byHours || byIncome ? undefined : 'Half-time enrollment in college or career training meets the rule without counting hours.',
    };
  },
});
