# Skill: Write LESS Compliant with Conventions

## Objective

Structure LESS styles while respecting project variables, units, and conventions.

## Base Template

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

## Essential Rules

### 1. Always Import Variables First

```less
// ✅ CORRECT
@import '~src/styles/variables.less';

:host {
  color: @color-default-static-text;
}

// ❌ WRONG
:host {
  color: #333333; // Hardcoded value
}
```

### 2. Units: Only `rem` (no `px`)

```less
// ✅ CORRECT: Use rem only
:host {
  padding: 1.6rem; // 16px
  gap: 0.8rem; // 8px
  font-size: 1.4rem; // 14px
  border-radius: 0.4rem; // 4px
}

// ❌ WRONG: Using px
:host {
  padding: 16px; // Don't use px
  margin: 8px; // Use rem instead
}
```

### Conversion Reference

```
10px = 1rem
5px = 0.5rem
8px = 0.8rem
12px = 1.2rem
14px = 1.4rem
16px = 1.6rem
18px = 1.8rem
20px = 2rem
24px = 2.4rem
32px = 3.2rem
```

### 3. Mandatory LESS Variables for Colors, Sizes, Fonts

```less
// ✅ CORRECT: Use variables
@import '~src/styles/variables.less';

:host {
  color: @color-default-static-text;
  background: @color-default-background;
  border: 1px solid @color-default-border;
  font-family: @font-family-red-hat-text;
  font-size: 1.4rem; // OK to hardcode rem values
  gap: @spacing-03; // Or use Cobalt spacing vars
}

// ❌ WRONG: Hardcoded colors
:host {
  color: #333333;
  background: white;
  border: 1px solid #cccccc;
}
```

### 4. Structure with `:host` and Nesting

```less
@import '~src/styles/variables.less';

:host {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  & .wrapper {
    flex: 1;
    padding: 2rem;
  }

  & .title {
    font-size: 2rem;
    color: @color-heading;

    &.large {
      font-size: 2.4rem;
    }
  }

  & .content {
    flex: 1;

    & .item {
      padding: 1.2rem;
      margin-bottom: 0.8rem;
      border: 1px solid @color-default-border;

      &:hover {
        background: @color-hover-state;
      }
    }
  }
}
```

### 5. Simple, flat class names (no BEM)

Use **simple, descriptive** class names. LESS nesting and Angular encapsulation (`ViewEncapsulation.Emulated`) are sufficient to scope styles — no need for BEM convention.

```less
// ✅ CORRECT: Simple, flat class names with nesting
:host {
  & .list {
    & .item {
      padding: 0.8rem;
    }

    & .empty {
      text-align: center;
    }
  }
}

// ❌ WRONG: BEM syntax (__ and --)
:host {
  & .custom-list {
    &__item {
      padding: 0.8rem;
    }

    &__empty {
      text-align: center;
    }

    &--disabled {
      opacity: 0.5;
    }
  }
}
```

### 6. Remove Empty Classes

```less
// ❌ WRONG: Empty classes
:host {
  & .unused-class {
    // Empty = remove this!
  }
}

// ✅ CORRECT: Only define classes with styles
:host {
  & .active-class {
    font-weight: bold;
    color: @color-accent;
  }
}
```

## Standardized Spacing

Use these values for `gap`, `padding`, `margin`:

```less
@spacing-01: 0.3rem; // 3px
@spacing-02: 0.6rem; // 6px
@spacing-03: 0.8rem; // 8px
@spacing-04: 1.2rem; // 12px
@spacing-05: 1.6rem; // 16px
@spacing-06: 1.8rem; // 18px
@spacing-07: 2rem; // 20px
@spacing-08: 2.4rem; // 24px
@spacing-09: 2.6rem; // 26px
```

**Typical usage:**

```less
:host {
  gap: @spacing-05; // Standard spacing between elements
  padding: @spacing-06; // Padding inside container
  margin-bottom: @spacing-04; // Small margin
}
```

## Available Colors

Common variables from `variables.less`:

```less
// Backgrounds
@color-default-background: var(--color-default-background);
@color-hover-state: var(--color-hover-state);
@color-selected-state: var(--color-selected-state);

// Text
@color-default-static-text: var(--color-default-static-text);
@color-default-secondary-text: var(--color-default-secondary-text);
@color-heading: var(--color-heading);

// UI Elements
@color-default-button: var(--color-default-button);
@color-default-border: var(--color-default-border);
@color-accent: var(--color-accent);

// Status colors
@color-success: var(--color-success);
@color-warning: var(--color-warning);
@color-error: var(--color-error);
@color-info: var(--color-info);

// Cobalt palette (direct access)
@cob-palette-color-blue-400: #0043ce;
@cob-palette-color-blue-500: #0052cc;
```

## Common Patterns

### Flex Container

```less
:host {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  & .row {
    display: flex;
    gap: 1.2rem;
    align-items: center;
  }

  & .column {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
}
```

### Grid Layout

```less
:host {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.6rem;

  & .item {
    padding: 1.2rem;
    border: 1px solid @color-default-border;
  }
}
```

### Responsive styling

```less
:host {
  & .container {
    display: flex;
    gap: 1.6rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.8rem;
    }
  }
}
```

### Chevrons / Icons

```less
:host {
  & .icon {
    height: 1.8rem;
    width: 1.8rem;
    background: @color-default-button;
    mask: url('/assets/images/icon-delete.svg') no-repeat center;
    mask-size: cover;
  }

  & .icon.small {
    height: 1.4rem;
    width: 1.4rem;
  }
}
```

### Hover / Active States

```less
:host {
  & .button {
    padding: 1.2rem 1.6rem;
    background: @color-default-button;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: @color-hover-state;
    }

    &.active {
      background: @color-selected-state;
      font-weight: bold;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
```

## Import Cobalt Variables (if needed)

```less
// To access Cobalt variables directly
@import '/node_modules/@cae/cobalt-angular/styles/variables.less';

:host {
  color: @cob-palette-color-blue-500;
  gap: @spacing-05;
}
```

## Checklist

- [ ] First line: `@import '~src/styles/variables.less';`
- [ ] All colors use variables (never hardcoded `#fff`, `rgb()`)
- [ ] All units in `rem` (no `px`)
- [ ] Spacing follows standardized values (0.3, 0.6, 0.8, 1.2, 1.6, 1.8, 2, 2.4, 2.6)
- [ ] `:host` as root selector
- [ ] Child selectors use `& .class-name` nesting
- [ ] No BEM syntax (`__`, `--`) — use simple, flat class names
- [ ] No empty classes (remove unused styles)
- [ ] Font family uses `@font-family-red-hat-text`
- [ ] Hover/active states defined with appropriate colors
- [ ] No hardcoded layout values (use flexbox/grid)
- [ ] File name matches component: `component-name.component.less`

## Common Mistakes to Avoid

```less
// ❌ WRONG: Using px instead of rem
padding: 16px;

// ✅ CORRECT
padding: 1.6rem;

---

// ❌ WRONG: Hardcoding colors
color: #333333;
background: white;

// ✅ CORRECT
color: @color-default-static-text;
background: @color-default-background;

---

// ❌ WRONG: Missing variables import
:host {
  color: @myColor; // Variable not found!
}

// ✅ CORRECT
@import '~src/styles/variables.less';

:host {
  color: @color-default-static-text;
}

---

// ❌ WRONG: No nesting with :host
.my-class {
  color: red;
}

// ✅ CORRECT
:host {
  & .my-class {
    color: @color-accent;
  }
}

---

// ❌ WRONG: BEM naming convention
& .component {
  &__header { ... }
  &__body { ... }
  &--active { ... }
}

// ✅ CORRECT: Simple flat names with nesting
& .component {
  & .header { ... }
  & .body { ... }
  &.active { ... }
}
```
