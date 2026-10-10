import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, sua, fplAt, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('alabama');
const g = S.snap.bbce[0].grossPct;
const par = medLimit('alabama', 'parent', 3);
const kid = medLimit('alabama', 'child6to18', 3);
const preg = medLimit('alabama', 'pregnant', 2);
// A mother of two in Mobile: $2,400 of wages, $850 rent, an electric bill; then the same family with $12,000 saved.
const ex = snapCalc('alabama', { size: 3, earned: 2400, housing: 850 });
const exSaved = snapCalc('alabama', { size: 3, earned: 2400, housing: 850, assets: 12000 });
// A father of two working part time for $500 a month: does he fit under the parent line?
const dad = medCheck('alabama', 'parent', 3, 500);
const madison = hudOf('alabama', 'Madison County', 4);
const jefferson = hudOf('alabama', 'Jefferson County', 4);
const montgomery = hudOf('alabama', 'Montgomery County', 4);
const mobile = hudOf('alabama', 'Mobile County', 4);

export default defineStatePage({
  slug: 'alabama',
  title: 'Alabama Food Stamps and Medicaid 2026: Savings Never Count',
  description: `Alabama benefits 2026: SNAP gross limit ${usd(snapGrossState('alabama', 3))} a month for 3 people with no asset test, parents on Medicaid only below ${usd(par.monthly ?? 0)}, ALL Kids to ${kid.effectivePct}% of poverty.`,
  intro: 'Alabama keeps the federal SNAP income line but drops the savings test, and it covers children generously while parents face one of the lowest Medicaid ceilings in the country.',
  resume: `Alabama checks SNAP income at ${g}% of the poverty guideline, the federal level, which is ${usd(snapGrossState('alabama', 3))} of gross income a month for a household of three in fiscal year ${P.snap.fy}; what it removes is the asset test, so money in the bank never blocks an application. The Alabama Department of Human Resources runs the program, and the heating and cooling allowance used in the shelter deduction is ${usdx(sua('alabama', 3) ?? 0)}, above Georgia's ${usdx(sua('georgia', 3) ?? 0)} and Florida's ${usdx(sua('florida', 3) ?? 0)}. A Mobile mother of two earning ${usd(2400)} a month with ${usd(850)} rent would receive about ${usd(ex.benefit)}. Medicaid is a different story: Alabama has not expanded it, and a parent in a family of three qualifies only below ${usd(par.monthly ?? 0)} a month, ${par.effectivePct}% of poverty. Children are covered far higher, through Medicaid and then ALL Kids up to ${kid.effectivePct}%, about ${usd(kid.monthly ?? 0)} a month for that family.`,
  body: (h) => `<h2>No savings test, but no higher income line either</h2>
<p>Most states that use broad-based categorical eligibility raise the gross income test as well as dropping the asset rule. Alabama only does the second. The USDA chart lists it at ${g}% of poverty with "no limit on assets" (${h.src('fnaBbce', 'USDA BBCE chart, June 2026')}), so the cut-off is the same ${usd(snapGrossState('alabama', 4))} for four that the federal rules use, while the ${usdx(P.snap.assets.general)} resource limit that federal law sets does not apply. Because categorical eligibility also waives the net income test, an Alabama household only has to stay under the gross line; the benefit is then the maximum allotment minus 30% of net income.</p>
<p>Take the Mobile family from the summary. Wages of ${usd(ex.gross)} pass the ${usd(ex.grossLimit ?? 0)} line. The 20% earnings deduction (${usd(ex.deductions.earned)}) and the ${usd(ex.deductions.standard)} standard deduction leave ${usd(ex.adjusted)}. Rent plus the ${usdx(sua('alabama', 3) ?? 0)} utility allowance comes to ${usd(ex.shelterCosts)}; the part above half of adjusted income, ${usd(ex.deductions.shelter)}, is deducted. Net income is ${usd(ex.net)}, 30% of it is ${usd(ex.thirtyPercent)}, and ${usd(ex.maxAllotment)} minus that gives ${usd(ex.benefit)} a month. Put ${usd(12000)} in a savings account and the answer is still ${usd(exSaved.benefit)}. In a state without this option, the same family would be refused. A raise is what costs them: ${usd((ex.grossLimit ?? 0) - ex.gross)} more in monthly wages crosses the ${g}% line, and there is no higher threshold to fall back on. Our ${h.a('snap-calculator', 'SNAP calculator')} runs the same steps for other households.</p>
<h2>The 18% problem for Alabama parents</h2>
<p>CMS records the Alabama parent and caretaker group at ${par.pct}% of the poverty guideline, ${par.effectivePct}% once the MAGI disregard is added (${h.src('cmsLevels', 'CMS eligibility levels')}). For three people that is ${usd(par.monthly ?? 0)} a month. A father of two who works part time for ${usd(500)} a month is already ${dad.eligible ? 'inside' : 'over'} it. Adults without children have no income group at all. Above 100% of the 2025 guideline, ${usd(fplAt(3, 100, 'us', 2025))} a year for three, the ${h.a('aca-subsidy-calculator', 'premium tax credit')} on HealthCare.gov takes over; between the two lines lies the gap described in ${h.a('medicaid-expansion-states', 'Medicaid expansion states')}. Pregnancy opens Medicaid up to ${preg.effectivePct}% of poverty, ${usd(preg.monthly ?? 0)} a month for an expectant mother counted as two.</p>
<h2>ALL Kids and the children's line</h2>
<p>Children move from Medicaid to ALL Kids, Alabama's CHIP run by the Department of Public Health, which reaches ${kid.effectivePct}% of poverty for every age to 19. One online application covers both programs (${h.ext('https://www.alabamapublichealth.gov/allkids/', 'ALL Kids page')}). The tool below converts that line into dollars for your family size.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Huntsville sets the top of the HUD scale</h2>
<p>For a family of four, the very low income limit that opens a Housing Choice Voucher is ${usd(madison.vli)} in Madison County and in neighboring ${S.hud.vli4MaxName}, against ${usd(jefferson.vli)} around Birmingham in Jefferson County, ${usd(montgomery.vli)} in Montgomery County and ${usd(mobile.vli)} in Mobile County. Many rural counties, ${S.hud.vli4MinName} among them, sit at ${usd(S.hud.vli4Min)}. Next door, ${h.a('state:georgia', 'Georgia')} pairs the same ${g}% SNAP rule with no expansion, while ${h.a('state:mississippi', 'Mississippi')} and ${h.a('state:tennessee', 'Tennessee')} keep the federal SNAP asset limit.</p>`,
  faqs: [
    { q: 'Is there an asset limit for food stamps in Alabama?', a: `No. Alabama uses broad-based categorical eligibility with no limit on assets, according to the USDA chart of June 2026, so savings, a second car or a retirement account do not count against a SNAP household. The income line stays at the federal ${g}% of poverty: ${usd(snapGrossState('alabama', 2))} a month for two people and ${usd(snapGrossState('alabama', 4))} for four in fiscal year ${P.snap.fy}.` },
    { q: 'What is the Medicaid income limit for a parent in Alabama?', a: `About ${usd(par.monthly ?? 0)} a month for a family of three in 2026, which is ${par.effectivePct}% of the poverty guideline with the 5% disregard, from the CMS table of state levels. Alabama has not expanded Medicaid, so adults without children do not qualify on income alone. A parent earning more may get a premium tax credit on HealthCare.gov from 100% of the 2025 guideline.` },
    { q: 'How much can a family make for ALL Kids in Alabama?', a: `Up to ${kid.effectivePct}% of the poverty guideline, about ${usd(kid.monthly ?? 0)} a month for three people or ${usd(medLimit('alabama', 'child6to18', 4).monthly ?? 0)} for four in 2026. Children below the Medicaid line for their age get Medicaid instead; above it, ALL Kids applies. The Alabama Department of Public Health runs ALL Kids and takes one application for both programs.` },
    { q: 'What is the Section 8 income limit in Huntsville, Alabama?', a: `For fiscal year 2026, a family of four in Madison County, which includes Huntsville, is very low income up to ${usd(madison.vli)} a year and extremely low income up to ${usd(madison.eli)}. That is the highest level in Alabama, shared with Limestone County. The limits come from HUD and took effect on ${day(P.hud.effective)}; the local housing authority runs the waiting list.` },
  ],
  related: ['state:georgia', 'state:mississippi', 'state:tennessee', 'state:florida', 'medicaid-expansion-states', 'snap-calculator'],
});
