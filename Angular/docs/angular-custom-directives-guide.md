# Les Directives en Angular

Les directives sont l'un des concepts fondamentaux d'Angular qui permettent de manipuler le DOM et de modifier le comportement des éléments HTML. Elles constituent un moyen puissant d'étendre la syntaxe HTML et d'encapsuler des comportements réutilisables.

## Types de directives en Angular

Angular propose trois types de directives :

1. **Composants** : Ce sont techniquement des directives avec un template associé.
2. **Directives structurelles** : Elles modifient la structure du DOM (ajout/suppression d'éléments).
3. **Directives d'attribut** : Elles modifient l'apparence ou le comportement d'un élément existant.

## Directives structurelles

Les directives structurelles sont reconnaissables par leur astérisque (*) et permettent de manipuler la structure du DOM.

### Les directives structurelles natives

Angular propose trois directives structurelles principales :

- `*ngIf` : Ajoute ou supprime un élément selon une condition
- `*ngFor` : Répète un élément pour chaque élément d'une collection
- `*ngSwitch` : Affiche un élément parmi plusieurs selon une condition

### Création d'une directive structurelle personnalisée

Pour créer une directive structurelle, nous utilisons la classe `TemplateRef` et `ViewContainerRef`.

Voici comment créer une directive `*appUnless` qui fonctionne à l'opposé de `*ngIf` :

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      // Si la condition est fausse et que la vue n'est pas déjà affichée
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      // Si la condition est vraie et que la vue est affichée
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

Utilisation dans un template :

```html
<div *appUnless="condition">
  Ce contenu s'affiche uniquement lorsque la condition est fausse.
</div>
```

### Comment fonctionnent les directives structurelles

Les directives structurelles utilisent une syntaxe avec astérisque (*) qui est en réalité un raccourci. Angular transforme cette syntaxe en utilisant `<ng-template>`. Par exemple :

```html
<div *ngIf="condition">Contenu</div>
```

Est transformé en :

```html
<ng-template [ngIf]="condition">
  <div>Contenu</div>
</ng-template>
```

### Microsyntaxe des directives structurelles

Angular propose une microsyntaxe pour les directives structurelles qui permet de passer plusieurs valeurs :

```html
<div *ngFor="let item of items; let i = index; trackBy: trackByFn">
  {{i}} - {{item.name}}
</div>
```

Pour une directive personnalisée, on peut aussi exploiter cette microsyntaxe :

```typescript
@Directive({
  selector: '[appCustomFor]'
})
export class CustomForDirective {
  @Input() set appCustomForOf(items: any[]) {
    // Logique pour itérer sur les éléments
  }
  
  @Input() set appCustomForTrackBy(fn: TrackByFunction<any>) {
    // Logique pour le trackBy
  }
}
```

## Directives d'attribut

Les directives d'attribut modifient l'apparence ou le comportement d'un élément existant sans modifier la structure du DOM.

### Directives d'attribut natives

Angular fournit plusieurs directives d'attribut :

- `ngClass` : Ajoute/supprime des classes CSS
- `ngStyle` : Ajoute/modifie des styles inline 
- `ngModel` : Implémente la liaison bidirectionnelle

### Création d'une directive d'attribut personnalisée

Voici un exemple de directive qui met en surbrillance un élément lorsqu'on le survole :

```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight = '';
  @Input() defaultColor = '';
  
  constructor(private el: ElementRef) { }
  
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight || this.defaultColor || 'yellow');
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
  
  private highlight(color: string | null) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

Utilisation :

```html
<p appHighlight="lightblue" defaultColor="pink">
  Texte qui sera surligné au passage de la souris
</p>
```

### Décorateurs pour les directives d'attribut

Angular fournit plusieurs décorateurs utiles pour les directives d'attribut :

- `@HostBinding` : Lie une propriété de l'élément hôte
- `@HostListener` : Écoute les événements de l'élément hôte
- `@Input` : Accepte des données d'entrée

Exemple avec `@HostBinding` :

```typescript
import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appToggleClass]'
})
export class ToggleClassDirective {
  @HostBinding('class.active') isActive = false;
  
  @HostListener('click') onClick() {
    this.isActive = !this.isActive;
  }
}
```

## Communication entre directives

Les directives peuvent communiquer entre elles ou avec leurs composants hôtes.

### Injection de directives

Une directive peut être injectée dans une autre directive ou dans un composant :

```typescript
import { Directive, Optional, Host, Self } from '@angular/core';
import { ParentDirective } from './parent.directive';

@Directive({
  selector: '[appChild]'
})
export class ChildDirective {
  constructor(@Optional() @Host() private parent: ParentDirective) {
    if (parent) {
      // Communication avec la directive parente
    }
  }
}
```

### Exportation d'une directive

Une directive peut être exportée pour être accessible dans le template :

```typescript
@Directive({
  selector: '[appExportable]',
  exportAs: 'exportable'
})
export class ExportableDirective {
  toggle() {
    // Implémentation
  }
}
```

Utilisation :

```html
<div appExportable #exp="exportable">
  <button (click)="exp.toggle()">Toggle</button>
</div>
```

## Cas d'utilisation avancés

### Directives avec ContentChildren

Les directives peuvent accéder aux éléments enfants du contenu projeté :

```typescript
import { Directive, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { ItemDirective } from './item.directive';

@Directive({
  selector: '[appContainer]'
})
export class ContainerDirective implements AfterContentInit {
  @ContentChildren(ItemDirective) items: QueryList<ItemDirective>;
  
  ngAfterContentInit() {
    // Manipulation des éléments enfants avec la directive ItemDirective
    this.items.forEach(item => {
      // ...
    });
  }
}
```

### Directives pour la validation de formulaires

Création d'une directive de validation personnalisée :

```typescript
import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appForbiddenName]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ForbiddenNameDirective,
    multi: true
  }]
})
export class ForbiddenNameDirective implements Validator {
  @Input('appForbiddenName') forbiddenName = '';
  
  validate(control: AbstractControl): {[key: string]: any} | null {
    const nameRe = new RegExp(this.forbiddenName, 'i');
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  }
}
```

## Bonnes pratiques

1. **Responsabilité unique** : Une directive doit avoir une seule responsabilité.
2. **Nommage** : Préfixez les sélecteurs de vos directives pour éviter les conflits.
3. **Immutabilité** : Évitez de modifier directement les données d'entrée.
4. **Performance** : Soyez prudent avec les manipulations fréquentes du DOM.
5. **Tests** : Testez vos directives de manière isolée.

## Conclusion

Les directives sont un outil puissant pour étendre les fonctionnalités HTML dans Angular. En comprenant comment créer et utiliser les directives structurelles et d'attribut, vous pouvez créer des composants réutilisables et maintenir un code plus propre et modulaire.

Qu'il s'agisse de manipuler le DOM, d'ajouter des comportements interactifs ou de créer des validations personnalisées, les directives offrent une solution élégante pour encapsuler la logique UI et améliorer l'expérience de développement.
