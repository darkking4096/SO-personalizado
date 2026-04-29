/**
 * Theme Configuration and CSS Variables
 * Defines light/dark mode colors and Tailwind integration
 */

export type ThemeMode = 'light' | 'dark'

// Windows 11 Accent Colors
export const WINDOWS_ACCENT_COLORS = {
  Blue: '#0078D4',
  Purple: '#8661C5',
  Red: '#DA3B01',
  Pink: '#E81123',
  Green: '#107C10',
  Cyan: '#00B4EF',
} as const

// Light theme palette
export const LIGHT_THEME = {
  background: '#FFFFFF',
  surface: '#F3F3F3',
  surfaceVariant: '#E8E8E8',
  text: '#000000',
  textSecondary: '#424242',
  border: '#CCCCCC',
  primary: '#0078D4',
  accent: '#107C10',
} as const

// Dark theme palette
export const DARK_THEME = {
  background: '#1E1E1E',
  surface: '#2D2D30',
  surfaceVariant: '#3E3E42',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  border: '#404040',
  primary: '#60A9FF',
  accent: '#5FD068',
} as const

/**
 * Apply theme to document root
 * Sets CSS custom properties for light/dark mode
 */
export function applyThemeToDOM(mode: ThemeMode, accentColor?: string) {
  const root = document.documentElement
  const theme = mode === 'light' ? LIGHT_THEME : DARK_THEME

  // Apply theme class to html element for Tailwind
  if (mode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  // Apply CSS variables
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })

  // Apply accent color if provided
  if (accentColor) {
    root.style.setProperty('--color-accent', accentColor)
  }
}

/**
 * Get CSS variables for current theme
 */
export function getThemeVariables(mode: ThemeMode): Record<string, string> {
  const theme = mode === 'light' ? LIGHT_THEME : DARK_THEME
  return theme as Record<string, string>
}

/**
 * Detect system theme preference
 * @returns 'light' or 'dark' based on system preference
 */
export function detectSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
