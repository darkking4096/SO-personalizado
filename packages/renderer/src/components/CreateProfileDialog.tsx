import { useState } from 'react'
import type { Profile } from '@shared/types/index.js'

interface CreateProfileDialogProps {
  onCreate: (profile: Profile) => void
  onCancel: () => void
}

export default function CreateProfileDialog({ onCreate, onCancel }: CreateProfileDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSettings, setSelectedSettings] = useState({
    wallpaper: false,
    taskbar: false,
    theme: false,
    shortcuts: false,
  })
  const [error, setError] = useState('')

  const settingsOptions = [
    { id: 'wallpaper', label: 'Wallpaper', icon: '🖼️' },
    { id: 'taskbar', label: 'Taskbar', icon: '📊' },
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' },
  ] as const

  const handleToggleSetting = (settingId: keyof typeof selectedSettings) => {
    setSelectedSettings((prev) => ({
      ...prev,
      [settingId]: !prev[settingId],
    }))
  }

  const handleCreate = () => {
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

    // Create profile object
    const newProfile: Profile = {
      id: `profile_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add selected settings placeholders
    if (selectedSettings.wallpaper) {
      newProfile.wallpaper = ''
    }
    if (selectedSettings.taskbar) {
      newProfile.taskbar = {}
    }
    if (selectedSettings.theme) {
      newProfile.theme = { mode: 'light', accentColor: '#0078D4' }
    }
    if (selectedSettings.shortcuts) {
      newProfile.shortcuts = []
    }

    onCreate(newProfile)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleCreate()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            Create New Profile
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Give your profile a name and choose which settings to include
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

          {/* Settings Checkboxes */}
          <div>
            <p className="text-sm font-medium text-slate-950 dark:text-white mb-3">
              Include Settings
            </p>
            <div className="space-y-2">
              {settingsOptions.map(({ id, label, icon }) => (
                <label
                  key={id}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSettings[id]}
                    onChange={() => handleToggleSetting(id)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-lg">{icon}</span>
                  <span className="text-slate-950 dark:text-white">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-slate-950 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-colors font-medium"
          >
            Create Profile
          </button>
        </div>
      </div>
    </div>
  )
}
