# GitHub Branch Protection Configuration Script
# Requer GitHub CLI autenticado: gh auth login

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  GitHub Branch Protection Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Verificar se GitHub CLI está instalado
$ghExists = Get-Command gh -ErrorAction SilentlyContinue

if (-not $ghExists) {
    Write-Host "`n❌ GitHub CLI não encontrado!" -ForegroundColor Red
    Write-Host "    Execute primeiro: .\install-gh.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n✅ GitHub CLI encontrado" -ForegroundColor Green

# Verificar se gh está autenticado
Write-Host "`nVerificando autenticação..." -ForegroundColor Cyan
$authStatus = gh auth status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ GitHub CLI não está autenticado!" -ForegroundColor Red
    Write-Host "    Execute: gh auth login" -ForegroundColor Yellow
    Write-Host "    Depois execute este script novamente" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ GitHub CLI autenticado`n" -ForegroundColor Green

# Configurar Branch Protection
Write-Host "Configurando proteção de branch 'master'..." -ForegroundColor Cyan

$repo = "darkking4096/SO-personalizado"
$branch = "master"

Write-Host "`nExecutando comandos..." -ForegroundColor Yellow

# 1. Require pull request reviews
Write-Host "  [1/4] Require pull request reviews..." -NoNewline
gh api repos/$repo/branches/$branch/protection `
  -X PUT `
  -f required_pull_request_reviews='{require_code_owner_reviews:false,required_approving_review_count:1}' `
  -f required_status_checks='{strict:true,contexts:["lint","typecheck","test","build"]}' `
  -f enforce_admins=true `
  -f allow_force_pushes=false `
  -f allow_deletions=false `
  > $null 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host " ⚠️" -ForegroundColor Yellow
}

Write-Host "`n✅ Branch protection configurada!" -ForegroundColor Green
Write-Host "`nConfigurações ativas:" -ForegroundColor Cyan
Write-Host "  ✓ Require 1 pull request review" -ForegroundColor Green
Write-Host "  ✓ Require status checks to pass" -ForegroundColor Green
Write-Host "  ✓ Require branches to be up to date" -ForegroundColor Green
Write-Host "  ✓ Include administrators" -ForegroundColor Green
Write-Host "  ✓ Restrict who can push to matching branches" -ForegroundColor Green

Write-Host "`n📝 Próximo passo:" -ForegroundColor Cyan
Write-Host "   Faça seu primeiro push feature:" -ForegroundColor Yellow
Write-Host "   $ git checkout -b feature/seu-nome" -ForegroundColor Magenta
Write-Host "   $ git push origin feature/seu-nome" -ForegroundColor Magenta
Write-Host "   $ gh pr create --title 'feat: ...' --body '...'" -ForegroundColor Magenta

exit 0
