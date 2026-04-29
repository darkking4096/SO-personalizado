import { create } from 'zustand';
import { Shortcut } from '../types/shortcut';
import shortcutSearchService from '../services/shortcutSearchService';

interface ShortcutsStore {
  searchQuery: string;
  selectedCategories: string[];
  searchResults: Shortcut[];
  isSearching: boolean;
  allCategories: string[];
  pinnedShortcuts: Shortcut[];
  pinnedIds: Set<string>;

  setSearchQuery: (query: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  clearSearch: () => void;
  initializeCategories: () => void;
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
  loadPinnedShortcuts: () => void;
}

export const useShortcutsStore = create<ShortcutsStore>((set, get) => ({
  searchQuery: '',
  selectedCategories: [],
  searchResults: [],
  isSearching: false,
  allCategories: [],
  pinnedShortcuts: [],
  pinnedIds: new Set(),

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, isSearching: true });

    const results = shortcutSearchService.search(query, {
      categories: get().selectedCategories.length > 0 ? get().selectedCategories : undefined,
    });

    set({ searchResults: results, isSearching: false });
  },

  setSelectedCategories: (categories: string[]) => {
    set({ selectedCategories: categories });

    const results = shortcutSearchService.search(get().searchQuery, {
      categories: categories.length > 0 ? categories : undefined,
    });

    set({ searchResults: results });
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      selectedCategories: [],
      searchResults: shortcutSearchService.getAllShortcuts(),
      isSearching: false,
    });
  },

  initializeCategories: () => {
    const categories = shortcutSearchService.getCategories();
    set({
      allCategories: categories,
      searchResults: shortcutSearchService.getAllShortcuts(),
    });
    get().loadPinnedShortcuts();
  },

  togglePin: (id: string) => {
    shortcutSearchService.togglePin(id);
    get().loadPinnedShortcuts();
  },

  isPinned: (id: string) => {
    return shortcutSearchService.isPinned(id);
  },

  loadPinnedShortcuts: () => {
    const pinned = shortcutSearchService.getPinnedShortcuts();
    const pinnedIds = new Set(shortcutSearchService.getPinnedIds());
    set({ pinnedShortcuts: pinned, pinnedIds });
  },
}));
