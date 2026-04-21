---
name: create-angular-component
description: Guide for creating a new Angular component in SentinelWebPortal following project conventions (standalone, inheritance, LESS, naming). Use this when asked to add, scaffold, or create a component.
---

# Create an Angular Component — SentinelWebPortal

## Step 1 — Identify the component type and base class

Choose the right type based on the role of the component:

| Type suffix              | Role                   | Base class to extend                          |
| ------------------------ | ---------------------- | --------------------------------------------- |
| `*-list`                 | Displays a list        | `ListBase`                                    |
| `*-edit` / `*-config`    | Side panel form        | `LevelBase` or `FormGroupBase`                |
| `*-dialog`               | Modal dialog           | `BaseComponent`                               |
| `*-menu`                 | Overflow / action menu | `BaseComponent`                               |
| `*-tabs` / `*-tab-group` | Tab navigation         | `BaseComponent`                               |
| `*-view`                 | Page-level coordinator | `VersionedEntityLevelBase` or `BaseComponent` |

## Step 2 — Create the directory and files

```
src/app/modules/qtgx/.../component-name/
├── component-name.component.ts
├── component-name.component.html
└── component-name.component.less
```

## Step 3 — Write the `.component.ts`

```typescript
import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '@core/base/base.component';
// Add Cobalt and Material imports as needed

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [
    CommonModule
    // CobaltButtonModule, etc.
  ],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.less'
})
export class ComponentNameComponent extends BaseComponent {
  constructor(injector: Injector) {
    super(injector);
  }

  protected override onInit(): void {
    // initialization logic
  }
}
```

**Key rules:**

- Always `standalone: true`
- Always `super(injector)` in constructor
- Use `protected override onInit()` not `ngOnInit()`
- Use `protected override onDestroy()` for cleanup (BaseComponent handles `destroy$` automatically)

## Step 4 — Write `.component.less`

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
}
```

**Rules:** Only `rem` units. Only variables from `variables.less`. Hierarchical nesting with `:host` as root.

## Step 5 — Write `.component.html`

```html
<div class="wrapper">
  <!-- Prefer Cobalt components over raw Material -->
  <cobalt-button variant="primary" (click)="onAction()"> {{ label }} </cobalt-button>
</div>
```

## Step 6 — Subscriptions

```typescript
// HTTP call (one-time)
this.myService
  .getData()
  .pipe(take(1))
  .subscribe({
    next: (data) => this.handleData(data),
    error: (error) => this.handleError(error)
  });

// Long-lived stream
this.eventService
  .onEvent()
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (event) => this.handleEvent(event)
  });
```

## Step 7 — Side Panel components only

For `*-edit` / `*-config` components opened via Cobalt side panel:

```typescript
constructor(
  public sidePanelRef: CobaltSidePanelRef<ComponentNameComponent>,
  @Inject(COBALT_SIDE_PANEL_DATA) public data: DataModel,
  injector: Injector
) {
  super(injector);
}

protected onSave(): void {
  this.sidePanelRef.close(this.result);
}
```

## Step 8 — Dialog components only

For `*-dialog` components opened via Material dialog:

```typescript
constructor(
  public dialogRef: MatDialogRef<ComponentNameDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DataModel,
  injector: Injector
) {
  super(injector);
}
```
