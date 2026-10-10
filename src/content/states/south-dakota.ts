import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGross, snapNet, medLimit, medCheck, sua, hudOf, usd, usdx } from '../../lib/kit';

const S = sd('south-dakota');
const hc = sua('south-dakota', 3) ?? 0;
const lua = S.snap.sua[0].lua ?? 0;
const lv = S.medicaid;
const kid = medLimit('south-dakota', 'child6to18', 3);
const preg = medLimit('south-dakota', 'pregnant', 2);
const adult = medLimit('south-dakota', 'adult', 1);
// A family of three in Sioux Falls (Minnehaha County): $2,700 of wages, $1,000 rent, heating bill, $2,000 saved.
const ex = snapCalc('south-dakota', { size: 3, earned: 2700, housing: 1000, assets: 2000 });
const exSaved = snapCalc('south-dakota', { size: 3, earned: 2700, housing: 1000, assets: 3200 });
const exLua = snapCalc('south-dakota', { size: 3, earned: 2700, housing: 1000, assets: 2000, utilities: lua });
// A pregnant woman in Rapid City living alone, $2,300 a month: counted as two.
const mom = medCheck('south-dakota', 'pregnant', 2, 2300);
const stanley = hudOf('south-dakota', 'Stanley County', 4);
const hughes = hudOf('south-dakota', 'Hughes County', 4);
const minn = hudOf('south-dakota', 'Minnehaha County', 4);
const penn = hudOf('south-dakota', 'Pennington County', 4);
const bees = S.notes.find((n) => n.includes('SD BEES'));

export default defineStatePage({
  slug: 'south-dakota',
  title: `South Dakota SNAP 2027: ${usdx(hc)} Heating Aid, ${usdx(P.snap.assets.general)} Asset Cap`,
  description: `South Dakota SNAP 2027: federal tests (${usd(snapGross(3))} gross for 3), a ${usdx(P.snap.assets.general)} asset limit, a ${usdx(hc)} heating allowance; Medicaid for adults to ${adult.effectivePct}% of poverty in 2026.`,
  intro: 'South Dakota pairs one of the largest SNAP heating allowances with the strict federal savings test, and covers adults through the Medicaid expansion.',
  resume: `South Dakota is one of the few states that still applies the federal SNAP tests in full, without broad-based categorical eligibility: gross income under 130% of poverty (${usd(snapGross(3))} a month for three in fiscal year ${P.snap.fy}), net income under ${usd(snapNet(3))}, and countable resources under ${usdx(P.snap.assets.general)}, or ${usdx(P.snap.assets.elderlyDisabled)} with a member 60 or older or disabled. In return, the state's heating and cooling allowance of ${usdx(hc)} is among the largest in the country. A Sioux Falls family of three earning ${usd(2700)} with ${usd(1000)} rent and ${usd(2000)} saved would receive about ${usd(ex.benefit)} a month from the Department of Social Services; with ${usd(3200)} in the bank, ${exSaved.eligible ? usd(exSaved.benefit) : 'nothing'}. South Dakota has expanded Medicaid, so adults qualify up to ${adult.effectivePct}% of poverty, ${usd(adult.monthly ?? 0)} a month alone, and children up to ${kid.effectivePct}%.`,
  body: (h) => `<h2>A big heating allowance, a small savings cushion</h2>
<p>Two numbers decide most South Dakota SNAP cases. The first is the ${usdx(hc)} heating and cooling allowance listed in the ${h.src('fnaSua', 'USDA table')}, available to any household that pays for heat or air conditioning; a household paying only other utilities gets ${usdx(lua)}. For the Sioux Falls family, rent plus the larger allowance makes ${usd(ex.shelterCosts)} of shelter costs, enough to ${ex.shelterCapped ? `hit the ${usd(P.snap.shelterCap.us)} cap on the shelter deduction` : `produce a shelter deduction of ${usd(ex.deductions.shelter)}`}. With the earnings deduction (${usd(ex.deductions.earned)}) and the standard deduction (${usd(ex.deductions.standard)}), net income drops to ${usd(ex.net)} and the benefit is ${usd(ex.benefit)}. Had they paid only electricity and water, it would be ${usd(exLua.benefit)}.</p>
<p>The second number is the ${h.src('cfr2739', 'federal resource limit')}. Because South Dakota does not use broad-based categorical eligibility, a checking account, savings and cash on hand all count, up to ${usdx(P.snap.assets.general)}. The same family with ${usd(3200)} saved is refused: ${exSaved.reason ? exSaved.reason.toLowerCase() : 'resources above the limit'}. The home, most retirement accounts and the value of household goods are excluded under federal rules. Income faces two hurdles as well: ${usd(ex.gross)} against the ${usd(snapGross(3))} gross line, then ${usd(ex.net)} against the ${usd(snapNet(3))} net line. Neighboring ${h.a('state:north-dakota', 'North Dakota')} has neither an asset test nor a 130% line, and ${h.a('state:wyoming', 'Wyoming')} applies the same federal rules as South Dakota.</p>
${bees ? `<p>Applications can be made online through ${h.ext('https://eaportal.sd.gov/', 'SD BEES')}, the South Dakota Benefits Eligibility and Enrollment System linked from the Department of Social Services site, or at a local office.</p>` : ''}
<h2>Medicaid: adults covered, pregnancy at the same line</h2>
<p>South Dakota covers adults 19 to 64 under the ACA expansion up to ${adult.effectivePct}% of the poverty guideline. For pregnant women the CMS table shows ${lv.pregnant}%, which becomes the same ${preg.effectivePct}% with the disregard; a pregnant woman counted as two qualifies up to ${usd(preg.monthly ?? 0)} a month. A woman in Rapid City earning ${usd(2300)} alone is at ${Math.round(mom.pctIncome)}% of poverty for a household of two and ${mom.eligible ? 'qualifies' : 'is over the line'}. Children have a higher ceiling: Medicaid to ${lv.child6to18}%, then CHIP-funded coverage up to ${lv.chip}%, ${kid.effectivePct}% with the disregard, or ${usd(kid.monthly ?? 0)} a month for three. Above Medicaid, adults use HealthCare.gov and the ${h.a('aca-subsidy-calculator', 'premium tax credit')}.</p>
${h.mini('fplThreshold', { pct: kid.effectivePct })}
<h2>Fort Pierre outranks Sioux Falls</h2>
<p>HUD lists ${S.hud.rows} South Dakota counties in ${S.hud.areas} areas. The top very low income limit for four, ${usd(stanley.vli)}, is in ${S.hud.vli4MaxName}, across the Missouri River from Pierre, slightly ahead of Minnehaha County (Sioux Falls) at ${usd(minn.vli)}. Hughes County, Pierre itself, sits at ${usd(hughes.vli)} and Pennington County (Rapid City) at ${usd(penn.vli)}. The floor is ${usd(S.hud.vli4Min)}, in ${S.hud.vli4MinName} and several others. ${h.a('state:minnesota', 'Minnesota')} and ${h.a('state:nebraska', 'Nebraska')} border the state to the east and south.</p>`,
  faqs: [
    { q: 'Does South Dakota have an asset limit for SNAP?', a: `Yes. South Dakota does not use broad-based categorical eligibility, so the federal limit applies in fiscal year ${P.snap.fy}: ${usdx(P.snap.assets.general)} in countable resources, or ${usdx(P.snap.assets.elderlyDisabled)} when a member is 60 or older or disabled. Bank accounts and cash count; the home and most retirement savings do not. A household just over the limit is refused even if its income qualifies.` },
    { q: 'What is the income limit for food stamps in South Dakota?', a: `Two tests apply. Gross monthly income must be under 130% of poverty, ${usd(snapGross(1))} for one person, ${usd(snapGross(3))} for three and ${usd(snapGross(4))} for four, and net income after deductions under 100%, ${usd(snapNet(3))} for three. Households with a member 60 or older or disabled only need to pass the net test. These are the fiscal year ${P.snap.fy} federal figures.` },
    { q: 'Did South Dakota expand Medicaid?', a: `Yes. According to the CMS table of state eligibility levels, South Dakota covers adults 19 to 64 under the ACA expansion up to ${adult.effectivePct}% of the poverty guideline with the disregard, about ${usd(adult.monthly ?? 0)} a month for one person in 2026. Children qualify up to ${kid.effectivePct}% and pregnant women up to ${preg.effectivePct}%. The Department of Social Services handles applications.` },
  ],
  related: ['state:north-dakota', 'state:wyoming', 'state:minnesota', 'state:nebraska', 'snap-eligibility', 'medicaid-expansion-states'],
});
