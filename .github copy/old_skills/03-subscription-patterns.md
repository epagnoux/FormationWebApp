# Skill: Master RxJS Subscription Patterns

## Objective

Properly manage observable subscriptions to prevent memory leaks and respect component lifecycle.

## Decision Tree: Which Strategy to Use?

```
┌─ Is it a single value? (HTTP call, single event)
│  └─→ Use take(1)
│
├─ Is it a continuous stream? (WebSocket, event stream, polling)
│  └─→ Use takeUntil(this.destroy$)
│
└─ Unsure?
   └─→ By default, prefer takeUntil(this.destroy$)
```

## Strategy 1: `take(1)` — For Unique Observables

Used for **HTTP calls** and **one-time operations**.

```typescript
// ✅ CORRECT: HTTP request with take(1)
this.myService
  .getById(id)
  .pipe(take(1))
  .subscribe({
    next: (data) => {
      this.processData(data);
    },
    error: (error) => {
      this.handleError(error);
    }
  });

// ❌ INCORRECT: Forgetting take(1) on HTTP call
this.myService.getById(id).subscribe((data) => {
  // Memory leak if data fetches happen repeatedly
  this.processData(data);
});
```

### When to use `take(1)`

- API calls (`GET`, `POST`, `PUT`, `DELETE`)
- Dialog results (one-time selection)
- Timer callbacks that fire once
- Any observable that emits exactly once

### Benefits

- Automatically unsubscribes after first value
- No manual cleanup needed
- Simplest and most efficient pattern

## Strategy 2: `takeUntil(this.destroy$)` — For Continuous Streams

Used for **long-lived subscriptions** tied to component lifecycle.

```typescript
// ✅ CORRECT: Long-lived stream with takeUntil
this.myService
  .onDataChange()
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (data) => {
      this.updateView(data);
    },
    error: (error) => {
      this.handleError(error);
    }
  });

// ❌ INCORRECT: Forgetting takeUntil on long-lived subscription
this.myService.onDataChange().subscribe((data) => {
  // Memory leak: subscription outlives component
  this.updateView(data);
});
```

### When to use `takeUntil(this.destroy$)`

- Event streams from services
- WebSocket / SignalR connections
- Long polling operations
- Query parameters or route changes
- Store/state management subscriptions
- Any subscription that should live as long as the component

### How it works

1. **BaseComponent** provides a `Subject` called `destroy$`
2. When component is destroyed (`ngOnDestroy`), `destroy$.next()` is called
3. All subscriptions using `takeUntil(this.destroy$)` immediately unsubscribe
4. Zero manual cleanup needed

```typescript
// From BaseComponent
protected destroy$ = new Subject<void>();

protected override ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
  // All subscriptions using takeUntil(this.destroy$) auto-unsubscribe
}
```

## Cheat Sheet: Decision Table

| Scenario                       | Strategy                      | Example                                                    |
| ------------------------------ | ----------------------------- | ---------------------------------------------------------- |
| HTTP GET/POST/PUT/DELETE       | `take(1)`                     | `this.http.get(url).pipe(take(1))`                         |
| Dialog result (user selection) | `take(1)`                     | `this.dialog.open(...).afterClosed().pipe(take(1))`        |
| Route params change            | `takeUntil(this.destroy$)`    | `this.route.params.pipe(takeUntil(this.destroy$))`         |
| Event emission                 | `takeUntil(this.destroy$)`    | `this.service.onEvent().pipe(takeUntil(this.destroy$))`    |
| WebSocket/SignalR              | `takeUntil(this.destroy$)`    | `this.hub.messageReceived$.pipe(takeUntil(this.destroy$))` |
| Timer/Interval                 | `take(1)` or `takeUntil(...)` | Depends on duration                                        |
| Form value changes             | `takeUntil(this.destroy$)`    | `this.form.valueChanges.pipe(takeUntil(this.destroy$))`    |
| Store selector                 | `takeUntil(this.destroy$)`    | `this.store.select(...).pipe(takeUntil(this.destroy$))`    |

## Real-World Example: Complete Component

```typescript
import { Component, Injector } from '@angular/core';
import { BaseComponent } from '@core/base/base.component';
import { take, takeUntil } from 'rxjs/operators';

export class ExampleComponent extends BaseComponent {
  data: any;
  message: string = '';

  constructor(
    private dataService: DataService,
    private eventService: EventService,
    injector: Injector
  ) {
    super(injector);
  }

  protected override onInit(): void {
    // Strategy 1: HTTP call with take(1)
    this.dataService
      .fetchData()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.data = result;
        },
        error: (error) => {
          this.handleError(error);
        }
      });

    // Strategy 2: Long-lived stream with takeUntil
    this.eventService
      .onDataUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (update) => {
          this.message = update.message;
        },
        error: (error) => {
          this.handleError(error);
        }
      });
  }

  // No need to override onDestroy() unless you have custom cleanup
  // BaseComponent handles destroy$ automatically
}
```

## Pipeline Chaining: Multiple Operators

```typescript
// ✅ CORRECT: Chain take(1) with other operators
this.service
  .getData()
  .pipe(
    map((data) => data.processed),
    filter((item) => item.valid),
    take(1) // Must come BEFORE subscribe
  )
  .subscribe((result) => {
    // Handle result
  });

// ✅ CORRECT: Chain takeUntil with multiple operators
this.service
  .getData()
  .pipe(
    map((data) => data.processed),
    filter((item) => item.valid),
    takeUntil(this.destroy$) // Must come BEFORE subscribe
  )
  .subscribe((result) => {
    // Handle result
  });
```

## Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Using manual unsubscribe (verbose, error-prone)
private subscription: Subscription;

ngOnInit() {
  this.subscription = this.service.getData().subscribe(...);
}

ngOnDestroy() {
  this.subscription.unsubscribe(); // Manual cleanup = forget easily
}

// ✅ CORRECT: Use take(1) or takeUntil(this.destroy$)
protected override onInit() {
  this.service.getData()
    .pipe(take(1))
    .subscribe(...);
}

// ❌ WRONG: No unsubscribe strategy (memory leak)
ngOnInit() {
  this.service.getData().subscribe(...); // MEMORY LEAK!
}

// ✅ CORRECT: Always have unsubscribe strategy
protected override onInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(...);
}
```

## Checklist

- [ ] All HTTP calls use `take(1)`
- [ ] All long-lived streams use `takeUntil(this.destroy$)`
- [ ] No manual `Subscription.unsubscribe()` calls
- [ ] Error handling present in `error` callback or global handler
- [ ] Unsubscribe operators placed before `.subscribe()`
- [ ] Components extend `BaseComponent` to access `destroy$`
