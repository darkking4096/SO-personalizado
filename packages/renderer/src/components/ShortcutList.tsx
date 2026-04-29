import React, { useMemo } from 'react';
import { useShortcutsStore } from '../stores/shortcutsStore';
import shortcutSearchService from '../services/shortcutSearchService';

const categoryColors: Record<string, string> = {
  windows: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  alt: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  ctrl: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'ctrl-shift': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  function: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  number: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  misc: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const categoryLabels: Record<string, string> = {
  windows: 'Windows',
  alt: 'Alt',
  ctrl: 'Ctrl',
  'ctrl-shift': 'Ctrl+Shift',
  function: 'Function',
  number: 'Number',
  misc: 'Misc',
};

interface ShortcutListProps {
  searchQuery?: string;
}

export const ShortcutList: React.FC<ShortcutListProps> = ({ searchQuery = '' }) => {
  const { searchResults, togglePin, isPinned } = useShortcutsStore();

  const highlightedResults = useMemo(() => {
    return searchResults.map((shortcut) => ({
      ...shortcut,
      highlightedFunction: shortcutSearchService.highlightMatch(shortcut.function, searchQuery),
      highlightedKeys: shortcutSearchService.highlightMatch(shortcut.keys, searchQuery),
      highlightedDescription: shortcutSearchService.highlightMatch(
        shortcut.description,
        searchQuery
      ),
    }));
  }, [searchResults, searchQuery]);

  if (highlightedResults.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {searchQuery ? "No shortcuts found. Try a different search." : "No shortcuts available."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {highlightedResults.map((shortcut) => (
        <div
          key={shortcut.id}
          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-semibold text-sm text-gray-900 dark:text-white">
                  {shortcut.keys}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${categoryColors[shortcut.category] || categoryColors.misc}`}
                >
                  {categoryLabels[shortcut.category] || shortcut.category}
                </span>
              </div>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                {shortcut.function}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {shortcut.description}
              </p>
              {shortcut.winVersion && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {shortcut.winVersion}
                </p>
              )}
            </div>
            <button
              onClick={() => togglePin(shortcut.id)}
              className={`text-xl hover:scale-110 transition-transform flex-shrink-0 ${
                isPinned(shortcut.id) ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500'
              }`}
              title={isPinned(shortcut.id) ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isPinned(shortcut.id) ? `Remove ${shortcut.function} from favorites` : `Add ${shortcut.function} to favorites`}
            >
              {isPinned(shortcut.id) ? '★' : '☆'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
