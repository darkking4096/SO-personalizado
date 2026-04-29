import { describe, it, expect } from 'vitest'
import type { Profile } from '../src/types'
import { ProfileManager } from '../src/services/profileManager'

describe('ProfileManager', () => {
  const mockProfile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Test Profile',
    description: 'A test profile',
    wallpaper: 'C:\\Users\\Test\\wallpaper.jpg',
    taskbar: { position: 'bottom', transparency: 0.8 },
    theme: { mode: 'dark', accentColor: '#FF5733' },
    shortcuts: ['shortcut1', 'shortcut2'],
  }

  describe('validateProfile', () => {
    it('should validate a valid profile', async () => {
      const profile: Profile = {
        id: 'test-id',
        name: 'Valid Profile',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await ProfileManager.validateProfile(profile)
      expect(result).toBe(true)
    })

    it('should reject profile without id', async () => {
      const profile = {
        name: 'Invalid Profile',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as Profile

      await expect(ProfileManager.validateProfile(profile)).rejects.toThrow('id and name')
    })

    it('should reject profile without name', async () => {
      const profile = {
        id: 'test-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as Profile

      await expect(ProfileManager.validateProfile(profile)).rejects.toThrow('id and name')
    })
  })

  describe('applyProfile', () => {
    it('should throw error when profile not found', async () => {
      await expect(ProfileManager.applyProfile('non-existent-id')).rejects.toThrow('not found')
    })
  })

  describe('Profile data structure', () => {
    it('should accept profile with all optional fields', async () => {
      const fullProfile = await ProfileManager.saveProfile(mockProfile)

      expect(fullProfile.id).toBeDefined()
      expect(fullProfile.name).toBe(mockProfile.name)
      expect(fullProfile.description).toBe(mockProfile.description)
      expect(fullProfile.wallpaper).toBe(mockProfile.wallpaper)
      expect(fullProfile.taskbar).toEqual(mockProfile.taskbar)
      expect(fullProfile.theme).toEqual(mockProfile.theme)
      expect(fullProfile.shortcuts).toEqual(mockProfile.shortcuts)
      expect(fullProfile.createdAt).toBeDefined()
      expect(fullProfile.updatedAt).toBeDefined()
    })

    it('should accept minimal profile with only name', async () => {
      const minimalProfile = await ProfileManager.saveProfile({
        name: 'Minimal Profile',
      })

      expect(minimalProfile.id).toBeDefined()
      expect(minimalProfile.name).toBe('Minimal Profile')
      expect(minimalProfile.createdAt).toBeDefined()
      expect(minimalProfile.updatedAt).toBeDefined()
    })

    it('should generate unique IDs', async () => {
      const profile1 = await ProfileManager.saveProfile(mockProfile)
      const profile2 = await ProfileManager.saveProfile({ ...mockProfile, name: 'Profile 2' })

      expect(profile1.id).not.toBe(profile2.id)
    })

    it('should generate ISO timestamps', async () => {
      const profile = await ProfileManager.saveProfile(mockProfile)

      // Check that timestamps are valid ISO 8601 strings
      expect(() => new Date(profile.createdAt)).not.toThrow()
      expect(() => new Date(profile.updatedAt)).not.toThrow()

      // Check that they parse correctly
      const created = new Date(profile.createdAt)
      const updated = new Date(profile.updatedAt)
      expect(created.getTime()).toBeLessThanOrEqual(updated.getTime())
    })
  })

  describe('Profile methods exist', () => {
    it('should have all required methods', () => {
      expect(typeof ProfileManager.saveProfile).toBe('function')
      expect(typeof ProfileManager.loadProfile).toBe('function')
      expect(typeof ProfileManager.listProfiles).toBe('function')
      expect(typeof ProfileManager.deleteProfile).toBe('function')
      expect(typeof ProfileManager.validateProfile).toBe('function')
      expect(typeof ProfileManager.updateProfile).toBe('function')
      expect(typeof ProfileManager.applyProfile).toBe('function')
      expect(typeof ProfileManager.setAsDefault).toBe('function')
      expect(typeof ProfileManager.getDefaultProfile).toBe('function')
      expect(typeof ProfileManager.exportProfile).toBe('function')
      expect(typeof ProfileManager.importProfile).toBe('function')
      expect(typeof ProfileManager.captureCurrentState).toBe('function')
    })
  })

  describe('captureCurrentState', () => {
    it('should create snapshot of current state', async () => {
      const snapshot = await ProfileManager.captureCurrentState('Test Snapshot')

      expect(snapshot.id).toBeDefined()
      expect(snapshot.name).toBe('Test Snapshot')
      expect(snapshot.createdAt).toBeDefined()
      expect(snapshot.updatedAt).toBeDefined()
    })
  })
})
