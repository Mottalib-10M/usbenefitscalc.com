import { definePage } from '../../lib/page-types';
import { P, STATES, sd, hudRows, hudRow, hudOf, fpl, usd, day } from '../../lib/kit';

const H = P.hud;
const big: Array<[string, string]> = [
  ['california', 'Los Angeles County'], ['new-york', 'Kings County'], ['illinois', 'Cook County'], ['texas', 'Harris County'],
  ['arizona', 'Maricopa County'], ['washington', 'King County'], ['florida', 'Miami-Dade County'], ['georgia', 'Fulton County'],
  ['michigan', 'Wayne County'], ['pennsylvania', 'Philadelphia County'], ['texas', 'Dallas County'], ['california', 'San Diego County'],
];
const bigRows = big.map(([s, n]) => { const r = hudRow(s, n); const l = hudOf(s, n, 4); return [`${n}, ${sd(s).abbr}`, usd(l.eli), `<strong>${usd(l.vli)}</strong>`, usd(l.li), usd(hudOf(s, n, 1).vli), usd(r.median)]; });
// Every HUD area of the 50 states and DC, with the state's poverty area.
const all = STATES.flatMap((s) => hudRows(s.slug).map((r) => ({ s, r })));
const byV = [...all].sort((a, b) => a.r.v[3] - b.r.v[3]);
const lo = byV[0];
const hi = byV[byV.length - 1];
const onFloor = all.filter(({ s, r }) => r.e[3] === fpl(4, s.area)).length;
const belowFloor = all.filter(({ s, r }) => r.e[3] < fpl(4, s.area)).length;
const la = hudOf('california', 'Los Angeles County', 4);
const laMed = hudRow('california', 'Los Angeles County').median;
const harris = hudOf('texas', 'Harris County', 4);
const cook = hudOf('illinois', 'Cook County', 4);
const kings = hudOf('new-york', 'Kings County', 4);
const nAreas = all.length;

export default definePage({
  id: 'section-8-income-limits',
  group: 'housing',
  kind: 'pillar',
  order: 400,
  slug: 'section-8-income-limits',
  nav: 'Section 8 income limits',
  card: `FY 2026 HUD limits by county: very low income for four runs from ${usd(lo.r.v[3])} to ${usd(hi.r.v[3])}`,
  title: `Section 8 Income Limits 2026: ${usd(lo.r.v[3])} to ${usd(hi.r.v[3])} for 4`,
  description: `Section 8 income limits for FY 2026, since May 1, 2026: a family of four can get a voucher with up to ${usd(la.vli)} in Los Angeles County, ${usd(harris.vli)} in Harris County.`,
  h1: 'Section 8 income limits for 2026, county by county',
  intro: 'HUD sets a separate limit for every county or metro area and every household size. Find yours, and see which program each tier opens.',
  resume: `Section 8 income limits are not national: HUD publishes them for each county or metropolitan area, and the FY ${H.fy} limits have applied since ${day(H.effective)}. To get a Housing Choice Voucher, a household generally needs income at or below the very low income limit of its area, which for a family of four ranges from ${usd(lo.r.v[3])} in ${lo.r.n}, ${lo.s.name}, to ${usd(hi.r.v[3])} in ${hi.r.n}, ${hi.s.name}. In Los Angeles County the very low limit for four is ${usd(la.vli)}, in Cook County ${usd(cook.vli)}, in Harris County ${usd(harris.vli)}. Public housing accepts families up to the low income limit, ${usd(la.li)} for four in Los Angeles County. Housing authorities must give at least ${H.elisShareOfNewVouchers}% of the vouchers they issue each year to extremely low income families, whose limit for four is ${usd(la.eli)} in Los Angeles County. Income means gross yearly income of everyone in the household, and since 2026 net family assets above ${usd(H.assetLimit)} can also block admission where the housing authority applies the new asset rule.`,
  tool: 'section8',
  toolProps: { state: 'california' },
  faqs: [
    { q: 'What is the Section 8 income limit for a family of 4?', a: `It depends on the county. For FY ${H.fy}, the very low income limit that opens a voucher is ${usd(la.vli)} for four in Los Angeles County, ${usd(kings.vli)} in the New York City area, ${usd(cook.vli)} in Cook County and ${usd(harris.vli)} in Harris County. Nationally it runs from ${usd(lo.r.v[3])} to ${usd(hi.r.v[3])}. Each state page has a lookup with every county.` },
    { q: 'Is the Section 8 income limit based on gross or net income?', a: 'Gross. Housing authorities compare annual income, as defined in 24 CFR 5.609, with the limit: amounts received from all sources by the adults, the head and the spouse, plus unearned income of children under 18, minus the exclusions HUD lists, such as the earnings of children under 18. Deductions for dependents, child care or medical costs come later, when the authority computes your rent.' },
    { q: 'When do the new Section 8 income limits take effect?', a: `The FY ${H.fy} limits took effect on ${day(H.effective)} and stay in force until HUD publishes the FY ${H.fy + 1} set. They are the limits a housing authority uses when it decides whether an applicant is eligible to be admitted. If your income was just above the old limit for your county, check again: in most areas the new figures are higher than the old ones.` },
    { q: 'Why are Section 8 limits so much higher in California?', a: `Because the limits follow each area's median family income, with adjustments HUD makes to the raw percentages. ${hi.r.n} has the highest very low income limit in the country, ${usd(hi.r.v[3])} for four, and the San Francisco area follows closely. Los Angeles County, where the median is ${usd(laMed)}, sits at ${usd(la.vli)}. Areas with low medians land near the national floor of ${usd(lo.r.v[3])}.` },
    { q: 'Can I get Section 8 if my income is above the very low limit?', a: `Sometimes. Federal rules let a family up to the low income limit (${usd(la.li)} for four in Los Angeles County) receive a voucher if it is continuously assisted under the Housing Act, meets extra criteria in the housing authority's administrative plan, or is displaced by certain events such as a mortgage prepayment. Public housing admits low income families without those conditions.` },
    { q: 'Is there an asset limit for Section 8 in 2026?', a: `Yes, where the housing authority already applies sections 102 and 104 of HOTMA. HUD's table of 2026 values sets the restriction on net family assets at ${usd(H.assetLimit)} for vouchers, public housing and project-based Section 8, effective January 1, 2026, and adjusts it for inflation each year. An agency that does not yet follow those sections does not use the figure.` },
    { q: 'What does extremely low income mean for Section 8?', a: `It is the lowest of HUD's three tiers: ${usd(la.eli)} for four in Los Angeles County and ${usd(harris.eli)} in Harris County for FY ${H.fy}. Families under it are not a separate program, but each housing authority must give at least ${H.elisShareOfNewVouchers}% of the vouchers it issues each year to them, which can weigh on how fast a family moves up the waiting list.` },
  ],
  body: (h) => `<h2>FY 2026 limits in twelve large counties</h2>
<p>HUD's ${h.src('hudIl', 'FY 2026 income limits')} cover ${nAreas.toLocaleString('en-US')} counties, county equivalents and New England towns in the 50 states and DC. Each comes with three columns per household size, from one to eight people. The table shows a family of four in the largest counties of a dozen metro areas, with the very low limit for a single person for comparison.</p>
${h.table(['County', 'Extremely low, 4', 'Very low, 4', 'Low, 4', 'Very low, 1', 'Median family income'], bigRows, `HUD FY ${H.fy} Section 8 income limits, effective ${day(H.effective)}, yearly gross income.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Counties in the same metro area share one set of limits, which is why Kings County, Brooklyn's county, has exactly the figures of Manhattan's New York County. Harris and Dallas, the two largest counties of Texas, differ by ${usd(hudOf('texas', 'Dallas County', 4).vli - harris.vli)} for four because they belong to different metro areas with different medians.</p>
<h2>The highest and lowest limits in the country</h2>
<p>The very low income limit for four is highest in ${hi.r.n}, ${hi.s.name}, at ${usd(hi.r.v[3])}, and lowest in ${lo.r.n}, ${lo.s.name}, at ${usd(lo.r.v[3])}: two counties with the same name, one on the California coast and one on the Mexican border of Arizona, separated by ${usd(hi.r.v[3] - lo.r.v[3])}. A family of four earning ${usd(60000)} is well inside the voucher limit in the first and nearly twice over it in the second. The bottom of the range is crowded: a quarter of all areas have a limit for four of ${usd(byV[Math.floor(byV.length / 4)].r.v[3])} or less, and ${Math.round((byV.slice(0, Math.floor(byV.length / 4)).filter((x) => !x.r.metro).length / Math.floor(byV.length / 4)) * 100)}% of those are outside metropolitan areas. The top is concentrated in coastal California and in the towns of the Boston area.</p>
<p>The extremely low tier behaves differently at the bottom. In the FY ${H.fy} file, ${belowFloor === 0 ? 'no area has' : `${belowFloor} areas have`} an extremely low limit for four below the 2026 poverty guideline for four (${usd(fpl(4))} in the 48 states), and ${onFloor.toLocaleString('en-US')} sit exactly on it. Harris County is one of them: its extremely low limit for four is ${usd(harris.eli)}, the poverty guideline itself, while for one person it is ${usd(hudOf('texas', 'Harris County', 1).eli)}.</p>
<h2>Three tiers, three doors</h2>
<p><strong>Very low income</strong> is the general test for a Housing Choice Voucher under ${h.ext('https://www.ecfr.gov/current/title-24/section-982.201', '24 CFR 982.201')}. A low income family can qualify only in listed cases, such as being continuously assisted under the Housing Act or meeting extra criteria the housing authority wrote into its administrative plan.</p>
<p><strong>Low income</strong> is the ceiling for public housing under ${h.ext('https://www.ecfr.gov/current/title-24/section-960.201', '24 CFR 960.201')}: no family above it can be admitted.</p>
<p><strong>Extremely low income</strong> opens no separate program, but it decides who gets served first. At least ${H.elisShareOfNewVouchers}% of the vouchers a housing authority issues each year go to extremely low income families, which shapes who comes off the waiting list first.</p>
<p>Since the HOTMA rules took effect, admission also depends on assets where the agency applies them: net family assets may not exceed ${usd(H.assetLimit)} in 2026, according to ${h.src('hudHotma', "HUD's 2026 inflation-adjusted values")}. Meeting the limits makes a family eligible; it does not guarantee a voucher, which depends on the housing authority's funding and its waiting list.</p>
<h2>Reading the limit for your own household</h2>
<p>Count everyone who will live in the unit and add up their gross income for the year. Under 24 CFR 5.609 that means everything the adults, the head and the spouse receive from any source, plus unearned income received for children under 18; the earnings of children under 18 are left out, as are foster care payments and reimbursements of medical costs. Compare the total with the column for your household size in your county. The ${h.a('states', 'state pages')} include a lookup with every county and HUD area of the state, for example ${h.a('state:california', 'California')}, ${h.a('state:texas', 'Texas')} or ${h.a('state:new-york', 'New York')}, and the calculator above does the same here.</p>
<p>Passing the limit is the first step. What you then pay is a separate calculation, roughly 30% of adjusted income, explained in ${h.a('section-8-rent', 'Section 8 rent')}. HUD's limits come from area median income, not from the ${h.a('federal-poverty-level', 'federal poverty level')}, so a household that qualifies for ${h.a('snap-income-limits', 'SNAP')} or Medicaid may or may not qualify for housing help, and the other way around.</p>`,
  related: ['section-8-rent', 'state:california', 'state:new-york', 'state:texas', 'federal-poverty-level', 'states'],
  sources: ['hudIl', 'hudHotma', 'cfr245611', 'cfr245628'],
  extraSources: [
    { name: '24 CFR 982.201: voucher eligibility and targeting', url: 'https://www.ecfr.gov/current/title-24/section-982.201' },
    { name: '24 CFR 960.201: public housing eligibility', url: 'https://www.ecfr.gov/current/title-24/section-960.201' },
    { name: '24 CFR 5.609: annual income', url: 'https://www.ecfr.gov/current/title-24/section-5.609' },
  ],
});
