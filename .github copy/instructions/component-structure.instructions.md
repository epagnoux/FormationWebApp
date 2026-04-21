---
applyTo: '**/*.component.ts,**/*.component.html,**/*.component.less'
---

# Component Structure — SentinelWebPortal

## Component Types & File Layout

### 1. List Components (`*-list`)

```
component-name-list/
├── component-name-list.component.ts
├── component-name-list.component.html
├── component-name-list.component.less
├── filters/
│   ├── component-name-filters.service.ts
│   └── component-name-filter.model.ts
└── component-name-item/
    ├── component-name-item.component.ts
    ├── component-name-item.component.html
    └── component-name-item.component.less
```

- Extend `ListBase` (which extends `BaseComponent`)
- Implement: virtual scrolling, data fetching, sorting/filtering, selection handling
- Example: `export class TestDefinitionListComponent extends ListBase`

### 2. Edit / Config Side Panels (`*-edit`, `*-config`)

```
component-name-edit/
├── component-name-edit.component.ts
├── component-name-edit.component.html
└── component-name-edit.component.less
```

- Inject data via `COBALT_SIDE_PANEL_DATA`; close via `CobaltSidePanelRef.close(data)`
- Level-related: extend `LevelBase` — Form-based: extend `FormGroupBase`
- Example: `export class ReferenceEditComponent extends FormGroupBase`

### 3. Dialog Components (`*-dialog`)

```
component-name-dialog/
├── component-name-dialog.component.ts
├── component-name-dialog.component.html
└── component-name-dialog.component.less
```

- Inject data via `MAT_DIALOG_DATA`; return via `MatDialogRef.close(result)`
- Extend `BaseComponent`
- Example: `export class ImportBackboneDialogComponent extends BaseComponent`

### 4. Menu Components (`*-menu`)

```
component-name-menu/
├── component-name-menu.component.ts
├── component-name-menu.component.html
└── component-name-menu.component.less
```

- Use `CobaltOverflowMenuModule` or `MatMenuModule`
- Extend `BaseComponent`

### 5. Tab Group Components (`*-tabs`, `*-tab-group`)

```
component-name-tabs/
├── component-name-tabs.component.ts
├── component-name-tabs.component.html
└── component-name-tabs.component.less
```

- Use `MatTabsModule` or `CobaltContentSwitcherModule`
- Extend `BaseComponent`
- Example: `export class TestDefinitionLevelSelectorComponent extends BaseComponent`

### 6. View Components (`*-view`)

```
component-name-view/
├── component-name-view.component.ts
├── component-name-view.component.html
└── component-name-view.component.less
```

- Coordinate child components, routing, overall state, permission checks
- Versioned entities: extend `VersionedEntityLevelBase`
- Example: `export class TestDefinitionViewComponent extends TestDefinitionBase`

## Component Inheritance Hierarchy

```
BaseComponent (core/base/base.component.ts)
├── LevelBase
│   ├── TestDefinitionBase
│   └── VersionedEntityLevelBase
├── ListBase
│   ├── TestDefinitionListBase
│   └── ReferenceListBase
└── FormGroupBase
    └── TestDefinitionFormBase
```

**Rule:** Always extend the most specific applicable base class:

| Component type   | Base to extend               |
| ---------------- | ---------------------------- |
| Basic            | `BaseComponent`              |
| List             | `ListBase`                   |
| Level-specific   | `LevelBase`                  |
| Versioned entity | `VersionedEntityLevelBase`   |
| Form             | `FormGroupBase`              |
| Test definition  | Appropriate specialized base |
