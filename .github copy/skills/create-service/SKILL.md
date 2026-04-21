---
name: create-service
description: Guide for creating a new service in SentinelWebPortal following the bridge pattern (ApiService + DomainService). Use this when asked to add, scaffold, or create a service, API service, or domain service.
---

# Create a Service — SentinelWebPortal

## Architecture reminder

```
Component
  └── DomainService          ← src/app/modules/qtgx/.../services/
        └── ApiService       ← src/app/core/api/qtgx/services/
              └── HttpClient
```

Never call `HttpClient` directly from a component. Never call `ApiService` directly from a component.

---

## Part A — Create the ApiService (core layer)

**Location:** `src/app/core/api/qtgx/services/<domain>/<entity>-api.service.ts`

```typescript
import { AppConfig } from '@core/config/app.config';
import { EndpointQTGxDocumentation } from '@core/UiEnumerations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityDto } from '@core/api/qtgx/dto/<domain>/entity-dto';

@Injectable({
  providedIn: 'root'
})
export class EntityApiService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    appConfig: AppConfig
  ) {
    this.endpoint = appConfig.endpoints.qtg;
  }

  public getAll() {
    return this.http.get<EntityDto[]>(`${this.endpoint}/${EndpointQTGxDocumentation.RootBase}/Entities`);
  }

  public get(id: number) {
    return this.http.get<EntityDto>(`${this.endpoint}/${EndpointQTGxDocumentation.RootBase}/Entities/${id}`);
  }

  public create(dto: EntityDto) {
    return this.http.post<EntityDto>(`${this.endpoint}/${EndpointQTGxDocumentation.RootBase}/Entities`, dto);
  }

  public update(id: number, dto: EntityDto) {
    return this.http.put<EntityDto>(`${this.endpoint}/${EndpointQTGxDocumentation.RootBase}/Entities/${id}`, dto);
  }

  public delete(id: number) {
    return this.http.delete<void>(`${this.endpoint}/${EndpointQTGxDocumentation.RootBase}/Entities/${id}`);
  }
}
```

---

## Part B — Create the DTO

**Location:** `src/app/core/api/qtgx/dto/<domain>/entity-dto.ts`

```typescript
export class EntityDto {
  id!: number;
  name!: string;
  // Add all fields matching the API contract
}
```

---

## Part C — Create the DomainService (module layer)

**Location:** `src/app/modules/qtgx/.../services/entity.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityApiService } from '@core/api/qtgx/services/<domain>/entity-api.service';
import { EntityDto } from '@core/api/qtgx/dto/<domain>/entity-dto';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  constructor(private entityApiService: EntityApiService) {}

  public getAll(): Observable<EntityDto[]> {
    return this.entityApiService.getAll();
  }

  public get(id: number): Observable<EntityDto> {
    return this.entityApiService.get(id);
  }

  public create(dto: EntityDto): Observable<EntityDto> {
    return this.entityApiService.create(dto);
  }

  public update(id: number, dto: EntityDto): Observable<EntityDto> {
    return this.entityApiService.update(id, dto);
  }

  public delete(id: number): Observable<void> {
    return this.entityApiService.delete(id);
  }
}
```

---

## Part D — Use in a component

```typescript
constructor(
  private entityService: EntityService,
  injector: Injector
) {
  super(injector);
}

protected override onInit(): void {
  this.entityService.getAll()
    .pipe(take(1))
    .subscribe({
      next: (entities) => this.entities = entities,
      error: () => this.notificationService.popupMessage(
        'Failed to load entities.',
        this.uiLocale.App_PopupMessage_Error,
        PopupMessageState.Error
      )
    });
}
```

---

## Rules

- `ApiService` → only `HttpClient`, only DTOs, no business logic
- `DomainService` → bridges API, can add caching/transformation
- `ViewService` → singleton, manages UI state only (not HTTP)
- Loop indexes: always use `index`, never `i`
- Do not remove debug traces unless explicitly asked
