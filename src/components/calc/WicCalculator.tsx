/** WIC income check, July 1, 2026 to June 30, 2027 guidelines (185% of poverty) and adjunctive eligibility. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { wicIncome } from '../../lib/engine/wic';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Result, Rows, Meter, usd, sizeOptions } from './parts';

interface Props { methodHref?: string; idPrefix?: string }
const WHO = [
  { value: 'pregnant', label: 'Pregnant' }, { value: 'postpartum', label: `Had a baby in the last ${P.wic.postpartumMonths} months` }, { value: 'breastfeeding', label: `Breastfeeding a baby under ${P.wic.breastfeedingMonths / 12}` },
  { value: 'infant', label: 'Infant under 1' }, { value: 'child', label: `Child 1 to ${P.wic.childAgeMax - 1}` }, { value: 'none', label: 'None of these' },
];

export default function WicCalculator({ methodHref = '/en/method/', idPrefix = 'wic' }: Props) {
  const [who, setWho] = useState('pregnant');
  const [size, setSize] = useState(2);
  const [babies, setBabies] = useState(1);
  const [income, setIncome] = useState(3000);
  const [per, setPer] = useState<'month' | 'year'>('month');
  const [adj, setAdj] = useState<'0' | '1'>('0');
  useEffect(() => {
    const u = readParams(window.location.search);
    const w = str(u, 'w', 'pregnant'); if (WHO.some((x) => x.value === w)) setWho(w);
    setSize(num(u, 'n', 2)); setBabies(num(u, 'b', 1)); setIncome(num(u, 'i', 3000)); setPer(str(u, 'p', 'month') === 'year' ? 'year' : 'month'); setAdj(str(u, 'adj', '0') === '1' ? '1' : '0');
  }, []);
  useEffect(() => { updateURL({ w: who, n: size, b: who === 'pregnant' ? babies : undefined, i: income, p: per === 'year' ? 'year' : undefined, adj: adj === '1' ? 1 : undefined }); }, [who, size, babies, income, per, adj]);
  const annual = per === 'month' ? income * 12 : income;
  const r = useMemo(() => wicIncome(P.wic.annual.us, { size, expectedBabies: who === 'pregnant' ? babies : 0, annualIncome: annual, adjunctive: adj === '1' }), [size, babies, who, annual, adj]);
  const categorical = who !== 'none';
  const verdict = !categorical ? 'WIC serves pregnancy, new mothers and children under 5' : r.eligible ? (r.viaAdjunctive ? 'Income-eligible through SNAP, Medicaid or TANF' : 'Within the WIC income limit') : 'Above the WIC income limit';
  const rows: Array<[string, string]> = [
    ['Household size counted', `${r.size}${who === 'pregnant' ? ' (expected baby included)' : ''}`],
    ['WIC limit (185% of poverty)', `${usd(r.limit)} a year · ${usd(r.monthlyLimit)} a month`],
    ['Your income', `${usd(annual)} a year`],
    ['Adjunctive eligibility', adj === '1' ? 'Yes: SNAP, Medicaid or TANF' : 'No'],
  ];
  const p = idPrefix;
  return (
    <div className="rechner grid gap-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid-cols-2 lg:items-start">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id={`${p}-who`} label="Who would get WIC" value={who} onChange={setWho} options={WHO} />
        <SelectField id={`${p}-size`} label="Household size" value={String(size)} onChange={(v) => setSize(Number(v))} options={sizeOptions(10)} />
        {who === 'pregnant' && <SelectField id={`${p}-babies`} label="Babies expected" value={String(babies)} onChange={(v) => setBabies(Number(v))} options={[{ value: '1', label: '1' }, { value: '2', label: '2 (twins)' }, { value: '3', label: '3' }]} />}
        <NumberField id={`${p}-income`} label={per === 'month' ? 'Household income per month' : 'Household income per year'} value={income} onChange={setIncome} unit="$" max={2000000} help="Gross income before taxes." />
        <Toggle id={`${p}-per`} label="Income entered" value={per} onChange={(v) => setPer(v as 'month' | 'year')} options={[{ value: 'month', label: 'Per month' }, { value: 'year', label: 'Per year' }]} />
        <Toggle id={`${p}-adj`} label="On SNAP, Medicaid or TANF?" value={adj} onChange={(v) => setAdj(v as '0' | '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
      </form>
      <Result label="WIC income test, July 2026 to June 2027" value={categorical && r.eligible ? 'Eligible on income' : 'Not on income'} sub={verdict} methodHref={methodHref}
        note="USDA 2026/2027 WIC income guidelines (maximum allowed). A WIC clinic also checks residence and nutrition risk; some states set a lower income line tied to their health programs.">
        <Meter value={annual} limit={r.limit} label="Income against the WIC limit" />
        <Rows rows={rows} />
      </Result>
    </div>
  );
}
