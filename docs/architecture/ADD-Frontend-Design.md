# Architecture Design Document — Frontend
## PersonalizacionSO v1.0

**Status:** Draft  
**Target:** Frontend Implementation Team  
**Scope:** UI/UX Design Architecture, Component Structure, Performance Optimization  
**Date:** 2026-04-27

---

## EXECUTIVE SUMMARY

PersonalizacionSO é um desktop application com foco em **máxima performance** e **interface minimalista**. Este documento define a arquitetura visual, estrutura de componentes e estratégias de otimização para atingir:

- ⏱️ Startup < 2 segundos
- ⏱️ Settings apply < 500ms
- ⏱️ Renderização fluid (60 FPS)
- 💾 Bundle otimizado (sem bloat)
- 🎯 UI/UX minimalista e clara

---

## 1. DESIGN SYSTEM — ESTRUTURA VISUAL

### 1.1 Color Palette

```
─────────────────────────────────────────
Base Colors (Dark Mode Optimized)
─────────────────────────────────────────

Primary Background:    #0f0f0f (Near Black)
Secondary Background:  #1a1a1a (Dark Gray)
Tertiary Background:   #252525 (Medium Dark)

Accent Color:          #e0b368 (Golden/Warm)
Accent Dark:           #b8892a (Golden Dark)

Text Primary:          #ffffff (White)
Text Secondary:        #b0b0b0 (Light Gray)
Text Tertiary:         #757575 (Medium Gray)

Border Light:          #333333 (Subtle)
Border Dark:           #1a1a1a (Deep)

Status Success:        #4caf50 (Green)
Status Warning:        #ff9800 (Orange)
Status Error:          #f44336 (Red)
```

### 1.2 Typography

```
─────────────────────────────────────────
Font Stack
─────────────────────────────────────────

Primary Font:   -apple-system, BlinkMacSystemFont, "Segoe UI", 
                Roboto, sans-serif
                (System fonts — zero loading overhead)

Fallback:       Arial, sans-serif
```

**Font Sizes & Weights:**
```
Heading 1 (Section):     32px / 600 weight
Heading 2 (Subsection):  24px / 500 weight
Heading 3 (Panel Title): 18px / 500 weight

Body Regular:            14px / 400 weight
Body Small:              12px / 400 weight
Label:                   12px / 500 weight (uppercase)
```

### 1.3 Spacing System

```
─────────────────────────────────────────
Consistent Spacing Scale (px)
─────────────────────────────────────────

xs:   4px   (micro gaps)
sm:   8px   (small padding)
md:   12px  (default padding)
lg:   16px  (section padding)
xl:   24px  (major sections)
2xl:  32px  (page padding)
3xl:  48px  (page gaps)
```

### 1.4 Border & Shadow System

```
─────────────────────────────────────────
Visual Depth (Minimal, Performance-focused)
─────────────────────────────────────────

Border Thin:    1px solid #333333
Border Medium:  1px solid #252525

Shadow Subtle:  0 1px 2px rgba(0,0,0,0.3)
Shadow Small:   0 2px 4px rgba(0,0,0,0.4)

NO Heavy Shadows — Performance overhead
USE: Subtle borders + color contrast instead
```

---

## 2. LAYOUT ARCHITECTURE

### 2.1 Main Application Structure

```
┌────────────────────────────────────────────┐
│  WINDOW FRAME (Electron) - No Padding      │
├────────────────────────────────────────────┤
│                                            │
│  HEADER (Height: 56px)                     │
│  ├─ Logo + App Title | Menu (⋮)            │
│  ├─ Divider (1px border)                   │
│                                            │
│  MAIN CONTAINER (Flex Layout)              │
│  ├─ SIDEBAR (Width: 240px)                 │
│  │  ├─ Nav Items (Fixed)                   │
│  │  └─ Divider                             │
│  │                                         │
│  └─ CONTENT PANEL (Flex: 1)                │
│     ├─ Panel Header (24px)                 │
│     ├─ Panel Content (Scrollable)          │
│     └─ Panel Footer / Actions (56px)       │
│                                            │
└────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
App (Root)
├─ WindowFrame
│  ├─ Header
│  │  ├─ Logo
│  │  └─ MenuButton
│  │
│  └─ MainLayout (Grid: Sidebar + Content)
│     ├─ Sidebar
│     │  ├─ NavItem (Wallpaper)
│     │  ├─ NavItem (Taskbar)
│     │  ├─ NavItem (Theme)
│     │  ├─ NavItem (Shortcuts)
│     │  ├─ NavItem (Profiles)
│     │  └─ NavItem (Settings)
│     │
│     └─ ContentPanel
│        ├─ DynamicPanel (Wallpaper | Taskbar | etc)
│        └─ ActionBar
│           ├─ SaveButton
│           ├─ ApplyButton
│           └─ ResetButton
```

---

## 3. PANEL DESIGNS — UI STRUCTURE

### 3.1 Wallpaper Panel

```
┌─────────────────────────────────────────────┐
│  WALLPAPER                                  │
├─────────────────────────────────────────────┤
│                                             │
│  Current Wallpaper                          │
│  ┌─────────────────────────────────────────┐│
│  │  [Preview Image - Aspect Ratio 16:9]   ││
│  │                                         ││
│  └─────────────────────────────────────────┘│
│  Beach.jpg • 1920x1080                      │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Mode Selection                             │
│  [ Fixed ]  [ Variable ]                    │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Fixed Mode (Selected)                      │
│  └─ [Browse Image]  [Set as Wallpaper]     │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Monitor Target                             │
│  └─ All Monitors  ▼                         │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.2 Wallpaper Panel — Variable Mode

```
┌─────────────────────────────────────────────┐
│  WALLPAPER (Variable Mode)                  │
├─────────────────────────────────────────────┤
│                                             │
│  Current Wallpaper                          │
│  [Preview] Beach.jpg                        │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Mode: [ Fixed ]  [✓ Variable ]             │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Variable Type                              │
│  [ Rotation ]  [ Schedule ]                 │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Rotation Settings (Selected)                │
│  ├─ Interval:  30 min  ▼                    │
│  ├─ Mode:      Sequential  ▼                │
│  ├─ Wallpapers: (3 selected)                │
│  │  └─ [Browse Folder]  [View List]        │
│  └─ Active Hours:  [ ] All Day              │
│                    [06:00 - 23:00] ▼        │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.3 Taskbar Panel

```
┌─────────────────────────────────────────────┐
│  TASKBAR                                    │
├─────────────────────────────────────────────┤
│                                             │
│  Position                                   │
│  [ Bottom ]  [ Left ]  [ Right ]  [ Top ]   │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Appearance                                 │
│  ├─ Transparency:  [▓▓░░░░░░░░] 40%         │
│  ├─ Color:        [■ Current]  [Pick]      │
│  └─ Size:         Small  [ ] Default [  ]  │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Elements                                   │
│  ├─ [ ✓ ] Clock                             │
│  ├─ [ ✓ ] Calendar                          │
│  ├─ [ ✓ ] System Tray                       │
│  ├─ [ ✓ ] Search                            │
│  ├─ [   ] Copilot                           │
│  └─ [   ] Weather                           │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Auto-hide                                  │
│  [ ] Enable auto-hide when not in use       │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.4 Theme Panel

```
┌─────────────────────────────────────────────┐
│  THEME                                      │
├─────────────────────────────────────────────┤
│                                             │
│  Mode                                       │
│  [ Light ]  [ ✓ Dark ]                      │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Accent Color                               │
│  Current: [■ #e0b368]  Golden               │
│                                             │
│  Presets:                                   │
│  [■ Blue]  [■ Green]  [■ Red]  [■ Purple]  │
│  [■ Gold]  [■ Custom] ...                   │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Custom Color Picker                        │
│  Hex: [#e0b368________]                     │
│                                             │
│  Color Gradient:                            │
│  ┌─────────────────────────────────────┐   │
│  │ ◎ (HSL Picker)                      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ─────────────────────────────────────  │
│                                             │
│  Apply To:                                  │
│  [ ✓ ] Windows UI  [ ✓ ] Taskbar            │
│  [ ✓ ] Start Menu  [   ] System Icons       │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.5 Shortcuts Panel

```
┌─────────────────────────────────────────────┐
│  KEYBOARD SHORTCUTS                         │
├─────────────────────────────────────────────┤
│                                             │
│  Search:  [Search shortcuts...]             │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  ⭐ PINNED (5)                              │
│  ├─ Win + D         Show Desktop            │
│  ├─ Win + V         Clipboard History       │
│  ├─ Ctrl + Shift + Esc  Task Manager        │
│  ├─ Win + Shift + S    Screenshot           │
│  └─ Alt + Tab      Switch Apps              │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  WINDOWS SHORTCUTS (100+)                   │
│  ├─ Win + E         File Explorer           │
│  ├─ Win + I         Settings                │
│  ├─ Win + X         Quick Menu               │
│  ├─ Ctrl + Alt + Delete  Security Screen    │
│  └─ ...                                     │
│                                             │
│  Scroll to see more ↓                       │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.6 Profiles Panel

```
┌─────────────────────────────────────────────┐
│  PROFILES                                   │
├─────────────────────────────────────────────┤
│                                             │
│  Active Profiles                            │
│                                             │
│  Work                                       │
│  ├─ Wallpaper: Office.jpg                   │
│  ├─ Taskbar: Bottom | Dark                  │
│  ├─ Theme: Dark | Blue Accent               │
│  └─ [Apply]  [Edit]  [Delete]               │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Gaming                                     │
│  ├─ Wallpaper: Gamer.jpg                    │
│  ├─ Taskbar: Bottom | Transparent           │
│  ├─ Theme: Dark | Red Accent                │
│  └─ [Apply]  [Edit]  [Delete]               │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Night Mode                                 │
│  ├─ Wallpaper: Starry.jpg                   │
│  ├─ Taskbar: Bottom | Dark                  │
│  ├─ Theme: Dark | Purple Accent             │
│  ├─ [ ✓ ] Apply on startup                  │
│  └─ [Apply]  [Edit]  [Delete]               │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  [+ New Profile]                            │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 4. COMPONENT SPECIFICATIONS

### 4.1 Button Component

**Types:**
```
Primary:     [Solid Accent] Text White
Secondary:   [Border] Text Accent
Danger:      [Border Red] Text Red
Disabled:    [Border Gray] Text Gray
```

**Sizes:**
```
Small:   32px height | 12px font | 8px padding
Default: 40px height | 14px font | 12px padding
Large:   48px height | 16px font | 16px padding
```

**States:**
```
Default:  Background [color]
Hover:    Background [color-dark] + Shadow Subtle
Active:   Background [color-darker]
Disabled: Opacity 0.5, No hover
```

### 4.2 Input Component

**Text Input:**
```
┌──────────────────────────┐
│ Placeholder text...      │
└──────────────────────────┘

Default:     Border #333333 | Focus border #e0b368
Filled:      Background #252525
Error:       Border #f44336
Focus:       Shadow Subtle + Border Accent
```

**Dropdown / Select:**
```
[ Value ]  ▼

Closed:   Shows selected value
Opened:   Dropdown list appears (max 6 items, scroll if more)
```

### 4.3 Toggle / Checkbox

```
[ ✓ ] Label Text   (Checked)
[   ] Label Text   (Unchecked)

Active:    Background Accent, Checkmark White
Inactive:  Border #333333, Background transparent
```

### 4.4 Slider

```
Label: [Slider Value: 40%]

┌─────────────────────────────┐
│ ░░░░░░░░░░░░○░░░░░░░░░░░░ │
│ 0%                    100%  │
└─────────────────────────────┘

Performance: Use CSS transitions only
Avoid: JavaScript animations during drag
```

### 4.5 Card / Panel Container

```
┌─────────────────────────────────────────┐
│ Border #333333                          │
│ Background #1a1a1a                      │
│ Padding: 16px                           │
│                                         │
│ Content here                            │
│                                         │
└─────────────────────────────────────────┘

Border:    1px solid #333333
Shadow:    None (use border for definition)
Radius:    4px
```

---

## 5. INTERACTION PATTERNS

### 5.1 Navigation Flow

```
Header Logo
    ↓
Sidebar Nav Item Selected
    ↓
Content Panel Updates (Fade In)
    ↓
User Modifies Settings
    ↓
Apply / Save Button (Active)
    ↓
Settings Applied + Feedback
```

**Performance Rule:**
- Panel transitions: CSS fade (100ms) — NO JavaScript animations
- State updates: Zustand selectors (zero re-renders)
- Settings apply: Non-blocking (show loading state)

### 5.2 Profile Application Flow

```
User clicks "Apply" on Profile
    ↓
Show: "Applying Profile..."
    ↓
Apply settings (async)
    ↓
Show: "✓ Profile Applied" (2s toast)
    ↓
Content Panel auto-updates
```

### 5.3 Error Handling UI

```
Scenario: Wallpaper apply fails
    ↓
Show error toast: "Failed to set wallpaper"
    ↓
Provide action: [Retry]  [Dismiss]
    ↓
If retry fails: Show detailed error

Design: Toast appears bottom-right
Duration: 4 seconds (auto-dismiss)
Color: #f44336 (Error Red)
```

---

## 6. PERFORMANCE OPTIMIZATION RULES

### 6.1 Rendering Performance

**Target: 60 FPS (16.67ms per frame)**

```
Rules:
─────────────────────────────────────

1. CSS-only Animations
   ✓ Use: transform, opacity (GPU accelerated)
   ✗ Avoid: width, height, position (layout thrash)

2. Component Memoization
   ✓ Use: React.memo for expensive renders
   ✓ Use: useMemo for derived state
   ✗ Avoid: Inline object literals in props

3. Zustand Selectors
   ✓ Use: shallow selectors (single values)
   ✓ Use: Custom equality functions for objects
   ✗ Avoid: Full store subscriptions

4. List Rendering
   ✓ Use: Virtualization for 100+ items (if applicable)
   ✗ Avoid: Rendering all items at once
   ✓ Key: Stable unique IDs, NOT array index
```

### 6.2 Bundle Size & Loading

**Target: < 100 MB application size**

```
Strategies:
─────────────────────────────────────

1. Code Splitting
   ✓ Each panel as separate chunk (lazy-load)
   ✗ No monolithic bundle

2. Tree-Shaking
   ✓ Remove unused Tailwind classes
   ✓ Mark dependencies as side-effect-free

3. Asset Optimization
   ✓ SVG inline (no external requests)
   ✓ Compress PNGs (if used)
   ✗ No heavy image assets

4. Dependency Audit
   ✓ Zustand (4KB)
   ✓ React 18 (production mode)
   ✓ Tailwind (only used classes)
   ✗ No unnecessary libraries
```

### 6.3 Interaction Latency

**Target: < 100ms response to user input**

```
Rules:
─────────────────────────────────────

1. Input Debouncing
   ✓ Color picker: 300ms debounce (less API calls)
   ✓ Slider: 150ms debounce
   ✗ No unthrottled event handlers

2. Settings Apply
   ✓ IPC call to Main Process (async/await)
   ✓ Show loading state immediately
   ✗ Don't block UI while applying

3. State Updates
   ✓ Zustand atomic updates (batch if needed)
   ✓ Selector granularity (only subscribed values change)
   ✗ Avoid cascading re-renders
```

### 6.4 Memory Management

**Target: < 200 MB resident memory**

```
Rules:
─────────────────────────────────────

1. Component Cleanup
   ✓ useEffect cleanup functions (remove listeners)
   ✓ Clear timers on unmount
   ✗ Memory leaks from dangling listeners

2. Store Cleanup
   ✓ ProfileStore: Unsubscribe on component unmount
   ✓ Cache invalidation after settings apply
   ✗ Accumulating listeners

3. Image Handling
   ✓ URL.createObjectURL() cleanup
   ✓ Revoke URLs after use
   ✗ No lingering blob references
```

---

## 7. RESPONSIVENESS STRATEGY

### 7.1 Window Size Support

```
Minimum:  1024 x 768 (netbooks)
Optimal:  1366 x 768 (HD)
Large:    1920 x 1080 (Full HD)
Ultra:    2560 x 1440 (2K)

Layout: Adjusts at 1024px breakpoint only
Sidebar: Fixed width (240px) or hidden on small screens
Content: Flex to available width
```

### 7.2 Adaptive UI

```
< 1024px:
├─ Sidebar collapses (drawer mode)
├─ Hamburger menu (⋮)
└─ Content full-width

>= 1024px:
├─ Sidebar visible (fixed)
├─ Content panel beside sidebar
└─ 2-column layout (optimal)
```

---

## 8. ACCESSIBILITY (A11Y) — MINIMAL COMPLIANCE

```
Standards:
──────────────────────────

✓ Keyboard Navigation
  - Tab through all interactive elements
  - Enter/Space to activate buttons
  - Arrow keys for dropdowns/lists

✓ Screen Reader Support
  - Semantic HTML (button, input, label)
  - aria-label for icon buttons
  - Form labels associated with inputs

✓ Color Contrast
  - Text vs Background: >= 4.5:1 ratio
  - All accent colors tested against backgrounds

✗ OUT OF SCOPE (v1.0)
  - Full WCAG 2.1 AA compliance
  - Magnification support
  - High contrast mode
```

---

## 9. VISUAL EXAMPLES — COMPONENT STATES

### 9.1 Button States

```
PRIMARY BUTTON
─────────────────────────────

Default:
[ Apply Settings ]

Hover:
[ Apply Settings ] + Subtle Shadow

Active/Pressed:
[ Apply Settings ] + Darker Background

Loading:
[ ⟳ Applying... ]

Disabled:
[ Apply Settings ] (Grayed out, no hover)


SECONDARY BUTTON (Border Style)
─────────────────────────────

Default:
[ Cancel ]  (Border #333333, text white)

Hover:
[ Cancel ]  (Border #e0b368, text accent)

Active:
[ Cancel ]  (Background subtle, border accent)
```

### 9.2 Panel Header Pattern

```
┌─────────────────────────────────────────┐
│                                         │
│  SECTION TITLE                          │
│  Secondary text describing the section  │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  [Content Area]                         │
│                                         │
└─────────────────────────────────────────┘

Structure:
├─ Title (24px, weight 500)
├─ Description (14px, color Secondary)
├─ Divider (1px border)
└─ Content (padding 16px)
```

---

## 10. IMPLEMENTATION CHECKLIST

```
PHASE 1: Core Components
─────────────────────────
□ Header Component
□ Sidebar Navigation
□ Content Panel Container
□ Button (all states)
□ Input Fields
□ Toggles / Checkboxes
□ Dropdowns / Selects
□ Sliders
□ Card / Container styles

PHASE 2: Panels
─────────────────────────
□ Wallpaper Panel (Fixed Mode)
□ Wallpaper Panel (Variable Mode)
□ Taskbar Panel
□ Theme Panel
□ Shortcuts Panel
□ Profiles Panel

PHASE 3: Integration
─────────────────────────
□ Panel routing (Sidebar → Content)
□ State management (Zustand stores)
□ IPC communication setup
□ Settings apply feedback
□ Error handling UI

PHASE 4: Optimization
─────────────────────────
□ Component memoization
□ Bundle size audit
□ Performance profiling
□ Memory leak detection
□ Cross-browser testing (Windows 11)

PHASE 5: Polish
─────────────────────────
□ Dark mode finalization
□ Accessibility audit
□ Loading states
□ Error states
□ Toast notifications
```

---

## 11. DEVELOPMENT ENVIRONMENT SETUP

### 11.1 Build & Dev Tools

```
Build Tool:      Vite (React plugin)
Runtime:         Electron 28+
Component Lib:   React 18
Styling:         Tailwind CSS (utility-first)
State Mgmt:      Zustand
Testing:         Vitest + React Testing Library

Command Reference:
  npm run dev          → Start dev server + Electron
  npm run build        → Production build
  npm run preview      → Preview build locally
  npm run lint         → ESLint + TypeScript check
  npm test             → Run test suite
```

### 11.2 Folder Structure

```
src/
├─ components/
│  ├─ common/          (Buttons, Inputs, Cards)
│  ├─ layout/          (Header, Sidebar, ContentPanel)
│  └─ panels/          (Wallpaper, Taskbar, Theme, etc)
│
├─ pages/
│  └─ App.tsx          (Root component, routing)
│
├─ store/
│  ├─ wallpaperStore.ts
│  ├─ taskbarStore.ts
│  ├─ themeStore.ts
│  ├─ profileStore.ts
│  └─ uiStore.ts       (Active panel, loading states)
│
├─ styles/
│  ├─ globals.css      (Reset, base styles)
│  ├─ tailwind.config.js
│  └─ theme.css        (CSS variables)
│
├─ hooks/
│  ├─ usePanel.ts      (Active panel logic)
│  ├─ useSettings.ts   (IPC communication)
│  └─ useProfiles.ts   (Profile operations)
│
├─ types/
│  └─ index.ts         (TypeScript interfaces)
│
└─ main.ts            (Electron main process entry)
```

---

## 12. NOTES FOR IMPLEMENTATION TEAM

### Key Performance Priorities

1. **No Jank During Interactions**
   - Settings apply must be non-blocking
   - Show loading state immediately on button click
   - Use async/await with Zustand for state updates

2. **Minimize Re-renders**
   - Each panel uses dedicated store selectors
   - Custom equality functions for object props
   - Avoid creating objects inside components

3. **Fast Startup**
   - Lazy-load panel components (dynamic imports)
   - Preload only Header + Sidebar initially
   - Load panels on-demand when user clicks

4. **Memory Efficiency**
   - Clean up timers / listeners on unmount
   - Revoke blob URLs after use
   - Profile cache: keep only 10 most recent

### Design System Adherence

- **Colors:** Use CSS variables for consistency
- **Spacing:** Always use spacing scale (xs, sm, md, lg, xl)
- **Typography:** Font weights matter for hierarchy
- **Borders:** Prefer subtle borders over shadows

### Testing Requirements

- [ ] Component unit tests (Vitest)
- [ ] Integration tests for panel switching
- [ ] Performance profiling (DevTools)
- [ ] Memory leaks detection (Chrome DevTools)
- [ ] Accessibility audit (axe DevTools)

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-27  
**Next Review:** Before Phase 2 implementation  
**Approver:** @architect (Aria)

---

**END OF DOCUMENT**

