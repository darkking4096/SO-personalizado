/**
 * Theme Service
 * Handles Windows 11 light/dark theme switching and accent color configuration
 */

import { RegistryManager } from './registryManager'
import { applyThemeToDOM } from '../styles/theme'

export type ThemeMode = 'light' | 'dark' | 'system'
export type AccentColor = string // Hex color

export interface ThemeConfig {
  mode: ThemeMode
  accentColor?: AccentColor
  highContrast?: boolean
}

export class ThemeService {
  /**
   * Get current theme mode from Windows Registry
   * Reads from HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize\AppsUseLightTheme
   * @returns 'light' | 'dark'
   */
  static async getCurrentTheme(): Promise<'light' | 'dark'> {
    try {
      const theme = await RegistryManager.getTheme()
      return theme
    } catch (error) {
      console.error('[ThemeService] Error getting theme:', error)
      return 'light'
    }
  }

  /**
   * Set theme mode in Windows Registry and apply to app
   * Writes to HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize\AppsUseLightTheme
   * @param mode Theme mode
   * @returns Success status
   */
  static async setTheme(mode: 'light' | 'dark'): Promise<boolean> {
    try {
      // Apply to Windows Registry
      const registrySuccess = await RegistryManager.setTheme(mode)

      // Apply to React UI (immediate visual feedback)
      applyThemeToDOM(mode)

      console.log(`[ThemeService] Theme set to ${mode} (Registry: ${registrySuccess})`)
      return registrySuccess
    } catch (error) {
      console.error('[ThemeService] Error setting theme:', error)
      return false
    }
  }

  /**
   * Get current accent color from Windows Registry
   * Reads from HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Accent\AccentColorSet
   * @returns Hex color string
   */
  static async getAccentColor(): Promise<AccentColor> {
    try {
      const color = await RegistryManager.getAccentColor()
      return color
    } catch (error) {
      console.error('[ThemeService] Error getting accent color:', error)
      return '#0078D4'
    }
  }

  /**
   * Set accent color in Windows Registry and apply to app
   * Writes to HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Accent\AccentColorSet
   * @param color Hex color string
   * @returns Success status
   */
  static async setAccentColor(color: AccentColor): Promise<boolean> {
    try {
      // Validate hex color format
      if (!this.validateColor(color)) {
        console.error('[ThemeService] Invalid color format:', color)
        return false
      }

      // Apply to Windows Registry
      const registrySuccess = await RegistryManager.setAccentColor(color)

      // Apply to React UI via CSS variables
      applyThemeToDOM('light', color)

      console.log(`[ThemeService] Accent color set to ${color} (Registry: ${registrySuccess})`)
      return registrySuccess
    } catch (error) {
      console.error('[ThemeService] Error setting accent color:', error)
      return false
    }
  }

  /**
   * Validate hex color format (#RGB or #RRGGBB)
   * @param color Color string to validate
   * @returns True if valid hex color
   */
  static validateColor(color: string): boolean {
    // Accept #RGB and #RRGGBB formats
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color)
  }

  /**
   * Normalize color to #RRGGBB format
   * @param color Color in #RGB or #RRGGBB format
   * @returns Normalized color in #RRGGBB format
   */
  static normalizeColor(color: string): string {
    if (!this.validateColor(color)) {
      return '#0078D4' // Default fallback
    }

    if (color.length === 4) {
      // #RGB → #RRGGBB
      const r = color[1]
      const g = color[2]
      const b = color[3]
      return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
    }

    return color.toUpperCase()
  }

  /**
   * Get Windows 11 preset colors
   * @returns List of available preset accent colors
   */
  static getPresetColors(): Array<{ name: string; hex: string }> {
    return [
      { name: 'Default Blue', hex: '#0078D4' },
      { name: 'Green', hex: '#107C10' },
      { name: 'Red', hex: '#DA3B01' },
      { name: 'Purple', hex: '#8661C5' },
      { name: 'Pink', hex: '#E81123' },
      { name: 'Cyan', hex: '#00B4EF' },
    ]
  }

  /**
   * Toggle between light and dark theme
   * @returns New theme mode
   */
  static async toggleTheme(): Promise<'light' | 'dark'> {
    try {
      const current = await this.getCurrentTheme()
      const next = current === 'light' ? 'dark' : 'light'
      const success = await this.setTheme(next)

      console.log(`[ThemeService] Toggled theme: ${current} -> ${next} (success: ${success})`)
      return next
    } catch (error) {
      console.error('[ThemeService] Error toggling theme:', error)
      return 'light'
    }
  }

  /**
   * Apply complete theme configuration atomically
   * @param config Theme configuration
   * @returns Success status
   */
  static async applyThemeConfig(config: ThemeConfig): Promise<boolean> {
    try {
      let allSuccess = true

      // Apply theme mode
      if (config.mode && config.mode !== 'system') {
        const themeSuccess = await this.setTheme(config.mode)
        allSuccess = allSuccess && themeSuccess
      }

      // Apply accent color
      if (config.accentColor) {
        const colorSuccess = await this.setAccentColor(config.accentColor)
        allSuccess = allSuccess && colorSuccess
      }

      console.log('[ThemeService] Applied theme configuration:', {
        config,
        success: allSuccess,
      })
      return allSuccess
    } catch (error) {
      console.error('[ThemeService] Error applying theme config:', error)
      return false
    }
  }

  /**
   * Get current theme configuration
   * @returns Complete theme configuration
   */
  static async getThemeConfig(): Promise<ThemeConfig> {
    try {
      const theme = await this.getCurrentTheme()
      const accentColor = await this.getAccentColor()

      return {
        mode: theme,
        accentColor,
        highContrast: false,
      }
    } catch (error) {
      console.error('[ThemeService] Error getting theme config:', error)
      return {
        mode: 'light',
        accentColor: '#0078D4',
        highContrast: false,
      }
    }
  }

  /**
   * Initialize theme on app startup
   * Applies stored theme configuration to DOM
   */
  static async initializeTheme(): Promise<void> {
    try {
      const config = await this.getThemeConfig()
      const modeToApply = config.mode === 'system' ? 'light' : config.mode

      applyThemeToDOM(modeToApply, config.accentColor)
      console.log('[ThemeService] Theme initialized:', config)
    } catch (error) {
      console.error('[ThemeService] Error initializing theme:', error)
      // Fallback to light theme
      applyThemeToDOM('light')
    }
  }
}
