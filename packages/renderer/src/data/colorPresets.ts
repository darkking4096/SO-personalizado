/**
 * Windows 11 Accent Color Presets
 * Default colors from Windows 11 personalization settings
 */

export interface ColorPreset {
  name: string
  hex: string
  description?: string
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: 'Default Blue',
    hex: '#005A9E',
    description: 'Windows 11 default accent color',
  },
  {
    name: 'Purple',
    hex: '#8661C5',
    description: 'Elegant purple accent',
  },
  {
    name: 'Red',
    hex: '#D83B01',
    description: 'Bold red accent',
  },
  {
    name: 'Pink',
    hex: '#E81123',
    description: 'Modern pink accent',
  },
  {
    name: 'Green',
    hex: '#107C10',
    description: 'Fresh green accent',
  },
  {
    name: 'Cyan',
    hex: '#00B4EF',
    description: 'Bright cyan accent',
  },
]

/**
 * Get color preset by name
 */
export function getColorPresetByName(name: string): ColorPreset | undefined {
  return COLOR_PRESETS.find((p) => p.name.toLowerCase() === name.toLowerCase())
}

/**
 * Get color preset by hex value
 */
export function getColorPresetByHex(hex: string): ColorPreset | undefined {
  const normalizedHex = hex.toUpperCase()
  return COLOR_PRESETS.find((p) => p.hex.toUpperCase() === normalizedHex)
}

/**
 * Check if color is a preset
 */
export function isPresetColor(hex: string): boolean {
  return getColorPresetByHex(hex) !== undefined
}

/**
 * Get all preset hex colors
 */
export function getPresetHexColors(): string[] {
  return COLOR_PRESETS.map((p) => p.hex)
}
