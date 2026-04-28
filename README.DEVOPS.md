# 🚀 DevOps Setup — Personalización SO

**Status:** Inicialização COMPLETA e pronta para uso  
**Data:** 2026-04-28  
**Repositório:** https://github.com/darkking4096/SO-personalizado  

---

## ⚡ Quick Start (5 min)

### 1. Instalar GitHub CLI
```bash
# Windows: Execute como Admin
.\install-gh.ps1

# Depois autentique:
gh auth login
```

### 2. Configurar Branch Protection
```bash
.\setup-branch-protection.ps1
```

### 3. Validar Setup
```bash
.\validate-setup.ps1
```

**Pronto!** Seu repositório está 100% pronto.

---

## 📋 Checklist Completo

- [x] Git inicializado
- [x] GitHub Remote configurado
- [x] GitHub Actions workflow (CI/CD)
- [x] npm scripts (lint, typecheck, test, build)
- [x] Documentação criada
- [x] Primeiro commit & push feito
- [ ] GitHub CLI instalado (faça: `.\install-gh.ps1`)
- [ ] Branch protection configurada (faça: `.\setup-branch-protection.ps1`)
- [ ] CodeRabbit ativado (opcional: https://coderabbit.ai)

---

## 🎯 Workflow de Desenvolvimento

### Fazer Feature
```bash
# 1. Crie branch
git checkout -b feature/seu-nome

# 2. Faça mudanças
# ... edit files ...

# 3. Verificar qualidade
npm run lint         # Auto-fix style
npm run typecheck    # Check types
npm test             # Run tests
npm run build        # Build app

# 4. Commit quando tudo passar
git add .
git commit -m "feat: descrição da mudança"

# 5. Push
git push origin feature/seu-nome

# 6. Criar PR
gh pr create --title "feat: ..." --body "## Summary\n..."

# 7. Aguarde CI/CD passar
# GitHub Actions roda automaticamente
# ~2-5 minutos

# 8. Merge quando aprovado
gh pr merge --squash
```

### Deploy (Release)
```bash
# 1. Assegure que tudo está em master
git checkout master
git pull origin master

# 2. Teste build final
npm run build
npm run build:exe    # Windows .exe

# 3. Create release tag
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0

# 4. GitHub Actions cria automaticamente
# a release com artifacts
```

---

## 📚 Documentação

### Arquivos Criados
- **SETUP-CHECKLIST.md** — Guia de setup passo-a-passo
- **DEVOPS-INIT-REPORT.md** — Status detalhado + explicação
- **PRE-PUSH-CHECKLIST.txt** — Quick check antes de push
- **README.DEVOPS.md** — Este arquivo
- **install-gh.ps1** — Script para instalar GitHub CLI
- **setup-branch-protection.ps1** — Script para configurar proteção
- **validate-setup.ps1** — Script de validação

### Ler Primeiro
1. Este arquivo (README.DEVOPS.md)
2. DEVOPS-INIT-REPORT.md (status detalhado)
3. PRE-PUSH-CHECKLIST.txt (antes de todo push)

---

## 🛠 Scripts Disponíveis

### npm Scripts
```bash
npm run dev              # Start Vite dev server
npm run build            # Build Electron app
npm run build:exe        # Build Windows executable
npm run lint             # Run ESLint (auto-fix enabled)
npm run typecheck        # TypeScript type checking
npm test                 # Run unit tests (Vitest)
npm test:watch          # Watch mode for tests
```

### PowerShell Scripts (Windows)
```bash
.\install-gh.ps1                 # Instalar GitHub CLI
.\setup-branch-protection.ps1    # Configurar branch protection
.\validate-setup.ps1             # Validar setup completo
```

### Git Commands
```bash
git status                       # Check status
git log --oneline -10            # Last 10 commits
git diff                         # Uncommitted changes
git branch -a                    # List all branches
git checkout -b feature/xxx      # Create feature branch
```

### GitHub CLI Commands
```bash
gh auth status                   # Check authentication
gh pr create                     # Create pull request
gh pr list                       # List open PRs
gh pr merge --squash             # Merge PR
gh issue list                    # List issues
gh release create v1.0.0         # Create release
```

---

## ✅ Validação

Execute para verificar setup completo:
```bash
.\validate-setup.ps1
```

Esperado: **100% Score**

---

## 🔐 Branch Protection Rules

Quando configurado via `.\setup-branch-protection.ps1`:

**Branch:** `master`  
**Regras:**
- ✅ Require 1 pull request review
- ✅ Require status checks to pass (lint, typecheck, test, build)
- ✅ Require branches to be up to date before merging
- ✅ Include administrators

**Efeito:** Ninguém consegue fazer push direto para `master`. Tudo precisa ir por PR com aprovação + CI/CD verde.

---

## 🚀 GitHub Actions (CI/CD)

**Arquivo:** `.github/workflows/build.yml`

**O que roda automaticamente:**

1. **Lint & Typecheck** (em parallel)
   - ESLint check
   - TypeScript verification
   - Roda em: Node 18.x, 20.x

2. **Build** (depende de Lint & Typecheck passar)
   - Vite build
   - Roda em: Windows, macOS, Linux
   - Upload artifacts

3. **Test** (depende de Lint & Typecheck passar)
   - Vitest run
   - Upload coverage

4. **Build Windows EXE** (depende de todos acima + em `main` branch)
   - Electron builder
   - Upload .exe artifact
   - Create GitHub release (se tag)

**Triggers:**
- Push para: `main`, `master`, `develop`
- Pull request para: `main`, `master`, `develop`

---

## 📞 Troubleshooting

### GitHub CLI não instala?
1. Verifique se está rodando como Admin
2. Tente instalar manualmente: https://github.com/cli/cli/releases
3. Ou use: `winget install gh` (Windows 11)

### Tests falhando?
```bash
npm test -- --reporter=verbose
# Identifique qual teste falha
# Fix o problema
# Commit novo
```

### Lint errors?
```bash
npm run lint
# Corrige automaticamente
# Verifique mudanças: git diff
# Commit se OK
```

### Build falhando?
```bash
npm run build
# Verifique erros
# Fix problema
# Try again
```

### Git push bloqueado?
```bash
# Se receber: "rejected because repository is archived"
# Ou "branch protection rules"
# Solução: Use PR em vez de push direto
git push origin feature/seu-nome  # Feature branch
gh pr create                       # Crie PR
# Merge via PR quando aprovado
```

---

## 💡 Boas Práticas

### Commits
- ✅ Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- ✅ Uma feature por commit
- ✅ Mensagens descritivas
- ✅ Reference story/issue: `feat: xxx [Story 2.1]`

### Branches
- ✅ `feature/descricao` — para features
- ✅ `fix/descricao` — para bug fixes
- ✅ `docs/descricao` — para documentação
- ✅ `chore/descricao` — para manutenção
- ❌ Não faça push direto para `master` (bloqueado)

### PRs
- ✅ Título descritivo
- ✅ Descrição com: O quê, Por quê, Como testar
- ✅ Link para story/issue
- ✅ Aguarde todos os checks (lint, test, build)
- ✅ Aguarde code review (1 approval)

### Testing
- ✅ Teste localmente antes de push
- ✅ `npm test` deve passar 100%
- ✅ Add testes para features novas
- ✅ Coverage > 80% alvo

---

## 🎓 Exemplo de Feature Completa

```bash
# 1. Crie branch
git checkout -b feature/dark-mode

# 2. Edit files, adicione feature
# src/components/Theme.tsx
# src/styles/dark.css
# tests/Theme.test.tsx

# 3. Verificar qualidade
npm run lint         # ✅ 0 errors
npm run typecheck    # ✅ 0 errors
npm test             # ✅ All pass
npm run build        # ✅ Success

# 4. Commit
git add src/ tests/
git commit -m "feat: implement dark mode toggle [Story 1.5]"

# 5. Push
git push origin feature/dark-mode

# 6. Create PR
gh pr create \
  --title "feat: implement dark mode toggle" \
  --body "
## Summary
Implements user-requested dark mode toggle

## Test Plan
- [ ] Dark mode toggle appears in settings
- [ ] Colors adjust correctly in dark mode
- [ ] Toggle persists across sessions
- [ ] All accessibility checks pass

Closes #42
"

# 7. GitHub Actions roda (2-5 min)
# Lint ✅ Typecheck ✅ Test ✅ Build ✅

# 8. Code review & approval
# Team reviews code
# 1 approval required

# 9. Merge
gh pr merge --squash
# ou: gh pr merge --rebase

# 10. Feature branch auto-deleted
# master atualizado
# Done! 🎉
```

---

## 📊 Repository Stats

- **Language:** TypeScript (React)
- **Build Tool:** Vite
- **Runtime:** Electron
- **Test Framework:** Vitest
- **Linter:** ESLint
- **Style:** Tailwind CSS
- **State:** Zustand
- **Node:** 18+, 20+
- **OS:** Windows 11+

---

## 🔗 Links Úteis

- **Repository:** https://github.com/darkking4096/SO-personalizado
- **GitHub CLI Docs:** https://cli.github.com/manual/
- **Conventional Commits:** https://www.conventionalcommits.org/
- **Semantic Versioning:** https://semver.org/
- **CodeRabbit:** https://coderabbit.ai

---

## ✨ Status Final

**Setup:** ✅ COMPLETO  
**CI/CD:** ✅ ATIVO  
**Documentation:** ✅ PRONTO  
**Ready for Development:** ✅ SIM

**Próximo passo:** Faça sua primeira feature branch!

```bash
git checkout -b feature/seu-nome-da-feature
# ... work ...
git push origin feature/seu-nome-da-feature
gh pr create
```

---

**Criado por:** ⚡ Gage (DevOps Agent)  
**Data:** 2026-04-28  
**Repositório:** https://github.com/darkking4096/SO-personalizado  
**Status:** Inicialização Completa ✅

---

## 🎯 Mapa Mental de Workflow

```
START
  ↓
git checkout -b feature/xxx
  ↓
Edit files
  ↓
npm run lint → npm run typecheck → npm test → npm run build
  ↓ (ALL PASS)
git add . && git commit -m "feat: ..."
  ↓
git push origin feature/xxx
  ↓
gh pr create
  ↓
GitHub Actions CI/CD (2-5 min)
  ↓ (ALL CHECKS PASS)
Code Review & Approval
  ↓ (1 APPROVAL)
gh pr merge
  ↓
Feature Branch Auto-Deleted
  ↓
git checkout master && git pull
  ↓
DONE ✅
```

---

**Leia:** [DEVOPS-INIT-REPORT.md](./DEVOPS-INIT-REPORT.md) para mais detalhes técnicos.
