# CartShift Studio Website

A modern, conversion-optimized website for CartShift Studio built with Next.js, React, and TypeScript, deployed on Firebase.

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install Firebase Functions dependencies:
```bash
cd functions
npm install
cd ..
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your values

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `lib/` - Utility functions and helpers
- `content/` - Markdown blog posts and static content
- `public/` - Static assets (images, fonts)
- `functions/` - Firebase Cloud Functions

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Content**: Markdown (gray-matter, remark)
- **Validation**: Zod
- **Sanitization**: DOMPurify
- **Deployment**: Firebase Hosting + Cloud Functions
- **Email**: Gmail API via Cloud Functions
- **Analytics**: Google Analytics 4

## Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed Firebase deployment instructions.

Quick deploy:
```bash
npm run deploy
```

## Environment Variables

**Note**: All environment variables are validated at startup. Missing required variables will cause the application to fail with a clear error message.

### Local Development (.env.local)
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_FUNCTION_URL=https://us-central1-your-project.cloudfunctions.net/contactForm
```

**Required Variables**:
- `NEXT_PUBLIC_SITE_URL` - Your production domain URL
- `NEXT_PUBLIC_FIREBASE_FUNCTION_URL` - Your Firebase Cloud Function URL for contact form submissions

**Optional Variables**:
- `NEXT_PUBLIC_GA_ID` - Google Analytics tracking ID

### Firebase Functions Secrets
```bash
firebase functions:secrets:set GMAIL_USER="your-email@gmail.com"
firebase functions:secrets:set GMAIL_APP_PASSWORD="your-app-password"
firebase functions:secrets:set CONTACT_EMAIL="hello@yourdomain.com"
```

## Key Features

- **Error Handling**: Comprehensive error boundaries and centralized error logging
- **Input Validation**: Zod schemas for all form inputs with sanitization
- **Security**: Rate limiting, input sanitization, and XSS protection
- **Performance**: Blog post caching, optimized font loading, and code splitting
- **Accessibility**: ARIA labels, keyboard navigation, and skip links
- **SEO**: Structured data, language alternates, and optimized metadata
- **Type Safety**: Strict TypeScript configuration with improved type definitions

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size with @next/bundle-analyzer

## Documentation

All documentation is located in the `/docs` folder:

- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Firebase deployment guide
- [TESTING.md](./docs/TESTING.md) - Testing checklist
- [PROJECT_SUMMARY.md](./docs/PROJECT_SUMMARY.md) - Implementation summary
- [CODE_REVIEW.md](./docs/CODE_REVIEW.md) - Comprehensive code review and fixes
- [INCONSISTENCIES_ANALYSIS.md](./docs/INCONSISTENCIES_ANALYSIS.md) - Code inconsistencies analysis
- [SEO_DOCS_README.md](./docs/SEO_DOCS_README.md) - SEO documentation overview
- [SEO_STRATEGY.md](./docs/SEO_STRATEGY.md) - Comprehensive SEO strategy
- [SEO_QUICK_START.md](./docs/SEO_QUICK_START.md) - SEO quick start guide
- [KEYWORD_STRATEGY.md](./docs/KEYWORD_STRATEGY.md) - Keyword research strategy
- [LINK_BUILDING_GUIDE.md](./docs/LINK_BUILDING_GUIDE.md) - Link building playbook

## License

Private project - CartShift Studio
