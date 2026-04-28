# GitHub CLI Installation Script for Windows
# Ejecute en PowerShell como ADMINISTRADOR
# Right-click PowerShell → Run as Administrator
# Então execute: .\install-gh.ps1

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  GitHub CLI Installation Script" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Verificar se está rodando como admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "`n❌ ERRO: Script precisa rodar como ADMINISTRADOR" -ForegroundColor Red
    Write-Host "    1. Abra PowerShell como Admin (Right-click → Run as Administrator)" -ForegroundColor Yellow
    Write-Host "    2. Execute: .\install-gh.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n✅ Rodando como Administrator`n" -ForegroundColor Green

# Opção 1: Tentar com Winget (se disponível no Windows 11)
Write-Host "Tentando instalar com winget..." -ForegroundColor Cyan
$wingetExists = Get-Command winget -ErrorAction SilentlyContinue

if ($wingetExists) {
    Write-Host "  winget encontrado. Instalando GitHub CLI..." -ForegroundColor Green
    winget install --id GitHub.cli -h
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ GitHub CLI instalado com sucesso!" -ForegroundColor Green
        Write-Host "`nProximos passos:" -ForegroundColor Cyan
        Write-Host "  1. Abra novo PowerShell/Terminal" -ForegroundColor Yellow
        Write-Host "  2. Execute: gh auth login" -ForegroundColor Yellow
        Write-Host "  3. Siga as instruções" -ForegroundColor Yellow
        exit 0
    }
}

# Opção 2: Tentar com Scoop (se instalado)
Write-Host "`nTentando instalar com Scoop..." -ForegroundColor Cyan
$scoopExists = Get-Command scoop -ErrorAction SilentlyContinue

if ($scoopExists) {
    Write-Host "  Scoop encontrado. Instalando GitHub CLI..." -ForegroundColor Green
    scoop install gh
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ GitHub CLI instalado com sucesso!" -ForegroundColor Green
        Write-Host "`nProximos passos:" -ForegroundColor Cyan
        Write-Host "  1. Abra novo PowerShell/Terminal" -ForegroundColor Yellow
        Write-Host "  2. Execute: gh auth login" -ForegroundColor Yellow
        Write-Host "  3. Siga as instruções" -ForegroundColor Yellow
        exit 0
    }
}

# Opção 3: Tentar com Chocolatey (se instalado)
Write-Host "`nTentando instalar com Chocolatey..." -ForegroundColor Cyan
$chocoExists = Get-Command choco -ErrorAction SilentlyContinue

if ($chocoExists) {
    Write-Host "  Chocolatey encontrado. Instalando GitHub CLI..." -ForegroundColor Green
    choco install gh -y
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ GitHub CLI instalado com sucesso!" -ForegroundColor Green
        Write-Host "`nProximos passos:" -ForegroundColor Cyan
        Write-Host "  1. Abra novo PowerShell/Terminal" -ForegroundColor Yellow
        Write-Host "  2. Execute: gh auth login" -ForegroundColor Yellow
        Write-Host "  3. Siga as instruções" -ForegroundColor Yellow
        exit 0
    }
}

# Se nenhuma opção funcionou
Write-Host "`n❌ NENHUM GERENCIADOR DE PACOTES ENCONTRADO" -ForegroundColor Red
Write-Host "`nOpções:" -ForegroundColor Cyan
Write-Host "  A) Instale winget (vem com Windows 11)" -ForegroundColor Yellow
Write-Host "     https://apps.microsoft.com/detail/9NBLGGH4NNS1" -ForegroundColor Magenta
Write-Host "`n  B) Instale Scoop:" -ForegroundColor Yellow
Write-Host "     irm get.scoop.sh | iex" -ForegroundColor Magenta
Write-Host "`n  C) Instale Chocolatey:" -ForegroundColor Yellow
Write-Host "     https://chocolatey.org/install" -ForegroundColor Magenta
Write-Host "`n  D) Baixe instalador direto:" -ForegroundColor Yellow
Write-Host "     https://github.com/cli/cli/releases" -ForegroundColor Magenta
Write-Host "     → Procure por: gh_*_windows_amd64.exe" -ForegroundColor Magenta

exit 1
