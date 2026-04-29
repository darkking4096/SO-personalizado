import React, { useCallback } from 'react'

interface IconCustomizationPanelProps {
  iconSize: number
  iconSpacing: number
  onIconSizeChange: (size: number) => void
  onIconSpacingChange: (spacing: number) => void
  disabled?: boolean
}

export const IconCustomizationPanel: React.FC<IconCustomizationPanelProps> = ({
  iconSize,
  iconSpacing,
  onIconSizeChange,
  onIconSpacingChange,
  disabled = false,
}) => {
  // Icon Size Handlers
  const handleIconSizeSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      onIconSizeChange(newValue)
    },
    [onIconSizeChange]
  )

  const handleIconSizeInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!isNaN(newValue) && newValue >= 16 && newValue <= 64) {
        onIconSizeChange(newValue)
      }
    },
    [onIconSizeChange]
  )

  const handleIconSizePreset = useCallback(
    (size: number) => {
      onIconSizeChange(size)
    },
    [onIconSizeChange]
  )

  // Icon Spacing Handlers
  const handleIconSpacingSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      onIconSpacingChange(newValue)
    },
    [onIconSpacingChange]
  )

  const handleIconSpacingInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 20) {
        onIconSpacingChange(newValue)
      }
    },
    [onIconSpacingChange]
  )

  const handleIconSpacingPreset = useCallback(
    (spacing: number) => {
      onIconSpacingChange(spacing)
    },
    [onIconSpacingChange]
  )

  // Get preset label based on icon size
  const getIconSizePresetLabel = (size: number): string => {
    switch (size) {
      case 16:
        return 'Compact'
      case 24:
        return 'Small'
      case 32:
        return 'Normal'
      case 48:
        return 'Large'
      case 64:
        return 'Extra Large'
      default:
        return 'Custom'
    }
  }

  // Get preset label based on icon spacing
  const getIconSpacingPresetLabel = (spacing: number): string => {
    switch (spacing) {
      case 0:
        return 'Tight'
      case 4:
        return 'Compact'
      case 8:
        return 'Normal'
      case 12:
        return 'Comfortable'
      case 20:
        return 'Spacious'
      default:
        return 'Custom'
    }
  }

  return (
    <div className="space-y-6">
      {/* Icon Size Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Icon Size
        </label>

        <div className="space-y-2">
          {/* Icon Size Slider */}
          <input
            type="range"
            min="16"
            max="64"
            step="1"
            value={iconSize}
            onChange={handleIconSizeSliderChange}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-blue-600"
          />

          {/* Value Display and Input */}
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="16"
              max="64"
              step="1"
              value={iconSize}
              onChange={handleIconSizeInputChange}
              disabled={disabled}
              className="w-16 px-2 py-1 text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">px</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              {getIconSizePresetLabel(iconSize)}
            </span>
          </div>

          {/* Icon Size Preview */}
          <div className="h-16 flex items-center gap-2 px-4 py-3 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  backgroundColor: '#3b82f6',
                }}
                className="rounded-sm transition-all duration-150"
              />
            ))}
          </div>

          {/* Icon Size Presets */}
          <div className="flex gap-2 flex-wrap">
            {[16, 24, 32, 48, 64].map((size) => (
              <button
                key={size}
                onClick={() => handleIconSizePreset(size)}
                disabled={disabled}
                className={`flex-1 min-w-14 px-2 py-2 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  iconSize === size
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          16px = Compact • 64px = Extra Large. Range: 16-64px
        </p>
      </div>

      {/* Icon Spacing Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Icon Spacing
        </label>

        <div className="space-y-2">
          {/* Icon Spacing Slider */}
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={iconSpacing}
            onChange={handleIconSpacingSliderChange}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-blue-600"
          />

          {/* Value Display and Input */}
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max="20"
              step="1"
              value={iconSpacing}
              onChange={handleIconSpacingInputChange}
              disabled={disabled}
              className="w-16 px-2 py-1 text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">px</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              {getIconSpacingPresetLabel(iconSpacing)}
            </span>
          </div>

          {/* Icon Spacing Preview */}
          <div className="h-16 flex items-center px-4 py-3 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            {[0, 1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width: `${iconSpacing}px` }} />}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#10b981',
                  }}
                  className="rounded-sm flex-shrink-0 transition-all duration-150"
                />
              </React.Fragment>
            ))}
          </div>

          {/* Icon Spacing Presets */}
          <div className="flex gap-2 flex-wrap">
            {[0, 4, 8, 12, 20].map((spacing) => (
              <button
                key={spacing}
                onClick={() => handleIconSpacingPreset(spacing)}
                disabled={disabled}
                className={`flex-1 min-w-14 px-2 py-2 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  iconSpacing === spacing
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {spacing}px
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          0px = Tight • 20px = Spacious. Range: 0-20px
        </p>
      </div>
    </div>
  )
}
