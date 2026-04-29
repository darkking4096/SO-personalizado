/**
 * Registry Manager Service
 * Handles all Windows Registry operations for system customization
 *
 * Manages:
 * - Theme settings (Light/Dark)
 * - Wallpaper configuration
 * - Taskbar properties
 * - Accent colors
 * - Other Windows 11 personalization settings
 */

export interface RegistryEntry {
  hive: string
  path: string
  key: string
  value?: string | number | boolean
  type?: 'string' | 'dword' | 'binary'
}

export class RegistryManager {
  // Common Registry hive constants (used in implementations)
  // HKCU: 'HKEY_CURRENT_USER'
  // HKLM: 'HKEY_LOCAL_MACHINE'

  // Common Registry paths (used in implementations)
  // TODO: These will be used when implementing Registry read/write operations
  // PERSONALIZE: HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
  // THEMES: HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize
  // WALLPAPER: HKCU\Control Panel\Desktop
  // ACCENT_COLOR: HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Accent

  /**
   * Read a Registry value
   * @param hive Registry hive (HKCU, HKLM)
   * @param path Registry path
   * @param key Registry key name
   * @returns Value or null if not found
   */
  static async read(hive: string, path: string, key: string): Promise<unknown> {
    // TODO: Implement using node-ffi or windows-registry
    console.log(`[RegistryManager] Reading ${hive}\\${path}\\${key}`)
    return null
  }

  /**
   * Write a Registry value
   * @param hive Registry hive
   * @param path Registry path
   * @param key Registry key name
   * @param value Value to write
   * @param type Value type (string, dword, binary)
   * @returns Success status
   */
  static async write(
    hive: string,
    path: string,
    key: string,
    value: unknown,
    type = 'string'
  ): Promise<boolean> {
    // TODO: Implement using node-ffi or windows-registry
    console.log(`[RegistryManager] Writing ${hive}\\${path}\\${key} = ${value} (${type})`)
    return false
  }

  /**
   * Get theme setting (light/dark)
   * @returns 'light' | 'dark'
   */
  static async getTheme(): Promise<'light' | 'dark'> {
    // TODO: Implement reading from Themes\\Personalize\\AppsUseLightTheme
    console.log('[RegistryManager] Getting theme setting')
    return 'light'
  }

  /**
   * Set theme setting
   * @param theme 'light' or 'dark'
   * @returns Success status
   */
  static async setTheme(theme: 'light' | 'dark'): Promise<boolean> {
    // TODO: Implement writing to Themes\\Personalize
    console.log(`[RegistryManager] Setting theme to ${theme}`)
    return false
  }

  /**
   * Get accent color value
   * @returns Hex color string
   */
  static async getAccentColor(): Promise<string> {
    // TODO: Implement reading from Accent\\AccentColorSet
    console.log('[RegistryManager] Getting accent color')
    return '#0078D4'
  }

  /**
   * Set accent color
   * @param color Hex color string or Windows preset
   * @returns Success status
   */
  static async setAccentColor(color: string): Promise<boolean> {
    // TODO: Implement writing accent color
    console.log(`[RegistryManager] Setting accent color to ${color}`)
    return false
  }

  /**
   * Get taskbar position
   * Reads from HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3
   * @returns TaskbarPosition: 'bottom' | 'left' | 'right' | 'top'
   */
  static async getTaskbarPosition(): Promise<'bottom' | 'left' | 'right' | 'top'> {
    try {
      // Registry key path for taskbar properties (StuckRects3 contains binary data)
      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer'
      const key = 'StuckRects3'

      const value = await this.read(hive, path, key)

      if (!value || typeof value !== 'string') {
        console.warn('[RegistryManager] StuckRects3 not found, defaulting to bottom')
        return 'bottom'
      }

      // StuckRects3 is binary data - byte 12 encodes position
      // 0 = bottom, 1 = top, 2 = left, 3 = right
      const buffer = Buffer.from(value, 'hex')
      if (buffer.length < 13) {
        console.warn('[RegistryManager] StuckRects3 too short, defaulting to bottom')
        return 'bottom'
      }

      const positionByte = buffer[12]
      const positionMap: Record<number, 'bottom' | 'left' | 'right' | 'top'> = {
        0: 'bottom',
        1: 'top',
        2: 'left',
        3: 'right',
      }

      return positionMap[positionByte] || 'bottom'
    } catch (error) {
      console.error('[RegistryManager] Error reading taskbar position:', error)
      return 'bottom'
    }
  }

  /**
   * Set taskbar position
   * Writes to HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3
   * @param position Taskbar position: 'bottom' | 'left' | 'right' | 'top'
   * @returns Success status
   */
  static async setTaskbarPosition(position: 'bottom' | 'left' | 'right' | 'top'): Promise<boolean> {
    try {
      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer'
      const key = 'StuckRects3'

      // Read current value to modify
      const currentValue = await this.read(hive, path, key)

      if (!currentValue || typeof currentValue !== 'string') {
        console.error('[RegistryManager] Cannot read current StuckRects3 value')
        return false
      }

      // Convert hex string to buffer
      const buffer = Buffer.from(currentValue, 'hex')

      if (buffer.length < 13) {
        console.error('[RegistryManager] StuckRects3 buffer too short')
        return false
      }

      // Map position to byte value
      const positionByteMap: Record<string, number> = {
        bottom: 0,
        top: 1,
        left: 2,
        right: 3,
      }

      // Update byte 12 with new position
      buffer[12] = positionByteMap[position] || 0

      // Convert back to hex string
      const newValue = buffer.toString('hex')

      // Write back to registry
      const success = await this.write(hive, path, key, newValue, 'binary')

      if (success) {
        // Restart Explorer to apply changes
        await this.restartExplorer()
      }

      return success
    } catch (error) {
      console.error('[RegistryManager] Error setting taskbar position:', error)
      return false
    }
  }

  /**
   * Restart Windows Explorer to apply taskbar changes
   * @returns Success status
   */
  static async restartExplorer(): Promise<boolean> {
    try {
      // This would be implemented in the Electron main process
      // For now, log the command that should be run
      console.log('[RegistryManager] Restarting Explorer (taskkill /f /im explorer.exe && start explorer.exe)')

      // In production, this would use electron IPC to call main process
      // const result = await ipcRenderer.invoke('restart-explorer')
      // return result.success

      return true
    } catch (error) {
      console.error('[RegistryManager] Error restarting Explorer:', error)
      return false
    }
  }

  /**
   * Get taskbar property
   * @param property Property name (position, transparency, size, etc.)
   * @returns Property value
   */
  static async getTaskbarProperty(property: string): Promise<unknown> {
    if (property === 'position') {
      return this.getTaskbarPosition()
    }
    // TODO: Implement reading other taskbar properties from Personalize path
    console.log(`[RegistryManager] Getting taskbar property: ${property}`)
    return null
  }

  /**
   * Get taskbar transparency value (0-100)
   * Reads from HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
   * @returns Transparency value 0-100
   */
  static async getTaskbarTransparency(): Promise<number> {
    try {
      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
      const key = 'TaskbarTransparency'

      const value = await this.read(hive, path, key)

      if (value === null || value === undefined) {
        console.warn('[RegistryManager] TaskbarTransparency not found, defaulting to 0')
        return 0
      }

      const transparencyValue = parseInt(String(value), 10)
      return Math.min(100, Math.max(0, transparencyValue))
    } catch (error) {
      console.error('[RegistryManager] Error reading taskbar transparency:', error)
      return 0
    }
  }

  /**
   * Set taskbar transparency value (0-100)
   * Writes to HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
   * @param transparency Value 0-100
   * @returns Success status
   */
  static async setTaskbarTransparency(transparency: number): Promise<boolean> {
    try {
      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
      const key = 'TaskbarTransparency'

      const value = Math.min(100, Math.max(0, transparency))

      const success = await this.write(hive, path, key, value, 'dword')

      if (success) {
        await this.restartExplorer()
      }

      return success
    } catch (error) {
      console.error('[RegistryManager] Error setting taskbar transparency:', error)
      return false
    }
  }

  /**
   * Get taskbar background color (hex string)
   * Reads from HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
   * @returns Color value as hex string
   */
  static async getTaskbarColor(): Promise<string> {
    try {
      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
      const key = 'TaskbarColor'

      const value = await this.read(hive, path, key)

      if (value === null || value === undefined) {
        console.warn('[RegistryManager] TaskbarColor not found, defaulting to #000000')
        return '#000000'
      }

      const colorValue = String(value)

      // Convert BGR format to hex if needed
      if (colorValue.match(/^[0-9]{6,8}$/)) {
        const bgr = parseInt(colorValue, 16)
        const b = (bgr >> 16) & 0xff
        const g = (bgr >> 8) & 0xff
        const r = bgr & 0xff
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase()
      }

      return colorValue.startsWith('#') ? colorValue : `#${colorValue}`
    } catch (error) {
      console.error('[RegistryManager] Error reading taskbar color:', error)
      return '#000000'
    }
  }

  /**
   * Set taskbar background color (hex string)
   * Writes to HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
   * @param color Color value as hex string
   * @returns Success status
   */
  static async setTaskbarColor(color: string): Promise<boolean> {
    try {
      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
      const key = 'TaskbarColor'

      // Validate hex color format
      if (!color.match(/^#[0-9A-Fa-f]{6}$/)) {
        console.error('[RegistryManager] Invalid color format:', color)
        return false
      }

      // Convert hex to BGR format for Windows
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      const bgrValue = ((b << 16) | (g << 8) | r).toString(16).padStart(6, '0')

      const success = await this.write(hive, path, key, bgrValue, 'string')

      if (success) {
        await this.restartExplorer()
      }

      return success
    } catch (error) {
      console.error('[RegistryManager] Error setting taskbar color:', error)
      return false
    }
  }

  /**
   * Set taskbar property
   * @param property Property name
   * @param value New value
   * @returns Success status
   */
  static async setTaskbarProperty(property: string, value: unknown): Promise<boolean> {
    if (property === 'position' && typeof value === 'string') {
      return this.setTaskbarPosition(value as 'bottom' | 'left' | 'right' | 'top')
    }
    if (property === 'transparency' && typeof value === 'number') {
      return this.setTaskbarTransparency(value)
    }
    if (property === 'color' && typeof value === 'string') {
      return this.setTaskbarColor(value)
    }
    // TODO: Implement writing other taskbar properties
    console.log(`[RegistryManager] Setting taskbar ${property} = ${value}`)
    return false
  }

  /**
   * Taskbar item visibility mapping
   * Maps item names to Registry keys
   */
  private static readonly VISIBILITY_KEYS: Record<string, { key: string; defaultValue: number }> = {
    clock: { key: 'ShowSecondsInSystemClock', defaultValue: 0 },
    systemTray: { key: 'ShowSystemTray', defaultValue: 1 },
    search: { key: 'TaskbarSearchBoxMode', defaultValue: 2 },
    taskView: { key: 'ShowTaskViewButton', defaultValue: 1 },
    virtualDesktops: { key: 'VirtualDesktopTaskbarButton', defaultValue: 0 },
    copilot: { key: 'ShowCopilotButton', defaultValue: 0 },
    weather: { key: 'ShowWeatherButton', defaultValue: 0 },
    calendar: { key: 'ShowCalendarButton', defaultValue: 0 },
  }

  /**
   * Get item visibility status
   * @param itemName Item name (clock, copilot, etc.)
   * @returns Visibility status
   */
  static async getItemVisibility(itemName: string): Promise<boolean> {
    try {
      const itemKey = this.VISIBILITY_KEYS[itemName]
      if (!itemKey) {
        console.warn(`[RegistryManager] Unknown visibility item: ${itemName}`)
        return true // Default to visible
      }

      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
      const value = await this.read(hive, path, itemKey.key)

      if (value === null || value === undefined) {
        // Return default visibility for this item
        return itemKey.defaultValue !== 0
      }

      const numValue = parseInt(String(value), 10)
      return numValue !== 0
    } catch (error) {
      console.error(`[RegistryManager] Error reading visibility for ${itemName}:`, error)
      return true // Default to visible on error
    }
  }

  /**
   * Set item visibility status
   * @param itemName Item name (clock, copilot, etc.)
   * @param visible Visibility status
   * @returns Success status
   */
  static async setItemVisibility(itemName: string, visible: boolean): Promise<boolean> {
    try {
      const itemKey = this.VISIBILITY_KEYS[itemName]
      if (!itemKey) {
        console.error(`[RegistryManager] Unknown visibility item: ${itemName}`)
        return false
      }

      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
      const value = visible ? 1 : 0

      const success = await this.write(hive, path, itemKey.key, value, 'dword')

      if (success) {
        // Restart Explorer to apply visibility changes
        await this.restartExplorer()
      }

      return success
    } catch (error) {
      console.error(`[RegistryManager] Error setting visibility for ${itemName}:`, error)
      return false
    }
  }

  /**
   * Get all taskbar item visibility statuses
   * @returns Record of item name to visibility status
   */
  static async getAllItemVisibility(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    for (const itemName of Object.keys(this.VISIBILITY_KEYS)) {
      results[itemName] = await this.getItemVisibility(itemName)
    }

    return results
  }

  /**
   * Set multiple item visibilities at once
   * @param items Record of item name to visibility status
   * @returns Success status
   */
  static async setMultipleItemVisibility(items: Record<string, boolean>): Promise<boolean> {
    try {
      let allSuccess = true

      for (const [itemName, visible] of Object.entries(items)) {
        const success = await this.setItemVisibility(itemName, visible)
        allSuccess = allSuccess && success
      }

      return allSuccess
    } catch (error) {
      console.error('[RegistryManager] Error setting multiple visibilities:', error)
      return false
    }
  }

  /**
   * Create Registry backup (for rollback)
   * @returns Backup identifier
   */
  static async createBackup(): Promise<string> {
    // TODO: Implement Registry backup for atomic operations
    console.log('[RegistryManager] Creating Registry backup')
    return `backup-${Date.now()}`
  }

  /**
   * Restore from Registry backup
   * @param backupId Backup identifier
   * @returns Success status
   */
  static async restoreBackup(backupId: string): Promise<boolean> {
    // TODO: Implement Registry restoration
    console.log(`[RegistryManager] Restoring from backup: ${backupId}`)
    return false
  }

  /**
   * Get taskbar size (preset or custom in pixels)
   * Reads from HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
   * @returns Size value: 'small' (32px), 'default' (48px), 'large' (64px), or custom number
   */
  static async getTaskbarSize(): Promise<'small' | 'default' | 'large' | number> {
    try {
      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
      const key = 'TaskbarSize'

      const value = await this.read(hive, path, key)

      if (value === null || value === undefined) {
        console.warn('[RegistryManager] TaskbarSize not found, defaulting to default')
        return 'default'
      }

      const sizeValue = String(value)

      // Map preset sizes
      const presetMap: Record<string, 'small' | 'default' | 'large'> = {
        'small': 'small',
        'default': 'default',
        'large': 'large',
        '32': 'small',
        '48': 'default',
        '64': 'large',
      }

      if (presetMap[sizeValue]) {
        return presetMap[sizeValue]
      }

      // Try parsing as number (custom size in pixels)
      const numValue = parseInt(sizeValue, 10)
      if (!isNaN(numValue) && numValue >= 16 && numValue <= 256) {
        return numValue
      }

      return 'default'
    } catch (error) {
      console.error('[RegistryManager] Error reading taskbar size:', error)
      return 'default'
    }
  }

  /**
   * Set taskbar size (preset or custom in pixels)
   * Writes to HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
   * @param size Size preset ('small'=32px, 'default'=48px, 'large'=64px) or custom pixel value
   * @returns Success status
   */
  static async setTaskbarSize(size: 'small' | 'default' | 'large' | number): Promise<boolean> {
    try {
      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
      const key = 'TaskbarSize'

      // Map preset sizes to pixel values
      const sizeMap: Record<string, number> = {
        'small': 32,
        'default': 48,
        'large': 64,
      }

      const pixelValue = typeof size === 'string' ? sizeMap[size] : Math.min(256, Math.max(16, size))

      const success = await this.write(hive, path, key, pixelValue, 'dword')

      if (success) {
        await this.restartExplorer()
      }

      return success
    } catch (error) {
      console.error('[RegistryManager] Error setting taskbar size:', error)
      return false
    }
  }

  /**
   * Get auto-hide status
   * Reads from HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
   * @returns Auto-hide enabled status
   */
  static async getAutoHideStatus(): Promise<boolean> {
    try {
      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
      const key = 'AutoHide'

      const value = await this.read(hive, path, key)

      if (value === null || value === undefined) {
        console.warn('[RegistryManager] AutoHide not found, defaulting to false')
        return false
      }

      const autoHideValue = parseInt(String(value), 10)
      return autoHideValue === 1
    } catch (error) {
      console.error('[RegistryManager] Error reading auto-hide status:', error)
      return false
    }
  }

  /**
   * Set auto-hide status
   * Writes to HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
   * @param enabled Auto-hide enabled status
   * @returns Success status
   */
  static async setAutoHide(enabled: boolean): Promise<boolean> {
    try {
      const hive = 'HKEY_CURRENT_USER'
      const path = 'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
      const key = 'AutoHide'

      const value = enabled ? 1 : 0
      const success = await this.write(hive, path, key, value, 'dword')

      if (success) {
        await this.restartExplorer()
      }

      return success
    } catch (error) {
      console.error('[RegistryManager] Error setting auto-hide:', error)
      return false
    }
  }
}
