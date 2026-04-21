# Skill: Create a Service Bridge (Domain Service)

## Objective

Create a domain service that acts as a bridge between components and API services (bridge pattern).

## Architecture

```
Component
    ↓
Domain Service (Service Bridge)  ← Business logic, caching, transformation
    ↓
API Service                      ← Direct HTTP communication
    ↓
HTTP → Backend API

UI Services (optional):
├── *ViewService   ← UI state management (e.g., TestDefinitionViewService)
└── *EventService  ← Event handling (e.g., CodeEventsService)
```

## API Service Template

Located in `@core/api/<domain>/services/`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { AppConfig } from '@core/config/app.config';
import { MyModelDto } from '../dto/my-model.dto';

@Injectable({ providedIn: 'root' })
export class MyResourceApiService {
  private endpoint: string;

  constructor(
    private http: HttpClient,
    appConfig: AppConfig
  ) {
    this.endpoint = appConfig.endpoints.mdm; // or .qtgx, .backend, etc.
  }

  @Cacheable({ maxAge: 5 * 60 * 1000 }) // 5 minutes
  getList(): Observable<MyModelDto[]> {
    return this.http.get<MyModelDto[]>(`${this.endpoint}/api/MyResources`);
  }

  get(id: string): Observable<MyModelDto> {
    return this.http.get<MyModelDto>(`${this.endpoint}/api/MyResources/${id}`);
  }

  create(data: MyModelDto): Observable<MyModelDto> {
    return this.http.post<MyModelDto>(`${this.endpoint}/api/MyResources`, data);
  }

  update(id: string, data: MyModelDto): Observable<MyModelDto> {
    return this.http.put<MyModelDto>(`${this.endpoint}/api/MyResources/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/api/MyResources/${id}`);
  }
}
```

## Domain Service Template (Bridge)

Located in `src/app/modules/<module>/services/`:

```typescript
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MyResourceApiService } from '@core/api/<domain>/services/my-resource-api.service';
import { MyModel } from '../models/my-model';
import { MyModelDto } from '@core/api/<domain>/dto/my-model.dto';

@Injectable({ providedIn: 'root' })
export class MyResourceService {
  private myResourceSubject = new Subject<MyModel>();
  public myResource$ = this.myResourceSubject.asObservable();

  constructor(private myResourceApiService: MyResourceApiService) {}

  /**
   * Fetch list of resources with transformation
   */
  getList(): Observable<MyModel[]> {
    return this.myResourceApiService.getList().pipe(map((dtos) => dtos.map((dto) => this.transformDtoToModel(dto))));
  }

  /**
   * Fetch single resource and emit via subject
   */
  get(id: string): Observable<MyModel> {
    return this.myResourceApiService.get(id).pipe(
      map((dto) => this.transformDtoToModel(dto)),
      tap((model) => this.myResourceSubject.next(model))
    );
  }

  /**
   * Create resource with business logic
   */
  create(model: MyModel): Observable<MyModel> {
    const dto = this.transformModelToDto(model);
    return this.myResourceApiService.create(dto).pipe(
      map((dto) => this.transformDtoToModel(dto)),
      tap((createdModel) => this.myResourceSubject.next(createdModel))
    );
  }

  /**
   * Update resource
   */
  update(id: string, model: MyModel): Observable<MyModel> {
    const dto = this.transformModelToDto(model);
    return this.myResourceApiService.update(id, dto).pipe(
      map((dto) => this.transformDtoToModel(dto)),
      tap((updatedModel) => this.myResourceSubject.next(updatedModel))
    );
  }

  /**
   * Delete resource
   */
  delete(id: string): Observable<void> {
    return this.myResourceApiService.delete(id).pipe(tap(() => this.myResourceSubject.next(null)));
  }

  /**
   * Transform DTO (PascalCase) to Model (camelCase)
   * Note: DTO conversion to camelCase happens automatically via interceptor
   */
  private transformDtoToModel(dto: MyModelDto): MyModel {
    return {
      id: dto.id,
      name: dto.name
      // Add other mappings as needed
    };
  }

  /**
   * Transform Model to DTO for API submission
   */
  private transformModelToDto(model: MyModel): MyModelDto {
    return {
      id: model.id,
      name: model.name
      // Add other mappings as needed
    };
  }
}
```

## View Service Template (UI State)

Located in `src/app/modules/<module>/services/`:

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Manages UI state for a specific view
 * Typically singleton for a view/page
 */
@Injectable({ providedIn: 'root' })
export class MyResourceViewService {
  private selectedIdSubject = new BehaviorSubject<string | null>(null);
  public selectedId$ = this.selectedIdSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  selectItem(id: string): void {
    this.selectedIdSubject.next(id);
  }

  setLoading(loading: boolean): void {
    this.isLoadingSubject.next(loading);
  }
}
```

## Event Service Template

Located in `src/app/modules/<module>/services/`:

```typescript
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * Handles cross-component event communication
 */
@Injectable({ providedIn: 'root' })
export class MyResourceEventsService {
  private dataChangedSubject = new Subject<void>();
  private itemDeletedSubject = new Subject<string>();

  get onDataChanged$(): Observable<void> {
    return this.dataChangedSubject.asObservable();
  }

  get onItemDeleted$(): Observable<string> {
    return this.itemDeletedSubject.asObservable();
  }

  emitDataChanged(): void {
    this.dataChangedSubject.next();
  }

  emitItemDeleted(id: string): void {
    this.itemDeletedSubject.next(id);
  }
}
```

## Usage in a Component

```typescript
export class MyResourceListComponent extends ListBase {
  resources$: Observable<MyModel[]>;

  constructor(
    private myResourceService: MyResourceService,
    injector: Injector
  ) {
    super(injector);
  }

  protected override onInit(): void {
    this.resources$ = this.myResourceService.getList();
  }
}
```

## Key Points

### DTO Auto-Conversion

- **Interceptor automatically converts** between camelCase (client) ↔ PascalCase (server)
- **No manual mapping needed** for case conversion
- DTOs are located in `@core/api/<domain>/dto/`

### Strategic Caching

- Use `@Cacheable()` on **read-only GET endpoints** in API services
- **Avoid caching** on create/update/delete operations
- Cache duration: typically 5–15 minutes depending on data volatility

### Subjects for Real-Time Updates

- Use `Subject<T>` to emit updates when data changes
- Emit after successful create/update/delete
- Components can subscribe via `service.myResource$` with `takeUntil(this.destroy$)`

### Error Handling

- Errors typically handled at **component level** (via `error` callback in subscribe)
- Or use a **global error handler** if applicable

## Checklist

- [ ] API Service in `@core/api/<domain>/services/`
- [ ] Domain Service in `src/app/modules/<module>/services/`
- [ ] Use `@Cacheable()` on appropriate GET endpoints
- [ ] Implement DTO ← → Model transformation
- [ ] Use `Subject<T>` for state updates
- [ ] Return `Observable<T>` from service methods
- [ ] Properly typed DTOs in `@core/api/<domain>/dto/`
- [ ] Services use `@Injectable({ providedIn: 'root' })`
