/**
 * SavePresetDialog Component
 * Story 1.5: Dialog for creating and saving custom rotation presets
 * Allows users to save their current rotation configuration with a custom name
 */

import React, { useState } from 'react'
import { RotationConfig } from '../types'
import { WallpaperService } from '../services/wallpaperService'

interface SavePresetDialogProps {
  isOpen: boolean
  currentConfig: RotationConfig | null
  onSave: (name: string) => void
  onClose: () => void
}

export const SavePresetDialog: React.FC<SavePresetDialogProps> = ({
  isOpen,
  currentConfig,
  onSave,
  onClose,
}) => {
  const [presetName, setPresetName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    if (!presetName.trim()) {
      setError('Preset name cannot be empty')
      return
    }

    if (!currentConfig) {
      setError('No rotation configuration available')
      return
    }

    const result = WallpaperService.savePreset(presetName, currentConfig)
    if (result.success) {
      onSave(presetName)
      setPresetName('')
      setError(null)
      onClose()
    } else {
      setError(result.error || 'Failed to save preset')
    }
  }

  const handleClose = () => {
    setPresetName('')
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4">Save as Preset</h2>

        <div className="space-y-4">
          {/* Preset Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preset Name
            </label>
            <input
              type="text"
              value={presetName}
              onChange={(e) => {
                setPresetName(e.target.value)
                setError(null)
              }}
              placeholder="e.g., My Work Profile"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Config Summary */}
          {currentConfig && (
            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2">Configuration:</p>
              <div className="text-sm text-gray-200 space-y-1">
                <p>• Mode: <span className="font-semibold">{currentConfig.mode}</span></p>
                <p>• Interval: <span className="font-semibold">{currentConfig.intervalMinutes} minutes</span></p>
                <p>• Images: <span className="font-semibold">{currentConfig.imagePool.length} selected</span></p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 text-red-200 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Dialog Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Save Preset
          </button>
        </div>
      </div>
    </div>
  )
}
