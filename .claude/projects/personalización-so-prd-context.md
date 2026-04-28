---
name: PersonalizacionSO PRD Context
description: Essential project context extracted from PRD — Always remember this for all development decisions
type: project
---

# Personalización SO — PRD Essential Context

**Source:** `docs/prd/PRD-personalizacao-so.md` (v1.0, Last Updated: 2026-04-27)

## What is This Project?

A centralized, visual desktop application that empowers non-technical Windows 11 Pro users to fully customize their system's appearance and behavior without navigating fragmented settings menus or command-line tools.

**Core Promise:** Reduce customization time from hours of trial-and-error to minutes of visual configuration.

## For Whom Are We Building?

### Primary Persona: Alex (The Aesthetic User)
- Age: 25-45
- Tech Comfort: Beginner to Intermediate
- Main Goal: Make Windows look exactly as they want
- Pain Points: Scattered settings, confusion about where to find options, no animated wallpapers
- Usage: Daily user who wants their desktop to match their mood

### Secondary Persona: Jordan (The Workflow Optimizer)
- Age: 30-50
- Tech Comfort: Intermediate
- Main Goal: Create multiple workspace profiles and switch between them instantly
- Pain Points: Manual reconfiguration of each workspace
- Usage: Frequent switcher between different work modes (Work, Gaming, Relaxation)

## MVP Scope (v1.0 — Target: Q3 2026)

### ✅ INCLUDED in MVP:

**Wallpaper Management (FR-WP):**
- Static wallpaper selection (JPEG, PNG, BMP, WEBP)
- Time-based scheduling (30-minute granularity, auto-transition)
- Dynamic rotation (Sequential, Random, Weighted modes)
- Fixed vs. Variable modes

**Taskbar Customization (FR-TB):**
- Position control (Bottom, Left, Right, Top)
- Transparency & Color (0-100% transparency, color picker)
- Size & Format (Small, Default, Large presets + custom)
- Item Visibility (Clock, Calendar, Weather, System Tray, Copilot, Search, Task View, Virtual Desktops)
- Icon Customization (Size, spacing, highlight, labels, thumbnails)

**System Theme & Appearance (FR-TH):**
- Light/Dark theme toggle
- Accent color picker (visual + hex input)
- Preset color palettes

**Keyboard Shortcuts (FR-KB):**
- Comprehensive inventory (100+ built-in shortcuts)
- Search by function or key combination
- Favorites/pinning system
- ⚠️ Custom creation DEFERRED to v1.1

**Profile System (FR-PR) — CORE FEATURE:**
- Create/edit/delete profiles with descriptive names
- Single-click profile application
- Auto-apply profile on system startup (with Shift bypass)
- Storage: `%APPDATA%/PersonalizacionSO/profiles/` (JSON)
- Import/export profiles as `.profile` files

### ❌ DEFERRED to v1.1:
- **Animated Wallpapers** (GIF, MP4, WebM) — Complex Windows API integration
- **Custom Keyboard Shortcuts** — Requires WinAPI hooking
- **Font Customization** — Limited Windows 11 support

### ❌ OUT OF SCOPE (Not in MVP):
- Cloud sync / Profile roaming
- Multi-user profiles
- Start Menu customization
- File Explorer customization
- Cursor customization
- Sound/notification customization
- Natural language scheduling

## Technology Stack (LOCKED - DO NOT CHANGE)

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Runtime | Electron v28+ | Single .exe, zero dependencies, cross-platform ready |
| Frontend | React 18 + TypeScript | Type-safe, component reusability, modern UX patterns |
| Styling | Tailwind CSS + Dark Mode | Fast iteration, built-in dark theme support |
| State Management | Zustand | Lightweight, minimal boilerplate for profile state |
| Build Tool | Vite | Fast dev server, optimized builds for Electron |
| Backend/IPC | Electron Main Process + node-windows | System integration, Registry access |
| Windows API | node-ffi, windows-registry | Direct Registry access for settings persistence |
| Storage | JSON files + Windows Registry | Simple, portable, human-readable profiles |

## Architecture Overview

```
PersonalizacionSO.exe (Single Bundle)
├── Renderer (React UI)
│   ├── WallpaperPanel
│   ├── TaskbarPanel  
│   ├── ThemePanel
│   ├── ShortcutsPanel (inventory + search)
│   ├── ProfileManager
│   └── SettingsPanel
├── Main Process (Electron IPC)
│   ├── WallpaperService (scheduling, rotation, preview)
│   ├── RegistryManager (theme, taskbar, accent color)
│   ├── ProfileManager (serialize/deserialize system state)
│   ├── TaskbarAPI (Win32 position, visibility, sizing)
│   └── SettingsHandler (app preferences, auto-startup)
└── OS Integration Layer
    ├── Windows Registry (HKEY_CURRENT_USER)
    ├── Win32/UWP APIs
    ├── File System
    └── Wallpaper Service
```

## Non-Functional Requirements (MUST HIT - Performance Targets)

| Requirement | Target | Severity |
|-------------|--------|----------|
| Application Startup | <2 seconds | HIGH - UX responsiveness |
| Settings Apply | <500ms | HIGH - Perceived performance |
| Profile Apply | <1 second | HIGH - Quick workspace switching |
| Animated Wallpaper CPU | <10% idle (v1.1) | MEDIUM - Energy efficiency |
| Reliability | 99% uptime | HIGH - System integration trust |
| Discoverability | 3 clicks to any feature | HIGH - Non-technical users |
| Learning Curve | <5 minutes | HIGH - Target persona requirement |

## Critical Windows API Constraints (Blockers)

⚠️ **Animated Wallpaper:** Not natively supported in Windows 11
- Requires: Custom renderer with GIF/video library (gif.js, ffmpeg-wasm)
- Alternative: Third-party service or Windows.System.UserProfile workaround
- Status: DEFERRED v1.1 (MVP delivers value with static wallpapers)

⚠️ **Custom Shortcuts:** Cannot create new shortcuts without WinAPI hooking
- Windows Registry only supports read-only access to built-in shortcuts
- Creating custom shortcuts requires low-level keyboard hook
- Status: DEFERRED v1.1

⚠️ **Font Customization:** Windows 11 offers limited options
- Only DPI scaling available natively
- Status: NOT IN MVP

⚠️ **Taskbar Elements:** Some controlled by Windows 11 defaults
- May require Registry hacks or UWP API calls
- Test on clean Windows 11 install

## Profile System Details (CRITICAL)

**Location:** `%APPDATA%/PersonalizacionSO/profiles/`
**Format:** JSON (human-readable, easy to edit)

**Profile Contents:**
- Wallpaper selection (path + mode: Fixed/Variable)
- Taskbar settings (position, color, transparency, visibility, sizing)
- Theme settings (light/dark, accent color)
- Shortcut favorites (pinned shortcuts list)

**Key Behaviors:**
1. **Save:** Serialize current system state → JSON file
2. **Load:** Deserialize JSON → system state (for preview/comparison)
3. **Apply:** Atomic all-or-nothing operation (auto-rollback on failure)
4. **Default:** Mark one profile to auto-apply on system startup
5. **Bypass:** Hold Shift during app launch to skip auto-apply
6. **Persistence:** All settings survive app restart + system restart

## Success Metrics (How We Measure Success)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Time to First Customization | <5 minutes | User testing sessions |
| Profile Creation Success Rate | >95% | Error logging |
| Feature Discoverability | 100% within 3 clicks | User testing |
| Crash Rate | <0.1% | Telemetry (opt-in) |
| Settings Apply Latency | <500ms average | Performance metrics |
| User Retention (30 days) | >70% | Download/usage tracking |
| Profile Reuse Rate | >80% create 2+ profiles | Usage analytics |

## Roadmap

**Phase 1: v1.0 (Q3 2026)** 
- Core MVP features (Wallpaper, Taskbar, Theme, Shortcuts Inventory, Profiles)

**Phase 2: v1.1 (Q4 2026)** 
- Animated wallpapers, custom shortcuts, UX polish, stability

**Phase 3: v2.0 (Q1 2027)** 
- Cloud sync, multi-monitor, cursor customization, community themes

## CRITICAL CONSTRAINTS (Cannot Be Violated)

🚫 **No Invented Features:** Features not explicitly in MVP acceptance criteria are OUT
🚫 **No Cloud Sync in v1.0:** Local-only storage in MVP (cloud → v2.0)
🚫 **No Animated Wallpapers in MVP:** Static-only (animated → v1.1)
🚫 **No Custom Shortcuts in MVP:** Inventory + search only (creation → v1.1)
✅ **Settings Persistence Required:** Must survive app/system restart
✅ **Non-Technical Usability:** Basic customization must work WITHOUT admin rights
✅ **Registry Safety:** Automatic rollback on failed Registry writes

## Key Assumptions

1. Target OS: Windows 11 Pro/Home (build 21H2+)
2. Users have local admin rights (or UAC elevation for taskbar/theme)
3. Single or dual monitor setup (MVP)
4. Users have ~5 minute learning curve tolerance
5. Profiles stored only locally (no cloud in MVP)

## Important Reminders When Developing

✅ **Always refer to this context when making architecture/scope decisions**
✅ **Check RFC requirements before adding features**
✅ **Profile system is THE core differentiator — make it bulletproof**
✅ **Performance targets are non-negotiable for this UX**
✅ **Non-technical users can't debug — safety and clarity first**
✅ **Windows API is fragile — test on clean Windows 11 installs**
