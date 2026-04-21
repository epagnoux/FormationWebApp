---
name: form-enter-keyboard
description: "Add Enter key submit support to Angular form components. Use when asked to make a form submittable via Enter key, add keyboard submit, or handle Enter keypress on forms."
---

# Form Enter Keyboard Submit

Add Enter key form submission to Angular components using the native `(ngSubmit)` mechanism.

## When to Use

- User asks to submit a form on Enter key press
- User asks for keyboard submit behavior on a form
- User asks to add Enter key support to a side panel or dialog form

## Procedure

### 1. Identify the form

Locate the `<form>` element in the component's HTML template. The form should already use `[formGroup]` with reactive forms.

### 2. Add `(ngSubmit)` to the form

Bind `(ngSubmit)` to the component's submit method on the `<form>` tag:

```html
<!-- BEFORE -->
<form [formGroup]="formGroup" novalidate>

<!-- AFTER -->
<form [formGroup]="formGroup" novalidate (ngSubmit)="onSubmit()">
```

### 3. Set button types

This is **critical** — without explicit `type` attributes, all buttons default to `type="submit"`, which causes unintended form submissions.

- **Submit button**: Add `type="submit"` and remove the `(click)` handler (ngSubmit handles it)
- **Cancel/Close buttons**: Add `type="button"` to prevent them from triggering the form submit

```html
<!-- BEFORE -->
<button cobaltButtonSecondary (click)="onClose()">Cancel</button>
<button cobaltButtonPrimary [disabled]="formGroup.invalid" (click)="onSubmit()">Apply</button>

<!-- AFTER -->
<button type="button" cobaltButtonSecondary (click)="onClose()">Cancel</button>
<button type="submit" cobaltButtonPrimary [disabled]="formGroup.invalid">Apply</button>
```

### 4. Ensure the submit method validates the form

The component's submit method must check `formGroup.invalid` before proceeding:

```typescript
onSubmit() {
  if (this.formGroup.invalid) {
    return;
  }
  // proceed with submit logic
}
```

## Important Notes

- **Do NOT create a custom directive** — Angular's native `(ngSubmit)` already handles Enter key submission on `<form>` elements.
- **Do NOT use `(keydown.enter)`** on individual inputs or on the form tag — `(ngSubmit)` is the standard Angular approach.
- **No extra imports needed** — `FormsModule` or `ReactiveFormsModule` (already present) provide `(ngSubmit)`.
- If the submit button is **outside** the `<form>` tag (e.g., in a footer), use the `form` attribute to link it: `<button type="submit" form="myFormId">` and add `id="myFormId"` to the form.

## Checklist

- [ ] `(ngSubmit)="onSubmit()"` added to the `<form>` tag
- [ ] Submit button has `type="submit"` and no `(click)` handler for submit
- [ ] All non-submit buttons have `type="button"`
- [ ] Submit method validates `formGroup.invalid` before proceeding
