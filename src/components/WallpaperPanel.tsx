import React, { useState, useCallback, useEffect } from 'react'
import { useWallpaperStore } from '../stores/wallpaperStore'
import { WallpaperService } from '../services/wallpaperService'
import { WallpaperMode, RotationConfig } from '../types'
import { MonitorSelector } from './MonitorSelector'
import { PresetSelector } from './PresetSelector'
import { SavePresetDialog } from './SavePresetDialog'
import { DEFAULT_PRESETS } from '../data/wallpaperPresets'

export const WallpaperPanel: React.FC = () => {
  const [fileName, setFileName] = useState<string>('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [showSavePresetDialog, setShowSavePresetDialog] = useState(false)
  const [currentRotationConfig, setCurrentRotationConfig] = useState<RotationConfig | null>(null)

  const {
    currentWallpaper,
    previewImage,
    selectedMonitor,
    mode,
    isApplying,
    error,
    presets,
    activePresetId,
    setCurrentWallpaper,
    setPreviewImage,
    setMode,
    setIsApplying,
    setError,
    setPresets,
    setActivePresetId,
    addPreset,
  } = useWallpaperStore()

  // Load default presets on mount (Story 1.5)
  useEffect(() => {
    if (presets.length === 0) {
      setPresets(DEFAULT_PRESETS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presets.length])

  /**
   * Handle file selection via file browser
   * In a real app, this would use Electron's dialog.showOpenDialog()
   */
  const handleBrowseClick = useCallback(async () => {
    try {
      // This would call ipcRenderer.invoke('open-file-dialog', { filters: imageFilters })
      // For now, prompt user for file path
      const filePath = prompt('Enter wallpaper file path:')

      if (!filePath) return

      setError(null)
      setPreviewLoading(true)

      // Validate and load preview
      const result = await WallpaperService.selectWallpaper(filePath)

      if (result.success) {
        setFileName(filePath.split('\\').pop() || filePath)
        setCurrentWallpaper(filePath)
        setPreviewImage(result.preview || null)
      } else {
        setError(result.error || 'Failed to select wallpaper')
      }
    } catch (err) {
      setError('Failed to select wallpaper')
    } finally {
      setPreviewLoading(false)
    }
  }, [setCurrentWallpaper, setPreviewImage, setError])

  /**
   * Handle wallpaper mode change
   */
  const handleModeChange = useCallback((newMode: WallpaperMode) => {
    const validation = WallpaperService.validateModeTransition(mode, newMode)

    if (!validation.valid) {
      setError(validation.message || 'Invalid mode transition')
      return
    }

    setError(null)
    setMode(newMode)
  }, [mode, setMode, setError])

  /**
   * Handle wallpaper application
   */
  const handleApplyClick = useCallback(async () => {
    if (!currentWallpaper?.path) {
      setError('Please select a wallpaper first')
      return
    }

    try {
      setError(null)
      setIsApplying(true)

      const result = await WallpaperService.applyWallpaper(currentWallpaper.path, selectedMonitor)

      if (!result.success) {
        setError(result.error || 'Failed to apply wallpaper')
      }
    } catch (err) {
      setError('Failed to apply wallpaper')
    } finally {
      setIsApplying(false)
    }
  }, [currentWallpaper, selectedMonitor, setIsApplying, setError])

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Wallpaper Settings</h2>

      {/* Mode Toggle Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Wallpaper Mode
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => handleModeChange('fixed')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              mode === 'fixed'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            Fixed Mode
          </button>
          <button
            onClick={() => handleModeChange('variable')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              mode === 'variable'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            Variable Mode
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {mode === 'fixed'
            ? '📌 Fixed Mode: Single wallpaper applied and stays constant'
            : '🔄 Variable Mode: Enable scheduling and rotation features'}
        </p>
      </div>

      {/* File Browser Section */}
      <div className="mb-6">
        <button
          onClick={handleBrowseClick}
          disabled={previewLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
        >
          {previewLoading ? 'Loading...' : 'Browse Wallpapers'}
        </button>

        {fileName && (
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Selected:</strong> {fileName}
            </p>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {previewImage && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Preview</h3>
          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
            <img
              src={previewImage}
              alt="Wallpaper preview"
              className="w-full h-48 object-contain"
            />
          </div>
        </div>
      )}

      {/* Monitor Selector */}
      <div className="mb-6">
        <MonitorSelector />
      </div>

      {/* Scheduling Section - Only visible in Variable Mode */}
      {mode === 'variable' && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
            ⏰ Scheduling
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Set wallpaper changes at specific times of day
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed text-sm font-medium">
            Configure Schedule
          </button>
        </div>
      )}

      {/* Presets Section - Only visible in Variable Mode (Story 1.5) */}
      {mode === 'variable' && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
            🔄 Rotation Presets
          </h3>

          {/* Preset Selector */}
          <div className="mb-4">
            <PresetSelector
              presets={presets}
              activePresetId={activePresetId}
              onPresetSelect={(presetId) => {
                setActivePresetId(presetId)
                const preset = presets.find((p) => p.id === presetId)
                if (preset) {
                  setCurrentRotationConfig(preset.config)
                }
              }}
              onDeletePreset={(presetId) => {
                if (activePresetId === presetId) {
                  setActivePresetId(null)
                }
              }}
            />
          </div>

          {/* Save Custom Preset Button */}
          <button
            onClick={() => setShowSavePresetDialog(true)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed text-sm font-medium"
          >
            💾 Save Custom Preset
          </button>
        </div>
      )}

      {/* Save Preset Dialog */}
      <SavePresetDialog
        isOpen={showSavePresetDialog}
        currentConfig={currentRotationConfig || { mode: 'sequential', intervalMinutes: 30, imagePool: [] }}
        onSave={(name) => {
          const newPreset = {
            name,
            config: currentRotationConfig || { mode: 'sequential', intervalMinutes: 30, imagePool: [] },
          }
          addPreset(newPreset)
        }}
        onClose={() => setShowSavePresetDialog(false)}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Apply Button */}
      <button
        onClick={handleApplyClick}
        disabled={!currentWallpaper || isApplying}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed font-medium"
      >
        {isApplying ? 'Applying...' : 'Apply Wallpaper'}
      </button>

      {/* Performance Note */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        ℹ️ Image loading: &lt;500ms | Apply time: &lt;1s
      </p>
    </div>
  )
}
