@echo off
echo 🔍 Checking for existing Next.js dev processes...

REM Kill existing Next.js dev processes
taskkill /IM node.exe /FI "WINDOWTITLE eq next dev*" /F >nul 2>&1
if %errorlevel% == 0 (
    echo 🛑 Terminated existing Next.js dev processes.
    timeout /t 2 /nobreak >nul
) else (
    REM Try to find processes by command line
    for /f "tokens=2" %%i in ('tasklist /fi "imagename eq node.exe" /nh ^| findstr /c:"next"') do (
        echo 📋 Found potential Next.js process (PID: %%i)
        echo 🛑 Terminating process...
        taskkill /PID %%i /F >nul 2>&1
        if !errorlevel! == 0 (
            echo    ✓ Terminated PID: %%i
            timeout /t 2 /nobreak >nul
            goto :found_process
        ) else (
            echo    ✗ Failed to terminate PID: %%i
        )
    )
    echo ✅ No existing Next.js dev processes found.
    goto :continue
)

:found_process
echo 🛑 Existing processes terminated.
goto :cleanup

:continue
echo ✅ No existing Next.js dev processes found.

:cleanup
REM Clear Next.js cache
echo 🧹 Clearing Next.js cache...
if exist ".next" (
    rmdir /s /q ".next" >nul 2>&1
    if %errorlevel% == 0 (
        echo    ✓ Cache cleared successfully.
    ) else (
        echo    ⚠️  Failed to clear cache.
    )
)

REM Start the dev server
echo 🚀 Starting Next.js development server...
echo    Command: pnpm run dev
echo.
pnpm run dev