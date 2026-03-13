---
applyTo: '**/*.less'
---

# LESS Styles Conventions — SentinelWebPortal

## File Structure

```less
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

## Rules

- **Root selector:** Always use `:host` as the root selector
- **Child selectors:** Use `& .class-name` syntax for nesting
- **Units:** Use only `rem` — never `px` (reference: 10px = 1rem)
- **Standard spacing values:** `0.3rem`, `0.6rem`, `0.8rem`, `1.2rem`, `1.6rem`, `1.8rem`, `2rem`, `2.4rem`, `2.6rem`
- **Colors / fonts / sizes:** Always use variables from `variables.less` — never hard-code values directly
- **Direct values:** If a direct value is unavoidable, add comment: `//! Important dont use value directly use variable defined in variables.less`
- **Empty classes:** Remove all empty rule sets (`.my-class {}`)
- **Class names:** Refer to the corresponding `.component.html` file to complete class names
- **Variables source:** Only use LESS variables defined in `src/styles/variables.less`
