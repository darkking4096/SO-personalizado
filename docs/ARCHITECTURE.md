# Personalización SO - System Architecture

## Overview

Personalización SO is a Windows 11 customization hub built with Electron, React, and TypeScript. It provides a unified interface for personalizing desktop appearance and behavior.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Personalización SO Application             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐        ┌──────────────────────┐   │
│  │    RENDERER PROCESS  │        │    MAIN PROCESS      │   │
│  │  (React Application) │◄──────►│  (Electron Main)     │   │
│  │                      │   IPC  │                      │   │
│  │  ┌────────────────┐  │        │  ┌────────────────┐  │   │
│  │  │ UI Components  │  │        │  │ IPC Handlers   │  │   │
│  │  │ - Sidebar      │  │        │  │ - Channels     │  │   │
│  │  │ - MainPanel    │  │        │  │ - Routes       │  │   │
│  │  └────────────────┘  │        │  └────────────────┘  │   │
│  │                      │        │                      │   │
│  │  ┌────────────────┐  │        │  ┌────────────────┐  │   │
│  │  │ Zustand Store  │  │        │  │ Service Layer  │  │   │
│  │  │ - AppState     │  │        │  │ - Wallpaper    │  │   │
│  │  │ - Actions      │  │        │  │ - Theme        │  │   │
│  │  └────────────────┘  │        │  │ - Taskbar      │  │   │
│  │                      │        │  │ - Keyboard     │  │   │
│  │  ┌────────────────┐  │        │  │ - Profiles     │  │   │
│  │  │ Tailwind CSS   │  │        │  └────────────────┘  │   │
│  │  │ - Dark Mode    │  │        │                      │   │
│  │  │ - Components   │  │        │  ┌────────────────┐  │   │
│  │  └────────────────┘  │        │  │ Windows API    │  │   │
│  │                      │        │  │ Integration    │  │   │
│  │                      │        │  │ - node-ffi     │  │   │
│  │                      │        │  │ - winreg       │  │   │
│  │                      │        │  └────────────────┘  │   │
│  └──────────────────────┘        └──────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Windows APIs
                            ▼
                    ┌──────────────────┐
                    │  Windows 11 OS   │
                    ├──────────────────┤
                    │ - Registry       │
                    │ - Wallpaper Svc  │
                    │ - Theme          │
                    │ - Taskbar        │
                    └──────────────────┘
```

## Layer Architecture

### 1. Presentation Layer (Renderer Process)

**Components:**
- `App.tsx` - Root component
- `Sidebar.tsx` - Navigation menu
- `MainPanel.tsx` - Content area
- Feature-specific panels (todo in epics)

**State Management:**
- Zustand store (`appStore.ts`)
- Global app state
- Actions for mutations

**Styling:**
- Tailwind CSS
- Dark mode support (class-based)
- Responsive design

### 2. IPC Communication Layer

**Channels:** Defined in `packages/main/src/ipc/channels.ts`
- Wallpaper operations
- Theme operations
- Taskbar operations
- Keyboard shortcuts
- Profile operations
- Registry operations

**Handlers:** Implemented in `packages/main/src/ipc/handlers.ts`
- Route IPC messages to appropriate services
- Validate input
- Return results or errors

### 3. Service Layer (Main Process)

**Services:**
- `wallpaperService.ts` - Wallpaper management
- `themeService.ts` - Theme switching and accent colors
- `registryManager.ts` - Windows Registry operations
- `profileManager.ts` - Profile save/load/apply
- `keyboardService.ts` - Keyboard shortcuts inventory

**Characteristics:**
- Stub implementations (TODO comments)
- Service layer abstraction
- Error handling (to be implemented)
- Atomic operations for profiles

### 4. Windows API Integration Layer

**Libraries:**
- `node-ffi-napi` - Direct Windows API calls
- `windows-registry` - Registry operations
- Electron IPC - OS-level communication

**Implementations (TODO):**
- `SystemParametersInfo` for wallpaper setting
- Registry reads/writes for configuration
- UWP APIs for taskbar customization

## Data Flow

### Example: Setting Wallpaper

```
1. User clicks "Set Wallpaper" in MainPanel
   ↓
2. React handler calls: window.electron.invoke('wallpaper:set', path)
   ↓
3. Preload bridge forwards to IPC handler
   ↓
4. Main process IPC handler (channels.ts)
   ↓
5. Routes to WallpaperService.setWallpaper()
   ↓
6. Service calls Windows API via node-ffi
   ↓
7. Returns success/error to renderer
   ↓
8. React updates Zustand store
   ↓
9. UI re-renders with new state
```

## Directory Structure

```
Personalización SO/
├── packages/
│   ├── main/              # Electron main process
│   │   └── src/
│   │       ├── main.ts    # Entry point
│   │       ├── preload.ts # IPC bridge
│   │       └── ipc/
│   │           ├── channels.ts   # Channel definitions
│   │           └── handlers.ts   # IPC handlers
│   └── renderer/          # React application
│       └── src/
│           ├── main.tsx     # React entry
│           ├── App.tsx      # Root component
│           ├── components/  # UI components
│           ├── stores/      # Zustand stores
│           └── styles/      # Tailwind styles
├── src/                   # Shared code
│   ├── services/          # Service implementations
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Utility functions
├── docs/                  # Documentation
├── tests/                 # Test suites
├── .github/
│   └── workflows/
│       └── build.yml      # CI/CD pipeline
└── Configuration files
```

## State Management

### Zustand Store Structure

```typescript
interface AppState {
  version: string
  wallpaper: WallpaperState
  theme: ThemeState
  taskbar: TaskbarState
  profiles: Profile[]
  selectedProfile?: string
  
  // Actions
  setWallpaper(state)
  setTheme(state)
  setTaskbar(state)
  addProfile(profile)
  removeProfile(id)
  toggleTheme()
}
```

## Security Considerations

1. **Context Isolation** - Enabled in Electron webPreferences
2. **Preload Scripts** - Limited API bridge exposure
3. **IPC Validation** - Input validation in handlers (TODO)
4. **Registry Access** - Elevated privileges where needed
5. **Admin Checks** - Graceful fallback for non-admin users

## Performance Targets

- Startup time: <2 seconds
- Settings apply: <500ms
- Profile apply: <1 second
- Memory footprint: <150MB
- Build size (exe): <150MB

## Dependencies

### Runtime
- `electron`: ^28.0.0
- `react`: ^18.3.1
- `zustand`: ^4.4.7
- `node-ffi-napi`: ^1.0.3 (Windows API)
- `windows-registry`: ^1.0.1 (Registry)

### Dev Tools
- `typescript`: ^5.3.3
- `vite`: ^5.0.8
- `electron-vite`: ^2.0.0
- `tailwindcss`: ^3.4.1
- `eslint`: ^8.55.0

## Build Process

1. **Development**: `npm run dev` (Vite hot reload)
2. **Build**: `npm run build` (Vite + Electron build)
3. **Package**: `npm run build:exe` (Electron-builder)

## Future Extensions

- **v1.1**: Animated wallpapers, custom shortcuts
- **v2.0**: Cloud sync, multi-monitor, ecosystem integrations

## Testing Strategy

- Unit tests for services
- Integration tests for IPC
- E2E tests for user workflows
- Manual testing on Windows 11 Pro/Home

## Monitoring & Debugging

- Console logging in dev mode
- DevTools available in development
- ErrorBoundary components (todo)
- User telemetry (opt-in, todo)
