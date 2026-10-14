/**
 * One household, every program: SNAP (FY 2027), Medicaid and CHIP (state levels), the 2026 premium tax
 * credit window, the 2026 EITC, WIC (2026/2027) and SSI (2026), from the same few answers.
 * First render = build defaults (RECETTE §17.5); a shared link is applied in useEffect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { snap, type SnapParams } from '../../lib/engine/snap';
import { guideline, type FplTable } from '../../lib/engine/fpl';
import { medicaidCheck } from '../../lib/engine/medicaid';
import { eitc, type EitcYear } from '../../lib/engine/eitc';
import { wicIncome } from '../../lib/engine/wic';
import { ssi } from '../../lib/engine/ssi';
import { suaRowOf } from '../../lib/sua';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { LockedField, Result, usd, pc, sizeOptions } from './parts';
import type { ClientState } from './client-types';

interface Links { snap: string; medicaid: string; aca: string; eitc: string; wic: string; ssi: string; section8: string; fpl: string }
interface Props { states: ClientState[]; state: string; lockState?: boolean; methodHref?: string; idPrefix?: string; links: Links }
const SP = P.snap as unknown as SnapParams;
const F26 = P.fpl['2026'] as unknown as FplTable;
const F25 = P.fpl['2025'] as unknown as FplTable;
const E26 = P.eitc['2026'] as unknown as EitcYear;

interface Line { program: string; verdict: string; amount: string; ok: boolean | null; href: string; detail: string }

export default function Screener({ states, state, lockState = false, methodHref = '/en/method/', idPrefix = 'scr', links }: Props) {
  const [slug, setSlug] = useState(state);
  const [size, setSize] = useState(3);
  const [kids, setKids] = useState(2);
  const [earned, setEarned] = useState(2400);
  const [other, setOther] = useState(0);
  const [rent, setRent] = useState(1100);
  const [young, setYoung] = useState<'0' | '1'>('1');
  const [ed, setEd] = useState<'0' | '1'>('0');
  useEffect(() => {
    const u = readParams(window.location.search);
    if (!lockState) { const s = str(u, 's', state); if (states.some((x) => x.slug === s)) setSlug(s); }
    setSize(num(u, 'n', 3)); setKids(num(u, 'k', 2)); setEarned(num(u, 'e', 2400)); setOther(num(u, 'o', 0)); setRent(num(u, 'r', 1100));
    setYoung(str(u, 'y', '1') === '0' ? '0' : '1'); setEd(str(u, 'ed', '0') === '1' ? '1' : '0');
  }, []);
  useEffect(() => { updateURL({ s: lockState ? undefined : slug, n: size, k: kids, e: earned, o: other || undefined, r: rent, y: young === '1' ? undefined : 0, ed: ed === '1' ? 1 : undefined }); }, [slug, size, kids, earned, other, rent, young, ed]);

  const S = states.find((x) => x.slug === slug) ?? states[0];
  const children = Math.min(kids, Math.max(0, size - 1));
  const adults = size - children;
  const monthly = earned + other;
  const annual = monthly * 12;

  const out = useMemo(() => {
    const g26 = guideline(F26, S.area, size);
    const pctFpl = (annual / g26) * 100;
    const util = suaRowOf(S.sua, S.slug, size)?.hcsua ?? 0;
    const sn = snap(SP, { area: S.area, bbce: S.bbce }, g26, { size, earned, unearned: other, elderlyDisabled: ed === '1', housing: rent, utilities: util });
    const adultGroup = children > 0 ? 'parent' : 'adult';
    const mAdult = medicaidCheck(S.medicaid, adultGroup, F26, S.area, size, monthly, P.medicaid.disregardPct);
    const mKid = children > 0 ? medicaidCheck(S.medicaid, 'child6to18', F26, S.area, size, monthly, P.medicaid.disregardPct) : null;
    const pct25 = (annual / guideline(F25, S.area, size)) * 100;
    const acaWindow = !mAdult.eligible && pct25 >= P.aca.minPct && pct25 <= P.aca.maxPct;
    const ei = eitc(E26, P.eitc.phaseIn, P.eitc.phaseOut, { children, joint: adults >= 2, earned: earned * 12 }, { min: P.eitc.childlessAgeMin, max: P.eitc.childlessAgeMax });
    const wic = wicIncome(P.wic.annual.us, { size, annualIncome: annual, adjunctive: sn.eligible || mAdult.eligible || !!mKid?.eligible });
    const ss = ed === '1' ? ssi(P.ssi, { couple: false, earned, unearned: other }) : null;
    return { pctFpl, sn, mAdult, mKid, pct25, acaWindow, ei, wic, ss, util };
  }, [S, size, earned, other, rent, ed, children, adults, monthly, annual]);

  const lines: Line[] = [
    { program: S.snapName && S.snapName !== 'SNAP' ? `SNAP (${S.snapName})` : 'SNAP food benefits', ok: out.sn.eligible, verdict: out.sn.eligible ? 'Likely eligible' : 'Not on these figures', amount: out.sn.eligible ? `${usd(out.sn.benefit)}/mo` : '–', href: links.snap, detail: out.sn.eligible ? `FY 2027 amounts; ${out.util ? `${usd(out.util)} utility allowance used` : 'no utility allowance'}` : out.sn.reason },
    { program: children > 0 ? 'Medicaid for the parents' : 'Medicaid for adults', ok: out.mAdult.eligible, verdict: out.mAdult.eligible ? 'Within the limit' : out.mAdult.bhpEligible ? 'Basic Health Program' : out.mAdult.effectivePct == null ? 'No coverage group' : 'Above the limit', amount: out.mAdult.monthly != null ? `limit ${usd(out.mAdult.monthly)}/mo` : '–', href: links.medicaid, detail: out.mAdult.effectivePct == null ? `${S.name} has not expanded Medicaid to adults without children` : `${S.name}: ${out.mAdult.effectivePct}% of the poverty guideline` },
    ...(out.mKid ? [{ program: 'Medicaid or CHIP for the children', ok: out.mKid.eligible, verdict: out.mKid.eligible ? `Within the ${out.mKid.program} limit` : 'Above the limit', amount: out.mKid.monthly != null ? `limit ${usd(out.mKid.monthly)}/mo` : '–', href: links.medicaid, detail: `Children 6 to 18, ${out.mKid.effectivePct}% of the guideline` }] : []),
    { program: 'Marketplace premium tax credit', ok: out.acaWindow, verdict: out.acaWindow ? 'In the 100% to 400% window' : out.mAdult.eligible ? 'Medicaid comes first' : out.pct25 > P.aca.maxPct ? 'Above 400%: no credit in 2026' : 'Below 100%', amount: `${pc(out.pct25, 0)} of 2025 FPL`, href: links.aca, detail: 'Amount depends on the benchmark premium where you live' },
    { program: 'Earned income tax credit (2026)', ok: out.ei.credit > 0, verdict: out.ei.credit > 0 ? 'Credit at tax time' : 'No credit', amount: out.ei.credit > 0 ? `${usd(out.ei.credit)}/yr` : '–', href: links.eitc, detail: `${children > 3 ? '3 or more' : children} qualifying ${children === 1 ? 'child' : 'children'}, ${adults >= 2 ? 'married filing jointly' : 'single or head of household'}` },
    ...(young === '1' ? [{ program: 'WIC (pregnancy or a child under 5)', ok: out.wic.eligible, verdict: out.wic.eligible ? (out.wic.viaAdjunctive ? 'Eligible through SNAP or Medicaid' : 'Within 185% of poverty') : 'Above the limit', amount: `limit ${usd(out.wic.limit)}/yr`, href: links.wic, detail: 'Nutrition risk is assessed at the WIC clinic' }] : []),
    ...(out.ss ? [{ program: 'SSI (65+, blind or disabled)', ok: out.ss.payment > 0, verdict: out.ss.payment > 0 ? 'Payment possible' : 'Income too high', amount: out.ss.payment > 0 ? `${usd(out.ss.payment)}/mo` : '–', href: links.ssi, detail: `Federal amount for one person; resources must be under ${usd(P.ssi.resourceIndividual)}` }] : []),
  ];
  const p = idPrefix;
  return (
    <div className="rechner grid gap-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid-cols-2 lg:items-start">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {/* Locked on a state page: the state is in the H1, so on a phone its field goes last and the first answer comes first (RECETTE §5). */}
        {lockState ? <LockedField label="State" value={S.name} className="max-sm:order-last" /> : <SelectField id={`${p}-state`} label="State" value={slug} onChange={setSlug} options={states.map((x) => ({ value: x.slug, label: x.name }))} />}
        <SelectField id={`${p}-size`} label="Household size" value={String(size)} onChange={(v) => setSize(Number(v))} options={sizeOptions(10)} />
        <SelectField id={`${p}-kids`} label="Children under 18" value={String(children)} onChange={(v) => setKids(Number(v))} options={Array.from({ length: Math.max(1, size) }, (_, i) => ({ value: String(i), label: String(i) }))} />
        <NumberField id={`${p}-earned`} label="Monthly earnings before tax" value={earned} onChange={setEarned} unit="$" max={100000} />
        <NumberField id={`${p}-other`} label="Other monthly income" value={other} onChange={setOther} unit="$" max={100000} help="Social Security, unemployment, child support received." className="sm:col-span-2" />
        <NumberField id={`${p}-rent`} label="Rent or mortgage, per month" value={rent} onChange={setRent} unit="$" max={50000} />
        <Toggle id={`${p}-young`} label="Pregnant, or a child under 5?" value={young} onChange={(v) => setYoung(v as '0' | '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
        <Toggle id={`${p}-ed`} label="Someone 60+ or disabled?" value={ed} onChange={(v) => setEd(v as '0' | '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
      </form>
      <Result label={`Household income in ${S.name}`} value={`${pc(out.pctFpl, 0)} of poverty`} sub={`${usd(annual)} a year against the 2026 guideline of ${usd(guideline(F26, S.area, size))} for ${size} ${size === 1 ? 'person' : 'people'}`} methodHref={methodHref}
        note="A first screening under each program's published 2026 rules; every agency counts income and household its own way and decides on your application.">
        <ul className="mt-4 divide-y divide-navy-200 rounded-lg bg-white">
          {lines.map((l) => (
            <li key={l.program} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 py-2.5">
              <span className="min-w-0 flex-1"><a href={l.href} className="font-semibold text-navy-900 underline-offset-2 hover:underline">{l.program}</a><span className="block text-xs text-navy-600">{l.detail}</span></span>
              <span className="text-right"><span className={`block text-sm font-semibold ${l.ok ? 'text-green-800' : 'text-navy-700'}`}>{l.verdict}</span><span className="tabular-nums block text-sm text-navy-900">{l.amount}</span></span>
            </li>
          ))}
          <li className="px-3 py-2.5 text-sm"><a href={links.section8} className="font-semibold text-navy-900 underline-offset-2 hover:underline">Section 8 housing voucher</a><span className="block text-xs text-navy-600">Limits are set by county: check yours in the Section 8 lookup.</span></li>
        </ul>
      </Result>
    </div>
  );
}
