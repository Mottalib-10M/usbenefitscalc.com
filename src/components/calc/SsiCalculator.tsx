/** SSI federal payment 2026: federal benefit rate − countable income (SSA exclusions). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { ssi } from '../../lib/engine/ssi';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Result, Rows, usd, usd2 } from './parts';

interface Props { methodHref?: string; idPrefix?: string }
export default function SsiCalculator({ methodHref = '/en/method/', idPrefix = 'ssi' }: Props) {
  const [couple, setCouple] = useState<'0' | '1'>('0');
  const [earned, setEarned] = useState(0);
  const [unearned, setUnearned] = useState(400);
  useEffect(() => { const u = readParams(window.location.search); setCouple(str(u, 'c', '0') === '1' ? '1' : '0'); setEarned(num(u, 'e', 0)); setUnearned(num(u, 'u', 400)); }, []);
  useEffect(() => { updateURL({ c: couple === '1' ? 1 : undefined, e: earned || undefined, u: unearned || undefined }); }, [couple, earned, unearned]);
  const r = useMemo(() => ssi(P.ssi, { couple: couple === '1', earned, unearned }), [couple, earned, unearned]);
  const rows: Array<[string, string]> = [
    ['Federal benefit rate 2026', usd(r.fbr)],
    [`Unearned income after the ${usd(P.ssi.generalExclusion)} exclusion`, `−${usd2(r.countableUnearned)}`],
    [`Earnings counted (after ${usd(P.ssi.earnedExclusion)}, then one half)`, `−${usd2(r.countableEarned)}`],
    ['Federal SSI payment', usd2(r.payment)],
    ['Resource limit', usd(couple === '1' ? P.ssi.resourceCouple : P.ssi.resourceIndividual)],
  ];
  const p = idPrefix;
  return (
    <div className="rechner grid gap-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid-cols-2 lg:items-start">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={`${p}-couple`} label="Applying as" value={couple} onChange={(v) => setCouple(v as '0' | '1')} options={[{ value: '0', label: 'Individual' }, { value: '1', label: 'Couple' }]} />
        <NumberField id={`${p}-unearned`} label="Unearned income per month" value={unearned} onChange={setUnearned} unit="$" max={100000} help="Social Security, pensions, unemployment." />
        <NumberField id={`${p}-earned`} label="Earnings per month" value={earned} onChange={setEarned} unit="$" max={100000} help="Gross wages or net self-employment." />
      </form>
      <Result label="Estimated federal SSI payment, per month" value={usd(r.payment)} sub={r.payment > 0 ? `${usd(r.payment * 12)} a year, before any state supplement` : 'Countable income is at or above the federal benefit rate'} methodHref={methodHref}
        note="SSA 2026 amounts and income exclusions. Free food or shelter from others (in-kind support), deeming from a spouse or parent and state supplements are not modeled.">
        <Rows rows={rows} />
      </Result>
    </div>
  );
}
