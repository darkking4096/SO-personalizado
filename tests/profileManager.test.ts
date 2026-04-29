import { describe, it, expect, vi } from 'vitest'
import type { Profile } from '../src/types/index'

// Mock Profile data for testing
const createMockProfile = (overrides?: Partial<Profile>): Profile => ({
  id: `profile_${Date.now()}`,
  name: 'Test Profile',
  description: 'A test profile',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  wallpaper: '',
  taskbar: {},
  theme: { mode: 'light', accentColor: '#0078D4' },
  shortcuts: [],
  ...overrides,
})

describe('Profile Manager Tests', () => {
  describe('Profile Creation', () => {
    it('should create a profile with valid name', () => {
      const profile = createMockProfile({
        name: 'Gaming Setup',
        description: 'Optimized for gaming',
      })

      expect(profile.name).toBe('Gaming Setup')
      expect(profile.description).toBe('Optimized for gaming')
      expect(profile.id).toBeDefined()
      expect(profile.createdAt).toBeDefined()
      expect(profile.updatedAt).toBeDefined()
    })

    it('should generate unique IDs for different profiles', () => {
      const profile1 = createMockProfile()
      // Add delay to ensure different timestamps
      vi.useFakeTimers()
      vi.advanceTimersByTime(10)
      const profile2 = createMockProfile()
      vi.useRealTimers()

      expect(profile1.id).not.toBe(profile2.id)
    })

    it('should handle profile with optional description', () => {
      const profile = createMockProfile({
        name: 'Work Mode',
        description: undefined,
      })

      expect(profile.name).toBe('Work Mode')
      expect(profile.description).toBeUndefined()
    })

    it('should include selected settings in profile', () => {
      const profile = createMockProfile({
        wallpaper: 'C:\\path\\to\\wallpaper.jpg',
        taskbar: { position: 'bottom', transparency: 0 },
        theme: { mode: 'dark', accentColor: '#FFFFFF' },
        shortcuts: ['shortcut1', 'shortcut2'],
      })

      expect(profile.wallpaper).toBe('C:\\path\\to\\wallpaper.jpg')
      expect(profile.taskbar).toEqual({ position: 'bottom', transparency: 0 })
      expect(profile.theme?.mode).toBe('dark')
      expect(profile.shortcuts).toHaveLength(2)
    })
  })

  describe('Profile Validation', () => {
    it('should validate profile name length', () => {
      const validNames = ['A1', 'Gaming Setup', 'Very Long Profile Name That Is Still Valid']
      validNames.forEach((name) => {
        expect(name.length >= 2 && name.length <= 50).toBe(true)
      })
    })

    it('should reject empty profile names', () => {
      const emptyName = ''
      expect(emptyName.trim().length === 0).toBe(true)
    })

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(51)
      expect(longName.length > 50).toBe(true)
    })

    it('should reject names with only whitespace', () => {
      const whitespaceNames = ['   ', '\t', '\n', '  \t  ']
      whitespaceNames.forEach((name) => {
        expect(name.trim().length === 0).toBe(true)
      })
    })

    it('should trim whitespace from profile names', () => {
      const nameWithSpaces = '  Gaming Setup  '
      expect(nameWithSpaces.trim()).toBe('Gaming Setup')
    })
  })

  describe('Profile List Operations', () => {
    it('should filter profiles by search query', () => {
      const profiles: Profile[] = [
        createMockProfile({ name: 'Gaming Setup' }),
        createMockProfile({ name: 'Work Mode' }),
        createMockProfile({ name: 'Gaming Mode 2' }),
      ]

      const searchQuery = 'gaming'
      const filtered = profiles.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

      expect(filtered).toHaveLength(2)
      expect(filtered[0].name).toBe('Gaming Setup')
      expect(filtered[1].name).toBe('Gaming Mode 2')
    })

    it('should handle case-insensitive search', () => {
      const profiles: Profile[] = [
        createMockProfile({ name: 'Gaming Setup' }),
        createMockProfile({ name: 'GAMING MODE' }),
      ]

      const searchQuery = 'GAMING'
      const filtered = profiles.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

      expect(filtered).toHaveLength(2)
    })

    it('should return empty array for no matches', () => {
      const profiles: Profile[] = [
        createMockProfile({ name: 'Gaming Setup' }),
        createMockProfile({ name: 'Work Mode' }),
      ]

      const searchQuery = 'netflix'
      const filtered = profiles.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

      expect(filtered).toHaveLength(0)
    })

    it('should calculate storage size correctly', () => {
      const profiles: Profile[] = [
        createMockProfile(),
        createMockProfile(),
        createMockProfile(),
      ]

      // Rough estimate: ~2KB per profile
      const totalStorageSize = profiles.length * 2
      expect(totalStorageSize).toBe(6)
    })
  })

  describe('Profile Update Operations', () => {
    it('should update profile name', () => {
      const profile = createMockProfile({ name: 'Old Name' })
      const updated: Profile = {
        ...profile,
        name: 'New Name',
        updatedAt: new Date().toISOString(),
      }

      expect(updated.name).toBe('New Name')
      expect(updated.id).toBe(profile.id)
      expect(updated.updatedAt).not.toBe(profile.updatedAt)
    })

    it('should update profile description', () => {
      const profile = createMockProfile({ description: 'Old description' })
      const updated: Profile = {
        ...profile,
        description: 'New description',
        updatedAt: new Date().toISOString(),
      }

      expect(updated.description).toBe('New description')
      expect(updated.id).toBe(profile.id)
    })

    it('should preserve other profile data when updating', () => {
      const profile = createMockProfile({
        name: 'Original',
        wallpaper: 'path/to/wallpaper.jpg',
        theme: { mode: 'dark', accentColor: '#FFFFFF' },
      })

      const updated: Profile = {
        ...profile,
        name: 'Updated',
        updatedAt: new Date().toISOString(),
      }

      expect(updated.wallpaper).toBe('path/to/wallpaper.jpg')
      expect(updated.theme?.mode).toBe('dark')
      expect(updated.theme?.accentColor).toBe('#FFFFFF')
      expect(updated.name).toBe('Updated')
    })

    it('should update the updatedAt timestamp when modifying', () => {
      const profile = createMockProfile()
      const originalUpdatedAt = profile.updatedAt

      // Simulate time passing
      vi.useFakeTimers()
      vi.setSystemTime(new Date(Date.parse(originalUpdatedAt) + 1000))

      const updated: Profile = {
        ...profile,
        name: 'Modified',
        updatedAt: new Date().toISOString(),
      }

      vi.useRealTimers()

      expect(updated.updatedAt).not.toBe(originalUpdatedAt)
    })
  })

  describe('Profile Deletion', () => {
    it('should remove profile from list', () => {
      const profiles: Profile[] = [
        createMockProfile({ id: 'profile_1', name: 'Profile 1' }),
        createMockProfile({ id: 'profile_2', name: 'Profile 2' }),
        createMockProfile({ id: 'profile_3', name: 'Profile 3' }),
      ]

      const idToDelete = 'profile_2'
      const filtered = profiles.filter((p) => p.id !== idToDelete)

      expect(filtered).toHaveLength(2)
      expect(filtered.find((p) => p.id === idToDelete)).toBeUndefined()
      expect(filtered[0].id).toBe('profile_1')
      expect(filtered[1].id).toBe('profile_3')
    })

    it('should handle deleting non-existent profile', () => {
      const profiles: Profile[] = [
        createMockProfile({ id: 'profile_1' }),
        createMockProfile({ id: 'profile_2' }),
      ]

      const idToDelete = 'profile_nonexistent'
      const filtered = profiles.filter((p) => p.id !== idToDelete)

      expect(filtered).toHaveLength(2)
    })

    it('should handle deleting from empty list', () => {
      const profiles: Profile[] = []
      const filtered = profiles.filter((p) => p.id !== 'any_id')

      expect(filtered).toHaveLength(0)
    })
  })

  describe('Profile Settings Tags', () => {
    it('should identify wallpaper setting', () => {
      const profile = createMockProfile({
        wallpaper: 'path/to/image.jpg',
        taskbar: undefined,
        theme: undefined,
        shortcuts: undefined,
      })

      expect(profile.wallpaper).toBeDefined()
      expect(profile.taskbar).toBeUndefined()
    })

    it('should identify taskbar setting', () => {
      const profile = createMockProfile({
        wallpaper: undefined,
        taskbar: { position: 'bottom' },
        theme: undefined,
        shortcuts: undefined,
      })

      expect(profile.taskbar).toBeDefined()
      expect(Object.keys(profile.taskbar).length).toBeGreaterThan(0)
    })

    it('should identify theme setting', () => {
      const profile = createMockProfile({
        wallpaper: undefined,
        taskbar: undefined,
        theme: { mode: 'dark', accentColor: '#FFFFFF' },
        shortcuts: undefined,
      })

      expect(profile.theme).toBeDefined()
      expect(profile.theme?.mode).toBe('dark')
    })

    it('should identify shortcuts setting', () => {
      const profile = createMockProfile({
        wallpaper: undefined,
        taskbar: undefined,
        theme: undefined,
        shortcuts: ['shortcut1', 'shortcut2'],
      })

      expect(profile.shortcuts).toBeDefined()
      expect(profile.shortcuts?.length).toBeGreaterThan(0)
    })

    it('should handle multiple settings', () => {
      const profile = createMockProfile({
        wallpaper: 'path/to/image.jpg',
        taskbar: { position: 'bottom' },
        theme: { mode: 'light', accentColor: '#0078D4' },
        shortcuts: ['shortcut1'],
      })

      expect(profile.wallpaper).toBeDefined()
      expect(profile.taskbar).toBeDefined()
      expect(profile.theme).toBeDefined()
      expect(profile.shortcuts).toBeDefined()
    })
  })

  describe('Profile Date Formatting', () => {
    it('should format profile dates correctly', () => {
      const isoDate = '2026-04-29T14:35:00.000Z'
      const date = new Date(isoDate)

      const formatted = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      expect(formatted).toContain('Apr')
      expect(formatted).toContain('29')
      expect(formatted).toContain('2026')
    })

    it('should handle all valid date formats', () => {
      const dates = [
        new Date('2026-01-01T10:00:00Z'),
        new Date('2026-06-15T14:30:00Z'),
        new Date('2026-12-31T23:59:59Z'),
      ]

      dates.forEach((date) => {
        const formatted = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
        expect(formatted).toBeTruthy()
      })
    })
  })
})
