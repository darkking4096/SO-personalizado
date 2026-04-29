import React, { useEffect } from 'react';
import { useShortcutsStore } from '../stores/shortcutsStore';

const categoryLabels: Record<string, string> = {
  windows: 'Windows Key',
  alt: 'Alt+Key',
  ctrl: 'Ctrl+Key',
  'ctrl-shift': 'Ctrl+Shift+Key',
  function: 'Function Keys',
  number: 'Win+Number',
  misc: 'Miscellaneous',
};

export const ShortcutFilters: React.FC = () => {
  const { allCategories, selectedCategories, setSelectedCategories, initializeCategories } =
    useShortcutsStore();

  useEffect(() => {
    initializeCategories();
  }, [initializeCategories]);

  const handleCategoryChange = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updated);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Filter by Category
      </label>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <label
            key={category}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="w-4 h-4 rounded"
              aria-label={`Filter by ${categoryLabels[category] || category}`}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {categoryLabels[category] || category}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
