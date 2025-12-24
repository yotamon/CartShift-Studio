# Design Token System

**Last Updated:** December 19, 2024
**Version:** 1.0

---

## Color Tokens

### Primary Color Scale (Sky Blue)

Brand color for primary actions, links, and highlights.

```tsx
primary-50:  #f0f9ff  // Very light background
primary-100: #e0f2fe  // Light background
primary-200: #bae6fd  // Subtle accent
primary-300: #7dd3fc  // Soft highlight
primary-400: #38bdf8  // Medium emphasis
primary-500: #0ea5e9  // Standard use
primary-600: #0284c7  // 🎨 BRAND COLOR - Main primary
primary-700: #0369a1  // Hover states
primary-800: #075985  // Active states
primary-900: #0c4a6e  // Deep emphasis
primary-950: #082f49  // Maximum contrast
```

**Usage:**

- Primary CTAs: `bg-primary-600 hover:bg-primary-700`
- Links: `text-primary-600 dark:text-primary-400`
- Borders: `border-primary-500`

---

### Accent Color Scale (Magenta)

Brand color for secondary actions, highlights, and creative elements.

```tsx
accent-50:  #fdf4ff  // Very light background
accent-100: #fae8ff  // Light background
accent-200: #f5d0fe  // Subtle accent
accent-300: #f0abfc  // Soft highlight
accent-400: #e879f9  // Medium emphasis
accent-500: #d946ef  // Standard use
accent-600: #c026d3  // 🎨 BRAND COLOR - Main accent
accent-700: #a21caf  // Hover states
accent-800: #86198f  // Active states
accent-900: #701a75  // Deep emphasis
accent-950: #4a044e  // Maximum contrast
```

**Usage:**

- Secondary CTAs: `bg-accent-600 hover:bg-accent-700`
- Creative highlights: `text-accent-500`
- Gradients: `from-primary-600 to-accent-600`

---

### Surface Color Scale (Neutral Grays)

**STANDARD FOR ALL NEUTRAL COLORS** - Replaces `slate-*` usage.

```tsx
surface-50:  #f8fafc  // Lightest background
surface-100: #f1f5f9  // Very light background
surface-200: #e2e8f0  // Light borders
surface-300: #cbd5e1  // Medium borders, muted text
surface-400: #94a3b8  // Placeholder text
surface-500: #64748b  // Icon colors
surface-600: #475569  // Secondary text
surface-700: #334155  // Primary dark borders
surface-800: #1e293b  // Dark cards/surfaces
surface-850: #172033  // 🎨 INTERMEDIATE - Elevated dark surfaces
surface-900: #0f172a  // 🎨 BRAND - Primary dark background
surface-950: #020617  // Deepest background
```

**Usage Guidelines:**

#### Light Mode:

```tsx
// Backgrounds:
bg - white; // Primary surface (cards, modals)
bg - surface - 50; // Subtle differentiation
bg - surface - 100; // Secondary surface

// Text:
text - surface - 900; // Headings, primary text
text - surface - 700; // Body text
text - surface - 600; // Secondary text
text - surface - 500; // Muted text, icons

// Borders:
border - surface - 200; // Standard borders
border - surface - 300; // Emphasized borders
```

#### Dark Mode:

```tsx
// Backgrounds:
dark: bg - surface - 900; // Primary background (default)
dark: bg - surface - 850; // Elevated cards (subtle depth)
dark: bg - surface - 800; // Cards, modals

// Text:
dark: text - white; // Headings, high contrast (use sparingly)
dark: text - surface - 50; // Primary text (alternative to white)
dark: text - surface - 200; // Body text
dark: text - surface - 300; // Secondary text
dark: text - surface - 400; // Muted text
dark: text - surface - 500; // Icon colors

// Borders:
dark: border - surface - 700; // Standard borders
dark: border - surface - 600; // Emphasized borders
```

---

### Semantic Colors

```tsx
// Success (Green)
success: #10b981

// Error (Red)
error: #ef4444

// Warning (Amber)
warning: #f59e0b
```

**Usage:**

- Status indicators
- Form validation
- Alert messages

---

### CSS Custom Properties

```css
:root {
  --background: #f0f4f8; /* Light mode body background */
  --foreground: #1e293b; /* Light mode text */
  --glass-bg: rgba(255, 255, 255, 0.75); /* Glass morphism */
  --glass-border: rgba(148, 163, 184, 0.25);
  --section-alt: #e8eef4; /* Alternate section bg */
  --card-bg: rgba(255, 255, 255, 0.85);
}

.dark:root {
  --background: #0f172a; /* Dark mode body background */
  --foreground: #f8fafc; /* Dark mode text */
  --glass-bg: rgba(15, 23, 42, 0.45);
  --glass-border: rgba(255, 255, 255, 0.15);
  --section-alt: #1e293b;
  --card-bg: rgba(255, 255, 255, 0.05);
}
```

---

## Typography Tokens

### Font Families

```tsx
font-sans: Inter         // Body text, UI
font-display: Poppins    // Headings, display
font-mono: JetBrains Mono // Code, technical
```

### Font Sizes (Proposed Scale)

```tsx
// Display (Headings)
text-display-xl: 4.5rem / 72px    // Hero headlines
text-display-lg: 3.75rem / 60px   // Page titles
text-display-md: 3rem / 48px      // Section titles
text-display-sm: 2.5rem / 40px    // Card titles

// Text
text-2xl: 1.5rem / 24px   // Subheadings
text-xl: 1.25rem / 20px   // Large text
text-lg: 1.125rem / 18px  // Emphasized body
text-base: 1rem / 16px    // Body text (default)
text-sm: 0.875rem / 14px  // Secondary text
text-xs: 0.75rem / 12px   // Captions, labels
```

### Font Weights

```tsx
font-light: 300      // Use sparingly
font-normal: 400     // Body text
font-medium: 500     // Subtle emphasis
font-semibold: 600   // Headings, labels
font-bold: 700       // Strong emphasis
font-black: 900      // Display text (rare)
```

**Standard Pattern:**

```tsx
// Headings:
className = 'font-display font-bold text-display-md text-surface-900 dark:text-white';

// Body:
className = 'font-sans font-normal text-base text-surface-700 dark:text-surface-200';

// Labels:
className = 'font-sans font-medium text-sm text-surface-600 dark:text-surface-300';
```

---

## Spacing Tokens

### Standard Spacing Scale

Tailwind default scale (4px base):

```tsx
0: 0px
px: 1px
0.5: 2px
1: 4px
2: 8px
3: 12px
4: 16px    // ⭐ Standard gap
5: 20px
6: 24px    // ⭐ Standard card padding
8: 32px    // ⭐ Section gap
10: 40px
12: 48px   // ⭐ Large section gap
16: 64px
20: 80px
24: 96px
```

### Custom Spacing Tokens

```tsx
// Section padding:
section-y: 5rem / 80px       // Mobile sections
section-y-md: 6rem / 96px    // Tablet sections
section-y-lg: 8rem / 128px   // Desktop sections

// Component spacing:
spacing-88: 22rem / 352px
spacing-128: 32rem / 512px
```

### Component Spacing Standards

```tsx
// Buttons:
sm: px-5 py-2.5   // 20px x 10px
md: px-7 py-3.5   // 28px x 14px
lg: px-9 py-4     // 36px x 16px

// Cards:
standard: p-6     // 24px all sides
compact: p-4      // 16px all sides
spacious: p-8     // 32px all sides

// Sections:
mobile: py-16     // 64px top/bottom
desktop: py-24    // 96px top/bottom
hero: py-32       // 128px top/bottom
```

---

## Shadow Tokens

### Standard Shadows

```tsx
// Soft (subtle elevation)
shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07),
             0 10px 20px -2px rgba(0, 0, 0, 0.04)

// Medium (card elevation)
shadow-medium: 0 4px 25px -5px rgba(0, 0, 0, 0.1),
               0 10px 10px -5px rgba(0, 0, 0, 0.04)

// Premium (important elements)
shadow-premium: 0 10px 40px -10px rgba(30, 41, 59, 0.2),
                0 4px 12px -2px rgba(30, 41, 59, 0.08),
                0 0 0 1px rgba(148, 163, 184, 0.15)

// Glow (hover state, accent)
shadow-glow: 0 0 20px rgba(192, 38, 211, 0.4),
             0 0 40px rgba(192, 38, 211, 0.2)

// Glow Primary (primary hover)
shadow-glow-primary: 0 0 20px rgba(2, 132, 199, 0.4),
                     0 0 40px rgba(2, 132, 199, 0.2)
```

**Dark Mode Variants:**

```tsx
dark:shadow-premium: 0 10px 40px -10px rgba(0, 0, 0, 0.3),
                     0 0 0 1px rgba(255, 255, 255, 0.1)
```

---

## Border Radius Tokens

```tsx
rounded-sm: 0.125rem / 2px    // Subtle
rounded: 0.25rem / 4px        // Standard
rounded-md: 0.375rem / 6px    // Medium
rounded-lg: 0.5rem / 8px      // Large (default buttons)
rounded-xl: 0.75rem / 12px    // XL (default cards)
rounded-2xl: 1rem / 16px      // 2XL (sections)
rounded-3xl: 1.5rem / 24px    // 3XL (glass cards)
rounded-4xl: 2rem / 32px      // Custom
rounded-5xl: 2.5rem / 40px    // Custom (large modals)
rounded-full: 9999px          // Circles, pills
```

**Standard Usage:**

```tsx
// Buttons:
className = 'rounded-xl'; // 12px

// Cards:
className = 'rounded-2xl'; // 16px

// Sections/Modals:
className = 'rounded-3xl'; // 24px
```

---

## Animation Tokens

### Duration Tokens

```tsx
duration-75: 75ms      // Ultra-fast (micro-interactions)
duration-100: 100ms    // Very fast
duration-150: 150ms    // Fast
duration-200: 200ms    // Quick (hover states)
duration-300: 300ms    // ⭐ DEFAULT - Standard transitions
duration-500: 500ms    // Slow (emphasis)
duration-700: 700ms    // Very slow
duration-1000: 1000ms  // Dramatic (page transitions)
```

### Easing Functions

```tsx
ease-linear: cubic-bezier(0, 0, 1, 1)
ease-in: cubic-bezier(0.4, 0, 1, 1)
ease-out: cubic-bezier(0, 0, 0.2, 1)       // ⭐ DEFAULT
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### Framer Motion Constants

```tsx
// lib/motion-constants.ts (proposed)
export const MOTION = {
  // Hover effects:
  hover: {
    lift: { y: -2 }, // Subtle lift
    liftLarge: { y: -8 }, // Dramatic lift
    scale: { scale: 1.02 }, // Subtle grow
    scaleLarge: { scale: 1.05 }, // Noticeable grow
  },

  // Tap effects:
  tap: {
    scale: { scale: 0.98 }, // Button press
    scaleSmall: { scale: 0.95 }, // Dramatic press
  },

  // Durations:
  duration: {
    fast: 0.2,
    default: 0.3,
    slow: 0.5,
  },

  // Spring configs:
  spring: {
    stiff: { stiffness: 300, damping: 30 },
    bouncy: { stiffness: 400, damping: 10 },
    gentle: { stiffness: 100, damping: 20 },
  },
} as const;
```

---

## Glass Morphism Tokens

### Backdrop Blur

```tsx
backdrop-blur-sm: 4px     // Subtle glass
backdrop-blur: 8px        // Standard glass
backdrop-blur-md: 12px    // Medium glass (default)
backdrop-blur-lg: 16px    // Strong glass
backdrop-blur-xl: 24px    // ⭐ Intense glass
backdrop-blur-2xl: 40px   // Maximum glass
backdrop-blur-3xl: 64px   // Extreme (rare)
```

### Opacity Scale (for glass backgrounds)

```tsx
// White opacity:
bg-white/5: rgba(255, 255, 255, 0.05)
bg-white/10: rgba(255, 255, 255, 0.1)
bg-white/15: rgba(255, 255, 255, 0.15)
bg-white/20: rgba(255, 255, 255, 0.2)
bg-white/40: rgba(255, 255, 255, 0.4)
bg-white/50: rgba(255, 255, 255, 0.5)
bg-white/60: rgba(255, 255, 255, 0.6)
bg-white/75: rgba(255, 255, 255, 0.75)  // ⭐ Light mode glass
bg-white/80: rgba(255, 255, 255, 0.8)
bg-white/90: rgba(255, 255, 255, 0.9)
bg-white/95: rgba(255, 255, 255, 0.95)  // ⭐ Sticky elements
```

### Glass Intensity Variants

```tsx
// Light intensity (subtle):
bg-white/50 dark:bg-surface-900/40
backdrop-blur-md saturate(180%)

// Medium intensity (default):
bg-white/60 dark:bg-surface-900/50
backdrop-blur-lg saturate(200%)

// Intense (maximum):
bg-white/70 dark:bg-surface-900/60
backdrop-blur-xl saturate(220%)
```

---

## Component-Specific Tokens

### Button Variants

```tsx
// Primary (brand gradient):
className="fashion-gradient text-white shadow-lg hover:shadow-glow-primary"

// Secondary (accent solid):
className="bg-accent-600 text-white hover:bg-accent-500 shadow-glow"

// Outline (transparent with border):
className="border-2 border-accent-600 dark:border-accent-500/50
           text-accent-600 dark:text-accent-400
           hover:bg-accent-50 dark:hover:bg-accent-500/10"
```

### Card Variants

```tsx
// Standard:
className = 'liquid-glass rounded-2xl p-6';

// Intense:
className = 'liquid-glass-intense rounded-3xl p-8';

// With hover:
className = 'liquid-glass rounded-2xl p-6 hover:scale-[1.02] transition-transform';
```

### Section Backgrounds

```tsx
// Default:
className = 'bg-[#f0f4f8] dark:bg-surface-900';

// Light:
className = 'bg-white/80 dark:bg-surface-800';

// White (subtle):
className = 'bg-[#e2e8f0] dark:bg-surface-850';

// Glass:
className = 'bg-gradient-to-br from-surface-50 to-surface-100 dark:bg-surface-800';
```

---

## Usage Guidelines

### ✅ Do:

- Use `surface-*` for all neutral colors
- Use `primary-*` and `accent-*` for brand colors
- Use semantic tokens (`success`, `error`, `warning`) for status
- Use CSS variables for theme-dependent values
- Combine tokens: `bg-white/75 dark:bg-surface-900/50`

### ❌ Don't:

- Mix `slate-*` and `surface-*` in the same component
- Use hardcoded color values (`text-[#25D366]`)
- Use `text-black` or `text-white` directly (use `surface-900` / `surface-50`)
  - Exception: `dark:text-white` for maximum contrast headings
- Skip dark mode variants on color classes
- Use inconsistent opacity values

### Migration Pattern:

```tsx
// ❌ Old (inconsistent):
className = 'text-slate-600 dark:text-surface-300';

// ✅ New (consistent):
className = 'text-surface-600 dark:text-surface-300';
```

---

## Quick Reference Card

```tsx
// STANDARD COMPONENT PATTERN:

<ComponentName
  className={cn(
    // Background:
    'bg-white dark:bg-surface-800',

    // Border:
    'border border-surface-200 dark:border-surface-700',

    // Text:
    'text-surface-900 dark:text-white',

    // Padding & Radius:
    'p-6 rounded-2xl',

    // Shadow:
    'shadow-premium',

    // Transition:
    'transition-all duration-300',

    // Hover:
    'hover:scale-[1.02] hover:shadow-premium-hover',

    // Custom:
    className
  )}
>
  {children}
</ComponentName>
```

---

**Next Steps:**

1. Update components to use `surface-*` consistently
2. Implement typography scale in `tailwind.config.ts`
3. Create motion constants file
4. Document component usage patterns
