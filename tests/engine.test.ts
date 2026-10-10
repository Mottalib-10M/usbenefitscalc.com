/**
 * Engines against the official figures (research/ holds the documents). Each expected value cites
 * the table it comes from or is worked by hand from the published rule.
 */
import { describe, it, expect } from 'vitest';
import P from '../src/data/params-2026.json';
import STATES from '../src/data/states.json';
import { guideline, monthlyAtPct, type FplTable } from '../src/lib/engine/fpl';
import { bySize } from '../src/lib/engine/table';
import { snap, bbceLimit, type SnapParams, type SnapStateRules } from '../src/lib/engine/snap';
import { applicablePct, ptc, type PctTable } from '../src/lib/engine/aca';
import { eitc, deriveYear } from '../src/lib/engine/eitc';
import { wicIncome } from '../src/lib/engine/wic';
import { hudBand, hudLimits, tenantPayment } from '../src/lib/engine/section8';
import { ssi } from '../src/lib/engine/ssi';
import { medicaidCheck, medicaidLimit, type MedicaidLevels } from '../src/lib/engine/medicaid';
import AL from '../src/data/hud/AL.json';

const F26 = P.fpl['2026'] as unknown as FplTable;
const F25 = P.fpl['2025'] as unknown as FplTable;
const S = P.snap as unknown as SnapParams;
const st = (abbr: string) => (STATES as Array<{ abbr: string; area: 'us' | 'ak' | 'hi'; snap: { bbce: SnapStateRules['bbce'] }; medicaid: MedicaidLevels }>).find((s) => s.abbr === abbr)!;
const rules = (abbr: string): SnapStateRules => ({ area: st(abbr).area, bbce: st(abbr).snap.bbce });

describe('poverty guidelines (HHS 2026, 91 FR 1797)', () => {
  it('published amounts', () => {
    expect(guideline(F26, 'us', 1)).toBe(15960);
    expect(guideline(F26, 'us', 4)).toBe(33000);
    expect(guideline(F26, 'us', 8)).toBe(55720);
    expect(guideline(F26, 'ak', 4)).toBe(41250);
    expect(guideline(F26, 'hi', 4)).toBe(37950);
    expect(guideline(F25, 'us', 4)).toBe(32150);
    expect(guideline(F25, 'ak', 8)).toBe(67710);
    expect(guideline(F25, 'hi', 8)).toBe(62300);
  });
});

describe('SNAP FY 2027 tables (USDA memo of August 21, 2026)', () => {
  it('gross 130%, net 100% and 165% limits are the 2026 guideline × percent ÷ 12 rounded up', () => {
    for (const area of ['us', 'ak', 'hi'] as const) for (let n = 1; n <= 8; n++) {
      expect(bySize(P.snap.grossLimit[area], n), `${area} ${n}`).toBe(monthlyAtPct(F26, area, n, 130));
      expect(bySize(P.snap.netLimit[area], n), `${area} ${n}`).toBe(monthlyAtPct(F26, area, n, 100));
      expect(bySize(P.snap.gross165[area], n), `${area} ${n}`).toBe(monthlyAtPct(F26, area, n, 165));
    }
  });
  it('maximum allotments beyond 8 people', () => { expect(bySize(P.snap.maxAllotment.us, 9)).toBe(1841 + 225); });
  it('BBCE gross limit at 200% for 3 people', () => expect(bbceLimit(guideline(F26, 'us', 3), 200)).toBe(4554));
});

describe('SNAP benefit (7 CFR 273.9, 273.10)', () => {
  it('no income: maximum allotment', () => {
    const r = snap(S, rules('TX'), guideline(F26, 'us', 1), { size: 1, earned: 0, unearned: 0, elderlyDisabled: false, housing: 0, utilities: 0 });
    expect(r.benefit).toBe(306); expect(r.eligible).toBe(true);
  });
  it('family of 3 in Texas, $2,000 earnings, $1,000 rent, Texas HCSUA $445', () => {
    // 2000 − 400 (20%) − 217 = 1383; shelter 1445 − 691.50 = 753.50 (cap 769 not reached); net 629.50; 30% = 188.85 → 189; 808 − 189 = 619
    const r = snap(S, rules('TX'), guideline(F26, 'us', 3), { size: 3, earned: 2000, unearned: 0, elderlyDisabled: false, housing: 1000, utilities: 445 });
    expect(r.adjusted).toBe(1383); expect(r.deductions.shelter).toBe(753.5); expect(r.net).toBe(629.5); expect(r.benefit).toBe(619);
    expect(r.bbce?.grossPct).toBe(165); expect(r.grossLimit).toBe(3757);
  });
  it('shelter cap applies without an elderly member, not with one', () => {
    const base = { size: 2, earned: 0, unearned: 1000, housing: 1800, utilities: 500 };
    const a = snap(S, rules('CA'), guideline(F26, 'us', 2), { ...base, elderlyDisabled: false });
    const b = snap(S, rules('CA'), guideline(F26, 'us', 2), { ...base, elderlyDisabled: true });
    expect(a.deductions.shelter).toBe(769); expect(a.shelterCapped).toBe(true);
    expect(b.deductions.shelter).toBeGreaterThan(769);
  });
  it('elderly person on $1,200 Social Security, $700 rent, $445 SUA, $100 medical', () => {
    // 1200 − 217 − 65 (100 − 35) = 918; shelter 1145 − 459 = 686 (no cap); net 232; 30% 69.60 → 70; 306 − 70 = 236
    const r = snap(S, rules('TX'), guideline(F26, 'us', 1), { size: 1, earned: 0, unearned: 1200, elderlyDisabled: true, housing: 700, utilities: 445, medical: 100 });
    expect(r.net).toBe(232); expect(r.benefit).toBe(236);
  });
  it('minimum benefit for one person', () => {
    const r = snap(S, rules('TX'), guideline(F26, 'us', 1), { size: 1, earned: 1600, unearned: 0, elderlyDisabled: false, housing: 0, utilities: 0 });
    expect(r.benefit).toBe(25); expect(r.minimumApplied).toBe(true);
  });
  it('state without BBCE: gross test at 130% and federal asset limit', () => {
    const r = snap(S, rules('KS'), guideline(F26, 'us', 2), { size: 2, earned: 2400, unearned: 0, elderlyDisabled: false, housing: 900, utilities: 469, assets: 1000 });
    expect(r.bbce).toBeNull(); expect(r.grossLimit).toBe(2345); expect(r.grossTest).toBe('fail'); expect(r.benefit).toBe(0);
    const r2 = snap(S, rules('KS'), guideline(F26, 'us', 2), { size: 2, earned: 1500, unearned: 0, elderlyDisabled: false, housing: 900, utilities: 469, assets: 3500 });
    expect(r2.assetTest).toBe('fail');
  });
  it('the same household passes in a 200% BBCE state', () => {
    const r = snap(S, rules('CA'), guideline(F26, 'us', 2), { size: 2, earned: 2400, unearned: 0, elderlyDisabled: false, housing: 900, utilities: 663 });
    expect(r.bbce?.grossPct).toBe(200); expect(r.grossTest).toBe('pass'); expect(r.netTest).toBe('not-applied');
  });
  it('New York: BBCE only with earnings (150%) or dependent care (200%)', () => {
    const noEarn = snap(S, rules('NY'), guideline(F26, 'us', 2), { size: 2, earned: 0, unearned: 1900, elderlyDisabled: false, housing: 0, utilities: 0 });
    expect(noEarn.bbce).toBeNull();
    const earn = snap(S, rules('NY'), guideline(F26, 'us', 2), { size: 2, earned: 2500, unearned: 0, elderlyDisabled: false, housing: 1500, utilities: 877 });
    expect(earn.bbce?.grossPct).toBe(150);
  });
  it('Alaska and Hawaii use their own tables', () => {
    const ak = snap(S, rules('AK'), guideline(F26, 'ak', 4), { size: 4, earned: 0, unearned: 0, elderlyDisabled: false, housing: 0, utilities: 0, akArea: 'ak-rural2' });
    expect(ak.benefit).toBe(2027);
    const hi = snap(S, rules('HI'), guideline(F26, 'hi', 4), { size: 4, earned: 0, unearned: 0, elderlyDisabled: false, housing: 0, utilities: 0 });
    expect(hi.benefit).toBe(1655);
  });
});

describe('Medicaid levels (CMS table) with the 5% disregard', () => {
  it('expansion adult: 138% of the 2026 guideline', () => {
    const l = medicaidLimit(st('CA').medicaid, 'adult', F26, 'us', 1);
    expect(l.effectivePct).toBe(138); expect(l.monthly).toBe(1835);
  });
  it('non-expansion state: no adult group, parents at the state level', () => {
    expect(medicaidLimit(st('TX').medicaid, 'adult', F26, 'us', 1).pct).toBeNull();
    expect(medicaidLimit(st('TX').medicaid, 'parent', F26, 'us', 3).effectivePct).toBe(17);
  });
  it('children through CHIP in Texas (201%)', () => {
    const c = medicaidCheck(st('TX').medicaid, 'child6to18', F26, 'us', 4, 5000);
    expect(c.program).toBe('CHIP'); expect(c.effectivePct).toBe(206); expect(c.eligible).toBe(true);
  });
  it('Wisconsin covers adults to 95% + 5%', () => expect(medicaidLimit(st('WI').medicaid, 'adult', F26, 'us', 1).effectivePct).toBe(100));
  it('New York Basic Health Program band', () => {
    const c = medicaidCheck(st('NY').medicaid, 'adult', F26, 'us', 1, 2500);
    expect(c.eligible).toBe(false); expect(c.bhpEligible).toBe(true);
  });
});

describe('premium tax credit 2026 (Rev. Proc. 2025-25)', () => {
  const T = P.aca.table2026 as PctTable;
  it('applicable percentages', () => {
    expect(applicablePct(T, 120)).toBeCloseTo(2.1, 6);
    expect(applicablePct(T, 133)).toBeCloseTo(3.14, 6);
    expect(applicablePct(T, 175)).toBeCloseTo(5.395, 6);
    expect(applicablePct(T, 200)).toBeCloseTo(6.6, 6);
    expect(applicablePct(T, 400)).toBeCloseTo(9.96, 6);
  });
  it('the 400% ceiling: no credit at 401% in 2026, a credit under the 2021-2025 table', () => {
    const fpl = guideline(F25, 'us', 1);
    const inp = { income: fpl * 4.01, fplAnnual: fpl, benchmarkMonthly: 900 };
    expect(ptc(T, inp, { minPct: 100, maxPct: 400 }).creditMonthly).toBe(0);
    const old = ptc(P.aca.table2021to2025 as PctTable, inp, { minPct: 100, maxPct: null });
    expect(old.creditMonthly).toBeCloseTo(900 - (0.085 * fpl * 4.01) / 12, 6);
  });
  it('a single adult at $31,300 (200% of the 2025 guideline) with a $500 benchmark', () => {
    const r = ptc(T, { income: 31300, fplAnnual: 15650, benchmarkMonthly: 500 }, { minPct: 100, maxPct: 400 });
    expect(r.expectedMonthly).toBeCloseTo((0.066 * 31300) / 12, 6); expect(r.creditMonthly).toBeCloseTo(500 - 172.15, 6);
  });
});

describe('EITC', () => {
  const y26 = { ...P.eitc['2026'] };
  it('2026 completed phaseouts follow from threshold + maximum ÷ phaseout rate (Rev. Proc. 2025-32)', () => {
    for (let k = 0; k < 4; k++) {
      expect(Math.abs(y26.thresholdSingle[k] + y26.maxCredit[k] / (P.eitc.phaseOut[k] / 100) - y26.completedSingle[k])).toBeLessThan(2);
      expect(Math.abs(y26.thresholdJoint[k] + y26.maxCredit[k] / (P.eitc.phaseOut[k] / 100) - y26.completedJoint[k])).toBeLessThan(2);
      expect(Math.abs(y26.earnedIncomeAmount[k] * (P.eitc.phaseIn[k] / 100) - y26.maxCredit[k])).toBeLessThan(1);
    }
  });
  it('2026 credits', () => {
    const run = (children: number, earned: number, joint = false) => eitc(y26, P.eitc.phaseIn, P.eitc.phaseOut, { children, joint, earned }, { min: 25, max: 64 }).credit;
    expect(run(1, 13020)).toBe(4427);
    expect(run(2, 20000)).toBe(7316);
    expect(run(3, 18290, true)).toBe(8231);
    expect(run(0, 8680)).toBe(664);
    expect(run(1, 51593)).toBe(0);
    expect(run(2, 40000)).toBe(Math.round(7316 - 0.2106 * (40000 - 23890)));
  });
  it('2025 thresholds derived from the IRS table', () => {
    const y25 = deriveYear(P.eitc['2025'], P.eitc.phaseOut);
    expect(y25.thresholdSingle[1]).toBe(23350);
    expect(eitc(y25, P.eitc.phaseIn, P.eitc.phaseOut, { children: 1, joint: false, earned: 50434 }, { min: 25, max: 64 }).credit).toBe(0);
  });
  it('childless age rule and investment income', () => {
    expect(eitc(y26, P.eitc.phaseIn, P.eitc.phaseOut, { children: 0, joint: false, earned: 9000, age: 23 }, { min: 25, max: 64 }).credit).toBe(0);
    expect(eitc(y26, P.eitc.phaseIn, P.eitc.phaseOut, { children: 1, joint: false, earned: 15000, investment: 13000 }, { min: 25, max: 64 }).credit).toBe(0);
  });
});

describe('WIC 2026/2027 (91 FR 23050)', () => {
  it('185% table = 2026 guideline × 1.85 rounded up; monthly = annual ÷ 12 rounded up', () => {
    for (let n = 1; n <= 8; n++) {
      expect(bySize(P.wic.annual.us, n)).toBe(Math.ceil(guideline(F26, 'us', n) * 1.85));
      expect(bySize(P.wic.monthly.us, n)).toBe(Math.ceil(bySize(P.wic.annual.us, n) / 12));
    }
  });
  it('a pregnant woman counts the expected baby', () => {
    const r = wicIncome(P.wic.annual.us, { size: 1, expectedBabies: 1, annualIncome: 40000 });
    expect(r.size).toBe(2); expect(r.eligible).toBe(true);
    expect(wicIncome(P.wic.annual.us, { size: 4, annualIncome: 90000, adjunctive: true }).viaAdjunctive).toBe(true);
  });
});

describe('HUD FY 2026 limits and tenant payment', () => {
  const autauga = (AL as { rows: Array<{ n: string; v: number[]; e: number[]; l: number[] }> }).rows.find((r) => r.n === 'Autauga County')!;
  it('Autauga County, Alabama (HUD file)', () => {
    expect(hudLimits(autauga, 4)).toEqual({ eli: 33000, vli: 44400, li: 71050 });
    expect(hudBand(autauga, 4, 40000)).toBe('very-low');
  });
  it('total tenant payment', () => {
    // 24000 − 2 × 500 = 23000 adjusted; 30% of 1916.67 = 575; 10% of 2000 = 200
    const r = tenantPayment(P.hud, { annualIncome: 24000, dependents: 2, elderlyDisabled: false });
    expect(r.adjusted).toBe(23000); expect(r.ttp).toBe(575);
    const e = tenantPayment(P.hud, { annualIncome: 14000, dependents: 0, elderlyDisabled: true, medical: 2400 });
    expect(e.adjusted).toBe(14000 - 550 - 1000); expect(e.ttp).toBe(Math.round((12450 / 12) * 0.3));
  });
});

describe('SSI 2026 (SSA)', () => {
  it('federal benefit rates and exclusions', () => {
    expect(ssi(P.ssi, { couple: false, earned: 0, unearned: 0 }).payment).toBe(994);
    expect(ssi(P.ssi, { couple: false, earned: 0, unearned: 500 }).payment).toBe(514);
    expect(ssi(P.ssi, { couple: false, earned: 1000, unearned: 0 }).payment).toBe(536.5);
    expect(ssi(P.ssi, { couple: true, earned: 0, unearned: 1600 }).payment).toBe(0);
  });
});

describe('state data', () => {
  it('51 jurisdictions with SNAP, Medicaid and HUD data', () => {
    expect(STATES.length).toBe(51);
    for (const s of STATES as Array<{ abbr: string; hud: { rows: number }; medicaid: MedicaidLevels; snap: { sua: unknown[] } }>) {
      expect(s.hud.rows, s.abbr).toBeGreaterThan(0);
      expect(s.medicaid.child6to18, s.abbr).toBeGreaterThan(100);
      expect(s.snap.sua.length, s.abbr).toBeGreaterThan(0);
    }
  });
});
