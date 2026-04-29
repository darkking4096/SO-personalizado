/**
 * Profile Manager Component
 * Story 3.4: Manage profiles, set default, and view auto-apply status
 * Allows users to select a profile as default for auto-apply on startup
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useProfileStore } from '../stores/profileStore'
import { ProfileManager as ProfileService } from '../services/profileManager'
import type { Profile } from '../types/index'

export const ProfileManager: React.FC = () => {
  const [defaultProfileId, setDefaultProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    profiles,
    setDefaultProfileId: storeSetDefaultProfileId,
    currentProfile,
  } = useProfileStore()

  // Load default profile on mount
  useEffect(() => {
    const loadDefaultProfile = async () => {
      try {
        const defaultId = await ProfileService.getDefaultProfile()
        setDefaultProfileId(defaultId)
      } catch (err) {
        console.error('Failed to load default profile:', err)
        setError('Failed to load default profile settings')
      }
    }

    loadDefaultProfile()
  }, [])

  /**
   * Set a profile as default
   */
  const handleSetAsDefault = useCallback(
    async (profileId: string) => {
      try {
        setLoading(true)
        setError(null)
        setSuccessMessage(null)

        await ProfileService.setAsDefault(profileId)
        setDefaultProfileId(profileId)
        storeSetDefaultProfileId(profileId)

        setSuccessMessage('Default profile set successfully')
        setTimeout(() => setSuccessMessage(null), 3000)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to set default profile'
        setError(errorMsg)
        console.error('Failed to set default profile:', err)
      } finally {
        setLoading(false)
      }
    },
    [storeSetDefaultProfileId]
  )

  /**
   * Clear default profile
   */
  const handleClearDefault = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      await ProfileService.setAsDefault('')
      setDefaultProfileId(null)
      storeSetDefaultProfileId(null)

      setSuccessMessage('Default profile cleared')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to clear default profile'
      setError(errorMsg)
      console.error('Failed to clear default profile:', err)
    } finally {
      setLoading(false)
    }
  }, [storeSetDefaultProfileId])

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profile Management</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Set a default profile to automatically apply on app startup
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-800 dark:text-green-200 text-sm">
          {successMessage}
        </div>
      )}

      {/* Default Profile Setting */}
      <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Default Profile (Auto-Apply on Startup)
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Hold <kbd className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded text-xs">Shift</kbd> during app
            launch to skip auto-apply
          </p>
        </div>

        {profiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">No profiles available</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Create a profile first to set it as default
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {profiles.map((profile: Profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Radio Button */}
                  <input
                    type="radio"
                    id={`default-${profile.id}`}
                    name="default-profile"
                    checked={defaultProfileId === profile.id}
                    onChange={() => handleSetAsDefault(profile.id)}
                    disabled={loading}
                    className="w-4 h-4 cursor-pointer"
                  />

                  {/* Profile Info */}
                  <label htmlFor={`default-${profile.id}`} className="flex-1 cursor-pointer">
                    <p className="font-medium text-gray-900 dark:text-white">{profile.name}</p>
                    {profile.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">{profile.description}</p>
                    )}
                  </label>
                </div>

                {/* Status Badge */}
                {defaultProfileId === profile.id && (
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                    Default
                  </div>
                )}

                {/* Current Profile Indicator */}
                {currentProfile?.id === profile.id && defaultProfileId !== profile.id && (
                  <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded text-xs font-medium">
                    Current
                  </div>
                )}
              </div>
            ))}

            {/* Clear Default Button */}
            {defaultProfileId && (
              <button
                onClick={handleClearDefault}
                disabled={loading}
                className="w-full mt-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Clear Default Profile'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">ℹ️ How Default Profiles Work</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
          <li>When a default is set, it auto-applies when you launch the app</li>
          <li>Hold Shift during startup to skip automatic application</li>
          <li>Settings apply in order: Wallpaper → Taskbar → Theme → Shortcuts</li>
          <li>If apply fails, an error message will appear</li>
        </ul>
      </div>
    </div>
  )
}
