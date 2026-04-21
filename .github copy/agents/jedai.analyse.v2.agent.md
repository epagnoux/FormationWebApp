# 📘 Prompt : Analyse Complète des Patterns et Bonnes Pratiques d'un Repository Angular/TypeScript

> **Version**: 4.0.0 - Includes all v2/v3 enhancements plus: custom wrappers detection, footer compliance, double affordance, service method order, and mock clone patterns.

## 🎯 Objectif

Analyse l'intégralité du repository pour identifier, extraire et documenter **tous les patterns, conventions et bonnes pratiques** utilisés dans le projet. Génère une documentation exhaustive qui servira de guide de référence pour les développeurs et agents IA travaillant sur ce codebase.

**Important** : Tous les patterns documentés doivent être **auto-détectés** à partir du code existant, pas imposés de l'extérieur. Si plusieurs patterns coexistent, documente-les tous et identifie le pattern dominant.

`$ARGUMENTS` = paths to scan (else all).

## 🔄 Post-Scan

After scan is complete, generate a new build agent based on the scan output.

Ask the user:

> "What name would you like to give to the generated build agent? (e.g., `documentation`, `sentinel`, `project`, etc.)"

Use this input to create a file named:

> `jedai.build.$USER_INPUT.agent.md`

Its purpose should be scoped to the patterns or use cases detected in the scan.

## 🎯 Scan Priorities

The agent should prioritize scanning the following folders:

If `$ARGUMENTS` includes a path list (e.g., `scan src/app/shared, src/app/modules/qtgx`), override the default folders.

## 📂 Périmètre d'Analyse

Examine **tous** les fichiers du projet dans les catégories suivantes :

### 1. Composants Angular (`.component.ts`, `.component.html`, `.component.less`)

- Structure des composants (standalone vs module-based)
- Hiérarchie d'héritage (base classes, abstract classes)
- Patterns d'organisation interne (ordre des propriétés, méthodes, lifecycle hooks)
- Types de composants (List, Edit, Dialog, View, Menu, Tab, Item, etc.)
- Naming conventions (fichiers, classes, sélecteurs)
- **[v2]** Détection du champ `providers` dans le décorateur `@Component` (services injectés au niveau composant vs `providedIn: 'root'`)
- **[v2]** Analyse de l'usage du mot-clé `override` pour les méthodes héritées des classes de base (obligatoire vs optionnel, % d'adoption)
- **[v2]** Analyse des modificateurs de visibilité sur les propriétés `readonly` (`public readonly` vs `protected readonly` vs `readonly` sans modificateur)
- **[v3]** Détection de la chaîne d'héritage des enums : analyser les classes de base détectées (classe racine d'enums, classe de base des composants, etc.) pour identifier TOUS les enums déjà exposés comme propriétés `readonly` via l'héritage
- **[v3]** Détection des imports et propriétés `readonly` redondants : un composant qui importe un enum et déclare `override readonly myEnum = MyEnum` alors que cette propriété est déjà héritée d'une classe parente dans la chaîne d'héritage
- **[v3]** Inventaire complet du registre d'enums de la classe racine détectée (ou équivalent) : chaque enum exposé, son nom de propriété, et la source d'import

### 2. Templates HTML (`.component.html`)

- Structure globale (wrapper, sections header/content/footer)
- Control flow (@if/@else/@switch vs *ngIf/*ngFor)
- Gestion des états (loading, empty, error, loaded)
- Composants de layout personnalisés (app-layout-\*, etc.)
- Composants de gestion d'état (composant custom de status détecté, mat-spinner, etc.)
- Formulaires (reactive vs template-driven, structure, validation)
- Tables (Material/CDK, structure des colonnes, virtual scrolling)
- Event handling (nommage, passage de paramètres)
- Accessibilité (ARIA, semantic HTML, tabindex)
- Intégration UI libraries (Material, CDK, Cobalt, PrimeNG, etc.)
- Tooltips, menus, modals, tabs
- **[v4]** Footer alignment dans les edit panels (actions alignées à droite, Secondary + Primary, Cancel + Save)
- **[v4]** Double affordance dans les listes : `(dblclick)` + action Edit dans le menu contextuel

### 3. Styles LESS/SCSS/CSS (`.component.less`, `.component.scss`, `.component.css`)

- Ordre des sections (imports → :host → layout → composants → états → overrides)
- Variables et tokens (fichiers centralisés, usage)
- Stratégie de nesting (profondeur max, usage de `&`)
- Conventions de nommage (classes, modifiers, states)
- Classes de cellules de tableaux (.name, .description, .actions, etc.)
- Unités (rem/px/em, conversions, facteur de conversion)
- Spacing scale (valeurs standard utilisées)
- Property order (layout, box-model, visual, typography)
- Patterns responsive (breakpoints, media queries, mobile-first vs desktop-first)
- Mixins et functions (liste complète)
- Component library overrides (::ng-deep, /deep/, scoping)
- Icon patterns (mask, background, SVG)
- **[v2]** Classes globales vs locales : identifier les classes définies dans les fichiers de styles globaux (`src/styles/` ou équivalent) vs les classes définies au niveau composant
- **[v2]** Détection des redéfinitions locales de classes globales (anti-pattern : un composant qui redéfinit localement une classe globale)
- **[v2]** Inventaire complet des classes globales réutilisables (noms, fichier source, usage détecté dans les templates)

### 4. Services (`.service.ts`)

- Architecture en couches (API services, business services, state services, view services)
- Naming conventions (`*-api.service.ts`, `*-view.service.ts`, `*.service.ts`)
- DTOs vs Models
- Patterns de communication (HttpClient, Observables)
- Injection dependencies
- Error handling
- Caching strategies
- Bridge pattern entre API et composants
- **[v2]** Patterns d'injection : `providedIn: 'root'` vs `providers: []` au niveau composant - analyser TOUS les `@Injectable()` pour détecter le pattern
- **[v2]** Lifecycle des services dans les composants standalone : singleton global vs instance par composant
- **[v2]** Détection des services stateful (avec état interne) qui nécessitent un `providers` au niveau composant pour éviter le partage d'état
- **[v2]** Détection des services utilisés uniquement dans un composant mais enregistrés en `providedIn: 'root'` (potentiel anti-pattern)

### 5. Models et Interfaces (`.model.ts`, `.interface.ts`, `.dto.ts`)

- Types de fichiers (interfaces, classes, DTOs, enums)
- Naming conventions
- Immutability patterns
- Type safety practices
- Usage de ! (non-null assertion)

### 5b. Enum Registry & Base Class Inheritance Chain

- **[v3]** Identifier la classe racine qui centralise les enums (si elle existe dans le projet)
- **[v3]** Scanner la chaîne d'héritage complète : classe racine d'enums → classe de base des composants → classes intermédiaires → composants concrets
- **[v3]** Lister TOUTES les propriétés `readonly` définies dans la classe racine (chaque enum exposé via `readonly propertyName = EnumType`)
- **[v3]** Pour chaque composant concret, vérifier qu'il n'importe PAS un enum déjà disponible via héritage
- **[v3]** Détecter les `override readonly` qui sont inutiles (l'enum est identique à celui du parent)
- **[v3]** Identifier les enums qui DEVRAIENT être ajoutés à la classe racine d'enums plutôt que déclarés localement dans chaque composant

### 6. Subscription Management

- Patterns de cleanup (take(1), takeUntil, async pipe)
- Usage de Subject/BehaviorSubject/ReplaySubject
- Unsubscribe strategies
- Base classes avec destroy$ Subject

### 7. State Management (si applicable)

- Store pattern (NgRx, Akita, custom)
- Actions, reducers, selectors
- Effects et side effects

### 8. Routing et Navigation

- Route structure et hiérarchie
- Guards (CanActivate, CanDeactivate)
- Resolvers
- Lazy loading
- Route parameters patterns

### 9. Organisation du Projet

- Structure des dossiers (feature-based vs type-based)
- Modules vs standalone components
- Shared vs core vs feature modules
- Barrel exports (index.ts)
- Co-location (services, models avec features)

### 10. TypeScript Conventions

- Import organization (ordre, grouping)
- Enum vs const vs type
- Decorators patterns (@Input, @Output, @ViewChild, @Inject)
- Access modifiers (public, private, protected)
- Constructor patterns
- Lifecycle hooks order
- Method ordering (event handlers, public, protected, private, utility)

### 11. Error Handling et Logging

- Global error handler
- HTTP interceptors
- Error notification patterns
- Logging services
- User notification components/services

### 12. Testing (si présent)

- Unit tests structure
- Integration tests
- Test utilities et helpers
- Mocking patterns

### 13. Build et Configuration

- Environment files structure
- Build configurations
- Linting rules (.eslintrc, tslint.json)
- Style linting (stylelint)

### 14. Patterns v4 spécifiques

- **[v4]** Custom Wrappers (formulaires) : détecter les composants wrapper personnalisés remplaçant `mat-form-field`. % d'adoption. Liste des `@Input`.
- **[v4]** Custom Titles : détecter les composants personnalisés remplaçant `<h1-h6>`. % d'adoption.
- **[v4]** Footer pattern (edit panels) : actions alignées à droite, bouton Secondary + Primary, Cancel + Save.
- **[v4]** Double Affordance (listes) : `(dblclick)` + action Edit dans le menu. % de conformité.
- **[v4]** Service Method Order : `getAll → get → create → update → delete`. % de conformité.
- **[v4]** Mock clone pattern : les mocks retournent des clones `{ ...item }` et non des références directes.

## 📋 Méthodologie d'Analyse

Pour chaque catégorie, effectue les étapes suivantes :

### Étape 1 : Recherche Initiale

- Identifie tous les fichiers pertinents dans le repository
- Sélectionne un échantillon représentatif (20-50 fichiers par catégorie)
- Privilégie les fichiers dans `/src/app/` et les dossiers `shared`, `core`, `modules`

### Étape 2 : Extraction des Patterns

Pour chaque fichier analysé :

- Note l'**ordre exact** des éléments (imports, propriétés, méthodes, etc.)
- Identifie les **naming patterns** récurrents
- Extrait les **structures communes** (wrapper pattern, layout pattern, etc.)
- Repère les **variables/tokens centralisés** (si présents)
- Détecte les **conventions implicites** (spacing, indentation, organization)

### Étape 3 : Consolidation

- Compare les patterns trouvés entre fichiers
- Identifie le pattern **dominant** (utilisé dans >70% des cas)
- Note les **variations** (patterns alternatifs utilisés dans <30% des cas)
- Détecte les **anti-patterns** (code déprécié, legacy)

### Étape 4 : Validation

- Vérifie la cohérence des patterns identifiés
- Cherche les fichiers de configuration qui confirment les conventions (tsconfig, eslint, stylelint)
- Identifie les base classes / utilities qui renforcent les patterns

## 📝 Format Attendu de la Documentation

Génère un document Markdown structuré **exactement** comme suit :

```markdown
# [Nom du Projet] - Frontend Rules & Conventions

> **Auto-generated documentation** - Extracted from project analysis on [DATE]
>
> This document contains the standards, patterns, and conventions detected in the [PROJECT_NAME] codebase. It serves as a comprehensive guide for AI agents and developers working on UI components.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Component Organization Patterns](#component-organization-patterns)
5. [Component Internal Organization](#component-internal-organization)
6. [Component Patterns](#component-patterns)
7. [Template Internal Organization](#template-internal-organization)
8. [Component Inheritance Hierarchy](#component-inheritance-hierarchy)
9. [Service Layer Architecture](#service-layer-architecture)
10. [Styling Conventions](#styling-conventions)
11. [Styles Internal Organization](#styles-internal-organization)
12. [TypeScript Conventions](#typescript-conventions)
13. [Template Conventions](#template-conventions)
14. [Naming Conventions](#naming-conventions)
15. [Data Management](#data-management)
16. [Subscription Management](#subscription-management)
17. [Error Handling](#error-handling)
18. [Layout Components](#layout-components)
19. [Mandatory Rules](#mandatory-rules)
20. [Forbidden Practices](#forbidden-practices)
21. [Workflow](#workflow)
22. [Validation Checklist](#validation-checklist)

---

## Project Overview

[Brève description du projet déduite de package.json, README.md]

**Generated**: [DATE]  
**Source**: [PROJECT_NAME] Repository Analysis  
**Version**: 4.0.0

**Key Information**:

- **Framework**: Angular [VERSION détectée depuis package.json]
- **Language**: TypeScript [VERSION]
- **UI Library**: [Material/Cobalt/Bootstrap/PrimeNG/None détecté]
- **State Management**: [NgRx/Akita/Custom/None détecté]
- **Styling**: [LESS/SCSS/CSS détecté]
- **Component Architecture**: [Standalone/Module-based/Hybrid détecté]

---

## Technology Stack

### Core Dependencies

Liste complète extraite de package.json :

- `@angular/core`: [VERSION]
- `@angular/common`: [VERSION]
- `@angular/forms`: [VERSION]
- `@angular/router`: [VERSION]
- `rxjs`: [VERSION]
- `typescript`: [VERSION]
- [Toutes autres dépendances Angular]

### UI Components

- [Material]: `@angular/material` [VERSION] (si détecté)
- [CDK]: `@angular/cdk` [VERSION] (si détecté)
- [PrimeNG]: `primeng` [VERSION] (si détecté)
- [Autres libraries UI détectées dans package.json]

### State & Data Management

- [NgRx]: `@ngrx/store` [VERSION] (si détecté)
- [Akita]: `@datorama/akita` [VERSION] (si détecté)
- [Autres libraries state management]

### Development Tools

- [Linter]: `eslint`/`tslint` [VERSION]
- [Style Linter]: `stylelint` [VERSION] (si détecté)
- [Testing]: `jasmine`/`jest` [VERSION] (si détecté)
- [Autres dev tools]

---

## Architecture

[Description de l'architecture détectée basée sur l'analyse des dossiers]

### Project Structure
```

src/
├── app/
│ ├── core/ # [Description basée sur analyse du contenu]
│ │ ├── api/ # [Si détecté : API services, DTOs]
│ │ ├── guards/ # [Si détecté : Route guards]
│ │ ├── interceptors/ # [Si détecté : HTTP interceptors]
│ │ ├── services/ # [Si détecté : Core services singleton]
│ │ └── [autres dossiers]
│ ├── shared/ # [Description basée sur analyse]
│ │ ├── components/ # [Si détecté : Composants partagés]
│ │ ├── directives/ # [Si détecté : Directives réutilisables]
│ │ ├── pipes/ # [Si détecté : Pipes personnalisés]
│ │ ├── models/ # [Si détecté : Models/interfaces partagés]
│ │ ├── services/ # [Si détecté : Services utilitaires]
│ │ └── [autres dossiers]
│ ├── modules/ # [Si organisation feature-based]
│ │ ├── [feature1]/
│ │ ├── [feature2]/
│ │ └── [...]
│ ├── [autres dossiers racine détectés]
│ ├── app-routing.module.ts # [Si module-based]
│ ├── app.component.ts
│ └── app.module.ts # [Si module-based]
├── assets/
│ ├── images/ # [Si détecté]
│ ├── fonts/ # [Si détecté]
│ ├── i18n/ # [Si internationalization détectée]
│ └── [autres dossiers assets]
├── environments/
│ ├── environment.ts
│ ├── environment.prod.ts
│ └── [autres environnements]
└── styles/
├── variables.less # [Ou .scss, si détecté]
├── mixins.less # [Si détecté]
├── themes.less # [Si détecté]
└── [autres fichiers styles globaux]

```

**Organization Strategy**: [Feature-based / Type-based / Hybrid détecté]

**Key Principles Detected**:

1. **[Principe 1]**: [Description basée sur structure observée]
2. **[Principe 2]**: [...]
3. **Feature Co-location**: [Oui/Non - services et models avec features]
4. **Standalone Components**: [Oui/Non/Partiel - pourcentage détecté]
5. **Barrel Exports**: [Oui/Non - usage de index.ts détecté]

---

## Component Organization Patterns

[Analyse de tous les types de composants détectés dans le projet]

### Detected Component Types

[Pour CHAQUE type détecté, créer une section complète]

#### 1. List Components (`*-list`)

**Folder Structure**:

```

component-name-list/
├── component-name-list.component.ts
├── component-name-list.component.html
├── component-name-list.component.less
├── filters/ # [Optionnel - si détecté]
│ ├── component-name-filters.service.ts
│ └── component-name-filter.model.ts
└── component-name-item/ # [Optionnel - si détecté]
├── component-name-item.component.ts
├── component-name-item.component.html
└── component-name-item.component.less

````

**Typical Implementations**:

- [Feature 1 détectée dans les list components]
- [Feature 2 détectée]
- [Virtual scrolling : Oui/Non]
- [Data fetching : Pattern détecté]
- [Sorting : Pattern détecté]
- [Filtering : Pattern détecté]
- [Selection handling : Pattern détecté]

**Examples from codebase**:
- `[path/to/example1-list]`
- `[path/to/example2-list]`

**Inheritance Pattern**:
- Base class: `[NomBaseClass si détectée]` extends `[ParentClass]`
- Example: `export class [EntityName]ListComponent extends [DetectedListBase]`

**Common Patterns**:

```typescript
// [Exemple réel extrait d'un list component du projet]
export class ExampleListComponent extends [BaseClass] {
  // [Structure typique détectée]
}
````

---

#### 2. Edit/Form Components (`*-edit`, `*-form`)

**Folder Structure**:

```
component-name-edit/
├── component-name-edit.component.ts
├── component-name-edit.component.html
└── component-name-edit.component.less
```

**Typical Implementations**:

- [Receiving data pattern : Injection détecté (MAT_DIALOG_DATA, SIDE_PANEL_DATA, @Input)]
- [Returning data pattern : close() method, eventEmitter]
- [Form type : Reactive/Template-driven détecté]
- [Validation pattern détecté]
- [Save/cancel actions pattern]

**Examples from codebase**:

- `[path/to/example1-edit]`

**Inheritance Pattern**:

- Base class: `[NomBaseClass]` extends `[ParentClass]`

---

#### 3. Dialog Components (`*-dialog`)

**Folder Structure**:

```
component-name-dialog/
├── component-name-dialog.component.ts
├── component-name-dialog.component.html
└── component-name-dialog.component.less
```

**Typical Implementations**:

- [Receiving data : MAT_DIALOG_DATA / Custom injection détecté]
- [Dialog service : MatDialog / Custom service détecté]
- [Return pattern : MatDialogRef.close() / EventEmitter]
- [Dialog type : Confirmation / Form / Info / Custom]

**Examples from codebase**:

- `[path/to/example1-dialog]`

---

#### 4. View Components (`*-view`, `*-details`)

**Folder Structure**:

```
component-name-view/
├── component-name-view.component.ts
├── component-name-view.component.html
└── component-name-view.component.less
```

**Typical Implementations**:

- [Coordinating pattern : Parent-child communication]
- [Routing : ActivatedRoute usage détecté]
- [State management : Local/Service/Store détecté]
- [Permission checks : Pattern détecté]
- [Layout : Structure détectée]

**Examples from codebase**:

- `[path/to/example1-view]`

---

#### 5. Tab Components (`*-tabs`, `*-tab-group`)

**Folder Structure**:

```
component-name-tabs/
├── component-name-tabs.component.ts
├── component-name-tabs.component.html
└── component-name-tabs.component.less
```

**Typical Implementations**:

- [Tab library : MatTabsModule / [detected-tab-module] / Custom]
- [Tab selection pattern détecté]
- [Lazy loading : Oui/Non]
- [State persistence : Oui/Non]
- [Tab extension components : [detected-tab-extension] / Custom / None détecté]

**Tab Extension Pattern** (si détecté):

```html
<!-- [Exemple réel du projet] -->
<[tab-group-component]>
  <[tab-component] *ngFor="let item of items">
    <ng-template [tabLabel]>
      <[detected-tab-extension]
        [label]="item.label"
        [badgeValue]="item.badgeValue"
        [badgeState]="item.badgeState"
      ></[detected-tab-extension]>
    </ng-template>
  </[tab-component]>
</[tab-group-component]>
```

**Examples from codebase**:

- `[path/to/example1-tabs]`

---

#### 6. Menu Components (`*-menu`)

**Folder Structure**:

```
component-name-menu/
├── component-name-menu.component.ts
├── component-name-menu.component.html
└── component-name-menu.component.less
```

**Typical Implementations**:

- [Menu library : MatMenuModule / [detected-menu-module] / Custom]
- [Trigger pattern détecté]
- [Actions pattern : EventEmitter / Direct calls]
- [Permissions : Gestion détectée]

**Examples from codebase**:

- `[path/to/example1-menu]`

---

#### 7. Item Components (`*-item`)

**Folder Structure**:

```
component-name-item/
├── component-name-item.component.ts
├── component-name-item.component.html
└── component-name-item.component.less
```

**Typical Implementations**:

- [Data input : @Input pattern]
- [Selection : Pattern détecté]
- [Actions : EventEmitter pattern]

**Examples from codebase**:

- `[path/to/example1-item]`

---

[Ajoute d'AUTRES types de composants détectés : Card, Panel, Sidebar, Header, Footer, etc.]

---

## Component Internal Organization

[Section MAJEURE - Ordre exact des éléments dans .component.ts]

Après analyse de **[NOMBRE]** composants, voici l'ordre standard détecté :

### Internal Structure Order (TypeScript)

```typescript
// ==============================================================================
// 1. IMPORTS
// ==============================================================================

// 1.1. Angular Core Imports
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 1.2. Angular Material/CDK Imports (si utilisé)
import { MatTableModule } from '@angular/material/table';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

// 1.3. Third-Party Library Imports (UI libraries)
import { [Library] } from '[package]';

// 1.4. RxJS Imports
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { take, takeUntil, map, filter } from 'rxjs/operators';

// 1.5. Project Imports - Services
import { [ServiceName] } from '[path]';

// 1.6. Project Imports - Models/DTOs/Interfaces
import { [ModelName] } from '[path]';

// 1.7. Project Imports - Components
import { [ComponentName] } from '[path]';

// ==============================================================================
// 2. PRE-COMPONENT DECLARATIONS
// ==============================================================================

// 2.1. Enums (utilisés dans le template ou la classe)
export enum [EnumName] {
  [Value1] = 'value1',
  [Value2] = 'value2'
}

// 2.2. Interfaces (locales au fichier)
interface [InterfaceName] {
  [property]: [type];
}

// 2.3. Types
type [TypeName] = [definition];

// 2.4. Constants
const [CONSTANT_NAME] = [value];

// ==============================================================================
// 3. @COMPONENT DECORATOR
// ==============================================================================

@Component({
  selector: '[app-component-name]',                    // [Pattern détecté]
  standalone: [true/false],                             // [Détecté]
  imports: [                                            // [Si standalone]
    CommonModule,
    // [Autres imports détectés]
  ],
  templateUrl: './[component-name].component.html',
  styleUrl: './[component-name].component.[less/scss/css]'  // [styleUrl vs styleUrls détecté]
})

// ==============================================================================
// 4. EXPORT CLASS
// ==============================================================================

export class [ComponentName]Component extends [BaseClass] implements [OnInit, OnDestroy, etc.] {

  // ============================================================================
  // 5. @INPUT() PROPERTIES
  // ============================================================================

  // 5.1. Simple @Input()
  @Input() [simpleInput]!: [type];
  @Input() [optionalInput]?: [type];

  // 5.2. @Input() with setter/getter
  private _[privateProperty]!: [type];
  @Input()
  set [inputWithSetter](value: [type]) {
    this._[privateProperty] = value;
    // [Logic]
  }
  get [inputWithSetter](): [type] {
    return this._[privateProperty];
  }

  // ============================================================================
  // 6. @OUTPUT() PROPERTIES
  // ============================================================================

  @Output() [eventName] = new EventEmitter<[type]>();
  @Output() [anotherEvent] = new EventEmitter<void>();

  // ============================================================================
  // 7. @VIEWCHILD / @VIEWCHILDREN / @CONTENTCHILD / @CONTENTCHILDREN
  // ============================================================================

  @ViewChild([ComponentType]) [viewChild]!: [ComponentType];
  @ViewChildren([ComponentType]) [viewChildren]!: QueryList<[ComponentType]>;
  @ContentChild([ComponentType]) [contentChild]!: [ComponentType];

  // ============================================================================
  // 8. PUBLIC PROPERTIES
  // ============================================================================

  // 8.1. Component state
  [dataProperty]: [type][] = [];
  [isLoading] = false;
  [selectedItem]: [type] | null = null;

  // 8.2. Form properties (si reactive forms)
  [formGroup]!: FormGroup;

  // 8.3. Observable properties
  [data$]!: Observable<[type]>;

  // ============================================================================
  // 9. PROTECTED PROPERTIES
  // ============================================================================

  protected [protectedProperty]: [type];
  protected [destroy$] = new Subject<void>();         // [Pattern détecté pour cleanup]

  // ============================================================================
  // 10. PRIVATE PROPERTIES
  // ============================================================================

  private [privateProperty]: [type];

  // ============================================================================
  // 11. READONLY PROPERTIES (enums/constants pour template)
  // ============================================================================

  readonly [enumForTemplate] = [EnumName];
  readonly [constantForTemplate] = [CONSTANT];

  // ============================================================================
  // 12. STATIC PROPERTIES
  // ============================================================================

  static [staticProperty]: [type];

  // ============================================================================
  // 13. CONSTRUCTOR
  // ============================================================================

  constructor(
    // [Ordre détecté : public → private → @Inject → injector en dernier]
    public [publicService]: [ServiceType],
    private [privateService]: [ServiceType],
    @Inject([TOKEN]) private [injectedValue]: [type],
    [injector]: Injector                              // [Si extends une classe de base détectée]
  ) {
    super([injector]);                                // [Si extends, toujours première ligne]
    // [Initialization logic si nécessaire]
  }

  // ============================================================================
  // 14. LIFECYCLE HOOKS (Angular execution order)
  // ============================================================================

  // 14.1. ngOnChanges (si implements OnChanges)
  ngOnChanges(changes: SimpleChanges): void {
    // [Pattern détecté pour réagir aux changements d'@Input]
    if (changes['[inputName]']) {
      // [Logic]
    }
  }

  // 14.2. ngOnInit
  ngOnInit(): void {
    // [Ou protected override onInit() si extends une classe de base détectée]
    // [Initialization logic]
  }

  // 14.3. ngDoCheck
  // 14.4. ngAfterContentInit
  // 14.5. ngAfterContentChecked
  // 14.6. ngAfterViewInit
  ngAfterViewInit(): void {
    // [ViewChild initialization]
  }

  // 14.7. ngAfterViewChecked
  // 14.8. ngOnDestroy
  ngOnDestroy(): void {
    // [Ou protected override onDestroy() si extends une classe de base détectée]
    this.[destroy$].next();
    this.[destroy$].complete();
  }

  // ============================================================================
  // 15. PUBLIC METHODS
  // ============================================================================

  // 15.1. Event handlers (toujours préfixés 'on')
  on[EventName]([params]): void {
    // [Handler logic]
  }

  on[AnotherEvent]($event: [EventType], [otherParams]): void {
    // [Handler logic]
  }

  // 15.2. Public API methods
  [publicMethod]([params]): [returnType] {
    // [Method logic]
  }

  // ============================================================================
  // 16. PROTECTED METHODS
  // ============================================================================

  protected [protectedMethod]([params]): [returnType] {
    // [Method logic]
  }

  // ============================================================================
  // 17. PRIVATE METHODS
  // ============================================================================

  private [privateHelper]([params]): [returnType] {
    // [Helper logic]
  }

  private [anotherPrivateMethod](): void {
    // [Logic]
  }

  // ============================================================================
  // 18. UTILITY METHODS (trackBy, compare, etc.)
  // ============================================================================

  // 18.1. trackBy function (TOUJOURS nommée 'trackBy' + pas 'trackByIndex')
  trackBy([index]: number, [item]: [type]): [keyType] {
    return [item].[uniqueKey];
  }

  // 18.2. Compare functions (pour select, etc.)
  compare[Entity]([a]: [type], [b]: [type]): boolean {
    return [a] && [b] && [a].[id] === [b].[id];
  }
}
```

### Règles Détectées pour l'Organisation Interne

#### Imports Order

**Groupes détectés** (dans cet ordre) :

1. ✅ Angular core (@angular/core, @angular/common, @angular/forms, @angular/router)
2. ✅ Angular Material/CDK (si utilisé)
3. ✅ Third-party UI libraries (Cobalt, PrimeNG, etc.)
4. ✅ RxJS
5. ✅ Project services
6. ✅ Project models/DTOs/interfaces
7. ✅ Project components

**Spacing** : [Ligne vide entre groupes : Oui/Non détecté]

---

#### Properties Order

**Ordre strict détecté** :

1. ✅ @Input() (simples puis avec setters)
2. ✅ @Output()
3. ✅ @ViewChild/@ViewChildren/@ContentChild/@ContentChildren
4. ✅ Public properties
5. ✅ Protected properties
6. ✅ Private properties
7. ✅ readonly (enums/constants pour template)
8. ✅ static

**Access modifiers détectés** :

- Default (no modifier) = [public/private selon contexte détecté]
- Explicit public : [Oui/Non - % d'usage]
- Protected : [Oui/Non - % d'usage]
- Private : [Oui/Non - % d'usage]

---

#### Constructor Pattern

**Injection order détecté** :

1. ✅ public dependencies
2. ✅ private dependencies
3. ✅ @Inject() dependencies
4. ✅ Injector (toujours en dernier si extends une classe de base détectée)

**super() call** : [Toujours première ligne si extends : Oui/Non]

---

#### Lifecycle Hooks Order

**Hooks détectés dans le projet** :

- ngOnChanges : [Oui/Non - fréquence %]
- ngOnInit : [Oui/Non - fréquence %]
- ngAfterViewInit : [Oui/Non - fréquence %]
- ngOnDestroy : [Oui/Non - fréquence %]

**Override pattern** (si classe de base détectée) :

```typescript
protected override onInit(): void { }
protected override onDestroy(): void { }
```

---

#### Methods Order

**Ordre détecté** :

1. ✅ Public methods (event handlers en premier)
2. ✅ Protected methods
3. ✅ Private methods
4. ✅ Utility methods (trackBy, compare) toujours en dernier

**Event handler naming** : [Pattern détecté : on + EventName]

---

### Examples from Codebase

[Inclure 2-3 exemples complets de composants réels]

---

## Template Internal Organization

[Section MAJEURE - Structure HTML standard]

Après analyse de **[NOMBRE]** templates, voici la structure standard détectée :

### Template Structure Order

```html
<!-- ===========================================================================
     1. ROOT WRAPPER ELEMENT
     =========================================================================== -->

<[div/ng-container/custom-component] class="wrapper" [ngClass]="{ '[state-class]': [condition] }">

  <!-- =========================================================================
       2. HEADER / TOOLBAR (if applicable)
       ========================================================================= -->

  <div class="header" [header]>                    <!-- [Attribute projections détectées] -->
    <[detected-title-component]>[title]</[detected-title-component]>                 <!-- [Components standards détectés] -->

    <div class="toolbar">
      <div class="filters">
        <!-- [Filter components/inputs détectés] -->
      </div>

      <div class="actions">
        <button [[detected-primary-button-directive]] (click)="on[Action]()">
          <div class="[detected-icon-class] [icon-class]"></div>  <!-- [Icon pattern détecté] -->
          [Action Label]
        </button>
      </div>
    </div>
  </div>

  <!-- =========================================================================
       3. MAIN CONTENT AREA
       ========================================================================= -->

  <div class="content" [content]>                  <!-- [Attribute projections] -->

    <!-- =======================================================================
         3.1. STATE MANAGEMENT (Loading / Empty / Error)
         ======================================================================= -->

    <!-- PATTERN DÉTECTÉ : [custom-state-component / @if-else / *ngIf / Custom] -->

    <!-- Option A: Custom component (si détecté) -->
    <[detected-state-component]
      [state]="[isLoading] ? [stateEnum].Loading : [stateEnum].Loaded">
      <div loaded>
        <!-- Content when loaded -->
      </div>
      <div noData>
        <!-- Empty state -->
      </div>
      <div error>
        <!-- Error state -->
      </div>
    </[detected-state-component]>

    <!-- Option B: @if/@else chain (Angular 17+) (si détecté) -->
    @if ([isLoading]) {
      <[loading-component]></[loading-component]>
    } @else if ([hasError]) {
      <div class="error-state">
        <span class="error-message">{{ [errorMessage] }}</span>
        <button [[detected-secondary-button-directive]] (click)="on[Retry]()">Retry</button>
      </div>
    } @else if ([items].length === 0) {
      <div class="empty-state">
        <span>[Empty message]</span>
        <button [[detected-primary-button-directive]] (click)="on[Create]()">Create New</button>
      </div>
    } @else {
      <!-- Actual content -->
    }

    <!-- Option C: *ngIf legacy (si détecté) -->
    <div class="loading-state" *ngIf="[isLoading]">
      <!-- Loading UI -->
    </div>
    <div class="error-state" *ngIf="[hasError] && ![isLoading]">
      <!-- Error UI -->
    </div>
    <div class="empty-state" *ngIf="[items].length === 0 && ![isLoading] && ![hasError]">
      <!-- Empty UI -->
    </div>
    <div class="data-content" *ngIf="[items].length > 0 && ![isLoading] && ![hasError]">
      <!-- Content UI -->
    </div>

    <!-- =======================================================================
         3.2. ACTUAL CONTENT (when data is loaded)
         ======================================================================= -->

    <!-- TABLE PATTERN (si détecté) -->
    <mat-table [dataSource]="[dataSource]" matSort>

      <!-- Column definitions -->
      <ng-container matColumnDef="[columnName]">
        <mat-header-cell *matHeaderCellDef mat-sort-header scope="col">
          [Column Header]
        </mat-header-cell>
        <mat-cell *matCellDef="let [item]">
          {{ [item].[property] }}
        </mat-cell>
      </ng-container>

      <!-- [Autres colonnes...] -->

      <!-- Actions column (sticky end pattern si détecté) -->
      <ng-container matColumnDef="actions" stickyEnd>
        <mat-header-cell *matHeaderCellDef scope="col"></mat-header-cell>
        <mat-cell *matCellDef="let [item]">
          <div class="actions">
            <button [[detected-ghost-button-directive]] [matMenuTriggerFor]="menu">
              <div class="[detected-icon-class] [detected-action-menu-class]"></div>
            </button>

            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="on[Edit]([item])">
                <div class="[detected-icon-class] [detected-icon-edit-class]"></div>
                Edit
              </button>
              <button mat-menu-item (click)="on[Delete]([item])">
                <div class="[detected-icon-class] [detected-icon-delete-class]"></div>
                Delete
              </button>
            </mat-menu>
          </div>
        </mat-cell>
      </ng-container>

      <!-- Header and row definitions -->
      <mat-header-row *matHeaderRowDef="[displayedColumns]; sticky: true"></mat-header-row>
      <mat-row
        *matRowDef="let [row]; columns: [displayedColumns]"
        [class.selected]="[row].[id] === [selectedId]"
        (click)="on[RowClick]([row])"
      ></mat-row>

    </mat-table>

    <!-- FORM PATTERN (si détecté) -->
    <form [formGroup]="[myFormGroup]" (ngSubmit)="on[Submit]()" novalidate>

      <div class="form-field-group">

        <!-- Custom form field wrapper (si détecté) -->
        <[detected-form-field-wrapper] label="[Label]" [isFirst]="true" [required]="true">
          <ng-container content>
            <input matInput formControlName="[fieldName]" autocomplete="off" />
          </ng-container>
        </[detected-form-field-wrapper]>

        <!-- Material form field (si détecté) -->
        <mat-form-field>
          <mat-label>[Label]</mat-label>
          <input matInput formControlName="[fieldName]" type="[type]" />
          <mat-error *ngIf="[myFormGroup].get('[fieldName]')?.hasError('required')">
            [Error message]
          </mat-error>
        </mat-form-field>

      </div>

      <div class="form-actions">
        <button type="button" [[detected-secondary-button-directive]] (click)="on[Cancel]()">
          Cancel
        </button>
        <button
          type="submit"
          [[detected-primary-button-directive]]
          [disabled]="[myFormGroup].invalid || [isSubmitting]"
        >
          Submit
        </button>
      </div>

    </form>

    <!-- TABS PATTERN (si détecté) -->
    <[tab-group-component]
      [selectedIndex]="[currentTabIndex]"
      (selectedTabChange)="on[TabsSelectionChange]($event)"
    >
      <[tab-component] *ngFor="let [item] of [items]; let [index] = index">
        <ng-template [tabLabel]>
          <!-- Simple label ou tab extension component -->
          <[detected-tab-extension]
            [label]="[item].label"
            [tabIndex]="[index]"
            [badgeValue]="[item].badgeValue"
            [badgeState]="[item].badgeState"
          ></[detected-tab-extension]>
        </ng-template>

        <!-- Tab content -->
        <div class="tab-content">
          <!-- [Content] -->
        </div>
      </[tab-component]>
    </[tab-group-component]>

  </div>

  <!-- =========================================================================
       4. FOOTER / ACTIONS (if applicable)
       ========================================================================= -->

  <div class="actions" [footer]>                   <!-- [Attribute projections] -->
    <div class="start">
      <!-- Left-aligned content -->
      <span class="info">[Info text]</span>
    </div>

    <div class="end">
      <!-- Right-aligned actions -->
      <button [[detected-secondary-button-directive]] (click)="on[Cancel]()">Cancel</button>
      <button [[detected-primary-button-directive]] (click)="on[Submit]()">Submit</button>
    </div>
  </div>

</[wrapper-element]>
```

### Detected Patterns

[Documentation détaillée de chaque pattern détecté dans les templates]

---

## Component Inheritance Hierarchy

[Documentation de la hiérarchie d'héritage si détectée]

---

## Service Layer Architecture

[Documentation de l'architecture de services détectée]

---

## Styling Conventions

[Documentation des conventions de styles détectées]

---

## Styles Internal Organization

[Documentation détaillée de l'organisation interne des fichiers de styles]

---

## TypeScript Conventions

[Documentation des conventions TypeScript détectées]

---

## Template Conventions

[Documentation des conventions de templates détectées]

---

## Naming Conventions

[Documentation des conventions de nommage détectées]

---

## Data Management

[Documentation des patterns de gestion de données détectés]

---

## Subscription Management

[Documentation des patterns de gestion des subscriptions détectés]

---

## Error Handling

[Documentation des patterns de gestion d'erreurs détectés]

---

## Layout Components

[Documentation des composants de layout détectés]

---

## Mandatory Rules

### ✅ ALWAYS

[Liste de 20-50 règles détectées présentes dans >90% du code avec exemples]

---

## Forbidden Practices

### ❌ NEVER

[Liste de 10-20 anti-patterns détectés avec DO/DON'T]

### Anti-Patterns v2/v3 (OBLIGATOIRE)

❌ Redéfinir une classe globale localement dans un `.component.less`
❌ `@Injectable()` sans `providedIn` ET absent du `providers[]` d'un composant → `NullInjectorError`
❌ `readonly` sans `override` quand la propriété existe dans le parent (erreur TS4114)
❌ Import + `override readonly` pour une propriété déjà héritée via la classe racine d'enums détectée
❌ Service utilisé dans un seul composant mais enregistré avec `providedIn: 'root'`

---

## Workflow

[Documentation des workflows détectés]

---

## Validation Checklist

[Checklists complètes pour chaque catégorie]

### Component Checklist (items ajoutés v2)

- [ ] `providers` inclut tous les services sans `providedIn: 'root'`
- [ ] Mot-clé `override` utilisé pour toutes les méthodes surchargées de classes parentes
- [ ] Propriétés `readonly` ont le bon modificateur de visibilité (`protected` pour template, `public` pour API)

### Component Checklist (items ajoutés v3)

- [ ] Avant d'importer un enum, vérifier s'il est déjà dans la classe racine d'enums détectée (ou équivalent)
- [ ] Aucun import redondant d'enum déjà disponible via la chaîne d'héritage détectée (classe racine → classe de base → composant)
- [ ] Aucune propriété `readonly` ou `override readonly` redondante pour un enum hérité
- [ ] Les enums non présents dans la classe racine d'enums sont déclarés localement SANS le mot-clé `override`
- [ ] Si un enum est utilisé dans 3+ composants, envisager de l'ajouter à la classe racine d'enums

### Component Checklist (items ajoutés v4)

- [ ] Custom wrappers utilisés (si pattern détecté >70%)
- [ ] Custom titles utilisés (si pattern détecté >70%)
- [ ] trackBy last, named "trackBy"

### Template Checklist (items ajoutés v4)

- [ ] Footer right-aligned (edit panels)
- [ ] Footer : boutons Secondary (Cancel) + Primary (Save) dans cet ordre
- [ ] dblclick + menu Edit (listes)

### Styles Checklist (items ajoutés v2)

- [ ] Aucune classe globale n'est redéfinie localement dans le composant
- [ ] Les classes globales sont utilisées directement dans le HTML (pas redéfinies en LESS)
- [ ] Vérifier dans les fichiers de styles globaux détectés (ou équivalent) si la classe existe avant de la créer

### Service Checklist (items ajoutés v2/v4)

- [ ] Service décoré avec `@Injectable({ providedIn: 'root' })` si singleton global
- [ ] Service décoré avec `@Injectable()` (sans providedIn) si scopé au composant
- [ ] Si service sans providedIn, vérifier qu'il est dans `providers[]` du composant qui l'utilise
- [ ] Ordre des méthodes : getAll → get → create → update → delete
- [ ] Mocks retournent des clones `{ ...item }`

---

## Summary

This document represents the **auto-detected standards** from the [PROJECT_NAME] codebase. All rules, patterns, and conventions are derived from actual implementation examples.

**Key Principles**: [Liste des principes détectés]

**When in doubt**: Look at existing components in `[most representative folders detected]` for examples.

---

**Generated**: [DATE]  
**Source**: [PROJECT_NAME] Repository Analysis  
**Version**: 4.0.0 (Enhanced: providers, override, global styles, readonly visibility, root enum class inheritance chain, enum redundancy detection, custom wrappers, footer compliance, double affordance, service method order)

```

## 🔍 Instructions Spécifiques d'Analyse

**IMPORTANT** : Pour CHAQUE section ci-dessus, tu DOIS :

1. **Analyser minimum 20-50 fichiers** de la catégorie concernée
2. **Noter l'ordre exact** des éléments (pas juste "il y a des imports", mais "imports Angular → Material → RxJS → Project")
3. **Calculer les %** d'usage de chaque pattern (ex: "standalone: 85%, module-based: 15%")
4. **Extraire des exemples réels** du code (pas des exemples théoriques)
5. **Détecter les variations** et les documenter
6. **Identifier le pattern dominant** (>70% usage)
7. **[v2] Scanner TOUS les `@Injectable()`** pour détecter les patterns `providedIn` vs providers au niveau composant
8. **[v2] Scanner TOUS les composants héritant d'une base class** pour détecter l'usage de `override`
9. **[v2] Scanner TOUS les fichiers de styles globaux** (`src/styles/`) pour lister les classes globales
10. **[v2] Vérifier les redéfinitions locales** de classes globales dans les `.component.less`
11. **[v3] Scanner la classe racine d'enums** (détectée automatiquement) pour lister TOUTES les propriétés `readonly` avec leur enum assigné
12. **[v3] Scanner la chaîne d'héritage complète** : classe racine d'enums → classe de base des composants → classes intermédiaires → composants concrets, pour identifier les ajouts d'enums à chaque niveau
13. **[v3] Pour CHAQUE composant**, vérifier si un import d'enum est redondant (l'enum est déjà exposé via la classe racine d'enums)
14. **[v3] Détecter les erreurs TS4114 potentielles** : propriétés `readonly` qui shadow une propriété du parent sans `override`
15. **[v4] Détecter les custom wrappers** de formulaires et titres, calculer le % d'adoption
16. **[v4] Vérifier la conformité des footers** dans les edit panels (alignment, boutons)
17. **[v4] Vérifier la double affordance** dans les listes (dblclick + menu)
18. **[v4] Vérifier l'ordre des méthodes** dans les services (getAll→get→create→update→delete)

### Analyse TypeScript Component Order

Pour **20+ composants**, crée un tableau :

| Component | @Input order | @Output order | Constructor params order | Lifecycle hooks | Methods order | trackBy position |
|-----------|--------------|---------------|-------------------------|-----------------|---------------|------------------|
| Component1 | ... | ... | ... | ... | ... | last |
| Component2 | ... | ... | ... | ... | ... | before ngOnDestroy |
| ... | ... | ... | ... | ... | ... | ... |

Puis identifie le pattern dominant.

### Analyse Template Structure

Pour **15+ templates**, note :

| Template | Root element | Sections order | State management | Control flow | Form type | Table library |
|----------|--------------|----------------|------------------|--------------|-----------|---------------|
| Template1 | div.wrapper | H-C-F | @if | @if/@else | Reactive | Material |
| Template2 | ... | ... | ... | ... | ... | ... |

### Analyse LESS/SCSS Organization

Pour **15+ fichiers de styles**, note :

| File | First line | :host usage | Max nesting | Naming | Units | Variables | Override position |
|------|------------|-------------|-------------|--------|-------|-----------|------------------|
| Style1 | @import | Yes | 4 | kebab | rem | 95% | End |
| Style2 | ... | ... | ... | ... | ... | ... | ... |

### [v2] Analyse Providers dans @Component

Pour **TOUS les composants standalone**, scanner et noter :

| Component | Has `providers` | Services in providers | Service has `providedIn`? | Raison du provider |
| ---------- | --------------- | --------------------- | ------------------------- | ------------------ |
| Component1 | Yes             | [ServiceA, ServiceB]  | No                        | Stateful service   |
| Component2 | No              | -                     | N/A                       | -                  |
| ...        | ...             | ...                   | ...                       | ...                |

**Détecter aussi** : Tous les `@Injectable()` SANS `providedIn: 'root'` et vérifier qu'ils sont bien dans un `providers` quelque part.

### [v2] Analyse Override Keyword

Pour **TOUS les composants héritant d'une base class**, scanner et noter :

| Component | Base Class | Methods overridden | Uses `override` keyword | Missing `override` |
| ---------- | ------------- | ------------------ | ----------------------- | ------------------- |
| Component1 | [DetectedBaseClass] | onInit, onDestroy  | Yes                     | None               |
| Component2 | [DetectedListBase]  | onInit             | No                      | onInit             |
| ...        | ...           | ...                | ...                     | ...                |

### [v2] Analyse Readonly Visibility

Pour **20+ composants**, scanner les propriétés `readonly` et noter :

| Component | Property | Visibility | Usage (template/class) | Pattern |
| ---------- | -------- | ------------------------ | ---------------------- | --------- |
| Component1 | `myEnum` | `protected readonly`     | template               | Dominant  |
| Component2 | `myEnum` | `readonly` (no modifier) | template               | Legacy    |
| Component3 | `myEnum` | `public readonly`        | public API             | Exception |
| ...        | ...      | ...                      | ...                    | ...       |

Calculer le pattern dominant et le documenter comme règle.

### [v2] Analyse Global vs Local Styles

Pour les fichiers de styles globaux (`src/styles/`), lister toutes les classes :

| Global Class   | Source File   | Used in # templates | Redefined locally in # components |
| -------------- | ------------- | ------------------- | --------------------------------- |
| `.[global-class-1]` | `[global-styles-file]` | [nombre]            | [nombre - should be 0]            |
| `.[global-class-2]` | `[global-styles-file]` | [nombre]            | [nombre]                          |
| ...            | ...           | ...                 | ...                               |

Détecter tout composant qui REDÉFINIT une classe globale localement (c'est un anti-pattern).

### [v3] Analyse Enum Registry & Inheritance Chain

Pour la classe racine qui centralise les enums (détectée automatiquement dans le projet), scanner :

1. **Lister TOUTES les propriétés `readonly`** de la classe racine
2. **Pour chaque propriété**, noter l'enum assigné et la source d'import
3. **Scanner la chaîne d'héritage complète** : quelles classes intermédiaires ajoutent des enums supplémentaires ?

| Base Class       | Property Name                | Enum/Type Assigned           | Import Source                      |
| ---------------- | ---------------------------- | ---------------------------- | ---------------------------------- |
| `[RootEnumClass]`  | `[propertyName1]`            | `[EnumType1]`                | `[import/path/1]`                   |
| `[RootEnumClass]`  | `[propertyName2]`            | `[EnumType2]`                | `[import/path/2]`                   |
| `[RootEnumClass]`  | `[propertyName3]`            | `[EnumType3]`                | `[import/path/3]`                   |
| `[BaseClass]`      | `[propertyName4]`            | `[EnumType4]`                | `[import/path/4]`                   |
| ...              | ...                          | ...                          | ...                                |

### [v3] Détection des Redondances d'Enums dans les Composants

Pour **TOUS les composants** qui héritent de la classe de base détectée (ou équivalent), scanner :

1. **Les imports** : le composant importe-t-il un enum déjà dans la classe racine d'enums ?
2. **Les propriétés `readonly`** : le composant déclare-t-il une propriété `readonly` ou `override readonly` identique à celle du parent ?
3. **Les erreurs TS4114** : détecter les cas où `readonly` sans `override` provoque une erreur

| Component         | Redundant Import          | Redundant Property                                                    | Action Required              |
| ----------------- | ------------------------- | --------------------------------------------------------------------- | ---------------------------- |
| `[ComponentName]` | `[EnumTypeA]`             | `override readonly [propA] = [EnumTypeA]`                             | Supprimer import + propriété |
| `[ComponentName]` | `[EnumTypeB]`             | `override readonly [propB] = [EnumTypeB]`                             | Supprimer import + propriété |
| ...               | ...                       | ...                                                                   | ...                          |

**Indicateurs de redondance** :

- Le composant utilise `override readonly` pour un enum → **probable redondance** (vérifier dans la classe racine)
- Le compilateur lève `TS4114` quand on ajoute `readonly` sans `override` → **l'enum est déjà défini dans le parent**
- L'import de l'enum est utilisé UNIQUEMENT pour la propriété `readonly` → **supprimer l'import et la propriété**

### [v4] Analyse Form Wrappers

Pour **TOUS les composants de formulaire**, scanner :

- Détecter les custom wrapper components remplaçant `mat-form-field`
- Calculer le % d'adoption (custom vs native)
- Lister les `@Input` du wrapper personnalisé

| Component | Uses Custom Wrapper | Wrapper Component | Native mat-form-field | % Custom |
| --------- | ------------------- | ----------------- | --------------------- | -------- |
| Form1     | Yes                 | [detected-wrapper]    | 0                     | 100%     |
| Form2     | No                  | -                 | 5                     | 0%       |
| ...       | ...                 | ...               | ...                   | ...      |

### [v4] Analyse Titles

Pour **TOUS les composants avec des titres**, scanner :

- Détecter les custom title components remplaçant `<h1-h6>`
- Calculer le % d'adoption

| Component | Uses Custom Title | Title Component | Native h1-h6 | % Custom |
| --------- | ----------------- | --------------- | ------------- | -------- |
| View1     | Yes               | [detected-title]       | 0             | 100%     |
| View2     | No                | -               | 2             | 0%       |
| ...       | ...               | ...             | ...           | ...      |

### [v4] Analyse Footers (Edit Panels)

Pour **TOUS les edit panels / side panels**, vérifier :

- Actions alignées à droite
- Boutons : Secondary (Cancel) + Primary (Save/Submit)
- Ordre : Cancel avant Save

| Component | Footer Present | Right-Aligned | Sec+Primary | Cancel+Save | Compliant |
| --------- | -------------- | ------------- | ----------- | ----------- | --------- |
| Edit1     | Yes            | Yes           | Yes         | Yes         | ✅        |
| Edit2     | Yes            | No            | Yes         | No          | ❌        |
| ...       | ...            | ...           | ...         | ...         | ...       |

### [v4] Analyse Double Affordance (Lists)

Pour **TOUTES les listes**, vérifier :

- Présence de `(dblclick)` sur les lignes
- Présence d'une action Edit dans le menu contextuel

| Component | Has (dblclick) | Has Edit Menu | Both Present | Compliant |
| --------- | -------------- | ------------- | ------------ | --------- |
| List1     | Yes            | Yes           | Yes          | ✅        |
| List2     | No             | Yes           | No           | ❌        |
| ...       | ...            | ...           | ...          | ...       |

### [v4] Analyse Service Method Order

Pour **TOUS les services CRUD/edit**, vérifier :

- Ordre des méthodes : `getAll → get → create → update → delete`
- Les mocks retournent des clones `{ ...item }`

| Service | Method Order Correct | getAll→get→create→update→delete | Mocks Use Clones | Compliant |
| ------- | -------------------- | ----------------------------------- | ---------------- | --------- |
| Svc1    | Yes                  | Yes                                 | Yes              | ✅        |
| Svc2    | No                   | create before get                   | No               | ❌        |
| ...     | ...                  | ...                                 | ...              | ...       |

## ✅ Critères de Qualité

La documentation DOIT contenir :

- ✅ **Structure exacte** de dossiers du projet (pas génériques)
- ✅ **Exemples réels** extraits du code (chemins de fichiers exacts)
- ✅ **Statistiques** (% d'usage de chaque pattern)
- ✅ **Patterns dominants** identifiés clairement
- ✅ **Variations** documentées
- ✅ **Anti-patterns** détectés (code déprécié, legacy)
- ✅ **Minimum 100 règles** identifiées
- ✅ **Minimum 50 exemples** de code réel
- ✅ **Checklists complètes** (20+ items par catégorie)
- ✅ **[v2] Inventaire complet** des services sans `providedIn: 'root'` et leurs providers
- ✅ **[v2] Statistiques d'usage** du mot-clé `override` (% par méthode surchargée)
- ✅ **[v2] Inventaire des classes globales** (source file, noms, usage dans templates)
- ✅ **[v2] Détection des redéfinitions locales** de classes globales (anti-pattern)
- ✅ **[v2] Règle de visibilité** des propriétés `readonly` (`protected` vs `public`)
- ✅ **[v3] Inventaire complet** de la classe racine d'enums détectée (ou équivalent) avec toutes les propriétés `readonly` listées
- ✅ **[v3] Chaîne d'héritage** documentée : quelles classes ajoutent des enums à chaque niveau
- ✅ **[v3] Détection des imports redondants** d'enums déjà disponibles via héritage
- ✅ **[v3] Détection des propriétés `override readonly` inutiles** pour des enums hérités
- ✅ **[v3] Arbre de décision** documenté : où déclarer un enum (classe racine d'enums vs local)
- ✅ **[v3] Règle TS4114** documentée : pourquoi `readonly` sans `override` provoque une erreur quand l'enum est dans le parent
- ✅ **[v4] Wrapper adoption %** : custom form wrappers et custom titles
- ✅ **[v4] Footer compliance** : conformité des footers dans les edit panels
- ✅ **[v4] Affordance %** : double affordance dans les listes (dblclick + menu)
- ✅ **[v4] Method order compliance** : ordre des méthodes dans les services CRUD

## 🚀 Livrable

Fichier : `[project-name]-conventions.md`

Taille attendue : **5500+ lignes** (documentation exhaustive)

**Note** : Si un pattern n'existe pas dans le projet (ex: pas de NgRx, pas de tests), **NE PAS le documenter**. Documente uniquement ce qui est réellement utilisé.
```

## [v2] Instructions Spécifiques Supplémentaires pour la Génération

Lors de la génération du build agent, les sections suivantes DOIVENT être incluses dans la documentation finale :

### A. Section "Component Dependency Injection" (OBLIGATOIRE)

La documentation générée DOIT contenir une section dédiée qui documente :

1. **Le champ `providers` dans `@Component`** : Quand l'utiliser, quand ne PAS l'utiliser
2. **Liste exhaustive** de tous les services décorés `@Injectable()` SANS `providedIn: 'root'`
3. **Pour chaque service sans providedIn** : dans quel(s) composant(s)/module(s) il est fourni via `providers`
4. **Règle claire** : "Si un service n'a pas `providedIn: 'root'`, il DOIT être déclaré dans `providers` du composant standalone ou du module, sinon `NullInjectorError`"
5. **Exemples concrets** extraits du codebase

```typescript
// Exemple à générer dans la documentation :

// Service SANS providedIn - NÉCESSITE un provider explicite
@Injectable() // PAS de providedIn!
export class [ScopedService] {}

// Dans le composant qui l'utilise :
@Component({
  standalone: true,
  providers: [[ScopedService]] // OBLIGATOIRE
  // ...
})
export class [MyComponent] {}

// Service AVEC providedIn - PAS besoin de provider
@Injectable({ providedIn: 'root' })
export class ApiService {} // Disponible partout automatiquement
```

### B. Section "Override Keyword" (OBLIGATOIRE)

La documentation générée DOIT contenir une règle claire sur :

1. **Usage obligatoire vs recommandé** de `override` (basé sur % détecté)
2. **Liste des méthodes** concernées (onInit, onDestroy, ngOnInit, ngAfterViewInit, etc.)
3. **Exemples DO/DON'T** extraits du codebase

```typescript
// DO
protected override onInit(): void {
  // ...
}

// DON'T
protected onInit(): void {  // Manque override!
  // ...
}
```

### C. Section "Global vs Local Styles" (OBLIGATOIRE)

La documentation générée DOIT contenir :

1. **Inventaire complet** des classes globales (nom, fichier source)
2. **Règle d'interdiction** de redéfinir localement ces classes
3. **Mode d'emploi** : comment utiliser les classes globales dans les templates
4. **Référence aux fichiers** contenant les définitions originales

```less
// ANTI-PATTERN à documenter :
// ❌ Ne JAMAIS redéfinir une classe globale dans un composant
:host {
  & .[detected-global-class] {
    // ERREUR : cette classe est déjà définie dans les fichiers de styles globaux
    mask: url('/assets/images/icon-wrong-path.svg');
  }
}

// ✅ CORRECT : Utiliser la classe globale directement dans le HTML
// <div class="[detected-global-class] [detected-action-class]"></div>
// Le style est déjà défini globalement, pas besoin de le redéfinir
```

### D. Section "Readonly Visibility" (OBLIGATOIRE)

La documentation générée DOIT contenir :

1. **Règle de visibilité** pour les propriétés `readonly` (pattern dominant détecté)
2. **Distinction claire** entre `protected readonly` (template) et `public readonly` (API)
3. **Exemples** extraits du codebase

```typescript
// Règle à générer :
// Pour usage dans le template uniquement :
protected readonly myEnum = MyEnum;

// Pour API publique du composant :
public readonly myEnum = MyEnum;

// ❌ JAMAIS sans modificateur si la règle détectée l'exige :
readonly myEnum = MyEnum;  // implicitement public, pas conforme si règle = protected
```

### E. Section "Enum Registry & Inheritance Chain" (OBLIGATOIRE) [v3]

La documentation générée DOIT contenir une section dédiée qui documente :

1. **Identification de la classe racine d'enums** (détectée automatiquement) et son fichier source
2. **Inventaire complet** de toutes les propriétés `readonly` de la classe racine avec le type enum assigné
3. **Chaîne d'héritage** : quelles classes intermédiaires ajoutent des enums supplémentaires (ex: la classe de base des composants ajoute `[detectedEnumProperty]`)
4. **Arbre de décision** : comment déterminer si un enum doit être dans la classe racine d'enums vs déclaré localement
5. **Liste des anti-patterns** : imports redondants, `override readonly` inutiles, erreurs TS4114
6. **Exemples DO/DON'T** extraits du codebase

```typescript
// ❌ ANTI-PATTERN : import + override readonly pour un enum déjà dans la classe racine d'enums
import { [EnumTypeA] } from '[detected/path/to/enum]';
// ...
override readonly [propA] = [EnumTypeA]; // REDONDANT!

// ❌ ANTI-PATTERN : import + readonly sans override (ERREUR TS4114)
import { [EnumTypeB] } from '[detected/path/to/enum]';
// ...
readonly [propB] = [EnumTypeB]; // TS4114 Error!

// ✅ CORRECT : Rien à faire, l'enum est hérité de la classe racine d'enums
// Pas d'import, pas de readonly, utiliser directement dans le template :
// [attr]="[inheritedPropA].Value1"
// [attr]="[inheritedPropB].Value2"

// ✅ CORRECT : Enum NON présent dans la classe racine d'enums → déclarer localement
import { [LocalEnumType] } from './[path/to/local-component]';
// ...
readonly [localEnumProp] = [LocalEnumType]; // OK car pas dans la classe racine d'enums
```

**Règle de vérification systématique** :

```
AVANT d'ajouter un import d'enum + readonly dans un composant :
1. Ouvrir le fichier de la classe racine d'enums (détectée automatiquement)
2. Chercher si l'enum est déjà listé comme propriété readonly
3. Si OUI → NE PAS importer, NE PAS déclarer de readonly
4. Si NON → Importer et déclarer readonly localement (sans override)
```

### F. Section "Custom Wrappers & Patterns v4" (OBLIGATOIRE) [v4]

La documentation générée DOIT contenir :

1. **Custom Form Wrappers** : si un composant wrapper personnalisé remplace `mat-form-field`, documenter le composant, ses `@Input`, et le % d'adoption. Si >70% → MANDATORY, sinon RECOMMENDED.
2. **Custom Titles** : si un composant personnalisé remplace `<h1-h6>`, documenter et calculer le % d'adoption. Si >70% → MANDATORY.
3. **Footer Pattern** : documenter le pattern de footer pour les edit panels (actions alignées à droite, Secondary + Primary, Cancel + Save).
4. **Double Affordance** : documenter le pattern `(dblclick)` + action Edit dans le menu pour les listes. Calculer le % de conformité.
5. **Service Method Order** : documenter l'ordre `getAll → get → create → update → delete` et le pattern de clone dans les mocks `{ ...item }`.

```typescript
// Edit panel footer pattern :
// <div class="actions">
//   <div class="end">
//     <button [detected-secondary-button-directive] (click)="onCancel()">Cancel</button>
//     <button [detected-primary-button-directive] (click)="onSave()">Save</button>
//   </div>
// </div>

// List double affordance pattern :
// <mat-row (dblclick)="onEdit(row)" [matMenuTriggerFor]="menu"></mat-row>
// <mat-menu>
//   <button mat-menu-item (click)="onEdit(item)">Edit</button>
// </mat-menu>

// Service method order :
export class MyService {
  getAll(): Observable<Item[]> { }
  get(id: number): Observable<Item> { }
  create(item: Item): Observable<Item> { }
  update(item: Item): Observable<Item> { }
  delete(id: number): Observable<void> { }
}

// Mock clone pattern :
create(item: Item): Observable<Item> {
  const clone = { ...item, id: this.nextId++ };
  this.items.push(clone);
  return of(clone);
}
```
