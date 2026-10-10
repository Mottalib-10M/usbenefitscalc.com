import { definePage } from '../../lib/page-types';
import { P, rentCalc, usd, day } from '../../lib/kit';
import { tenantPayment } from '../../lib/engine/section8';

const H = P.hud;
const H27 = { ...H, dependentDeduction: H.nextDependentDeduction, elderlyDisabledDeduction: H.nextElderlyDisabledDeduction };
// Worked households (hypothetical incomes and costs, yearly unless stated).
const mom = rentCalc({ annualIncome: 24000, dependents: 2, elderlyDisabled: false, childCare: 3000 });
const mom27 = tenantPayment(H27, { annualIncome: 24000, dependents: 2, elderlyDisabled: false, childCare: 3000 });
const senior = rentCalc({ annualIncome: 14400, dependents: 0, elderlyDisabled: true, medical: 2400 });
const senior27 = tenantPayment(H27, { annualIncome: 14400, dependents: 0, elderlyDisabled: true, medical: 2400 });
const bigCare = rentCalc({ annualIncome: 12000, dependents: 4, elderlyDisabled: false, childCare: 7000 });
const couple = rentCalc({ annualIncome: 42000, dependents: 1, elderlyDisabled: false });
const zero = rentCalc({ annualIncome: 0, dependents: 1, elderlyDisabled: false, minimumRent: H.maxMinimumRent });
// Voucher arithmetic for the first household: hypothetical payment standard, rent and utility allowance.
const ps = 1800, rent = 1750, ua = 150;
const gross = rent + ua;
const hap = Math.min(ps - mom.ttp, gross - mom.ttp);
const share = gross - hap;
const cap40 = Math.round(((mom.adjusted / 12) * 40) / 100);
const rent2 = 1850;
const share2 = rent2 + ua - Math.min(ps - mom.ttp, rent2 + ua - mom.ttp);
const cfr = (s: string) => `https://www.ecfr.gov/current/title-24/section-${s}`;
const row = (label: string, r: ReturnType<typeof rentCalc>) => [label, usd(r.adjusted), usd(r.thirtyAdjusted), usd(r.tenGross), `<strong>${usd(r.ttp)}</strong>`];

export default definePage({
  id: 'section-8-rent',
  group: 'housing',
  kind: 'guide',
  order: 410,
  slug: 'section-8-rent',
  nav: 'Section 8 rent',
  card: `How a voucher holder's share is computed: 30% of adjusted income, the ${usd(H.dependentDeduction)} deduction per dependent, the 40% cap`,
  title: 'Section 8 Rent 2026: How Much You Pay With a Voucher',
  description: `Section 8 rent in 2026: you pay about 30% of adjusted income after a ${usd(H.dependentDeduction)} deduction per dependent and ${usd(H.elderlyDisabledDeduction)} for seniors. A family on ${usd(24000)} pays ${usd(mom.ttp)} a month.`,
  h1: 'Section 8 rent: how much you pay with a voucher',
  intro: 'Your share is not a percentage of the rent. It is a percentage of your income after deductions, and the voucher covers the gap up to a local ceiling.',
  resume: `With a Housing Choice Voucher you pay the total tenant payment, which is the highest of three amounts: 30% of your monthly adjusted income, 10% of your monthly gross income, or the minimum rent your housing authority sets, up to ${usd(H.maxMinimumRent)}. Adjusted income is gross yearly income minus ${usd(H.dependentDeduction)} for each dependent and ${usd(H.elderlyDisabledDeduction)} for a family whose head or spouse is 62 or older or disabled, the 2026 amounts, which rise to ${usd(H.nextDependentDeduction)} and ${usd(H.nextElderlyDisabledDeduction)} on ${day(H.nextEffective)}. Child care for children under 13 that lets someone work, look for work or study comes off too, and so do medical costs of an elderly or disabled family above ${H.medicalThresholdPct}% of income. A mother of two earning ${usd(24000)} a year who pays ${usd(3000)} of child care has ${usd(mom.adjusted)} of adjusted income and a tenant payment of ${usd(mom.ttp)} a month. The housing authority pays the landlord the rest, up to its payment standard. If the unit costs more, you pay the difference, but at move-in your share cannot exceed 40% of adjusted monthly income.`,
  mini: 'rentTtp',
  faqs: [
    { q: 'How much rent will I pay with Section 8 if I have no income?', a: `Usually the minimum rent, which a housing authority can set at up to ${usd(H.maxMinimumRent)} a month for vouchers, or nothing if it sets none. If you cannot pay it because you lost a job, lost another benefit, face eviction or had a death in the family, you can ask for a hardship exemption, and the authority must suspend the minimum rent from the next month while it decides.` },
    { q: 'Why can\'t I rent an apartment above the Section 8 payment standard?', a: `You can, within a limit. When the gross rent, meaning rent plus the utility allowance, is above the payment standard, you pay the difference on top of your tenant payment. At the first lease, though, 24 CFR 982.508 caps your total share at 40% of adjusted monthly income. A family with ${usd(mom.adjusted)} of adjusted income a year cannot start a lease where its share would exceed ${usd(cap40)} a month.` },
    { q: 'How much is the Section 8 dependent deduction in 2026?', a: `${usd(H.dependentDeduction)} a year for each dependent in 2026, rising to ${usd(H.nextDependentDeduction)} on ${day(H.nextEffective)}. A dependent is a household member other than the head or spouse who is under 18, a full-time student or a person with a disability; foster children and foster adults do not count. Each ${usd(H.dependentDeduction)} of deduction lowers the monthly tenant payment by about ${usd((H.dependentDeduction * H.rentShareAdjusted) / 100 / 12)}, since rent is 30% of adjusted income spread over 12 months.` },
    { q: 'Can seniors deduct medical bills from Section 8 income?', a: `Yes. A family whose head, spouse or co-head is 62 or older or has a disability deducts unreimbursed medical costs above ${H.medicalThresholdPct}% of annual income, on top of the ${usd(H.elderlyDisabledDeduction)} elderly or disabled family deduction. A retiree with ${usd(14400)} of Social Security and ${usd(2400)} of yearly medical bills deducts ${usd(senior.deductions.medical)}, which brings her tenant payment to ${usd(senior.ttp)} a month.` },
    { q: 'Does my Section 8 share include utilities?', a: `Yes, when you pay utilities yourself. The housing authority adds its utility allowance to the rent to get the gross rent, and your total tenant payment covers both. When the gross rent is within the payment standard, the subsidy is computed on rent plus allowance: with a ${usd(mom.ttp)} tenant payment and a ${usd(ua)} allowance, you pay the landlord ${usd(mom.ttp - ua)} and keep ${usd(ua)} for the bills. If the landlord pays all utilities, the allowance is zero.` },
  ],
  body: (h) => `<h2>Total tenant payment: the 30% rule and its two floors</h2>
<p>Every voucher calculation starts from one figure, the total tenant payment, defined in ${h.src('cfr245628', '24 CFR 5.628')}. It is the highest of these amounts, rounded to the nearest dollar:</p>
<ul>
<li>${H.rentShareAdjusted}% of the family's monthly adjusted income;</li>
<li>${H.rentShareGross}% of the family's monthly income before deductions;</li>
<li>for a family on welfare whose payment includes a part the agency designates for housing, that designated part;</li>
<li>the minimum rent, which the housing authority may set at up to ${usd(H.maxMinimumRent)} a month for vouchers and public housing.</li>
</ul>
<p>For nearly every household the first line wins. The 10% line only takes over when deductions are very large compared with income: the adjusted income would have to fall below one third of gross income. In practice, when people say Section 8 tenants pay 30% of income, they mean 30% of adjusted income, which is lower than what they actually earn.</p>
<p>The total tenant payment is not necessarily what you hand the landlord. It covers your rent share and your utility bills together, and it can grow if you pick a unit that costs more than the local payment standard, as explained further down. It is also the starting point for public housing, where the same 5.628 rule applies.</p>
<h2>Deductions that lower adjusted income in 2026 and 2027</h2>
<p>Adjusted income is annual income minus the deductions of ${h.src('cfr245611', '24 CFR 5.611')}. Since the housing law known as HOTMA, HUD adjusts the two flat deductions for inflation every year, rounded down to a multiple of $25. The 2026 values come from ${h.src('hudHotma', "HUD's table of inflation-adjusted values")}, effective January 1, 2026; the 2027 values apply from ${day(H.nextEffective)}.</p>
${h.table(['Deduction', '2026', `From ${day(H.nextEffective)}`, 'Who gets it'], [
    ['Each dependent', usd(H.dependentDeduction), usd(H.nextDependentDeduction), 'members under 18, full-time students and people with a disability, other than the head or spouse (foster children excluded)'],
    ['Elderly or disabled family', usd(H.elderlyDisabledDeduction), usd(H.nextElderlyDisabledDeduction), 'once per family, when the head, spouse or co-head is 62+ or disabled'],
    ['Medical and attendant care', `above ${H.medicalThresholdPct}% of income`, `above ${H.medicalThresholdPct}% of income`, 'unreimbursed medical costs of elderly or disabled families; attendant care and equipment that let a member with a disability, or another member, work'],
    ['Child care', 'actual cost', 'actual cost', 'reasonable, unreimbursed care of children under 13 so a member can look for work, work or study'],
  ], 'Mandatory deductions from annual income, 24 CFR 5.611. A housing authority may adopt additional deductions in its administrative plan.', ['l', 'r', 'r', 'l'])}
<p>The flat deductions are small. ${usd(H.dependentDeduction)} a year is worth about ${usd((H.dependentDeduction * H.rentShareAdjusted) / 100 / 12)} a month off the tenant payment, so a third child lowers the rent by that amount, not by a third. Child care and medical costs move the result far more, because they are deducted in full, or in full above the threshold. Keep receipts, since the calculation rests on information the housing authority has verified. Attendant care and auxiliary apparatus costs are capped at what the family members who can work thanks to them earn.</p>
<p>The 2027 increase changes little for most families. The mother of two in the examples below goes from ${usd(mom.ttp)} to ${usd(mom27.ttp)} a month when the dependent deduction moves to ${usd(H.nextDependentDeduction)}, ${senior27.ttp === senior.ttp ? `, while the retiree stays at ${usd(senior.ttp)} because the extra ${usd(H.nextElderlyDisabledDeduction - H.elderlyDisabledDeduction)} of deduction is worth less than a dollar a month once rounded` : `, and the retiree from ${usd(senior.ttp)} to ${usd(senior27.ttp)}`}.</p>
<h2>Payment standard, utility allowance and the 40% cap</h2>
<p>The voucher itself is a subsidy with a ceiling. Each housing authority sets a payment standard for each unit size, normally between 90% and 110% of HUD's fair market rent for the area under ${h.ext(cfr('982.503'), '24 CFR 982.503')}, and higher only through an exception. It also publishes a utility allowance schedule: the monthly cost it assumes for the utilities a tenant pays, by unit size and type of energy. The rent plus the utility allowance is the gross rent.</p>
<p>Under ${h.ext(cfr('982.505'), '24 CFR 982.505')}, the authority pays the landlord the lower of two amounts: the payment standard minus the total tenant payment, or the gross rent minus the total tenant payment. Take the mother of two, whose tenant payment is ${usd(mom.ttp)}. In an apartment rented ${usd(rent)} with a utility allowance of ${usd(ua)}, the gross rent is ${usd(gross)}. With a payment standard of ${usd(ps)}, the subsidy is ${usd(ps)} minus ${usd(mom.ttp)}, or ${usd(hap)}. Her share of the gross rent is therefore ${usd(share)}: ${usd(share - ua)} to the landlord and ${usd(ua)} kept for the bills. Above the payment standard, every extra dollar of rent is hers to pay.</p>
<p>That is where the 40% rule steps in. ${h.ext(cfr('982.508'), '24 CFR 982.508')} says that when the authority approves a first lease and the gross rent exceeds the payment standard, the family share may not exceed 40% of adjusted monthly income. For this family, 40% of ${usd(mom.adjusted / 12)} is ${usd(cap40)}. Her ${usd(share)} share passes. A unit at ${usd(rent2)} would push it to ${usd(share2)}, above the cap, and the authority could not approve that lease. The cap protects families from signing a lease they cannot carry. It applies only when the authority approves a new tenancy, so a share that later climbs above 40% because the rent went up is not blocked by it.</p>
<h2>Five households, computed</h2>
<p>The table applies the 2026 deductions to five situations. Incomes are yearly and gross; the tenant payments are monthly. The mini calculator at the top of the page does the same with your own figures.</p>
${h.table(['Household (2026)', 'Adjusted income', '30% of adjusted, monthly', '10% of gross, monthly', 'Tenant payment'], [
    row(`Mother, 2 children, ${usd(24000)} wages, ${usd(3000)} child care`, mom),
    row(`Retiree alone, ${usd(14400)} Social Security, ${usd(2400)} medical`, senior),
    row(`Parent, 4 children, ${usd(12000)}, ${usd(7000)} child care`, bigCare),
    row(`Couple, 1 child, ${usd(42000)}`, couple),
    row(`Parent, 1 child, no income, minimum rent of ${usd(H.maxMinimumRent)}`, zero),
  ], 'Total tenant payment under 24 CFR 5.628 with the 2026 deductions of 24 CFR 5.611.', ['l', 'r', 'r', 'r', 'r'])}
<p>The retiree's medical bills of ${usd(2400)} exceed ${H.medicalThresholdPct}% of her income by ${usd(senior.deductions.medical)}, and that amount comes off on top of the ${usd(H.elderlyDisabledDeduction)} family deduction. The parent of four with heavy child care is the rare case where the 10% line wins: deductions leave ${usd(bigCare.adjusted)} of adjusted income, and 30% of it, ${usd(bigCare.thirtyAdjusted)} a month, is less than 10% of gross income, ${usd(bigCare.tenGross)}. The couple earning ${usd(42000)} pays ${usd(couple.ttp)}; whether that couple qualifies at all depends on the very low income limit of its county, which you can check in ${h.a('section-8-income-limits', 'Section 8 income limits')}.</p>
<h2>Minimum rent, zero income and hardship</h2>
<p>A family with no income has a tenant payment of zero under the 30% and 10% lines, so the minimum rent decides. ${h.ext(cfr('5.630'), '24 CFR 5.630')} lets a housing authority set it at up to ${usd(H.maxMinimumRent)} for vouchers and public housing, and fixes it at $25 for the other Section 8 programs.</p>
<p>The same rule requires an exemption for financial hardship. It covers a family that lost eligibility for another assistance program or is waiting for a decision, a family that would be evicted because it cannot pay, a drop in income after a job loss or another change, a death in the family, and other situations the housing authority or HUD recognizes. When a voucher family asks, the authority must suspend the minimum rent from the following month until it decides whether the hardship is real and whether it is temporary or long term.</p>
<p>Income changes during the year matter in both directions, and each housing authority explains in its administrative plan when it recomputes the tenant payment and which changes you must report. Keep pay stubs, benefit letters and child care receipts together, since the figures come from verified documents. For other help with the same household budget, the ${h.a('snap-calculator', 'SNAP calculator')} counts your rent in the shelter deduction, and the ${h.a('federal-poverty-level', 'federal poverty level')} page shows where your income stands for health programs.</p>`,
  related: ['section-8-income-limits', 'snap-calculator', 'snap-deductions', 'federal-poverty-level', 'states'],
  sources: ['cfr245628', 'cfr245611', 'hudHotma', 'hudIl'],
  extraSources: [
    { name: '24 CFR 982.508: maximum family share at initial occupancy', url: cfr('982.508') },
    { name: '24 CFR 982.505: how to calculate the housing assistance payment', url: cfr('982.505') },
    { name: '24 CFR 982.503: payment standard areas, schedule and amounts', url: cfr('982.503') },
    { name: '24 CFR 5.630: minimum rent and hardship exemption', url: cfr('5.630') },
  ],
});
