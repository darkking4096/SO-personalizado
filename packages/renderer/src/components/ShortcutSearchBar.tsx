import React, { useCallback } from 'react';
import { useShortcutsStore } from '../stores/shortcutsStore';

export const ShortcutSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, clearSearch } = useShortcutsStore();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery]
  );

  const handleClear = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search shortcuts by function or keys..."
        value={searchQuery}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        aria-label="Search shortcuts"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};
