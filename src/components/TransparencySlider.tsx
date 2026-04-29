import React, { useCallback } from 'react'

interface TransparencySliderProps {
  value: number
  onChange: (transparency: number) => void
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  label?: string
  showPercentage?: boolean
}

export const TransparencySlider: React.FC<TransparencySliderProps> = ({
  value,
  onChange,
  disabled = false,
  min = 0,
  max = 100,
  step = 1,
  label = 'Taskbar Transparency',
  showPercentage = true,
}) => {
  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      onChange(newValue)
    },
    [onChange]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onChange(newValue)
      }
    },
    [onChange, min, max]
  )

  const handleQuickSet = useCallback(
    (percent: number) => {
      onChange(percent)
    },
    [onChange]
  )

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>}

      <div className="space-y-2">
        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-blue-600"
        />

        {/* Value Display and Input */}
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            className="w-16 px-2 py-1 text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {showPercentage && <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">%</span>}
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
            {value === 0 ? 'Opaque' : value === 100 ? 'Fully Transparent' : 'Semi-transparent'}
          </span>
        </div>

        {/* Preview Bar */}
        <div className="h-12 rounded-md border-2 border-gray-300 dark:border-gray-600 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-900">
          <div
            className="h-full bg-white dark:bg-gray-100 transition-opacity duration-150"
            style={{ opacity: 1 - value / 100 }}
          />
        </div>

        {/* Quick Set Buttons */}
        <div className="flex gap-2 flex-wrap">
          {[0, 25, 50, 75, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => handleQuickSet(preset)}
              disabled={disabled}
              className={`flex-1 min-w-12 px-2 py-2 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                value === preset
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        0% = Fully opaque (solid) • 100% = Fully transparent (invisible)
      </p>
    </div>
  )
}
