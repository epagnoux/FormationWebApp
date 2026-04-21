---
applyTo: '**/*.service.ts'
---

# Service Layer Architecture — SentinelWebPortal

## Layer Overview

```
API Services (Core)
├── *ApiService            # Direct HTTP calls — @core/api/*/services/
└── Domain Services (Module)
    ├── *Service           # Business logic
    └── UI Services
        ├── *ViewService   # UI state management
        └── *EventService  # Event handling
```

## Rules

1. **ApiService** — only in `@core/api/*/services/`. Uses `HttpClient`, returns `Observable<DTO>`. Never call directly from components.
2. **DTOs** — in `@core/api/*/dto/`. Define exact API contract shapes.
3. **Bridge Pattern** — domain services are the only layer that calls `ApiService`. They handle caching, transformation, and expose a clean interface.
4. **ViewService** — singleton per view, manages UI state only.

## Service Layering Example

```typescript
// Domain service bridges the API service
export class TestDefinitionService {
  constructor(private testDefinitionApiService: TestDefinitionApiService) {}

  getTestDefinition(id: number): Observable<TestDefinitionDto> {
    return this.testDefinitionApiService.getTestDefinition(id);
  }
}
```

## Loop Variable Naming

Always use `index` (not `i`, `j`, etc.) when iterating with an index:

```typescript
// Correct
for (let index = 0; index < data.length; index++) { ... }

// Incorrect
for (let i = 0; i < data.length; i++) { ... }
```
