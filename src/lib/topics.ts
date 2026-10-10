/**
 * Menu groups of the site. Every page file names its group; menus, footer and breadcrumbs read them.
 * State pages live apart, at /en/states/<state>/ (id "state:<slug>").
 */
export type Group = 'poverty' | 'food' | 'health' | 'cash' | 'housing';
export interface GroupInfo { id: Group; label: string; short: string }
export const GROUPS: GroupInfo[] = [
  { id: 'food', label: 'Food: SNAP and WIC', short: 'Food' },
  { id: 'health', label: 'Health: Medicaid and ACA', short: 'Health' },
  { id: 'cash', label: 'Tax credits and cash', short: 'Cash' },
  { id: 'housing', label: 'Housing', short: 'Housing' },
  { id: 'poverty', label: 'Poverty level', short: 'Poverty level' },
];
export const groupInfo = (id: Group): GroupInfo => GROUPS.find((g) => g.id === id)!;
export const stateId = (slug: string) => `state:${slug}`;
