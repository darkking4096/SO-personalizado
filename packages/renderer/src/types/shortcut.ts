export type ShortcutCategory = 'windows' | 'alt' | 'ctrl' | 'ctrl-shift' | 'function' | 'number' | 'misc';

export interface Shortcut {
  id: string;
  keys: string;
  function: string;
  category: ShortcutCategory;
  description: string;
  winVersion?: string;
}

export interface ShortcutsDatabase {
  version: string;
  lastUpdated: string;
  totalShortcuts: number;
  shortcuts: Shortcut[];
}
