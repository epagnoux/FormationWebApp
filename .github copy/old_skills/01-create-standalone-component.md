# Skill: Create a Compliant Standalone Component

## Objective

Create an Angular standalone component that follows project conventions (base class inheritance, injection, lifecycle).

## Use Cases

- Create a new list component (`*-list`)
- Create a dialog component (`*-dialog`)
- Create an edit / side panel component (`*-edit`, `*-config`)
- Create a view component (`*-view`)
- Create a menu component (`*-menu`)
- Create a tabs component (`*-tabs`, `*-tab-group`)

## Directory Structures by Type

### List Component (`*-list`)

```
component-name-list/
├── component-name-list.component.ts
├── component-name-list.component.html
├── component-name-list.component.less
├── filters/                          # Optional filtering functionality
│   ├── component-name-filters.service.ts
│   └── component-name-filter.model.ts
└── component-name-item/              # Optional individual item component
    ├── component-name-item.component.ts
    ├── component-name-item.component.html
    └── component-name-item.component.less
```

Examples: `test-definition-qualification-levels-list`, `reference-list`

### Side Panel / Edit Component (`*-edit`, `*-config`)

```
component-name-edit/
├── component-name-edit.component.ts
├── component-name-edit.component.html
└── component-name-edit.component.less
```

Examples: `test-definition-editor-image`, `reference-edit`

### Dialog Component (`*-dialog`)

```
component-name-dialog/
├── component-name-dialog.component.ts
├── component-name-dialog.component.html
└── component-name-dialog.component.less
```

Examples: `reference-create-dialog`, `confirmation-dialog`

### Menu / Tab / View Components

Same flat structure with `.ts`, `.html`, `.less` files.

## Component Inheritance Hierarchy

```
BaseComponent (core/base/base.component.ts)
├── LevelBase                 # Base for level-specific components
│   ├── TestDefinitionBase    # Test definition specialized components
│   └── VersionedEntityLevelBase   # Components for versioned entities
├── ListBase                  # Base for list components
│   ├── TestDefinitionListBase     # List components for test definitions
│   └── ReferenceListBase          # List components for references
└── FormGroupBase             # Base for form components
    └── TestDefinitionFormBase     # Form components for test definitions
```

All base classes provide: lifecycle management, subscription handling, permission checking, error handling, common UI patterns, level and context awareness.

---

## LESS Rules (Always Start Here)

```less
@import '~src/styles/variables.less';

:host {
  flex: 1;
  display: flex;
  flex-direction: column;

  & .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;

    & .header {
      display: flex;
      flex-direction: column;
    }

    & .content {
      display: flex;
      flex-direction: column;
    }

    & .actions {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      margin-top: 1.6rem;
      gap: 1.6rem;
    }
  }
}
```

**Strict Rules:**

- ✅ Line 1: `@import '~src/styles/variables.less'` (REQUIRED)
- ✅ Root selector: `:host` (REQUIRED)
- ✅ Structure: `:host > & .wrapper` (REQUIRED)
- ✅ Units: `rem` ONLY (10px = 1rem). Scale: 0.3, 0.6, 0.8, 1.2, 1.6, 1.8, 2, 2.4, 2.6
- ✅ Colors: ONLY from `variables.less` (e.g., `@color-default-button`, `@color-state-error`)
- ✅ Icons: use `global-icon` class from `common.less` — NEVER redefine
- ✅ Gaps/spacing: use standard scale

❌ Do NOT hardcode colors
❌ Do NOT use `px` (except for `mask-size: cover;`)
❌ Do NOT create local design classes — use Cobalt

---

## TypeScript Import Order

```typescript
// 1. Angular Core
import { Component, Injector, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// 2. Angular CDK + Material
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

// 3. Cobalt
import { CobaltButtonModule } from '@cae/cobalt-angular/components/button';
import { CobaltOverflowMenuModule } from '@cae/cobalt-angular/components/overflow-menu';
import { CobaltSidePanelService } from '@cae/cobalt-angular/components/side-panel';

// 4. RxJS
import { take, takeUntil } from 'rxjs';

// 5. @core (API, base, services, constants)
import { BaseComponent } from '@core/base/base.component';
import { ListBase } from '@core/base/list.base';
import { SomeApiService } from '@core/api/some/services/some-api.service';
import { KeysRoute } from '@core/constants';

// 6. Module-relative (current component)
import { SomeLocalService } from './services/some-local.service';

// 7. @shared (generic)
import { SoundService } from '@shared/services/sound-service/sound.service';
import { ConfirmationDialogService } from '@shared/confirmation-dialog/confirmation-dialog.service';
```

---

## TypeScript Structure: Property and Method Order

```typescript
@Component({...})
export class ItemListComponent extends ListBase {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. @Input Fields
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  @Input() items: ItemDto[] = [];
  @Input() mode = ItemMode.ReadOnly;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. @Output Events
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  @Output() itemsChange = new EventEmitter<void>();
  @Output() actionSelected = new EventEmitter<ActionExchangeModel>();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. @ViewChild / @ViewChildren
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  @ViewChild(MatSort) private sort!: MatSort;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. Protected Properties
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  protected currentTableColumns: string[] = [];
  protected tableColumns: { label: string; visible: boolean }[] = [];
  protected currentItem: ItemDto | null = null;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. Readonly (enums — IF NOT in UiEnumerations)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⚠️ CHECK FIRST: Is this enum already in UiEnumerations?
  // If YES → do NOT import, do NOT declare readonly
  // If NO → import and declare readonly
  readonly ItemMode = ItemMode;
  readonly actionGroupType = ActionGroupType; // example if NOT in UiEnumerations

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. Constructor
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  constructor(
    public sidePanelService: CobaltSidePanelService,
    private soundService: SoundService,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private itemService: ItemService,
    protected override injector: Injector  // ALWAYS LAST
  ) {
    super(injector);  // ALWAYS FIRST LINE
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7. Lifecycle Methods (onInit, onDestroy)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  protected override onInit(): void {}
  protected override onDestroy(): void {}

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 8. Event Handlers (on*)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  onEditItem(event: MouseEvent, item: ItemDto): void {}
  onDeleteItem(event: MouseEvent, item: ItemDto): void {}
  onMenuClick(event: MouseEvent): void {}

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 9. Protected Methods
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  protected updateTableColumns(): void {}
  protected editItem(item: ItemDto): void {}

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 10. Private Methods
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  private loadData(): void {}

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 11. trackBy (ALWAYS LAST)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  trackBy(index: number): number {
    return index;
  }
}
```

---

## Inherited Enums: Do NOT Import

**Before adding:** `readonly myEnum = MyEnum;`

1. Open `src/app/core/UiEnumerations.ts`
2. Search for the enum name
3. If found → **DO NOT import** — it's already inherited by `BaseComponent`
4. If NOT found → Import and declare `readonly` locally

**Common inherited enums:**

- `formFieldState`, `formFieldMode`, `formFieldSize`
- `titleLayout`, `testDefinitionMode`, `testDefinitionDetailsMode`
- `actionGroupType`, `levelIndicatorLevel`
- `listBehavior`, `badgeComponentState`, `cardLayout`
- `actorPrivilegeNameEnum`, `cobaltIndicatorColorEnum`

---

## Services Requiring `providers: []`

These services do NOT have `providedIn: 'root'` → MUST add to `providers`:

```typescript
@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [...],
  providers: [ConfirmationDialogService],  // ⚠️ REQUIRED
  templateUrl: '...',
  styleUrl: '...'
})
export class ItemListComponent extends ListBase { }
```

| Service                     | Usage                                        |
| --------------------------- | -------------------------------------------- |
| `ConfirmationDialogService` | Components with delete/discard confirmations |
| `HelpService`               | Components with help panel integration       |
| `TaskPollingService`        | Components with task polling (1 instance)    |

---

## Subscription Patterns

| Scenario                    | Pattern                                              |
| --------------------------- | ---------------------------------------------------- |
| **HTTP call (one-time)**    | `.pipe(take(1)).subscribe({ next:, error: })`        |
| **Route params**            | `this.subscribe(this.route.paramMap.subscribe(...))` |
| **Event stream/Observable** | `this.subscribe(this.service.event$.subscribe(...))` |
| **Parallel HTTP calls**     | `forkJoin([...]).pipe(take(1)).subscribe(...)`       |

**Golden Rules:**

- `take(1)` for HTTP calls
- `takeUntil(this.destroy$)` for long-lived streams
- `this.subscribe()` wrapper for auto-cleanup (recommended)

---

## Minimal TypeScript Component

```typescript
// Angular Core → CDK/Material → Cobalt → RxJS → @core → local → @shared
import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CobaltButtonModule } from '@cae/cobalt-angular/components/button';
import { take } from 'rxjs';
import { BaseComponent } from '@core/base/base.component';
import { SomeService } from './services/some.service';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, CobaltButtonModule],
  // providers: [ConfirmationDialogService],  // only if necessary
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.less' // SINGULAR
})
export class ComponentNameComponent extends BaseComponent {
  // ⚠️ Check UiEnumerations before declaring a readonly enum
  readonly myEnum = MyEnum;

  constructor(
    private someService: SomeService,
    protected override injector: Injector // ALWAYS LAST
  ) {
    super(injector); // ALWAYS FIRST LINE
  }

  protected override onInit(): void {
    this.someService
      .getData()
      .pipe(take(1))
      .subscribe({
        next: (data) => this.processData(data),
        error: (error) => this.handleError(error)
      });
  }
}
```

## Complete Example: List Component (`*-list`)

### TypeScript

```typescript
import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { CobaltButtonModule } from '@cae/cobalt-angular/components/button';
import { CobaltOverflowMenuModule } from '@cae/cobalt-angular/components/overflow-menu';
import { CobaltSidePanelService } from '@cae/cobalt-angular/components/side-panel';
import { take } from 'rxjs';
import { ListBase } from '@core/base/list.base';
import { SoundService } from '@shared/services/sound-service/sound.service';
import { ConfirmationDialogService } from '@shared/confirmation-dialog/confirmation-dialog.service';

export interface ItemDto {
  id: string;
  name: string;
  description: string;
  isReadOnly?: boolean;
}

export enum ItemMode {
  ReadOnly = 'readOnly',
  Edit = 'edit'
}

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule, MatTableModule, MatSortModule, CobaltButtonModule, CobaltOverflowMenuModule],
  providers: [ConfirmationDialogService], // ⚠️ REQUIRED — not providedIn: 'root'
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.less'
})
export class ItemListComponent extends ListBase {
  @Input() items: ItemDto[] = [];
  @Input() mode = ItemMode.ReadOnly;
  @Output() itemsChange = new EventEmitter<void>();

  protected currentTableColumns: string[] = [];
  protected tableColumns: { label: string; visible: boolean }[] = [];
  protected currentItem: ItemDto | null = null;

  readonly ItemMode = ItemMode;

  constructor(
    public sidePanelService: CobaltSidePanelService,
    private soundService: SoundService,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private itemService: ItemService,
    protected override injector: Injector
  ) {
    super(injector);
  }

  protected override onInit(): void {
    this.updateTableColumns();
    this.subscribe(
      this.route.paramMap.subscribe((params) => {
        // Extract route parameters if needed
        this.rootId = Number(params.get('root'));
        this.itemId = Number(params.get('itemId'));
      })
    );
  }

  public updateTableColumns(): void {
    this.tableColumns = [
      { label: 'name', visible: true },
      { label: 'description', visible: true },
      { label: 'actions', visible: this.mode === ItemMode.Edit }
    ];
    this.currentTableColumns = this.tableColumns.filter((column) => column.visible).map((col) => col.label);
  }

  protected onItemSelected(item: ItemDto): void {
    // Double-click detection pattern from ListBase
    this.handleClickWithDoubleClickDetection(() => {
      this.editItem(item);
    });
  }

  protected editItem(item: ItemDto): void {
    if (this.mode === ItemMode.ReadOnly) {
      return;
    }

    this.soundService.playSound(this.uiSounds.Sound_Button_Tap);
    this.currentItem = item;

    const sidePanelRef = this.sidePanelService.open(ItemEditComponent, {
      data: { item: structuredClone(item) },
      size: 'small'
    });

    sidePanelRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: ItemDto) => {
        if (result && this.currentItem) {
          // Update local item with result data
          this.currentItem.name = result.name;
          this.currentItem.description = result.description;

          // Call API to persist changes
          this.itemService
            .update(this.rootId, this.itemId, result)
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.handleSuccess('Item updated successfully.');
                this.itemsChange.emit();
              },
              error: (error) => this.handleError(error)
            });
        }
      });
  }

  protected deleteItem(item: ItemDto): void {
    this.confirmationDialogService.confirm(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', color: 'regular', result: false, secondary: true },
        {
          text: 'Delete',
          color: 'danger',
          result: () => {
            this.itemService
              .delete(this.rootId, this.itemId, item.id)
              .pipe(take(1))
              .subscribe({
                next: () => {
                  this.handleSuccess('Item deleted successfully.');
                  this.itemsChange.emit();
                },
                error: (error) => this.handleError(error)
              });
          }
        }
      ],
      'warning',
      true
    );
  }

  // Public action handlers (called from template)
  onEditItem(event: MouseEvent, item: ItemDto): void {
    event.stopPropagation();
    this.editItem(item);
  }

  onDeleteItem(event: MouseEvent, item: ItemDto): void {
    event.stopPropagation();
    this.deleteItem(item);
  }

  onMenuClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.soundService.playSound(this.uiSounds.Sound_Expand);
  }

  onMenuClosed(): void {
    this.soundService.playSound(this.uiSounds.Sound_Collapse);
  }
}
```

### HTML Template

```html
<div class="wrapper">
  <div class="data">
    <div class="data-content">
      <mat-table class="items list" [dataSource]="items" matSort matSortActive="name" matSortDirection="asc" matSortDisableClear>
        <!-- Header Row (sticky) -->
        <mat-header-row *matHeaderRowDef="currentTableColumns; sticky: true"></mat-header-row>

        <!-- Data Row with virtual scrolling -->
        <mat-row
          [class.row]="true"
          [ngClass]="{ readonly: item.isReadOnly }"
          cdkVirtualFor
          *matRowDef="let item; columns: currentTableColumns; let index = index"
          (dblclick)="onItemSelected(item)"
        ></mat-row>

        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <mat-header-cell class="item name" *matHeaderCellDef mat-sort-header scope="col"> Name </mat-header-cell>
          <mat-cell class="item name" *matCellDef="let item"> {{ item.name }} </mat-cell>
        </ng-container>

        <!-- Description Column -->
        <ng-container matColumnDef="description">
          <mat-header-cell class="item description" *matHeaderCellDef mat-sort-header scope="col"> Description </mat-header-cell>
          <mat-cell class="item description" *matCellDef="let item"> {{ item.description }} </mat-cell>
        </ng-container>

        <!-- Actions Column (sticky end) -->
        <ng-container matColumnDef="actions" stickyEnd>
          <mat-header-cell class="item actions" *matHeaderCellDef scope="col"></mat-header-cell>
          <mat-cell class="item actions" *matCellDef="let item">
            <div class="actions">
              <button type="button" cobaltButtonGhost [cobaltTriggerOverflowMenuFor]="menu" (click)="onMenuClick($event)">
                <div class="global-icon action-menu"></div>
              </button>
              <cobalt-overflow-menu #menu xPosition="left" (closed)="onMenuClosed()">
                <button cobaltOverflowMenuItem (click)="onEditItem($event, item)" [disabled]="item.isReadOnly">
                  <div class="global-icon action-menu-edit"></div>
                  Edit
                </button>
                <button cobaltOverflowMenuItem (click)="onDeleteItem($event, item)">
                  <div class="global-icon action-menu-delete"></div>
                  Delete
                </button>
              </cobalt-overflow-menu>
            </div>
          </mat-cell>
        </ng-container>
      </mat-table>
    </div>
  </div>
</div>
```

### LESS Styling

```less
@import '~src/styles/variables.less';

:host {
  flex: 1;
  display: flex;

  & .wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: 1.2rem;

    & .data {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;

      &-content {
        flex: 1;
        display: flex;
        flex-direction: column;

        & .items {
          flex: 1;
          display: flex;
          flex-direction: column;

          & .readonly {
            color: @color-default-text-help;
            background: @color-default-test-case-properties-iten-disabled-background;
            cursor: not-allowed;
          }

          & .name {
            min-width: 22rem;
            max-width: 22rem;
            overflow: auto;
          }

          & .description {
            flex: 20;
            min-width: 23rem;
            overflow: auto;
          }

          & .actions {
            flex: 1;
            display: flex;
            align-items: center;
            min-width: 5rem;
            max-width: 5rem;
          }
        }
      }
    }
  }
}
```

### Key Patterns for List Component

1. **`ListBase` inheritance** — Provides double-click detection, level context, etc.
2. **`@Input() items`** — Data from parent (can be a setter)
3. **`@Output() itemsChange`** — Notifies parent after changes
4. **`protected currentTableColumns`** — Dynamically visible columns
5. **`mat-table` with `matSort`** — Native Angular Material sorting
6. **`cdkVirtualFor`** — Virtual scrolling for large lists
7. **`handleClickWithDoubleClickDetection()`** — Project pattern for double-click
8. **`sidePanelService.open()`** — Opens side panel for editing
9. **`structuredClone()`** — Deep clone of item before editing
10. **`confirmationDialogService.confirm()`** — Confirmation before deletion

---

## Complete Example: Edit/Form Panel (`*-edit`)

### TypeScript

```typescript
import { Component, Inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CobaltButtonModule } from '@cae/cobalt-angular/components/button';
import { CobaltSidePanelRef, COBALT_SIDE_PANEL_DATA } from '@cae/cobalt-angular/components/side-panel';
import { take } from 'rxjs';
import { FormGroupBase } from '@core/base/form-group.base';

export interface ItemData {
  item: ItemDto;
}

@Component({
  selector: 'app-item-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CobaltButtonModule],
  templateUrl: './item-edit.component.html',
  styleUrl: './item-edit.component.less'
})
export class ItemEditComponent extends FormGroupBase {
  formGroup: FormGroup;

  constructor(
    public sidePanelRef: CobaltSidePanelRef<ItemEditComponent>,
    @Inject(COBALT_SIDE_PANEL_DATA) public data: ItemData,
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    protected override injector: Injector
  ) {
    super(injector);
    this.formGroup = this.createFormGroup();
  }

  protected override onInit(): void {
    if (this.data?.item) {
      this.formGroup.patchValue(this.data.item);
    }
  }

  private createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    const result = this.formGroup.value;

    this.itemService
      .update(result.id, result)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.handleSuccess('Item updated successfully.');
          this.sidePanelRef.close(result);
        },
        error: (error) => this.handleError(error)
      });
  }

  onClose(): void {
    this.sidePanelRef.close();
  }
}
```

### HTML Template

```html
<app-layout-content class="wrapper">
  <div class="header" header>
    <app-title [title]="'Edit Item'"></app-title>
  </div>

  <div class="content" content>
    <form [formGroup]="formGroup" novalidate>
      <div class="form-field-group">
        <app-form-field
          label="Name"
          [isFirst]="true"
          [required]="true"
          [state]="formGroup.get('name')?.valid ? formFieldState.Default : formFieldState.Error"
        >
          <ng-container content>
            <input matInput formControlName="name" cdkFocusInitial />
          </ng-container>
        </app-form-field>

        <app-form-field
          label="Description"
          [state]="formGroup.get('description')?.valid ? formFieldState.Default : formFieldState.Error"
        >
          <ng-container content>
            <textarea matInput formControlName="description"></textarea>
          </ng-container>
        </app-form-field>
      </div>
    </form>
  </div>

  <div class="actions" footer>
    <button cobaltButtonSecondary (click)="onClose()">Cancel</button>
    <button cobaltButtonPrimary [disabled]="formGroup.invalid" (click)="onSubmit()">Apply</button>
  </div>
</app-layout-content>
```

### LESS Styling

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

    & .header {
      display: flex;
      align-items: center;
    }

    & .content {
      flex: 1;
      overflow-y: auto;
      padding: 0 2rem;

      & .form-field-group {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
      }
    }

    & .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1.6rem;
      padding: 1.6rem;
      border-top: 1px solid @color-border-subtle;
    }
  }
}
```

### Key Patterns for Edit Component

1. **Extends `FormGroupBase`** — Form and validators management
2. **`@Inject(COBALT_SIDE_PANEL_DATA)`** — Receives data from parent
3. **`FormBuilder.group()`** — FormGroup creation with validators
4. **`formGroup.patchValue()`** — Data hydration
5. **`sidePanelRef.close(result)`** — Return result to parent
6. **Cancel + Apply buttons** — Always at bottom right
7. **`cdkFocusInitial`** — Focus on first field

---

## Choosing the Appropriate Base Class

### By Component Type

| Type                                  | Base class                                    | Usage                                                               |
| ------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| **List** (`*-list`)                   | `ListBase`                                    | Virtual scrolling, filtering, sorting                               |
| **Dialog** (`*-dialog`)               | `BaseComponent`                               | `@Inject(MAT_DIALOG_DATA)`, `MatDialogRef.close(result)`            |
| **Side Panel** (`*-edit`, `*-config`) | `FormGroupBase` or `LevelBase`                | `@Inject(COBALT_SIDE_PANEL_DATA)`, `CobaltSidePanelRef.close(data)` |
| **View** (`*-view`)                   | `VersionedEntityLevelBase` or `BaseComponent` | Coordinate children, routing, state                                 |
| **Menu** (`*-menu`)                   | `BaseComponent`                               | Actions, overflow menu                                              |
| **Tabs** (`*-tabs`)                   | `BaseComponent`                               | Tab switching, content management                                   |

## Injection Patterns by Type

### Dialog Component

```typescript
constructor(
  public dialogRef: MatDialogRef<MyDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: MyDialogData,
  private someService: SomeService,
  injector: Injector
) {
  super(injector);
}

// Return result via:
this.dialogRef.close(result);
```

### Side Panel Component

```typescript
constructor(
  public sidePanelRef: CobaltSidePanelRef<MyEditComponent>,
  @Inject(COBALT_SIDE_PANEL_DATA) public data: MyEditData,
  private someService: SomeService,
  injector: Injector
) {
  super(injector);
}

// Return result via:
this.sidePanelRef.close(result);
```

---

## Complete Example: Dialog Component (`*-dialog`)

### TypeScript

```typescript
import { Component, Inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CobaltButtonModule } from '@cae/cobalt-angular/components/button';
import { BaseComponent } from '@core/base/base.component';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, CobaltButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.less'
})
export class ConfirmDialogComponent extends BaseComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    protected override injector: Injector
  ) {
    super(injector);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
```

### HTML Template

```html
<app-layout-content-dialog [title]="data.title">
  <div content>
    <p>{{ data.message }}</p>
  </div>
  <div actions>
    <button cobaltButtonSecondary (click)="onCancel()">{{ data.cancelText || 'Cancel' }}</button>
    <button cobaltButtonPrimary (click)="onConfirm()">{{ data.confirmText || 'Confirm' }}</button>
  </div>
</app-layout-content-dialog>
```

### LESS Styling

```less
@import '~src/styles/variables.less';

:host {
  display: flex;

  & ::ng-deep {
    <!-- Dialog wrapper styles if needed -->
  }
}
```

### Key Patterns for Dialog Component

1. **Extends `BaseComponent`** — No specialized base needed
2. **`@Inject(MAT_DIALOG_DATA)`** — Receives data from parent
3. **`MatDialogRef.close(result)`** — Return result
4. **`app-layout-content-dialog`** — Specific wrapper for dialogs
5. **Cancel + Confirm buttons** — Always at bottom right
6. **Simple and focused** — Single responsibility

---

## Pre-Flight Checklist ✈️

Avant de soumettre tout code, vérifier :

### Architecture & Structure

- [ ] `standalone: true`
- [ ] Correct base class extended (`BaseComponent`, `ListBase`, `FormGroupBase`, etc.)
- [ ] `super(injector)` is the first line of constructor
- [ ] `injector: Injector` is the LAST parameter of constructor
- [ ] `override` keyword on all overridden methods

### TypeScript

- [ ] `protected override onInit()` (not `ngOnInit()`)
- [ ] `protected override onDestroy()` if needed (not `ngOnDestroy()`)
- [ ] Enums NOT already in `UiEnumerations.ts`
- [ ] `styleUrl` (SINGULAR, not `styleUrls`)
- [ ] Imports organized by origin (Angular → CDK → Material → Cobalt → RxJS → @core → relative → @shared)
- [ ] Services injected as `private` (unless explicitly `public`)

### LESS / Styling

- [ ] Line 1: `@import '~src/styles/variables.less'`
- [ ] Root selector: `:host`
- [ ] Structure: `:host > & .wrapper > & .content, & .actions`
- [ ] Units: `rem` ONLY (no `px`, no hardcoded values)
- [ ] Colors: ONLY from `variables.less` (no hardcoded hex/rgb)
- [ ] Icons: use `global-icon` class (never redefine)
- [ ] Gap/spacing: use standard scale (0.3, 0.6, 1.2, 1.6, 2, etc.)

### HTML Template

- [ ] Uses `app-layout-content*` when appropriate
- [ ] Uses Cobalt components (buttons, overflow-menu, etc.)
- [ ] Form: has Cancel + Apply footer (secondary + primary, right-aligned)
- [ ] List: has `(dblclick)` handler + Edit/Delete in menu
- [ ] Dialog: wrapped in `app-layout-content-dialog`
- [ ] `[disabled]="..."` on buttons when readonly
- [ ] Proper event handling: `(click)="onEditItem($event, item)"`
- [ ] `trackBy` in loops: `*ngFor="let item of items; trackBy: trackBy"`

### Subscriptions & RxJS

- [ ] HTTP calls use `.pipe(take(1))`
- [ ] Route params use `this.subscribe(this.route.paramMap.subscribe(...))`
- [ ] Long-lived streams use `takeUntil(this.destroy$)`
- [ ] No manual `.unsubscribe()` (BaseComponent handles it)

### Component-Specific

- [ ] List: extends `ListBase`, has `@Input() items`, `@Output() itemsChange`
- [ ] Edit/Form: extends `FormGroupBase`, has Cancel/Apply buttons
- [ ] Dialog: extends `BaseComponent`, uses `@Inject(MAT_DIALOG_DATA)`
- [ ] Side Panel: uses `CobaltSidePanelRef`, handles `.afterClosed()`

### Services

- [ ] `providers: [ConfirmationDialogService]` if using confirmations
- [ ] If extending `ListBase` or `LevelBase`, handle `rootId`, `versionId`, etc.
- [ ] API calls go through service (NOT direct `HttpClient`)

### Code Quality

- [ ] No debug traces removed (unless explicitly asked)
- [ ] No `.md` documentation files generated (unless explicitly asked)
- [ ] Selector uses `app-` prefix
- [ ] No `ChangeDetectionStrategy.OnPush` (not the convention)
- [ ] No relative imports across module boundaries (use `@core/*`, `@shared/*`, `@modules/*`)

### Final Check

- [ ] Component builds without errors
- [ ] No unused imports
- [ ] No console warnings
- [ ] File names follow `kebab-case`
- [ ] All file names are LOWERCASE (no MixedCase)

---

## Avoid Common Mistakes

❌ **ngOnInit()** → use `onInit()`  
❌ **ngOnDestroy()** → use `onDestroy()`  
❌ **constructor() { ... }** without `super(injector)` → ALWAYS call super first  
❌ **injector** not in constructor → ALWAYS inject  
❌ **`styleUrls: [...]`** → use `styleUrl: '...'` (SINGULAR)  
❌ **Hardcoded colors** like `#FF0000` → use `@variables.less`  
❌ **`px` units in LESS** → use `rem` only  
❌ **relative imports** across boundaries → use `@core/*`, `@shared/*`  
❌ **Direct HttpClient** in component → use service bridge  
❌ **ChangeDetectionStrategy.OnPush** → not the convention  
❌ **No `override` keyword** on overridden methods → always add  
❌ **Removing debug traces** → keep them unless explicitly asked  
❌ **Generating `.md` documentation** → only if requested

---
