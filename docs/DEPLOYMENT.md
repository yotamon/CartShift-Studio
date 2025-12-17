# Firebase Deployment Guide

## Pre-Deployment Checklist

1. **Environment Variables** (Required)
   - Set `NEXT_PUBLIC_SITE_URL` to your production domain (required)
   - Set `FIREBASE_FUNCTION_URL` to your Cloud Function URL (required)
   - Set `NEXT_PUBLIC_GA_ID` for Google Analytics (optional)

   **Note**: Environment variables are validated at startup. Missing required variables will cause build failures.

2. **Build Test**
   ```bash
   npm run build
   npm start
   ```
   Verify the production build works locally.

3. **Content Review**
   - Update all placeholder content
   - Verify all links
   - Check contact information
   - Review blog posts

## Firebase Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Project
```bash
firebase init
```
Select:
- Hosting
- Functions
- Use an existing project (or create new)
- Select your project

### 4. Configure Firebase Project
Update `.firebaserc` with your project ID:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

## Gmail API Setup (for Email)

### 1. Enable Gmail API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Enable Gmail API
4. Create OAuth 2.0 credentials (if needed)

### 2. Create App Password
1. Go to your Google Account settings
2. Security → 2-Step Verification → App passwords
3. Generate an app password for "Mail"
4. Save this password

### 3. Set Firebase Functions Config
```bash
firebase functions:config:set gmail.user="your-email@gmail.com"
firebase functions:config:set gmail.app_password="your-app-password"
firebase functions:config:set contact.email="hello@cartshiftstudio.com"
```

## Deployment Steps

### ⚠️ IMPORTANT: Upgrade to Blaze Plan
**Cloud Functions require the Blaze (pay-as-you-go) plan.**
- Visit: https://console.firebase.google.com/project/cartshiftstudio/usage/details
- Upgrade your project to enable Cloud Functions
- The free Spark plan only supports Hosting, not Functions

### 1. Enable Firestore Database
```bash
firebase firestore:databases:create --location us-central1
```

### 2. Deploy Functions First (to get the function URL)
```bash
firebase deploy --only functions
```
After deployment, note the function URL (e.g., `https://us-central1-cartshiftstudio.cloudfunctions.net/contactForm`)

### 3. Set Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SITE_URL=https://cartshiftstudio.web.app
FIREBASE_FUNCTION_URL=https://us-central1-cartshiftstudio.cloudfunctions.net/contactForm
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
Replace the function URL with your actual deployed function URL.

### 4. Build and Export Next.js Application
Next.js is configured to export as static site for Firebase Hosting:
```bash
npm run export
```
This runs `next build` which exports to the `out` directory (configured in `next.config.mjs`).

### 5. Deploy Hosting
```bash
firebase deploy --only hosting
```

### 6. Deploy Everything (after functions are deployed)
```bash
firebase deploy
```

## Firebase Hosting Configuration

The `firebase.json` is already configured. For Next.js with SSR, you have two options:

### Option A: Static Export (Current)
- Export Next.js as static files
- Deploy to Firebase Hosting
- Forms call Cloud Functions

### Option B: SSR with Cloud Functions
- Use Firebase Functions to run Next.js server
- More complex but full SSR support
- Requires additional configuration

## Custom Domain Setup

1. **Add Domain in Firebase Console**
   - Go to Firebase Console → Hosting
   - Click "Add custom domain"
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Firebase automatically provisions SSL certificates
   - Wait for certificate provisioning (can take a few hours)

## Post-Deployment

1. **Verify Deployment**
   - Check all pages load correctly
   - Test form submissions
   - Verify analytics tracking
   - Test mobile responsiveness

2. **SEO Verification**
   - Submit sitemap to Google Search Console
   - Verify robots.txt is accessible
   - Check meta tags with SEO tools

3. **Performance Monitoring**
   - Use Firebase Performance Monitoring
   - Monitor Core Web Vitals in Google Search Console
   - Set up error tracking in Firebase Console

4. **Cloud Functions Monitoring**
   - Monitor function logs: `firebase functions:log`
   - Check function metrics in Firebase Console
   - Set up alerts for errors

## Environment Variables Reference

### Local Development (.env.local)
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
FIREBASE_FUNCTION_URL=https://us-central1-your-project.cloudfunctions.net/contactForm
```

### Firebase Functions Config
```bash
firebase functions:config:set gmail.user="your-email@gmail.com"
firebase functions:config:set gmail.app_password="your-app-password"
firebase functions:config:set contact.email="hello@yourdomain.com"
```

## Alternative: Google Cloud SendGrid

If you prefer SendGrid on Google Cloud:

1. **Enable SendGrid API**
   - Create SendGrid account
   - Get API key
   - Update Cloud Function to use SendGrid

2. **Update Function**
   - Modify `functions/index.js` to use SendGrid
   - Set API key in Firebase config

## Troubleshooting

### Build Errors
- Check Node.js version (should be 20+ for Functions)
- Clear `.next` folder and rebuild
- Check for TypeScript errors: `npm run lint`

### Form Submission Issues
- Verify Cloud Function is deployed
- Check function logs: `firebase functions:log`
- Verify Gmail app password is correct
- Check Firebase Functions config

### Hosting Issues
- Ensure `firebase.json` is configured correctly
- Check that build output is in correct directory
- Verify custom domain DNS settings

### Performance Issues
- Check image optimization
- Review bundle size
- Enable Firebase Hosting caching
- Use Firebase CDN for static assets

