---
applyTo: '**/*.less'
---

# LESS Styles Conventions — FormationWebApp

## Overview

This file governs all LESS stylesheet conventions. Always check the companion `.html` and `.js` files to ensure class names and interactions are consistent.

## File Structure

```less
@import '../../styles/variables.less';

:host {
  flex: 1;
  display: flex;

  & .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: @spacing-lg;
  }

  & .icon {
    height: 1.8rem;
    width: 1.8rem;
    background: @color-theme-primary;

    &.delete {
      background: @color-text-secondary;
      mask: url('/assets/images/icon-delete.svg') no-repeat center;
      mask-size: cover;
    }
  }
}
```

## Rules

### Root & Nesting
- **Root selector:** Always use `:host` as the root selector
- **Child selectors:** Use `& .class-name` syntax for nesting
- **Modifier classes:** Use `&.modifier` (no space) for same-element modifiers
- **BEM variants:** Use `&-suffix` for BEM-style child elements
- **Reference HTML:** Check the corresponding `.html` file for actual class names before writing styles

### Units & Sizing
- **Units:** Use only `rem` — never `px` (reference: 10px = 1rem)
- **Standard spacing values:** `0.3rem`, `0.6rem`, `0.8rem`, `1.2rem`, `1.6rem`, `1.8rem`, `2rem`, `2.4rem`, `2.6rem`
- **Use LESS variables:** `@spacing-xs`, `@spacing-sm`, `@spacing-md`, `@spacing-lg`, `@spacing-xl`, `@spacing-2xl`, `@spacing-3xl`

### Variables (Colors, Fonts, Sizes)
- **Source:** All variables defined in `styles/variables.less`
- **Variable format:** Use `@color-*` and `@spacing-*` LESS variables (wrapped around CSS custom properties)
- **Never hard-code:** Colors, sizes, spacing, or fonts — always use variables
- **If unavoidable:** Add comment: `//! Important: use CSS variable instead`

### Code Quality
- **Empty classes:** Remove all empty rule sets (`.my-class {}`)
- **Maximum nesting:** Keep nesting 3+ levels deep to minimum
- **Comments:** Add comments for complex selectors or non-obvious styling decisions
- **Consistency:** Match the HTML structure (pages/{name}/{name}.less imports variables from pages/{name}/{name}.html)

## Workflow

1. **Open the LESS file** (e.g., `pages/contact/contact.less`)
2. **Check the HTML file** — See what classes are actually used
3. **Check the JS file** — Understand how elements are manipulated dynamically
4. **Write LESS** — Use `:host`, `@color-*`, `@spacing-*`, `rem` units
5. **Recompile** — Run `npm run less` to generate CSS

## Examples

### ✅ Good
```less
@import '../../styles/variables.less';

:host {
  display: flex;
  gap: @spacing-md;

  & .card {
    background: @color-card-background;
    padding: @spacing-lg;
    border-radius: 0.8rem;

    &-title {
      font-size: 1.6rem;
      color: @color-text-primary;
    }

    &:hover {
      background: @color-button-hover-bg;
    }
  }
}
```

### ❌ Bad
```less
:host {
  display: flex;
  gap: 2.4rem;  // ← Should use @spacing-md

  & .card {
    background: #f2f2f2;  // ← Should use @color-card-background
    padding: 3.2rem;      // ← Should use @spacing-lg
    border-radius: 8px;   // ← Should use rem (0.8rem)
  }
}
```

## Related Files

- **HTML Conventions:** `copilot-instructions-html.md` (class naming, structure)
- **JS Conventions:** `copilot-instructions-js.md` (DOM queries, variable naming)
- **Global Rules:** `.instructions.md` (Prettier, organization, nammable)
- **Variables:** `styles/variables.less` (all available CSS custom properties)
