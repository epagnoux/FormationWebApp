---
name: format-less
description: 'Reorganize and format LESS stylesheets. Use when: refactoring LESS files, maximizing nesting, applying BEM &- syntax, enforcing coding conventions on .less files.'
---

# Format LESS

Reorganize and format LESS stylesheets to maximize nesting and follow project conventions.

## When to Use

- Refactoring or cleaning up a `.less` file
- Applying consistent nesting and BEM conventions
- Reviewing LESS code for structural improvements

## Rules

### Root Selector

Always use `:host` as the root selector. All other selectors must be nested inside it.

```less
:host {
  flex: 1;
  display: flex;

  & .my-class {
    /* ... */
  }
}
```

### Nesting — Child Selectors

Use `& .class-name` syntax for child selectors nested inside `:host`.

```less
:host {
  & .wrapper {
    display: flex;
  }
}
```

### Nesting — BEM `&-` Concatenation

When multiple classes share a common prefix (e.g. `formation-banner`, `formation-detail`, `formation-attr`), **group them** under a single parent selector using `&-` to concatenate the suffix.

**Before (flat):**
```less
& .formation-banner { /* ... */ }
& .formation-banner-image { /* ... */ }
& .formation-detail { /* ... */ }
& .formation-attr { /* ... */ }
& .formation-attr-icon { /* ... */ }
& .formation-attr-text { /* ... */ }
```

**After (nested with `&-`):**
```less
& .formation {
  &-banner {
    /* ... */

    &-image {
      /* ... */
    }
  }

  &-detail {
    /* ... */
  }

  &-attr {
    /* ... */

    &-icon {
      /* ... */
    }

    &-text {
      /* ... */
    }
  }
}
```

### Nesting — Modifier Classes

Use `&.modifier` (no space) for classes applied to the same element, and `&-suffix` for BEM-style child variants.

```less
&-attr {
  /* base styles */

  &-highlight {
    /* .formation-attr-highlight */
  }

  &.icon-target {
    /* .formation-attr-icon.icon-target */
  }
}
```

### Nesting — Media Queries and `@supports`

Place `@media` and `@supports` blocks **inside** the selector they modify, at the end of the rule set.

```less
&-banner {
  padding: var(--spacing-2xl) 0;

  /* child selectors... */

  @media (min-width: 640px) {
    padding: var(--spacing-3xl) 0;
  }
}
```

### Nesting — Animations / Media Queries at Root

When a `@media` block targets multiple related selectors sharing a prefix, apply the same `&-` grouping inside it.

**Before:**
```less
@media (prefers-reduced-motion: no-preference) {
  & .formation-banner { /* ... */ }
  & .formation-attr { /* ... */ }
  & .formation-banner.in-view { /* ... */ }
  & .formation-attr.in-view { /* ... */ }
}
```

**After:**
```less
@media (prefers-reduced-motion: no-preference) {
  & .formation {
    &-banner,
    &-attr {
      /* shared styles */
    }

    &-banner.in-view,
    &-attr.in-view {
      /* in-view styles */
    }
  }
}
```

### Units

Use only `rem` — never `px`. Reference: `10px = 1rem`.

Standard spacing values: `0.3rem`, `0.6rem`, `0.8rem`, `1.2rem`, `1.6rem`, `1.8rem`, `2rem`, `2.4rem`, `2.6rem`.

### Colors / Fonts / Sizes

Always use CSS custom properties or LESS variables — never hard-code values directly. If a direct value is unavoidable, add the comment:

```less
//! Important dont use value directly use variable defined in variables.less
```

### Empty Rule Sets

Remove all empty rule sets (`.my-class {}`).

## Procedure

1. Read the target `.less` file
2. Read the corresponding `.html` file to understand the DOM structure and class names
3. Ensure `:host` is the root selector
4. Identify groups of selectors sharing a common prefix
5. Nest them using `&-` concatenation, following the DOM hierarchy
6. Place `@media` / `@supports` inside the selector they modify
7. Apply `&-` grouping inside root-level `@media` blocks when applicable
8. Verify no empty rule sets remain
9. Verify all units are in `rem`
10. Verify no hard-coded color/font values
