---
name: fix-memory-leak
description: Guide for diagnosing and fixing memory leaks in SentinelWebPortal Angular components. Use this when asked to find, fix, debug, or investigate memory leaks, subscription leaks, event listener leaks, or performance degradation caused by component lifecycle issues.
---

# Fix Memory Leaks — SentinelWebPortal

> **Recent update :** La section `.afterClosed()` a été réorganisée pour clarifier la différence entre `take(1)` (one-shot observables) et `this.subscribe()` (long-lived subscriptions). Les exemples réels du codebase sont maintenant documentés (cf. Section "Real-world examples").

## Overview

Memory leaks in this project typically come from Angular components that extend `BaseComponent` (or its subclasses `LevelBase`, `MarkdownBase`, `CodeEditorBase`, `ListBase`). The `BaseComponent` manages subscriptions via `this.subscribe()` and cleans them up in `ngOnDestroy()`.

A leak occurs when:

- `ngOnDestroy()` is overridden without calling `super.ngOnDestroy()`
- `document.addEventListener()` uses anonymous functions (impossible to `removeEventListener`)
- `element.addEventListener()` in a `ViewChild` setter adds listeners without removing old ones
- `.subscribe()` is called directly instead of via `this.subscribe()` from `BaseComponent`
- `setTimeout`/`setInterval` are not cleaned up in `onDestroy()`

## Step 1 — Use ComponentLeakTracker to identify the leak

The project includes a built-in dev-only tracker in `src/app/core/base/component-leak-tracker.service.ts`.

### Diagnostic workflow (Chrome Console)

```javascript
// 1. Take a snapshot of current component counts
__leakTracker.snapshot();

// 2. Navigate in loop (list → detail → list → detail → list) — 3 to 5 times

// 3. Check the report
__leakTracker.report();

// 4. Look for components with Growth > 0 and Status = 🔴 LEAK
// 5. Get details on leaking instances
__leakTracker.details();

// 6. Check INIT/DESTROY history
__leakTracker.history();
```

### Interpreting results

- **Growth = 0, Status = ✅ OK** → Component is properly destroyed, no leak.
- **Growth > 0, Status = 🔴 LEAK** → Component accumulates instances. Each value of Growth equals the number of leaked instances.
- **INIT without matching DESTROY in history** → `ngOnDestroy` is not being called. Check routing or component lifecycle.
- **DESTROY (subs: N)** → N subscriptions existed at destruction. If using `BaseComponent`, they are cleaned up automatically.

### Check document event listeners

Run directly in Chrome Console (not via `__leakTracker`):

```javascript
Object.entries(getEventListeners(document))
  .map(([t, l]) => t + ': ' + l.length)
  .join('\n');
```

Navigate and re-run. If `keydown`/`keyup`/`scroll` counts increase → event listener leak.

## Step 2 — Identify the root cause

### Cause 1: Missing `super.ngOnDestroy()`

**How to find:** Search the leaking component and its parent classes for `ngOnDestroy` or `override ngOnDestroy`. If the method exists but does not call `super.ngOnDestroy()`, all subscriptions registered via `this.subscribe()` are never unsubscribed.

```typescript
// Search pattern
grep -n "override ngOnDestroy\|ngOnDestroy()" path/to/component.ts
// Then check if super.ngOnDestroy() is called inside
```

**Inheritance chain to check:** Component → CodeEditorBase / MarkdownBase / LevelBase / ListBase → BaseComponent

### Cause 2: Anonymous `document.addEventListener`

**How to find:** Search for `document.addEventListener` in the leaking component:

```typescript
// Search pattern
grep -n "document.addEventListener" path/to/component.ts
```

If the second argument is an arrow function `(event) => { ... }`, it cannot be removed.

### Cause 3: `ViewChild` setter adding listeners without cleanup

**How to find:** Search for `addEventListener` combined with `@ViewChild` or `set` accessors:

```typescript
// Search pattern
grep -n "addEventListener\|set .*Setter\|@ViewChild" path/to/component.ts
```

If `attachScroll()` or similar is called in a setter without removing the previous listener, it leaks on every re-render.

### Cause 4: Direct `.subscribe()` without `this.subscribe()`

**How to find:** Search for `.subscribe(` that is NOT wrapped in `this.subscribe()`:

```typescript
// Search for subscribe calls not managed by BaseComponent
grep -n "\.subscribe(" path/to/component.ts | grep -v "this.subscribe("
```

Any long-lived subscription (on a singleton service's BehaviorSubject/Subject) that is not registered via `this.subscribe()` will never be cleaned up.

### Cause 5: `setTimeout`/`setInterval` without cleanup

**How to find:**

```typescript
grep -n "setTimeout\|setInterval" path/to/component.ts
// Then check if corresponding clearTimeout/clearInterval exists in onDestroy
grep -n "clearTimeout\|clearInterval\|onDestroy" path/to/component.ts
```

## Step 3 — Apply the fix

### Fix 1: Add `super.ngOnDestroy()`

```typescript
// ❌ BEFORE
override ngOnDestroy() {
  this.disposables.forEach((d) => d.dispose());
}

// ✅ AFTER
override ngOnDestroy() {
  this.disposables.forEach((d) => d.dispose());
  super.ngOnDestroy();
}
```

### Fix 2: Named handler for `document.addEventListener`

```typescript
// ❌ BEFORE
document.addEventListener('keydown', (event) => { /* ... */ });

// ✅ AFTER
// 1. Store the handler as a class property
private boundKeydownHandler = this.onDocumentKeydown.bind(this);

// 2. Add listener using the stored reference
document.addEventListener('keydown', this.boundKeydownHandler);

// 3. Remove in ngOnDestroy
override ngOnDestroy() {
  document.removeEventListener('keydown', this.boundKeydownHandler);
  super.ngOnDestroy();
}

// 4. Named handler method
private onDocumentKeydown(event: KeyboardEvent): void {
  // Add a guard for destroyed editors
  if (!this.editor) return;
  // ... handler logic
}
```

### Fix 3: `ViewChild` setter scroll listener cleanup

```typescript
// ❌ BEFORE
private attachScroll(): void {
  this.editorItems.nativeElement.addEventListener('scroll', () => { /* ... */ });
}

// ✅ AFTER
private boundScrollHandler: (() => void) | undefined;

private attachScroll(): void {
  if (this.editorItems) {
    // Remove previous listener if setter is called multiple times
    if (this.boundScrollHandler) {
      this.editorItems.nativeElement.removeEventListener('scroll', this.boundScrollHandler);
    }
    this.boundScrollHandler = () => { /* ... */ };
    this.editorItems.nativeElement.addEventListener('scroll', this.boundScrollHandler);
  }
}

protected override onDestroy(): void {
  if (this.editorItems && this.boundScrollHandler) {
    this.editorItems.nativeElement.removeEventListener('scroll', this.boundScrollHandler);
  }
  clearTimeout(this.emitTimerUpdateDataIndex);
}
```

### Fix 4: Use `this.subscribe()` for long-lived subscriptions

```typescript
// ❌ BEFORE
this.userProfileService.loaded$.subscribe((items) => {
  /* ... */
});

// ✅ AFTER
this.subscribe(
  this.userProfileService.loaded$.subscribe((items) => {
    /* ... */
  })
);
```

For HTTP calls (one-shot), use `.pipe(take(1))`:

```typescript
this.service.get(id).pipe(take(1)).subscribe({
  /* ... */
});
```

### Fix 4b: One-shot observables (dialogs, side panels) with `take(1)`

For observables that emit only once (`.afterClosed()` from MatDialog or CobaltSidePanelRef), `take(1)` automatically completes the observable after the first emission. **Do NOT wrap these in `this.subscribe()`** — the subscription is automatically cleaned up:

```typescript
// ❌ AVOID — unnecessary wrapping
this.subscribe(
  this.dialogRef.afterClosed().subscribe((result) => {
    /* ... */
  })
);

// ✅ CORRECT — take(1) handles cleanup automatically
this.dialogRef
  .afterClosed()
  .pipe(take(1))
  .subscribe((result) => {
    /* ... */
  });

// Also applies to CobaltSidePanelRef
sidePanelRef
  .afterClosed()
  .pipe(take(1))
  .subscribe((item) => {
    /* ... */
  });
```

### Fix 5: Clean up timers

**Always store timer references as class properties** to ensure they can be cleared in `onDestroy()`:

```typescript
// ❌ BEFORE — timer never cancelled
public nextBatch(_index: number) {
  if (end + buffer > this.batch * this.batchSize) {
    this.batch++;
    setTimeout(() => this.updateRenderedData(), 100);  // Lost reference
  }
}

// ✅ AFTER — timer stored and cleaned up
protected batchUpdateTimer: ReturnType<typeof setTimeout> | undefined;

public nextBatch(_index: number) {
  if (end + buffer > this.batch * this.batchSize) {
    this.batch++;
    this.batchUpdateTimer = setTimeout(() => this.updateRenderedData(), 100);
  }
}

protected override onDestroy(): void {
  if (this.batchUpdateTimer) {
    clearTimeout(this.batchUpdateTimer);
  }
  super.ngOnDestroy();
}
```

## Pattern Guide: When to use `this.subscribe()` vs `take(1)`

| Scenario                                             | Pattern                                                 | Reason                                                                         |
| ---------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **One-shot HTTP call**                               | `.pipe(take(1)).subscribe()`                            | `take(1)` auto-completes; subscription cleaned automatically on first emission |
| **Dialog/Side Panel close**                          | `.pipe(take(1)).subscribe()`                            | Same as HTTP — one emission, then done                                         |
| **Long-lived observable** (BehaviorSubject, Subject) | `this.subscribe()`                                      | Needs manual cleanup via BaseComponent                                         |
| **Continuous data stream**                           | `this.subscribe()` or `.pipe(takeUntil(this.destroy$))` | Persists across component lifecycle                                            |
| **Timer callbacks**                                  | Store ref, `clearTimeout` in `onDestroy()`              | Timer holds reference; must be explicitly cancelled                            |

**Key rule:** If the observable naturally completes (one emission), use `take(1)`. If the observable is infinite, use `this.subscribe()` (in BaseComponent) or `takeUntil(this.destroy$)` (standalone).

## Real-world examples from ProjectListComponent

### Example 1: Side panel with `take(1)`

```typescript
// ✅ CORRECT — one-shot observable
sidePanelRef
  .afterClosed()
  .pipe(take(1))
  .subscribe((itemOut) => {
    if (itemOut) {
      this.currentItem = { ...this.currentItem, ...itemOut };
      // Batch update logic
      this.items.data = [...this.items.data];
      this.updateProjectDetails(itemOut.projectId);
    }
  });
```

### Example 2: HTTP call wrapped in `this.subscribe()`

```typescript
// ✅ CORRECT — this.subscribe() ensures cleanup even if component destroyed before response
private updateProjectDetails(projectId: number): void {
  this.updatingSelectedProjectId = projectId;
  this.subscribe(
    this.projectApiService
      .getProject(projectId, false)
      .pipe(finalize(() => (this.updatingSelectedProjectId = null)))
      .pipe(take(1))
      .subscribe((item) => {
        if (item) {
          this.updateProject.emit(item);
          this.handleSuccess(`Project '${item.projectName}' updated`);
        }
      })
  );
}
```

### Example 3: Timer stored and cleaned up

```typescript
protected batchUpdateTimer: ReturnType<typeof setTimeout> | undefined;

public nextBatch(_index: number) {
  const buffer = 20;
  const range = this.viewport.getRenderedRange();
  const end = range.end;
  if (this.dataSource.allData && this.dataSource.allData.length > 0) {
    if (end + buffer > this.batch * this.batchSize) {
      this.batch++;
      this.batchUpdateTimer = setTimeout(() => this.updateRenderedData(), 100);
    }
  }
}

override ngOnDestroy(): void {
  if (this.batchUpdateTimer) {
    clearTimeout(this.batchUpdateTimer);
  }
  this.projectListService.currentSearchValue = '';
  super.ngOnDestroy();
}
```

## Step 4 — Verify the fix

2. Run the diagnostic workflow again (Step 1)
3. Confirm Growth = 0 for the previously leaking component
4. For event listeners: confirm `getEventListeners(document)` counts stay stable
5. Use Chrome **Performance Monitor** (DevTools → `⋮` → More tools) to verify:
   - **JS event listeners** count stays stable during navigation
   - **JS heap size** rises and falls normally with GC
   - **DOM Nodes** count stays stable

## Checklist

Before closing a memory leak fix:

- [ ] `report()` shows Growth = 0 after 3+ navigation cycles
- [ ] `history()` shows matching INIT/DESTROY pairs
- [ ] `getEventListeners(document)` counts stay stable
- [ ] No `override ngOnDestroy` without `super.ngOnDestroy()`
- [ ] No `document.addEventListener` with anonymous functions
- [ ] No `element.addEventListener` without matching `removeEventListener` in `onDestroy`
- [ ] All long-lived `.subscribe()` registered via `this.subscribe()`
- [ ] All `setTimeout`/`setInterval` cleaned up in `onDestroy()`
