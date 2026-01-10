# Firebase Authentication Setup Guide

## ✅ What I Fixed

I've implemented full Firebase Authentication for your CartShift Studio portal. The following files were updated:

1. **`lib/services/auth.ts`** - Implemented Firebase Authentication with:
   - Email/Password login
   - User registration
   - Password reset
   - Sign out
   - User session management

2. **`lib/hooks/usePortalAuth.ts`** - Updated to use Firebase's `onAuthStateChanged` listener for real-time authentication state updates

## 🔧 Next Steps: Enable Firebase Authentication

To complete the setup, you need to enable Email/Password authentication in your Firebase Console:

### Step 1: Go to Firebase Console

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **cartshiftstudio**

### Step 2: Enable Email/Password Authentication

1. Click on **Authentication** in the left sidebar
2. Click on the **Sign-in method** tab
3. Find **Email/Password** in the list of providers
4. Click on it to expand
5. Toggle the **Enable** switch to ON
6. Click **Save**

### Step 3: (Optional) Create a Test User

You can create a test user to verify everything works:

1. Still in **Authentication**, click on the **Users** tab
2. Click **Add user**
3. Enter an email and password
4. Click **Add user**

## 🧪 Testing Authentication

Once you've enabled authentication in Firebase:

1. Go to [http://localhost:3000/portal/login](http://localhost:3000/portal/login)
2. Try to sign in with a test user, or
3. Click "Create one" to sign up a new account at [http://localhost:3000/portal/signup](http://localhost:3000/portal/signup)

## 🔐 Security Considerations

For production, you should also configure:

1. **Email verification** - Require users to verify their email addresses
2. **Password policies** - Set minimum password strength requirements
3. **Rate limiting** - Configure to prevent brute force attacks
4. **Authorized domains** - Add your production domain to Firebase Authentication settings

## 📝 Current Environment Variables

Your `.env.local` file already has the correct Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCL8Np8exSk-MOc4EzSv7hcg9r_TsKgemQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cartshiftstudio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cartshiftstudio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cartshiftstudio.firebasestorage.app
NEXT_PUBLIC_FIREBASE_APP_ID=1:559544522324:web:988f4bc9f5485e4adbbfc1
```

## ✨ Features Now Available

- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Password reset via email
- ✅ User session persistence
- ✅ Real-time authentication state tracking
- ✅ Automatic redirect after login
- ✅ Proper error handling with user-friendly messages

## 🚨 Troubleshooting

### Error: "Authentication not configured"

This means Firebase Authentication is not enabled in the console. Follow Step 2 above.

### Error: "Firebase Auth not available on server side"

This is expected behavior. Firebase Auth initialization only happens on the client side.

### Error: "auth/invalid-credential"

The email/password combination is incorrect.

### Error: "auth/user-not-found"

No user exists with that email address. User needs to sign up first.

### Error: "403: access_denied" - Google OAuth Verification Not Completed

This error occurs when the Google OAuth consent screen is in "Testing" mode and your email is not added as a test user.

**Solution: Add Test Users to Google OAuth Consent Screen**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **cartshiftstudio**
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Scroll down to **Test users** section
5. Click **+ ADD USERS**
6. Add your email address: `hello@cart-shift.com` (and any other emails that need access)
7. Click **ADD**
8. The users will now be able to authenticate with Google

**Alternative: Publish the App (for Production)**
If you're ready for production and want all users to access the app:

1. In the OAuth consent screen, click **PUBLISH APP**
2. Complete the verification process if required
3. Note: Publishing requires app verification for sensitive scopes

**For Google Calendar Integration:**
The same OAuth consent screen configuration applies to Google Calendar integration. Make sure the test users are added there as well.

### Error: "404 - Page Not Found" on OAuth Callback

If you get a 404 error when Google redirects to `/portal/oauth-callback`, this has been fixed by:

1. **Firebase Hosting Rewrite Rule**: Added rewrite rule in `firebase.json` to route `/portal/oauth-callback` to the correct locale path
2. **Cloud Function**: Created `googleCalendarOAuthCallback` Cloud Function to handle token exchange
3. **Environment Variables**: Make sure you have:
   - `NEXT_PUBLIC_FIREBASE_FUNCTION_URL` - Your Cloud Functions base URL
   - `GOOGLE_CLIENT_ID` (secret) - Set in Firebase Functions secrets
   - `GOOGLE_CLIENT_SECRET` (secret) - Set in Firebase Functions secrets

**To deploy the Cloud Function:**

**PowerShell (Windows):**

```powershell
# Set GOOGLE_CLIENT_ID
$clientId = "your-client-id"
echo $clientId | firebase functions:secrets:set GOOGLE_CLIENT_ID

# Set GOOGLE_CLIENT_SECRET
$secret = "your-client-secret"
echo $secret | firebase functions:secrets:set GOOGLE_CLIENT_SECRET

# Deploy the function
firebase deploy --only functions:googleCalendarOAuthCallback
```

**Bash/Linux/Mac:**

```bash
echo "your-client-id" | firebase functions:secrets:set GOOGLE_CLIENT_ID
echo "your-client-secret" | firebase functions:secrets:set GOOGLE_CLIENT_SECRET
firebase deploy --only functions:googleCalendarOAuthCallback
```

**Important**: The redirect URI in Google Cloud Console must match exactly: `https://cart-shift.com/portal/oauth-callback`

**Troubleshooting 400 Bad Request Error:**

If you get a 400 error when connecting Google Calendar, check:

1. **Redirect URI Mismatch** (Most Common):
   - The redirect URI in Google Cloud Console OAuth credentials must match EXACTLY
   - Check: [Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs]
   - Authorized redirect URIs should include: `https://cart-shift.com/portal/oauth-callback`
   - Must match exactly (including `https://`, no trailing slash unless specified)

2. **Missing Secrets in Firebase Functions**:

   ```bash
   # Check if secrets are set:
   firebase functions:secrets:access GOOGLE_CLIENT_ID
   firebase functions:secrets:access GOOGLE_CLIENT_SECRET

   # If not set, set them:
   firebase functions:secrets:set GOOGLE_CLIENT_ID="your-client-id"
   firebase functions:secrets:set GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

3. **Check Function Logs**:

   ```bash
   firebase functions:log --only googleCalendarOAuthCallback
   ```

   Look for detailed error messages from Google's OAuth API.

4. **Verify Client ID/Secret Match**:
   - Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
   - Find your OAuth 2.0 Client ID
   - Click on it to view details
   - **IMPORTANT**: The Client ID and Client Secret must be from the SAME OAuth client
   - Verify:
     - Client ID in Firebase secret matches the Client ID in Google Cloud Console
     - Client Secret in Firebase secret matches the Client Secret shown in Google Cloud Console
   - If you see "The OAuth client was not found" error, it means the Client ID and Secret don't match

5. **Check Redirect URI in Google Cloud Console**:
   - In the OAuth client details, check "Authorized redirect URIs"
   - Must include exactly: `https://cart-shift.com/portal/oauth-callback`
   - The redirect URI used in the OAuth flow must match EXACTLY (including https://, no trailing slash)

## 📚 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/project/cartshiftstudio/overview)
- [Google OAuth Consent Screen Setup](https://console.cloud.google.com/apis/credentials/consent)
