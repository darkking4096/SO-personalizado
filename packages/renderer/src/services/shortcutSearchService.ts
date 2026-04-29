import Fuse from 'fuse.js';
import { Shortcut, ShortcutsDatabase } from '../types/shortcut';
import shortcutsData from '../data/shortcuts.json';

export interface FilterOptions {
  categories?: string[];
}

class ShortcutSearchService {
  private fuse: Fuse<Shortcut>;
  private shortcuts: Shortcut[];
  private pinnedIds: Set<string> = new Set();

  constructor() {
    this.shortcuts = (shortcutsData as ShortcutsDatabase).shortcuts;
    this.fuse = new Fuse(this.shortcuts, {
      keys: ['function', 'keys', 'description'],
      threshold: 0.3,
      minMatchCharLength: 1,
      includeScore: true,
    });
    this.loadPinnedFromStorage();
  }

  search(query: string, filters?: FilterOptions): Shortcut[] {
    let results: Shortcut[];

    if (!query.trim()) {
      results = this.shortcuts;
    } else {
      results = this.fuse.search(query).map((result) => result.item);
    }

    // Apply category filters
    if (filters?.categories && filters.categories.length > 0) {
      results = results.filter((shortcut) =>
        filters.categories!.includes(shortcut.category)
      );
    }

    return results;
  }

  getFuzzyMatches(query: string): Shortcut[] {
    if (!query.trim()) {
      return this.shortcuts;
    }
    return this.fuse.search(query).map((result) => result.item);
  }

  getAllShortcuts(): Shortcut[] {
    return this.shortcuts;
  }

  getCategories(): string[] {
    const categories = new Set(this.shortcuts.map((s) => s.category));
    return Array.from(categories).sort();
  }

  highlightMatch(text: string, query: string): string {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Pinning functions
  pinShortcut(id: string): void {
    this.pinnedIds.add(id);
    this.savePinnedToStorage();
  }

  unpinShortcut(id: string): void {
    this.pinnedIds.delete(id);
    this.savePinnedToStorage();
  }

  togglePin(id: string): void {
    if (this.isPinned(id)) {
      this.unpinShortcut(id);
    } else {
      this.pinShortcut(id);
    }
  }

  isPinned(id: string): boolean {
    return this.pinnedIds.has(id);
  }

  getPinnedShortcuts(): Shortcut[] {
    return this.shortcuts.filter((s) => this.pinnedIds.has(s.id));
  }

  getPinnedIds(): string[] {
    return Array.from(this.pinnedIds);
  }

  setPinnedIds(ids: string[]): void {
    this.pinnedIds = new Set(ids);
    this.savePinnedToStorage();
  }

  clearPinned(): void {
    this.pinnedIds.clear();
    this.savePinnedToStorage();
  }

  private savePinnedToStorage(): void {
    try {
      const pinnedArray = Array.from(this.pinnedIds);
      localStorage.setItem('shortcuts_pinned', JSON.stringify(pinnedArray));
    } catch (error) {
      console.error('Failed to save pinned shortcuts:', error);
    }
  }

  private loadPinnedFromStorage(): void {
    try {
      const stored = localStorage.getItem('shortcuts_pinned');
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        this.pinnedIds = new Set(ids);
      }
    } catch (error) {
      console.error('Failed to load pinned shortcuts:', error);
      this.pinnedIds = new Set();
    }
  }
}

export default new ShortcutSearchService();
