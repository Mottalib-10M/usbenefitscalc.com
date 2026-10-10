/** Shape of src/data/states.json (built by scripts/build-data.py). Types only: safe to import anywhere. */
import type { BbceRule } from './engine/snap';
import type { MedicaidLevels } from './engine/medicaid';
import type { Area } from './engine/fpl';
export interface SuaRow { variant: string | null; pending?: boolean; hcsua?: number; lua?: number; electricity?: number; gas?: number; water?: number; sewage?: number; trash?: number; phone?: number; smdOffset?: number; mandatory?: boolean }
export interface Link { name?: string; url?: string }
export interface StateData {
  slug: string; name: string; abbr: string; area: Area;
  snap: { bbce: Array<BbceRule & { assetText: string; program: string }>; sua: SuaRow[]; programName?: string; agency?: string; agencyUrl?: string; applyUrl?: string | null };
  medicaid: MedicaidLevels & { note: string | null; chipNote: string | null; programName?: string; agency?: string; agencyUrl?: string; applyUrl?: string | null; chipName?: string | null };
  marketplace: { type: 'healthcare.gov' | 'state'; name: string; url: string } | null;
  wic: { agency?: string; url?: string } | null;
  notes: string[];
  hud: { rows: number; areas: number; vli4Max: number; vli4MaxName: string; vli4MaxArea: string; vli4Min: number; vli4MinName: string; vli4MinArea: string };
}
