/** EITC calculator, tax years 2026 (Rev. Proc. 2025-32) and 2025 (IRS tables), statutory rates of 26 U.S.C. 32. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { eitc, deriveYear, type EitcYear } from '../../lib/engine/eitc';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Result, Rows, usd, pc } from './parts';

interface Props { methodHref?: string; idPrefix?: string; earned?: number; children?: number }
const Y: Record<string, EitcYear> = { '2026': P.eitc['2026'] as unknown as EitcYear, '2025': deriveYear(P.eitc['2025'], P.eitc.phaseOut) };
const STAGE: Record<string, string> = { 'phase-in': 'Phase-in: the credit grows with each dollar earned', plateau: 'Plateau: maximum credit', 'phase-out': 'Phase-out: the credit shrinks as income rises', none: 'No credit' };

export default function EitcCalculator({ methodHref = '/en/method/', idPrefix = 'eitc', earned: earned0 = 25000, children: kids0 = 2 }: Props) {
  const [year, setYear] = useState<'2026' | '2025'>('2026');
  const [kids, setKids] = useState(kids0);
  const [joint, setJoint] = useState<'0' | '1'>('0');
  const [earned, setEarned] = useState(earned0);
  const [agi, setAgi] = useState(0);
  const [invest, setInvest] = useState(0);
  const [age, setAge] = useState(30);
  useEffect(() => {
    const u = readParams(window.location.search);
    setYear(str(u, 'y', '2026') === '2025' ? '2025' : '2026'); setKids(num(u, 'k', kids0)); setJoint(str(u, 'j', '0') === '1' ? '1' : '0');
    setEarned(num(u, 'e', earned0)); setAgi(num(u, 'a', 0)); setInvest(num(u, 'v', 0)); setAge(num(u, 'g', 30));
  }, []);
  useEffect(() => { updateURL({ y: year === '2025' ? 2025 : undefined, k: kids, j: joint === '1' ? 1 : undefined, e: earned, a: agi || undefined, v: invest || undefined, g: kids === 0 ? age : undefined }); }, [year, kids, joint, earned, agi, invest, age]);
  const y = Y[year];
  const r = useMemo(() => eitc(y, P.eitc.phaseIn, P.eitc.phaseOut, { children: kids, joint: joint === '1', earned, agi: agi || undefined, investment: invest, age: kids === 0 ? age : undefined }, { min: P.eitc.childlessAgeMin, max: P.eitc.childlessAgeMax }), [y, kids, joint, earned, agi, invest, age]);
  const k = Math.min(3, kids);
  const rows: Array<[string, string]> = [
    ['Stage', STAGE[r.stage]],
    ['Maximum credit', usd(r.maxCredit)],
    ['Credit rate on earnings', pc(P.eitc.phaseIn[k], 2)],
    ['Maximum reached at earnings of', usd(r.phaseInEnd)],
    ['Phase-out starts at', usd(r.threshold)],
    ['Phase-out rate', pc(P.eitc.phaseOut[k], 2)],
    ['No credit from', usd(r.completed)],
    ['Investment income limit', usd(y.investmentIncomeLimit)],
  ];
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={`${p}-year`} label="Tax year" value={year} onChange={(v) => setYear(v as '2026' | '2025')} options={[{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }]} />
        <SelectField id={`${p}-kids`} label="Qualifying children" value={String(Math.min(3, kids))} onChange={(v) => setKids(Number(v))} options={[{ value: '0', label: 'None' }, { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3 or more' }]} />
        <Toggle id={`${p}-joint`} label="Married filing jointly?" value={joint} onChange={(v) => setJoint(v as '0' | '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
        <NumberField id={`${p}-earned`} label="Earned income for the year" value={earned} onChange={setEarned} unit="$" max={1000000} help="Wages, tips and net self-employment earnings." />
        <NumberField id={`${p}-agi`} label="Adjusted gross income, if different" value={agi} onChange={setAgi} unit="$" max={1000000} help="The phase-out uses the larger of AGI and earned income." />
        <NumberField id={`${p}-inv`} label="Investment income" value={invest} onChange={setInvest} unit="$" max={1000000} />
        {kids === 0 && <NumberField id={`${p}-age`} label="Your age at the end of the year" value={age} onChange={setAge} unit="years" max={120} help={`Without a qualifying child: ${P.eitc.childlessAgeMin} to ${P.eitc.childlessAgeMax}.`} />}
      </form>
      <Result label={`Estimated EITC for tax year ${year}`} value={usd(r.credit)} sub={r.reason || `Refundable: paid even if you owe no tax · ${year === '2026' ? 'claimed on the 2026 return filed in 2027' : 'claimed on the 2025 return'}`} methodHref={methodHref}
        note="Formula of the tax code with the IRS amounts of the year; the IRS EITC table works in $50 income bands, so the table can differ by a few dollars.">
        <Rows rows={rows} />
      </Result>
    </div>
  );
}
