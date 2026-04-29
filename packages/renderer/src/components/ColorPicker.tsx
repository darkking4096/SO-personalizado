import React, { useState, useCallback } from 'react'
import { ColorPreset as IColorPreset, COLOR_PRESETS, isPresetColor } from '../data/colorPresets'
import { ColorPreset } from './ColorPreset'
import { ThemeService } from '../services/themeService'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  onApply: (color: string) => Promise<boolean>
  disabled?: boolean
  showPresets?: boolean
  showNativeInput?: boolean
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  onApply,
  disabled = false,
  showPresets = true,
  showNativeInput = true,
}) => {
  const [hexInput, setHexInput] = useState(value)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)

  /**
   * Handle hex input change
   */
  const handleHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setHexInput(newValue)
      setError(null)

      // Validate format
      if (ThemeService.validateColor(newValue)) {
        const normalized = ThemeService.normalizeColor(newValue)
        onChange(normalized)
      }
    },
    [onChange]
  )

  /**
   * Handle native color input change
   */
  const handleNativeColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.toUpperCase()
      setHexInput(newValue)
      setError(null)
      onChange(newValue)
    },
    [onChange]
  )

  /**
   * Handle hex input blur (validation)
   */
  const handleHexBlur = useCallback(() => {
    if (!ThemeService.validateColor(hexInput)) {
      setError('Invalid hex color. Use #RGB or #RRGGBB format')
      setHexInput(value) // Reset to previous value
    } else {
      const normalized = ThemeService.normalizeColor(hexInput)
      setHexInput(normalized)
      onChange(normalized)
    }
  }, [hexInput, value, onChange])

  /**
   * Handle preset selection
   */
  const handlePresetSelect = useCallback(
    (hex: string) => {
      setHexInput(hex)
      setError(null)
      onChange(hex)
    },
    [onChange]
  )

  /**
   * Handle apply button click
   */
  const handleApply = useCallback(async () => {
    try {
      if (!ThemeService.validateColor(hexInput)) {
        setError('Invalid hex color')
        return
      }

      setApplying(true)
      setError(null)

      const success = await onApply(hexInput)
      if (!success) {
        setError('Failed to apply color')
      }
    } catch (err) {
      console.error('Error applying color:', err)
      setError('Error occurred while applying color')
    } finally {
      setApplying(false)
    }
  }, [hexInput, onApply])

  const isPreset = isPresetColor(value)

  return (
    <div className="space-y-4">
      {/* Hex Input and Native Color Picker */}
      <div className="flex gap-3">
        {showNativeInput && (
          <input
            type="color"
            value={value}
            onChange={handleNativeColorChange}
            disabled={disabled || applying}
            className="w-12 h-10 rounded cursor-pointer disabled:opacity-50"
            title="Click to pick a color"
          />
        )}

        <input
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          disabled={disabled || applying}
          placeholder="#RRGGBB"
          maxLength={7}
          className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm disabled:opacity-50"
        />

        <button
          onClick={handleApply}
          disabled={disabled || applying || !ThemeService.validateColor(hexInput)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition"
        >
          {applying ? 'Applying...' : 'Apply'}
        </button>
      </div>

      {/* Error message */}
      {error && <div className="p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-md text-xs">{error}</div>}

      {/* Color preview and info */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: value }}
            title="Current color preview"
          />
          <div className="text-sm">
            <div className="font-mono text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{isPreset ? '📌 Preset Color' : 'Custom Color'}</div>
          </div>
        </div>
      </div>

      {/* Preset Colors */}
      {showPresets && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Windows 11 Presets</label>
          <div className="flex flex-wrap gap-3">
            {COLOR_PRESETS.map((preset: IColorPreset) => (
              <ColorPreset
                key={preset.hex}
                preset={preset}
                selected={value === preset.hex}
                onSelect={handlePresetSelect}
                disabled={disabled || applying}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
