# Coding Conventions for SentinelWebPortal Project

Global rules and conventions. Detailed technology-specific rules are in focused skill files under `.github/instructions/` — they are automatically applied by Copilot based on the file type being edited.

## Skill Files (auto-applied)

| Skill                                 | Applied to                                               | Covers                                                                                     |
| ------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `component-structure.instructions.md` | `*.component.ts`, `*.component.html`, `*.component.less` | Component types, file layout, inheritance hierarchy                                        |
| `angular-typescript.instructions.md`  | `*.ts`                                                   | Component config, injection, lifecycle, enums, models, HTTP, subscriptions, error handling |
| `service-layer.instructions.md`       | `*.service.ts`                                           | Service layers, API bridge pattern, DTOs                                                   |
| `less-styles.instructions.md`         | `*.less`                                                 | LESS structure, variables, units, selectors                                                |
| `html-templates.instructions.md`      | `*.component.html`                                       | Cobalt components, layout patterns, binding rules                                          |

## Global Best Practices (apply everywhere)

- Always use standalone components (`standalone: true`)
- Prefer Cobalt Angular library components (`@cae/cobalt-angular`) over raw Material
- Follow the composition pattern for complex components
- Use dedicated services for state management — never `HttpClient` directly in components
- Follow established component naming patterns
- Leverage the inheritance hierarchy for common functionality
- Use `take(1)` for HTTP calls, `takeUntil(this.destroy$)` for long-lived streams
- Follow the service bridge pattern: Component → DomainService → ApiService
- Use DTOs for data exchange with APIs
- Avoid direct DOM manipulation — use Angular binding mechanisms
- Use reactive forms with proper validation
- **Do not remove debug traces unless explicitly asked**

## Routing and Navigation

Routes follow a predictable pattern:

```
/documentation/:level/:id/version/:versionId/...
```

Each level (project, circular, aircraft, baseline) has similar route structures for:

- Version management
- Test definition listing
- Test definition details
- Configuration screens

## Versioned Entity Pattern

1. **Inheritance:** Components extend `VersionedEntityLevelBase`
2. **Service Bridge:** Use the appropriate service — never call the API directly
3. **Version Management:** Follow the version lifecycle (draft, published, etc.)
4. **Subscriptions:** Use `take(1)` for HTTP calls inside versioned components

## Markdown Documentation

- Do not generate guides, summaries, or other documentation `.md` files.
