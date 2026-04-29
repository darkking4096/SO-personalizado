import type { Profile } from '@shared/types/index.js'

interface ProfileListProps {
  profiles: Profile[]
  onEdit: (profile: Profile) => void
  onDelete: (id: string) => void
}

export default function ProfileList({ profiles, onEdit, onDelete }: ProfileListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (profiles.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Profile Info */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                {profile.name}
              </h3>
              {profile.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {profile.description}
                </p>
              )}
              <div className="flex gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                <span>Created: {formatDate(profile.createdAt)}</span>
                <span>Updated: {formatDate(profile.updatedAt)}</span>
              </div>

              {/* Settings Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
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
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(profile)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                title="Edit profile"
                aria-label={`Edit ${profile.name}`}
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(profile.id)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors text-red-600 dark:text-red-400"
                title="Delete profile"
                aria-label={`Delete ${profile.name}`}
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
