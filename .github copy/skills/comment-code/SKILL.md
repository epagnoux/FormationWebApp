---
name: comment-code
description: Add relevant inline comments to existing code in SentinelWebPortal. Use this when asked to comment code, add comments, annotate, or document inline logic. Comments are written in English, explain the WHY not the WHAT, and only target non-obvious or counter-intuitive lines.
---

# Comment Code — SentinelWebPortal

## Overview

The goal is to add **useful and targeted** comments to lines that need them. A useless comment is worse than no comment at all: it clutters the code and adds no value.

## Guiding principles

| Rule                                  | Explanation                                                                                  |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| Comment the **why**, not the **what** | The code already says _what_ it does. The comment explains _why_ that choice was made.       |
| English only                          | All comments must be written in English, in line with project conventions.                   |
| Do not comment the obvious            | `this.isPersisted = !this.isPersisted;` → no comment needed.                                 |
| Target risky areas                    | Counter-intuitive logic, hidden side effects, unexpected branches, critical operation order. |
| Be concise                            | One line per comment when possible. No essays.                                               |

## Step 1 — Read and understand the full code block

Before commenting, read **the entire** code block to understand the complete flow.

- Identify dependencies (called services, modified states, operation order)
- Spot blocks where the intent is not immediately clear

## Step 2 — Identify lines worth commenting

Criteria for a line to deserve a comment:

1. **Counter-intuitive logic** — The code does something surprising at first read.

   - Example: a value is cleared when persistence is _enabled_ (not when it is disabled).

2. **Non-obvious side effect** — An operation impacts an external state or dependency.

   - Example: `userProfileService.set(key, value)` saves to the persistent user profile, not just in-memory.

3. **Ambiguous conditional branch** — The `if/else` inverts what one would intuitively expect.

   - Example: the `if (isPersisted)` branch clears instead of saving.

4. **Critical operation order** — Two operations must happen in a specific order for a non-obvious reason.

   - Example: the state is toggled _before_ saving so the persisted value reflects the new state.

5. **Guard clause with hidden logic** — A preliminary check whose purpose is not immediately obvious.

## Step 3 — Do NOT comment

- Simple getters/setters
- Method calls with self-explanatory names (`this.focus()`, `this.emitTextChange()`)
- Readable direct assignments (`this.currentTextSearch = ''`)
- Standard `ngAfterViewInit`, `ngOnDestroy` blocks
- Anything that reads naturally in English without explanation

## Step 4 — Write the comments

Format based on context:

```typescript
// Single-line: short explanation for one line or a 2–3 line block
someCode();

// Longer context: what this branch handles when the intent is non-obvious
if (condition) {
  // reason why this specific action is taken here
  doSomething();
}
```

**Real examples from the project (`onPersistenceToggle` in search-input):**

```typescript
// Toggle the persistence state and persist it immediately
this.isPersisted = !this.isPersisted;
this.userProfileService.set(this.keyIsPersisted, this.isPersisted);

if (this.isPersisted) {
  // Persistence enabled: clear any previously stored search text to start fresh
  if (this.userProfileService.get(this.keyPersistence, null) !== null) {
    this.userProfileService.remove(this.keyPersistence);
  }
} else {
  // Persistence disabled: save the current search text one last time before stopping persistence
  this.userProfileService.set(this.keyPersistence, this.currentTextSearch);
}
```

## Step 5 — Review quality

Before submitting, re-read each added comment and ask:

- [ ] Does this comment explain the _why_ and not the _what_?
- [ ] Would this comment be useful to a developer unfamiliar with this code?
- [ ] Is it written in English?
- [ ] Is it concise (≤ 1–2 lines)?
- [ ] If this comment were removed, would the code be harder to understand? → If not, remove it.

## Final checklist

- [ ] Only non-obvious lines are commented
- [ ] No comment paraphrases the code
- [ ] All comments are in English
- [ ] The number of comments added is minimal and justified
