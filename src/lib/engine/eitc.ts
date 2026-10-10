/**
 * Earned income tax credit (26 U.S.C. 32). credit = min(phase-in % × earned income, maximum)
 * − phaseout % × (max(AGI, earned income) − threshold), never below zero.
 * Amounts by tax year: IRS Rev. Proc. 2025-32 (2026); IRS EITC tables (2025, maximum and completed phaseout).
 * The IRS tables compute the credit on $50 income bands, so a table result can differ by a few dollars.
 */
export interface EitcYear {
  maxCredit: number[];
  thresholdSingle: number[]; thresholdJoint: number[];
  completedSingle: number[]; completedJoint: number[];
  investmentIncomeLimit: number;
}
export interface EitcInput { children: number; joint: boolean; earned: number; agi?: number; investment?: number; age?: number }
export interface EitcResult { credit: number; maxCredit: number; phaseInEnd: number; threshold: number; completed: number; stage: 'phase-in' | 'plateau' | 'phase-out' | 'none'; reason: string }

/** Thresholds of a year published only as maximum credit and completed phaseout (2025): derived from the statutory rates. */
export function deriveYear(y: { maxCredit: number[]; completedSingle: number[]; completedJoint: number[]; investmentIncomeLimit: number }, phaseOut: number[]): EitcYear {
  const th = (c: number[]) => c.map((x, i) => Math.round(x - y.maxCredit[i] / (phaseOut[i] / 100)));
  return { ...y, thresholdSingle: th(y.completedSingle), thresholdJoint: th(y.completedJoint) };
}

export function eitc(y: EitcYear, phaseIn: number[], phaseOut: number[], inp: EitcInput, ages: { min: number; max: number }): EitcResult {
  const k = Math.min(3, Math.max(0, Math.round(inp.children)));
  const max = y.maxCredit[k];
  const threshold = (inp.joint ? y.thresholdJoint : y.thresholdSingle)[k];
  const completed = (inp.joint ? y.completedJoint : y.completedSingle)[k];
  const phaseInEnd = max / (phaseIn[k] / 100);
  const base = { maxCredit: max, phaseInEnd, threshold, completed };
  const earned = Math.max(0, inp.earned);
  const income = Math.max(earned, inp.agi ?? earned);
  if ((inp.investment ?? 0) > y.investmentIncomeLimit) return { ...base, credit: 0, stage: 'none', reason: 'Investment income above the limit' };
  if (k === 0 && inp.age != null && (inp.age < ages.min || inp.age > ages.max)) return { ...base, credit: 0, stage: 'none', reason: `Without a qualifying child you must be ${ages.min} to ${ages.max}` };
  if (earned <= 0) return { ...base, credit: 0, stage: 'none', reason: 'No earned income' };
  const up = Math.min(max, (phaseIn[k] / 100) * earned);
  const down = Math.max(0, (phaseOut[k] / 100) * (income - threshold));
  const credit = Math.max(0, Math.round(up - down));
  const stage = credit === 0 ? 'none' : down > 0 ? 'phase-out' : up < max ? 'phase-in' : 'plateau';
  return { ...base, credit, stage, reason: credit === 0 ? 'Income at or above the completed phaseout' : '' };
}
