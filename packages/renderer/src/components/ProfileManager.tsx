import { useState } from 'react'
import { useAppStore } from '../stores/appStore'
import ProfileList from './ProfileList'
import CreateProfileDialog from './CreateProfileDialog'
import EditProfileDialog from './EditProfileDialog'
import type { Profile } from '@shared/types/index.js'

export default function ProfileManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const profiles = useAppStore((state) => state.profiles)
  const addProfile = useAppStore((state) => state.addProfile)
  const removeProfile = useAppStore((state) => state.removeProfile)

  // Filter profiles by name
  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate total storage size (rough estimate: ~2KB per profile)
  const totalStorageSize = (profiles.length * 2).toFixed(1)

  const handleCreateProfile = (newProfile: Profile) => {
    addProfile(newProfile)
    setIsCreateDialogOpen(false)
  }

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile)
  }

  const handleDeleteProfile = (id: string) => {
    const profileName = profiles.find((p) => p.id === id)?.name || 'Profile'
    if (window.confirm(`Are you sure you want to delete "${profileName}"?`)) {
      removeProfile(id)
    }
  }

  return (
    <main className="h-full overflow-auto bg-white dark:bg-slate-950">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-950 dark:text-white mb-2">
            Profiles
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Save and manage your customization profiles. Switch between them instantly to apply different settings.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Profiles</p>
            <p className="text-2xl font-bold text-slate-950 dark:text-white">{profiles.length}</p>
          </div>
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">Storage Size</p>
            <p className="text-2xl font-bold text-slate-950 dark:text-white">{totalStorageSize} KB</p>
          </div>
        </div>

        {/* Search and Create Button */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search profiles by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            <span>+</span>
            Create Profile
          </button>
        </div>

        {/* Profile List */}
        <ProfileList
          profiles={filteredProfiles}
          onEdit={handleEditProfile}
          onDelete={handleDeleteProfile}
        />

        {/* Empty State */}
        {profiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">
              No profiles yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first profile to save your customization settings
            </p>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Create Profile
            </button>
          </div>
        )}

        {/* No results state */}
        {profiles.length > 0 && filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              No profiles match your search query
            </p>
          </div>
        )}

        {/* Dialogs */}
        {isCreateDialogOpen && (
          <CreateProfileDialog
            onCreate={handleCreateProfile}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        )}

        {editingProfile && (
          <EditProfileDialog
            profile={editingProfile}
            onClose={() => setEditingProfile(null)}
          />
        )}
      </div>
    </main>
  )
}
