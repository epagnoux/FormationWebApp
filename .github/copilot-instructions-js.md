---
applyTo: '**/*.js'
---

# JavaScript Conventions — FormationWebApp

## Overview

This file governs JavaScript conventions. All DOM queries must reference **class names defined in `*.html`** files and interact with **elements styled in `*.less`** files.

## Naming Conventions

### Variables & Functions
- **Variables:** `camelCase`
  ```javascript
  let formationCount = 10;
  const themeToggleButton = document.querySelector('.theme-toggle');
  let isMenuOpen = false;
  ```
- **Constants:** `CONSTANT_CASE`
  ```javascript
  const API_BASE_URL = 'https://api.example.com';
  const STORAGE_KEY_THEME = 'theme';
  const ANIMATION_DURATION_MS = 300;
  ```
- **Functions:** `camelCase`, verb-based
  ```javascript
  function initializeHeaderMenu() { }
  function toggleTheme() { }
  function handleContactFormSubmit(event) { }
  ```
- **Classes:** `PascalCase`
  ```javascript
  class FormationCard { }
  class ThemeManager { }
  ```

### State Variables
- **Boolean variables:** Prefix with `is`, `has`, `can`, `should`
  ```javascript
  let isMenuOpen = false;
  let hasLoadedData = false;
  let canEditForm = true;
  let shouldShowToast = false;
  ```

## DOM Queries

### Query Selectors
- **Use class names:** Query by `.class-name` (as defined in HTML)
  ```javascript
  // ✅ Good — references HTML classes
  const card = document.querySelector('.formation-card');
  const buttons = document.querySelectorAll('.btn-primary');
  const input = document.querySelector('.contact-input');
  ```

- **Use IDs for unique elements:** Only when necessary
  ```javascript
  // OK for unique elements
  const header = document.getElementById('header-include');
  ```

- **Never query by tag only:** Too broad and fragile
  ```javascript
  // ❌ Bad — too unspecific
  const div = document.querySelector('div');  // What div?!
  const buttons = document.querySelectorAll('button');  // All buttons?!
  ```

- **Use data attributes for complex queries:**
  ```javascript
  // HTML:
  // <article data-formation-id="123">...</article>

  // JS:
  const formation = document.querySelector('[data-formation-id="123"]');
  ```

### Querying by Multiple Classes
```javascript
// For elements with multiple classes
const primaryButton = document.querySelector('.btn.btn-primary');
const activeNav = document.querySelector('.nav-link.nav-link-active');
```

## Event Handling

### Event Listeners
- **Name handlers:** `on{Event}{Target}` or `handle{Event}{Target}`
  ```javascript
  function handleThemeToggleClick(event) {
    event.preventDefault();
    toggleTheme();
  }

  function onHeaderMenuToggle() {
    // ...
  }

  function onFormSubmit(event) {
    event.preventDefault();
    // ...
  }
  ```

- **Attach listeners to correct elements:**
  ```javascript
  // ✅ Good
  const themeButton = document.querySelector('[data-toggle-theme]');
  themeButton.addEventListener('click', handleThemeToggleClick);

  const form = document.querySelector('.contact-form');
  form.addEventListener('submit', handleContactFormSubmit);
  ```

## Working with Classes (CSS Classes, Not JS Classes)

### Adding/Removing Classes
- **Use classList API:**
  ```javascript
  // ✅ Good
  element.classList.add('nav-active');
  element.classList.remove('is-hidden');
  element.classList.toggle('has-error');
  ```

- **Check classes:**
  ```javascript
  if (element.classList.contains('nav-active')) {
    // ...
  }
  ```

### Dynamic Class Management
```javascript
// ✅ Good pattern
function toggleMenuState(open) {
  const menu = document.querySelector('.nav-menu');
  const toggle = document.querySelector('.nav-toggle');
  
  if (open) {
    menu.classList.add('is-open');
    toggle.classList.add('is-active');
  } else {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-active');
  }
}
```

## Theme System

### Dark/Light Mode Toggle
```javascript
// ✅ Pattern for theme toggle
const STORAGE_KEY = 'theme';
const DEFAULT_THEME = 'light';

function getTheme() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
}

function setTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const current = getTheme();
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  const saved = getTheme();
  setTheme(saved);
});
```

**Reference:** LESS files use `[data-theme='dark']` selector for dark mode styles

## Common Patterns

### Initialize on Load
```javascript
document.addEventListener('DOMContentLoaded', () => {
  initializeHeader();
  initializeNavigation();
  initializeThemeToggle();
  initializeContactForm();
});

function initializeHeader() {
  // ...
}

function initializeNavigation() {
  // ...
}
```

### Element References
```javascript
// Store frequently accessed elements
const elements = {
  themeToggle: document.querySelector('[data-toggle-theme]'),
  navigation: document.querySelector('.navigation'),
  mainContent: document.querySelector('.main-content'),
  contactForm: document.querySelector('.contact-form')
};

// Use throughout file
elements.themeToggle.addEventListener('click', handleThemeToggleClick);
```

### Template Literals for HTML
```javascript
// ✅ Avoid inline HTML strings
const formations = [
  { id: 1, title: 'Formation 1', image: '/img1.jpg' },
  { id: 2, title: 'Formation 2', image: '/img2.jpg' }
];

function renderFormations(data) {
  return data.map(f => `
    <article class="formation-card" data-formation-id="${f.id}">
      <img class="formation-card-image" src="${f.image}" alt="${f.title}" />
      <h3 class="formation-card-title">${f.title}</h3>
    </article>
  `).join('');
}

document.querySelector('.formations-container').innerHTML = renderFormations(formations);
```

## File Organization

### Structure for Page JavaScript (if `js/` module exists)
```
js/
├── main.js              (Entry point, initializers)
├── theme.js             (Theme toggle logic)
├── navigation.js        (Menu/nav interactions)
├── forms.js             (Form handling)
└── utils.js             (Helper functions)
```

Each module should have:
```javascript
// utilities.js
export function handleEvent() { }
export const CONSTANTS = { };

// main.js
import { handleEvent } from './utilities.js';
// ... initialization code
```

## Related Files

- **HTML Conventions:** `copilot-instructions-html.md` (class names you query here)
- **LESS Conventions:** `copilot-instructions-less.md` (classes you add/remove here are styled there)
- **Global Rules:** `.instructions.md` (Prettier, organization)
- **Global Context:** `.prompt.md` (project overview, tech stack)

## Formatting

- Use Prettier (per `.prettierrc`)
- Indent with 2 spaces
- Keep lines under 132 characters
- Use single quotes for strings
- No trailing commas (per Prettier config)

## Performance Tips

- Cache DOM queries: `const el = document.querySelector(...)`
- Use event delegation for dynamically added elements:
  ```javascript
  document.addEventListener('click', (e) => {
    if (e.target.matches('.formation-card-link')) {
      // Handle click
    }
  });
  ```
- Batch class changes to avoid layout thrashing
