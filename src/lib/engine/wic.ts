/**
 * WIC income test (7 CFR 246.7): household income at or below 185% of the poverty guideline
 * (2026/2027 guidelines), or adjunctive eligibility through SNAP, Medicaid or TANF.
 * A pregnant woman counts each expected baby in the household size.
 */
import { bySize } from './table';
export interface WicInput { size: number; expectedBabies?: number; annualIncome: number; adjunctive?: boolean }
export function wicIncome(annualTable: number[], inp: WicInput) {
  const size = Math.max(1, Math.round(inp.size)) + Math.max(0, Math.round(inp.expectedBabies ?? 0));
  const limit = bySize(annualTable, size);
  const byIncome = inp.annualIncome <= limit;
  return { size, limit, monthlyLimit: Math.ceil(limit / 12), byIncome, eligible: byIncome || !!inp.adjunctive, viaAdjunctive: !byIncome && !!inp.adjunctive };
}
