import React, { useCallback } from 'react'

export interface VisibilityItem {
  id: string
  label: string
  description: string
  enabled: boolean
}

interface VisibilityChecklistProps {
  items: VisibilityItem[]
  onItemChange: (itemId: string, enabled: boolean) => void
  disabled?: boolean
}

export const VisibilityChecklist: React.FC<VisibilityChecklistProps> = ({
  items,
  onItemChange,
  disabled = false,
}) => {
  const handleChange = useCallback(
    (itemId: string, enabled: boolean) => {
      onItemChange(itemId, enabled)
    },
    [onItemChange]
  )

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Taskbar Element Visibility
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => handleChange(item.id, e.target.checked)}
              disabled={disabled}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.description}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
