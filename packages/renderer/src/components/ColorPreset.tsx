import React from 'react'
import { ColorPreset as IColorPreset } from '../data/colorPresets'

interface ColorPresetProps {
  preset: IColorPreset
  selected: boolean
  onSelect: (hex: string) => void
  disabled?: boolean
}

export const ColorPreset: React.FC<ColorPresetProps> = ({ preset, selected, onSelect, disabled = false }) => {
  return (
    <button
      onClick={() => !disabled && onSelect(preset.hex)}
      disabled={disabled}
      title={preset.description || preset.name}
      className={`group relative w-12 h-12 rounded-lg transition-all ${
        selected
          ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
          : 'hover:scale-105 hover:ring-2 hover:ring-offset-1 hover:ring-gray-300 dark:hover:ring-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        backgroundColor: preset.hex,
        boxShadow: selected ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
      }}
    >
      {/* Checkmark for selected */}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-lg font-bold drop-shadow-md">✓</span>
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-1 rounded pointer-events-none z-10">
        {preset.name}
      </div>
    </button>
  )
}
