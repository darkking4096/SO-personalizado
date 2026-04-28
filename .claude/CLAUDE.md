# Synkra AIOX Development Rules for Claude Code

You are working with Synkra AIOX, an AI-Orchestrated System for Full Stack Development.

<!-- AIOX-MANAGED-START: core-framework -->
## Core Framework Understanding

Synkra AIOX is a meta-framework that orchestrates AI agents to handle complex development workflows. Always recognize and work within this architecture.
<!-- AIOX-MANAGED-END: core-framework -->

<!-- AIOX-MANAGED-START: constitution -->
## Constitution

O AIOX possui uma **Constitution formal** com princípios inegociáveis e gates automáticos.

**Documento completo:** `.aiox-core/constitution.md`

**Princípios fundamentais:**

| Artigo | Princípio | Severidade |
|--------|-----------|------------|
| I | CLI First | NON-NEGOTIABLE |
| II | Agent Authority | NON-NEGOTIABLE |
| III | Story-Driven Development | MUST |
| IV | No Invention | MUST |
| V | Quality First | MUST |
| VI | Absolute Imports | SHOULD |

**Gates automáticos bloqueiam violações.** Consulte a Constitution para detalhes completos.
<!-- AIOX-MANAGED-END: constitution -->

<!-- AIOX-MANAGED-START: sistema-de-agentes -->
## Sistema de Agentes

### Ativação de Agentes
Use `@agent-name` ou `/AIOX:agents:agent-name`:

| Agente | Persona | Escopo Principal |
|--------|---------|------------------|
| `@dev` | Dex | Implementação de código |
| `@qa` | Quinn | Testes e qualidade |
| `@architect` | Aria | Arquitetura e design técnico |
| `@pm` | Morgan | Product Management |
| `@po` | Pax | Product Owner, stories/epics |
| `@sm` | River | Scrum Master |
| `@analyst` | Alex | Pesquisa e análise |
| `@data-engineer` | Dara | Database design |
| `@ux-design-expert` | Uma | UX/UI design |
| `@devops` | Gage | CI/CD, git push (EXCLUSIVO) |

### Comandos de Agentes
Use prefixo `*` para comandos:
- `*help` - Mostrar comandos disponíveis
- `*create-story` - Criar story de desenvolvimento
- `*task {name}` - Executar task específica
- `*exit` - Sair do modo agente
<!-- AIOX-MANAGED-END: sistema-de-agentes -->

<!-- AIOX-MANAGED-START: agent-system -->
## Agent System

### Agent Activation
- Agents are activated with @agent-name syntax: @dev, @qa, @architect, @pm, @po, @sm, @analyst
- The master agent is activated with @aiox-master
- Agent commands use the * prefix: *help, *create-story, *task, *exit

### Agent Context
When an agent is active:
- Follow that agent's specific persona and expertise
- Use the agent's designated workflow patterns
- Maintain the agent's perspective throughout the interaction
<!-- AIOX-MANAGED-END: agent-system -->

## Development Methodology

### Story-Driven Development
1. **Work from stories** - All development starts with a story in `docs/stories/`
2. **Update progress** - Mark checkboxes as tasks complete: [ ] → [x]
3. **Track changes** - Maintain the File List section in the story
4. **Follow criteria** - Implement exactly what the acceptance criteria specify

### ⚠️ MANDATORY: Story Validation & Documentation
**CRITICAL RULE:** Whenever you validate stories (or are asked to validate stories), you MUST:
1. **Validate every story** against the **10-Point Validation Checklist** from `.claude/rules/story-lifecycle.md`
2. **Create a validation report** in `docs/validation-reports/STORY-VALIDATION-YYYY-MM-DD.md` documenting:
   - Story ID, title, validation score (X/10)
   - Verdict: GO or NO-GO with required fixes
   - Which of the 10 checklist points are met/missing
   - Any blockers or recommendations
3. **Update story status** from `Draft` → `Ready` in the story file ONLY if verdict is GO
4. **Inform the user** with a summary of the validation (which stories GO, which need fixes)
5. **DO NOT** close the conversation or move on until this is documented

**Why:** This ensures:
- All stories meet quality gates before development starts
- Validation work is not repeated in future conversations
- PRD alignment is verified systematically
- Handoff to @dev includes verified, complete stories
- No story goes to dev without documented validation

**Format:** Use `docs/validation-reports/STORY-VALIDATION-YYYY-MM-DD.md` as the template (see existing reports)

### ⚠️ MANDATORY: Story Status Synchronization (Story File Updates)

**CRITICAL RULE - ALWAYS EXECUTE:**

After ANY validation, review, or gate decision, the **story file status field MUST be updated** to match the verdict. This keeps `docs/stories/` synchronized with `docs/qa/gates/` and is non-negotiable.

**Rules by Agent & Verdict:**

| Agent | Action | Verdict | Update Status To | Change Log Entry |
|-------|--------|---------|------------------|-----------------|
| **@qa** | `*review` or `*gate` completes | PASS | `Done` | "✅ QA PASS - complete and approved" |
| **@qa** | `*review` or `*gate` completes | FAIL | `InProgress` | "❌ QA FAIL - return to @dev for fixes" |
| **@qa** | `*review` or `*gate` completes | CONCERNS | `Done` | "⚠️ QA CONCERNS - approved with observations" |
| **@qa** | `*review` or `*gate` completes | WAIVED | `Done` | "⚠️ QA WAIVED - approved with waiver documented" |
| **@dev** | Implementation complete | Ready for QA | `Ready for Review` | "Implementation complete - ready for QA review" |
| **@devops** | GitHub push succeeds | Pushed | `Done` | "✅ Pushed to GitHub: {commit-hash}" |

**Implementation:**
1. Update the `status: "..."` field at the top of the story file (YAML frontmatter)
2. Append a timestamped entry to the Change Log section with agent name + verdict
3. Do NOT create a new commit yet — that's handled by @devops

**Why:** 
- Story files are the source of truth for stakeholders and handoffs
- Gate files (`docs/qa/gates/`) are detailed reports but live in QA folder
- Status mismatch = confusion, missed handoffs, wasted time
- This is a process lock — not a suggestion, a requirement

**Enforcement:** This rule is in CLAUDE.md (permanent). All agents verify on activation.

### Code Standards
- Write clean, self-documenting code
- Follow existing patterns in the codebase
- Include comprehensive error handling
- Add unit tests for all new functionality
- Use TypeScript/JavaScript best practices

### Testing Requirements
- Run all tests before marking tasks complete
- Ensure linting passes: `npm run lint`
- Verify type checking: `npm run typecheck`
- Add tests for new features
- Test edge cases and error scenarios

<!-- AIOX-MANAGED-START: framework-structure -->
## AIOX Framework Structure

```
aiox-core/
├── agents/         # Agent persona definitions (YAML/Markdown)
├── tasks/          # Executable task workflows
├── workflows/      # Multi-step workflow definitions
├── templates/      # Document and code templates
├── checklists/     # Validation and review checklists
└── rules/          # Framework rules and patterns

docs/
├── stories/        # Development stories (numbered)
├── prd/            # Product requirement documents
├── architecture/   # System architecture documentation
└── guides/         # User and developer guides
```
<!-- AIOX-MANAGED-END: framework-structure -->

<!-- AIOX-MANAGED-START: framework-boundary -->
## Framework vs Project Boundary

O AIOX usa um modelo de 4 camadas (L1-L4) para separar artefatos do framework e do projeto. Deny rules em `.claude/settings.json` reforçam isso deterministicamente.

| Camada | Mutabilidade | Paths | Notas |
|--------|-------------|-------|-------|
| **L1** Framework Core | NEVER modify | `.aiox-core/core/`, `.aiox-core/constitution.md`, `bin/aiox.js`, `bin/aiox-init.js` | Protegido por deny rules |
| **L2** Framework Templates | NEVER modify | `.aiox-core/development/tasks/`, `.aiox-core/development/templates/`, `.aiox-core/development/checklists/`, `.aiox-core/development/workflows/`, `.aiox-core/infrastructure/` | Extend-only |
| **L3** Project Config | Mutable (exceptions) | `.aiox-core/data/`, `agents/*/MEMORY.md`, `core-config.yaml` | Allow rules permitem |
| **L4** Project Runtime | ALWAYS modify | `docs/stories/`, `packages/`, `squads/`, `tests/` | Trabalho do projeto |

**Toggle:** `core-config.yaml` → `boundary.frameworkProtection: true/false` controla se deny rules são ativas (default: true para projetos, false para contribuidores do framework).

> **Referência formal:** `.claude/settings.json` (deny/allow rules), `.claude/rules/agent-authority.md`
<!-- AIOX-MANAGED-END: framework-boundary -->

<!-- AIOX-MANAGED-START: rules-system -->
## Rules System

O AIOX carrega regras contextuais de `.claude/rules/` automaticamente. Regras com frontmatter `paths:` só carregam quando arquivos correspondentes são editados.

| Rule File | Description |
|-----------|-------------|
| `agent-authority.md` | Agent delegation matrix and exclusive operations |
| `agent-handoff.md` | Agent switch compaction protocol for context optimization |
| `agent-memory-imports.md` | Agent memory lifecycle and CLAUDE.md ownership |
| `coderabbit-integration.md` | Automated code review integration rules |
| `ids-principles.md` | Incremental Development System principles |
| `mcp-usage.md` | MCP server usage rules and tool selection priority |
| `story-lifecycle.md` | Story status transitions and quality gates |
| `workflow-execution.md` | 4 primary workflows (SDC, QA Loop, Spec Pipeline, Brownfield) |

> **Diretório:** `.claude/rules/` — rules são carregadas automaticamente pelo Claude Code quando relevantes.
<!-- AIOX-MANAGED-END: rules-system -->

<!-- PROJECT-START: essential-prd-context -->
## 🎯 PROJECT CONTEXT: Personalización SO (Windows 11 Customization Hub)

**CRITICAL: This context is extracted from `docs/prd/PRD-personalizacao-so.md` and MUST be remembered for all development decisions.**

### Vision & Core Purpose
- **What:** Desktop application that centralizes Windows 11 customization into a single visual interface
- **For Whom:** Non-technical Windows 11 Pro users (ages 25-50)
- **Why:** Reduce customization time from hours of trial-and-error to minutes of visual configuration
- **Key Value:** Save and instantly switch between customization profiles (Work, Gaming, Night Mode, etc.)

### Target Personas
| Persona | Age | Tech Level | Main Goal | Usage |
|---------|-----|-----------|-----------|-------|
| **Alex (Aesthetic User)** | 25-45 | Beginner-Intermediate | Make Windows look exactly as they want | Daily user, mood-driven |
| **Jordan (Workflow Optimizer)** | 30-50 | Intermediate | Create multiple workspace profiles | Frequent switcher |

### MVP Scope (v1.0 — Target: Q3 2026)
✅ **INCLUDED:**
- FR-WP: Static Wallpapers (JPEG, PNG, BMP, WEBP) with time-based scheduling + dynamic rotation
- FR-TB: Taskbar (Position, Transparency, Color, Visibility, Size, Icon customization)
- FR-TH: Theme (Light/Dark toggle + Accent Color picker)
- FR-KB: Keyboard Shortcuts (Inventory + Search only; custom shortcuts → v1.1)
- FR-PR: Profile System (Save/Load/Apply/Set as Default)

❌ **DEFERRED to v1.1:**
- Animated Wallpapers (GIF, MP4, WebM) — Complex Windows integration
- Custom Keyboard Shortcut Creation — Requires WinAPI hooking

❌ **OUT OF SCOPE (MVP):**
- Cloud sync / Profile roaming
- Multi-user profiles
- Start Menu customization
- File Explorer customization
- Cursor customization

### Technology Stack (LOCKED)
| Layer | Tech | Reason |
|-------|------|--------|
| **Runtime** | Electron v28+ | Single .exe, zero dependencies |
| **Frontend** | React 18 + TypeScript | Type-safe, component reusability |
| **Styling** | Tailwind CSS + Dark Mode | Fast, built-in dark theme |
| **State** | Zustand | Lightweight profile state management |
| **Build** | Vite | Fast dev server + optimized builds |
| **Backend/IPC** | Electron Main + node-windows | System integration |
| **Windows API** | node-ffi, windows-registry | Direct Registry access |
| **Storage** | JSON files + Registry | Simple, portable, human-readable |

### Key Modules Architecture
```
PersonalizacionSO.exe (Single Bundle)
├── Renderer (React UI)
│   ├── WallpaperPanel
│   ├── TaskbarPanel
│   ├── ThemePanel
│   ├── ShortcutsPanel
│   ├── ProfileManager
│   └── SettingsPanel
├── Main Process (Electron IPC)
│   ├── WallpaperService (scheduling, rotation)
│   ├── RegistryManager (theme, taskbar settings)
│   ├── ProfileManager (save/load/apply)
│   ├── TaskbarAPI (position, visibility, sizing)
│   └── SettingsHandler (app preferences)
└── OS Integration
    ├── Windows Registry
    ├── Win32/UWP APIs
    ├── File System
    └── Wallpaper Service
```

### Non-Functional Requirements (MUST HIT)
| Requirement | Target | Why Critical |
|-------------|--------|-------------|
| **Startup Time** | <2 seconds | UX responsiveness |
| **Settings Apply** | <500ms | Perceived performance |
| **Profile Apply** | <1 second | Quick switching |
| **Animated Wallpaper** | <10% CPU at idle | Energy efficiency (deferred v1.1) |
| **Admin Privileges** | NOT required for wallpaper; optional for taskbar/theme | Non-technical users must be able to do basic customization |
| **Portability** | Single .exe, no installer | Zero-friction distribution |
| **Reliability** | 99% uptime (no OS-level failures) | Trust with system integration |
| **Discoverability** | All features within 3 clicks | Non-technical users need clear navigation |
| **Learning Curve** | <5 minutes | Target persona requirement |

### Critical Windows API Constraints
⚠️ **Animated Wallpaper:** Not natively supported in Windows 11; requires custom solution (3rd-party service or workaround) → DEFERRED v1.1
⚠️ **Font Customization:** Limited in Windows 11 (DPI scaling only) → NOT IN MVP
⚠️ **Taskbar Customization:** Some elements controlled by Windows 11 defaults; may need Registry hacks or UWP APIs
⚠️ **Custom Shortcuts:** Cannot create custom shortcuts without WinAPI hooking → DEFERRED v1.1

### Success Metrics (Measure by)
| Metric | Target | Method |
|--------|--------|--------|
| Time to First Customization | <5 min | User testing |
| Profile Creation Success Rate | >95% | Error logging |
| Settings Apply Latency | <500ms avg | Performance metrics |
| Crash Rate | <0.1% | Telemetry (opt-in) |
| User Retention (30 days) | >70% | Download tracking |
| Profile Reuse Rate | >80% of users create 2+ | Usage analytics |

### Profile System (CORE FEATURE)
**Storage Location:** `%APPDATA%/PersonalizacionSO/profiles/` (JSON format)
**Profile Contents:** Wallpaper + Taskbar + Theme + Shortcuts selections
**Key Behaviors:**
- [ ] Save: Serialize current system state to JSON
- [ ] Load: Deserialize and apply to system
- [ ] Apply: Single-click instant activation
- [ ] Default: Set profile to auto-apply on system startup (skip with Shift+Launch)
- [ ] Persistence: Atomic all-or-nothing apply; automatic rollback on failure

### Roadmap (LOCKED)
**Phase 1: v1.0 (Q3 2026)** — MVP core features
**Phase 2: v1.1 (Q4 2026)** — Animated wallpapers + custom shortcuts
**Phase 3: v2.0 (Q1 2027)** — Cloud sync + multi-monitor + ecosystem

### CRITICAL: Assumptions & Dependencies
1. **Target OS:** Windows 11 Pro/Home (build 21H2+)
2. **User Permissions:** Local admin rights OR elevated UAC prompt for Registry access
3. **Dependencies:** Node.js 18+ (build-time only), Electron, React, Zustand, Tailwind, ffmpeg-wasm, gif.js
4. **Windows API Stability:** Subject to Microsoft changes in undocumented APIs

### Constraints on Implementation
🚫 **FORBIDDEN:** Inventing features not in MVP acceptance criteria
🚫 **FORBIDDEN:** Cloud sync in v1.0 (local-only)
🚫 **FORBIDDEN:** Animated wallpapers in MVP (static only)
🚫 **FORBIDDEN:** Custom shortcuts in MVP (inventory + search only)
✅ **REQUIRED:** All settings survive app restart (persistence)
✅ **REQUIRED:** All settings survive system restart (Registry + local storage)
✅ **REQUIRED:** Non-technical users can accomplish basic customization WITHOUT admin rights

<!-- PROJECT-END: essential-prd-context -->

<!-- AIOX-MANAGED-START: code-intelligence -->
## Code Intelligence

O AIOX possui um sistema de code intelligence opcional que enriquece operações com dados de análise de código.

| Status | Descrição | Comportamento |
|--------|-----------|---------------|
| **Configured** | Provider ativo e funcional | Enrichment completo disponível |
| **Fallback** | Provider indisponível | Sistema opera normalmente sem enrichment — graceful degradation |
| **Disabled** | Nenhum provider configurado | Funcionalidade de code-intel ignorada silenciosamente |

**Graceful Fallback:** Code intelligence é sempre opcional. `isCodeIntelAvailable()` verifica disponibilidade antes de qualquer operação. Se indisponível, o sistema retorna o resultado base sem modificação — nunca falha.

**Diagnóstico:** `aiox doctor` inclui check de code-intel provider status.

> **Referência:** `.aiox-core/core/code-intel/` — provider interface, enricher, client
<!-- AIOX-MANAGED-END: code-intelligence -->

<!-- AIOX-MANAGED-START: graph-dashboard -->
## Graph Dashboard

O CLI `aiox graph` visualiza dependências, estatísticas de entidades e status de providers.

### Comandos

```bash
aiox graph --deps                        # Dependency tree (ASCII)
aiox graph --deps --format=json          # Output como JSON
aiox graph --deps --format=html          # Interactive HTML (abre browser)
aiox graph --deps --format=mermaid       # Mermaid diagram
aiox graph --deps --format=dot           # DOT format (Graphviz)
aiox graph --deps --watch                # Live mode com auto-refresh
aiox graph --deps --watch --interval=10  # Refresh a cada 10 segundos
aiox graph --stats                       # Entity stats e cache metrics
```

**Formatos de saída:** ascii (default), json, dot, mermaid, html

> **Referência:** `.aiox-core/core/graph-dashboard/` — CLI, renderers, data sources
<!-- AIOX-MANAGED-END: graph-dashboard -->

## Workflow Execution

### Task Execution Pattern
1. Read the complete task/workflow definition
2. Understand all elicitation points
3. Execute steps sequentially
4. Handle errors gracefully
5. Provide clear feedback

### Interactive Workflows
- Workflows with `elicit: true` require user input
- Present options clearly
- Validate user responses
- Provide helpful defaults

## Best Practices

### When implementing features:
- Check existing patterns first
- Reuse components and utilities
- Follow naming conventions
- Keep functions focused and testable
- Document complex logic

### When working with agents:
- Respect agent boundaries
- Use appropriate agent for each task
- Follow agent communication patterns
- Maintain agent context

### When handling errors:
```javascript
try {
  // Operation
} catch (error) {
  console.error(`Error in ${operation}:`, error);
  // Provide helpful error message
  throw new Error(`Failed to ${operation}: ${error.message}`);
}
```

## Git & GitHub Integration

### Commit Conventions
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- Reference story ID: `feat: implement IDE detection [Story 2.1]`
- Keep commits atomic and focused

### GitHub CLI Usage
- Ensure authenticated: `gh auth status`
- Use for PR creation: `gh pr create`
- Check org access: `gh api user/memberships`

<!-- AIOX-MANAGED-START: aiox-patterns -->
## AIOX-Specific Patterns

### Working with Templates
```javascript
const template = await loadTemplate('template-name');
const rendered = await renderTemplate(template, context);
```

### Agent Command Handling
```javascript
if (command.startsWith('*')) {
  const agentCommand = command.substring(1);
  await executeAgentCommand(agentCommand, args);
}
```

### Story Updates
```javascript
// Update story progress
const story = await loadStory(storyId);
story.updateTask(taskId, { status: 'completed' });
await story.save();
```
<!-- AIOX-MANAGED-END: aiox-patterns -->

## Environment Setup

### Required Tools
- Node.js 18+
- GitHub CLI
- Git
- Your preferred package manager (npm/yarn/pnpm)

### Configuration Files
- `.aiox/config.yaml` - Framework configuration
- `.env` - Environment variables
- `aiox.config.js` - Project-specific settings

<!-- AIOX-MANAGED-START: common-commands -->
## Common Commands

### AIOX Master Commands
- `*help` - Show available commands
- `*create-story` - Create new story
- `*task {name}` - Execute specific task
- `*workflow {name}` - Run workflow

### Development Commands
- `npm run dev` - Start development
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run build` - Build project
<!-- AIOX-MANAGED-END: common-commands -->

## Debugging

### Enable Debug Mode
```bash
export AIOX_DEBUG=true
```

### View Agent Logs
```bash
tail -f .aiox/logs/agent.log
```

### Trace Workflow Execution
```bash
npm run trace -- workflow-name
```

## Claude Code Specific Configuration

### Performance Optimization
- Prefer batched tool calls when possible for better performance
- Use parallel execution for independent operations
- Cache frequently accessed data in memory during sessions

### Tool Usage Guidelines
- Always use the Grep tool for searching, never `grep` or `rg` in bash
- Use the Task tool for complex multi-step operations
- Batch file reads/writes when processing multiple files
- Prefer editing existing files over creating new ones

### Session Management
- Track story progress throughout the session
- Update checkboxes immediately after completing tasks
- Maintain context of the current story being worked on
- Save important state before long-running operations

### Error Recovery
- Always provide recovery suggestions for failures
- Include error context in messages to user
- Suggest rollback procedures when appropriate
- Document any manual fixes required

### Testing Strategy
- Run tests incrementally during development
- Always verify lint and typecheck before marking complete
- Test edge cases for each new feature
- Document test scenarios in story files

### Documentation
- Update relevant docs when changing functionality
- Include code examples in documentation
- Keep README synchronized with actual behavior
- Document breaking changes prominently

---
*Synkra AIOX Claude Code Configuration v2.0*
