/**
 * What a page file needs to write figures into its title, description, answer block, body and FAQ
 * without typing a single official number (RECETTE §17.4, point 7): the data, the engines, the formatters.
 *   import { sd, snapMax, usd } from '../../lib/kit';
 *   title: `Texas SNAP and Medicaid Limits 2026: ${usd(snapMax(4))} Food Aid for 4`
 * Server side only (eager loaders): never import this file from a component that ships to the browser.
 */
import P from '../data/params-2026.json';
import STATES_JSON from '../data/states.json';
import { STATE_LIST, stateRef, type StateRef } from '../data/states';
import { guideline, pctOfFpl, monthlyAtPct, type Area, type FplTable } from './engine/fpl';
import { bySize } from './engine/table';
import { snap, bbceLimit, type SnapInput, type SnapParams, type SnapResult } from './engine/snap';
import { medicaidLimit, medicaidCheck, bhpLimit, type MedicaidGroup } from './engine/medicaid';
import { ptc, applicablePct, type PctTable } from './engine/aca';
import { eitc, deriveYear, type EitcYear } from './engine/eitc';
import { wicIncome } from './engine/wic';
import { hudLimits, tenantPayment, type HudRow, type RentInput } from './engine/section8';
import { ssi } from './engine/ssi';
import { usd, usdx, pct, num, day, listOf } from './fmt';
import type { StateData, SuaRow } from './state-types';
import { suaRowOf } from './sua';

export const STATES = STATES_JSON as unknown as StateData[];
const need = <T>(x: T | undefined, what: string): T => { if (x === undefined) throw new Error(`No data: ${what}`); return x; };
export const sd = (slug: string): StateData => need(STATES.find((s) => s.slug === slug), `state ${slug}`);
export const st = (slug: string): StateRef => stateRef(slug);
export const states = STATE_LIST;

/* Poverty guidelines */
export const FPL26 = P.fpl['2026'] as unknown as FplTable;
export const FPL25 = P.fpl['2025'] as unknown as FplTable;
/** Annual poverty guideline (2026 by default; 2025 is the one used for 2026 Marketplace coverage). */
export const fpl = (size: number, area: Area = 'us', year: 2025 | 2026 = 2026) => guideline(year === 2025 ? FPL25 : FPL26, area, size);
export const fplAt = (size: number, percent: number, area: Area = 'us', year: 2025 | 2026 = 2026) => (fpl(size, area, year) * percent) / 100;
export const fplMonthlyAt = (size: number, percent: number, area: Area = 'us') => monthlyAtPct(FPL26, area, size, percent);
export const fplPctOf = (size: number, annual: number, area: Area = 'us', year: 2025 | 2026 = 2026) => pctOfFpl(year === 2025 ? FPL25 : FPL26, area, size, annual);

/* SNAP FY 2027 */
const SP = P.snap as unknown as SnapParams;
export const snapMax = (size: number, area: 'us' | 'ak-urban' | 'ak-rural1' | 'ak-rural2' | 'hi' = 'us') => bySize(P.snap.maxAllotment[area], size);
export const snapMaxPrev = (size: number) => bySize(P.snap.previous.maxAllotmentUs, size);
export const snapGross = (size: number, area: Area = 'us') => bySize(P.snap.grossLimit[area], size);
export const snapNet = (size: number, area: Area = 'us') => bySize(P.snap.netLimit[area], size);
export const snapGross165 = (size: number, area: Area = 'us') => bySize(P.snap.gross165[area], size);
export const snapStd = (size: number, area: Area = 'us') => P.snap.standardDeduction[area][Math.min(6, Math.max(1, size)) - 1];
/** The BBCE rule that covers every household of the state, or null. */
export const bbceAll = (slug: string) => sd(slug).snap.bbce.find((b) => b.who === 'all') ?? null;
/** Gross income limit of the state for a household (BBCE % when the state has one for everyone, else 130%). */
export const snapGrossState = (slug: string, size: number) => { const s = sd(slug); const b = bbceAll(slug); return b ? bbceLimit(fpl(size, s.area), b.grossPct) : snapGross(size, s.area); };
/** Default SUA row of a state for a household size (lib/sua.ts). */
export const suaRow = (slug: string, size = 1, region?: string): SuaRow | null => suaRowOf(sd(slug).snap.sua, slug, size, region);
export const sua = (slug: string, size = 1): number | null => { const r = suaRow(slug, size); return r && r.hcsua ? r.hcsua : null; };
export const snapCalc = (slug: string, inp: Partial<SnapInput> & { size: number }): SnapResult => {
  const s = sd(slug);
  const utilities = inp.utilities ?? sua(slug, inp.size) ?? 0;
  return snap(SP, { area: s.area, bbce: s.snap.bbce }, fpl(inp.size, s.area), { earned: 0, unearned: 0, elderlyDisabled: false, housing: 0, ...inp, utilities });
};

/* Medicaid and CHIP */
export const med = (slug: string) => sd(slug).medicaid;
export const medLimit = (slug: string, group: MedicaidGroup, size: number) => medicaidLimit(med(slug), group, FPL26, sd(slug).area, size, P.medicaid.disregardPct);
export const medCheck = (slug: string, group: MedicaidGroup, size: number, monthly: number) => medicaidCheck(med(slug), group, FPL26, sd(slug).area, size, monthly, P.medicaid.disregardPct);
export const bhpOf = (slug: string, size: number) => bhpLimit(med(slug), FPL26, sd(slug).area, size, P.medicaid.disregardPct);
export const expansionStates = () => STATES.filter((s) => s.medicaid.expansion);

/* Premium tax credit 2026 */
export const T26 = P.aca.table2026 as PctTable;
export const TOLD = P.aca.table2021to2025 as PctTable;
export const apct = (fplPercent: number, table: PctTable = T26) => applicablePct(table, fplPercent);
export const acaCalc = (income: number, size: number, benchmarkMonthly: number, area: Area = 'us', old = false) =>
  ptc(old ? TOLD : T26, { income, fplAnnual: fpl(size, area, 2025), benchmarkMonthly }, old ? { minPct: 100, maxPct: null } : { minPct: P.aca.minPct, maxPct: P.aca.maxPct });
export const acaCliff = (size: number, area: Area = 'us') => fplAt(size, P.aca.maxPct, area, 2025);

/* EITC */
export const EITC26 = P.eitc['2026'] as unknown as EitcYear;
export const EITC25 = deriveYear(P.eitc['2025'], P.eitc.phaseOut);
export const eitcCalc = (children: number, earned: number, joint = false, year: 2025 | 2026 = 2026, agi?: number) =>
  eitc(year === 2025 ? EITC25 : EITC26, P.eitc.phaseIn, P.eitc.phaseOut, { children, joint, earned, agi }, { min: P.eitc.childlessAgeMin, max: P.eitc.childlessAgeMax });

/* WIC 2026/2027 */
export const wicAnnual = (size: number) => bySize(P.wic.annual.us, size);
export const wicMonthly = (size: number) => bySize(P.wic.monthly.us, size);
export const wicCheck = (size: number, annualIncome: number, expectedBabies = 0, adjunctive = false) => wicIncome(P.wic.annual.us, { size, annualIncome, expectedBabies, adjunctive });

/* HUD FY 2026 */
const HUD = Object.fromEntries(Object.entries(import.meta.glob<{ default: { abbr: string; rows: HudRow[] } }>('../data/hud/*.json', { eager: true })).map(([f, m]) => [f.split('/').pop()!.replace(/\.json$/, ''), m.default.rows]));
export const hudRows = (slug: string): HudRow[] => need(HUD[sd(slug).abbr], `hud ${slug}`);
export const hudRow = (slug: string, name: string): HudRow => need(hudRows(slug).find((r) => r.n === name), `hud ${slug} ${name}`);
export const hudOf = (slug: string, name: string, size: number) => hudLimits(hudRow(slug, name), size);
export const rentCalc = (inp: RentInput) => tenantPayment(P.hud, inp);

/* SSI 2026 */
export const ssiCalc = (earned: number, unearned: number, couple = false) => ssi(P.ssi, { couple, earned, unearned });

export { P, usd, usdx, pct, num, day, listOf };
export type { StateRef, StateData };

export interface Kit {
  P: typeof P; STATES: typeof STATES; states: StateRef[]; sd: typeof sd; st: typeof st;
  fpl: typeof fpl; fplAt: typeof fplAt; fplMonthlyAt: typeof fplMonthlyAt; fplPctOf: typeof fplPctOf;
  snapMax: typeof snapMax; snapMaxPrev: typeof snapMaxPrev; snapGross: typeof snapGross; snapNet: typeof snapNet; snapGross165: typeof snapGross165; snapStd: typeof snapStd;
  bbceAll: typeof bbceAll; snapGrossState: typeof snapGrossState; sua: typeof sua; suaRow: typeof suaRow; snapCalc: typeof snapCalc;
  med: typeof med; medLimit: typeof medLimit; medCheck: typeof medCheck; bhpOf: typeof bhpOf; expansionStates: typeof expansionStates;
  apct: typeof apct; acaCalc: typeof acaCalc; acaCliff: typeof acaCliff;
  eitcCalc: typeof eitcCalc; wicAnnual: typeof wicAnnual; wicMonthly: typeof wicMonthly; wicCheck: typeof wicCheck;
  hudRows: typeof hudRows; hudRow: typeof hudRow; hudOf: typeof hudOf; rentCalc: typeof rentCalc; ssiCalc: typeof ssiCalc;
  usd: typeof usd; usdx: typeof usdx; pct: typeof pct; num: typeof num; day: typeof day; listOf: typeof listOf;
}
export const KIT: Kit = { P, STATES, states, sd, st, fpl, fplAt, fplMonthlyAt, fplPctOf, snapMax, snapMaxPrev, snapGross, snapNet, snapGross165, snapStd, bbceAll, snapGrossState, sua, suaRow, snapCalc, med, medLimit, medCheck, bhpOf, expansionStates, apct, acaCalc, acaCliff, eitcCalc, wicAnnual, wicMonthly, wicCheck, hudRows, hudRow, hudOf, rentCalc, ssiCalc, usd, usdx, pct, num, day, listOf };
