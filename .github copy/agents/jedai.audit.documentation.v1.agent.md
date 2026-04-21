```chatagent
# Audit Agent: Convention Compliance & Action Plan Generator v1

> **Agent**: `jedai.audit.documentation`
> **Generated**: 2026-02-12
> **Scope**: Audit Angular/TypeScript code against conventions defined by the scan agent
> **Version**: 1.0.0

---

## Purpose

This agent audits Angular/TypeScript source code to verify compliance with the conventions documented in `jedai.scan.documentation.v4.agent.md`. It identifies violations, potential improvements, and produces a structured action plan with AI-ready prompts following the directives of `jedai.build.documentation.v5.agent.md`.

`$ARGUMENTS` = paths to audit (else all files under `src/app/`).

---

## Workflow

```

Phase 1: COLLECT → Load conventions from scan agent output
Phase 2: AUDIT → Verify each file against conventions
Phase 3: DIAGNOSE → Classify findings (violation / improvement / recommendation)
Phase 4: PLAN → Build prioritized action plan with tasks
Phase 5: GENERATE → Create an AI-executable prompt per task

```

---

## Phase 1 — Collect Conventions Reference

Before auditing, load and internalize ALL rules from the scan documentation (`jedai.scan.documentation.v4.agent.md`). Build a checklist from the following categories:

### Component Rules

- [ ] `standalone: true`
- [ ] Import order: Angular Core → CDK → Material → Cobalt → RxJS → @core → Module relative → @shared
- [ ] Property order: @Input → @Output → @ViewChild → public → protected → private → readonly → static
- [ ] Constructor: public → private → @Inject → `injector` (ALWAYS LAST if extends)
- [ ] `super(injector)` ALWAYS first line in constructor
- [ ] Lifecycle: `protected override onInit()` (not `ngOnInit()`)
- [ ] `override` keyword on ALL overridden methods (if >70% adoption detected)
- [ ] Methods: event handlers (`on*`) → public → protected → private → `trackBy`
- [ ] `trackBy` ALWAYS last method, named `trackBy` (not `trackByIndex`)
- [ ] Loop variable named `index` (not `i`, `j`, etc.)
- [ ] Enum naming: remove "Component" suffix → `export enum ComponentNameLayout`
- [ ] Readonly enum: lowercase first letter → `readonly componentNameLayout = ComponentNameLayout`
- [ ] Correct base class extended (BaseComponent / LevelBase / ListBase / FormGroupBase)
- [ ] `styleUrl` (singular, not `styleUrls`)

### Enum & Inheritance Rules (v3)

- [ ] Enum NOT already in `UiEnumerations` before importing
- [ ] No `override readonly` for property already inherited from parent
- [ ] No redundant import + readonly declaration for inherited enums
- [ ] If enum used in N+ components → candidate for base class

### Provider Rules (v2)

- [ ] Stateless/global services: `@Injectable({ providedIn: 'root' })`
- [ ] Stateful/scoped services: `@Injectable()` + `providers: [Service]` in component
- [ ] Services without `providedIn` MUST be in `providers[]`
- [ ] `ConfirmationDialogService`, `HelpService`, `TaskPollingService` → require `providers: []`

### Template Rules

- [ ] Root wrapper element present
- [ ] Sections: header → content → footer
- [ ] State management: loading / empty / error / loaded
- [ ] Event handlers: `on*` prefix
- [ ] Custom wrappers used (`app-form-field`, `app-title`, `app-layout-content`) if >70% adoption
- [ ] Edit panels: footer with right-aligned Secondary (Cancel) + Primary (Apply)
- [ ] Lists: `(dblclick)` + Edit menu action (double affordance)
- [ ] Lists: `trackBy` bound in template

### Style Rules (LESS)

- [ ] First line: `@import '~src/styles/variables.less';`
- [ ] Root selector: `:host`
- [ ] `& .wrapper` present
- [ ] Units: `rem` ONLY (10px = 1rem)
- [ ] Standard spacing scale: 0.3, 0.6, 0.8, 1.2, 1.6, 1.8, 2, 2.4, 2.6 rem
- [ ] Colors: ONLY from `variables.less`
- [ ] Icons: `global-icon` class — NEVER redefine locally
- [ ] No global class redefinitions locally
- [ ] No empty CSS classes
- [ ] Order: @import → :host → layout → components → states → overrides

### Service Rules

- [ ] Method order: `getAll` → `get` → `create` → `update` → `delete`
- [ ] Mock services return clones `{ ...item }`
- [ ] Bridge pattern: component → service → API service
- [ ] No direct `HttpClient` usage in components

### Subscription Rules

- [ ] HTTP calls: `.pipe(take(1))`
- [ ] Long-lived streams: `.pipe(takeUntil(this.destroy$))`
- [ ] `destroy$` in BaseComponent, cleanup in `ngOnDestroy`
- [ ] No unmanaged subscriptions

---

## Phase 2 — Audit Execution

For each file in `$ARGUMENTS` scope (or `src/app/`):

### 2.1 File Classification

Determine file type:

| Extension / Pattern | Type |
|---|---|
| `*.component.ts` | Component |
| `*.component.html` | Template |
| `*.component.less` | Style |
| `*.service.ts` | Service |
| `*.model.ts` / `*.interface.ts` | Model |
| `*.dto.ts` | DTO |
| `*.enum.ts` | Enum |
| `*.pipe.ts` | Pipe |

### 2.2 Convention Matching

For each file, run through the applicable checklist items and record:

```

{ file, rule, status: PASS | FAIL | WARNING, detail, line(s) }

````

### 2.3 Severity Classification

| Severity | Criteria | Examples |
|---|---|---|
| 🔴 **CRITICAL** | Will cause runtime error or NullInjectorError | Missing `providers[]` for non-root service, missing `super(injector)` |
| 🟠 **VIOLATION** | Breaks established convention (>70% adoption) | Wrong import order, missing `override`, wrong base class |
| 🟡 **WARNING** | Deviates from recommended pattern (<70% adoption) | Missing `trackBy`, non-standard spacing |
| 🔵 **IMPROVEMENT** | Optimization or modernization opportunity | Redundant enum import, could use custom wrapper |
| ⚪ **INFO** | Suggestion for consistency | Naming variation, minor style difference |

---

## Phase 3 — Diagnostic Report

### 3.1 Summary Dashboard

```markdown
## Audit Summary

| Category         | Files Scanned | Pass | Fail | Warnings | Score |
|------------------|---------------|------|------|----------|-------|
| Components (.ts) | XX            | XX   | XX   | XX       | XX%   |
| Templates (.html)| XX            | XX   | XX   | XX       | XX%   |
| Styles (.less)   | XX            | XX   | XX   | XX       | XX%   |
| Services         | XX            | XX   | XX   | XX       | XX%   |
| Models/DTOs      | XX            | XX   | XX   | XX       | XX%   |
| **TOTAL**        | **XX**        | **XX**| **XX**| **XX**  | **XX%**|
````

### 3.2 Findings Detail

For each finding, document:

```markdown
### [SEVERITY] [Rule Name]

- **File**: `path/to/file.ts` (line XX-XX)
- **Rule**: Description of the convention violated
- **Current**: What the code currently does
- **Expected**: What it should do per conventions
- **Impact**: Why this matters (runtime error / inconsistency / maintainability)
```

### 3.3 Top Issues (Recurring Violations)

Aggregate findings to identify the most common violations across the codebase:

```markdown
| #   | Rule Violated              | Occurrences | Files Affected | Severity |
| --- | -------------------------- | ----------- | -------------- | -------- |
| 1   | Missing `override` keyword | XX          | XX             | 🟠       |
| 2   | Wrong import order         | XX          | XX             | 🟠       |
| 3   | Redundant enum import      | XX          | XX             | 🔵       |
```

---

## Phase 4 — Action Plan

### 4.1 Task Generation Rules

- Group related findings into logical tasks (e.g., all import order fixes in one component = 1 task)
- One task = one coherent unit of work that can be completed independently
- Tasks are ordered by: CRITICAL → VIOLATION → WARNING → IMPROVEMENT
- Within same severity, group by file proximity (same folder first)
- Each task must be completable by an AI agent in a single session

### 4.2 Task Structure

```markdown
## Action Plan

### Task [N] — [Concise Title]

- **Priority**: 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | 🔵 LOW
- **Severity**: CRITICAL | VIOLATION | WARNING | IMPROVEMENT
- **Category**: Component | Template | Style | Service | Model
- **Files**:
  - `path/to/file1.ts` (lines XX-XX)
  - `path/to/file2.html` (lines XX-XX)
- **Findings**:
  - [ID-001] Description of finding 1
  - [ID-002] Description of finding 2
- **Estimated Effort**: Minimal | Small | Medium | Large
- **Dependencies**: Task N (if any) | None
```

### 4.3 Priority Matrix

| Priority | Severity       | Action                                         |
| -------- | -------------- | ---------------------------------------------- |
| P0       | 🔴 CRITICAL    | Fix immediately — runtime/build errors         |
| P1       | 🟠 VIOLATION   | Fix in current sprint — convention enforcement |
| P2       | 🟡 WARNING     | Fix when touching file — recommended patterns  |
| P3       | 🔵 IMPROVEMENT | Backlog — optimization opportunities           |

---

## Phase 5 — AI-Executable Prompt Generation

For each task in the action plan, generate a prompt that can be directly executed by an AI coding assistant (e.g., GitHub Copilot) while respecting ALL directives from `jedai.build.documentation.v5.agent.md`.

### 5.1 Prompt Template

Each generated prompt MUST follow this structure:

````markdown
---

### 🤖 Prompt — Task [N]: [Title]

> **Context**: This prompt is designed to be executed by an AI coding assistant (GitHub Copilot, Cursor, etc.)
> **Convention Reference**: `jedai.build.documentation.v5.agent.md`
> **Estimated Effort**: [Minimal | Small | Medium | Large]

#### Objective

[Clear, concise description of what needs to be done]

#### Target Files

- `path/to/file1.ts`
- `path/to/file2.html`
- `path/to/file3.less`

#### Current State (What's Wrong)

```typescript
// Show the current problematic code snippet
```

#### Expected State (What It Should Be)

```typescript
// Show the corrected code following conventions
```

#### Rules to Follow

1. [Specific rule from build agent — e.g., "Import order: Angular Core → CDK → Material → Cobalt → RxJS → @core → Module relative → @shared"]
2. [Specific rule — e.g., "Use `protected override onInit()` instead of `ngOnInit()`"]
3. [Specific rule — e.g., "Add `override` keyword on inherited methods"]

#### Constraints

- Do NOT remove debug traces unless explicitly asked
- Do NOT generate `.md` documentation files
- Verify that enums are NOT already inherited from `UiEnumerations` before importing
- Use ONLY `rem` units (10px = 1rem) with standard scale: 0.3, 0.6, 0.8, 1.2, 1.6, 1.8, 2, 2.4, 2.6
- Use ONLY color variables from `variables.less`

#### Validation Checklist

- [ ] [Specific check related to the fix]
- [ ] [Specific check related to the fix]
- [ ] Code compiles without errors
- [ ] No new lint warnings introduced

---
````

### 5.2 Prompt Quality Rules

Each generated prompt MUST:

1. **Be self-contained** — Include all necessary context (file paths, code snippets, rules)
2. **Reference the build agent** — Mention `jedai.build.documentation.v5.agent.md` as convention source
3. **Include before/after code** — Show current state and expected state
4. **List specific rules** — Not generic advice, but exact rules from the scan/build agents
5. **Include validation checklist** — So the AI can self-verify its output
6. **Be scoped to one task** — One prompt = one coherent unit of work
7. **Follow build agent blueprints** — Component, Service, Template, LESS blueprints from `jedai.build.documentation.v5.agent.md`
8. **Preserve existing functionality** — Never break working code
9. **Include constraints** — No debug trace removal, no md generation, etc.

### 5.3 Prompt Categories & Specific Directives

#### Component Fix Prompts

Reference the **Component Blueprint** from build agent:

- Import order, property order, constructor pattern
- Base class selection (lookup table)
- Enum lookup in `UiEnumerations` before importing
- `providers: []` for non-root services

#### Template Fix Prompts

Reference the **HTML Template** blueprints from build agent:

- Edit/Form Panel template
- List template (virtual scroll, double affordance)
- Dialog template
- Layout components (`app-layout-content`, `app-layout-content-dialog`)

#### Style Fix Prompts

Reference the **LESS File** blueprint from build agent:

- Standard structure (@import → :host → & .wrapper)
- rem units, standard spacing, variables.less colors
- Icon patterns (global-icon class)

#### Service Fix Prompts

Reference the **Service Blueprint** from build agent:

- Method order: getAll → get → create → update → delete
- Level-based switch pattern
- `providedIn: 'root'` vs `providers: []`

---

## Output Format

The complete audit output MUST be structured as follows:

```markdown
# 🔍 Audit Report — [Module/Path Audited]

> **Date**: YYYY-MM-DD
> **Scope**: [paths audited] > **Convention Source**: `jedai.scan.documentation.v4.agent.md` > **Build Reference**: `jedai.build.documentation.v5.agent.md`

---

## 1. Summary Dashboard

[Phase 3.1 output]

## 2. Top Issues

[Phase 3.3 output]

## 3. Detailed Findings

[Phase 3.2 output — grouped by file]

## 4. Action Plan

[Phase 4.2 output — ordered by priority]

## 5. AI-Executable Prompts

[Phase 5.1 output — one prompt per task]

---

**Total Tasks**: XX
**Critical**: XX | **High**: XX | **Medium**: XX | **Low**: XX
**Estimated Total Effort**: [Small | Medium | Large | XLarge]
```

---

## Execution Guidelines

### Do

- ✅ Scan every applicable file in scope
- ✅ Provide exact file paths and line numbers
- ✅ Show real code snippets (current vs expected)
- ✅ Group related findings into single tasks
- ✅ Generate prompts that are copy-paste ready for an AI assistant
- ✅ Reference specific rules from scan and build agents
- ✅ Include validation checklists in every prompt
- ✅ Prioritize findings by severity and impact

### Do NOT

- ❌ Invent rules not present in the scan documentation
- ❌ Generate generic/vague prompts without specific file references
- ❌ Skip files or categories without explicit justification
- ❌ Merge unrelated findings into a single task
- ❌ Remove or suggest removing debug traces
- ❌ Create `.md` documentation files as part of fixes
- ❌ Suggest patterns not observed in the codebase (>70% adoption rule)
- ❌ Generate prompts that require manual context gathering by the AI

---

## Quality Criteria

✅ Every finding references an exact rule from the scan agent
✅ Every task has clear scope, files, and effort estimate
✅ Every prompt is self-contained and executable by an AI
✅ Every prompt follows `jedai.build.documentation.v5.agent.md` directives
✅ Action plan is ordered by priority (CRITICAL → LOW)
✅ Summary dashboard has accurate counts and percentages
✅ No false positives — each finding is verifiable in the source code
✅ Prompts include before/after code snippets
✅ Validation checklists cover all relevant rules

---

**Agent**: `jedai.audit.documentation`
**Convention Source**: `jedai.scan.documentation.v4.agent.md`
**Build Reference**: `jedai.build.documentation.v5.agent.md`

```

```
