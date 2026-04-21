````markdown
# Skill: Project TypeScript Conventions

## Objective

Respect project-specific TypeScript conventions: naming, enums, loops, error handling, data models.

## Enum Management

### Naming Convention

When creating an enum from a component, **remove "Component"** from the name:

```typescript
// Component: MyNameComponent
// ✅ CORRECT
export enum MyNameLayout {
  Default = 'Default',
  Expanded = 'Expanded',
  Compact = 'Compact'
}

// ❌ WRONG
export enum MyNameComponentLayout { ... }
```

### Exposing Enums in Templates

Use `readonly` with **lowercase first letter**:

```typescript
export class MyNameComponent extends BaseComponent {
  // ✅ CORRECT: lowercase first letter
  readonly myNameLayout = MyNameLayout;

  // ❌ WRONG: PascalCase
  readonly MyNameLayout = MyNameLayout;
}
```

### Usage in template

```html
<div *ngIf="currentLayout === myNameLayout.Expanded">
  <!-- Expanded content -->
</div>
```

## Loop Naming Convention

When using a loop with an index, **always use `index`** as the variable name, never a single letter.

```typescript
// ✅ CORRECT: Use "index"
for (let index = 0; index < data.length; index++) {
  this.processItem(data[index]);
}

// ❌ WRONG: Single-letter variable
for (let i = 0; i < data.length; i++) {
  this.processItem(data[i]);
}
```

In templates:

```html
<!-- ✅ CORRECT -->
<div *ngFor="let item of items; let index = index">{{ index }}: {{ item.name }}</div>

<!-- ❌ WRONG -->
<div *ngFor="let item of items; let i = index">{{ i }}: {{ item.name }}</div>
```

## Data Models: Interfaces vs DTOs

### Interfaces (for domain models)

```typescript
// Located in module models folder
export interface MyModel {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
}
```

### DTOs (for API communication)

```typescript
// Located in @core/api/<domain>/dto/
export class MyModelDto {
  id!: number;
  name!: string;
  isActive!: boolean;
  createdAt!: string; // Dates come as strings from API
}
```

### Key differences

| Aspect         | Interface (Model)          | Class (DTO)               |
| -------------- | -------------------------- | ------------------------- |
| **Keyword**    | `interface`                | `class`                   |
| **Location**   | Module `models/` folder    | `@core/api/<domain>/dto/` |
| **Properties** | Standard typing            | Non-null assertion (`!`)  |
| **Usage**      | Business logic, components | API communication         |
| **Dates**      | `Date` type                | `string` type             |

## Error Handling

### Using NotificationService

```typescript
import { NotificationService } from '@shared/services/notification.service/notification.service';
import { PopupMessageState } from '@shared/models/PopupMessage';

export class MyComponent extends BaseComponent {
  constructor(
    private notificationService: NotificationService,
    injector: Injector
  ) {
    super(injector);
  }

  doSomething(): void {
    this.myService
      .create(data)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.notificationService.popupMessage(
            this.uiLocale.App_Action_SuccessMessage,
            this.uiLocale.App_PopupMessage_Success,
            PopupMessageState.Success
          );
        },
        error: (error) => {
          this.notificationService.popupMessage(
            `The creation process was not completed. Please try again.`,
            this.uiLocale.App_PopupMessage_Error,
            PopupMessageState.Error
          );
        }
      });
  }
}
```

### PopupMessageState options

```typescript
enum PopupMessageState {
  Success,
  Error,
  Warning,
  Info
}
```

### Pattern standard

```typescript
// In subscribe error callback
error: (error) => {
  this.notificationService.popupMessage(`<User-friendly message>`, this.uiLocale.App_PopupMessage_Error, PopupMessageState.Error);
};
```

## Debug Traces

**Do NOT remove `console.log`, `console.warn`, or debug traces** unless explicitly asked by the user.

```typescript
// ✅ KEEP: Debug traces in code
console.log('Data loaded:', data);
console.warn('Fallback used for:', id);

// Only remove when the user explicitly asks to clean up debug traces
```

## Checklist

- [ ] Enums named without "Component" suffix
- [ ] Enum readonly fields use lowercase first letter
- [ ] Loop variables use `index` (never `i`, `j`, `k`)
- [ ] Interfaces for domain models, classes for DTOs
- [ ] DTOs use non-null assertion (`!`) on properties
- [ ] Error handling uses `NotificationService` + `PopupMessageState`
- [ ] Error messages use `uiLocale` translations when available
- [ ] Debug traces NOT removed unless explicitly requested
- [ ] `HttpClient` never used directly in components (go through services)

## Common Mistakes

```typescript
// ❌ WRONG: Enum named with "Component"
export enum MyComponentLayout { ... }
// ✅ CORRECT
export enum MyLayout { ... }

// ❌ WRONG: Single-letter loop variable
for (let i = 0; i < items.length; i++) { ... }
// ✅ CORRECT
for (let index = 0; index < items.length; index++) { ... }

// ❌ WRONG: Using alert() for errors
alert('Error occurred');
// ✅ CORRECT
this.notificationService.popupMessage(message, title, PopupMessageState.Error);

// ❌ WRONG: Removing debug traces without being asked
// console.log('debug:', data);  // Don't comment out!
// ✅ CORRECT: Leave them in place
console.log('debug:', data);
```
````
