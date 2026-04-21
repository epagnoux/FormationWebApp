---
applyTo: '**/*.ts'
---

# Angular / TypeScript Conventions — SentinelWebPortal

## Component Configuration

```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    CobaltButtonModule
    // Other imports organized by origin
  ],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.less'
})
export class ComponentNameComponent extends BaseComponent {
  // ...
}
```

- Always `standalone: true`
- Always extend the appropriate base class (see component-structure skill)

## Injection Patterns

```typescript
constructor(
  public sidePanelRef: CobaltSidePanelRef<ComponentNameComponent>,
  @Inject(COBALT_SIDE_PANEL_DATA) public data: DataModel,
  private service: ServiceName,
  injector: Injector
) {
  super(injector);
}
```

Always pass `injector` to `super(injector)`.

## Lifecycle — Use Overridden Protected Methods

```typescript
protected override onInit(): void {
  this.someService.onDataChange()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.updateView(data));
}

protected override onDestroy(): void {
  // BaseComponent already calls this.destroy$.next() and this.destroy$.complete()
  // Add additional cleanup only if needed
}
```

## Enum Management

- Remove "Component" suffix from enum name
  - `MyNameComponent` → `export enum MyNameLayout`
- Expose enum as readonly with lowercase first letter: `readonly myNameLayout = MyNameLayout;`

## Data Models

```typescript
// Interface for domain models
export interface DataModel {
  id: number;
  name: string;
}

// Class with ! for DTO properties
export class ModelDto {
  id!: number;
  name!: string;
}
```

## HTTP Request Pattern

```typescript
// NEVER use HttpClient directly in components
// CORRECT — one-time HTTP call
this.testDefinitionService
  .getTestDefinition(id)
  .pipe(take(1))
  .subscribe({
    next: (result) => this.handleData(result),
    error: (error) => this.handleError(error)
  });

// CORRECT — continuous stream
this.someEventService
  .onSomeEvent()
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (event) => this.handleEvent(event),
    error: (error) => this.handleError(error)
  });
```

## Subscription Management

| Use Case                        | Pattern                    |
| ------------------------------- | -------------------------- |
| HTTP calls                      | `take(1)`                  |
| WebSockets / long-lived streams | `takeUntil(this.destroy$)` |
| UI events (one-time)            | `take(1)`                  |
| Continuous data updates         | `takeUntil(this.destroy$)` |

## Error Handling

```typescript
import { NotificationService } from '@shared/services/notification.service/notification.service';
import { PopupMessageState } from '@shared/models/PopupMessage';
import { TranslateUiService } from '../translate-ui/translate-ui.service';

protected uiLocale = TranslateUiService.currentLocale;

// In subscribe error handler:
(error) => {
  this.notificationService.popupMessage(
    `The creation process was not completed. Please try again.`,
    this.uiLocale.App_PopupMessage_Error,
    PopupMessageState.Error
  );
}
```

## Loop Variable Naming

Always use `index` (never `i`, `j`, etc.):

```typescript
// Correct
for (let index = 0; index < data.length; index++) { ... }
```

## Debug Traces

**Do not remove debug traces unless explicitly asked.**

## Versioned Entity Pattern

```typescript
export class ProjectVersionComponent extends VersionedEntityLevelBase {
  constructor(
    private projectService: ProjectService,
    injector: Injector
  ) {
    super(injector);
  }

  loadVersions() {
    this.projectService
      .getVersions(this.projectId)
      .pipe(take(1))
      .subscribe({
        next: (versions) => this.handleVersions(versions),
        error: (error) => this.handleError(error)
      });
  }
}
```
