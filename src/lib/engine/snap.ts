/**
 * SNAP eligibility and monthly benefit, FY 2027 (October 1, 2026 to September 30, 2027).
 * Rules: 7 CFR 273.9 (income, deductions), 7 CFR 273.10(e) (benefit), USDA FY 2027 COLA memo (amounts),
 * USDA FNA broad-based categorical eligibility chart (state gross limits and asset limits).
 *
 * benefit = maximum allotment − 30% of net income (30% rounded up to the dollar, option 1 of 273.10(e)(2)(ii)(A));
 * eligible households of 1 or 2 people get at least the minimum benefit.
 */
import { bySize } from './table';
import type { Area } from './fpl';

export type SnapArea = 'us' | 'ak-urban' | 'ak-rural1' | 'ak-rural2' | 'hi';
export interface SnapParams {
  maxAllotment: Record<SnapArea, number[]>;
  minBenefit: Record<SnapArea, number>;
  standardDeduction: Record<Area, number[]>;
  shelterCap: Record<Area, number>;
  homelessShelter: number;
  assets: { general: number; elderlyDisabled: number };
  netLimit: Record<Area, number[]>;
  grossLimit: Record<Area, number[]>;
  earnedIncomeDeduction: number;
  medicalThreshold: number;
  benefitReductionRate: number;
  shelterShareOfIncome: number;
}
export type BbceWho = 'all' | 'elderly-disabled' | 'non-elderly-disabled' | 'dependent-care' | 'earned-income';
export interface BbceRule { who: BbceWho; grossPct: number; assetLimit: number | null }
export interface SnapStateRules { area: Area; bbce: BbceRule[] }
export interface SnapInput {
  size: number;
  /** Monthly gross earnings (wages, self-employment net of costs). */
  earned: number;
  /** Monthly unearned income (Social Security, SSI, unemployment, child support received…). */
  unearned: number;
  /** A member is 60 or older or receives disability benefits. */
  elderlyDisabled: boolean;
  /** Rent or mortgage, property tax and home insurance, per month. */
  housing: number;
  /** Utility amount used for the shelter deduction: the state SUA chosen, or actual costs. */
  utilities: number;
  dependentCare?: number;
  childSupportPaid?: number;
  /** Out-of-pocket medical costs of the elderly or disabled member, per month. */
  medical?: number;
  homeless?: boolean;
  /** Countable resources (cash, bank accounts). Undefined = not tested. */
  assets?: number;
  /** Alaska only: urban, rural 1 or rural 2 allotment area. */
  akArea?: 'ak-urban' | 'ak-rural1' | 'ak-rural2';
}
export interface SnapResult {
  eligible: boolean;
  benefit: number;
  maxAllotment: number;
  gross: number;
  grossLimit: number | null;
  grossTest: 'pass' | 'fail' | 'not-applied';
  net: number;
  netLimit: number;
  netTest: 'pass' | 'fail' | 'not-applied';
  assetLimit: number | null;
  assetTest: 'pass' | 'fail' | 'not-applied';
  /** Broad-based categorical eligibility applied (state gross limit, no net test). */
  bbce: BbceRule | null;
  bbceGrossLimit: number | null;
  deductions: { earned: number; standard: number; dependentCare: number; childSupport: number; medical: number; shelter: number };
  adjusted: number;
  shelterCosts: number;
  excessShelter: number;
  shelterCapped: boolean;
  thirtyPercent: number;
  minimumApplied: boolean;
  /** Plain-English reason when not eligible or when a special rule decided the amount. */
  reason: string;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

/** Gross income limit of a BBCE rule: percent of the poverty guideline, monthly, rounded up. */
export const bbceLimit = (fplAnnual: number, pct: number) => Math.ceil(r2((fplAnnual * pct) / 100 / 12));

/** The BBCE rule that applies to this household, if the state has one for it. */
export function bbceRuleFor(rules: SnapStateRules, inp: Pick<SnapInput, 'elderlyDisabled' | 'dependentCare' | 'earned'>): BbceRule | null {
  const pick = (w: BbceWho) => rules.bbce.find((b) => b.who === w) ?? null;
  return (
    pick('all') ??
    (inp.elderlyDisabled ? pick('elderly-disabled') : pick('non-elderly-disabled')) ??
    ((inp.dependentCare ?? 0) > 0 ? pick('dependent-care') : null) ??
    (inp.earned > 0 ? pick('earned-income') : null)
  );
}

export function snap(p: SnapParams, rules: SnapStateRules, fplAnnual: number, inp: SnapInput): SnapResult {
  const area = rules.area;
  const allotArea: SnapArea = area === 'ak' ? inp.akArea ?? 'ak-urban' : area;
  const size = Math.max(1, Math.round(inp.size));
  const earned = Math.max(0, inp.earned);
  const gross = r2(earned + Math.max(0, inp.unearned));
  const ed = !!inp.elderlyDisabled;

  // Deductions (7 CFR 273.9(d))
  const dEarned = r2((earned * p.earnedIncomeDeduction) / 100);
  const std = p.standardDeduction[area];
  const dStd = std[Math.min(size, std.length) - 1];
  const dCare = Math.max(0, inp.dependentCare ?? 0);
  const dCs = Math.max(0, inp.childSupportPaid ?? 0);
  const dMed = ed ? Math.max(0, (inp.medical ?? 0) - p.medicalThreshold) : 0;
  const adjusted = Math.max(0, r2(gross - dEarned - dStd - dCare - dCs - dMed));
  const shelterCosts = Math.max(0, inp.housing) + Math.max(0, inp.utilities);
  const excess = Math.max(0, r2(shelterCosts - (adjusted * p.shelterShareOfIncome) / 100));
  const cap = p.shelterCap[area];
  const capped = !ed && excess > cap;
  let dShelter = capped ? cap : excess;
  if (inp.homeless) dShelter = Math.max(dShelter, p.homelessShelter);
  const net = Math.max(0, r2(adjusted - dShelter));

  // Tests
  const rule = bbceRuleFor(rules, { elderlyDisabled: ed, dependentCare: dCare, earned });
  const bbceGross = rule ? bbceLimit(fplAnnual, rule.grossPct) : null;
  const assets = inp.assets;
  const catElig = !!rule && gross <= (bbceGross as number) && (rule.assetLimit == null || assets == null || assets <= rule.assetLimit);
  const grossLimit = bySize(p.grossLimit[area], size);
  const netLimit = bySize(p.netLimit[area], size);
  const fedAsset = ed ? p.assets.elderlyDisabled : p.assets.general;

  let grossTest: SnapResult['grossTest'], netTest: SnapResult['netTest'], assetTest: SnapResult['assetTest'];
  let assetLimit: number | null;
  if (catElig) {
    grossTest = 'pass'; netTest = 'not-applied';
    assetLimit = rule!.assetLimit; assetTest = assetLimit == null || assets == null ? 'not-applied' : 'pass';
  } else {
    grossTest = ed ? 'not-applied' : gross <= grossLimit ? 'pass' : 'fail';
    netTest = net <= netLimit ? 'pass' : 'fail';
    assetLimit = fedAsset; assetTest = assets == null ? 'not-applied' : assets <= fedAsset ? 'pass' : 'fail';
  }
  const passes = grossTest !== 'fail' && netTest !== 'fail' && assetTest !== 'fail';

  const max = bySize(p.maxAllotment[allotArea], size);
  const thirty = Math.ceil(r2((net * p.benefitReductionRate) / 100));
  let benefit = Math.max(0, max - thirty);
  let minimumApplied = false;
  let reason = '';
  if (!passes) {
    benefit = 0;
    reason = grossTest === 'fail' ? 'Gross income is above the limit' : netTest === 'fail' ? 'Net income is above the limit' : 'Resources are above the limit';
  } else if (size <= 2 && benefit < p.minBenefit[allotArea]) {
    benefit = p.minBenefit[allotArea]; minimumApplied = true; reason = 'Minimum benefit for a household of one or two';
  } else if (benefit <= 0) {
    reason = 'Eligible on income, but 30% of net income is above the maximum allotment';
  }
  return {
    eligible: passes && benefit > 0, benefit, maxAllotment: max, gross, grossLimit: catElig ? bbceGross : ed ? null : grossLimit, grossTest,
    net, netLimit, netTest, assetLimit, assetTest, bbce: catElig ? rule : null, bbceGrossLimit: bbceGross,
    deductions: { earned: dEarned, standard: dStd, dependentCare: dCare, childSupport: dCs, medical: dMed, shelter: r2(dShelter) },
    adjusted, shelterCosts, excessShelter: excess, shelterCapped: capped, thirtyPercent: thirty, minimumApplied, reason,
  };
}
