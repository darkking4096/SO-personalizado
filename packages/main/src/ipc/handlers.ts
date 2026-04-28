import { ipcMain, app } from 'electron'
import { IPC_CHANNELS } from './channels.js'

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

  // Profile Service Handlers (stub)
  ipcMain.handle(IPC_CHANNELS.PROFILE_SAVE, async (_event, profile: unknown) => {
    // TODO: Implement profile saving to JSON
    console.log('[IPC] Saving profile', profile)
    return { success: true, id: 'profile-1' }
  })

  ipcMain.handle(IPC_CHANNELS.PROFILE_LOAD, async (_event, id: string) => {
    // TODO: Implement profile loading from JSON
    console.log(`[IPC] Loading profile: ${id}`)
    return { id, name: 'Default' }
  })

  ipcMain.handle(IPC_CHANNELS.PROFILE_LIST, async () => {
    // TODO: Implement profile listing
    console.log('[IPC] Listing profiles')
    return { profiles: [] }
  })

  ipcMain.handle(IPC_CHANNELS.PROFILE_DELETE, async (_event, id: string) => {
    // TODO: Implement profile deletion
    console.log(`[IPC] Deleting profile: ${id}`)
    return { success: true }
  })

  ipcMain.handle(IPC_CHANNELS.PROFILE_APPLY, async (_event, id: string) => {
    // TODO: Implement profile application
    console.log(`[IPC] Applying profile: ${id}`)
    return { success: true }
  })

  ipcMain.handle(IPC_CHANNELS.PROFILE_SET_DEFAULT, async (_event, id: string) => {
    // TODO: Implement default profile setting
    console.log(`[IPC] Setting default profile: ${id}`)
    return { success: true }
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
