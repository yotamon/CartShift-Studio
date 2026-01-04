# PowerShell script to kill existing Next.js processes and start dev server
# Usage: .\scripts\dev-force-simple.ps1

Write-Host "Checking for existing Next.js dev processes..." -ForegroundColor Cyan

# Simple approach: Kill all node.exe processes
# This is aggressive but effective for development
$taskkillResult = taskkill /IM node.exe /F 2>&1
$taskkillExitCode = $LASTEXITCODE

if ($taskkillExitCode -eq 0) {
    Write-Host "Terminated all Node.js processes." -ForegroundColor Red
    # Wait a moment for processes to fully terminate
    Start-Sleep -Seconds 3
} elseif ($taskkillResult -like "*not found*") {
    Write-Host "No Node.js processes found to terminate." -ForegroundColor Green
} else {
    Write-Host "Taskkill completed with warnings, continuing..." -ForegroundColor Yellow
}

# Clear Next.js cache to ensure clean start
Write-Host "Clearing Next.js cache..." -ForegroundColor Cyan
if (Test-Path ".next") {
    try {
        Remove-Item -Recurse -Force ".next" -ErrorAction Stop
        Write-Host "  Cache cleared successfully." -ForegroundColor Green
    } catch {
        Write-Host "  Failed to clear cache: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Start the dev server
Write-Host "Starting Next.js development server..." -ForegroundColor Green
Write-Host "Command: pnpm run dev" -ForegroundColor Gray
Write-Host ""

try {
    & pnpm run dev
} catch {
    Write-Host "Failed to start dev server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}