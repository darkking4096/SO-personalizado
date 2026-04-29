import React, { useState, useCallback } from 'react'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  disabled?: boolean
  label?: string
  showPreview?: boolean
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  disabled = false,
  label = 'Color',
  showPreview = true,
}) => {
  const [hexInput, setHexInput] = useState(value)
  const [showColorInput, setShowColorInput] = useState(false)

  const handleColorInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value
      onChange(newColor)
    },
    [onChange]
  )

  const handleHexInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newHex = e.target.value.trim()

      // Add # if not present
      if (!newHex.startsWith('#')) {
        newHex = '#' + newHex
      }

      // Validate hex color format
      if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
        setHexInput(newHex)
        onChange(newHex)
      } else if (newHex.length <= 7) {
        // Allow typing incomplete hex values
        setHexInput(newHex)
      }
    },
    [onChange]
  )

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>}

      <div className="flex gap-3 items-center">
        {/* Native Color Input */}
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={handleColorInputChange}
            disabled={disabled}
            className="w-12 h-12 rounded-md cursor-pointer border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Click to select color"
          />
        </div>

        {/* Hex Input Toggle */}
        <button
          onClick={() => setShowColorInput(!showColorInput)}
          disabled={disabled}
          className="px-3 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Toggle hex input"
        >
          {showColorInput ? 'Hide Hex' : 'Hex'}
        </button>

        {/* Current Color Display */}
        {showPreview && (
          <div className="text-sm font-mono text-gray-700 dark:text-gray-300 min-w-20">
            {value.toUpperCase()}
          </div>
        )}
      </div>

      {/* Hex Input Field */}
      {showColorInput && (
        <input
          type="text"
          value={hexInput}
          onChange={handleHexInputChange}
          disabled={disabled}
          placeholder="#000000"
          maxLength={7}
          className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      )}

      {/* Color Presets */}
      <div className="flex gap-2 flex-wrap">
        {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map(
          (preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              disabled={disabled}
              className="w-8 h-8 rounded-md border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: preset,
                borderColor: value === preset ? '#3B82F6' : '#D1D5DB',
                borderWidth: value === preset ? '3px' : '2px',
              }}
              title={preset}
            />
          )
        )}
      </div>
    </div>
  )
}
