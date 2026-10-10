/** SNAP student rule, 7 CFR 273.5(b): which exemption, if any, lets a student enrolled at least half time qualify.
 *  Four of the regulation's exemptions are tested; the others are listed in the note. */
import type { MiniSpec } from '../mini-types';
import { yesNo } from './_kit';

export default (): MiniSpec => ({
  title: 'Does a SNAP student exemption apply to you?',
  cta: 'Estimate your SNAP benefit', ctaHref: '/en/snap-calculator/',
  inputs: [
    { id: 'age', label: 'Your age', def: 20, unit: 'years', max: 120 },
    { id: 'hours', label: 'Paid work hours per week', def: 12, unit: 'h', max: 100 },
    { id: 'ws', label: 'Approved for work-study this term?', def: 0, options: yesNo },
    { id: 'kid', label: 'Caring for a child under 6 at home?', def: 0, options: yesNo },
  ],
  run: (v) => {
    const found: string[] = [];
    if (v.age <= 17 || v.age >= 50) found.push(v.age <= 17 ? 'Age 17 or younger' : 'Age 50 or older');
    if (v.hours >= 20) found.push('Paid work, 20+ hours a week');
    if (v.ws === 1) found.push('Work-study during the school year');
    if (v.kid === 1) found.push('Caring for a child under 6');
    return {
      head: ['Student exemption', found.length ? 'Exempt' : 'None found'],
      rows: [
        ['Exemption met', found[0] ?? '–'],
        ['Other exemptions met', found.length > 1 ? found.slice(1).join('; ') : '–'],
        ['Work hours still needed', v.hours >= 20 ? '0' : `${20 - v.hours} a week`],
      ],
      note: found.length ? 'An exemption only lifts the student rule: income and other SNAP tests still apply.' : 'Also exempt: unfit to work, on TANF, on-the-job training, an approved job training placement, or a single full-time parent of a child under 12.',
    };
  },
});
