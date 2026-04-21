# Skill: Use Cobalt Template and Layout Patterns

## Objective

Structure HTML templates with Cobalt layout components and respect binding conventions.

## Layout Patterns

### 1. Standard Content Layout

```html
<app-layout-content>
  <app-title>{{ pageTitle }}</app-title>

  <div class="content">
    <!-- Main content goes here -->
  </div>
</app-layout-content>
```

**Usage:**

- Pages with standard title and content
- Lists with header

### 2. Dialog Layout

```html
<app-layout-content-dialog [title]="dialogTitle">
  <!-- Dialog content -->
  <p>{{ message }}</p>

  <input type="text" [(ngModel)]="formData.name" placeholder="Name" />

  <!-- Action buttons in footer -->
  <div actions>
    <cobalt-button variant="secondary" (click)="onCancel()"> Cancel </cobalt-button>
    <cobalt-button variant="primary" (click)="onConfirm()"> Confirm </cobalt-button>
  </div>
</app-layout-content-dialog>
```

**Usage:**

- Modal dialogs with title
- Forms asking for input/confirmation
- Inline form actions via `<div actions>`

### 3. Master-Detail Layout

```html
<app-layout-master-details>
  <div master>
    <!-- List of items (master) -->
    <div *ngFor="let item of items; let index = index" (click)="selectItem(item)" [class.selected]="selectedId === item.id">
      {{ item.name }}
    </div>
  </div>

  <div detail>
    <!-- Details of selected item -->
    <div *ngIf="selectedItem">
      <h2>{{ selectedItem.name }}</h2>
      <p>{{ selectedItem.description }}</p>
    </div>
  </div>
</app-layout-master-details>
```

**Usage:**

- List on left, details on right
- Project browser, test definition editor
- Master-detail navigation

## Cobalt Components

### Buttons

```html
<!-- Primary action -->
<cobalt-button variant="primary" (click)="onSave()"> Save </cobalt-button>

<!-- Secondary action -->
<cobalt-button variant="secondary" (click)="onCancel()"> Cancel </cobalt-button>

<!-- Disabled button -->
<cobalt-button variant="primary" [disabled]="!isFormValid()"> Submit </cobalt-button>

<!-- With icon -->
<cobalt-button variant="primary">
  <mat-icon>add</mat-icon>
  Add Item
</cobalt-button>
```

### Section Message

```html
<!-- Info message -->
<cobalt-section-message [state]="'info'"> This is an informational message </cobalt-section-message>

<!-- Warning message -->
<cobalt-section-message [state]="'warning'"> Please review before proceeding </cobalt-section-message>

<!-- Error message -->
<cobalt-section-message [state]="'error'"> An error occurred </cobalt-section-message>
```

### Badge

```html
<!-- Simple badge -->
<cobalt-badge [state]="'active'"> Active </cobalt-badge>

<!-- Badge with value -->
<cobalt-badge [state]="'inactive'" [value]="count"> Inactive </cobalt-badge>
```

### Content Switcher (Tabs)

```html
<cobalt-content-switcher>
  <cobalt-content-switcher-item label="Tab 1">
    <!-- Content for tab 1 -->
  </cobalt-content-switcher-item>

  <cobalt-content-switcher-item label="Tab 2">
    <!-- Content for tab 2 -->
  </cobalt-content-switcher-item>
</cobalt-content-switcher>
```

### Overflow Menu

```html
<cobalt-overflow-menu>
  <cobalt-overflow-menu-item (click)="onEdit()" [icon]="'edit'"> Edit </cobalt-overflow-menu-item>

  <cobalt-overflow-menu-item (click)="onDelete()" [icon]="'delete'" [isDangerous]="true"> Delete </cobalt-overflow-menu-item>
</cobalt-overflow-menu>
```

## Data Display Patterns

### Debug Display (JSON)

```html
<!-- Display any object as formatted JSON for debugging -->
<pre><code>{{ myObject | json }}</code></pre>

<!-- Display with title -->
<div class="debug">
  <strong>Debug Data:</strong>
  <pre><code>{{ myData | json }}</code></pre>
</div>
```

**Note:** Remove when feature is complete.

### Conditional Rendering

```html
<!-- Show/hide based on condition -->
<div *ngIf="isLoaded; else loading">
  <!-- Content when loaded -->
</div>

<ng-template #loading>
  <!-- Spinner or placeholder -->
  <app-spinner></app-spinner>
</ng-template>
```

### List Rendering

```html
<!-- Standard list with trackBy for performance -->
<div *ngFor="let item of items; trackBy: trackById">{{ item.name }}</div>

<!-- Component -->
trackById(index: number, item: any): any { return item.id; }
```

## Event Binding

```html
<!-- Click event -->
<cobalt-button (click)="onDelete()">Delete</cobalt-button>

<!-- With event parameter -->
<div *ngFor="let item of items" (click)="selectItem(item)">{{ item.name }}</div>

<!-- Form submission -->
<form (ngSubmit)="onSubmit()">
  <input type="text" required />
  <cobalt-button type="submit">Submit</cobalt-button>
</form>

<!-- Prevent default -->
<a href="#" (click)="onAction(); $event.preventDefault()">Action</a>
```

## Two-Way Binding

```html
<!-- Template form (not recommended for complex forms) -->
<input type="text" [(ngModel)]="person.name" placeholder="Name" />

<!-- Reactive form (recommended) -->
<input type="text" [formControl]="nameControl" />
```

## Class Binding

```html
<!-- Single class -->
<div [class.selected]="isSelected">Selected Item</div>

<!-- Multiple classes with object syntax -->
<div [ngClass]="{'active': isActive, 'disabled': isDisabled}">Item</div>

<!-- Dynamic class -->
<div [class]="getClasses()">Dynamic Classes</div>
```

## Style Binding

```html
<!-- Inline style -->
<div [style.color]="textColor" [style.font-size]="fontSize + 'px'">Colored Text</div>

<!-- Object syntax -->
<div [ngStyle]="{'color': textColor, 'font-size': fontSize + 'px'}">Colored Text</div>
```

## Property Binding

```html
<!-- Component @Input binding -->
<app-user-card [user]="currentUser" [readonly]="false"> </app-user-card>

<!-- Disable/enable attribute -->
<cobalt-button [disabled]="!isFormValid()"> Submit </cobalt-button>
```

## Best Practices

- ✅ Always use `trackBy` in `*ngFor` for performance
- ✅ Use Cobalt components over generic HTML
- ✅ Use layout components for page structure
- ✅ Expose enums as `readonly` on component to access in template
- ✅ Use safe navigation (`?.`) for optional properties
- ✅ Use `[disabled]` over conditional rendering for buttons
- ❌ Avoid direct DOM manipulation
- ❌ Avoid business logic in templates
- ❌ Don't use string concatenation for dynamic values — use binding

## Checklist

- [ ] Page wrapped in appropriate layout (`app-layout-content`, `app-layout-master-details`, etc.)
- [ ] Cobalt components used instead of generic HTML
- [ ] Event handlers properly bound with `(click)`, `(ngSubmit)`, etc.
- [ ] Enums exposed in component template via `readonly` fields
- [ ] `trackBy` used in `*ngFor` loops
- [ ] Conditional rendering uses `*ngIf` / `*ngFor` / `ng-template`
- [ ] Two-way binding minimized (prefer reactive forms)
- [ ] No business logic in template (only display logic)
- [ ] Debug displays (`| json`) removed before completion
