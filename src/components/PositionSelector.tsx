import React from 'react'

interface PositionSelectorProps {
  currentPosition: 'top' | 'bottom' | 'left' | 'right'
  onPositionChange: (position: 'top' | 'bottom' | 'left' | 'right') => void
  disabled?: boolean
}

export const PositionSelector: React.FC<PositionSelectorProps> = ({
  currentPosition,
  onPositionChange,
  disabled = false,
}) => {
  const positions: Array<{ value: 'top' | 'bottom' | 'left' | 'right'; label: string; icon: string }> = [
    { value: 'top', label: 'Top', icon: '⬆️' },
    { value: 'bottom', label: 'Bottom', icon: '⬇️' },
    { value: 'left', label: 'Left', icon: '⬅️' },
    { value: 'right', label: 'Right', icon: '➡️' },
  ]

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Taskbar Position
      </label>

      {/* Visual position selector with buttons */}
      <div className="grid grid-cols-2 gap-3">
        {positions.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => onPositionChange(value)}
            disabled={disabled}
            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              currentPosition === value
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Help text */}
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Select where you want the taskbar to appear on your screen
      </p>
    </div>
  )
}
