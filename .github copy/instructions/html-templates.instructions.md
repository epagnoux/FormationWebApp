---
applyTo: '**/*.component.html'
---

# HTML Templates Conventions — SentinelWebPortal

## Basic Structure

```html
<div class="wrapper">
  <!-- Component content -->
</div>
```

## Cobalt Components

**Prefer Cobalt Angular library components (`@cae/cobalt-angular`) over raw Material components whenever possible:**

```html
<cobalt-button variant="primary" (click)="onAction()"> {{ buttonLabel }} </cobalt-button>
```

## Debug Data Display

```html
<pre><code>{{ value | json }}</code></pre>
```

## Layout Patterns

### Layout Content

```html
<app-layout-content>
  <app-title>{{ titleText }}</app-title>
  <!-- Main content -->
</app-layout-content>
```

### Layout Dialog

```html
<app-layout-content-dialog [title]="dialogTitle">
  <!-- Dialog content -->
  <div actions>
    <cobalt-button variant="secondary" (click)="onCancel()">Cancel</cobalt-button>
    <cobalt-button variant="primary" (click)="onConfirm()">Confirm</cobalt-button>
  </div>
</app-layout-content-dialog>
```

### Layout Master-Detail

```html
<app-layout-master-details>
  <div master>
    <!-- Main list -->
  </div>
  <div detail>
    <!-- Selected item details -->
  </div>
</app-layout-master-details>
```

## Binding Rules

- Use Angular binding mechanisms, never direct DOM manipulation
- Use `[property]` for one-way binding, `[(ngModel)]` for two-way, `(event)` for event binding
