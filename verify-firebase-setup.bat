@echo off
REM Firebase Project Verification Script (Windows)
REM Run this to verify your Firebase setup is complete

cls
echo.
echo 🔍 CartShift Firebase Setup Verification
echo =======================================
echo.

REM Check .env.local exists
if not exist ".env.local" (
    echo ❌ .env.local file missing
    echo    👉 Copy .env.example to .env.local and fill in Firebase config
    echo.
) else (
    echo ✅ .env.local exists
)

REM Check Firebase environment variables
echo.
echo Checking environment variables:
echo --------------------------------

findstr /C:"NEXT_PUBLIC_FIREBASE_API_KEY" .env.local >nul
if %errorlevel% equ 0 (
    echo ✅ NEXT_PUBLIC_FIREBASE_API_KEY is set
) else (
    echo ❌ NEXT_PUBLIC_FIREBASE_API_KEY is missing
)

findstr /C:"NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" .env.local >nul
if %errorlevel% equ 0 (
    echo ✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is set
) else (
    echo ❌ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing
)

findstr /C:"NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env.local >nul
if %errorlevel% equ 0 (
    echo ✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID is set
) else (
    echo ❌ NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing
)

findstr /C:"NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" .env.local >nul
if %errorlevel% equ 0 (
    echo ✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set
) else (
    echo ❌ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is missing
)

findstr /C:"NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" .env.local >nul
if %errorlevel% equ 0 (
    echo ✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is set
) else (
    echo ❌ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is missing
)

findstr /C:"NEXT_PUBLIC_FIREBASE_APP_ID" .env.local >nul
if %errorlevel% equ 0 (
    echo ✅ NEXT_PUBLIC_FIREBASE_APP_ID is set
) else (
    echo ❌ NEXT_PUBLIC_FIREBASE_APP_ID is missing
)

REM Check Firebase rules files
echo.
echo Checking Firebase rules files:
echo ------------------------------

if exist "firestore.rules" (
    echo ✅ firestore.rules exists
    for %%A in (firestore.rules) do echo    %%~zA bytes
) else (
    echo ❌ firestore.rules not found
)

if exist "storage.rules" (
    echo ✅ storage.rules exists
    for %%A in (storage.rules) do echo    %%~zA bytes
) else (
    echo ❌ storage.rules not found
)

REM Check Firebase config file
echo.
echo Checking Firebase configuration:
echo --------------------------------

if exist "firebase.json" (
    echo ✅ firebase.json exists
) else (
    echo ❌ firebase.json not found
)

if exist "firestore.indexes.json" (
    echo ✅ firestore.indexes.json exists
) else (
    echo ⚠️  firestore.indexes.json not found (optional but recommended)
)

REM Check if Firebase CLI is installed
echo.
echo Checking Firebase CLI:
echo ----------------------

firebase --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('firebase --version') do echo ✅ Firebase CLI installed: %%i
) else (
    echo ❌ Firebase CLI not installed
    echo    👉 Install: npm install -g firebase-tools
)

REM Summary
echo.
echo =======================================
echo Next Steps:
echo 1. Ensure all environment variables are set (.env.local)
echo 2. Deploy Firestore rules: firebase deploy --only firestore:rules
echo 3. Deploy Storage rules: firebase deploy --only storage
echo 4. Create test user in Firebase Console
echo 5. Create organization and membership documents
echo 6. Run browser console diagnostic in FIREBASE_SETUP_CHECKLIST.md
echo.
echo Documentation: FIREBASE_SETUP_CHECKLIST.md
echo.
pause
