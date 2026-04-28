import { useAppStore } from '../stores/appStore'

export default function MainPanel() {
  // version is retrieved but not displayed in current implementation
  // const version = useAppStore((state) => state.version)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const theme = useAppStore((state) => state.theme)

  return (
    <main className="h-full overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white">
              Welcome to Personalización SO
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Customize your Windows 11 desktop in one place
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            {theme.mode === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Wallpaper Card */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-4xl mb-3">🖼️</div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">
              Wallpaper
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Set and schedule your desktop wallpapers with ease
            </p>
          </div>

          {/* Taskbar Card */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">
              Taskbar
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Customize taskbar position, transparency, and colors
            </p>
          </div>

          {/* Theme Card */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">Theme</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Switch between light and dark themes instantly
            </p>
          </div>

          {/* Shortcuts Card */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-4xl mb-3">⌨️</div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">
              Shortcuts
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              View and manage Windows keyboard shortcuts
            </p>
          </div>

          {/* Profiles Card */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-4xl mb-3">💾</div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">
              Profiles
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Save and switch between customization profiles
            </p>
          </div>

          {/* Settings Card */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2">
              Settings
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Configure application preferences and behavior
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg">
          <h3 className="font-semibold text-blue-950 dark:text-blue-100 mb-2">
            Getting Started
          </h3>
          <p className="text-blue-900 dark:text-blue-200 text-sm">
            Start by selecting a category from the menu on the left. Each feature will open a
            dedicated panel where you can customize your Windows 11 experience.
          </p>
        </div>
      </div>
    </main>
  )
}
