import React, { useEffect } from 'react';
import { ShortcutSearchBar } from './ShortcutSearchBar';
import { ShortcutFilters } from './ShortcutFilters';
import { ShortcutList } from './ShortcutList';
import { useShortcutsStore } from '../stores/shortcutsStore';

export const ShortcutsPanel: React.FC = () => {
  const { searchQuery, initializeCategories } = useShortcutsStore();

  useEffect(() => {
    initializeCategories();
  }, [initializeCategories]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Keyboard Shortcuts
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Search and explore Windows 11 keyboard shortcuts to boost your productivity.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <ShortcutSearchBar />
        <ShortcutFilters />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <ShortcutList searchQuery={searchQuery} />
      </div>
    </div>
  );
};
