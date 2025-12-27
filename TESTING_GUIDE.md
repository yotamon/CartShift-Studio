# CartShift Studio - Complete Testing Guide

## 🚀 Pre-Testing Setup

### 1. Start Development Server

```bash
pnpm dev
```

Wait for the server to start at http://localhost:3000

### 2. Clear Browser Cache

- Open DevTools (F12)
- Right-click refresh button → "Empty Cache and Hard Reload"

---

## 📋 Testing Checklist

## I. Public Website Testing

### A. Homepage Tests

- [ ] **Hero Section**
  - [ ] Hero title and subtitle display correctly
  - [ ] Hero form visible and styled properly
  - [ ] Platform icons (Shopify, WordPress, etc.) display
  - [ ] CTA buttons work and are clickable
  - [ ] Parallax effects work on scroll (floating shapes)
  - [ ] Stats section displays correctly

- [ ] **Services Overview**
  - [ ] Both Shopify and WordPress services cards display
  - [ ] Icons render correctly
  - [ ] Links to solutions pages work

- [ ] **Why Choose Section**
  - [ ] All 5 value proposition items display
  - [ ] Icons render for each item
  - [ ] Hover effects work

- [ ] **Testimonials**
  - [ ] All testimonial cards display
  - [ ] Star ratings show correctly
  - [ ] Slider/carousel works (if implemented)

- [ ] **Blog Teaser**
  - [ ] Latest blog posts display
  - [ ] Post titles, excerpts, and dates show
  - [ ] "View All" button works

- [ ] **CTA Banner**
  - [ ] Final CTA section displays
  - [ ] Button links to contact page

### B. Solutions Pages Tests

#### Shopify Page (/solutions/shopify)

- [ ] Page loads without errors
- [ ] Hero section displays with correct title
- [ ] Service list displays all Shopify services
- [ ] "Why Shopify with CartShift" section shows
- [ ] FAQ section renders (if present)
- [ ] CTA button at bottom works
- [ ] Internal links work (to contact, blog posts)

#### WordPress Page (/solutions/wordpress)

- [ ] Page loads without errors
- [ ] Hero section displays with correct title
- [ ] Service list displays all WordPress services
- [ ] "Why CartShift for Web Development" section shows
- [ ] FAQ section renders (if present)
- [ ] CTA button at bottom works
- [ ] Internal links work

### C. About Page Tests (/about)

- [ ] Page loads without errors
- [ ] "Our Story" section displays
- [ ] Team member bios show with photos
- [ ] Values section displays all 4 values
- [ ] "What to Expect" section shows
- [ ] CTA at bottom works

### D. Blog Tests

#### Blog Index (/blog)

- [ ] Blog listing page loads
- [ ] All blog posts display in grid/list
- [ ] Post titles, dates, excerpts visible
- [ ] Category filters work (if implemented)
- [ ] Search works (if implemented)
- [ ] Pagination works (if multiple pages)
- [ ] Featured images display

#### Individual Blog Post (/blog/[slug])

- [ ] Post content renders correctly
- [ ] Markdown formatting displays properly
  - [ ] Headings hierarchy correct
  - [ ] Lists (ordered and unordered) formatted
  - [ ] Code blocks syntax highlighted
  - [ ] Links work and open correctly
  - [ ] Images display with captions
  - [ ] Blockquotes styled correctly
  - [ ] Tables formatted (if any)
- [ ] Reading time displays
- [ ] Author info shows
- [ ] Related posts section displays
- [ ] Social share buttons work (if present)

### E. Contact Page Tests (/contact)

- [ ] Page loads without errors
- [ ] Contact form displays all fields:
  - [ ] Name field
  - [ ] Email field
  - [ ] Company/Website field (optional)
  - [ ] Project Type dropdown
  - [ ] Message textarea
- [ ] Form validation works:
  - [ ] Required fields show error when empty
  - [ ] Email validation works
  - [ ] Error messages display properly
- [ ] Submit button works
- [ ] Success message displays after submission
- [ ] Form resets after successful submission
- [ ] Alternative contact methods display (email, phone)

### F. Navigation Tests

- [ ] **Desktop Navigation**
  - [ ] Logo links to homepage
  - [ ] All menu items visible
  - [ ] Solutions dropdown works (hover or click)
  - [ ] Active page highlighted
  - [ ] All links navigate correctly

- [ ] **Mobile Navigation**
  - [ ] Hamburger menu icon visible on mobile
  - [ ] Menu opens/closes smoothly
  - [ ] All menu items accessible
  - [ ] Solutions submenu works on mobile
  - [ ] Menu closes when clicking outside
  - [ ] Menu closes when selecting a link

- [ ] **Footer**
  - [ ] All footer links work
  - [ ] Social media icons link correctly
  - [ ] Newsletter signup works (if present)
  - [ ] Copyright info displays

### G. Language/Locale Tests

- [ ] English locale works (/en)
- [ ] Hebrew locale works (/he)
- [ ] Language switcher functions
- [ ] RTL layout works for Hebrew
- [ ] All translations load correctly
- [ ] Forms work in both languages

---

## II. Portal Testing

### A. Authentication Tests

#### Login Page (/portal/login)

- [ ] Page loads without errors
- [ ] Login form displays
- [ ] Email and password fields work
- [ ] "Forgot password" link works
- [ ] "Sign up" link works
- [ ] Form validation:
  - [ ] Empty fields show errors
  - [ ] Invalid email shows error
  - [ ] Wrong credentials show error
- [ ] Successful login redirects to dashboard
- [ ] "Remember me" works (if present)
- [ ] SSO buttons work (Google, etc.)

#### Signup Page (/portal/signup)

- [ ] Page loads without errors
- [ ] Signup form displays all fields
- [ ] Password confirmation matches
- [ ] Form validation works
- [ ] Successful signup creates account
- [ ] Email verification triggers (if implemented)
- [ ] Auto-login after signup works

#### Invite Accept Page (/portal/invite/[code])

- [ ] Page loads with valid invite code
- [ ] Invite details display (org name, role, inviter)
- [ ] Accept button works
- [ ] Invalid code shows error
- [ ] Expired invite shows error
- [ ] Already accepted invite shows message

### B. Portal Dashboard Tests (/portal/dashboard)

- [ ] Page requires authentication (redirects if not logged in)
- [ ] Dashboard loads all sections:
  - [ ] Stats cards display (total requests, active, etc.)
  - [ ] Recent requests list shows
  - [ ] Service status indicators work
  - [ ] Insight/plan information displays
- [ ] "New Request" button works
- [ ] Quick actions work
- [ ] Data loads correctly from Firebase
- [ ] Loading states display properly

### C. Requests Tests (/portal/requests)

#### Request List

- [ ] All requests display in table/list
- [ ] Columns show correct data (ID, title, status, priority, dates)
- [ ] Status badges styled correctly
- [ ] Priority indicators work
- [ ] Clicking a request navigates to detail page
- [ ] "New Request" button works
- [ ] Filters work (status, priority)
- [ ] Search works (if implemented)
- [ ] Empty state shows when no requests

#### New Request Page (/portal/requests/new)

- [ ] Form loads with all fields
- [ ] Title field works
- [ ] Category dropdown populates
- [ ] Priority selector works
- [ ] Details textarea works
- [ ] File upload works:
  - [ ] Can select files
  - [ ] File preview shows
  - [ ] Can remove uploaded files
  - [ ] File size validation works
  - [ ] File type validation works
- [ ] Form validation:
  - [ ] Required fields validated
  - [ ] Character limits enforced
- [ ] Submit button works
- [ ] Success redirect to request detail
- [ ] Error handling works

#### Request Detail Page (/portal/requests/[id])

- [ ] Page loads request details
- [ ] Request info displays (title, status, priority, date)
- [ ] Description/details render correctly
- [ ] Attached files display and can be downloaded
- [ ] Discussion/messages section works:
  - [ ] Past messages display
  - [ ] Can add new message
  - [ ] Message form validation works
  - [ ] Real-time updates work (if implemented)
- [ ] Status change actions work
- [ ] Can add attachments to discussion
- [ ] Assigned specialist info shows

### D. Team Management Tests (/portal/team)

- [ ] Team members list displays
- [ ] Member info shows (name, email, role)
- [ ] Pending invites section displays
- [ ] "Invite Member" button works
- [ ] Invite form works:
  - [ ] Email field validates
  - [ ] Role selector works
  - [ ] Submit sends invite
- [ ] Can cancel pending invites
- [ ] Copy invite link works
- [ ] Role badges display correctly
- [ ] Member avatars show

### E. Files Management Tests (/portal/files)

- [ ] Files list displays all organization files
- [ ] File info shows (name, size, type, date, uploader)
- [ ] Upload button works
- [ ] File upload modal works:
  - [ ] Drag-and-drop works
  - [ ] Click to browse works
  - [ ] File preview shows
  - [ ] Upload progress displays
  - [ ] Success/error feedback works
- [ ] File actions work:
  - [ ] Download file
  - [ ] Delete file (with confirmation)
  - [ ] Share link (if implemented)
- [ ] Search/filter works
- [ ] Empty state shows when no files

### F. Settings Tests (/portal/settings)

#### General Settings

- [ ] Organization name can be updated
- [ ] Industry field works
- [ ] Website URL can be added
- [ ] Bio/description textarea works
- [ ] Save button works
- [ ] Changes persist after refresh

#### Notifications Settings

- [ ] All notification toggles work
- [ ] Changes save automatically or with save button
- [ ] Settings persist

#### Security Settings

- [ ] Password change request works
- [ ] Email confirmation works
- [ ] Session info displays

#### Billing Settings (if implemented)

- [ ] Plan info displays
- [ ] Payment method shows
- [ ] Billing history loads
- [ ] Update payment button works

### G. Portal Layout & Navigation Tests

- [ ] Sidebar displays on desktop
- [ ] Sidebar collapses/expands
- [ ] Mobile menu works
- [ ] Navigation items highlight active page
- [ ] User menu works (profile dropdown)
- [ ] Logout works and redirects to login
- [ ] Breadcrumbs display correctly (if present)
- [ ] Search bar works (if global search exists)

---

## III. Responsive Design Testing

### Mobile (320px - 480px)

- [ ] All pages render without horizontal scroll
- [ ] Text is readable (not too small)
- [ ] Buttons are tappable (min 44x44px)
- [ ] Forms are usable
- [ ] Navigation works
- [ ] Images scale appropriately
- [ ] No overlapping elements

### Tablet (481px - 768px)

- [ ] Layout adapts properly
- [ ] Content is properly sized
- [ ] Navigation works (hamburger or full menu)
- [ ] Forms are comfortable to use
- [ ] Images and cards scale well

### Desktop (769px - 1920px+)

- [ ] Full navigation displays
- [ ] Content uses space effectively
- [ ] Multi-column layouts work
- [ ] Sidebar navigation works (portal)
- [ ] No excessive white space

### Test Specific Breakpoints

- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13)
- [ ] 390px (iPhone 14)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape)
- [ ] 1366px (Common laptop)
- [ ] 1920px (Full HD)

---

## IV. Performance Testing

### Lighthouse Audit (Chrome DevTools)

Run for each major page and aim for:

- [ ] Performance: 90+ (green)
- [ ] Accessibility: 95+ (green)
- [ ] Best Practices: 90+ (green)
- [ ] SEO: 95+ (green)

### Core Web Vitals

- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1
- [ ] INP (Interaction to Next Paint): < 200ms

### Speed Tests

- [ ] Homepage loads in < 2s
- [ ] Blog posts load in < 2s
- [ ] Portal pages load in < 2s
- [ ] Images lazy load properly
- [ ] No blocking resources
- [ ] Code splitting works

---

## V. Accessibility Testing

### Keyboard Navigation

- [ ] Can navigate entire site with Tab key
- [ ] Focus indicators visible
- [ ] Can submit forms with Enter
- [ ] Can close modals with Escape
- [ ] Skip to main content link works
- [ ] No keyboard traps

### Screen Reader Testing (NVDA/JAWS/VoiceOver)

- [ ] All images have alt text
- [ ] Form labels properly associated
- [ ] Buttons have descriptive labels
- [ ] Headings in logical order (H1 → H2 → H3)
- [ ] ARIA labels on interactive elements
- [ ] Error messages announced
- [ ] Status updates announced

### Color Contrast

- [ ] Text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] Interactive elements distinguishable
- [ ] Focus indicators have sufficient contrast
- [ ] Error states visible

---

## VI. SEO Testing

### Meta Tags

- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] Open Graph tags present (og:title, og:description, og:image)
- [ ] Twitter Card tags present
- [ ] Canonical URLs set correctly

### Schema Markup

Test using [Google Rich Results Test](https://search.google.com/test/rich-results):

- [ ] Organization schema validates
- [ ] Service schema validates
- [ ] Article schema validates (blog posts)
- [ ] BreadcrumbList schema validates
- [ ] FAQPage schema validates (if present)

### Sitemap & Robots

- [ ] `/sitemap.xml` accessible and valid
- [ ] `/robots.txt` configured correctly
- [ ] All pages indexed (check sitemap includes all)
- [ ] No broken internal links

### Content

- [ ] Heading hierarchy correct (H1 → H2 → H3)
- [ ] Images have descriptive alt text
- [ ] Links have descriptive text (not "click here")
- [ ] Content is readable (Fleisch Reading Ease 60-70)

---

## VII. Security Testing

### Authentication

- [ ] Login required for protected routes
- [ ] Invalid credentials rejected
- [ ] Session expires after timeout
- [ ] Logout clears session
- [ ] Password reset is secure

### Authorization

- [ ] Users can only access their organization data
- [ ] Roles enforced (admin, member, viewer)
- [ ] API endpoints check permissions
- [ ] Can't access other users' data via URL manipulation

### Data Validation

- [ ] Form inputs sanitized
- [ ] XSS protection works
- [ ] SQL injection protection (if applicable)
- [ ] File uploads validated (type, size)
- [ ] Rate limiting works (prevent spam)

### HTTPS

- [ ] Site forces HTTPS
- [ ] No mixed content warnings
- [ ] Security headers present

---

## VIII. Cross-Browser Testing

Test all major pages in:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

Check for:

- [ ] Layout consistency
- [ ] Functionality works
- [ ] Animations/transitions smooth
- [ ] Forms work correctly
- [ ] No console errors

---

## IX. Error Handling Testing

### Client-Side Errors

- [ ] 404 page displays for invalid routes
- [ ] Error boundary catches React errors
- [ ] Network errors show user-friendly message
- [ ] Form submission errors display clearly

### Server-Side Errors

- [ ] API errors handled gracefully
- [ ] Firebase errors caught and displayed
- [ ] Auth errors shown appropriately
- [ ] Timeout errors handled

---

## X. Analytics Testing

### Google Analytics

- [ ] GA script loads
- [ ] Page views tracked
- [ ] Events tracked (form submissions, button clicks)
- [ ] User flow makes sense
- [ ] No tracking errors in console

### Firebase Analytics (if used)

- [ ] Events logging correctly
- [ ] User properties set
- [ ] Screen views tracked

---

## XI. Integration Testing

### Firebase Integration

- [ ] Authentication works
- [ ] Firestore reads/writes work
- [ ] Storage uploads work
- [ ] Security rules enforced
- [ ] Real-time updates work (if used)

### Email Integration (if implemented)

- [ ] Contact form emails send
- [ ] Invite emails send
- [ ] Notification emails work
- [ ] Email templates render correctly

### Payment Integration (if implemented)

- [ ] Payment form displays
- [ ] Test payments process
- [ ] Success/failure handled
- [ ] Webhooks work

---

## 🔧 Testing Tools

### Required

- Chrome DevTools (F12)
- Firefox Developer Tools
- Lighthouse (built into Chrome)

### Recommended

- [WAVE Browser Extension](https://wave.webaim.org/extension/) - Accessibility
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility
- [Google Rich Results Test](https://search.google.com/test/rich-results) - Schema
- [PageSpeed Insights](https://pagespeed.web.dev/) - Performance
- [BrowserStack](https://www.browserstack.com/) - Cross-browser (if available)

---

## 📝 Bug Reporting Template

When you find an issue, document it:

```
**Bug Title:** [Brief description]

**Priority:** Critical / High / Medium / Low

**Page/Component:** [Where it occurs]

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: [Chrome 120, Firefox 121, etc.]
- Device: [Desktop, iPhone 14, etc.]
- Screen Size: [1920x1080, 375x667, etc.]

**Screenshots/Video:**
[Attach if helpful]

**Console Errors:**
[Copy any error messages]
```

---

## ✅ Final Checks Before Production

- [ ] All compile errors fixed
- [ ] All console warnings resolved
- [ ] No console errors on any page
- [ ] All environment variables set
- [ ] Firebase rules deployed
- [ ] Analytics configured
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured
- [ ] SSL certificate valid
- [ ] Domain configured correctly
- [ ] Performance meets targets
- [ ] Accessibility compliance checked
- [ ] SEO basics covered
- [ ] Content proofread
- [ ] Legal pages complete (Privacy, Terms)

---

## 🎯 Quick Smoke Test (5 minutes)

For rapid verification, test these critical paths:

1. **Public Site**: Homepage → Solutions Page → Blog → Contact Form Submit
2. **Portal**: Login → Dashboard → Create Request → View Request
3. **Mobile**: Repeat above on mobile device/emulator
4. **Check**: No console errors, all forms work, navigation works

---

**Happy Testing! 🚀**
