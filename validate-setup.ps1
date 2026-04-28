# Complete Setup Validation Script
# Verifica status de todas as dependências e configurações

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Setup Validation Report" -ForegroundColor Cyan
Write-Host "  Personalización SO - DevOps Checker" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$checksPass = 0
$checksFail = 0

function Check-Item {
    param(
        [string]$Name,
        [scriptblock]$Test,
        [string]$FixCommand = ""
    )

    Write-Host "Verificando: $Name..." -NoNewline

    try {
        $result = & $Test
        if ($result) {
            Write-Host " ✅" -ForegroundColor Green
            $global:checksPass++
            return $true
        } else {
            Write-Host " ❌" -ForegroundColor Red
            if ($FixCommand) {
                Write-Host "  Fix: $FixCommand" -ForegroundColor Yellow
            }
            $global:checksFail++
            return $false
        }
    } catch {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Yellow
        $global:checksFail++
        return $false
    }
}

# ========== GIT CHECKS ==========
Write-Host "`n[Git]" -ForegroundColor Magenta
Check-Item "Git instalado" { git --version }
Check-Item "Repository inicializado" { Test-Path ".git" }
Check-Item "Remote origin configurado" { git remote get-url origin | Select-String "SO-personalizado" }
Check-Item "Branch master existe" { git rev-parse --verify master }
Check-Item "Working tree limpo" { (git status --porcelain | Measure-Object -Line).Lines -eq 0 }

# ========== NODE/NPM CHECKS ==========
Write-Host "`n[Node.js & npm]" -ForegroundColor Magenta
Check-Item "Node.js instalado" { node --version }
Check-Item "npm instalado" { npm --version }
Check-Item "package.json existe" { Test-Path "package.json" }
Check-Item "node_modules existe" { Test-Path "node_modules" }
Check-Item "npm dependencies resolvem" { npm ls --depth=0 2>$null; $LASTEXITCODE -eq 0 }

# ========== BUILD CHECKS ==========
Write-Host "`n[Build & Scripts]" -ForegroundColor Magenta
Check-Item "npm run lint disponível" {
    $json = Get-Content package.json | ConvertFrom-Json
    $json.scripts.lint -ne $null
}
Check-Item "npm run typecheck disponível" {
    $json = Get-Content package.json | ConvertFrom-Json
    $json.scripts.typecheck -ne $null
}
Check-Item "npm run test disponível" {
    $json = Get-Content package.json | ConvertFrom-Json
    $json.scripts.test -ne $null
}
Check-Item "npm run build disponível" {
    $json = Get-Content package.json | ConvertFrom-Json
    $json.scripts.build -ne $null
}

# ========== GITHUB CHECKS ==========
Write-Host "`n[GitHub & CI/CD]" -ForegroundColor Magenta
Check-Item ".github/workflows/ existe" { Test-Path ".github/workflows" }
Check-Item "build.yml workflow existe" { Test-Path ".github/workflows/build.yml" }
Check-Item "GitHub CLI instalado" { Get-Command gh -ErrorAction SilentlyContinue }

$ghAuth = $false
if (Get-Command gh -ErrorAction SilentlyContinue) {
    $authTest = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        $ghAuth = $true
    }
}
Check-Item "GitHub CLI autenticado" { $ghAuth }

# ========== DOCUMENTATION CHECKS ==========
Write-Host "`n[Documentation]" -ForegroundColor Magenta
Check-Item "SETUP-CHECKLIST.md existe" { Test-Path "SETUP-CHECKLIST.md" }
Check-Item "DEVOPS-INIT-REPORT.md existe" { Test-Path "DEVOPS-INIT-REPORT.md" }
Check-Item "PRE-PUSH-CHECKLIST.txt existe" { Test-Path "PRE-PUSH-CHECKLIST.txt" }
Check-Item ".env exemplo existe" { Test-Path ".env.example" }

# ========== SUMMARY ==========
Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$total = $checksPass + $checksFail
$percentPass = if ($total -gt 0) { [math]::Round(($checksPass / $total) * 100) } else { 0 }

Write-Host "`n✅ Passed: $checksPass" -ForegroundColor Green
Write-Host "❌ Failed: $checksFail" -ForegroundColor Red
Write-Host "📊 Score: $percentPass% ($checksPass/$total)" -ForegroundColor Cyan

if ($percentPass -eq 100) {
    Write-Host "`n🚀 SETUP COMPLETO! Pronto para desenvolvimento." -ForegroundColor Green
    Write-Host "`nProximos passos:" -ForegroundColor Cyan
    Write-Host "  1. npm run dev          (start dev server)" -ForegroundColor Yellow
    Write-Host "  2. git checkout -b ...  (create feature branch)" -ForegroundColor Yellow
    Write-Host "  3. gh pr create         (create pull request)" -ForegroundColor Yellow
} elseif ($percentPass -ge 80) {
    Write-Host "`n⚠️  SETUP QUASE COMPLETO. Algumas dependências faltando." -ForegroundColor Yellow
    Write-Host "`nRecomendações:" -ForegroundColor Cyan
    Write-Host "  • GitHub CLI: .\install-gh.ps1" -ForegroundColor Yellow
    Write-Host "  • Branch protection: .\setup-branch-protection.ps1" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ SETUP INCOMPLETO. Verifique os erros acima." -ForegroundColor Red
}

Write-Host ""
exit if ($checksFail -eq 0) { 0 } else { 1 }
