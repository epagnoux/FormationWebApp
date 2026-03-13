---
applyTo: '**/*.less'
---

# LESS Styles Conventions — FormationWebApp

## File Structure

```less
:host {
  flex: 1;
  display: flex;

  & .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  & .icon {
    height: 1.8rem;
    width: 1.8rem;
    background: var(--color-theme-primary);

    &.delete {
      background: var(--color-text-secondary);
      mask: url('/assets/images/icon-delete.svg') no-repeat center;
      mask-size: cover;
    }
  }
}
```

## Rules

- **Root selector:** Always use `:host` as the root selector
- **Child selectors:** Use `& .class-name` syntax for nesting
- **Units:** Use only `rem` — never `px` (reference: 10px = 1rem)
- **Standard spacing values:** `0.3rem`, `0.6rem`, `0.8rem`, `1.2rem`, `1.6rem`, `1.8rem`, `2rem`, `2.4rem`, `2.6rem`
- **Colors / fonts / sizes:** Always use CSS variables from `style/globals.less` — never hard-code values directly
- **Variable format:** Use `var(--color-*)', `var(--spacing-*)` format from `:root` CSS variables
- **Direct values:** If a direct value is unavoidable, add comment: `//! Important: use CSS variable instead`
- **Empty classes:** Remove all empty rule sets (`.my-class {}`)
- **Class names:** Refer to the corresponding `.html` file to complete class names
