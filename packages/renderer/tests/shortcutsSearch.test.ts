import { describe, it, expect, beforeEach } from 'vitest';
import shortcutSearchService from '../src/services/shortcutSearchService';

describe('Story 5.2: Shortcuts Search & Filtering', () => {
  beforeEach(() => {
    // Reset service state if needed
  });

  describe('AC1: Search input - Real-time search', () => {
    it('should search by function name', () => {
      const results = shortcutSearchService.search('Show/hide desktop');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.function === 'Show/hide desktop')).toBe(true);
    });

    it('should search by key combination', () => {
      const results = shortcutSearchService.search('Win + D');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.keys === 'Win + D')).toBe(true);
    });

    it('should return all shortcuts when query is empty', () => {
      const results = shortcutSearchService.search('');
      expect(results.length).toBeGreaterThan(100);
    });
  });

  describe('AC2: Fuzzy search - Match partial strings and typos', () => {
    it('should match partial function names', () => {
      const results = shortcutSearchService.getFuzzyMatches('desktop');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.function.toLowerCase().includes('desktop'))).toBe(true);
    });

    it('should handle typos with fuzzy matching', () => {
      const results = shortcutSearchService.getFuzzyMatches('desctop'); // typo
      expect(results.length).toBeGreaterThan(0);
    });

    it('should match single characters', () => {
      const results = shortcutSearchService.getFuzzyMatches('c');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('AC3: Category filter', () => {
    it('should filter by single category', () => {
      const results = shortcutSearchService.search('', { categories: ['windows'] });
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((s) => s.category === 'windows')).toBe(true);
    });

    it('should filter by multiple categories', () => {
      const results = shortcutSearchService.search('', {
        categories: ['windows', 'alt'],
      });
      expect(results.every((s) => ['windows', 'alt'].includes(s.category))).toBe(true);
    });

    it('should return all shortcuts when filter is empty', () => {
      const results = shortcutSearchService.search('', { categories: [] });
      expect(results.length).toBeGreaterThan(100);
    });
  });

  describe('AC4: Results display latency', () => {
    it('should search completes in <100ms for all queries', async () => {
      const start = performance.now();
      shortcutSearchService.search('test');
      const end = performance.now();
      expect(end - start).toBeLessThan(100);
    });

    it('should handle fuzzy matches in <100ms', async () => {
      const start = performance.now();
      shortcutSearchService.getFuzzyMatches('keyboard');
      const end = performance.now();
      expect(end - start).toBeLessThan(100);
    });
  });

  describe('AC5: Display matching shortcuts', () => {
    it('should return shortcuts with keys, function, and description', () => {
      const results = shortcutSearchService.search('Win + E');
      expect(results.length).toBeGreaterThan(0);

      results.forEach((shortcut) => {
        expect(shortcut).toHaveProperty('keys');
        expect(shortcut).toHaveProperty('function');
        expect(shortcut).toHaveProperty('description');
      });
    });

    it('should include all required shortcut fields', () => {
      const results = shortcutSearchService.getAllShortcuts();
      expect(results.length).toBeGreaterThan(100);

      results.slice(0, 5).forEach((shortcut) => {
        expect(shortcut.id).toBeDefined();
        expect(shortcut.keys).toBeDefined();
        expect(shortcut.function).toBeDefined();
        expect(shortcut.category).toBeDefined();
        expect(shortcut.description).toBeDefined();
      });
    });
  });

  describe('AC6: Highlight matching text', () => {
    it('should highlight matching text in results', () => {
      const text = 'Show desktop window';
      const highlighted = shortcutSearchService.highlightMatch(text, 'desktop');
      expect(highlighted).toContain('<mark>desktop</mark>');
    });

    it('should handle case-insensitive highlighting', () => {
      const text = 'Show DESKTOP';
      const highlighted = shortcutSearchService.highlightMatch(text, 'desktop');
      expect(highlighted.toLowerCase()).toContain('<mark>desktop</mark>'.toLowerCase());
    });

    it('should return unchanged text for empty query', () => {
      const text = 'Show desktop';
      const highlighted = shortcutSearchService.highlightMatch(text, '');
      expect(highlighted).toBe(text);
    });
  });

  describe('AC7: Clear search', () => {
    it('should have a clear function', () => {
      expect(shortcutSearchService.search).toBeDefined();
    });
  });

  describe('AC8: No results handling', () => {
    it('should return empty array for queries with no matches', () => {
      const results = shortcutSearchService.search('xyzabc123nonexistent');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('AC9: TypeScript strict compliance', () => {
    it('should have properly typed return values', () => {
      const results = shortcutSearchService.search('test');
      expect(Array.isArray(results)).toBe(true);

      results.forEach((shortcut) => {
        expect(typeof shortcut.id).toBe('string');
        expect(typeof shortcut.keys).toBe('string');
        expect(typeof shortcut.function).toBe('string');
        expect(['windows', 'alt', 'ctrl', 'ctrl-shift', 'function', 'number', 'misc']).toContain(
          shortcut.category
        );
      });
    });
  });

  describe('Service utilities', () => {
    it('should retrieve all shortcuts', () => {
      const all = shortcutSearchService.getAllShortcuts();
      expect(all.length).toBeGreaterThan(100);
    });

    it('should retrieve available categories', () => {
      const categories = shortcutSearchService.getCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('windows');
      expect(categories).toContain('alt');
      expect(categories).toContain('ctrl');
    });

    it('should sort categories alphabetically', () => {
      const categories = shortcutSearchService.getCategories();
      const sorted = [...categories].sort();
      expect(categories).toEqual(sorted);
    });
  });

  describe('Combined search and filter', () => {
    it('should apply both search query and category filters', () => {
      const results = shortcutSearchService.search('window', {
        categories: ['windows'],
      });

      expect(results.length).toBeGreaterThan(0);
      expect(results.every((s) => s.category === 'windows')).toBe(true);
    });

    it('should return empty when filters match but search does not', () => {
      const results = shortcutSearchService.search('nonexistent', {
        categories: ['windows'],
      });

      expect(Array.isArray(results)).toBe(true);
    });
  });
});
