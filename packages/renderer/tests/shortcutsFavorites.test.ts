import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import shortcutSearchService from '../src/services/shortcutSearchService';

// Mock localStorage
let localStorageMock: Record<string, string> = {};

global.localStorage = {
  getItem: (key: string) => localStorageMock[key] || null,
  setItem: (key: string, value: string) => {
    localStorageMock[key] = value.toString();
  },
  removeItem: (key: string) => {
    delete localStorageMock[key];
  },
  clear: () => {
    localStorageMock = {};
  },
  length: 0,
  key: () => null,
} as Storage;

describe('Story 5.3: Build Favorites/Pinning System', () => {
  beforeEach(() => {
    localStorage.clear();
    shortcutSearchService.clearPinned();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('AC1: Star icon - Click to pin/unpin', () => {
    it('should pin a shortcut by ID', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      const firstShortcut = allShortcuts[0];

      shortcutSearchService.pinShortcut(firstShortcut.id);

      expect(shortcutSearchService.isPinned(firstShortcut.id)).toBe(true);
    });

    it('should unpin a shortcut by ID', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      const firstShortcut = allShortcuts[0];

      shortcutSearchService.pinShortcut(firstShortcut.id);
      expect(shortcutSearchService.isPinned(firstShortcut.id)).toBe(true);

      shortcutSearchService.unpinShortcut(firstShortcut.id);
      expect(shortcutSearchService.isPinned(firstShortcut.id)).toBe(false);
    });

    it('should toggle pin status', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      const firstShortcut = allShortcuts[0];

      expect(shortcutSearchService.isPinned(firstShortcut.id)).toBe(false);

      shortcutSearchService.togglePin(firstShortcut.id);
      expect(shortcutSearchService.isPinned(firstShortcut.id)).toBe(true);

      shortcutSearchService.togglePin(firstShortcut.id);
      expect(shortcutSearchService.isPinned(firstShortcut.id)).toBe(false);
    });
  });

  describe('AC2: Pinned section - Appear at top', () => {
    it('should return pinned shortcuts in a separate list', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      shortcutSearchService.pinShortcut(allShortcuts[0].id);
      shortcutSearchService.pinShortcut(allShortcuts[1].id);

      const pinned = shortcutSearchService.getPinnedShortcuts();

      expect(pinned.length).toBe(2);
      expect(pinned[0].id).toBe(allShortcuts[0].id);
      expect(pinned[1].id).toBe(allShortcuts[1].id);
    });

    it('should return empty array when no shortcuts are pinned', () => {
      const pinned = shortcutSearchService.getPinnedShortcuts();
      expect(pinned.length).toBe(0);
    });
  });

  describe('AC3: Visual distinction - Pinned highlighted', () => {
    it('should identify pinned shortcuts', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      const firstShortcut = allShortcuts[0];

      shortcutSearchService.pinShortcut(firstShortcut.id);

      expect(shortcutSearchService.isPinned(firstShortcut.id)).toBe(true);
    });
  });

  describe('AC4: Persistence - Save to profile', () => {
    it('should persist pinned shortcuts to localStorage', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      shortcutSearchService.pinShortcut(allShortcuts[0].id);
      shortcutSearchService.pinShortcut(allShortcuts[1].id);

      const stored = localStorage.getItem('shortcuts_pinned');
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored || '[]');
      expect(parsed).toContain(allShortcuts[0].id);
      expect(parsed).toContain(allShortcuts[1].id);
    });


    it('should update localStorage when pinning/unpinning', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();

      shortcutSearchService.pinShortcut(allShortcuts[0].id);
      let stored = localStorage.getItem('shortcuts_pinned');
      let parsed = JSON.parse(stored || '[]');
      expect(parsed.length).toBe(1);

      shortcutSearchService.unpinShortcut(allShortcuts[0].id);
      stored = localStorage.getItem('shortcuts_pinned');
      parsed = JSON.parse(stored || '[]');
      expect(parsed.length).toBe(0);
    });
  });

  describe('AC5: Unlimited favorites', () => {
    it('should allow pinning many shortcuts', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      const toPin = Math.min(50, allShortcuts.length);

      for (let i = 0; i < toPin; i++) {
        shortcutSearchService.pinShortcut(allShortcuts[i].id);
      }

      const pinned = shortcutSearchService.getPinnedShortcuts();
      expect(pinned.length).toBe(toPin);
    });

    it('should handle pinning all shortcuts', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();

      allShortcuts.forEach((shortcut) => {
        shortcutSearchService.pinShortcut(shortcut.id);
      });

      const pinned = shortcutSearchService.getPinnedShortcuts();
      expect(pinned.length).toBe(allShortcuts.length);
    });
  });

  describe('AC6: Remove favorite - Click star again', () => {
    it('should unpin by clicking again', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      const firstShortcut = allShortcuts[0];

      shortcutSearchService.pinShortcut(firstShortcut.id);
      expect(shortcutSearchService.isPinned(firstShortcut.id)).toBe(true);

      shortcutSearchService.pinShortcut(firstShortcut.id);
      shortcutSearchService.unpinShortcut(firstShortcut.id);
      expect(shortcutSearchService.isPinned(firstShortcut.id)).toBe(false);
    });
  });

  describe('AC7: Persist across restarts', () => {
    it('should maintain pinned status across service reinitialization', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      const shortcutsToPin = allShortcuts.slice(0, 3);

      // Pin shortcuts
      shortcutsToPin.forEach((s) => {
        shortcutSearchService.pinShortcut(s.id);
      });

      // Simulate restart by checking localStorage
      const stored = localStorage.getItem('shortcuts_pinned');
      const restored = JSON.parse(stored || '[]');

      expect(restored.length).toBe(3);
      shortcutsToPin.forEach((s) => {
        expect(restored).toContain(s.id);
      });
    });
  });

  describe('AC8: TypeScript strict compliance', () => {
    it('should have properly typed pinning methods', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      const id: string = allShortcuts[0].id;

      // These should all type-check
      shortcutSearchService.pinShortcut(id);
      shortcutSearchService.unpinShortcut(id);
      shortcutSearchService.togglePin(id);
      const isPinned: boolean = shortcutSearchService.isPinned(id);
      const pinned = shortcutSearchService.getPinnedShortcuts();
      const ids: string[] = shortcutSearchService.getPinnedIds();

      expect(typeof isPinned).toBe('boolean');
      expect(Array.isArray(pinned)).toBe(true);
      expect(Array.isArray(ids)).toBe(true);
    });
  });

  describe('Favorites integration', () => {
    it('should get pinned IDs as array', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      shortcutSearchService.pinShortcut(allShortcuts[0].id);
      shortcutSearchService.pinShortcut(allShortcuts[1].id);

      const ids = shortcutSearchService.getPinnedIds();

      expect(Array.isArray(ids)).toBe(true);
      expect(ids).toContain(allShortcuts[0].id);
      expect(ids).toContain(allShortcuts[1].id);
    });

    it('should set pinned IDs from array', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      const idsToPin = [allShortcuts[0].id, allShortcuts[1].id];

      shortcutSearchService.setPinnedIds(idsToPin);

      const pinned = shortcutSearchService.getPinnedShortcuts();
      expect(pinned.length).toBe(2);
    });

    it('should clear all pinned shortcuts', () => {
      const allShortcuts = shortcutSearchService.getAllShortcuts();
      shortcutSearchService.pinShortcut(allShortcuts[0].id);
      shortcutSearchService.pinShortcut(allShortcuts[1].id);

      expect(shortcutSearchService.getPinnedShortcuts().length).toBe(2);

      shortcutSearchService.clearPinned();

      expect(shortcutSearchService.getPinnedShortcuts().length).toBe(0);
    });
  });
});
