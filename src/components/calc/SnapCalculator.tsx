/**
 * SNAP benefit calculator, FY 2027 amounts (USDA memo of August 21, 2026), each state's broad-based
 * categorical eligibility (gross limit, asset limit) and its standard utility allowances (USDA FY 2026 table).
 * First render = build defaults (RECETTE §17.5); a shared link is applied in useEffect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { snap, type SnapParams } from '../../lib/engine/snap';
import { guideline, type FplTable } from '../../lib/engine/fpl';
import { suaRowOf, suaRegions } from '../../lib/sua';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { LockedField, Result, Rows, Meter, usd, usd2, sizeOptions } from './parts';
import type { ClientState } from './client-types';

interface Props { states: ClientState[]; state: string; lockState?: boolean; methodHref?: string; idPrefix?: string; size?: number; earned?: number }
const SP = P.snap as unknown as SnapParams;
const F26 = P.fpl['2026'] as unknown as FplTable;
type UtilChoice = 'hcsua' | 'lua' | 'phone' | 'none' | 'own';

export default function SnapCalculator({ states, state, lockState = false, methodHref = '/en/method/', idPrefix = 'snap', size: size0 = 3, earned: earned0 = 2000 }: Props) {
  const [slug, setSlug] = useState(state);
  const [size, setSize] = useState(size0);
  const [earned, setEarned] = useState(earned0);
  const [unearned, setUnearned] = useState(0);
  const [ed, setEd] = useState<'0' | '1'>('0');
  const [housing, setHousing] = useState(1000);
  const [util, setUtil] = useState<UtilChoice>('hcsua');
  const [ownUtil, setOwnUtil] = useState(0);
  const [region, setRegion] = useState('');
  const [akArea, setAkArea] = useState<'ak-urban' | 'ak-rural1' | 'ak-rural2'>('ak-urban');
  const [care, setCare] = useState(0);
  const [cs, setCs] = useState(0);
  const [medical, setMedical] = useState(0);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (!lockState) { const s = str(u, 's', state); if (states.some((x) => x.slug === s)) setSlug(s); }
    setSize(num(u, 'n', size0)); setEarned(num(u, 'e', earned0)); setUnearned(num(u, 'u', 0)); setEd(str(u, 'ed', '0') === '1' ? '1' : '0');
    setHousing(num(u, 'h', 1000)); const ut = str(u, 'ut', 'hcsua'); if (['hcsua', 'lua', 'phone', 'none', 'own'].includes(ut)) setUtil(ut as UtilChoice);
    setOwnUtil(num(u, 'uo', 0)); setRegion(str(u, 'rg', '')); setCare(num(u, 'dc', 0)); setCs(num(u, 'cs', 0)); setMedical(num(u, 'md', 0));
    const ak = str(u, 'ak', 'ak-urban'); if (ak === 'ak-rural1' || ak === 'ak-rural2') setAkArea(ak);
  }, []);
  useEffect(() => { updateURL({ s: lockState ? undefined : slug, n: size, e: earned, u: unearned || undefined, ed: ed === '1' ? 1 : undefined, h: housing, ut: util === 'hcsua' ? undefined : util, uo: util === 'own' ? ownUtil : undefined, rg: region || undefined, dc: care || undefined, cs: cs || undefined, md: medical || undefined, ak: slug === 'alaska' && akArea !== 'ak-urban' ? akArea : undefined }); }, [slug, size, earned, unearned, ed, housing, util, ownUtil, region, care, cs, medical, akArea]);

  const S = states.find((x) => x.slug === slug) ?? states[0];
  const regions = suaRegions(S.sua);
  const row = suaRowOf(S.sua, S.slug, size, region || undefined);
  const hasHcsua = !!row?.hcsua;
  const choice: UtilChoice = !hasHcsua && util !== 'none' && util !== 'own' ? 'own' : util;
  const utilities = choice === 'hcsua' ? row?.hcsua ?? 0 : choice === 'lua' ? row?.lua ?? 0 : choice === 'phone' ? row?.phone ?? 0 : choice === 'own' ? ownUtil : 0;
  const r = useMemo(() => snap(SP, { area: S.area, bbce: S.bbce }, guideline(F26, S.area, size), {
    size, earned, unearned, elderlyDisabled: ed === '1', housing, utilities, dependentCare: care, childSupportPaid: cs, medical, akArea: S.area === 'ak' ? akArea : undefined,
  }), [S, size, earned, unearned, ed, housing, utilities, care, cs, medical, akArea]);

  const p = idPrefix;
  const utilOptions = [
    ...(hasHcsua ? [{ value: 'hcsua', label: `Heating or cooling bills (${usd(row!.hcsua!)} allowance)` }] : []),
    ...(row?.lua ? [{ value: 'lua', label: `Other utilities, no heat or AC (${usd(row.lua)})` }] : []),
    ...(row?.phone ? [{ value: 'phone', label: `Telephone only (${usd(row.phone)})` }] : []),
    { value: 'own', label: 'Enter my monthly utility costs' },
    { value: 'none', label: 'No utility costs' },
  ];
  const grossLabel = r.bbce ? `Gross income test (${S.name}, ${r.bbce.grossPct}% of poverty)` : 'Gross income test (130% of poverty)';
  const rows: Array<[string, string]> = [
    ['Gross monthly income', usd(r.gross)],
    [grossLabel, r.grossTest === 'not-applied' ? 'not applied (60+ or disabled)' : `${r.grossTest === 'pass' ? 'pass' : 'over'} · limit ${usd(r.grossLimit ?? 0)}`],
    ['20% earned income deduction', `−${usd(r.deductions.earned)}`],
    [`Standard deduction (${size >= 6 ? '6 or more' : size} people)`, `−${usd(r.deductions.standard)}`],
    ...(r.deductions.dependentCare ? [['Dependent care', `−${usd(r.deductions.dependentCare)}`] as [string, string]] : []),
    ...(r.deductions.childSupport ? [['Child support paid', `−${usd(r.deductions.childSupport)}`] as [string, string]] : []),
    ...(r.deductions.medical ? [['Medical costs above $35', `−${usd(r.deductions.medical)}`] as [string, string]] : []),
    [`Shelter deduction${r.shelterCapped ? ' (capped)' : ''}`, `−${usd(r.deductions.shelter)}`],
    ['Net monthly income', usd(r.net)],
    ['Net income test (100% of poverty)', r.netTest === 'not-applied' ? 'not applied (BBCE)' : `${r.netTest === 'pass' ? 'pass' : 'over'} · limit ${usd(r.netLimit)}`],
    [`Maximum for ${size} ${size === 1 ? 'person' : 'people'}`, usd(r.maxAllotment)],
    ['Minus 30% of net income', `−${usd(r.thirtyPercent)}`],
  ];
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {lockState ? <LockedField label="State" value={S.name} help={S.snapName ?? 'SNAP'} /> : <SelectField id={`${p}-state`} label="State" value={slug} onChange={(v) => { setSlug(v); setRegion(''); }} options={states.map((x) => ({ value: x.slug, label: x.name }))} help={S.snapName && S.snapName !== 'SNAP' ? `Called ${S.snapName} in ${S.name}` : undefined} />}
        <SelectField id={`${p}-size`} label="People who buy and cook food together" value={String(size)} onChange={(v) => setSize(Number(v))} options={sizeOptions(10)} />
        <NumberField id={`${p}-earned`} label="Monthly earnings before tax" value={earned} onChange={setEarned} unit="$" max={100000} help="Wages and net self-employment income of everyone in the household." />
        <NumberField id={`${p}-unearned`} label="Other monthly income" value={unearned} onChange={setUnearned} unit="$" max={100000} help="Social Security, SSI, unemployment, child support received." />
        <NumberField id={`${p}-housing`} label="Rent or mortgage, per month" value={housing} onChange={setHousing} unit="$" max={50000} help="Include property tax and home insurance if you own." />
        <SelectField id={`${p}-util`} label="Utilities you pay" value={choice} onChange={(v) => setUtil(v as UtilChoice)} options={utilOptions} help={hasHcsua ? `${S.name} standard allowance, FY 2026 USDA table` : `${S.name}: enter your actual utility costs`} />
        {choice === 'own' && <NumberField id={`${p}-own`} label="Monthly utility costs" value={ownUtil} onChange={setOwnUtil} unit="$" max={5000} />}
        {regions.length > 1 && S.slug !== 'alaska' && <SelectField id={`${p}-region`} label="Utility allowance area" value={row?.variant ?? ''} onChange={setRegion} options={regions.map((x) => ({ value: x, label: x }))} />}
        {S.area === 'ak' && <SelectField id={`${p}-ak`} label="Alaska allotment area" value={akArea} onChange={(v) => setAkArea(v as typeof akArea)} options={[{ value: 'ak-urban', label: 'Urban (Anchorage and other cities)' }, { value: 'ak-rural1', label: 'Rural 1' }, { value: 'ak-rural2', label: 'Rural 2' }]} />}
        {S.area === 'ak' && <SelectField id={`${p}-akr`} label="Utility allowance region" value={row?.variant ?? ''} onChange={setRegion} options={regions.map((x) => ({ value: x, label: x }))} />}
        <Toggle id={`${p}-ed`} label="Anyone 60+ or disabled?" value={ed} onChange={(v) => setEd(v as '0' | '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
      </form>
      <details className="mt-4 rounded-lg border border-navy-200 px-4 py-2">
        <summary className="cursor-pointer py-1 text-sm font-medium text-navy-800">More deductions: dependent care, child support paid, medical costs</summary>
        <div className="mt-3 grid gap-x-5 gap-y-4 pb-2 sm:grid-cols-2">
          <NumberField id={`${p}-care`} label="Child or dependent care, per month" value={care} onChange={setCare} unit="$" max={20000} help="Care needed to work, look for work or study." />
          <NumberField id={`${p}-cs`} label="Child support you pay, per month" value={cs} onChange={setCs} unit="$" max={20000} />
        {ed === '1' && <NumberField id={`${p}-med`} label="Medical costs of the 60+ or disabled member" value={medical} onChange={setMedical} unit="$" max={20000} help="Out of pocket, per month. Costs above $35 are deducted." />}
        </div>
      </details>
      <Result label={r.eligible ? `Estimated SNAP benefit in ${S.name}, per month` : `SNAP estimate in ${S.name}`} value={usd(r.benefit)} sub={r.reason || `${usd(r.benefit * 12)} a year on the EBT card · FY 2027 amounts, October 1, 2026 to September 30, 2027`} methodHref={methodHref}
        note={`Estimate under USDA's FY 2027 figures and ${S.name}'s published options. The state agency checks your income, expenses and household before deciding.`}>
        <Meter value={r.gross} limit={r.grossLimit ?? r.netLimit} label={r.grossLimit ? 'Gross income against the limit' : 'Net income against the limit'} />
        <Rows rows={rows} />
        {r.bbce && <p className="mt-2 text-xs text-navy-700">{S.name} uses broad-based categorical eligibility: gross income up to {r.bbce.grossPct}% of the poverty guideline, {r.bbce.assetLimit ? `assets up to ${usd2(r.bbce.assetLimit)}` : 'no asset test'}, and no separate net income test.</p>}
      </Result>
    </div>
  );
}
