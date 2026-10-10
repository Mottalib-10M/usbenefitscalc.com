import { defineStatePage } from '../../lib/page-types';
import { P, sd, snapCalc, snapGross, snapNet, medLimit, medCheck, sua, hudOf, usd, usdx, day } from '../../lib/kit';

const S = sd('missouri');
const adult = medLimit('missouri', 'adult', 1);
const kid = medLimit('missouri', 'child6to18', 3);
const preg = medLimit('missouri', 'pregnant', 2);
const pregMed = (S.medicaid.pregnant ?? 0) + P.medicaid.disregardPct;
// A single warehouse worker in Springfield (Greene County): $1,400 of wages, $750 rent, heat in her name, $2,800 saved.
const ex = snapCalc('missouri', { size: 1, earned: 1400, housing: 750, assets: 2800 });
const exMore = snapCalc('missouri', { size: 1, earned: 1400, housing: 750, assets: 3200 });
const mh = medCheck('missouri', 'adult', 1, 1400);
const boone = hudOf('missouri', 'Boone County', 4);
const stl = hudOf('missouri', 'St. Louis city', 4);
const jack = hudOf('missouri', 'Jackson County', 4);
const greene = hudOf('missouri', 'Greene County', 4);
const cole = hudOf('missouri', 'Cole County', 4);
const W = P.medicaid.workRequirement;

export default defineStatePage({
  slug: 'missouri',
  title: 'Missouri Food Stamps and MO HealthNet 2026: Savings Count',
  description: `Missouri 2026: SNAP uses federal tests (${usd(snapGross(1))} gross for one) and a ${usdx(P.snap.assets.general)} asset limit, yet MO HealthNet covers adults to ${usd(adult.monthly ?? 0)} a month and kids to ${kid.effectivePct}%.`,
  intro: 'Missouri pairs one of the strictest SNAP setups in the country with an expanded Medicaid program, so the same household can pass one test and fail the other.',
  resume: `Missouri is one of the few states that expanded Medicaid but kept the federal SNAP tests without broad-based categorical eligibility. For food assistance, a single adult must have gross income under ${usd(snapGross(1))} a month, net income under ${usd(snapNet(1))} and countable savings under ${usdx(P.snap.assets.general)} in fiscal year ${P.snap.fy}. A warehouse worker in Springfield earning ${usd(1400)} with ${usd(750)} rent would receive about ${usd(ex.benefit)} a month with ${usd(2800)} in the bank, using the Missouri heating allowance of ${usdx(sua('missouri', 1) ?? 0)}; with ${usd(3200)} saved she would ${exMore.eligible ? `get ${usd(exMore.benefit)}` : 'get nothing'}. MO HealthNet, the state's Medicaid, has no savings test for her group and covers adults 19 to 64 up to ${usd(adult.monthly ?? 0)} a month, so she ${mh.eligible ? 'qualifies' : 'does not qualify'} either way. Children are covered up to ${kid.effectivePct}% of poverty and pregnant women up to ${preg.effectivePct}%.`,
  body: (h) => `<h2>A strict SNAP and a broad Medicaid</h2>
<p>The USDA chart of broad-based categorical eligibility does not list Missouri, which means the Family Support Division applies the ${h.src('cfr2739', 'federal SNAP tests')} as written: gross income at 130% of poverty, net income at 100%, and a resource limit of ${usdx(P.snap.assets.general)}, or ${usdx(P.snap.assets.elderlyDisabled)} with a member 60 or older or disabled. Medicaid works the other way. The CMS table shows Missouri with the expansion group at ${S.medicaid.adultPct}% of poverty, ${adult.effectivePct}% with the disregard, and MAGI coverage has no asset test. A Missourian who saves a few thousand dollars can therefore lose food assistance while keeping MO HealthNet.</p>
<h2>The Springfield worker, line by line</h2>
<p>Her ${usd(1400)} passes the gross test of ${usd(snapGross(1))}. After the earned income deduction of ${usd(ex.deductions.earned)} and the standard deduction of ${usd(ex.deductions.standard)}, rent and the heating allowance (${usd(ex.shelterCosts)} together) exceed half of what remains by more than the cap, so the shelter deduction is the maximum ${usd(ex.deductions.shelter)}. Net income is ${usd(ex.net)}, far under the net limit, and the benefit ${usd(ex.benefit)}. Everything then hinges on the bank balance: ${usd(2800)} passes, ${usd(3200)} ${exMore.eligible ? 'also passes' : 'fails, and the case is denied for resources'}. Federal rules leave out the home and most retirement accounts, so the test reaches cash and bank balances above all.</p>
<h2>MO HealthNet for adults, pregnant women and children</h2>
<p>At ${usd(1400)} a month the same worker is at ${Math.round(mh.pctIncome)}% of the 2026 poverty guideline, below the expansion line, and qualifies through the adult group. Parents use the same line, since Missouri's own parent standard in the CMS table, ${S.medicaid.parent}% as a dollar standard, is far lower. Pregnant women are on Medicaid up to ${pregMed}% and, through a CHIP level listed by CMS, up to ${preg.effectivePct}%: ${usd(preg.monthly ?? 0)} a month for two. Children are on Medicaid or CHIP up to ${kid.effectivePct}%, ${usd(kid.monthly ?? 0)} a month for three. From ${h.day(W.start)}, federal law requires most expansion adults aged ${W.ageMin} to ${W.ageMax} to show ${W.hoursPerMonth} hours a month of work or activity; see ${h.a('medicaid-work-requirements', 'Medicaid work requirements')}.</p>
${h.mini('fplThreshold', { pct: preg.effectivePct })}
<h2>Columbia leads the HUD table</h2>
<p>Boone County, the Columbia area, has Missouri's highest very low income limit for four, ${usd(boone.vli)}, a little above St. Louis city and county at ${usd(stl.vli)} and Jackson County, Kansas City's side of the line, at ${usd(jack.vli)}. Cole County around Jefferson City stands at ${usd(cole.vli)}, Greene County at ${usd(greene.vli)}. Compare with ${h.a('state:kansas', 'Kansas')}, which also skips categorical eligibility, ${h.a('state:illinois', 'Illinois')} and ${h.a('state:arkansas', 'Arkansas')}.</p>`,
  faqs: [
    { q: 'What is the asset limit for food stamps in Missouri?', a: `${usdx(P.snap.assets.general)} for most households and ${usdx(P.snap.assets.elderlyDisabled)} when a member is 60 or older or disabled, in fiscal year ${P.snap.fy}. Missouri does not use broad-based categorical eligibility, so these federal limits apply to every case. Checking and savings accounts and cash count. The home you live in and most retirement accounts are excluded under federal rules.` },
    { q: 'Did Missouri expand Medicaid?', a: `Yes. The CMS table lists Missouri with the ACA expansion group at ${S.medicaid.adultPct}% of poverty, so MO HealthNet covers adults 19 to 64 with income up to about ${usd(adult.monthly ?? 0)} a month for one person in 2026, ${adult.effectivePct}% with the disregard. There is no asset test for this group. Federal work requirements for expansion adults are scheduled from ${day(W.start)}.` },
    { q: 'How much can a single person make for food stamps in Missouri?', a: `Gross income must stay under ${usd(snapGross(1))} a month and net income under ${usd(snapNet(1))} in fiscal year ${P.snap.fy}, the federal 130% and 100% tests, since Missouri has no broad-based categorical eligibility. Savings must be under ${usdx(P.snap.assets.general)}. A Springfield worker earning ${usd(1400)} with ${usd(750)} rent would get about ${usd(ex.benefit)} a month.` },
    { q: 'What is the Section 8 income limit in Kansas City, Missouri?', a: `Jackson County, which holds most of Kansas City, Missouri, has a fiscal year 2026 very low income limit of ${usd(jack.vli)} for a family of four and ${usd(hudOf('missouri', 'Jackson County', 1).vli)} for one person. The extremely low limit for four is ${usd(jack.eli)}. St. Louis is slightly higher at ${usd(stl.vli)}, and Boone County tops the state at ${usd(boone.vli)}.` },
  ],
  related: ['state:kansas', 'state:illinois', 'state:arkansas', 'state:iowa', 'snap-eligibility', 'medicaid-work-requirements'],
});
