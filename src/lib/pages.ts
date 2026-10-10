/** Registry: every file of `src/content/pages/` and `src/content/states/` is loaded here. */
import type { PageDef, StatePageDef } from './page-types';
import { GROUPS } from './topics';
import { STATE_LIST } from '../data/states';

const mods = import.meta.glob<{ default: PageDef }>(['../content/pages/*.ts', '!../content/pages/_*.ts'], { eager: true });
export const PAGES: PageDef[] = Object.entries(mods)
  .map(([file, m]) => {
    const g = m.default;
    const base = file.split('/').pop()!.replace(/\.ts$/, '');
    if (g.id !== base) throw new Error(`${file}: id "${g.id}" differs from the file name`);
    if (!GROUPS.some((x) => x.id === g.group)) throw new Error(`${file}: unknown group ${g.group}`);
    return g;
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
export const pageById = (id: string) => PAGES.find((p) => p.id === id);

const smods = import.meta.glob<{ default: StatePageDef }>(['../content/states/*.ts', '!../content/states/_*.ts'], { eager: true });
export const STATE_PAGES: StatePageDef[] = Object.entries(smods)
  .map(([file, m]) => {
    const g = m.default;
    const base = file.split('/').pop()!.replace(/\.ts$/, '');
    if (g.slug !== base) throw new Error(`${file}: slug "${g.slug}" differs from the file name`);
    if (!STATE_LIST.some((s) => s.slug === g.slug)) throw new Error(`${file}: unknown state`);
    return g;
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));
export const statePage = (slug: string) => STATE_PAGES.find((p) => p.slug === slug);
export const statePageById = (id: string) => (id.startsWith('state:') ? statePage(id.slice(6)) : undefined);
