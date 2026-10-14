/**
 * Section 8 income limits lookup (HUD FY 2026, every county or town) and voucher tenant payment.
 * State page: the state's rows come as props. Program page: the first render uses the default state's
 * rows (props, identical on server and browser, RECETTE §17.5); after mount the island reads every
 * state from the inline JSON block `#hud-all` written by the page, so no network request is made.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { hudLimits, hudBand, tenantPayment } from '../../lib/engine/section8';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { LockedField, Result, Rows, usd, sizeOptions } from './parts';

export interface HudCompact { n: string; a?: string; v: number[]; e: number[]; l: number[] }
interface Meta { slug: string; name: string; abbr: string }
interface Props { states: Meta[]; state: string; rows: HudCompact[]; county?: string; lockState?: boolean; methodHref?: string; idPrefix?: string }
const BAND: Record<string, string> = { 'extremely-low': 'Extremely low income (30%)', 'very-low': 'Very low income (50%)', low: 'Low income (80%)', above: 'Above the low-income limit' };

export default function Section8Calculator({ states, state, rows: rows0, county: county0, lockState = false, methodHref = '/en/method/', idPrefix = 's8' }: Props) {
  const [all, setAll] = useState<Record<string, HudCompact[]> | null>(null);
  const [slug, setSlug] = useState(state);
  const [county, setCounty] = useState(county0 ?? rows0[0]?.n ?? '');
  const [size, setSize] = useState(3);
  const [income, setIncome] = useState(30000);
  const [deps, setDeps] = useState(1);
  const [ed, setEd] = useState<'0' | '1'>('0');
  const [care, setCare] = useState(0);
  useEffect(() => {
    let data: Record<string, HudCompact[]> | null = null;
    if (!lockState) {
      const el = document.getElementById('hud-all');
      if (el?.textContent) {
        try {
          const raw = JSON.parse(el.textContent) as { vecs: number[][]; states: Record<string, Array<[string, number]>> };
          data = Object.fromEntries(Object.entries(raw.states).map(([s, rows]) => [s, rows.map(([n, i]) => { const v = raw.vecs[i]; return { n, v: v.slice(0, 8), e: v.slice(8, 16), l: v.slice(16, 24) }; })]));
          setAll(data);
        } catch { /* keep the default state */ }
      }
    }
    const u = readParams(window.location.search);
    if (!lockState && data) { const s = str(u, 's', state); if (data[s]) setSlug(s); }
    const c = str(u, 'c', ''); if (c) setCounty(c);
    setSize(num(u, 'n', 3)); setIncome(num(u, 'i', 30000)); setDeps(num(u, 'd', 1)); setEd(str(u, 'ed', '0') === '1' ? '1' : '0'); setCare(num(u, 'cc', 0));
  }, []);
  useEffect(() => { updateURL({ s: lockState ? undefined : slug, c: county, n: size, i: income, d: deps, ed: ed === '1' ? 1 : undefined, cc: care || undefined }); }, [slug, county, size, income, deps, ed, care]);
  const rows = (slug === state ? rows0 : all?.[slug]) ?? rows0;
  const row = rows.find((r) => r.n === county) ?? rows[0];
  const S = states.find((x) => x.slug === slug) ?? states[0];
  const lim = hudLimits(row, size);
  const band = hudBand(row, size, income);
  const rent = useMemo(() => tenantPayment(P.hud, { annualIncome: income, dependents: Math.min(deps, Math.max(0, size - 1)), elderlyDisabled: ed === '1', childCare: care }), [income, deps, size, ed, care]);
  const voucher = band === 'extremely-low' || band === 'very-low';
  const out: Array<[string, string]> = [
    [`Extremely low income (ELI), ${size} ${size === 1 ? 'person' : 'people'}`, usd(lim.eli)],
    ['Very low income (50%), the voucher limit', usd(lim.vli)],
    ['Low income (80%)', usd(lim.li)],
    ['Your band', BAND[band]],
    ['Adjusted income after HUD deductions', `${usd(rent.adjusted)} a year`],
    [`Estimated tenant payment (${rent.rule})`, `${usd(rent.ttp)} a month`],
  ];
  const p = idPrefix;
  const pick = (s: string) => { setSlug(s); const r = (s === state ? rows0 : all?.[s]) ?? []; setCounty(r[0]?.n ?? ''); };
  return (
    <div className="rechner grid gap-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid-cols-2 lg:items-start">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {lockState ? <LockedField label="State" value={S.name} /> : <SelectField id={`${p}-state`} label="State" value={slug} onChange={pick} options={states.map((x) => ({ value: x.slug, label: x.name }))} />}
        <SelectField id={`${p}-county`} label="County or town" value={row?.n ?? ''} onChange={setCounty} options={rows.map((r) => ({ value: r.n, label: r.n }))} help={row?.a ? `HUD area: ${row.a}` : undefined} />
        <SelectField id={`${p}-size`} label="Household size" value={String(size)} onChange={(v) => setSize(Number(v))} options={sizeOptions(8)} />
        <NumberField id={`${p}-income`} label="Household income per year" value={income} onChange={setIncome} unit="$" max={2000000} help="Gross income of every member expected over the next 12 months." />
        <SelectField id={`${p}-deps`} label="Dependents (under 18, disabled, or full-time students)" value={String(Math.min(deps, Math.max(0, size - 1)))} onChange={(v) => setDeps(Number(v))} options={Array.from({ length: Math.max(1, size) }, (_, i) => ({ value: String(i), label: String(i) }))} />
        <Toggle id={`${p}-ed`} label="Head or spouse 62+ or disabled?" value={ed} onChange={(v) => setEd(v as '0' | '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
        <NumberField id={`${p}-care`} label="Child care to work or study, per year" value={care} onChange={setCare} unit="$" max={200000} />
      </form>
      <Result label={`${row?.n ?? S.name}, ${S.abbr}: FY 2026 income limits`} value={voucher ? 'Within the voucher limit' : band === 'low' ? 'Public housing range' : 'Above HUD limits'} sub={`Very low income limit for ${size}: ${usd(lim.vli)} a year`} methodHref={methodHref}
        note={`HUD FY 2026 limits (effective May 1, 2026) and 2026 deductions (${usd(P.hud.dependentDeduction)} per dependent, ${usd(P.hud.elderlyDisabledDeduction)} for an elderly or disabled family). The housing authority decides, and most have waiting lists.`}>
        <Rows rows={out} />
      </Result>
    </div>
  );
}
