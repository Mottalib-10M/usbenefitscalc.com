/**
 * HUD FY 2026 income limits (county or HUD area) and the voucher tenant payment.
 * Limits: extremely low (ELI, 30%), very low (50%), low (80%), household sizes 1 to 8.
 * Total tenant payment (24 CFR 5.628): the highest of 30% of monthly adjusted income, 10% of monthly
 * income and the minimum rent; adjusted income (24 CFR 5.611): $500 per dependent and $550 per elderly or
 * disabled family in 2026, child care, and medical costs of an elderly or disabled family above 10% of income.
 */
export interface HudRow { n: string; area: string; metro: number; median: number; v: number[]; e: number[]; l: number[] }
export type HudBand = 'extremely-low' | 'very-low' | 'low' | 'above';
export function hudLimits(row: Pick<HudRow, 'v' | 'e' | 'l'>, size: number) {
  const i = Math.min(8, Math.max(1, Math.round(size))) - 1;
  return { eli: row.e[i], vli: row.v[i], li: row.l[i] };
}
export function hudBand(row: Pick<HudRow, 'v' | 'e' | 'l'>, size: number, annualIncome: number): HudBand {
  const { eli, vli, li } = hudLimits(row, size);
  return annualIncome <= eli ? 'extremely-low' : annualIncome <= vli ? 'very-low' : annualIncome <= li ? 'low' : 'above';
}
export interface RentInput { annualIncome: number; dependents: number; elderlyDisabled: boolean; childCare?: number; medical?: number; minimumRent?: number }
export interface RentParams { dependentDeduction: number; elderlyDisabledDeduction: number; medicalThresholdPct: number; rentShareAdjusted: number; rentShareGross: number }
export function tenantPayment(p: RentParams, inp: RentInput) {
  const inc = Math.max(0, inp.annualIncome);
  const dDep = Math.max(0, Math.round(inp.dependents)) * p.dependentDeduction;
  const dEd = inp.elderlyDisabled ? p.elderlyDisabledDeduction : 0;
  const dCare = Math.max(0, inp.childCare ?? 0);
  const dMed = inp.elderlyDisabled ? Math.max(0, (inp.medical ?? 0) - (inc * p.medicalThresholdPct) / 100) : 0;
  const adjusted = Math.max(0, inc - dDep - dEd - dCare - dMed);
  const a = Math.round(((adjusted / 12) * p.rentShareAdjusted) / 100);
  const g = Math.round(((inc / 12) * p.rentShareGross) / 100);
  const m = Math.max(0, inp.minimumRent ?? 0);
  const ttp = Math.max(a, g, m);
  return { adjusted, deductions: { dependents: dDep, elderlyDisabled: dEd, childCare: dCare, medical: dMed }, thirtyAdjusted: a, tenGross: g, minimumRent: m, ttp, rule: ttp === a ? '30% of adjusted income' : ttp === g ? '10% of gross income' : 'minimum rent' };
}
