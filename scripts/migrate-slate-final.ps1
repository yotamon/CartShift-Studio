#!/usr/bin/env pwsh

#  Final Slate → Surface Migration Script
# Complete migration across entire codebase

param(
    [switch]$DryRun
)

$ErrorActionPreference = 'Continue'
$projectRoot = "C:\Users\yotam\Desktop\Personal Projects\CartShift Studio"

# Slate → Surface replacement map
$replacements = @{
    # Background
    'bg-slate-50' = 'bg-surface-50'
    'bg-slate-100' = 'bg-surface-100'
    'bg-slate-200' = 'bg-surface-200'
    'bg-slate-300' = 'bg-surface-300'
    'bg-slate-400' = 'bg-surface-400'
    'bg-slate-500' = 'bg-surface-500'
    'bg-slate-600' = 'bg-surface-600'
    'bg-slate-700' = 'bg-surface-700'
    'bg-slate-800' = 'bg-surface-800'
    'bg-slate-900' = 'bg-surface-900'
    'bg-slate-950' = 'bg-surface-950'

    # Text
    'text-slate-50' = 'text-surface-50'
    'text-slate-100' = 'text-surface-100'
    'text-slate-200' = 'text-surface-200'
    'text-slate-300' = 'text-surface-300'
    'text-slate-400' = 'text-surface-400'
    'text-slate-500' = 'text-surface-500'
    'text-slate-600' = 'text-surface-600'
    'text-slate-700' = 'text-surface-700'
    'text-slate-800' = 'text-surface-800'
    'text-slate-900' = 'text-surface-900'
    'text-slate-950' = 'text-surface-950'

    # Border
    'border-slate-50' = 'border-surface-50'
    'border-slate-100' = 'border-surface-100'
    'border-slate-200' = 'border-surface-200'
    'border-slate-300' = 'border-surface-300'
    'border-slate-400' = 'border-surface-400'
    'border-slate-500' = 'border-surface-500'
    'border-slate-600' = 'border-surface-600'
    'border-slate-700' = 'border-surface-700'
    'border-slate-800' = 'border-surface-800'
    'border-slate-900' = 'border-surface-900'
    'border-slate-950' = 'border-surface-950'

    # Divide
    'divide-slate-50' = 'divide-surface-50'
    'divide-slate-100' = 'divide-surface-100'
    'divide-slate-200' = 'divide-surface-200'
    'divide-slate-300' = 'divide-surface-300'
    'divide-slate-400' = 'divide-surface-400'
    'divide-slate-500' = 'divide-surface-500'
    'divide-slate-600' = 'divide-surface-600'
    'divide-slate-700' = 'divide-surface-700'
    'divide-slate-800' = 'divide-surface-800'
    'divide-slate-900' = 'divide-surface-900'
    'divide-slate-950' = 'divide-surface-950'

    # Gradients
    'from-slate-50' = 'from-surface-50'
    'from-slate-100' = 'from-surface-100'
    'from-slate-200' = 'from-surface-200'
    'from-slate-300' = 'from-surface-300'
    'from-slate-400' = 'from-surface-400'
    'from-slate-500' = 'from-surface-500'
    'from-slate-600' = 'from-surface-600'
    'from-slate-700' = 'from-surface-700'
    'from-slate-800' = 'from-surface-800'
    'from-slate-900' = 'from-surface-900'
    'from-slate-950' = 'from-surface-950'

    'via-slate-50' = 'via-surface-50'
    'via-slate-100' = 'via-surface-100'
    'via-slate-200' = 'via-surface-200'
    'via-slate-300' = 'via-surface-300'
    'via-slate-400' = 'via-surface-400'
    'via-slate-500' = 'via-surface-500'
    'via-slate-600' = 'via-surface-600'
    'via-slate-700' = 'via-surface-700'
    'via-slate-800' = 'via-surface-800'
    'via-slate-900' = 'via-surface-900'
    'via-slate-950' = 'via-surface-950'

    'to-slate-50' = 'to-surface-50'
    'to-slate-100' = 'to-surface-100'
    'to-slate-200' = 'to-surface-200'
    'to-slate-300' = 'to-surface-300'
    'to-slate-400' = 'to-surface-400'
    'to-slate-500' = 'to-surface-500'
    'to-slate-600' = 'to-surface-600'
    'to-slate-700' = 'to-surface-700'
    'to-slate-800' = 'to-surface-800'
    'to-slate-900' = 'to-surface-900'
    'to-slate-950' = 'to-surface-950'
}

Write-Host "`n🚀 Final Slate → Surface Token Migration" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No files will be modified" -ForegroundColor Yellow
}

# Find all files, excluding node_modules, .next, out directories
$files = Get-ChildItem -Path $projectRoot -Include "*.tsx", "*.ts", "*.css" -Recurse -File |
    Where-Object { $_.FullName -notmatch '(node_modules|\.next|out|\.git)' }

Write-Host "📄 Found $($files.Count) source files to scan`n" -ForegroundColor White

$totalReplacements = 0
$filesModified = 0

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw
        $modified = $false
        $fileReplacements = 0
        $newContent = $content

        foreach ($old in $replacements.Keys) {
            if ($newContent -match [regex]::Escape($old)) {
                $count = ([regex]::Matches($newContent, [regex]::Escape($old))).Count
                $newContent = $newContent -replace [regex]::Escape($old), $replacements[$old]
                $fileReplacements += $count
                $modified = $true
            }
        }

        if ($modified) {
            $filesModified++
            $totalReplacements += $fileReplacements

            if (-not $DryRun) {
                Set-Content -Path $file.FullName -Value $newContent -NoNewline
            }

            Write-Host "✓ $($file.FullName) - $fileReplacements replacements" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "❌ Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📊 Migration Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Files scanned:    $($files.Count)" -ForegroundColor White
Write-Host "Files modified:   $filesModified" -ForegroundColor $(if($filesModified -gt 0){"Green"}else{"Yellow"})
Write-Host "Total replacements: $totalReplacements" -ForegroundColor $(if($totalReplacements -gt 0){"Green"}else{"Yellow"})

if ($DryRun) {
    Write-Host "`n💡 Run without -DryRun to apply changes" -ForegroundColor Yellow
} else {
    Write-Host "`n✅ Migration complete!" -ForegroundColor Green
}
