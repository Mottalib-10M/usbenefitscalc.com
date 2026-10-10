/**
 * Every page id of the plan (CONTRIBUTING-PAGES.md). Used only by the page test when ALLOW_PLANNED=1,
 * so that a page can link to a page another writer is still preparing. The final run is made without it.
 */
import { STATE_LIST } from '../data/states';
export const PLANNED_PAGES: Array<{ id: string; group: string; kind: 'pillar' | 'guide' | 'threshold'; slug: string; query: string }> = [
  { id: 'federal-poverty-level', group: 'poverty', kind: 'pillar', slug: 'federal-poverty-level', query: 'federal poverty level 2026' },
  { id: 'snap-calculator', group: 'food', kind: 'pillar', slug: 'snap-calculator', query: 'snap calculator, food stamp calculator, how much food stamps will i get' },
  { id: 'snap-income-limits', group: 'food', kind: 'pillar', slug: 'snap-income-limits', query: 'snap income limits, food stamps income limits' },
  { id: 'snap-eligibility', group: 'food', kind: 'guide', slug: 'snap-eligibility', query: 'snap eligibility' },
  { id: 'snap-benefit-amounts', group: 'food', kind: 'guide', slug: 'snap-benefit-amounts', query: 'snap maximum benefit 2027, food stamps amount chart' },
  { id: 'snap-work-requirements', group: 'food', kind: 'guide', slug: 'snap-work-requirements', query: 'snap work requirements 2026' },
  { id: 'snap-deductions', group: 'food', kind: 'guide', slug: 'snap-deductions', query: 'snap deductions, shelter deduction, standard deduction' },
  { id: 'snap-for-seniors', group: 'food', kind: 'guide', slug: 'snap-for-seniors', query: 'snap for seniors, food stamps for elderly' },
  { id: 'snap-college-students', group: 'food', kind: 'guide', slug: 'snap-college-students', query: 'snap for college students' },
  { id: 'wic-income-guidelines', group: 'food', kind: 'pillar', slug: 'wic-income-guidelines', query: 'wic income guidelines' },
  { id: 'medicaid-income-limits', group: 'health', kind: 'pillar', slug: 'medicaid-income-limits', query: 'medicaid income limits' },
  { id: 'medicaid-eligibility', group: 'health', kind: 'guide', slug: 'medicaid-eligibility', query: 'medicaid eligibility' },
  { id: 'medicaid-expansion-states', group: 'health', kind: 'guide', slug: 'medicaid-expansion-states', query: 'medicaid expansion states' },
  { id: 'medicaid-work-requirements', group: 'health', kind: 'guide', slug: 'medicaid-work-requirements', query: 'medicaid work requirements 2027' },
  { id: 'aca-subsidy-calculator', group: 'health', kind: 'pillar', slug: 'aca-subsidy-calculator', query: 'aca subsidy calculator, obamacare subsidy calculator, health insurance subsidy calculator' },
  { id: 'aca-subsidy-cliff', group: 'health', kind: 'guide', slug: 'aca-subsidy-cliff', query: 'aca subsidy cliff 2026, 400 fpl' },
  { id: 'benefits-for-immigrants', group: 'health', kind: 'guide', slug: 'benefits-for-immigrants', query: 'snap medicaid immigrants 2026' },
  { id: 'eitc-calculator', group: 'cash', kind: 'pillar', slug: 'eitc-calculator', query: 'eitc calculator, earned income credit calculator' },
  { id: 'ssi-payment-amount', group: 'cash', kind: 'pillar', slug: 'ssi-payment-amount', query: 'ssi payment amount 2026' },
  { id: 'section-8-income-limits', group: 'housing', kind: 'pillar', slug: 'section-8-income-limits', query: 'section 8 income limits' },
  { id: 'section-8-rent', group: 'housing', kind: 'guide', slug: 'section-8-rent', query: 'section 8 rent calculator, how much rent section 8' },
  { id: 'fpl-130-percent', group: 'poverty', kind: 'threshold', slug: '130-percent-federal-poverty-level', query: '130 percent of poverty level' },
  { id: 'fpl-138-percent', group: 'poverty', kind: 'threshold', slug: '138-percent-federal-poverty-level', query: '138 percent of federal poverty level' },
  { id: 'fpl-185-percent', group: 'poverty', kind: 'threshold', slug: '185-percent-federal-poverty-level', query: '185 percent of poverty level' },
  { id: 'fpl-200-percent', group: 'poverty', kind: 'threshold', slug: '200-percent-federal-poverty-level', query: '200 percent of federal poverty level' },
  { id: 'fpl-250-percent', group: 'poverty', kind: 'threshold', slug: '250-percent-federal-poverty-level', query: '250 percent of poverty level' },
  { id: 'fpl-400-percent', group: 'poverty', kind: 'threshold', slug: '400-percent-federal-poverty-level', query: '400 percent of federal poverty level' },
];
export const PLANNED_IDS = [...PLANNED_PAGES.map((p) => p.id), ...STATE_LIST.map((s) => `state:${s.slug}`), 'home', 'states', 'method', 'about'];
