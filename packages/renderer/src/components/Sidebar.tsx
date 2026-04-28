import { useState } from 'react'
import { useAppStore } from '../stores/appStore'

type MenuItem = 'wallpaper' | 'taskbar' | 'theme' | 'shortcuts' | 'profiles' | 'settings'

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState<MenuItem>('wallpaper')
  const version = useAppStore((state) => state.version)

  const menuItems: Array<{ id: MenuItem; label: string; icon: string }> = [
    { id: 'wallpaper', label: 'Wallpaper', icon: '🖼️' },
    { id: 'taskbar', label: 'Taskbar', icon: '📊' },
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' },
    { id: 'profiles', label: 'Profiles', icon: '💾' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="w-64 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Personalización SO
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">v{version}</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeMenu === item.id
                ? 'bg-blue-500 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Personalize Windows 11
        </p>
      </div>
    </aside>
  )
}
