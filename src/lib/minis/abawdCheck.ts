/** SNAP time limit (OBBBA, 7 CFR 273.24): are you subject to the 3-month limit, and do your hours meet it? */
import type { MiniSpec } from '../mini-types';
import { P, yesNo } from './_kit';
const A = P.snap.abawd;
export default (): MiniSpec => ({
  title: 'Does the SNAP time limit apply to you?',
  cta: 'Estimate your SNAP benefit',
  inputs: [
    { id: 'age', label: 'Your age', def: 45, unit: 'years', max: 120 },
    { id: 'kid', label: `Child under ${A.childUnder} in your SNAP household?`, def: 0, options: yesNo },
    { id: 'hours', label: 'Hours of work, training or volunteering per month', def: 60, unit: 'h', max: 400 },
    { id: 'exempt', label: 'Unfit for work, pregnant, or another exemption?', def: 0, options: yesNo },
  ],
  run: (v) => {
    const inAge = v.age >= A.ageMin && v.age <= A.ageMax;
    const subject = inAge && v.kid !== 1 && v.exempt !== 1;
    const meets = v.hours >= A.hoursPerMonth;
    const head: [string, string] = subject ? ['Time limit applies', meets ? 'Hours met' : `${A.countableMonths} months in ${A.periodMonths}`] : ['Time limit', 'Does not apply'];
    return {
      head,
      rows: [
        ['Ages covered since July 4, 2025', `${A.ageMin} to ${A.ageMax}`],
        ['Child that exempts you', `under ${A.childUnder}`],
        ['Hours needed each month', `${A.hoursPerMonth}`],
        ['Your hours', `${v.hours}${subject ? (meets ? ', enough' : `, ${A.hoursPerMonth - v.hours} short`) : ''}`],
      ],
      note: subject && !meets ? `Without ${A.hoursPerMonth} hours, SNAP stops after ${A.countableMonths} months in a ${A.periodMonths}-month period, unless your area has a waiver.` : undefined,
    };
  },
});
