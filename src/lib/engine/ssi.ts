/**
 * SSI monthly payment (federal part): federal benefit rate − countable income.
 * Countable income: unearned income minus the $20 general exclusion (20 CFR 416.1124(c)(12)); earned income
 * minus any unused part of the $20, minus $65, then one half (20 CFR 416.1112). State supplements not included.
 */
export interface SsiParams { individual: number; couple: number; generalExclusion: number; earnedExclusion: number; earnedShareCounted: number }
export function ssi(p: SsiParams, inp: { couple: boolean; earned: number; unearned: number }) {
  const fbr = inp.couple ? p.couple : p.individual;
  const un = Math.max(0, inp.unearned);
  const ea = Math.max(0, inp.earned);
  const usedGeneral = Math.min(un, p.generalExclusion);
  const countUn = un - usedGeneral;
  const leftover = p.generalExclusion - usedGeneral;
  const countEa = (Math.max(0, ea - leftover - p.earnedExclusion) * p.earnedShareCounted) / 100;
  const countable = countUn + countEa;
  const payment = Math.max(0, Math.floor((fbr - countable) * 100) / 100);
  return { fbr, countableUnearned: countUn, countableEarned: countEa, countable, payment, eligibleOnIncome: payment > 0 };
}
