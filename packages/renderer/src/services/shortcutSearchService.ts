import Fuse from 'fuse.js';
import { Shortcut, ShortcutsDatabase } from '../types/shortcut';
import shortcutsData from '../data/shortcuts.json';

export interface FilterOptions {
  categories?: string[];
}

class ShortcutSearchService {
  private fuse: Fuse<Shortcut>;
  private shortcuts: Shortcut[];

  constructor() {
    this.shortcuts = (shortcutsData as ShortcutsDatabase).shortcuts;
    this.fuse = new Fuse(this.shortcuts, {
      keys: ['function', 'keys', 'description'],
      threshold: 0.3,
      minMatchCharLength: 1,
      includeScore: true,
    });
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
}

export default new ShortcutSearchService();
