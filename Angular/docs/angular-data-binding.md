# Les méthodes de liaison de données en Angular

Angular propose un système puissant de liaison de données (data binding) qui permet de connecter les données du composant TypeScript avec l'interface utilisateur HTML. Ce document explore les différentes méthodes disponibles et leurs cas d'utilisation.

## Interpolation `{{ }}`

L'interpolation est la méthode la plus simple pour afficher des valeurs dynamiques dans le template HTML.

### Fonctionnement
- **Direction** : Composant → Template (unidirectionnelle)
- **Syntaxe** : Doubles accolades `{{ expression }}`

### Exemples

```typescript
// Dans le composant
export class ExampleComponent {
  username = 'Alice';
  currentDate = new Date();
  price = 42.99;
  
  getMessage() {
    return `Bienvenue sur notre site, ${this.username}!`;
  }
}
```

```html
<!-- Dans le template -->
<h1>Bonjour, {{username}}!</h1>
<p>{{getMessage()}}</p>
<p>Date actuelle : {{currentDate | date:'dd/MM/yyyy'}}</p>
<p>Prix : {{price | currency:'EUR'}}</p>
<p>Calcul: {{2 + 2 * 3}}</p>
```

L'interpolation prend en charge:
- Les propriétés du composant
- Les méthodes du composant
- Les expressions JavaScript simples
- L'utilisation de pipes pour formater les données

## Liaison de propriété (Property Binding)

La liaison de propriété permet de définir des valeurs pour les propriétés des éléments HTML ou des directives.

### Fonctionnement
- **Direction** : Composant → Template (unidirectionnelle)
- **Syntaxe** : Crochets `[propriété]="expression"`

### Exemples

```typescript
// Dans le composant
export class ExampleComponent {
  imageUrl = 'assets/logo.png';
  isButtonDisabled = true;
  bgColor = 'lightblue';
  colspan = 3;
  styles = { 'font-size': '16px', 'color': 'blue' };
  classes = { active: true, highlight: false };
}
```

```html
<!-- Dans le template -->
<img [src]="imageUrl" [alt]="'Logo de l\'application'">
<button [disabled]="isButtonDisabled">Soumettre</button>
<div [style.background-color]="bgColor">Contenu avec fond coloré</div>
<td [attr.colspan]="colspan">Cellule fusionnée</td>
<p [style]="styles">Texte avec styles dynamiques</p>
<div [ngClass]="classes">Contenu avec classes dynamiques</div>
```

La liaison de propriété est également utile pour passer des données aux composants enfants :

```html
<app-child [userData]="userInfo" [config]="appConfig"></app-child>
```

## Liaison d'événement (Event Binding)

La liaison d'événement permet de réagir aux actions de l'utilisateur ou à d'autres événements du DOM.

### Fonctionnement
- **Direction** : Template → Composant (unidirectionnelle)
- **Syntaxe** : Parenthèses `(événement)="expression"`

### Exemples

```typescript
// Dans le composant
export class ExampleComponent {
  counter = 0;
  
  increment() {
    this.counter++;
  }
  
  resetCounter(value: number = 0) {
    this.counter = value;
  }
  
  handleInput(event: Event) {
    console.log((event.target as HTMLInputElement).value);
  }
  
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submitForm();
    }
  }
  
  submitForm() {
    // Logique de soumission du formulaire
  }
}
```

```html
<!-- Dans le template -->
<button (click)="increment()">Incrémenter</button>
<button (click)="resetCounter()">Réinitialiser</button>
<button (click)="resetCounter(10)">Définir à 10</button>
<p>Compteur : {{counter}}</p>

<input (input)="handleInput($event)">
<input (keyup)="handleKeyUp($event)">
<input (keyup.enter)="submitForm()">

<div (mouseover)="isHovered = true" (mouseleave)="isHovered = false">
  Survolez-moi
</div>
```

La liaison d'événement est aussi utilisée pour capturer les événements émis par les composants enfants :

```html
<app-child (itemSelected)="onItemSelected($event)" (cancel)="onCancel()"></app-child>
```

## Liaison bidirectionnelle (Two-way Data Binding)

La liaison bidirectionnelle combine la liaison de propriété et la liaison d'événement pour synchroniser les données dans les deux directions.

### Fonctionnement
- **Direction** : Composant ↔ Template (bidirectionnelle)
- **Syntaxe** : Combinaison de crochets et parenthèses `[(ngModel)]="propriété"`
- **Prérequis** : Importation du `FormsModule` dans le module Angular

### Exemples

```typescript
// Dans app.module.ts
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  // ...
})
export class AppModule { }
```

```typescript
// Dans le composant
export class ExampleComponent {
  username = '';
  email = '';
  comment = '';
  acceptTerms = false;
  selectedOption = 'option2';
}
```

```html
<!-- Dans le template -->
<input [(ngModel)]="username" placeholder="Nom d'utilisateur">
<p>Bonjour, {{username || 'visiteur'}}!</p>

<input type="email" [(ngModel)]="email" placeholder="Email">
<textarea [(ngModel)]="comment" rows="4" placeholder="Commentaire"></textarea>
<input type="checkbox" [(ngModel)]="acceptTerms"> J'accepte les conditions

<select [(ngModel)]="selectedOption">
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
  <option value="option3">Option 3</option>
</select>
<p>Option sélectionnée : {{selectedOption}}</p>
```

### Implémentation manuelle de la liaison bidirectionnelle

Il est également possible de créer manuellement une liaison bidirectionnelle en combinant la liaison de propriété et la liaison d'événement :

```html
<input 
  [value]="username" 
  (input)="username = $event.target.value"
  placeholder="Nom d'utilisateur">
```

Cette approche est équivalente à `[(ngModel)]="username"` mais peut être utilisée sans le `FormsModule`.

## Comparaison des méthodes de liaison de données

| Méthode | Syntaxe | Direction | Cas d'utilisation | Avantages | Limitations |
|---------|---------|-----------|-------------------|-----------|-------------|
| **Interpolation** | `{{expression}}` | Composant → Template | Affichage simple de texte et valeurs | Simple à utiliser, supporte les pipes | Ne peut pas modifier les propriétés des éléments HTML directement |
| **Liaison de propriété** | `[propriété]="expression"` | Composant → Template | Modification dynamique des propriétés HTML, styles, classes, attributs | Flexibilité, performance optimisée | Ne capture pas les changements initiés par l'utilisateur |
| **Liaison d'événement** | `(événement)="expression"` | Template → Composant | Réaction aux interactions utilisateur, capture des événements DOM | Permet de réagir aux actions utilisateur, accès à l'objet événement | Ne met pas à jour automatiquement l'interface utilisateur |
| **Liaison bidirectionnelle** | `[(ngModel)]="propriété"` | Composant ↔ Template | Formulaires, entrées utilisateur nécessitant une synchronisation bidirectionnelle | Synchronisation automatique, code concis | Nécessite FormsModule, peut affecter les performances si utilisé excessivement |

## Bonnes pratiques

### Quand utiliser chaque méthode

1. **Utiliser l'interpolation** pour :
   - Afficher du texte ou des valeurs simples
   - Formater des données avec des pipes
   - Afficher le résultat d'expressions simples

2. **Utiliser la liaison de propriété** pour :
   - Définir dynamiquement des propriétés HTML (src, href, disabled, etc.)
   - Appliquer des styles ou classes conditionnellement
   - Passer des données aux composants enfants (Input)
   - Manipuler des attributs HTML spécifiques

3. **Utiliser la liaison d'événement** pour :
   - Gérer les clics, la saisie, et autres interactions utilisateur
   - Réagir aux événements du cycle de vie
   - Capturer les événements émis par les composants enfants (Output)

4. **Utiliser la liaison bidirectionnelle** pour :
   - Les éléments de formulaire nécessitant une synchronisation immédiate
   - Les scénarios où une valeur doit être à la fois affichée et modifiable
   - Simplifier le code lorsque les deux directions sont nécessaires

### Optimisation des performances

- Évitez d'utiliser excessivement la liaison bidirectionnelle pour des listes ou des composants à haute fréquence de mise à jour
- Préférez les liaisons unidirectionnelles lorsque la bidirectionnalité n'est pas nécessaire
- Utilisez `ChangeDetectionStrategy.OnPush` pour optimiser la détection des changements
- Évitez les expressions complexes dans les templates pour améliorer la lisibilité et les performances

## Conclusion

La gestion efficace des liaisons de données est essentielle pour créer des applications Angular performantes et maintenables. En choisissant la méthode appropriée selon le contexte, vous pouvez optimiser à la fois le développement et l'expérience utilisateur.