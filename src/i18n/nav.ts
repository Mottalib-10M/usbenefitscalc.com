import { route, ROUTES, type Locale } from './routes';
import { PAGES, pageById, statePageById } from '../lib/pages';
import { GROUPS, stateId } from '../lib/topics';
import { stateRef } from '../data/states';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Benefits calculator', states: 'Benefits by state', method: 'How we calculate', about: 'About', widget: 'Embed a calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const label = (id: string, _lang?: Locale) => {
  if (CORE[id]) return CORE[id];
  const p = pageById(id); if (p) return p.nav;
  const s = statePageById(id); if (s) return `${stateRef(s.slug).name} benefits`;
  return id;
};
const has = (id: string) => ROUTES.some((r) => r.id === id);
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export const TOP = ['california', 'texas', 'florida', 'new-york', 'pennsylvania', 'illinois', 'ohio', 'georgia', 'north-carolina', 'michigan'];
export function navCategories(lang: Locale): NavCategory[] {
  const cats = GROUPS.map((g) => ({ label: g.short, links: PAGES.filter((p) => p.group === g.id && p.kind !== 'threshold').map((p) => link(p.id, lang)) })).filter((c) => c.links.length);
  const states = { label: 'States', links: [link('states', lang), ...TOP.filter((s) => has(stateId(s))).slice(0, 8).map((s) => link(stateId(s), lang))] };
  return [...cats, states];
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: PAGES.filter((p) => p.group === g.id).map((p) => link(p.id, lang)) })).filter((c) => c.links.length),
  { label: 'This site', links: ['home', 'states', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** Every state, in the footer row: each state page is one click from anywhere (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => ROUTES.filter((r) => r.id.startsWith('state:')).map((r) => ({ href: route(r.id, lang), label: stateRef(r.id.slice(6)).name }));
