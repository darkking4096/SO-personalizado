import { useEffect, useState } from 'react'
import { useAppStore } from './stores/appStore'
import Sidebar from './components/Sidebar'
import MainPanel from './components/MainPanel'
import './styles/index.css'

export default function App() {
  const [, setIsDark] = useState(false)
  const theme = useAppStore((state) => state.theme)
  const setVersion = useAppStore((state) => state.setVersion)

  useEffect(() => {
    // Get app version from main process
    const getVersion = async () => {
      try {
        const result = await window.electron.invoke('app:get-version')
        if (result && typeof result === 'object' && 'version' in result) {
          setVersion((result as { version: string }).version)
        }
      } catch (error) {
        console.error('Failed to get version:', error)
      }
    }

    getVersion()
  }, [setVersion])

  useEffect(() => {
    // Apply default profile on startup (unless Shift is held)
    const applyDefaultOnStartup = async () => {
      try {
        // Check if Shift key was held during startup
        // If Shift was held, skip auto-apply (shift key detection happens here)
        const isShiftHeld = localStorage.getItem('startup_skip_apply') === 'true'
        localStorage.removeItem('startup_skip_apply')

        if (isShiftHeld) {
          console.log('[App] Shift held during startup, skipping default profile auto-apply')
          return
        }

        // Request main process to apply default profile
        const result = await window.electron.invoke('app:apply-default-on-startup')
        if (result && typeof result === 'object' && 'success' in result) {
          console.log('[App] Default profile auto-apply completed')
        }
      } catch (error) {
        console.error('[App] Failed to apply default profile on startup:', error)
      }
    }

    applyDefaultOnStartup()
  }, [])

  useEffect(() => {
    // Apply theme to document
    const isDarkMode = theme.mode === 'dark'
    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme.mode])

  return (
    <div className={`flex h-screen bg-white dark:bg-slate-950 text-slate-950 dark:text-white`}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <MainPanel />
      </div>
    </div>
  )
}
