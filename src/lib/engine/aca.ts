/**
 * Premium tax credit (26 U.S.C. 36B): credit = benchmark premium (second-lowest-cost silver plan)
 * − expected contribution (applicable percentage × household income). Applicable percentage table for
 * 2026: IRS Rev. Proc. 2025-25; income in % of the 2025 poverty guideline. Eligibility 100% to 400% FPL
 * in 2026 (the 2021 to 2025 table, with no 400% ceiling, expired after 2025).
 */
export type PctTable = Array<[number, number, number, number]>;

/** Applicable percentage at an income level (linear within a tier, 26 CFR 1.36B-3(g)). */
export function applicablePct(table: PctTable, fplPct: number): number {
  const p = Math.max(0, fplPct);
  const last = table[table.length - 1];
  const tier = table.find(([from, to]) => p >= from && p < to) ?? (p >= last[1] ? last : table[0]);
  const [from, to, a, b] = tier;
  if (a === b || to >= 100000) return a;
  return a + ((b - a) * (Math.min(p, to) - from)) / (to - from);
}

export interface PtcInput {
  /** Household MAGI for the year. */
  income: number;
  /** Poverty guideline for the household (prior year's guidelines for Marketplace coverage). */
  fplAnnual: number;
  /** Monthly premium of the benchmark plan (second-lowest-cost silver) for the household. */
  benchmarkMonthly: number;
  /** Monthly premium of the plan chosen (defaults to the benchmark). */
  planMonthly?: number;
  /** Eligible for Medicaid or CHIP (no credit). */
  medicaidEligible?: boolean;
}
export interface PtcResult {
  fplPct: number; eligible: boolean; applicablePct: number; expectedAnnual: number; expectedMonthly: number;
  creditMonthly: number; creditAnnual: number; netPremiumMonthly: number; reason: string;
}

export function ptc(table: PctTable, inp: PtcInput, opts: { minPct: number; maxPct: number | null }): PtcResult {
  const fplPct = (inp.income / inp.fplAnnual) * 100;
  const plan = inp.planMonthly ?? inp.benchmarkMonthly;
  let reason = '';
  let eligible = true;
  if (inp.medicaidEligible) { eligible = false; reason = 'Eligible for Medicaid or CHIP, which rules out the credit'; }
  else if (fplPct < opts.minPct) { eligible = false; reason = `Income below ${opts.minPct}% of the poverty guideline`; }
  else if (opts.maxPct != null && fplPct > opts.maxPct) { eligible = false; reason = `Income above ${opts.maxPct}% of the poverty guideline`; }
  const ap = applicablePct(table, fplPct);
  const expectedAnnual = (ap / 100) * inp.income;
  const expectedMonthly = expectedAnnual / 12;
  const creditMonthly = eligible ? Math.max(0, Math.min(plan, inp.benchmarkMonthly - expectedMonthly)) : 0;
  if (eligible && creditMonthly === 0) reason = 'Your expected contribution is higher than the benchmark premium';
  return { fplPct, eligible: eligible && creditMonthly > 0, applicablePct: ap, expectedAnnual, expectedMonthly, creditMonthly, creditAnnual: creditMonthly * 12, netPremiumMonthly: Math.max(0, plan - creditMonthly), reason };
}
