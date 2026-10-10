/** Federal poverty level calculator: income as a % of the HHS guideline (2026 or 2025) and the program lines. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { guideline, type Area, type FplTable } from '../../lib/engine/fpl';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Result, Rows, usd, pc, sizeOptions } from './parts';

interface Props { methodHref?: string; idPrefix?: string; size?: number; income?: number }
const T: Record<string, FplTable> = { '2026': P.fpl['2026'] as unknown as FplTable, '2025': P.fpl['2025'] as unknown as FplTable };
const LINES: Array<[number, string]> = [[P.aca.minPct, 'SNAP net income test, ACA credit floor'], [130, 'SNAP gross income test'], [P.medicaid.expansionPct + P.medicaid.disregardPct, 'Medicaid for adults (expansion states)'], [P.wic.pct, 'WIC and reduced-price school meals'], [200, 'Common state program and CHIP line'], [P.aca.csrSilverMaxPct, 'Cost-sharing reductions on silver plans'], [P.aca.maxPct, 'ACA premium tax credit ceiling in 2026']];

export default function FplCalculator({ methodHref = '/en/method/', idPrefix = 'fpl', size: size0 = 3, income: income0 = 40000 }: Props) {
  const [size, setSize] = useState(size0);
  const [income, setIncome] = useState(income0);
  const [per, setPer] = useState<'year' | 'month'>('year');
  const [area, setArea] = useState<Area>('us');
  const [year, setYear] = useState<'2026' | '2025'>('2026');
  useEffect(() => {
    const u = readParams(window.location.search);
    setSize(num(u, 'n', size0)); setIncome(num(u, 'i', income0)); setPer(str(u, 'p', 'year') === 'month' ? 'month' : 'year');
    const a = str(u, 'a', 'us'); if (a === 'ak' || a === 'hi') setArea(a); setYear(str(u, 'y', '2026') === '2025' ? '2025' : '2026');
  }, []);
  useEffect(() => { updateURL({ n: size, i: income, p: per === 'month' ? 'month' : undefined, a: area === 'us' ? undefined : area, y: year === '2025' ? 2025 : undefined }); }, [size, income, per, area, year]);
  const g = guideline(T[year], area, size);
  const annual = per === 'month' ? income * 12 : income;
  const pctv = useMemo(() => (annual / g) * 100, [annual, g]);
  const rows: Array<[string, string]> = LINES.map(([k, l]) => [`${k}%: ${l}`, `${usd((g * k) / 100)} a year · ${usd((g * k) / 100 / 12)} a month${annual <= (g * k) / 100 ? ' ✓' : ''}`]);
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id={`${p}-size`} label="Household size" value={String(size)} onChange={(v) => setSize(Number(v))} options={sizeOptions(12)} />
        <NumberField id={`${p}-income`} label={per === 'month' ? 'Household income per month' : 'Household income per year'} value={income} onChange={setIncome} unit="$" max={5000000} help="Before taxes, everyone counted in the household." />
        <Toggle id={`${p}-per`} label="Income entered" value={per} onChange={(v) => setPer(v as 'year' | 'month')} options={[{ value: 'year', label: 'Per year' }, { value: 'month', label: 'Per month' }]} />
        <SelectField id={`${p}-area`} label="Where you live" value={area} onChange={(v) => setArea(v as Area)} options={[{ value: 'us', label: '48 states and DC' }, { value: 'ak', label: 'Alaska' }, { value: 'hi', label: 'Hawaii' }]} />
        <Toggle id={`${p}-year`} label="Guidelines" value={year} onChange={(v) => setYear(v as '2026' | '2025')} options={[{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }]} />
      </form>
      <Result label={`Your income as a share of the ${year} poverty guideline`} value={pc(pctv, 0)} sub={`Guideline for ${size} ${size === 1 ? 'person' : 'people'}: ${usd(g)} a year${year === '2025' ? ' (the one used for 2026 Marketplace subsidies)' : ''}`} methodHref={methodHref}
        note={`HHS ${year} poverty guidelines. Each program decides whose income counts and which year's guideline applies.`}>
        <Rows rows={rows} />
      </Result>
    </div>
  );
}
