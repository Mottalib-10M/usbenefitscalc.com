/**
 * One page = ONE content file (CONTRIBUTING-PAGES.md):
 *  - a program page or a guide: `src/content/pages/<id>.ts` (PageDef);
 *  - a state page: `src/content/states/<slug>.ts` (StatePageDef). Its official figures come from
 *    src/data/states.json and src/data/hud/<ST>.json and are rendered by the page component, not by the prose.
 * Routes, menus, footer, sitemap, schemas and internal links read these files alone.
 */
import type { Group } from './topics';
import type { Kit } from './kit';

export interface FAQ { q: string; a: string }

/** Writing tools passed to every body: links, formatters, tables, official links, and the data kit. */
export interface Helpers extends Kit {
  /** Internal link by page id ("snap-calculator", "state:texas"…). An unknown id fails the page test. */
  a: (id: string, text: string) => string;
  /** Journal-style table; numbers are formatted, strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to an official source of params-2026.json (key) with optional text. */
  src: (key: string, text?: string) => string;
  /** Link to any official URL. */
  ext: (url: string, text: string) => string;
  /** Ruled box in the press style. */
  box: (title: string, html: string) => string;
  /** Inline mini-simulator: `<!--mini:kind|arg-->` rendered as an island. */
  mini: (kind: string, arg?: unknown) => string;
}

export type ToolKind = 'screener' | 'snap' | 'fpl' | 'medicaid' | 'aca' | 'eitc' | 'wic' | 'section8' | 'ssi';
export interface ToolProps { state?: string; lockState?: boolean; size?: number; income?: number }

export interface PageDef {
  id: string;
  group: Group;
  /** pillar: program page with the full calculator; guide: a question with its mini-simulator; threshold: one % of the poverty guideline. */
  kind: 'pillar' | 'guide' | 'threshold';
  order: number;
  /** URL segment, lowercase and dashes, no year. */
  slug: string;
  nav: string;
  card: string;
  /** 50 to 60 characters, key term first, 2026 included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, 2026 included. */
  description: string;
  h1: string;
  intro: string;
  /** ONE paragraph of 120 words or more, the direct answer with the figures (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  /** Full calculator shown after the answer block (pillars). */
  tool?: ToolKind;
  toolProps?: ToolProps;
  /** Mini-simulator after the answer block (guides, thresholds): `src/lib/minis/<kind>.ts`. */
  mini?: string;
  miniArg?: unknown;
  /** Page id the mini-simulators' button leads to (default: the main calculator of the group). */
  miniHref?: string;
  related: string[];
  /** Keys of params-2026.json > sources. */
  sources: string[];
  extraSources?: Array<{ name: string; url: string }>;
}
export const definePage = (p: PageDef): PageDef => p;

export interface StatePageDef {
  /** = file name = state slug. */
  slug: string;
  /** 50–60 characters, starts with the state name, then the key term, 2026 included. */
  title: string;
  /** 150–160 characters, 2026 included, at least one figure computed from the data. */
  description: string;
  /** One sentence under the H1. */
  intro: string;
  /** ONE paragraph of 120 words or more: the answer for this state, figures computed from the data. */
  resume: string;
  /** Prose written for this state only (HTML). */
  body: (h: Helpers) => string;
  faqs: FAQ[];
  /** Ids of related pages: neighbor states, program pages, guides. */
  related: string[];
}
export const defineStatePage = (s: StatePageDef): StatePageDef => s;
