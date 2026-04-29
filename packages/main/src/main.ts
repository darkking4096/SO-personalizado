import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import { setupIpcHandlers } from './ipc/handlers'
import { ProfileManager } from '../../renderer/src/services/profileManager'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built resources dir when using asar.
const resources = app.isPackaged
  ? path.join(process.resourcesPath, 'app.asar.unpacked')
  : path.join(__dirname, '../../..')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const isDev = !app.isPackaged
  const url = isDev ? 'http://localhost:5173' : `file://${path.join(resources, 'dist/index.html')}`

  mainWindow.loadURL(url)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  return mainWindow
}

/**
 * Apply default profile on startup (unless Shift is held)
 * Called from renderer after it detects Shift key state
 */
async function applyDefaultProfileOnStartup(): Promise<void> {
  try {
    const defaultProfileId = await ProfileManager.getDefaultProfile()
    if (!defaultProfileId) {
      console.log('[Main] No default profile set, skipping auto-apply')
      return
    }

    console.log(`[Main] Applying default profile on startup: ${defaultProfileId}`)
    const result = await ProfileManager.applyProfile(defaultProfileId)

    if (result.success) {
      console.log('[Main] Default profile applied successfully on startup')
    } else {
      console.error(`[Main] Failed to apply default profile: ${result.error}`)
    }
  } catch (error) {
    console.error('[Main] Error applying default profile on startup:', error)
  }
}

// App event listeners
app.on('ready', () => {
  createWindow()
  setupIpcHandlers()

  // Setup IPC handler for startup auto-apply (called from renderer)
  ipcMain.handle('app:apply-default-on-startup', async () => {
    await applyDefaultProfileOnStartup()
    return { success: true }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Prevent multiple instances on Windows
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

export {}
