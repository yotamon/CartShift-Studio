#!/usr/bin/env pwsh

# Migrate slate tokens in [locale] directory

$localePath = "C:\Users\yotam\Desktop\Personal Projects\CartShift Studio\app\[locale]"

# Slate → Surface replacement map
$replacements = @{
    'bg-slate-50' = 'bg-surface-50'; 'bg-slate-100' = 'bg-surface-100'; 'bg-slate-200' = 'bg-surface-200'
    'bg-slate-300' = 'bg-surface-300'; 'bg-slate-400' = 'bg-surface-400'; 'bg-slate-500' = 'bg-surface-500'
    'bg-slate-600' = 'bg-surface-600'; 'bg-slate-700' = 'bg-surface-700'; 'bg-slate-800' = 'bg-surface-800'
    'bg-slate-900' = 'bg-surface-900'; 'bg-slate-950' = 'bg-surface-950'
    'text-slate-50' = 'text-surface-50'; 'text-slate-100' = 'text-surface-100'; 'text-slate-200' = 'text-surface-200'
    'text-slate-300' = 'text-surface-300'; 'text-slate-400' = 'text-surface-400'; 'text-slate-500' = 'text-surface-500'
    'text-slate-600' = 'text-surface-600'; 'text-slate-700' = 'text-surface-700'; 'text-slate-800' = 'text-surface-800'
    'text-slate-900' = 'text-surface-900'; 'text-slate-950' = 'text-surface-950'
    'border-slate-50' = 'border-surface-50'; 'border-slate-100' = 'border-surface-100'; 'border-slate-200' = 'border-surface-200'
    'border-slate-300' = 'border-surface-300'; 'border-slate-400' = 'border-surface-400'; 'border-slate-500' = 'border-surface-500'
    'border-slate-600' = 'border-surface-600'; 'border-slate-700' = 'border-surface-700'; 'border-slate-800' = 'border-surface-800'
    'border-slate-900' = 'border-surface-900'; 'border-slate-950' = 'border-surface-950'
}

Write-Host "`n🚀 Migrating [locale] directory" -ForegroundColor Cyan

$files = Get-ChildItem -Path $localePath -Include *.tsx,*.ts,*.css -Recurse -File
Write-Host "📄 Found $($files.Count) files`n"

$totalReplacements = 0
$filesModified = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $newContent = $content
    $fileReplacements = 0

    foreach ($old in $replacements.Keys) {
        if ($newContent -match [regex]::Escape($old)) {
            $count = ([regex]::Matches($newContent, [regex]::Escape($old))).Count
            $newContent = $newContent -replace [regex]::Escape($old), $replacements[$old]
            $fileReplacements += $count
        }
    }

    if ($fileReplacements -gt 0) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        $filesModified++
        $totalReplacements += $fileReplacements
        Write-Host "✓ $($file.Name) - $fileReplacements replacements" -ForegroundColor Green
    }
}

Write-Host "`n✅ Files modified: $filesModified | Total replacements: $totalReplacements" -ForegroundColor Green
