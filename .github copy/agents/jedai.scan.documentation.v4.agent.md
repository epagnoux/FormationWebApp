# Angular/TS Repository Scanner v4

## Mission

Auto-detect ALL patterns/conventions. Generate comprehensive doc. `$ARGUMENTS` = paths to scan (else all).

## Post-Scan

Ask build agent name → create `jedai.build.$INPUT.agent.md`.

## Scan Targets

**Components**: structure, inheritance, naming, types (List/Edit/Dialog/View/Menu/Tab/Item), `providers[]`, `override` %, `readonly` visibility, enum inheritance, custom wrappers, footer, double affordance.

**Templates**: control flow, state mgmt, forms, tables, events, a11y, footer alignment, dblclick+menu.

**Styles**: order (imports→:host→layout→states→overrides), variables, nesting, units, global classes, local redefinitions.

**Services**: layers (API/business/state/view), DTOs, `providedIn` vs `providers[]`, method order (getAll→get→create→update→delete), clone pattern.

**Models/Interfaces**: naming, immutability, type safety, `!` assertion.

**Subscriptions**: `take(1)` vs `takeUntil(destroy$)`, Subject types, cleanup.

**Routing**: structure, guards, resolvers, lazy loading, params.

**Organization**: folder structure, modules vs standalone, barrel exports.

**TypeScript**: import order, decorators, access modifiers, constructor.

**Error**: global handler, interceptors, notifications.

**Config**: env files, linting.

## Method

1. Scan 20-50 samples/category
2. Extract: exact order, naming, structures, vars, conventions
3. Consolidate: dominant (>70%), variations, anti-patterns
4. Validate: config files, base classes

## Output (Markdown)

**Sections**: tech stack, architecture, component patterns, service layers, styles, TS conventions, templates, subscriptions, errors, v2 (providers, override stats, readonly visibility, global styles), v3 (readonly inheritance, redundancy), v4 (wrappers, footer, affordance, method order), mandatory rules, forbidden, checklists.

**Requirements**: REAL examples (exact paths), % stats, 100+ rules, 50+ examples, 5500+ lines, ONLY detected patterns.

## Analysis Tables

### Components (20+)

| Component | @Input order | @Output | Constructor params | Lifecycle | Methods | trackBy |

Extract: import groups (Angular→Material→RxJS→Project), properties (@Input→@Output→@ViewChild→public→protected→private→readonly→static), constructor order, lifecycle sequence, methods (events→public→protected→private→utils).

### Templates (15+)

| Template | Root | Sections | State | Control flow | Form | Table |

### Styles (15+)

| File | First line | :host | Nesting | Naming | Units | Variables % | Override pos |

### v2: Providers (ALL)

| Component | Has providers | Services | Service providedIn | Reason |

### v2: Override (ALL inheriting)

| Component | Base | Methods overridden | Uses override | % |

### v2: Readonly (20+)

| Component | Property | Visibility | Usage | Pattern |

### v2: Global Styles (ALL)

| Class | Source | # uses | # redefs (→0) |

### v3: Readonly Registry (ALL base)

| Base | Property | Type/Value | Import | Inherited |

### v3: Redundancy (ALL components)

| Component | Redundant import | Redundant property | Action |

### v4: Form Wrappers (ALL)

Custom vs native. % adoption. @Input list.

### v4: Titles (ALL)

Custom vs `<h1-h6>`. % adoption.

### v4: Footers (ALL edit panels)

Actions right-aligned. Secondary+Primary. Cancel+Save.

### v4: Double Affordance (ALL lists)

`(dblclick)` + Edit menu. % compliance.

### v4: Service Methods (ALL)

Order: getAll→get→create→update→delete. Mocks return clones.

## Key Rules

### Component Structure

- Standalone: true
- Import order: Angular core→Material→3rd-party→RxJS→Project (services→models→components)
- Property order: @Input→@Output→@ViewChild→public→protected→private→readonly→static
- Constructor: public→private→@Inject→injector (if extends)
- super() always first
- Lifecycle: ngOnChanges→ngOnInit→ngAfterViewInit→ngOnDestroy
- Methods: event handlers (on\*)→public→protected→private→trackBy/compare
- trackBy always last, named "trackBy" not "trackByIndex"

### Services

- If stateless/global: `@Injectable({ providedIn: 'root' })`
- If stateful/scoped: `@Injectable()` + `providers: [Service]` in component
- Services without `providedIn` MUST be in `providers[]` else NullInjectorError
- Edit/CRUD services: getAll()→get()→create()→update()→delete()
- Mock services: return clones `{ ...item }`

### Subscriptions

- HTTP calls: `.pipe(take(1))`
- Long-lived streams: `.pipe(takeUntil(this.destroy$))`
- destroy$ in BaseComponent, cleanup in ngOnDestroy

### Templates

- Root wrapper element
- Sections: header→content→footer
- State: loading/empty/error/loaded (@if vs \*ngIf)
- Event handlers: `on*` prefix
- v4: Edit panels → footer with right-aligned Secondary+Primary buttons
- v4: Lists → `(dblclick)` + Edit menu action

### Styles

- Order: @import→:host→layout→components→states→overrides
- Units: rem only (10px = 1rem)
- Spacing: 0.3, 0.6, 0.8, 1.2, 1.6, 1.8, 2, 2.4, 2.6rem
- Global classes: use directly, NEVER redefine locally
- Icons: mask + background pattern

### v2: Override

- If >70% use `override` on inherited methods → MANDATORY
- Else → RECOMMENDED

### v2: Readonly Visibility

- Template-only: `protected readonly`
- Public API: `public readonly`

### v3: Readonly Inheritance

- BEFORE importing enum/constant, check if already in parent class
- If in parent → NO import, NO property, use directly
- If NOT in parent → declare locally: `readonly prop = Value;` (no override)
- If property used in N+ components → consider adding to base class
- NEVER `override readonly` for identical parent property (TS4114 error)

### v4: Custom Wrappers

- Form fields: detect custom wrapper component replacing mat-form-field
- Titles: detect custom component replacing `<h1-h6>`
- If >70% → MANDATORY, else RECOMMENDED

## Anti-Patterns (v2/v3)

❌ Redefine global class locally
❌ `@Injectable()` without providedIn AND not in providers[]
❌ `readonly` without `override` when property exists in parent (TS4114)
❌ Import + `override readonly` for property already inherited
❌ Service used in 1 component but `providedIn: 'root'`

## Validation Checklist

**Component**:

- [ ] Import order correct
- [ ] Property order correct
- [ ] super() first if extends
- [ ] override on inherited methods (if rule detected)
- [ ] readonly has correct visibility modifier
- [ ] No redundant enum/constant imports from parent
- [ ] providers[] includes all non-root services
- [ ] trackBy last, named "trackBy"

**Template**:

- [ ] Custom wrappers used (if pattern detected)
- [ ] Footer right-aligned (edit panels)
- [ ] dblclick + menu (lists)

**Style**:

- [ ] No global class redefinitions
- [ ] rem units only
- [ ] @import first

**Service**:

- [ ] providedIn: 'root' (global) OR in providers[] (scoped)
- [ ] Method order: getAll→get→create→update→delete
- [ ] Mocks return clones

## Quality Criteria

✅ Exact folder structure (not generic)
✅ Real code examples (exact file paths)
✅ Statistics (% usage)
✅ Dominant patterns identified
✅ Variations documented
✅ Anti-patterns detected
✅ 100+ rules minimum
✅ 50+ examples minimum
✅ Complete checklists (20+ items/category)
✅ v2: Services without providedIn inventory, override %, global classes inventory, redefinitions
✅ v3: Base class readonly registry, inheritance chain, redundancy detection, decision tree
✅ v4: Wrapper adoption %, footer compliance, affordance %, method order compliance

**Deliverable**: `[project-name]-conventions.md` (5500+ lines)

**Note**: Document ONLY what exists. No NgRx? Don't document it.
