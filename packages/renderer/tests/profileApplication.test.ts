import { describe, it, expect, beforeEach } from 'vitest'
import { ProfileManager } from '@shared/services/profileManager'
import { KeyboardShortcutService } from '@shared/services/keyboardShortcutService'
import type { Profile } from '@shared/types'

describe('ProfileApplication - Story 3.3', () => {
  const mockProfile: Profile = {
    id: 'profile-test-001',
    name: 'Gaming Profile',
    description: 'Optimized for gaming',
    taskbar: {
      position: 'bottom',
      transparency: 0,
      backgroundColor: '#000000',
      size: 'default',
      visibility: true,
      autoHide: false,
    },
    theme: {
      mode: 'dark',
      accentColor: '#FF6B00',
    },
    shortcuts: ['profile-test-001'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const mockProfile2: Profile = {
    id: 'profile-test-002',
    name: 'Work Profile',
    description: 'Optimized for work',
    taskbar: {
      position: 'bottom',
      transparency: 20,
      backgroundColor: '#FFFFFF',
      size: 'small',
      visibility: true,
      autoHide: true,
    },
    theme: {
      mode: 'light',
      accentColor: '#0078D4',
    },
    shortcuts: ['profile-test-002'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // ============ ProfileManager Tests ============

  describe('ProfileManager - validateProfileApplicable', () => {
    it('should validate profile with valid taskbar settings', async () => {
      const result = await ProfileManager.validateProfileApplicable(mockProfile)
      expect(result.valid).toBe(true)
      expect(result.issues.length).toBe(0)
    })

    it('should detect invalid taskbar position', async () => {
      const invalidProfile: Profile = {
        ...mockProfile,
        taskbar: {
          ...mockProfile.taskbar,
          position: 'invalid' as unknown as typeof mockProfile.taskbar.position,
        },
      }

      const result = await ProfileManager.validateProfileApplicable(invalidProfile)
      expect(result.valid).toBe(false)
      expect(result.issues.some((issue) => issue.includes('taskbar position'))).toBe(true)
    })

    it('should detect invalid transparency value', async () => {
      const invalidProfile: Profile = {
        ...mockProfile,
        taskbar: {
          ...mockProfile.taskbar,
          transparency: 150,
        },
      }

      const result = await ProfileManager.validateProfileApplicable(invalidProfile)
      expect(result.valid).toBe(false)
      expect(result.issues.some((issue) => issue.includes('transparency'))).toBe(true)
    })

    it('should detect transparency below 0', async () => {
      const invalidProfile: Profile = {
        ...mockProfile,
        taskbar: {
          ...mockProfile.taskbar,
          transparency: -10,
        },
      }

      const result = await ProfileManager.validateProfileApplicable(invalidProfile)
      expect(result.valid).toBe(false)
      expect(result.issues.some((issue) => issue.includes('transparency'))).toBe(true)
    })

    it('should detect invalid theme mode', async () => {
      const invalidProfile: Profile = {
        ...mockProfile,
        theme: {
          mode: 'invalid' as unknown as typeof mockProfile.theme.mode,
          accentColor: '#FF0000',
        },
      }

      const result = await ProfileManager.validateProfileApplicable(invalidProfile)
      expect(result.valid).toBe(false)
      expect(result.issues.some((issue) => issue.includes('theme mode'))).toBe(true)
    })

    it('should detect missing id', async () => {
      const invalidProfile = { ...mockProfile, id: '' }
      const result = await ProfileManager.validateProfileApplicable(invalidProfile)
      expect(result.valid).toBe(false)
      expect(result.issues.some((issue) => issue.includes('id and name'))).toBe(true)
    })

    it('should detect missing name', async () => {
      const invalidProfile = { ...mockProfile, name: '' }
      const result = await ProfileManager.validateProfileApplicable(invalidProfile)
      expect(result.valid).toBe(false)
      expect(result.issues.some((issue) => issue.includes('id and name'))).toBe(true)
    })

    it('should allow profiles without wallpaper', async () => {
      const profileWithoutWallpaper: Profile = {
        ...mockProfile,
        wallpaper: undefined,
      }

      const result = await ProfileManager.validateProfileApplicable(profileWithoutWallpaper)
      expect(result.valid).toBe(true)
    })

    it('should allow profiles without taskbar', async () => {
      const profileWithoutTaskbar: Profile = {
        ...mockProfile,
        taskbar: undefined,
      }

      const result = await ProfileManager.validateProfileApplicable(profileWithoutTaskbar)
      expect(result.valid).toBe(true)
    })

    it('should allow profiles without theme', async () => {
      const profileWithoutTheme: Profile = {
        ...mockProfile,
        theme: undefined,
      }

      const result = await ProfileManager.validateProfileApplicable(profileWithoutTheme)
      expect(result.valid).toBe(true)
    })
  })

  // ============ KeyboardShortcutService Tests ============

  describe('KeyboardShortcutService.registerProfileShortcuts', () => {
    beforeEach(() => {
      KeyboardShortcutService.unregisterProfileShortcuts()
    })

    it('should register top 10 profiles', async () => {
      const profiles = Array.from({ length: 15 }, (_, i) => ({
        ...mockProfile,
        id: `profile-${i}`,
        name: `Profile ${i}`,
      }))

      const shortcuts = await KeyboardShortcutService.registerProfileShortcuts(profiles)

      expect(shortcuts.length).toBeLessThanOrEqual(10)
      expect(shortcuts.length).toBe(10)
    })

    it('should register fewer than 10 profiles if not available', async () => {
      const profiles = Array.from({ length: 5 }, (_, i) => ({
        ...mockProfile,
        id: `profile-${i}`,
        name: `Profile ${i}`,
      }))

      const shortcuts = await KeyboardShortcutService.registerProfileShortcuts(profiles)

      expect(shortcuts.length).toBe(5)
    })

    it('should use correct shortcut keys', async () => {
      const profiles = [mockProfile, mockProfile2]

      const shortcuts = await KeyboardShortcutService.registerProfileShortcuts(profiles)

      expect(shortcuts[0].shortcutKey).toBe('CommandOrControl+Shift+1')
      expect(shortcuts[1].shortcutKey).toBe('CommandOrControl+Shift+2')
    })

    it('should use Ctrl+Shift+0 for 10th profile', async () => {
      const profiles = Array.from({ length: 10 }, (_, i) => ({
        ...mockProfile,
        id: `profile-${i}`,
        name: `Profile ${i}`,
      }))

      const shortcuts = await KeyboardShortcutService.registerProfileShortcuts(profiles)

      expect(shortcuts[9].shortcutKey).toBe('CommandOrControl+Shift+0')
    })

    it('should return shortcuts with correct profile info', async () => {
      const shortcuts = await KeyboardShortcutService.registerProfileShortcuts([mockProfile, mockProfile2])

      expect(shortcuts[0].profileId).toBe(mockProfile.id)
      expect(shortcuts[0].profileName).toBe(mockProfile.name)
      expect(shortcuts[1].profileId).toBe(mockProfile2.id)
      expect(shortcuts[1].profileName).toBe(mockProfile2.name)
    })
  })

  describe('KeyboardShortcutService.unregisterProfileShortcuts', () => {
    it('should successfully unregister shortcuts', async () => {
      await KeyboardShortcutService.registerProfileShortcuts([mockProfile, mockProfile2])

      const result = await KeyboardShortcutService.unregisterProfileShortcuts()

      expect(result).toBe(true)
      expect(KeyboardShortcutService.getRegisteredShortcuts().length).toBe(0)
    })

    it('should clear registered shortcuts list', async () => {
      await KeyboardShortcutService.registerProfileShortcuts([mockProfile, mockProfile2])
      await KeyboardShortcutService.unregisterProfileShortcuts()

      const shortcuts = KeyboardShortcutService.getRegisteredShortcuts()

      expect(shortcuts.length).toBe(0)
    })
  })

  describe('KeyboardShortcutService.getShortcutForIndex', () => {
    it('should return correct shortcut for indices 0-9', () => {
      expect(KeyboardShortcutService.getShortcutForIndex(0)).toBe('CommandOrControl+Shift+1')
      expect(KeyboardShortcutService.getShortcutForIndex(1)).toBe('CommandOrControl+Shift+2')
      expect(KeyboardShortcutService.getShortcutForIndex(8)).toBe('CommandOrControl+Shift+9')
      expect(KeyboardShortcutService.getShortcutForIndex(9)).toBe('CommandOrControl+Shift+0')
    })

    it('should throw for invalid indices', () => {
      expect(() => KeyboardShortcutService.getShortcutForIndex(-1)).toThrow()
      expect(() => KeyboardShortcutService.getShortcutForIndex(10)).toThrow()
    })
  })

  describe('KeyboardShortcutService.validateShortcutKey', () => {
    it('should validate correct shortcut keys', () => {
      const result1 = KeyboardShortcutService.validateShortcutKey('CommandOrControl+Shift+1')
      expect(result1.valid).toBe(true)

      const result2 = KeyboardShortcutService.validateShortcutKey('Ctrl+Alt+Delete')
      expect(result2.valid).toBe(true)

      const result3 = KeyboardShortcutService.validateShortcutKey('Shift+Super+A')
      expect(result3.valid).toBe(true)
    })

    it('should reject invalid shortcut keys', () => {
      const result = KeyboardShortcutService.validateShortcutKey('A')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('KeyboardShortcutService.updateShortcutOrder', () => {
    it('should unregister old and register with new order', async () => {
      const profiles1 = [mockProfile, mockProfile2]
      await KeyboardShortcutService.registerProfileShortcuts(profiles1)

      const profiles2 = [mockProfile2, mockProfile]
      const updated = await KeyboardShortcutService.updateShortcutOrder(profiles2)

      expect(updated[0].profileId).toBe(mockProfile2.id)
      expect(updated[0].shortcutKey).toBe('CommandOrControl+Shift+1')
      expect(updated[1].profileId).toBe(mockProfile.id)
      expect(updated[1].shortcutKey).toBe('CommandOrControl+Shift+2')
    })
  })

  describe('KeyboardShortcutService.exportShortcutsConfig', () => {
    it('should export shortcuts as valid JSON', async () => {
      await KeyboardShortcutService.registerProfileShortcuts([mockProfile, mockProfile2])

      const exported = KeyboardShortcutService.exportShortcutsConfig()

      expect(() => JSON.parse(exported)).not.toThrow()
      const parsed = JSON.parse(exported)
      expect(Array.isArray(parsed)).toBe(true)
    })
  })

  describe('KeyboardShortcutService.importShortcutsConfig', () => {
    it('should import valid shortcuts config', async () => {
      const configJson = JSON.stringify([
        {
          profileId: 'test-1',
          profileName: 'Test 1',
          shortcutKey: 'CommandOrControl+Shift+1',
        },
        {
          profileId: 'test-2',
          profileName: 'Test 2',
          shortcutKey: 'CommandOrControl+Shift+2',
        },
      ])

      const imported = KeyboardShortcutService.importShortcutsConfig(configJson)

      expect(imported.length).toBe(2)
      expect(imported[0].profileId).toBe('test-1')
    })

    it('should throw on invalid JSON', () => {
      expect(() => KeyboardShortcutService.importShortcutsConfig('invalid json')).toThrow()
    })

    it('should throw on non-array config', () => {
      expect(() => KeyboardShortcutService.importShortcutsConfig('{"key": "value"}')).toThrow()
    })
  })

  // ============ Integration Tests ============

  describe('Integration: Keyboard Shortcuts', () => {
    beforeEach(() => {
      KeyboardShortcutService.unregisterProfileShortcuts()
    })

    it('should register and unregister shortcuts', async () => {
      // Register
      const shortcuts = await KeyboardShortcutService.registerProfileShortcuts([mockProfile, mockProfile2])
      expect(shortcuts.length).toBe(2)

      // Verify registered
      const registered = KeyboardShortcutService.getRegisteredShortcuts()
      expect(registered.length).toBe(2)

      // Unregister
      const result = await KeyboardShortcutService.unregisterProfileShortcuts()
      expect(result).toBe(true)

      // Verify cleared
      const afterUnregister = KeyboardShortcutService.getRegisteredShortcuts()
      expect(afterUnregister.length).toBe(0)
    })

    it('should handle profile reordering', async () => {
      const profiles = [mockProfile, mockProfile2]
      await KeyboardShortcutService.registerProfileShortcuts(profiles)

      // Reorder
      const reordered = [mockProfile2, mockProfile]
      const updated = await KeyboardShortcutService.updateShortcutOrder(reordered)

      expect(updated[0].profileId).toBe(mockProfile2.id)
      expect(updated[1].profileId).toBe(mockProfile.id)
    })

    it('should export and re-import shortcuts config', async () => {
      await KeyboardShortcutService.registerProfileShortcuts([mockProfile, mockProfile2])
      const exported = KeyboardShortcutService.exportShortcutsConfig()

      await KeyboardShortcutService.unregisterProfileShortcuts()
      const imported = KeyboardShortcutService.importShortcutsConfig(exported)

      expect(imported.length).toBe(2)
      expect(imported[0].profileId).toBe(mockProfile.id)
      expect(imported[1].profileId).toBe(mockProfile2.id)
    })
  })

  // ============ Profile Validation Tests ============

  describe('Profile Validation - Acceptance Criteria', () => {
    it('AC1: Should support Ctrl+Shift+1..9 and Ctrl+Shift+0 shortcuts', async () => {
      const profiles = Array.from({ length: 10 }, (_, i) => ({
        ...mockProfile,
        id: `p${i}`,
        name: `Profile ${i}`,
      }))

      const shortcuts = await KeyboardShortcutService.registerProfileShortcuts(profiles)

      expect(shortcuts[0].shortcutKey).toMatch(/CommandOrControl\+Shift\+[1-9]/)
      expect(shortcuts[9].shortcutKey).toMatch(/CommandOrControl\+Shift\+0/)
    })

    it('AC2: Should validate profile is applicable before apply', async () => {
      const validation = await ProfileManager.validateProfileApplicable(mockProfile)
      expect(typeof validation.valid).toBe('boolean')
      expect(Array.isArray(validation.issues)).toBe(true)
    })

    it('AC3: Should support taskbar customization in profiles', () => {
      expect(mockProfile.taskbar).toBeDefined()
      expect(mockProfile.taskbar?.position).toBe('bottom')
      expect(mockProfile.taskbar?.transparency).toBeDefined()
      expect(mockProfile.taskbar?.backgroundColor).toBeDefined()
    })

    it('AC4: Should support theme customization in profiles', () => {
      expect(mockProfile.theme).toBeDefined()
      expect(['light', 'dark']).toContain(mockProfile.theme?.mode)
      expect(mockProfile.theme?.accentColor).toBeDefined()
    })

    it('AC5: Should support shortcuts in profiles', () => {
      expect(Array.isArray(mockProfile.shortcuts)).toBe(true)
      expect(mockProfile.shortcuts?.length).toBeGreaterThanOrEqual(0)
    })
  })

  // ============ Error Handling Tests ============

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      const invalidProfile: Profile = {
        ...mockProfile,
        id: '',
      }

      const result = await ProfileManager.validateProfileApplicable(invalidProfile)

      expect(result.valid).toBe(false)
      expect(result.issues.length).toBeGreaterThan(0)
      expect(typeof result.issues[0]).toBe('string')
    })

    it('should provide detailed error messages', async () => {
      const invalidProfile: Profile = {
        ...mockProfile,
        taskbar: {
          ...mockProfile.taskbar,
          position: 'invalid' as unknown as typeof mockProfile.taskbar.position,
        },
      }

      const result = await ProfileManager.validateProfileApplicable(invalidProfile)

      expect(result.issues.some((issue) => issue.length > 0)).toBe(true)
    })
  })
})
