# Build Agent: QTGx Documentation Module

> **Agent**: `jedai.build.documentation`  
> **Generated**: 2026-02-11  
> **Scope**: `src/app/modules/qtgx/documentation/` — QTGx Documentation components, services, and shared UI primitives  
> **Version**: 4.0.0

---

## Purpose

This agent builds, modifies, and validates Angular components within the **[module]** of **[webapp]**. It enforces the conventions from `jedai.scan.[module].[version].agent.md` and produces code that matches existing patterns exactly.

---

## Quick Reference

### Technology

- **Angular** 17.0.3 | **TypeScript** ~5.2.0 | **LESS** styles
- **UI**: Cobalt Angular ^16.7.3 + Angular Material ~16.2.12 + CDK ~16.2.12
- **Components**: 100% standalone (`standalone: true`)
- **Base classes**: `BaseComponent` → `LevelBase` → `ListBase` / `FormGroupBase`

### File Naming

```
kebab-case.component.ts    (component)
kebab-case.component.html  (template)
kebab-case.component.less  (styles)
kebab-case.service.ts      (service)
kebab-case.model.ts        (model — interface)
kebab-case-dto.ts          (DTO — class)
kebab-case.enum.ts         (enum)
kebab-case.pipe.ts         (pipe)
```

---

## Component Blueprint

### 1. LESS File — Always Start Here

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
      flex: 1;
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

**Rules**:

- `@import '~src/styles/variables.less'` — ALWAYS first line
- `:host` — ALWAYS root selector
- `& .wrapper` — ALWAYS present
- Units: `rem` ONLY (10px = 1rem). Standard scale: 0.3, 0.6, 0.8, 1.2, 1.6, 1.8, 2, 2.4, 2.6
- Colors: ONLY from `variables.less` (e.g., `@color-default-button`, `@color-state-error`)
- Icons: use `global-icon` class from `common.less` — NEVER redefine locally

### 2. TypeScript File — Internal Order

```typescript
// ═══════════════════════════
// 1. IMPORTS (grouped)
// ═══════════════════════════
// Angular Core → CDK → Material → Cobalt → RxJS → @core → Module relative → @shared

// ═══════════════════════════
// 2. ENUMS/INTERFACES (before @Component)
// ═══════════════════════════
export enum ComponentNameLayout {
  Regular = 'regular',
  Compact = 'compact'
}

// ═══════════════════════════
// 3. @Component DECORATOR
// ═══════════════════════════
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [
    /* Angular → Material → Cobalt → Shared */
  ],
  providers: [
    /* ONLY services without providedIn: 'root' */
  ],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.less' // SINGULAR
})
export class ComponentNameComponent extends BaseComponent {
  // ── @Input ──
  @Input() item!: ItemDto;
  @Input() mode = TestDefinitionMode.ReadOnly;

  // ── @Output ──
  @Output() actionSelected = new EventEmitter<ActionExchangeModel>();

  // ── @ViewChild ──
  @ViewChild(MatSort) private sort!: MatSort;

  // ── protected properties ──
  protected dataSource = new FilterableDataSource<ItemDto>([]);
  protected isLoaded = false;

  // ── readonly (enums for template — ONLY if NOT in UiEnumerations) ──
  readonly componentNameLayout = ComponentNameLayout;

  // ── constructor ──
  constructor(
    private myService: MyService,
    injector: Injector // ALWAYS LAST
  ) {
    super(injector); // ALWAYS FIRST LINE
  }

  // ── lifecycle ──
  protected override onInit(): void {}

  // ── event handlers (on*) ──
  onAction(type: ActionGroupType, item: ItemDto) {}
  onClose() {}
  onSubmit() {}

  // ── protected methods ──
  protected updateTableColumns(): void {}

  // ── private methods ──
  private loadData() {}

  // ── trackBy — ALWAYS LAST ──
  trackBy(index: number) {
    return index;
  }
}
```

### 3. HTML Template — By Component Type

#### Edit/Form Panel

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
          [mode]="formFieldMode.Edit"
          [state]="formGroup.get('name')?.valid ? formFieldState.Default : formFieldState.Error"
        >
          <ng-container content>
            <input matInput formControlName="name" autocomplete="false" cdkFocusInitial />
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

#### List

```html
<div class="wrapper">
  <cdk-virtual-scroll-viewport [itemSize]="50" (scrolledIndexChange)="nextBatch($event)">
    <mat-table [dataSource]="virtualizedDataSource" matSort [trackBy]="trackBy">
      <mat-header-row *matHeaderRowDef="tableColumns; sticky: true" [style.top.px]="offset | async"></mat-header-row>
      <mat-row
        *matRowDef="let item; columns: tableColumns"
        (click)="onSelectItem(item)"
        (dblclick)="onAction(actionGroupType.Edit, item)"
      >
      </mat-row>
      <!-- columns... -->
      <ng-container matColumnDef="actions" stickyEnd>
        <mat-header-cell *matHeaderCellDef scope="col"></mat-header-cell>
        <mat-cell *matCellDef="let item">
          <div class="actions">
            <button cobaltButtonGhost [cobaltTriggerOverflowMenuFor]="menu" (click)="onMenuClick($event)">
              <div class="global-icon action-menu"></div>
            </button>
            <cobalt-overflow-menu #menu xPosition="left">
              <button cobaltOverflowMenuItem (click)="onAction(actionGroupType.Edit, item)">
                <div class="global-icon action-menu-edit"></div>
                Edit
              </button>
              <button cobaltOverflowMenuItem (click)="onAction(actionGroupType.Delete, item)">
                <div class="global-icon action-menu-delete"></div>
                Delete
              </button>
            </cobalt-overflow-menu>
          </div>
        </mat-cell>
      </ng-container>
    </mat-table>
  </cdk-virtual-scroll-viewport>
</div>
```

#### Dialog

```html
<app-layout-content-dialog [title]="dialogTitle">
  <div content><!-- Dialog body --></div>
  <div actions>
    <button cobaltButtonSecondary (click)="onClose()">Cancel</button>
    <button cobaltButtonPrimary (click)="onConfirm()">Confirm</button>
  </div>
</app-layout-content-dialog>
```

---

## Service Blueprint

```typescript
@Injectable({ providedIn: 'root' })
export class EntityNameService {
  constructor(
    private baselineApi: BaselineEntityApiService,
    private circularApi: CircularEntityApiService,
    private aircraftApi: AircraftEntityApiService,
    private projectApi: ProjectEntityApiService
  ) {}

  // METHOD ORDER: getAll → get → create → update → delete

  getAll(level: LevelIndicatorLevel, rootId: number, versionId: number) {
    switch (level) {
      case LevelIndicatorLevel.Baseline:
        return this.baselineApi.getAll(rootId, versionId);
      case LevelIndicatorLevel.Circular:
        return this.circularApi.getAll(rootId, versionId);
      case LevelIndicatorLevel.Aircraft:
        return this.aircraftApi.getAll(rootId, versionId);
      case LevelIndicatorLevel.Project:
        return this.projectApi.getAll(rootId, versionId);
      default:
        throw new Error(`Unsupported level: ${level}`);
    }
  }

  get(level: LevelIndicatorLevel, rootId: number, versionId: number, id: number) {
    /* switch */
  }
  create(level: LevelIndicatorLevel, rootId: number, versionId: number, item: CreateDto) {
    /* switch */
  }
  update(level: LevelIndicatorLevel, rootId: number, versionId: number, id: number, item: UpdateDto) {
    /* switch */
  }
  delete(level: LevelIndicatorLevel, rootId: number, versionId: number, id: number) {
    /* switch */
  }
}
```

---

## Inheritance Lookup Table

| Component Type  | Base Class      | Gets You                                                                                                                     |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Any component   | `BaseComponent` | `onInit()`, `subscribe()`, `handleSuccess/Error()`, 40+ enum `readonly` from `UiEnumerations`, sounds, locale                |
| Level-aware     | `LevelBase`     | `level`, `rootId`, `versionId`, `testDefinitionId`, `rootBase`, URL-based level detection                                    |
| List            | `ListBase`      | `itemsBase`, `viewportBase`, `virtualizedDataSource`, `nextBatch()`, `trackBy()`, `actionGroupMenu`, double-click management |
| Form/Edit panel | `FormGroupBase` | `valueDifferentValidator()`, `generateUniqueName()`                                                                          |

---

## Enum Lookup: Before You Import

**STOP.** Before adding `import { SomeEnum }` + `readonly someEnum = SomeEnum;`:

1. Open `src/app/core/UiEnumerations.ts`
2. Search for the enum name
3. If found → **DO NOT import, DO NOT declare readonly** — it's already inherited
4. If NOT found → Import and declare `readonly` locally (NO `override` keyword)

**Commonly inherited enums** (already in `UiEnumerations`):
`formFieldState`, `formFieldMode`, `formFieldSize`, `formFieldDirection`, `titleLayout`, `testDefinitionMode`, `testDefinitionDetailsMode`, `actionGroupType`, `levelIndicatorLevel`, `listBehavior`, `testDefinitionGroup`, `testDefinitionGroupMode`, `layoutOperationStatusState`, `layoutOperationStatusLayout`, `globalStatusIndicatorState`, `badgeComponentState`, `cardLayout`, `actorPrivilegeNameEnum`, `cobaltIndicatorColorEnum`

---

## Services Requiring `providers: []`

These services do NOT have `providedIn: 'root'` and MUST be added to the component's `providers`:

| Service                     | When To Use                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| `ConfirmationDialogService` | Any component with delete/discard confirmations                    |
| `HelpService`               | Components with help panel integration                             |
| `TaskPollingService`        | Components with background task polling (1 instance per component) |

```typescript
@Component({
  providers: [ConfirmationDialogService], // REQUIRED or NullInjectorError
  // ...
})
```

---

## Subscription Rules

| Scenario             | Pattern                                              |
| -------------------- | ---------------------------------------------------- |
| HTTP call (one-time) | `.pipe(take(1)).subscribe({ next:, error: })`        |
| Route params         | `this.subscribe(this.route.paramMap.subscribe(...))` |
| Event stream         | `this.subscribe(this.service.event$.subscribe(...))` |
| Parallel HTTP        | `forkJoin([...]).pipe(take(1)).subscribe(...)`       |

---

## Pre-Flight Checklist

Before submitting any code, verify:

- [ ] `standalone: true`
- [ ] Correct base class extended
- [ ] `super(injector)` first line, `injector` last param
- [ ] `protected override onInit()` (not `ngOnInit()`)
- [ ] `override` on all overridden methods
- [ ] Enum not already in `UiEnumerations`
- [ ] `styleUrl` (singular)
- [ ] LESS: `@import`, `:host`, `& .wrapper`, `rem` only
- [ ] Template: `app-form-field`, `app-title`, `app-layout-content`
- [ ] Footer: Secondary (Cancel) + Primary (Apply) — right-aligned
- [ ] List: `(dblclick)` + Edit in menu
- [ ] `providers: [ConfirmationDialogService]` if using confirmations
- [ ] `trackBy` is last method
- [ ] Loop vars named `index`
- [ ] No debug traces removed (unless explicitly asked)
- [ ] No `.md` documentation generated (unless explicitly asked)

---

**Generated**: 2026-02-11  
**Source**: [webapp] Repository Analysis  
**Conventions**: `jedai.scan.[module].[version].agent.md`
