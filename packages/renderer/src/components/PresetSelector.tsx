/**
 * PresetSelector Component
 * Story 1.5: Displays available rotation presets for quick selection
 * Allows users to apply preset configurations with one click
 */

import React from 'react'
import { useWallpaperStore } from '../stores/wallpaperStore'
import { Preset } from '../types/index'
import { WallpaperService } from '../services/wallpaperService'

interface PresetSelectorProps {
  presets: Preset[]
  activePresetId: string | null
  onPresetSelect: (presetId: string) => void
  onDeletePreset: (presetId: string) => void
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  presets,
  activePresetId,
  onPresetSelect,
  onDeletePreset,
}) => {
  const { deletePreset } = useWallpaperStore()

  const handleSelectPreset = (presetId: string) => {
    const result = WallpaperService.getGlobalInstance().applyPreset(presetId)
    if (result.success) {
      onPresetSelect(presetId)
    }
  }

  const handleDeletePreset = (presetId: string) => {
    const result = WallpaperService.getGlobalInstance().deletePreset(presetId)
    if (result.success) {
      deletePreset(presetId)
      onDeletePreset(presetId)
    }
  }

  return (
    <div className="preset-selector">
      <h3 className="text-sm font-semibold text-white mb-3">Rotation Presets</h3>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className={`preset-card group relative rounded-lg p-3 transition-all duration-200 ${
              activePresetId === preset.id
                ? 'bg-blue-500 ring-2 ring-blue-300 shadow-lg'
                : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
            }`}
            onClick={() => handleSelectPreset(preset.id)}
          >
            <div className="text-center">
              <p className="font-medium text-white text-sm truncate">{preset.name}</p>
              <p className="text-xs text-gray-300 mt-1">
                {preset.config.intervalMinutes}min • {preset.config.mode}
              </p>
            </div>

            {/* Delete button (shows on hover, except for active preset) */}
            {activePresetId !== preset.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeletePreset(preset.id)
                }}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs"
                title="Delete preset"
              >
                ✕
              </button>
            )}

            {/* Active indicator */}
            {activePresetId === preset.id && (
              <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1 text-white text-xs">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
