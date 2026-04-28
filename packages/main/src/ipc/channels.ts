/**
 * IPC Channel Definitions
 * All IPC communication between renderer and main process goes through these channels
 */

export const IPC_CHANNELS = {
  // Wallpaper Service
  WALLPAPER_SET: 'wallpaper:set',
  WALLPAPER_GET: 'wallpaper:get',
  WALLPAPER_SCHEDULE: 'wallpaper:schedule',

  // Theme Service
  THEME_SET: 'theme:set',
  THEME_GET: 'theme:get',

  // Taskbar Service
  TASKBAR_SET: 'taskbar:set',
  TASKBAR_GET: 'taskbar:get',

  // Keyboard Service
  KEYBOARD_LIST: 'keyboard:list',
  KEYBOARD_SEARCH: 'keyboard:search',

  // Profile Service
  PROFILE_SAVE: 'profile:save',
  PROFILE_LOAD: 'profile:load',
  PROFILE_DELETE: 'profile:delete',
  PROFILE_LIST: 'profile:list',
  PROFILE_APPLY: 'profile:apply',
  PROFILE_SET_DEFAULT: 'profile:set-default',

  // Registry Service
  REGISTRY_READ: 'registry:read',
  REGISTRY_WRITE: 'registry:write',

  // App Service
  APP_GET_VERSION: 'app:get-version',
  APP_OPEN_DEVTOOLS: 'app:open-devtools',
} as const
