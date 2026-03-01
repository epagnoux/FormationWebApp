# Coding Conventions

This file contains the patterns, structures, and coding conventions to follow when developing.


## CSS Styles

### Structure

```css
@import '~src/styles/variables.less';

:host {
  flex: 1;
  display: flex;

  & .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  & .icon {
    height: 1.8rem;
    width: 1.8rem;
    background: @color-default-button;

    &.delete {
      background: @color-default-static-text;
      mask: url('/assets/images/icon-delete.svg') no-repeat center;
      mask-size: cover;
    }
  }
}
```

### Style Conventions

- **Units:** Use only `rem` (10px = 1rem). **This applies everywhere without exception:** dimensions, spacing, shadows, transforms (`translateY`, `translate`), border-radius, offsets, `box-shadow` values, `clamp()` arguments, etc.
- **`px` is forbidden** except for:
  - `@media` breakpoints (e.g. `min-width: 768px`)
  - SVG intrinsic attributes (e.g. `viewBox`)
  - Third-party API constraints
- **Standard Spacing:** 0.3rem, 0.6rem, 0.8rem, 1.2rem, 1.6rem, 1.8rem, 2rem, 2.4rem, 2.6rem
- **Media Queries:** use px for media queries.
- **Existing code:** When editing an existing file, also convert any `px` values found in pre-existing code (outside media queries) to `rem`.
- **Class Names:** Complete class names by referring to the HTML file with the same component name

## Markdown documentation - Guide / Summary

- no generate guide ou summmary
  or other documetation .md.
