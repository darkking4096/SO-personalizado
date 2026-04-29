import { ipcMain, app } from 'electron'
import { IPC_CHANNELS } from './channels.js'
import { ProfileManager } from '@shared/services/profileManager.js'
import type { Profile } from '@shared/types/index.js'

/**
 * Setup all IPC handlers for main process
 * Each handler maps to a service implementation
 */
export function setupIpcHandlers() {
  // Wallpaper Service Handlers (stub)
  ipcMain.handle(IPC_CHANNELS.WALLPAPER_SET, async (_event, path: string) => {
    // TODO: Implement wallpaper setting via Windows API
    console.log(`[IPC] Setting wallpaper: ${path}`)
    return { success: true, message: 'Wallpaper set' }
  })

  ipcMain.handle(IPC_CHANNELS.WALLPAPER_GET, async () => {
    // TODO: Implement wallpaper retrieval via Registry
    console.log('[IPC] Getting current wallpaper')
    return { path: '' }
  })

  ipcMain.handle(IPC_CHANNELS.WALLPAPER_SCHEDULE, async (_event, schedule: unknown) => {
    // TODO: Implement wallpaper scheduling
    console.log('[IPC] Scheduling wallpaper rotation', schedule)
    return { success: true }
  })

  // Theme Service Handlers (stub)
  ipcMain.handle(IPC_CHANNELS.THEME_SET, async (_event, theme: string) => {
    // TODO: Implement theme setting via Registry
    console.log(`[IPC] Setting theme: ${theme}`)
    return { success: true }
  })

  ipcMain.handle(IPC_CHANNELS.THEME_GET, async () => {
    // TODO: Implement theme retrieval
    console.log('[IPC] Getting current theme')
    return { theme: 'light' }
  })

  // Taskbar Service Handlers (stub)
  ipcMain.handle(IPC_CHANNELS.TASKBAR_SET, async (_event, config: unknown) => {
    // TODO: Implement taskbar configuration via Registry/UWP API
    console.log('[IPC] Setting taskbar config', config)
    return { success: true }
  })

  ipcMain.handle(IPC_CHANNELS.TASKBAR_GET, async () => {
    // TODO: Implement taskbar config retrieval
    console.log('[IPC] Getting taskbar config')
    return { position: 'bottom', transparency: false }
  })

  // Keyboard Service Handlers (stub)
  ipcMain.handle(IPC_CHANNELS.KEYBOARD_LIST, async () => {
    // TODO: Implement keyboard shortcuts listing via Registry
    console.log('[IPC] Listing keyboard shortcuts')
    return { shortcuts: [] }
  })

  ipcMain.handle(IPC_CHANNELS.KEYBOARD_SEARCH, async (_event, query: string) => {
    // TODO: Implement keyboard shortcuts search
    console.log(`[IPC] Searching keyboard shortcuts: ${query}`)
    return { results: [] }
  })

  // Profile Service Handlers
  ipcMain.handle(IPC_CHANNELS.PROFILE_SAVE, async (_event, profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const savedProfile = await ProfileManager.saveProfile(profile)
      return { success: true, data: savedProfile }
    } catch (error) {
      console.error('[IPC] Profile save error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle(IPC_CHANNELS.PROFILE_LOAD, async (_event, id: string) => {
    try {
      const profile = await ProfileManager.loadProfile(id)
      if (!profile) {
        return { success: false, error: 'Profile not found' }
      }
      return { success: true, data: profile }
    } catch (error) {
      console.error('[IPC] Profile load error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle(IPC_CHANNELS.PROFILE_LIST, async () => {
    try {
      const profiles = await ProfileManager.listProfiles()
      return { success: true, data: profiles }
    } catch (error) {
      console.error('[IPC] Profile list error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle(IPC_CHANNELS.PROFILE_DELETE, async (_event, id: string) => {
    try {
      const success = await ProfileManager.deleteProfile(id)
      return { success }
    } catch (error) {
      console.error('[IPC] Profile delete error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle(IPC_CHANNELS.PROFILE_APPLY, async (_event, id: string) => {
    try {
      const result = await ProfileManager.applyProfile(id)
      return { success: result.success, data: result }
    } catch (error) {
      console.error('[IPC] Profile apply error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle(IPC_CHANNELS.PROFILE_SET_DEFAULT, async (_event, id: string) => {
    try {
      const success = await ProfileManager.setAsDefault(id)
      return { success }
    } catch (error) {
      console.error('[IPC] Profile set default error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // Registry Service Handlers (stub)
  ipcMain.handle(IPC_CHANNELS.REGISTRY_READ, async (_event, key: string) => {
    // TODO: Implement Registry reading
    console.log(`[IPC] Reading Registry: ${key}`)
    return { value: '' }
  })

  ipcMain.handle(IPC_CHANNELS.REGISTRY_WRITE, async (_event, key: string, value: unknown) => {
    // TODO: Implement Registry writing
    console.log(`[IPC] Writing Registry: ${key} = ${value}`)
    return { success: true }
  })

  // App Service Handlers
  ipcMain.handle(IPC_CHANNELS.APP_GET_VERSION, async () => {
    return { version: app.getVersion() }
  })

  ipcMain.handle(IPC_CHANNELS.APP_OPEN_DEVTOOLS, async () => {
    // Only in development
    console.log('[IPC] Opening DevTools')
    return { success: true }
  })
}
