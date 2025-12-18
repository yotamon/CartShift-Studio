# CartShift Studio - AI Agent Instructions

## Project Overview
Next.js 16+ (App Router) e-commerce agency website deployed on Firebase with static export. Built with TypeScript, Tailwind CSS, and Framer Motion for a conversion-optimized, bilingual (en/he) marketing site.

## Architecture & Data Flow

### Static Export Model
- Uses `output: "export"` in [next.config.mjs](../next.config.mjs) for Firebase Hosting
- No API routes in production - contact forms proxy through Firebase Cloud Functions
- Blog posts are markdown files in [content/blog/](../content/blog/) processed at build time
- All pages generate static HTML with client-side hydration for animations

### Content Pipeline
1. Markdown files → `gray-matter` extracts frontmatter → `remark` + `remark-gfm` → HTML
2. [lib/markdown.ts](../lib/markdown.ts) pre-processes numbered lists `1)` → `1.` and post-processes GFM task lists
3. [lib/sanitize.ts](../lib/sanitize.ts) sanitizes HTML before render (DOMPurify-like with `sanitize-html`)

### Translation System
- **Context Provider**: [components/providers/LanguageProvider.tsx](../components/providers/LanguageProvider.tsx) wraps entire app
- **Single Source**: [lib/translations.ts](../lib/translations.ts) contains nested object with all copy (~1800 lines)
- **Usage**: `const { t, language, direction } = useLanguage()` then `t.hero.title` for translations
- **RTL Support**: Automatically applies `dir="rtl"` and flips layouts for Hebrew

### SEO Architecture
- **Metadata**: [lib/seo.ts](../lib/seo.ts) has `generateMetadata()` for consistent Open Graph/Twitter cards
- **Schemas**: `generateOrganizationSchema()`, `generateServiceSchema()`, `generateArticleSchema()` for structured data
- **Sitemaps**: [app/sitemap.ts](../app/sitemap.ts) generates dynamic sitemap including blog posts
- Extensive SEO docs in [docs/](../docs/) - see [SEO_QUICK_START.md](../docs/SEO_QUICK_START.md)

## Key Conventions

### Component Patterns
1. **Client Components**: Anything using hooks/animations starts with `"use client"` directive
2. **Style Composition**: Use `cn()` from [lib/utils.ts](../lib/utils.ts) which combines `clsx` + `tailwind-merge`
   ```tsx
   className={cn("base-classes", variant === "primary" && "primary-classes", className)}
   ```
3. **Button States**: [components/ui/Button.tsx](../components/ui/Button.tsx) has `state` prop: `idle|loading|success|error` with visual feedback
4. **Framer Motion**: Wrap animated elements in `<motion.div>` with `whileInView` for scroll animations

### Styling System
- **Design Tokens**: [tailwind.config.ts](../tailwind.config.ts) defines `primary-*` (blue), `accent-*` (purple), `surface-*` scales
- **Dark Mode**: Use `dark:` prefix; toggle via [ThemeProvider](../components/providers/ThemeProvider.tsx)
- **Typography**: `font-sans` (Inter), `font-heading` (Poppins), `font-mono` (JetBrains Mono) variables
- **Animations**: Custom utilities like `shine-sweep`, `glow-hover`, `float-slow` in [globals.css](../app/globals.css)

### Form Handling
- **Validation**: [lib/validation.ts](../lib/validation.ts) uses Zod schemas - import `contactFormSchema` or `newsletterSubscriptionSchema`
- **React Hook Form**: All forms use `useForm<ContactFormData>()` with resolver
- **Submission**: POST to `FIREBASE_FUNCTION_URL` env var (Cloud Function, not API route)
- **Analytics**: Track with `trackFormSubmission()` from [lib/analytics.ts](../lib/analytics.ts)

### Error Handling
- [lib/error-handler.ts](../lib/error-handler.ts): Use `logError(message, error, context)` - auto-formats for production
- [components/ErrorBoundary.tsx](../components/ErrorBoundary.tsx): Wrap sections that might fail
- Production errors log as JSON to console

## Critical Workflows

### Local Development
```bash
npm install              # Root dependencies
cd functions && npm install && cd ..  # Firebase Functions deps
npm run dev              # Start dev server at localhost:3000
```

### Adding Blog Posts
1. Create `.md` file in [content/blog/](../content/blog/)
2. Frontmatter required: `title`, `date`, `excerpt`, `category`
3. Optional `translation` object for Hebrew version
4. Rebuild to regenerate sitemap

### Deployment to Firebase
```bash
npm run build            # Verify build succeeds
npm run deploy           # Build + deploy hosting + functions
# Or separately:
npm run deploy:hosting
npm run deploy:functions
```
**Pre-requisites**: Firebase CLI logged in, `.env.local` vars set, Blaze plan for Cloud Functions. See [DEPLOYMENT.md](../docs/DEPLOYMENT.md).

### Environment Variables
Required at build time (checked by [lib/env.ts](../lib/env.ts)):
- `NEXT_PUBLIC_SITE_URL` - Production domain
- `FIREBASE_FUNCTION_URL` - Cloud Function endpoint

Optional:
- `NEXT_PUBLIC_GA_ID` - Google Analytics

## Integration Points

### Firebase Cloud Functions
- Located in [functions/](../functions/) (separate Node.js project)
- `contactForm` endpoint receives form POSTs, sends email via Gmail API
- Configured with `firebase functions:config:set`
- Must deploy separately from hosting

### Third-Party Services
- **Google Analytics**: [components/analytics/GoogleAnalytics.tsx](../components/analytics/GoogleAnalytics.tsx) loads GA4 script
- **Gmail API**: Functions use OAuth for sending contact form emails
- **Framer Motion**: All animations use `motion` components - check [Hero.tsx](../components/sections/Hero.tsx) for parallax example

## Project-Specific Patterns

### Parallax Effects
[components/ui/Parallax.tsx](../components/ui/Parallax.tsx) provides `<ParallaxLayer depth={1-4}>` wrapper:
- Higher depth = slower movement
- Used extensively in Hero section with geometric shapes
- Client-side only (uses scroll events)

### Multi-State UI
Button component example of progressive enhancement:
1. `idle` → user can interact
2. `loading` → shows spinner, disabled
3. `success` → green checkmark, auto-reverts
4. `error` → red X, auto-reverts

### Markdown Extensions
[lib/markdown.ts](../lib/markdown.ts) adds custom features:
- Converts `1)` and `(1)` to proper markdown numbered lists
- Makes GFM checkboxes interactive (not disabled)
- Adds semantic classes for styling tables

## Common Pitfalls

1. **API Routes Don't Work**: This is a static export - use Firebase Functions proxy instead
2. **Images Must Be Unoptimized**: `images.unoptimized: true` for static export
3. **Trailing Slashes Required**: `trailingSlash: true` for Firebase Hosting
4. **Client Components for Hooks**: `useLanguage()`, `useTheme()` require `"use client"`
5. **Translation Paths**: Always use nested access `t.section.key`, not string interpolation
6. **Build Validation**: Run `npm run build` before deploying - missing env vars fail silently in dev

## Documentation
- [PROJECT_SUMMARY.md](../docs/PROJECT_SUMMARY.md) - Implementation overview
- [DEPLOYMENT.md](../docs/DEPLOYMENT.md) - Firebase deployment steps
- [SEO_STRATEGY.md](../docs/SEO_STRATEGY.md) - Comprehensive SEO approach
- [TESTING.md](../docs/TESTING.md) - Testing checklist
- [prd.txt](../prd.txt) - Original product requirements (661 lines)
