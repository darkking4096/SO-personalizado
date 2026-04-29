import { useState } from 'react'
import { useAppStore } from '../stores/appStore'
import type { Profile } from '@shared/types/index.js'

interface EditProfileDialogProps {
  profile: Profile
  onClose: () => void
}

export default function EditProfileDialog({ profile, onClose }: EditProfileDialogProps) {
  const [name, setName] = useState(profile.name)
  const [description, setDescription] = useState(profile.description || '')
  const [error, setError] = useState('')
  const updateProfile = useAppStore((state) => state.updateProfile)

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      setError('Profile name is required')
      return
    }

    if (name.trim().length < 2) {
      setError('Profile name must be at least 2 characters')
      return
    }

    if (name.trim().length > 50) {
      setError('Profile name must be 50 characters or less')
      return
    }

    // Update profile
    updateProfile(profile.id, {
      name: name.trim(),
      description: description.trim() || undefined,
    })
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            Edit Profile
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Update your profile name and description
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-slate-950 dark:text-white mb-2">
              Profile Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Gaming Setup, Work Mode"
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-slate-950 dark:text-white mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add notes about this profile..."
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Current Settings Info */}
          <div>
            <p className="text-sm font-medium text-slate-950 dark:text-white mb-3">
              Current Settings
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.wallpaper && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                  🖼️ Wallpaper
                </span>
              )}
              {profile.taskbar && Object.keys(profile.taskbar).length > 0 && (
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
                  📊 Taskbar
                </span>
              )}
              {profile.theme && (
                <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs rounded">
                  🎨 Theme
                </span>
              )}
              {profile.shortcuts && profile.shortcuts.length > 0 && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
                  ⌨️ Shortcuts
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              To add or remove settings, delete and recreate the profile
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-950 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
