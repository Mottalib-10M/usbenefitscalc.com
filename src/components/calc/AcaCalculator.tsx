/**
 * 2026 premium tax credit: benchmark premium − applicable percentage × income (IRS Rev. Proc. 2025-25),
 * 100% to 400% of the 2025 poverty guideline, compared with the expired 2021 to 2025 table.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import P from '../../data/params-2026.json';
import { ptc, type PctTable } from '../../lib/engine/aca';
import { guideline, type FplTable } from '../../lib/engine/fpl';
import { medicaidCheck } from '../../lib/engine/medicaid';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { LockedField, Result, Rows, usd, pc, sizeOptions } from './parts';
import type { ClientState } from './client-types';

interface Props { states: ClientState[]; state: string; lockState?: boolean; methodHref?: string; idPrefix?: string; income?: number; benchmark?: number }
const F25 = P.fpl['2025'] as unknown as FplTable;
const F26 = P.fpl['2026'] as unknown as FplTable;

export default function AcaCalculator({ states, state, lockState = false, methodHref = '/en/method/', idPrefix = 'aca', income: income0 = 45000, benchmark: bench0 = 600 }: Props) {
  const [slug, setSlug] = useState(state);
  const [size, setSize] = useState(1);
  const [income, setIncome] = useState(income0);
  const [bench, setBench] = useState(bench0);
  const [plan, setPlan] = useState(0);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (!lockState) { const s = str(u, 's', state); if (states.some((x) => x.slug === s)) setSlug(s); }
    setSize(num(u, 'n', 1)); setIncome(num(u, 'i', income0)); setBench(num(u, 'b', bench0)); setPlan(num(u, 'pl', 0));
  }, []);
  useEffect(() => { updateURL({ s: lockState ? undefined : slug, n: size, i: income, b: bench, pl: plan || undefined }); }, [slug, size, income, bench, plan]);
  const S = states.find((x) => x.slug === slug) ?? states[0];
  const g = guideline(F25, S.area, size);
  const med = useMemo(() => medicaidCheck(S.medicaid, 'adult', F26, S.area, size, income / 12, P.medicaid.disregardPct), [S, size, income]);
  const r = useMemo(() => ptc(P.aca.table2026 as PctTable, { income, fplAnnual: g, benchmarkMonthly: bench, planMonthly: plan || undefined, medicaidEligible: med.eligible }, { minPct: P.aca.minPct, maxPct: P.aca.maxPct }), [income, g, bench, plan, med.eligible]);
  const old = useMemo(() => ptc(P.aca.table2021to2025 as PctTable, { income, fplAnnual: g, benchmarkMonthly: bench, planMonthly: plan || undefined, medicaidEligible: med.eligible }, { minPct: P.aca.minPct, maxPct: null }), [income, g, bench, plan, med.eligible]);
  const cliff = (g * P.aca.maxPct) / 100;
  const rows: Array<[string, string]> = [
    ['Income as % of the 2025 guideline', `${pc(r.fplPct, 0)} (guideline ${usd(g)})`],
    ['Applicable percentage, 2026 table', pc(r.applicablePct, 2)],
    ['Your expected contribution', `${usd(r.expectedMonthly)} a month · ${usd(r.expectedAnnual)} a year`],
    ['Benchmark silver premium', `${usd(bench)} a month`],
    ['Premium tax credit 2026', `${usd(r.creditMonthly)} a month · ${usd(r.creditAnnual)} a year`],
    ['You pay for the plan', `${usd(r.netPremiumMonthly)} a month`],
    ['Under the 2021 to 2025 table (expired)', `${usd(old.creditMonthly)} a month`],
    [`Income ceiling for a credit (${P.aca.maxPct}%)`, `${usd(cliff)} a year`],
  ];
  const p = idPrefix;
  return (
    <div className="rechner grid gap-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid-cols-2 lg:items-start">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {lockState ? <LockedField label="State" value={S.name} help={S.marketplace?.name} /> : <SelectField id={`${p}-state`} label="State" value={slug} onChange={setSlug} options={states.map((x) => ({ value: x.slug, label: x.name }))} help={S.marketplace ? `Marketplace: ${S.marketplace.name}` : undefined} />}
        <SelectField id={`${p}-size`} label="Tax household size" value={String(size)} onChange={(v) => setSize(Number(v))} options={sizeOptions(10)} />
        <NumberField id={`${p}-income`} label="Expected 2026 household income (MAGI)" value={income} onChange={setIncome} unit="$" max={2000000} help="Adjusted gross income plus untaxed Social Security, foreign income and tax-exempt interest." />
        <NumberField id={`${p}-bench`} label="Benchmark silver premium, per month" value={bench} onChange={setBench} unit="$" max={20000} help="The second-lowest-cost silver plan for your household, shown when you compare plans on the Marketplace." />
        <NumberField id={`${p}-plan`} label="Premium of the plan you pick (optional)" value={plan} onChange={setPlan} unit="$" max={20000} help="Leave empty to price the benchmark plan itself." />
      </form>
      <Result label="Estimated 2026 premium tax credit, per month" value={usd(r.creditMonthly)} sub={r.reason || `You would pay ${usd(r.netPremiumMonthly)} a month for the plan`} methodHref={methodHref}
        note="IRS applicable percentages for 2026 and the 2025 poverty guidelines used by the Marketplace. Reconciled on your 2026 tax return (Form 8962); from 2026 there is no cap on repaying an excess advance credit.">
        <Rows rows={rows} />
        {r.fplPct > P.aca.maxPct && <p className="mt-2 text-xs text-navy-700">Above {P.aca.maxPct}% of the guideline there is no credit in 2026. Under the 2021 to 2025 rules the same household would have received {usd(old.creditMonthly)} a month.</p>}
      </Result>
    </div>
  );
}
