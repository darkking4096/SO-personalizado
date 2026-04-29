import React, { useCallback } from 'react'

interface AutoHideToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  disabled?: boolean
}

export const AutoHideToggle: React.FC<AutoHideToggleProps> = ({
  enabled,
  onToggle,
  disabled = false
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onToggle(e.target.checked)
    },
    [onToggle]
  )

  return (
    <div className="w-full">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleChange}
          disabled={disabled}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Auto-Hide Taskbar
        </span>
      </label>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Automatically hide taskbar when not in use. Move mouse to bottom of screen to show it.
      </p>
    </div>
  )
}
