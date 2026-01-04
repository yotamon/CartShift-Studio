# PowerShell script to kill existing Next.js processes and start dev server
# Usage: .\scripts\dev-force.ps1

Write-Host "🔍 Checking for existing Next.js dev processes..." -ForegroundColor Cyan

# Method 1: Try to kill by window title (works if Next.js sets window title)
$taskkillResult = taskkill /IM node.exe /FI "WINDOWTITLE eq next dev*" /F 2>&1
$taskkillExitCode = $LASTEXITCODE

if ($taskkillExitCode -eq 0) {
    Write-Host "🛑 Terminated Next.js dev processes (by window title)." -ForegroundColor Red
    Start-Sleep -Seconds 2
} else {
    Write-Host "🔄 Window title method didn't find processes, trying alternative methods..." -ForegroundColor Yellow

    # Method 2: Kill all node processes that have "next" in their command line or path
    $killedCount = 0
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    foreach ($proc in $nodeProcesses) {
        $shouldKill = $false

        # Check command line for next-related processes
        if ($proc.CommandLine -and ($proc.CommandLine -like "*next*" -or $proc.CommandLine -like "*turbo*" -or $proc.CommandLine -like "*CartShift*")) {
            $shouldKill = $true
        }

        # If we can't check command line, try checking modules
        if (-not $shouldKill) {
            try {
                $modules = Get-Process -Id $proc.Id -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Modules -ErrorAction SilentlyContinue
                if ($modules) {
                    foreach ($module in $modules) {
                        if ($module.FileName -like "*next*" -or $module.FileName -like "*CartShift*") {
                            $shouldKill = $true
                            break
                        }
                    }
                }
            } catch {
                # Continue if we can't check modules
            }
        }

        if ($shouldKill) {
            try {
                Stop-Process -Id $proc.Id -Force -ErrorAction Stop
                Write-Host "   ✓ Terminated Next.js process (PID: $($proc.Id))" -ForegroundColor Green
                $killedCount++
            } catch {
                Write-Host "   ✗ Failed to terminate PID: $($proc.Id) - $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }

    if ($killedCount -gt 0) {
        Write-Host "🛑 Terminated $killedCount Next.js-related process(es)." -ForegroundColor Red
        Start-Sleep -Seconds 2
    } else {
        Write-Host "✅ No Next.js dev processes found to terminate." -ForegroundColor Green
    }

# Clear Next.js cache to ensure clean start
Write-Host "🧹 Clearing Next.js cache..." -ForegroundColor Cyan
if (Test-Path ".next") {
    try {
        Remove-Item -Recurse -Force ".next" -ErrorAction Stop
        Write-Host "   ✓ Cache cleared successfully." -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Failed to clear cache: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Start the dev server
Write-Host "🚀 Starting Next.js development server..." -ForegroundColor Green
Write-Host "   Command: pnpm run dev" -ForegroundColor Gray
Write-Host ""

try {
    & pnpm run dev
} catch {
    Write-Host "❌ Failed to start dev server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}