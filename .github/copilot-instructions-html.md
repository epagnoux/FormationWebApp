---
applyTo: '**/*.html'
---

# HTML Structure Conventions — FormationWebApp

## Overview

This file governs all HTML structure and markup conventions. Class names defined here are consumed by LESS stylesheets and JavaScript interactive logic.

## Naming Conventions

### Class Names
- **Format:** `kebab-case` (lowercase, hyphen-separated)
- **Clarity:** Descriptive and semantic: `formation-card-image` not just `card-img`
- **Single purpose:** One class = one visual component or state
- **Avoid:** Single-letter classes (`a`, `x`), abbreviations, camelCase, underscores

**Examples:**
```html
<!-- ✅ Good -->
<div class="hero-section">
<img class="hero-image" />
<button class="btn btn-primary">Action</button>
<article class="formation-card">
  <h3 class="formation-card-title">Title</h3>
  <p class="formation-card-description">Description</p>
</article>

<!-- ❌ Bad -->
<div class="heroSec">
<img class="img" />
<button class="btn b-p">Action</button>
<article class="f-c">
  <h3 class="t">Title</h3>
</article>
```

### Data Attributes
- **Format:** `data-{component}-{property}` in `kebab-case`
- **Use case:** Store state, IDs, or configuration without polluting CSS selectors
- **Examples:**
  ```html
  <button data-toggle-theme="true">Dark mode</button>
  <section data-featured="formations">Featured</section>
  <article data-article-id="123">Content</article>
  ```

## Semantic HTML

### Use Semantic Elements
```html
<!-- ✅ Correct -->
<header class="header">...</header>
<nav class="navigation">...</nav>
<main class="main-content">...</main>
<section class="hero-section">...</section>
<article class="formation-card">...</article>
<aside class="sidebar">...</aside>
<footer class="footer">...</footer>

<!-- ❌ Avoid -->
<div id="header" class="header">...</div>
<div id="nav" class="navigation">...</div>
<div class="main">...</div>
```

### Accessibility (A11y)
- **ARIA labels:** Use `aria-label` for icons and non-text elements
  ```html
  <button aria-label="Close modal">✕</button>
  <div class="icon-star" aria-label="5 star rating"></div>
  ```
- **ARIA roles:** When semantic elements don't fit
  ```html
  <div role="tablist">...</div>
  <button role="tab" aria-selected="true">Tab 1</button>
  ```
- **Form labels:** Always pair inputs with labels
  ```html
  <label for="email">Email</label>
  <input id="email" type="email" />
  ```

## Structure Patterns

### Button Variants
```html
<!-- Primary action -->
<a href="/page" class="btn btn-primary">Action</a>

<!-- Secondary action -->
<button class="btn btn-outline">Discover</button>

<!-- Dark variant -->
<button class="btn btn-dark">Learn More</button>
```

### Card Components
```html
<article class="card">
  <div class="card-image">
    <img src="..." alt="..." />
  </div>
  <div class="card-content">
    <h3 class="card-title">Title</h3>
    <p class="card-description">Description</p>
    <a href="/" class="card-link">Read more →</a>
  </div>
</article>
```

### Navigation
```html
<nav class="navigation">
  <div class="nav-logo">Logo</div>
  <ul class="nav-menu">
    <li><a href="/" class="nav-link nav-link-active">Home</a></li>
    <li><a href="/formations" class="nav-link">Formations</a></li>
  </ul>
  <button class="nav-toggle" aria-label="Toggle menu">☰</button>
</nav>
```

## Class Naming Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| `component` | Wrapper/container | `hero`, `card`, `modal` |
| `component-child` | Direct child elements | `card-image`, `modal-header` |
| `component-action` | Interactive elements | `btn-primary`, `card-link` |
| `component-state` | Conditional styling | `nav-active`, `is-open` |
| `is-*` or `has-*` | State modifiers | `is-active`, `is-disabled`, `has-error` |

## Consistency Rules

### Within a Page
- If a page is `pages/contact/contact.html`, class prefix should reflect the context:
  ```html
  <form class="contact-form">
    <input class="contact-input" />
    <button class="contact-submit">Send</button>
  </form>
  ```

### Across Pages
- Reusable components should have consistent naming across all pages:
  ```html
  <!-- On every page -->
  <button class="btn btn-primary">Shared button</button>
  <header class="header">Shared header</header>
  ```

## Related Files

- **LESS Conventions:** `copilot-instructions-less.md` (how to style classes defined here)
- **JS Conventions:** `copilot-instructions-js.md` (how to query these elements)
- **Global Rules:** `.instructions.md` (Prettier, organization)
- **Global Context:** `.prompt.md` (project overview)

## Formatting

- Use Prettier (`npm` default config in `.prettierrc`)
- Indent with 2 spaces
- Keep lines under 132 characters
- Use single quotes where applicable
