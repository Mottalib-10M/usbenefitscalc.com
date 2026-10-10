/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES, STATE_PAGES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS, stateId } from '../lib/topics';
import { stateRef } from '../data/states';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Benefits calculators for every US state: SNAP (fiscal year 2027 amounts and each state's broad-based eligibility and utility allowances), Medicaid and CHIP income limits by group, the 2026 ACA premium tax credit with the 400% ceiling, the EITC for tax years 2025 and 2026, WIC 2026/2027 income guidelines, HUD FY 2026 Section 8 income limits for every county, SSI 2026 and the HHS 2026 poverty guidelines. Figures come from USDA, HHS, CMS, IRS, HUD and SSA documents, cited and dated on each page. Calculations run in the browser. Estimates; the agency decides. Published by Radif Partners. Last updated ${LAST_UPDATED}.`,
    '',
    `- [Home: benefits screener](${SITE_URL}${route('home', 'en')})`,
    ...GROUPS.flatMap((g) => { const xs = PAGES.filter((p) => p.group === g.id); return xs.length ? ['', `## ${g.label}`, ...xs.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`)] : []; }),
    '',
    '## Benefits by state',
    `- [All states](${SITE_URL}${route('states', 'en')})`,
    ...STATE_PAGES.map((s) => `- [${stateRef(s.slug).name}](${SITE_URL}${route(stateId(s.slug), 'en')}): ${s.intro}`),
    '',
    '## About',
    `- [How we calculate](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
