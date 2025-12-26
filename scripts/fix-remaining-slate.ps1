# Fix remaining slate tokens in portal files
Write-Host "🔍 Searching for files with slate tokens..." -ForegroundColor Cyan

$basePath = "c:\Users\yotam\Desktop\Personal Projects\CartShift Studio"

# Find all TypeScript/TSX files with slate tokens (excluding build artifacts and scripts)
$filesToFix = Get-ChildItem -Path $basePath -Include *.tsx,*.ts -Recurse -File | 
    Where-Object {
        $_.FullName -notlike "*\.next*" -and 
        $_.FullName -notlike "*\node_modules*" -and 
        $_.FullName -notlike "*\scripts\*" -and
        $_.FullName -notlike "*\out\*"
    } | 
    Where-Object {
        $content = Get-Content $_.FullName -Raw
        $content -match "(bg|text|border)-slate-\d+"
    }

Write-Host "Found $($filesToFix.Count) files with slate tokens`n" -ForegroundColor Yellow

# Replacement mapping
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
    
    'divide-slate-50' = 'divide-surface-50'; 'divide-slate-100' = 'divide-surface-100'; 'divide-slate-200' = 'divide-surface-200'
    'divide-slate-300' = 'divide-surface-300'; 'divide-slate-400' = 'divide-surface-400'; 'divide-slate-500' = 'divide-surface-500'
    'divide-slate-600' = 'divide-surface-600'; 'divide-slate-700' = 'divide-surface-700'; 'divide-slate-800' = 'divide-surface-800'
    'divide-slate-900' = 'divide-surface-900'; 'divide-slate-950' = 'divide-surface-950'
    
    'ring-slate-50' = 'ring-surface-50'; 'ring-slate-100' = 'ring-surface-100'; 'ring-slate-200' = 'ring-surface-200'
    'ring-slate-300' = 'ring-surface-300'; 'ring-slate-400' = 'ring-surface-400'; 'ring-slate-500' = 'ring-surface-500'
    'ring-slate-600' = 'ring-surface-600'; 'ring-slate-700' = 'ring-surface-700'; 'ring-slate-800' = 'ring-surface-800'
    'ring-slate-900' = 'ring-surface-900'; 'ring-slate-950' = 'ring-surface-950'
}

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $filesToFix) {
    $content = Get-Content $file.FullName -Raw
    $fileReplacements = 0
    $originalContent = $content
    
    foreach ($old in $replacements.Keys) {
        $pattern = [regex]::Escape($old)
        if ($content -match $pattern) {
            $matches = [regex]::Matches($content, $pattern)
            $content = $content -replace $pattern, $replacements[$old]
            $fileReplacements += $matches.Count
        }
    }
    
    if ($fileReplacements -gt 0) {
        Set-Content $file.FullName -Value $content -NoNewline
        $relativePath = $file.FullName.Replace($basePath + "\", "")
        Write-Host "✓ $relativePath : $fileReplacements replacements" -ForegroundColor Green
        $totalFiles++
        $totalReplacements += $fileReplacements
    }
}

Write-Host "`n✨ Complete!" -ForegroundColor Cyan
Write-Host "Files modified: $totalFiles" -ForegroundColor White
Write-Host "Total replacements: $totalReplacements" -ForegroundColor White
