import React from 'react';
import { useShortcutsStore } from '../stores/shortcutsStore';

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

export const PinnedSection: React.FC = () => {
  const { pinnedShortcuts, togglePin } = useShortcutsStore();

  if (pinnedShortcuts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 rounded-lg border border-yellow-200 dark:border-yellow-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-xl">⭐</span>
          Pinned Shortcuts ({pinnedShortcuts.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {pinnedShortcuts.map((shortcut) => (
            <div
              key={shortcut.id}
              className="bg-white dark:bg-gray-800 p-3 rounded border border-yellow-200 dark:border-yellow-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-semibold text-sm text-gray-900 dark:text-white">
                      {shortcut.keys}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${categoryColors[shortcut.category] || categoryColors.misc}`}
                    >
                      {categoryLabels[shortcut.category] || shortcut.category}
                    </span>
                  </div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {shortcut.function}
                  </p>
                </div>
                <button
                  onClick={() => togglePin(shortcut.id)}
                  className="text-xl hover:scale-110 transition-transform flex-shrink-0 text-yellow-500"
                  title="Unpin shortcut"
                  aria-label={`Unpin ${shortcut.function}`}
                >
                  ★
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
