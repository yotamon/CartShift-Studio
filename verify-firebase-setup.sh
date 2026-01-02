#!/bin/bash
# Firebase Project Verification Script
# Run this to verify your Firebase setup is complete

echo "🔍 CartShift Firebase Setup Verification"
echo "======================================="
echo ""

# Check .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file missing"
    echo "   👉 Copy .env.example to .env.local and fill in Firebase config"
    echo ""
else
    echo "✅ .env.local exists"
fi

# Check Firebase environment variables
echo ""
echo "Checking environment variables:"
echo "--------------------------------"

if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY" .env.local; then
    echo "✅ NEXT_PUBLIC_FIREBASE_API_KEY is set"
else
    echo "❌ NEXT_PUBLIC_FIREBASE_API_KEY is missing"
fi

if grep -q "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" .env.local; then
    echo "✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is set"
else
    echo "❌ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing"
fi

if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env.local; then
    echo "✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID is set"
else
    echo "❌ NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing"
fi

if grep -q "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" .env.local; then
    echo "✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set"
else
    echo "❌ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is missing"
fi

if grep -q "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" .env.local; then
    echo "✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is set"
else
    echo "❌ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is missing"
fi

if grep -q "NEXT_PUBLIC_FIREBASE_APP_ID" .env.local; then
    echo "✅ NEXT_PUBLIC_FIREBASE_APP_ID is set"
else
    echo "❌ NEXT_PUBLIC_FIREBASE_APP_ID is missing"
fi

# Check Firebase rules files
echo ""
echo "Checking Firebase rules files:"
echo "------------------------------"

if [ -f "firestore.rules" ]; then
    echo "✅ firestore.rules exists"
    lines=$(wc -l < firestore.rules)
    echo "   $lines lines configured"
else
    echo "❌ firestore.rules not found"
fi

if [ -f "storage.rules" ]; then
    echo "✅ storage.rules exists"
    lines=$(wc -l < storage.rules)
    echo "   $lines lines configured"
else
    echo "❌ storage.rules not found"
fi

# Check Firebase config file
echo ""
echo "Checking Firebase configuration:"
echo "--------------------------------"

if [ -f "firebase.json" ]; then
    echo "✅ firebase.json exists"
else
    echo "❌ firebase.json not found"
fi

if [ -f "firestore.indexes.json" ]; then
    echo "✅ firestore.indexes.json exists"
else
    echo "❌ firestore.indexes.json not found (optional but recommended)"
fi

# Check if Firebase CLI is installed
echo ""
echo "Checking Firebase CLI:"
echo "----------------------"

if command -v firebase &> /dev/null; then
    version=$(firebase --version)
    echo "✅ Firebase CLI installed: $version"
else
    echo "❌ Firebase CLI not installed"
    echo "   👉 Install: npm install -g firebase-tools"
fi

# Summary
echo ""
echo "======================================="
echo "Next Steps:"
echo "1. Ensure all environment variables are set (.env.local)"
echo "2. Deploy Firestore rules: firebase deploy --only firestore:rules"
echo "3. Deploy Storage rules: firebase deploy --only storage"
echo "4. Create test user in Firebase Console"
echo "5. Create organization and membership documents"
echo "6. Run browser console diagnostic in FIREBASE_SETUP_CHECKLIST.md"
echo ""
echo "Documentation: FIREBASE_SETUP_CHECKLIST.md"
