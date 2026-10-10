/** What a calculator receives about each state (built server side in Tool.astro from src/data/states.json). */
import type { BbceRule } from '../../lib/engine/snap';
import type { MedicaidLevels } from '../../lib/engine/medicaid';
import type { Area } from '../../lib/engine/fpl';
import type { SuaRow } from '../../lib/state-types';
export interface ClientState {
  slug: string; name: string; abbr: string; area: Area;
  bbce: BbceRule[]; sua: SuaRow[]; snapName?: string;
  medicaid: MedicaidLevels; medicaidName?: string; chipName?: string | null;
  marketplace?: { type: string; name: string; url: string } | null;
}
