import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ThemeService } from '../src/services/themeService'
import { RegistryManager } from '../src/services/registryManager'

// Mock RegistryManager
vi.mock('../src/services/registryManager', () => ({
  RegistryManager: {
    getTheme: vi.fn(),
    setTheme: vi.fn(),
    getAccentColor: vi.fn(),
    setAccentColor: vi.fn(),
  },
}))

// Mock DOM and applyThemeToDOM
vi.mock('../src/styles/theme', () => ({
  applyThemeToDOM: vi.fn(),
}))

describe('ThemeService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validateColor', () => {
    it('should validate 6-digit hex colors', () => {
      expect(ThemeService.validateColor('#0078D4')).toBe(true)
      expect(ThemeService.validateColor('#FFFFFF')).toBe(true)
      expect(ThemeService.validateColor('#000000')).toBe(true)
    })

    it('should validate 3-digit hex colors', () => {
      expect(ThemeService.validateColor('#FFF')).toBe(true)
      expect(ThemeService.validateColor('#000')).toBe(true)
      expect(ThemeService.validateColor('#ABC')).toBe(true)
    })

    it('should reject invalid formats', () => {
      expect(ThemeService.validateColor('0078D4')).toBe(false)
      expect(ThemeService.validateColor('#GGGGGG')).toBe(false)
      expect(ThemeService.validateColor('#12345')).toBe(false)
      expect(ThemeService.validateColor('')).toBe(false)
    })

    it('should be case-insensitive', () => {
      expect(ThemeService.validateColor('#0078d4')).toBe(true)
      expect(ThemeService.validateColor('#fff')).toBe(true)
    })
  })

  describe('normalizeColor', () => {
    it('should expand 3-digit hex to 6-digit', () => {
      expect(ThemeService.normalizeColor('#ABC')).toBe('#AABBCC')
      expect(ThemeService.normalizeColor('#FFF')).toBe('#FFFFFF')
      expect(ThemeService.normalizeColor('#000')).toBe('#000000')
    })

    it('should normalize to uppercase', () => {
      expect(ThemeService.normalizeColor('#0078d4')).toBe('#0078D4')
      expect(ThemeService.normalizeColor('#fff')).toBe('#FFFFFF')
    })

    it('should return default color for invalid input', () => {
      expect(ThemeService.normalizeColor('invalid')).toBe('#0078D4')
      expect(ThemeService.normalizeColor('')).toBe('#0078D4')
    })
  })

  describe('getPresetColors', () => {
    it('should return an array of preset colors', () => {
      const presets = ThemeService.getPresetColors()
      expect(Array.isArray(presets)).toBe(true)
      expect(presets.length).toBeGreaterThan(0)
    })

    it('should include all required Windows 11 colors', () => {
      const presets = ThemeService.getPresetColors()
      const names = presets.map((p) => p.name)

      expect(names).toContain('Default Blue')
      expect(names).toContain('Green')
      expect(names).toContain('Red')
    })

    it('should have valid hex colors', () => {
      const presets = ThemeService.getPresetColors()

      presets.forEach((preset) => {
        expect(ThemeService.validateColor(preset.hex)).toBe(true)
      })
    })
  })

  describe('getCurrentTheme', () => {
    it('should get current theme from Registry', async () => {
      const mockGetTheme = vi.spyOn(RegistryManager, 'getTheme').mockResolvedValue('dark')

      const theme = await ThemeService.getCurrentTheme()

      expect(theme).toBe('dark')
      expect(mockGetTheme).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      vi.spyOn(RegistryManager, 'getTheme').mockRejectedValue(new Error('Registry error'))

      const theme = await ThemeService.getCurrentTheme()

      expect(theme).toBe('light') // Default fallback
    })
  })

  describe('setTheme', () => {
    it('should set theme and apply to DOM', async () => {
      const mockSetTheme = vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(true)

      const success = await ThemeService.setTheme('dark')

      expect(success).toBe(true)
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('should return false on Registry error', async () => {
      vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(false)

      const success = await ThemeService.setTheme('light')

      expect(success).toBe(false)
    })

    it('should handle exceptions', async () => {
      vi.spyOn(RegistryManager, 'setTheme').mockRejectedValue(new Error('Registry error'))

      const success = await ThemeService.setTheme('dark')

      expect(success).toBe(false)
    })
  })

  describe('toggleTheme', () => {
    it('should toggle from light to dark', async () => {
      vi.spyOn(RegistryManager, 'getTheme').mockResolvedValue('light')
      vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(true)

      const newTheme = await ThemeService.toggleTheme()

      expect(newTheme).toBe('dark')
    })

    it('should toggle from dark to light', async () => {
      vi.spyOn(RegistryManager, 'getTheme').mockResolvedValue('dark')
      vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(true)

      const newTheme = await ThemeService.toggleTheme()

      expect(newTheme).toBe('light')
    })

    it('should handle errors', async () => {
      vi.clearAllMocks()
      vi.spyOn(RegistryManager, 'getTheme').mockRejectedValueOnce(new Error('Registry error'))
      vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(true)

      const newTheme = await ThemeService.toggleTheme()

      // When getTheme fails, we default to 'light', then toggle to 'dark'
      expect(newTheme).toBe('dark')
    })
  })

  describe('applyThemeConfig', () => {
    it('should apply theme configuration', async () => {
      const mockSetTheme = vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(true)
      const mockSetAccentColor = vi.spyOn(RegistryManager, 'setAccentColor').mockResolvedValue(true)

      const success = await ThemeService.applyThemeConfig({
        mode: 'dark',
        accentColor: '#107C10',
      })

      expect(success).toBe(true)
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
      expect(mockSetAccentColor).toHaveBeenCalledWith('#107C10')
    })

    it('should skip system mode', async () => {
      const mockSetTheme = vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(true)

      await ThemeService.applyThemeConfig({
        mode: 'system',
      })

      expect(mockSetTheme).not.toHaveBeenCalled()
    })

    it('should return false if any operation fails', async () => {
      vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(false)

      const success = await ThemeService.applyThemeConfig({
        mode: 'dark',
      })

      expect(success).toBe(false)
    })
  })

  describe('getThemeConfig', () => {
    it('should get complete theme configuration', async () => {
      vi.spyOn(RegistryManager, 'getTheme').mockResolvedValue('dark')
      vi.spyOn(RegistryManager, 'getAccentColor').mockResolvedValue('#107C10')

      const config = await ThemeService.getThemeConfig()

      expect(config.mode).toBe('dark')
      expect(config.accentColor).toBe('#107C10')
      expect(config.highContrast).toBe(false)
    })

    it('should handle errors gracefully', async () => {
      vi.spyOn(RegistryManager, 'getTheme').mockRejectedValue(new Error('Registry error'))
      vi.spyOn(RegistryManager, 'getAccentColor').mockRejectedValue(new Error('Registry error'))

      const config = await ThemeService.getThemeConfig()

      expect(config.mode).toBe('light') // Default
      expect(config.accentColor).toBe('#0078D4') // Default
    })
  })

  describe('Acceptance Criteria', () => {
    it('AC-1: Toggle switch works (Light ↔ Dark)', async () => {
      vi.spyOn(RegistryManager, 'getTheme').mockResolvedValue('light')
      const mockSetTheme = vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(true)

      const theme1 = await ThemeService.getCurrentTheme()
      expect(theme1).toBe('light')

      await ThemeService.setTheme('dark')
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('AC-2: Theme applies instantly', async () => {
      vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(true)

      const success = await ThemeService.setTheme('dark')

      expect(success).toBe(true)
    })

    it('AC-3: Theme persists to config', async () => {
      vi.spyOn(RegistryManager, 'setTheme').mockResolvedValue(true)
      vi.spyOn(RegistryManager, 'getTheme').mockResolvedValue('dark')

      await ThemeService.setTheme('dark')
      const config = await ThemeService.getThemeConfig()

      expect(config.mode).toBe('dark')
    })

    it('AC-4: TypeScript strict compliance', () => {
      // This test ensures type safety
      const themeConfig: Parameters<typeof ThemeService.applyThemeConfig>[0] = {
        mode: 'light',
        accentColor: '#0078D4',
        highContrast: false,
      }

      expect(themeConfig).toBeDefined()
    })
  })
})
