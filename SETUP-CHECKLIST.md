# 🚀 Setup Checklist Completo — Personalización SO

**Data:** 2026-04-28  
**Repositório:** https://github.com/darkking4096/SO-personalizado  
**Status Inicial:** Git inicializado, remoto configurado, branch master limpa

---

## ✅ Etapa 1: GitHub CLI (Manual — REQUER AÇÃO DO USUÁRIO)

GitHub CLI não está instalado no sistema. Escolha uma opção:

### Opção A: Installer Oficial (Recomendado)
1. Acesse: https://github.com/cli/cli/releases
2. Baixe: `gh_*_windows_amd64.exe` (versão mais recente)
3. Execute o instalador
4. Abra novo terminal e verifique: `gh --version`
5. Autentique: `gh auth login` (siga as instruções)
6. Confirme acesso: `gh auth status`

### Opção B: Scoop (Se instalado)
```bash
scoop install gh
gh auth login
```

### Opção C: Chocolatey (Se instalado)
```bash
choco install gh
gh auth login
```

**Status:** ⏳ PENDENTE

---

## ✅ Etapa 2: Estrutura de Projeto Local

**Verificação:**
```bash
cd "C:\Users\HomePC\Desktop\Projetos\Personalização SO"
git status
```

**Status:** ✅ COMPLETO
- ✅ Git inicializado
- ✅ Remoto `origin` aponta para https://github.com/darkking4096/SO-personalizado
- ✅ Branch master limpa, sem mudanças pendentes

---

## ✅ Etapa 3: GitHub Actions (Workflows CI/CD)

**O que fazer:**
1. Crie a pasta `.github/workflows/` no repositório:
   ```bash
   mkdir -p .github/workflows
   ```

2. Crie arquivo `.github/workflows/ci-lint-test.yml`:
   ```yaml
   name: CI - Lint & Test

   on:
     push:
       branches: [main, master, develop]
     pull_request:
       branches: [main, master, develop]

   jobs:
     lint:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run lint --if-present

     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm test --if-present

     typecheck:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run typecheck --if-present
   ```

3. Commit e push:
   ```bash
   git add .github/
   git commit -m "chore: setup GitHub Actions CI/CD"
   git push origin master
   ```

**Status:** ⏳ PENDENTE

---

## ✅ Etapa 4: Branch Protection (GitHub Web)

**O que fazer:**
1. Acesse: https://github.com/darkking4096/SO-personalizado/settings/branches
2. Clique em "Add rule"
3. Configure para branch `master`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators
4. Salve

**Status:** ⏳ PENDENTE (Requer acesso GitHub Web)

---

## ✅ Etapa 5: CodeRabbit (Opcional mas Recomendado)

**O que fazer:**
1. Acesse: https://coderabbit.ai
2. Clique "Sign in with GitHub"
3. Autorize acesso para repositórios
4. Selecione: `darkking4096/SO-personalizado`
5. CodeRabbit vai automaticamente revisar PRs

**Status:** ⏳ PENDENTE (Recomendado)

---

## ✅ Etapa 6: Package.json & Scripts

Se o projeto for Node.js/Electron, garanta que `package.json` tem:

```json
{
  "name": "personalizacao-so",
  "scripts": {
    "dev": "...",
    "build": "...",
    "test": "...",
    "lint": "...",
    "typecheck": "..."
  },
  "devDependencies": {}
}
```

**Status:** ⏳ VERIFICAR

---

## ✅ Etapa 7: Git Hooks (Pré-commit)

Crie `.husky/pre-commit` para rodar linting antes de commit:

```bash
npx husky install
npx husky add .husky/pre-commit "npm run lint"
```

**Status:** ⏳ PENDENTE

---

## ✅ Etapa 8: Environment Variables (.env)

Se houver variáveis de ambiente necessárias, crie `.env.example`:

```bash
# .env.example — Copie para .env e preencha valores reais
DATABASE_URL=
API_KEY=
NODE_ENV=development
```

**Status:** ⏳ VERIFICAR

---

## 📋 Checklist Final

### Antes de Fazer Qualquer Push:

- [ ] GitHub CLI instalado e autenticado (`gh auth status`)
- [ ] `.github/workflows/` configurado
- [ ] Branch protection ativa em `master`
- [ ] CodeRabbit integrado (opcional)
- [ ] `package.json` com scripts válidos
- [ ] `.husky` configurado (opcional mas recomendado)
- [ ] `.env.example` presente (se necessário)
- [ ] Nenhuma mudança pendente (`git status` limpo)

### Workflow Padrão para Push:

1. **Crie feature branch:**
   ```bash
   git checkout -b feature/sua-feature
   ```

2. **Faça mudanças e commit:**
   ```bash
   git add .
   git commit -m "feat: descrição"
   ```

3. **Push para remoto:**
   ```bash
   git push origin feature/sua-feature
   ```

4. **Crie PR via GitHub Web ou CLI:**
   ```bash
   gh pr create --title "..." --body "..."
   ```

5. **Aguarde CI/CD pass:**
   - GitHub Actions roda automaticamente
   - CodeRabbit revisa código (se configurado)
   - Branch protection previne merge sem aprovação

6. **Merge aprovado:**
   ```bash
   gh pr merge --squash
   ```

---

## 🔧 Próximos Passos (Gage)

Quando você tiver completado o checklist acima, execute:

```bash
*health-check
```

Isso vai verificar:
- ✅ Git status
- ✅ GitHub CLI autenticado
- ✅ Workflows configurados
- ✅ Branch protection ativa
- ✅ Package.json válido
- ✅ Hooks instalados
- ✅ Environment variables corretos

---

## 📞 Suporte

Se der problema em qualquer etapa, rode:

```bash
*detect-repo
```

Isso vai diagnosticar o estado atual do repositório.

---

**Criado por:** Gage (DevOps Agent)  
**Atualizado:** 2026-04-28  
**Repositório:** https://github.com/darkking4096/SO-personalizado
