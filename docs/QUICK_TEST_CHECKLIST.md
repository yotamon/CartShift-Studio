# ✅ Quick Testing Checklist for CartShift Studio

## 🚀 **Server Status**: ✅ Running at http://localhost:3000

---

## 🎯 Priority Tests (Start Here - 10 min)

### 1. Homepage Test

- [ ] Open http://localhost:3000
- [ ] Hero section displays correctly
- [ ] Platform icons (Shopify, WordPress, etc.) show
- [ ] Hero form visible and styled
- [ ] Services overview cards display
- [ ] Testimonials section visible
- [ ] Blog teaser shows latest posts
- [ ] CTA banner at bottom displays
- [ ] No console errors

### 2. Navigation Test

- [ ] Click each menu item (Home, Solutions, About, Blog, Contact)
- [ ] Solutions dropdown works (hover/click)
- [ ] All links navigate correctly
- [ ] Mobile menu works (resize browser to < 768px)
- [ ] Footer links work

### 3. Solutions Pages

- [ ] /solutions/shopify loads
- [ ] /solutions/wordpress loads
- [ ] Service lists display
- [ ] CTAs work

### 4. Blog Test

- [ ] /blog loads with post list
- [ ] Click any blog post
- [ ] Post content renders correctly
- [ ] Markdown formatting looks good
- [ ] Images display (if any)
- [ ] Related posts section shows

### 5. Contact Page

- [ ] /contact loads
- [ ] Form displays all fields
- [ ] Try submitting empty form (should show errors)
- [ ] Fill valid data and submit
- [ ] Success message appears

### 6. Portal Authentication

- [ ] /portal/login loads
- [ ] Login form displays
- [ ] Try wrong credentials (should error)
- [ ] Try valid credentials
- [ ] Redirects to dashboard on success

### 7. Portal Dashboard

- [ ] Dashboard loads after login
- [ ] Stats cards display
- [ ] Recent requests show
- [ ] Sidebar navigation works
- [ ] Can create new request

---

## 🔍 Detailed Testing (30-60 min)

### Portal Features

#### Dashboard (/portal/dashboard)

- [ ] All stat cards show numbers
- [ ] Service status indicators work
- [ ] "New Request" button navigates
- [ ] No loading errors

#### Requests (/portal/requests)

- [ ] Request list displays
- [ ] Status badges colored correctly
- [ ] Can click request to view details
- [ ] "New Request" button works
- [ ] Empty state shows if no requests

#### New Request (/portal/requests/new)

- [ ] All form fields present
- [ ] Category dropdown populated
- [ ] Priority selector works
- [ ] File upload works
  - Select file
  - Preview shows
  - Can remove file
- [ ] Form validation works
- [ ] Submit creates request
- [ ] Redirects to request detail

#### Request Detail (/portal/requests/[id])

- [ ] Request info displays
- [ ] Discussion messages show
- [ ] Can add new message
- [ ] File attachments visible
- [ ] Status actions work

#### Team Management (/portal/team)

- [ ] Team members list
- [ ] Pending invites section
- [ ] "Invite Member" button works
- [ ] Invite form validates
- [ ] Can send invite
- [ ] Can cancel pending invite

#### Files (/portal/files)

- [ ] Files list displays
- [ ] Upload button works
- [ ] Can select/drag files
- [ ] Upload progress shows
- [ ] Files appear in list
- [ ] Can download files
- [ ] Can delete files

#### Settings (/portal/settings)

- [ ] General settings tab
- [ ] Can update org name
- [ ] Can update other fields
- [ ] Save button works
- [ ] Notifications tab works
- [ ] Security tab loads
- [ ] Billing tab loads

---

## 📱 Mobile Testing (15 min)

1. **Resize browser to mobile width (< 768px) or use DevTools Device Mode**

### Test On Mobile:

- [ ] Homepage mobile layout
- [ ] Hamburger menu opens/closes
- [ ] Forms are usable
- [ ] Buttons are tappable
- [ ] Text is readable
- [ ] No horizontal scroll
- [ ] Portal sidebar becomes mobile menu
- [ ] Portal forms work on mobile

---

## ⚡ Performance Check (5 min)

1. **Open Chrome DevTools (F12) → Lighthouse**
2. Run audit on homepage
3. Check scores:
   - [ ] Performance: 70+ (aim for 90+)
   - [ ] Accessibility: 90+
   - [ ] Best Practices: 90+
   - [ ] SEO: 90+

---

## 🐛 Error Checking (Ongoing)

### Browser Console (F12 → Console)

- [ ] No red errors on homepage
- [ ] No errors on solutions pages
- [ ] No errors on blog pages
- [ ] No errors on contact page
- [ ] No errors in portal pages
- [ ] No errors in browser Network tab (failed requests)

### Common Issues to Check:

- [ ] Images load properly (not broken)
- [ ] Fonts load correctly
- [ ] Icons display (Lucide icons)
- [ ] Animations work smoothly
- [ ] No layout shifts while loading
- [ ] Forms submit without errors
- [ ] Firebase operations work
- [ ] Auth persists after refresh

---

## 🌐 Localization Test (10 min)

### English Locale

- [ ] /en/... pages load
- [ ] All text in English
- [ ] Forms work
- [ ] Portal works

### Hebrew Locale

- [ ] /he/... pages load
- [ ] All text in Hebrew (RTL)
- [ ] Layout flips correctly (RTL)
- [ ] Forms work in RTL
- [ ] Portal works in RTL

---

## ✅ Quick Status Check Commands

### Check for Errors:

```bash
# In VS Code, view the PROBLEMS panel (Ctrl+Shift+M)
```

### Check Terminal:

Look for any compilation errors or warnings in the terminal where `pnpm dev` is running

---

## 📋 Test Results Template

```
Date: [DATE]
Tester: [YOUR NAME]
Environment: Local Development

CRITICAL ISSUES:
- [ ] None found OR list issues

HIGH PRIORITY:
- [ ] None found OR list issues

MEDIUM PRIORITY:
- [ ] None found OR list issues

LOW PRIORITY:
- [ ] None found OR list issues

NOTES:
[Any additional observations]
```

---

## 🎉 Success Criteria

Your application is ready if:

- ✅ No console errors on main pages
- ✅ Navigation works throughout
- ✅ Forms submit successfully
- ✅ Portal login and features work
- ✅ Mobile layout is usable
- ✅ Performance scores are green (70+)
- ✅ Content displays correctly in both languages

---

## 🆘 If You Find Issues

1. **Note the issue** (what page, what action, what error)
2. **Check browser console** for error messages
3. **Check terminal** for server errors
4. **Take screenshot** if visual issue
5. **Report with steps to reproduce**

---

## 📞 Need Help?

- Check `TESTING_GUIDE.md` for comprehensive testing
- Review `docs/TESTING.md` for detailed checklist
- Check Firebase console for auth/database issues
- Review browser DevTools Network tab for API issues

---

**Good luck testing! 🚀**
