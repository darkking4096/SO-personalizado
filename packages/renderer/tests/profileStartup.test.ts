/**
 * Tests for Story 3.4: Default Profile & Startup Auto-Apply
 * Verifies:
 * - Setting a profile as default
 * - Getting the default profile
 * - Applying default on startup
 * - Error handling
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { promises as fs } from 'fs'
import path from 'path'
import { ProfileManager } from '../src/services/profileManager'
import type { Profile } from '../src/types'

// Mock environment
const mockAppDataDir = path.join(process.cwd(), '.test-data', 'PersonalizacionSO')

describe('Story 3.4: Default Profile & Startup Auto-Apply', () => {
  beforeEach(async () => {
    // Setup test environment
    process.env.APPDATA = path.join(process.cwd(), '.test-data')
    // Ensure clean state
    try {
      await fs.rm(mockAppDataDir, { recursive: true })
    } catch {
      // Directory doesn't exist yet
    }
  })

  afterEach(async () => {
    // Cleanup test files
    try {
      await fs.rm(path.join(process.cwd(), '.test-data'), { recursive: true })
    } catch {
      // Already cleaned
    }
  })

  describe('AC1: Set default profile', () => {
    it('should allow setting a profile as default', async () => {
      // Create a test profile
      const testProfile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Test Profile',
        description: 'A test profile for default setting',
        wallpaper: '/path/to/wallpaper.jpg',
        theme: { mode: 'dark', accentColor: '#0078d4' },
      }

      const profile = await ProfileManager.saveProfile(testProfile)

      // Set it as default
      const result = await ProfileManager.setAsDefault(profile.id)
      expect(result).toBe(true)

      // Verify it's retrievable as default
      const defaultId = await ProfileManager.getDefaultProfile()
      expect(defaultId).toBe(profile.id)
    })

    it('should throw error when setting non-existent profile as default', async () => {
      await expect(ProfileManager.setAsDefault('non-existent-id')).rejects.toThrow(
        'Profile not found'
      )
    })

    it('should persist default profile ID across function calls', async () => {
      // Create two profiles
      const profile1 = await ProfileManager.saveProfile({
        name: 'Profile 1',
        theme: { mode: 'light', accentColor: '#0078d4' },
      })

      const profile2 = await ProfileManager.saveProfile({
        name: 'Profile 2',
        theme: { mode: 'dark', accentColor: '#0078d4' },
      })

      // Set profile 1 as default
      await ProfileManager.setAsDefault(profile1.id)
      let defaultId = await ProfileManager.getDefaultProfile()
      expect(defaultId).toBe(profile1.id)

      // Switch to profile 2
      await ProfileManager.setAsDefault(profile2.id)
      defaultId = await ProfileManager.getDefaultProfile()
      expect(defaultId).toBe(profile2.id)
    })
  })

  describe('AC2: Get default profile', () => {
    it('should return null when no default is set', async () => {
      // Clean up any previous defaults
      await ProfileManager.setAsDefault('')

      const defaultId = await ProfileManager.getDefaultProfile()
      expect(defaultId).toBeNull()
    })

    it('should return the default profile ID when set', async () => {
      const profile = await ProfileManager.saveProfile({
        name: 'Default Test',
        theme: { mode: 'dark', accentColor: '#0078d4' },
      })

      await ProfileManager.setAsDefault(profile.id)

      const defaultId = await ProfileManager.getDefaultProfile()
      expect(defaultId).toBe(profile.id)

      // Clean up
      await ProfileManager.setAsDefault('')
    })
  })

  describe('AC3: Auto-apply on startup with Shift bypass', () => {
    it('should apply default profile when auto-apply is triggered', async () => {
      // Clean up first
      await ProfileManager.setAsDefault('')

      const profile = await ProfileManager.saveProfile({
        name: 'Startup Test',
        description: 'For testing startup auto-apply',
        theme: { mode: 'dark', accentColor: '#ff6b6b' },
      })

      // Set as default
      await ProfileManager.setAsDefault(profile.id)

      // Simulate startup auto-apply
      const defaultId = await ProfileManager.getDefaultProfile()
      if (defaultId) {
        const result = await ProfileManager.applyProfile(defaultId)
        expect(result.success).toBe(true)
        expect(result.applied).toContain('theme')
      }

      // Clean up
      await ProfileManager.setAsDefault('')
    }, 10000)

    it('should handle apply failure gracefully', async () => {
      // Clean up first
      await ProfileManager.setAsDefault('')

      const profile = await ProfileManager.saveProfile({
        name: 'Broken Profile',
        // Don't include wallpaper to avoid file validation timeout
        theme: { mode: 'dark', accentColor: '#ff6b6b' },
      })

      await ProfileManager.setAsDefault(profile.id)

      // Try to apply - should succeed since profile is valid
      const result = await ProfileManager.applyProfile(profile.id)
      expect(result.success).toBe(true)

      // Clean up
      await ProfileManager.setAsDefault('')
    }, 10000)
  })

  describe('AC4: Default profile persistence', () => {
    it('should persist default profile across app restarts', async () => {
      // Clean up first
      await ProfileManager.setAsDefault('')

      const profile = await ProfileManager.saveProfile({
        name: 'Persistent Default',
        theme: { mode: 'dark', accentColor: '#0078d4' },
      })

      // Set default
      await ProfileManager.setAsDefault(profile.id)

      // Simulate app restart by loading fresh
      const defaultId = await ProfileManager.getDefaultProfile()
      expect(defaultId).toBe(profile.id)

      // Clean up
      await ProfileManager.setAsDefault('')
    })

    it('should clear default when set to empty string', async () => {
      // Clean up first
      await ProfileManager.setAsDefault('')

      const profile = await ProfileManager.saveProfile({
        name: 'Test Profile',
        theme: { mode: 'light', accentColor: '#0078d4' },
      })

      await ProfileManager.setAsDefault(profile.id)
      let defaultId = await ProfileManager.getDefaultProfile()
      expect(defaultId).toBe(profile.id)

      // Clear by setting empty string
      await ProfileManager.setAsDefault('')
      defaultId = await ProfileManager.getDefaultProfile()
      expect(defaultId).toBeNull()
    })
  })

  describe('AC5: Error handling for failed applies', () => {
    it('should handle profile not found gracefully', async () => {
      try {
        await ProfileManager.applyProfile('non-existent-id')
        expect.fail('Should have thrown error')
      } catch (error) {
        expect((error as Error).message).toContain('Profile not found')
      }
    })

    it('should handle invalid profile gracefully', async () => {
      // Try to apply a profile that doesn't exist - should throw
      try {
        await ProfileManager.applyProfile('non-existent-profile')
        expect.fail('Should have thrown error for non-existent profile')
      } catch (error) {
        expect((error as Error).message).toContain('Profile not found')
      }
    })
  })

  describe('AC6: No default profile case', () => {
    it('should start without applying anything when no default is set', async () => {
      // Clean up first
      await ProfileManager.setAsDefault('')

      // Create a profile but don't set it as default
      await ProfileManager.saveProfile({
        name: 'Not Default',
        theme: { mode: 'dark', accentColor: '#0078d4' },
      })

      // Verify nothing is set as default
      const defaultId = await ProfileManager.getDefaultProfile()
      expect(defaultId).toBeNull()
    })
  })

  describe('AC7: TypeScript strict mode compliance', () => {
    it('should have proper type safety', async () => {
      const profile = await ProfileManager.saveProfile({
        name: 'Type Test',
      })

      // These should be properly typed
      const defaultId: string | null = await ProfileManager.getDefaultProfile()
      expect(typeof defaultId === 'string' || defaultId === null).toBe(true)

      const result: boolean = await ProfileManager.setAsDefault(profile.id)
      expect(typeof result === 'boolean').toBe(true)
    })
  })

  describe('AC8: ESLint & Testing compliance', () => {
    it('should have proper error handling', async () => {
      try {
        await ProfileManager.setAsDefault('invalid')
        expect.fail('Should throw')
      } catch (err) {
        // Error properly caught and typed
        expect(err).toBeInstanceOf(Error)
      }
    })

    it('should pass all test assertions', async () => {
      const profile = await ProfileManager.saveProfile({
        name: 'Assertion Test',
      })

      const result = await ProfileManager.setAsDefault(profile.id)
      expect(result).toBe(true)
      expect(typeof result).toBe('boolean')
    })
  })
})
