/** Choice of a state's standard utility allowance row (USDA FY 2026 SUA table). Pure: safe in the browser. */
import type { SuaRow } from './state-types';
export const sizeFits = (variant: string, size: number) => {
  const m = variant.match(/(\d+)\s*(?:to|-)\s*(\d+)/); if (m) return size >= +m[1] && size <= +m[2];
  const o = variant.match(/(\d+)\s*(?:or more|\+)/); if (o) return size >= +o[1];
  const e = variant.match(/^(\d+)\s+members?/); if (e) return size === +e[1];
  return false;
};
/** Default region of states whose table has regions: the most populous one. */
const DEFAULT_REGION: Record<string, string> = { 'new-york': 'New York City', alaska: 'Southcentral' };
export function suaRowOf(rows: SuaRow[], slug: string, size: number, region?: string): SuaRow | null {
  const ok = rows.filter((r) => !r.pending);
  if (!ok.length) return null;
  if (region) { const r = ok.find((x) => x.variant === region); if (r) return r; }
  const fits = ok.find((r) => r.variant && sizeFits(r.variant, size));
  if (fits) return fits;
  const def = DEFAULT_REGION[slug];
  return (def && ok.find((r) => r.variant === def)) || ok[0];
}
/** Regions (not household-size variants) of a state's SUA table, e.g. New York City or Alaska Southcentral. */
export const suaRegions = (rows: SuaRow[]) => rows.filter((r) => r.variant && !/member/.test(r.variant)).map((r) => r.variant as string);
