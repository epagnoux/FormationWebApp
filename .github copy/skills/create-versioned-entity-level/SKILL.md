---
name: create-versioned-entity-level
description: Step-by-step workflow for adding a new versioned entity level (e.g. Project, Baseline, Aircraft, Circular) in SentinelWebPortal. Use this when asked to add a new level, new documentation level, or new entity level with versioning.
---

# Create a Versioned Entity Level — SentinelWebPortal

A "versioned entity level" is a domain entity (e.g. Project, Baseline, Aircraft, Circular) that has:

- A list page
- A version list page
- A versioned view with test definitions

This is a multi-file workflow. Follow each step in order.

---

## Step 1 — Add the DTO (core/api layer)

**Location:** `src/app/core/api/qtgx/dto/documentation/versioned-entity-level/`

Create `<entity>-dto.ts` and `<entity>-peek-dto.ts` matching the API contract:

```typescript
// <entity>-peek-dto.ts
export class EntityPeekDto {
  id!: number;
  name!: string;
  // minimal fields for list display
}

// <entity>-dto.ts
export class EntityDto extends EntityPeekDto {
  // full fields
}
```

---

## Step 2 — Create the ApiService (core layer)

**Location:** `src/app/core/api/qtgx/services/documentation/level/<entity>/`

```typescript
// <entity>-api.service.ts
import { AppConfig } from '@core/config/app.config';
import { EndpointQTGxDocumentation } from '@core/UiEnumerations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityPeekDto } from '@core/api/qtgx/dto/documentation/versioned-entity-level/entity-peek-dto';

@Injectable({ providedIn: 'root' })
export class EntityApiService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    appConfig: AppConfig
  ) {
    this.endpoint = appConfig.endpoints.qtg;
  }

  public getAll() {
    return this.http.get<EntityPeekDto[]>(`${this.endpoint}/${EndpointQTGxDocumentation.RootBase}/Entities`);
  }

  public get(id: number) {
    return this.http.get<EntityPeekDto>(`${this.endpoint}/${EndpointQTGxDocumentation.RootBase}/Entities/${id}`);
  }
}
```

---

## Step 3 — Register the new level in `VersionedEntityLevelService`

**File:** `src/app/modules/qtgx/documentation/level/versionedEntityLevel/services/versioned-entity-level.service.ts`

Inject the new `EntityApiService` and add a `case` in each `switch(level)` block:

```typescript
case LevelIndicatorLevel.Entity:
  return this.entityApiService.getAll();
```

---

## Step 4 — Register the new level in `LevelBase`

**File:** `src/app/modules/qtgx/documentation/base/level-base.component.ts`

Add the new case in `updateLevel()`:

```typescript
case RoutingPathsQTGxDocumentation.Entities:
  this.level = LevelIndicatorLevel.Entity;
  this.levelLabel = BreadcrumbLabelQTGxDocumentation.Entities;
  this.levelRootName = EndpointQTGxDocumentation.Entities;
  this.levelPathName = RoutingPathsQTGxDocumentation.Entities;
  break;
```

---

## Step 5 — Add enums and constants

In `src/app/core/UiEnumerations.ts`, add values to:

- `LevelIndicatorLevel` → `Entity = 'entity'`
- `RoutingPathsQTGxDocumentation` → `Entities = 'entities'`
- `EndpointQTGxDocumentation` → `Entities = 'Entities'`
- `BreadcrumbLabelQTGxDocumentation` → `Entities = 'Entities'`

---

## Step 6 — Create the route file

**Location:** `src/app/modules/qtgx/documentation/level/routes/<entity>.routes.ts`

Follow the exact same pattern as `project.routes.ts`:

```typescript
export const entityRoutes: Routes = [
  {
    path: RoutingPathsQTGxDocumentation.Entities,
    data: { level: LevelIndicatorLevel.Entity },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: VersionedEntityLevelComponent,
        data: { requireAnyPrivileges: [ActorPrivilegeNameEnum.QtgDoc < Entity > Read] }
      },
      {
        path: `:${KeysRoute.Root}`,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: VersionedEntityLevelVersionComponent,
            data: { requireAnyPrivileges: [ActorPrivilegeNameEnum.QtgDoc < Entity > Read] }
          },
          {
            path: `${RoutingPathsQTGxDocumentation.Version}/:${KeysRoute.Version}`,
            children: [
              { path: '', pathMatch: 'full', redirectTo: RoutingPathsQTGxDocumentation.View },
              {
                path: RoutingPathsQTGxDocumentation.View,
                component: TestDefinitionViewComponent,
                data: { requireAnyPrivileges: [ActorPrivilegeNameEnum.QtgDoc < Entity > Read] },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: RoutingPathsQTGxDocumentation.TestDefinitions }
                  // ... same children as project
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
```

---

## Step 7 — Register the route in `documentation.routes.ts`

**File:** `src/app/modules/qtgx/documentation/documentation.routes.ts`

```typescript
import { entityRoutes } from './level/routes/entity.routes';

// Inside the children array:
...entityRoutes,
```

---

## Step 8 — Add navigation entry (if needed)

If the level should appear in the navigation sidebar, add it to the navigation configuration used by the layout component.

---

## Checklist

- [ ] DTO created (peek + full)
- [ ] ApiService created and injectable
- [ ] `VersionedEntityLevelService` updated (all switch blocks)
- [ ] `LevelBase.updateLevel()` updated
- [ ] `UiEnumerations` updated (4 enums)
- [ ] Route file created following project.routes.ts pattern
- [ ] Route registered in `documentation.routes.ts`
- [ ] Privileges declared in `ActorPrivilegeNameEnum`
- [ ] Navigation entry added if required

---

## Key conventions

- Always use `take(1)` for HTTP calls inside components
- Always extend `LevelBase` or `VersionedEntityLevelBase` for level components
- Never call `ApiService` or `HttpClient` directly from a component
- Loop indexes: always `index`, never `i`
- Do not remove debug traces unless explicitly asked
