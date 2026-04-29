import React, { useState, useCallback, useEffect } from 'react'
import { useThemeStore } from '../stores/themeStore'
import { ThemeService } from '../services/themeService'

export const ThemePanel: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [systemThemeDetected, setSystemThemeDetected] = useState<'light' | 'dark'>('light')

  const { appTheme, windowsTheme, syncWithSystem, isApplying, error, setAppTheme, setWindowsTheme, setSyncWithSystem, setIsApplying, setError } = useThemeStore()

  // Load current theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        setLoading(true)
        const theme = await ThemeService.getCurrentTheme()
        setAppTheme(theme)
        setWindowsTheme(theme)

        // Detect system theme preference
        if (typeof window !== 'undefined') {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setSystemThemeDetected(isDark ? 'dark' : 'light')
        }
      } catch (err) {
        console.error('Error loading theme:', err)
        setError('Failed to load current theme')
      } finally {
        setLoading(false)
      }
    }

    loadTheme()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Handle theme toggle
   */
  const handleThemeToggle = useCallback(async () => {
    try {
      setIsApplying(true)
      setError(null)

      const newTheme = appTheme === 'light' ? 'dark' : 'light'
      const success = await ThemeService.setTheme(newTheme)

      if (success) {
        setAppTheme(newTheme)
        setWindowsTheme(newTheme)
      } else {
        setError('Failed to apply theme')
      }
    } catch (err) {
      console.error('Error toggling theme:', err)
      setError('Error occurred while changing theme')
    } finally {
      setIsApplying(false)
    }
  }, [appTheme, setAppTheme, setWindowsTheme, setIsApplying, setError])

  /**
   * Handle direct theme selection
   */
  const handleThemeSelect = useCallback(
    async (theme: 'light' | 'dark') => {
      if (theme === appTheme) return

      try {
        setIsApplying(true)
        setError(null)

        const success = await ThemeService.setTheme(theme)

        if (success) {
          setAppTheme(theme)
          setWindowsTheme(theme)
        } else {
          setError('Failed to apply theme')
        }
      } catch (err) {
        console.error('Error selecting theme:', err)
        setError('Error occurred while changing theme')
      } finally {
        setIsApplying(false)
      }
    },
    [appTheme, setAppTheme, setWindowsTheme, setIsApplying, setError]
  )

  /**
   * Handle sync with system toggle
   */
  const handleSyncWithSystem = useCallback(
    async (enabled: boolean) => {
      try {
        setSyncWithSystem(enabled)

        if (enabled && systemThemeDetected !== appTheme) {
          // Apply system theme if it differs from current
          await handleThemeSelect(systemThemeDetected)
        }
      } catch (err) {
        console.error('Error syncing with system:', err)
        setError('Error occurred while syncing with system theme')
      }
    },
    [appTheme, systemThemeDetected, setSyncWithSystem, setError, handleThemeSelect]
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Theme Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Customize your application and Windows 11 appearance</p>
      </div>

      {/* Error message */}
      {error && <div className="p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-md text-sm">{error}</div>}

      {/* Theme Toggle Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Light / Dark Mode</h3>

        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading theme settings...</div>
        ) : (
          <>
            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeToggle}
              disabled={isApplying}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition"
            >
              {isApplying ? 'Applying...' : `Switch to ${appTheme === 'light' ? 'Dark' : 'Light'} Mode`}
            </button>

            {/* Theme Selection Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeSelect('light')}
                disabled={isApplying}
                className={`px-4 py-2 rounded-md font-medium transition ${appTheme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => handleThemeSelect('dark')}
                disabled={isApplying}
                className={`px-4 py-2 rounded-md font-medium transition ${appTheme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                🌙 Dark
              </button>
            </div>

            {/* Sync with System Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <label htmlFor="sync-system" className="text-sm font-medium">
                Sync with system theme
              </label>
              <input
                id="sync-system"
                type="checkbox"
                checked={syncWithSystem}
                onChange={(e) => handleSyncWithSystem(e.target.checked)}
                disabled={isApplying}
                className="w-4 h-4 cursor-pointer"
              />
            </div>

            {systemThemeDetected && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                System theme detected: <span className="font-medium">{systemThemeDetected === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* Status Information */}
      <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-xs text-gray-600 dark:text-gray-400">
        <div className="flex justify-between">
          <span>App Theme:</span>
          <span className="font-medium">{appTheme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
        </div>
        <div className="flex justify-between">
          <span>Windows Theme:</span>
          <span className="font-medium">{windowsTheme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
        </div>
      </div>
    </div>
  )
}
