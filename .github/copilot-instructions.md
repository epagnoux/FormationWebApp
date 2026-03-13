# Coding Conventions Index — FormationWebApp

This directory contains coding conventions for FormationWebApp. Each file is specialized for a specific file type.

## Files by Type

### 📘 HTML — `copilot-instructions-html.md`
**Applies to:** All `.html` files (`applyTo: '**/*.html'`)

**Covers:**
- Class naming: `kebab-case` classes
- Semantic HTML structure
- Accessibility (ARIA labels, semantic elements)
- Common patterns (buttons, cards, navigation)
- Consistency rules across pages

### 🎨 LESS — `copilot-instructions-less.md`
**Applies to:** All `.less` files (`applyTo: '**/*.less'`)

**Covers:**
- Root selector: always `:host`
- Nesting with `& .class-name` syntax
- Units: `rem` only (never `px`)
- Variables: `@color-*` and `@spacing-*` from `styles/variables.less`
- BEM-style child elements with `&-suffix`
- **Link to HTML:** Check companion `.html` file for actual class names

### ⚙️ JavaScript — `copilot-instructions-js.md`
**Applies to:** All `.js` files (`applyTo: '**/*.js'`)

**Covers:**
- Variable naming: `camelCase` for variables, `CONSTANT_CASE` for constants
- Function naming: verb-based `camelCase`
- DOM queries: Always reference class names from `.html`
- Event handling and listeners
- Theme system (dark/light mode toggle)
- Class (CSS) manipulation with `classList` API

---

## Hierarchy & Synergy

```
HTML (defines class names)
  ↓
  ├─ LESS (styles those classes)
  └─ JS (queries/manipulates those classes)
```

**Example:** When working on `pages/contact/contact.html`

1. **Edit `.html`** → Define `contact-form`, `contact-input`, `contact-submit`
2. **Edit `.less`** → Style those classes with `:host`, `@color-*`, `rem` units
3. **Edit `.js`** → Query those classes with `document.querySelector('.contact-form')`

---

## Quick Reference

| File Type | Convention File | Key Rules | Example |
|-----------|-----------------|-----------|---------|
| **HTML** | `copilot-instructions-html.md` | Semantic, `kebab-case` classes, ARIA labels | `<button class="btn btn-primary">` |
| **LESS** | `copilot-instructions-less.md` | `:host` root, `@color-*`, `rem` units | `:host { & .btn { padding: @spacing-md; } }` |
| **JS** | `copilot-instructions-js.md` | `camelCase` variables, query by class | `document.querySelector('.btn').addEventListener(...)` |

---

## For More Context

- **Global Rules:** `.instructions.md` (Prettier, organization, general practices)
- **Project Overview:** `.prompt.md` (tech stack, FormationWebApp context)
- **Agents & Skills:** `AGENTS.md` (available tools: Explore agent, format-less skill)
