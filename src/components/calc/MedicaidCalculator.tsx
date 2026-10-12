/** Medicaid and CHIP income check by state and group (CMS levels + 5% disregard, 2026 guideline). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import P from '../../data/params-2026.json';
import { medicaidCheck, type MedicaidGroup } from '../../lib/engine/medicaid';
import { type FplTable } from '../../lib/engine/fpl';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { LockedField, Result, Rows, Meter, usd, pc, sizeOptions } from './parts';
import type { ClientState } from './client-types';

interface Props { states: ClientState[]; state: string; lockState?: boolean; methodHref?: string; idPrefix?: string; acaHref?: string }
const F26 = P.fpl['2026'] as unknown as FplTable;
const GROUPS: Array<{ value: MedicaidGroup; label: string }> = [
  { value: 'adult', label: 'Adult 19 to 64, no children at home' }, { value: 'parent', label: 'Parent or caretaker of a child' }, { value: 'pregnant', label: 'Pregnant' },
  { value: 'infant', label: 'Baby under 1' }, { value: 'child1to5', label: 'Child 1 to 5' }, { value: 'child6to18', label: 'Child 6 to 18' },
];

export default function MedicaidCalculator({ states, state, lockState = false, methodHref = '/en/method/', idPrefix = 'mcd', acaHref = '/en/aca-subsidy-calculator/' }: Props) {
  const [slug, setSlug] = useState(state);
  const [group, setGroup] = useState<MedicaidGroup>('adult');
  const [size, setSize] = useState(1);
  const [income, setIncome] = useState(1600);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (!lockState) { const s = str(u, 's', state); if (states.some((x) => x.slug === s)) setSlug(s); }
    const g = str(u, 'g', 'adult'); if (GROUPS.some((x) => x.value === g)) setGroup(g as MedicaidGroup);
    setSize(num(u, 'n', 1)); setIncome(num(u, 'i', 1600));
  }, []);
  useEffect(() => { updateURL({ s: lockState ? undefined : slug, g: group, n: size, i: income }); }, [slug, group, size, income]);
  const S = states.find((x) => x.slug === slug) ?? states[0];
  const r = useMemo(() => medicaidCheck(S.medicaid, group, F26, S.area, size, income, P.medicaid.disregardPct), [S, group, size, income]);
  const name = r.program === 'CHIP' ? (S.chipName || 'CHIP') : (S.medicaidName || 'Medicaid');
  const verdict = r.eligible ? `Within the ${name} limit` : r.bhpEligible ? 'Basic Health Program range' : r.effectivePct == null ? 'No Medicaid group for you here' : 'Above the limit';
  const rows: Array<[string, string]> = [
    ['Your income', `${usd(income)} a month · ${pc(r.pctIncome, 0)} of the 2026 guideline`],
    ['State level for this group', r.pct == null ? 'none' : `${r.pct}% + ${P.medicaid.disregardPct}% disregard = ${r.effectivePct}%`],
    ['Monthly limit for your household', r.monthly == null ? '–' : usd(r.monthly)],
    ['Program', r.program === 'none' ? '–' : r.program === 'CHIP' ? `CHIP${S.chipName ? ` (${S.chipName})` : ''}` : r.program],
    ...(r.bhp ? [['Basic Health Program up to', `${r.bhp.effectivePct}% · ${usd(r.bhp.monthly)} a month`] as [string, string]] : []),
  ];
  const gapNote = r.effectivePct == null && group === 'adult' ? `${S.name} has not adopted the ACA expansion of Medicaid to adults without children. Between ${P.aca.minPct}% and ${P.aca.maxPct}% of the poverty guideline, the Marketplace premium tax credit is the route; below ${P.aca.minPct}%, neither applies in most cases.` : '';
  const p = idPrefix;
  return (
    <div className="rechner grid gap-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid-cols-2 lg:items-start">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {lockState ? <LockedField label="State" value={S.name} help={S.medicaidName} /> : <SelectField id={`${p}-state`} label="State" value={slug} onChange={setSlug} options={states.map((x) => ({ value: x.slug, label: x.name }))} />}
        <SelectField id={`${p}-group`} label="Who needs coverage" value={group} onChange={(v) => setGroup(v as MedicaidGroup)} options={GROUPS} />
        <SelectField id={`${p}-size`} label="Household size" value={String(size)} onChange={(v) => setSize(Number(v))} options={sizeOptions(10)} help={group === 'pregnant' ? 'Count the expected baby or babies.' : 'Tax household: you, spouse and dependents.'} />
        <NumberField id={`${p}-income`} label="Household income per month (MAGI)" value={income} onChange={setIncome} unit="$" max={100000} help="Before taxes; Social Security counts, SSI and child support received do not." />
      </form>
      <Result label={`${S.name}, ${GROUPS.find((g) => g.value === group)!.label.toLowerCase()}`} value={verdict} sub={r.monthly != null ? `Limit for ${size} ${size === 1 ? 'person' : 'people'}: ${usd(r.monthly)} a month, ${usd(r.annual ?? 0)} a year` : undefined} methodHref={methodHref}
        note={`State levels from the CMS table (December 1, 2023), updated where the state has published newer limits, applied to the 2026 poverty guideline. ${S.name} checks income, residency and immigration status when you apply.`}>
        {r.monthly != null && <Meter value={income} limit={r.monthly} label="Income against the limit" />}
        <Rows rows={rows} />
        {gapNote && <p className="mt-2 text-xs text-navy-700">{gapNote} <a className="underline" href={acaHref}>Check the 2026 premium tax credit</a>.</p>}
      </Result>
    </div>
  );
}
