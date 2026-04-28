# Personalización SO - Development Setup Guide

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (or pnpm)
- **Windows 11**: Pro or Home (build 21H2+)
- **Git**: 2.30+

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/personalizacao-so.git
cd personalizacao-so
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

This installs dependencies for the root workspace and all packages.

### 3. Environment Variables

Copy `.env.example` to `.env` and update if needed:

```bash
cp .env.example .env
```

## Development Workflow

### Start Development Server

```bash
npm run dev
```

This will:
1. Start Vite dev server (renderer)
2. Launch Electron in development mode
3. Enable hot module reloading (HMR)
4. Open DevTools automatically

### Type Checking

```bash
npm run typecheck
```

Verify TypeScript compilation without emitting files.

### Linting

```bash
npm run lint
```

Run ESLint with auto-fix enabled.

### Testing

```bash
npm test
```

Run all tests (unit and integration).

### Building

#### Development Build
```bash
npm run build
```

Creates optimized build artifacts.

#### Production Executable

```bash
npm run build:exe
```

Generates single `.exe` file in `dist/` directory.

## Project Structure

```
.
├── packages/
│   ├── main/                    # Electron main process
│   │   ├── src/
│   │   │   ├── main.ts          # Application entry point
│   │   │   ├── preload.ts       # IPC bridge
│   │   │   └── ipc/
│   │   │       ├── channels.ts  # Channel definitions
│   │   │       └── handlers.ts  # IPC handlers
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── renderer/                # React web application
│       ├── src/
│       │   ├── main.tsx         # React entry point
│       │   ├── App.tsx          # Root component
│       │   ├── components/      # Reusable UI components
│       │   ├── stores/          # Zustand stores
│       │   └── styles/          # Tailwind CSS
│       ├── index.html
│       ├── package.json
│       └── tsconfig.json
│
├── src/                         # Shared code
│   ├── services/                # Business logic services
│   │   ├── wallpaperService.ts
│   │   ├── themeService.ts
│   │   ├── registryManager.ts
│   │   ├── profileManager.ts
│   │   └── keyboardService.ts
│   ├── types/                   # Shared TypeScript types
│   └── utils/                   # Utility functions
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md
│   └── SETUP.md (this file)
│
├── tests/                       # Test suites
│
├── .github/
│   └── workflows/
│       └── build.yml            # CI/CD pipeline
│
├── Configuration files
│   ├── package.json             # Root workspace config
│   ├── tsconfig.json            # TypeScript config
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── .eslintrc.json           # ESLint config
│   ├── .prettierrc.json         # Prettier config
│   └── electron.vite.config.ts  # Electron-Vite config
│
└── .gitignore, README.md, etc.
```

## Code Style Guide

### TypeScript

- **Strict mode**: Enabled
- **No `any` types**: Use proper typing
- **Interfaces**: Prefer interfaces over types for object definitions
- **Imports**: Use absolute imports with path aliases

### React

- **Functional components**: Only function components
- **Hooks**: Use built-in and custom hooks
- **Props**: Properly typed with interfaces
- **Naming**: PascalCase for components

### Styling

- **Tailwind**: Use utility classes
- **Dark mode**: Support with `dark:` prefix
- **Custom CSS**: Minimize, use Tailwind when possible

## Common Development Tasks

### Adding a New Service

1. Create file in `src/services/{serviceName}.ts`
2. Implement service class with static methods
3. Add JSDoc comments
4. Create IPC handlers in `packages/main/src/ipc/handlers.ts`
5. Define IPC channels in `packages/main/src/ipc/channels.ts`

### Adding a New Component

1. Create file in `packages/renderer/src/components/{ComponentName}.tsx`
2. Export as default export
3. Add proper TypeScript types for props
4. Import and use in parent components
5. Style with Tailwind CSS

### Adding a New Feature

1. Create story in `docs/stories/`
2. Design at component level
3. Implement service stubs
4. Create React components
5. Wire up with IPC
6. Add tests
7. Update documentation

## Debugging

### DevTools

In development, DevTools opens automatically. Use for:
- React component inspection (React DevTools)
- JavaScript console debugging
- Network monitoring (limited in Electron)

### Logging

Use the `Logger` utility from `src/utils/logger.ts`:

```typescript
import { Logger } from '@shared/utils/logger'

Logger.info('Starting application')
Logger.debug('Debug information', data)
Logger.error('Error occurred', error)
```

### Hot Reload

Hot reloading works for React components. Changes to:
- React components auto-reload in renderer
- Main process changes require restart
- IPC handlers require restart

## Windows 11 Integration

### Admin Privileges

Some features require elevated privileges:
- Setting wallpaper via Windows API
- Modifying Registry
- Taskbar customization

The app will prompt for admin rights when needed.

### Testing on Different Windows Versions

- **Windows 11 Pro** (recommended): Full feature support
- **Windows 11 Home**: Some features may be limited
- **Older Windows**: Not officially supported

## Troubleshooting

### Build Errors

1. **"Module not found"** - Run `npm install` again
2. **TypeScript errors** - Run `npm run typecheck`
3. **ESLint errors** - Run `npm run lint -- --fix`

### Runtime Errors

1. **Electron won't start** - Check Node.js version
2. **IPC not working** - Verify channel names in `channels.ts`
3. **Windows API fails** - May need admin privileges

### Performance Issues

1. Check bundle size: `npm run build`
2. Profile with Chrome DevTools
3. Check React component renders: React DevTools

## CI/CD Pipeline

The project uses GitHub Actions for:
- Linting on PR
- Type checking on PR
- Building on push to main
- Notifying on build completion

See `.github/workflows/build.yml` for details.

## Release Process

1. Update version in `package.json`
2. Create GitHub release with changelog
3. CI/CD builds and creates `.exe`
4. Publish `.exe` to releases page

## Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support & Contributions

For issues, questions, or contributions:
1. Check existing GitHub issues
2. Open a new issue with reproduction steps
3. Submit pull requests with tests
4. Follow code style guidelines

## License

MIT License - See LICENSE file for details
