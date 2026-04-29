import { create } from 'zustand'
import type { Profile } from '../types'

interface ApplyProgress {
  current: string
  progress: number // 0-100
}

interface ProfileStoreState {
  profiles: Profile[]
  currentProfile: Profile | null
  loading: boolean
  error: string | null
  defaultProfileId: string | null
  isApplying: boolean
  applyProgress: ApplyProgress | null
  lastAppliedProfile: string | null

  // Actions
  setProfiles: (profiles: Profile[]) => void
  addProfile: (profile: Profile) => void
  updateProfile: (id: string, updates: Partial<Profile>) => void
  removeProfile: (id: string) => void
  setCurrentProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setDefaultProfileId: (id: string | null) => void
  setIsApplying: (isApplying: boolean) => void
  setApplyProgress: (progress: ApplyProgress | null) => void
  setLastAppliedProfile: (id: string | null) => void
  getProfiles: () => Profile[]
  getProfileById: (id: string) => Profile | undefined
  reset: () => void
}

const initialState = {
  profiles: [],
  currentProfile: null,
  loading: false,
  error: null,
  defaultProfileId: null,
  isApplying: false,
  applyProgress: null,
  lastAppliedProfile: null,
}

export const useProfileStore = create<ProfileStoreState>((set, get) => ({
  ...initialState,

  setProfiles: (profiles) => set({ profiles, error: null }),

  addProfile: (profile) =>
    set((state) => ({
      profiles: [...state.profiles, profile],
      error: null,
    })),

  updateProfile: (id, updates) =>
    set((state) => ({
      profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      currentProfile:
        state.currentProfile?.id === id ? { ...state.currentProfile, ...updates } : state.currentProfile,
      error: null,
    })),

  removeProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
      currentProfile: state.currentProfile?.id === id ? null : state.currentProfile,
      defaultProfileId: state.defaultProfileId === id ? null : state.defaultProfileId,
    })),

  setCurrentProfile: (profile) => set({ currentProfile: profile, error: null }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setDefaultProfileId: (id) => set({ defaultProfileId: id }),

  setIsApplying: (isApplying) => set({ isApplying }),

  setApplyProgress: (progress) => set({ applyProgress: progress }),

  setLastAppliedProfile: (id) => set({ lastAppliedProfile: id }),

  getProfiles: () => get().profiles,

  getProfileById: (id) => get().profiles.find((p) => p.id === id),

  reset: () => set(initialState),
}))
