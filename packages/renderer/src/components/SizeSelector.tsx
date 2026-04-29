import React, { useState, useCallback } from 'react'
import { TaskbarSize } from '../types/index'

interface SizeSelectorProps {
  currentSize: TaskbarSize
  onSizeChange: (size: TaskbarSize) => void
  disabled?: boolean
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  currentSize,
  onSizeChange,
  disabled = false
}) => {
  const [showCustom, setShowCustom] = useState(typeof currentSize === 'number')
  const [customSize, setCustomSize] = useState(typeof currentSize === 'number' ? currentSize : 48)

  const presets = [
    { label: 'Small', value: 'small' as const, pixels: 32 },
    { label: 'Default', value: 'default' as const, pixels: 48 },
    { label: 'Large', value: 'large' as const, pixels: 64 },
  ]

  const handlePresetClick = useCallback((preset: typeof presets[0]) => {
    setShowCustom(false)
    onSizeChange(preset.value)
  }, [onSizeChange])

  const handleCustomChange = useCallback((value: number) => {
    setCustomSize(value)
    setShowCustom(true)
    onSizeChange(value)
  }, [onSizeChange])

  const getPixelValue = () => {
    if (typeof currentSize === 'number') return currentSize
    const preset = presets.find(p => p.value === currentSize)
    return preset?.pixels || 48
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Taskbar Size
      </label>

      {/* Preset Buttons */}
      <div className="flex gap-3 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset)}
            disabled={disabled}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              !showCustom && currentSize === preset.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Size Slider */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 flex justify-between">
          <span>Custom Size (pixels)</span>
          <span>{getPixelValue()}px</span>
        </label>
        <input
          type="range"
          min="16"
          max="256"
          step="1"
          value={customSize}
          onChange={(e) => handleCustomChange(parseInt(e.target.value, 10))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>16px (Tiny)</span>
          <span>256px (Max)</span>
        </div>
      </div>

      {/* Current Size Display */}
      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-xs">
        {showCustom ? (
          <>Custom size: <strong>{customSize}px</strong></>
        ) : (
          <>
            Preset: <strong>{(currentSize as string).toUpperCase()}</strong> ({getPixelValue()}px)
          </>
        )}
      </div>
    </div>
  )
}
