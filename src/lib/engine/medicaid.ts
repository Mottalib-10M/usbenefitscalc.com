/**
 * Medicaid and CHIP income thresholds for MAGI groups (CMS table of state eligibility levels).
 * The limit tested is the state level plus the 5% of FPL disregard (42 CFR 435.603(d)(4)),
 * applied to the current-year poverty guideline (2026).
 */
import { guideline, type Area, type FplTable } from './fpl';

export interface MedicaidLevels {
  child0to1: number | null; child1to5: number | null; child6to18: number | null;
  chip: number | null; chipAges: string | null;
  pregnant: number | null; pregnantChip: number | null;
  parent: number | null; parentDollarStandard: boolean;
  expansion: boolean; adultPct: number | null; bhpPct: number | null;
}
export type MedicaidGroup = 'adult' | 'parent' | 'pregnant' | 'infant' | 'child1to5' | 'child6to18';
export interface MedicaidLimit {
  group: MedicaidGroup;
  /** State level in % of FPL (without the disregard), null when the group has no coverage. */
  pct: number | null;
  /** Level used for the test: pct + disregard. */
  effectivePct: number | null;
  program: 'Medicaid' | 'CHIP' | 'Medicaid (adult group)' | 'Basic Health Program' | 'none';
  monthly: number | null;
  annual: number | null;
}

const chipCovers = (lv: MedicaidLevels, group: MedicaidGroup) => {
  if (lv.chip == null) return false;
  if (group === 'infant' && lv.chipAges && /^1 up to/.test(lv.chipAges)) return false;
  return group === 'infant' || group === 'child1to5' || group === 'child6to18';
};

/** Best threshold for a group, and the program that carries it. */
export function medicaidLimit(lv: MedicaidLevels, group: MedicaidGroup, fpl: FplTable, area: Area, size: number, disregard = 5): MedicaidLimit {
  let pct: number | null = null; let program: MedicaidLimit['program'] = 'none';
  const take = (p: number | null, prog: MedicaidLimit['program']) => { if (p != null && (pct == null || p > pct)) { pct = p; program = prog; } };
  if (group === 'adult') {
    if (lv.adultPct != null) take(lv.adultPct, lv.expansion ? 'Medicaid (adult group)' : 'Medicaid');
  } else if (group === 'parent') {
    take(lv.parent, 'Medicaid');
    if (lv.expansion && lv.adultPct != null) take(lv.adultPct, 'Medicaid (adult group)');
  } else if (group === 'pregnant') {
    take(lv.pregnant, 'Medicaid'); take(lv.pregnantChip, 'CHIP');
  } else {
    take(group === 'infant' ? lv.child0to1 : group === 'child1to5' ? lv.child1to5 : lv.child6to18, 'Medicaid');
    if (chipCovers(lv, group)) take(lv.chip, 'CHIP');
  }
  const g = guideline(fpl, area, size);
  const eff = pct == null ? null : (pct as number) + disregard;
  return { group, pct, effectivePct: eff, program, monthly: eff == null ? null : Math.floor((g * eff) / 100 / 12), annual: eff == null ? null : Math.floor((g * eff) / 100) };
}

/** Basic Health Program band (Minnesota, New York): above Medicaid up to bhpPct + disregard. */
export function bhpLimit(lv: MedicaidLevels, fpl: FplTable, area: Area, size: number, disregard = 5) {
  if (lv.bhpPct == null) return null;
  const g = guideline(fpl, area, size);
  return { pct: lv.bhpPct, effectivePct: lv.bhpPct + disregard, monthly: Math.floor((g * (lv.bhpPct + disregard)) / 100 / 12) };
}

export function medicaidCheck(lv: MedicaidLevels, group: MedicaidGroup, fpl: FplTable, area: Area, size: number, monthlyIncome: number, disregard = 5) {
  const lim = medicaidLimit(lv, group, fpl, area, size, disregard);
  const pctIncome = ((monthlyIncome * 12) / guideline(fpl, area, size)) * 100;
  const eligible = lim.effectivePct != null && pctIncome <= lim.effectivePct;
  const bhp = group === 'adult' || group === 'parent' ? bhpLimit(lv, fpl, area, size, disregard) : null;
  const bhpEligible = !eligible && bhp != null && pctIncome <= bhp.effectivePct;
  return { ...lim, pctIncome, eligible, bhp, bhpEligible };
}
