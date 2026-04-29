/**
 * Keyboard Shortcut Service
 * Handles profile keyboard shortcuts (Ctrl+Shift+1..0 for top 10 profiles)
 *
 * Uses Electron's globalShortcut API for system-wide shortcuts
 * Shortcuts are registered in the main process via IPC
 */

import type { Profile } from '../types/index'

export interface ShortcutConfig {
  profileId: string
  profileName: string
  shortcutKey: string
}

/**
 * Keyboard Shortcut Service - Manages profile shortcuts
 * Note: Registration/unregistration happens via IPC to main process (Electron globalShortcut)
 */
export class KeyboardShortcutService {
  private static registeredShortcuts: ShortcutConfig[] = []

  /**
   * Generate shortcut key for profile at index
   * Ctrl+Shift+1..9, Ctrl+Shift+0 for the 10th
   * @param index Profile index (0-9)
   * @returns Shortcut key string
   */
  static getShortcutForIndex(index: number): string {
    if (index < 0 || index > 9) {
      throw new Error('Profile index must be between 0 and 9')
    }
    const key = index === 9 ? '0' : String(index + 1)
    return `CommandOrControl+Shift+${key}`
  }

  /**
   * Register keyboard shortcuts for top 10 profiles
   * @param profiles Array of profiles (will register top 10)
   * @param _onShortcutPressed Callback when shortcut is pressed (reserved for IPC integration)
   * @returns Array of registered shortcuts
   */
  static async registerProfileShortcuts(
    profiles: Profile[],
    _onShortcutPressed?: (profileId: string, profileName: string) => void
  ): Promise<ShortcutConfig[]> {
    try {
      // Clear previous shortcuts
      this.registeredShortcuts = []

      // Register top 10 profiles
      const topProfiles = profiles.slice(0, 10)

      for (let i = 0; i < topProfiles.length; i++) {
        const profile = topProfiles[i]
        const shortcutKey = this.getShortcutForIndex(i)

        const config: ShortcutConfig = {
          profileId: profile.id,
          profileName: profile.name,
          shortcutKey,
        }

        this.registeredShortcuts.push(config)

        // TODO: Call IPC to main process to register shortcut
        // Example: ipcRenderer.invoke('register-shortcut', {
        //   shortcutKey,
        //   profileId: profile.id,
        //   callback: onShortcutPressed
        // })

        console.log(`[KeyboardShortcutService] Registered shortcut: ${shortcutKey} → ${profile.name}`)
      }

      return this.registeredShortcuts
    } catch (error) {
      console.error(`Failed to register profile shortcuts: ${(error as Error).message}`)
      throw error
    }
  }

  /**
   * Unregister all profile keyboard shortcuts
   * @returns Success status
   */
  static async unregisterProfileShortcuts(): Promise<boolean> {
    try {
      // TODO: Call IPC to main process to unregister all shortcuts
      // Example: ipcRenderer.invoke('unregister-all-shortcuts')

      for (const config of this.registeredShortcuts) {
        console.log(`[KeyboardShortcutService] Unregistered shortcut: ${config.shortcutKey}`)
      }

      this.registeredShortcuts = []
      return true
    } catch (error) {
      console.error(`Failed to unregister profile shortcuts: ${(error as Error).message}`)
      return false
    }
  }

  /**
   * Get registered shortcuts
   * @returns Array of registered shortcut configurations
   */
  static getRegisteredShortcuts(): ShortcutConfig[] {
    return [...this.registeredShortcuts]
  }

  /**
   * Update shortcut order when profiles are reordered
   * @param profiles Reordered profiles list
   * @returns Updated shortcuts
   */
  static async updateShortcutOrder(profiles: Profile[]): Promise<ShortcutConfig[]> {
    try {
      // Unregister old shortcuts
      await this.unregisterProfileShortcuts()

      // Re-register with new order
      return await this.registerProfileShortcuts(profiles)
    } catch (error) {
      console.error(`Failed to update shortcut order: ${(error as Error).message}`)
      throw error
    }
  }

  /**
   * Validate shortcut key format
   * @param shortcutKey Shortcut key string
   * @returns Validation result
   */
  static validateShortcutKey(shortcutKey: string): { valid: boolean; error?: string } {
    const validPattern = /^(CommandOrControl|Ctrl|Shift|Alt|Super)\+/
    if (!validPattern.test(shortcutKey)) {
      return { valid: false, error: 'Shortcut key must start with a modifier (CommandOrControl, Shift, Alt, etc.)' }
    }
    return { valid: true }
  }

  /**
   * Export shortcuts configuration
   * @returns Shortcuts as JSON
   */
  static exportShortcutsConfig(): string {
    return JSON.stringify(this.registeredShortcuts, null, 2)
  }

  /**
   * Import shortcuts configuration
   * @param configJson Shortcuts configuration as JSON
   * @returns Imported shortcuts
   */
  static importShortcutsConfig(configJson: string): ShortcutConfig[] {
    try {
      const config = JSON.parse(configJson) as ShortcutConfig[]
      // Validate imported config
      if (!Array.isArray(config)) {
        throw new Error('Invalid shortcuts configuration format')
      }
      this.registeredShortcuts = config
      console.log(`[KeyboardShortcutService] Imported ${config.length} shortcuts`)
      return config
    } catch (error) {
      console.error(`Failed to import shortcuts config: ${(error as Error).message}`)
      throw error
    }
  }
}
