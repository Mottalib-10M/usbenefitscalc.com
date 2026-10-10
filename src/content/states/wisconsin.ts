import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGrossState, medLimit, medCheck, sua, fplAt, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('wisconsin');
const g = S.snap.bbce[0].grossPct;
const adult = medLimit('wisconsin', 'adult', 1);
const kid = medLimit('wisconsin', 'child6to18', 3);
const baby = medLimit('wisconsin', 'infant', 3);
const preg = medLimit('wisconsin', 'pregnant', 2);
// A retired couple in Milwaukee: $2,150 of Social Security, $900 rent, they pay for heat; $120 a month of medical costs.
const ex = snapCalc('wisconsin', { size: 2, unearned: 2150, housing: 900, elderlyDisabled: true, medical: 120 });
// A single cashier in Green Bay, $1,250 a month: BadgerCare test.
const cashier = medCheck('wisconsin', 'adult', 1, 1250);
const dane = hudOf('wisconsin', 'Dane County', 4);
const milw = hudOf('wisconsin', 'Milwaukee County', 4);

export default defineStatePage({
  slug: 'wisconsin',
  title: 'Wisconsin FoodShare and BadgerCare Limits 2026: Who Gets It',
  description: `Wisconsin 2026: FoodShare gross limit ${usd(snapGrossState('wisconsin', 3))} a month for 3 (${g}%), heating allowance ${usdx(sua('wisconsin', 1) ?? 0)}, and BadgerCare Plus for adults up to ${adult.effectivePct}% of the poverty line.`,
  intro: 'Wisconsin did not take the ACA expansion, yet it covers adults up to the poverty line through BadgerCare Plus, and its FoodShare utility allowance is among the highest.',
  resume: `Wisconsin calls SNAP FoodShare and Medicaid BadgerCare Plus, both run by the ${S.medicaid.agency ?? 'Department of Health Services'}. FoodShare tests gross income at ${g}% of the poverty guideline, ${usd(snapGrossState('wisconsin', 3))} a month for three people in fiscal year ${P.snap.fy}, with no asset test, and its heating and cooling allowance of ${usdx(sua('wisconsin', 1) ?? 0)} is one of the largest in the USDA table, which pushes the shelter deduction up. A retired Milwaukee couple living on ${usd(2150)} of Social Security with ${usd(900)} in rent would receive about ${usd(ex.benefit)} a month. On health, Wisconsin is an exception among the non-expansion states: a waiver lets BadgerCare Plus cover adults without children up to ${adult.effectivePct}% of the poverty guideline, about ${usd(adult.monthly ?? 0)} a month for one person, while children are covered much higher, up to ${kid.effectivePct}% for school-age children in a family of three.`,
  body: (h) => `<h2>BadgerCare Plus stops at the poverty line, not at 138%</h2>
<p>The CMS table lists Wisconsin as a state that did not adopt the ACA expansion, with a footnote: a section 1115 demonstration covers adults up to 95% of the poverty guideline, 100% once the 5% disregard is added (${h.src('cmsLevels', 'CMS eligibility levels')}). A single cashier in Green Bay earning ${usd(1250)} a month sits at ${Math.round(cashier.pctIncome)}% of the 2026 guideline: ${cashier.eligible ? 'inside BadgerCare Plus' : 'above the BadgerCare line'}. The limit for one adult is about ${usd(adult.monthly ?? 0)} a month. Just above it, the Marketplace takes over: the 2026 premium tax credit starts at 100% of the 2025 guideline, ${usd(fplAt(1, 100, 'us', 2025))} a year, so in Wisconsin there is no coverage gap of the kind found in the other non-expansion states. Parents and caretakers have the same ${adult.effectivePct}% line.</p>
<h2>Babies and pregnancy: three times the poverty line</h2>
<p>Babies under one and pregnant women are covered up to ${baby.effectivePct}% and ${preg.effectivePct}% of the guideline, about ${usd(baby.monthly ?? 0)} a month for a family of three and ${usd(preg.monthly ?? 0)} for a pregnant woman expecting one baby. School-age children in Medicaid stop lower, but a separate CHIP covers ages 1 up to 19 to ${kid.effectivePct}%, so a family of three with ${usd(5000)} a month still has the children covered. The mini-calculator turns the CHIP line into dollars for any family size.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>A FoodShare budget for an older couple</h2>
<p>Households with a member 60 or older skip the gross income test, keep the whole shelter deduction without the ${usd(P.snap.shelterCap.us)} cap and can deduct medical costs above ${usd(P.snap.medicalThreshold)} a month. For the Milwaukee couple: ${usd(ex.gross)} of Social Security, minus the ${usd(ex.deductions.standard)} standard deduction and ${usd(ex.deductions.medical)} of medical costs, leaves ${usd(ex.adjusted)}. Rent plus the ${usdx(sua('wisconsin', 2) ?? 0)} heating allowance makes ${usd(ex.shelterCosts)}, and the part above half of the remaining income, ${usd(ex.deductions.shelter)}, comes off as well. Net income ${usd(ex.net)}, 30% of it ${usd(ex.thirtyPercent)}, and the couple's estimate is ${usd(ex.benefit)} of the ${usd(ex.maxAllotment)} maximum. Without the heating allowance the result would be much lower, which is why Wisconsin's large allowance matters to retirees on fixed incomes. More on these rules in ${h.a('snap-for-seniors', 'SNAP for seniors')}.</p>
<h2>Madison and Milwaukee limits for Section 8</h2>
<p>HUD's FY 2026 file gives Dane County, around Madison, the highest very low income limit in Wisconsin, ${usd(dane.vli)} for a family of four, against ${usd(milw.vli)} in Milwaukee County and ${usd(S.hud.vli4Min)} in the lowest rural counties. The county lookup below has all ${S.hud.rows} entries. Marketplace coverage in Wisconsin goes through HealthCare.gov for 2026.</p>
<p>Next door, ${h.a('state:minnesota', 'Minnesota')} adds a Basic Health Program above Medicaid, ${h.a('state:illinois', 'Illinois')} took the ACA expansion and ${h.a('state:michigan', 'Michigan')} covers adults to 138% under the expansion.</p>`,
  faqs: [
    { q: 'What is the FoodShare income limit in Wisconsin for 2027?', a: `For fiscal year ${P.snap.fy}, Wisconsin tests gross monthly income at ${g}% of the poverty guideline: ${usd(snapGrossState('wisconsin', 1))} for one person, ${usd(snapGrossState('wisconsin', 3))} for three and ${usd(snapGrossState('wisconsin', 4))} for four, with no asset test. Households with a member 60 or older or disabled who are above that line can still qualify under the federal net income test.` },
    { q: 'Can a single adult get BadgerCare Plus in Wisconsin?', a: `Yes, if income is at or below ${adult.effectivePct}% of the 2026 poverty guideline, about ${usd(adult.monthly ?? 0)} a month. Wisconsin covers adults without children under a waiver even though it did not adopt the ACA expansion. Above that line, the 2026 premium tax credit on HealthCare.gov begins, so most adults have one of the two.` },
    { q: 'How much FoodShare does a retired couple get in Wisconsin?', a: `It depends on income, rent and medical costs. A Milwaukee couple with ${usd(2150)} a month of Social Security, ${usd(900)} rent, a heating bill and ${usd(120)} of monthly medical costs would get about ${usd(ex.benefit)} a month under fiscal year ${P.snap.fy} rules. Their heating allowance of ${usdx(sua('wisconsin', 2) ?? 0)} and the uncapped shelter deduction for people 60 and older do most of the work.` },
  ],
  related: ['state:minnesota', 'state:illinois', 'state:michigan', 'medicaid-expansion-states', 'snap-for-seniors', 'snap-deductions'],
});
