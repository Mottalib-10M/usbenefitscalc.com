/** HHS poverty guidelines (annual dollars): first person + each additional person, by area. */
export type Area = 'us' | 'ak' | 'hi';
export type FplTable = Record<Area, [number, number]>;

export const guideline = (t: FplTable, area: Area, size: number): number => t[area][0] + t[area][1] * (Math.max(1, Math.round(size)) - 1);
/** Household income as a percentage of the guideline (annual income). */
export const pctOfFpl = (t: FplTable, area: Area, size: number, annualIncome: number): number => (annualIncome / guideline(t, area, size)) * 100;
/** Annual dollars at a percentage of the guideline. */
export const atPct = (t: FplTable, area: Area, size: number, pct: number): number => (guideline(t, area, size) * pct) / 100;
/** Monthly limit as agencies publish it: annual × pct ÷ 12, rounded up to the dollar. */
export const monthlyAtPct = (t: FplTable, area: Area, size: number, pct: number): number => Math.ceil(Math.round((atPct(t, area, size, pct) / 12) * 100) / 100);
