# Communication entre Composants dans Angular

## Introduction

Dans une application Angular, l'interface utilisateur est généralement structurée comme une hiérarchie de composants réutilisables. Pour créer des applications fonctionnelles et modulaires, ces composants doivent pouvoir communiquer entre eux de manière efficace. Angular offre plusieurs mécanismes pour faciliter la communication entre les composants, adaptés à différentes relations et besoins.

Ce chapitre explore en détail les différentes techniques de communication entre composants, leurs cas d'utilisation appropriés, et les bonnes pratiques associées.

## Vue d'Ensemble des Méthodes de Communication

Angular propose plusieurs méthodes pour partager des données et des événements entre composants :

| Méthode | Direction | Relation | Cas d'utilisation |
|---------|-----------|----------|-------------------|
| @Input | Parent → Enfant | Directe | Transmission de données d'un composant parent à un enfant |
| @Output & EventEmitter | Enfant → Parent | Directe | Notification du parent des événements ou changements dans l'enfant |
| Services partagés | Toute direction | Toute relation | Communication entre composants sans relation directe |
| ViewChild & ContentChild | Parent → Enfant | Directe | Accès direct à un enfant depuis le parent |
| NgRx/Store | Toute direction | Toute relation | Gestion d'état complexe et communication globale |
| Observables & RxJS | Toute direction | Toute relation | Flux de données asynchrones et réactifs |

## Communication Parent → Enfant avec @Input

La méthode la plus simple pour passer des données d'un composant parent à un composant enfant est d'utiliser le décorateur `@Input`.

### Dans le Composant Enfant

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <div>
      <h2>Composant Enfant</h2>
      <p>Message du parent : {{ message }}</p>
      <p *ngIf="data">Données reçues : {{ data.name }}</p>
    </div>
  `
})
export class ChildComponent {
  @Input() message: string = '';
  @Input() data: any;
  
  // Input avec alias
  @Input('parentItem') item: any;
  
  // Input avec setter pour réaction aux changements
  private _count = 0;
  
  @Input()
  set count(value: number) {
    this._count = value;
    this.processCountChange(value);
  }
  
  get count(): number {
    return this._count;
  }
  
  processCountChange(value: number): void {
    console.log(`Count est maintenant : ${value}`);
    // Logique supplémentaire en réponse au changement...
  }
}
```

### Dans le Composant Parent

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <h1>Composant Parent</h1>
      <app-child 
        [message]="parentMessage" 
        [data]="userData"
        [parentItem]="item"
        [count]="counter">
      </app-child>
      <button (click)="incrementCounter()">Incrémenter</button>
    </div>
  `
})
export class ParentComponent {
  parentMessage = 'Message du composant parent';
  userData = { name: 'Alice', age: 30 };
  item = { id: 1, title: 'Item du parent' };
  counter = 0;
  
  incrementCounter(): void {
    this.counter++;
  }
}
```

### Input avec OnChanges

Pour réagir aux changements d'inputs multiples, vous pouvez utiliser l'interface `OnChanges` :

```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <div>
      <h2>Composant avec OnChanges</h2>
      <p>Prénom : {{ firstName }}</p>
      <p>Nom : {{ lastName }}</p>
    </div>
  `
})
export class ChildComponent implements OnChanges {
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const change = changes[propName];
      const current = JSON.stringify(change.currentValue);
      const previous = JSON.stringify(change.previousValue);
      
      console.log(`${propName}: changé de ${previous} à ${current}`);
      
      // Logique spécifique pour chaque propriété
      if (propName === 'firstName' && !change.firstChange) {
        console.log('Le prénom a été modifié après l'initialisation');
      }
    }
  }
}
```

## Communication Enfant → Parent avec @Output et EventEmitter

Pour permettre à un composant enfant de communiquer avec son parent, Angular utilise le décorateur `@Output` couplé avec `EventEmitter`.

### Dans le Composant Enfant

```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <div>
      <h2>Composant Enfant</h2>
      <button (click)="sendMessage()">Envoyer un message au parent</button>
      <button (click)="sendData()">Envoyer des données au parent</button>
      <input #itemInput [value]="newItem" (input)="newItem = itemInput.value">
      <button (click)="addItem()">Ajouter un élément</button>
    </div>
  `
})
export class ChildComponent {
  @Output() messageEvent = new EventEmitter<string>();
  @Output() dataEvent = new EventEmitter<any>();
  @Output() newItemEvent = new EventEmitter<string>();
  
  newItem = '';
  
  sendMessage(): void {
    this.messageEvent.emit('Bonjour du composant enfant !');
  }
  
  sendData(): void {
    const data = { id: 1, name: 'Données de l\'enfant', timestamp: new Date() };
    this.dataEvent.emit(data);
  }
  
  addItem(): void {
    if (this.newItem.trim()) {
      this.newItemEvent.emit(this.newItem);
      this.newItem = '';
    }
  }
}
```

### Dans le Composant Parent

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <h1>Composant Parent</h1>
      <p *ngIf="message">Message de l'enfant : {{ message }}</p>
      <p *ngIf="childData">Données de l'enfant : {{ childData | json }}</p>
      
      <h3>Liste d'éléments :</h3>
      <ul>
        <li *ngFor="let item of items">{{ item }}</li>
      </ul>
      
      <app-child 
        (messageEvent)="receiveMessage($event)"
        (dataEvent)="receiveData($event)"
        (newItemEvent)="addItem($event)">
      </app-child>
    </div>
  `
})
export class ParentComponent {
  message: string = '';
  childData: any;
  items: string[] = ['Élément 1', 'Élément 2'];
  
  receiveMessage(message: string): void {
    this.message = message;
  }
  
  receiveData(data: any): void {
    this.childData = data;
    console.log('Données reçues de l\'enfant :', data);
  }
  
  addItem(newItem: string): void {
    this.items.push(newItem);
  }
}
```

## Communication via Services Partagés

Pour la communication entre des composants sans relation directe parent-enfant (composants frères, composants éloignés), un service partagé utilisant RxJS est souvent la meilleure solution.

### Service de Communication

```typescript
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  // Subject privé pour les messages
  private messageSource = new Subject<string>();
  
  // Observable public que les composants peuvent s'abonner
  message$ = this.messageSource.asObservable();
  
  // Subject pour les données complexes
  private dataSource = new Subject<any>();
  data$ = this.dataSource.asObservable();
  
  // Méthode pour envoyer un message
  sendMessage(message: string): void {
    this.messageSource.next(message);
  }
  
  // Méthode pour envoyer des données
  sendData(data: any): void {
    this.dataSource.next(data);
  }
  
  // Exemple avec BehaviorSubject pour conserver l'état
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  
  setCurrentUser(user: User): void {
    this.currentUserSource.next(user);
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSource.getValue();
  }
}
```

### Utilisation dans les Composants

```typescript
// Composant Émetteur
import { Component } from '@angular/core';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-sender',
  template: `
    <div>
      <h2>Composant Émetteur</h2>
      <input #messageInput placeholder="Votre message">
      <button (click)="sendMessage(messageInput.value)">Envoyer</button>
    </div>
  `
})
export class SenderComponent {
  constructor(private communicationService: CommunicationService) { }
  
  sendMessage(message: string): void {
    if (message.trim()) {
      this.communicationService.sendMessage(message);
    }
  }
}

// Composant Récepteur
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunicationService } from '../services/communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-receiver',
  template: `
    <div>
      <h2>Composant Récepteur</h2>
      <p *ngIf="receivedMessage">Message reçu : {{ receivedMessage }}</p>
    </div>
  `
})
export class ReceiverComponent implements OnInit, OnDestroy {
  receivedMessage: string = '';
  private subscription: Subscription = new Subscription();
  
  constructor(private communicationService: CommunicationService) { }
  
  ngOnInit(): void {
    this.subscription = this.communicationService.message$.subscribe(
      message => {
        this.receivedMessage = message;
        console.log('Nouveau message reçu :', message);
      }
    );
  }
  
  ngOnDestroy(): void {
    // Toujours se désabonner pour éviter les fuites de mémoire
    this.subscription.unsubscribe();
  }
}
```

### Pattern de Store Simple

Pour des applications avec gestion d'état plus complexe, vous pouvez implémenter un pattern store simple :

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AppState {
  todos: Todo[];
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  todos: [],
  user: null,
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class AppStore {
  private state = new BehaviorSubject<AppState>(initialState);
  state$ = this.state.asObservable();
  
  // Sélecteurs
  todos$ = this.state$.pipe(map(state => state.todos));
  user$ = this.state$.pipe(map(state => state.user));
  loading$ = this.state$.pipe(map(state => state.loading));
  error$ = this.state$.pipe(map(state => state.error));
  
  // Actions
  addTodo(todo: Todo): void {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      todos: [...currentState.todos, todo]
    });
  }
  
  updateUser(user: User): void {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      user
    });
  }
  
  setLoading(loading: boolean): void {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      loading
    });
  }
  
  setError(error: string | null): void {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      error
    });
  }
}
```

## Communication via ViewChild et ContentChild

Pour accéder directement aux propriétés et méthodes d'un composant enfant depuis le parent, Angular fournit les décorateurs `@ViewChild` et `@ContentChild`.

### ViewChild

`@ViewChild` permet d'accéder à un enfant qui fait partie du template du composant parent.

```typescript
// Composant Enfant
import { Component } from '@angular/core';

@Component({
  selector: 'app-countdown',
  template: `
    <h2>Compte à rebours : {{ count }}</h2>
    <p>{{ message }}</p>
  `
})
export class CountdownComponent {
  count: number = 10;
  message: string = '';
  
  start(): void {
    this.message = 'Compte à rebours démarré !';
    const interval = setInterval(() => {
      this.count--;
      if (this.count === 0) {
        clearInterval(interval);
        this.message = 'Terminé !';
      }
    }, 1000);
  }
  
  reset(): void {
    this.count = 10;
    this.message = 'Réinitialisé';
  }
}

// Composant Parent
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CountdownComponent } from './countdown.component';

@Component({
  selector: 'app-timer',
  template: `
    <div>
      <h1>Minuteur</h1>
      <app-countdown></app-countdown>
      <button (click)="startCountdown()">Démarrer</button>
      <button (click)="resetCountdown()">Réinitialiser</button>
    </div>
  `
})
export class TimerComponent implements AfterViewInit {
  @ViewChild(CountdownComponent) countdown!: CountdownComponent;
  
  ngAfterViewInit(): void {
    // Accès aux propriétés de l'enfant
    console.log('État initial du compte à rebours :', this.countdown.count);
    
    // Attention : Évitez de modifier des propriétés de l'enfant ici
    // car cela pourrait provoquer une erreur ExpressionChangedAfterItHasBeenChecked
  }
  
  startCountdown(): void {
    // Appel d'une méthode de l'enfant
    this.countdown.start();
  }
  
  resetCountdown(): void {
    this.countdown.reset();
  }
}
```

### ContentChild

`@ContentChild` permet d'accéder à un contenu projeté via `<ng-content>`.

```typescript
// Composant avec projection de contenu
import { Component, ContentChild, AfterContentInit } from '@angular/core';
import { TabItemComponent } from './tab-item.component';

@Component({
  selector: 'app-tab-container',
  template: `
    <div class="tab-container">
      <div class="tab-content">
        <ng-content></ng-content>
      </div>
      <div class="tab-actions" *ngIf="activeTab">
        <p>Onglet actif : {{ activeTab.title }}</p>
        <button (click)="activeTab.activate()">Activer</button>
      </div>
    </div>
  `
})
export class TabContainerComponent implements AfterContentInit {
  @ContentChild(TabItemComponent) activeTab!: TabItemComponent;
  
  ngAfterContentInit(): void {
    // L'accès au contenu projeté est disponible ici
    if (this.activeTab) {
      console.log('Onglet projeté :', this.activeTab.title);
    }
  }
}

// Composant d'onglet
@Component({
  selector: 'app-tab-item',
  template: `
    <div class="tab-item" [class.active]="isActive">
      <h3>{{ title }}</h3>
      <div class="content">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class TabItemComponent {
  @Input() title: string = '';
  isActive: boolean = false;
  
  activate(): void {
    this.isActive = true;
    console.log(`Onglet ${this.title} activé`);
  }
}

// Utilisation
@Component({
  selector: 'app-tabs-example',
  template: `
    <app-tab-container>
      <app-tab-item title="Profil">
        Contenu du profil...
      </app-tab-item>
    </app-tab-container>
  `
})
export class TabsExampleComponent { }
```

## Communication via le State Management

Pour des applications complexes, une solution de gestion d'état comme NgRx peut être plus appropriée.

### Exemple Simplifié avec NgRx

```typescript
// Actions
import { createAction, props } from '@ngrx/store';

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ text: string }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: number }>()
);

// Reducer
import { createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
}

export const initialState: TodoState = {
  todos: []
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { text }) => ({
    ...state,
    todos: [...state.todos, { id: Date.now(), text, completed: false }]
  })),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  }))
);

// Composant d'ajout
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TodoActions from '../store/todo.actions';

@Component({
  selector: 'app-add-todo',
  template: `
    <div>
      <input #todoText placeholder="Nouvelle tâche">
      <button (click)="addTodo(todoText.value); todoText.value = ''">
        Ajouter
      </button>
    </div>
  `
})
export class AddTodoComponent {
  constructor(private store: Store) { }
  
  addTodo(text: string): void {
    if (text.trim()) {
      this.store.dispatch(TodoActions.addTodo({ text }));
    }
  }
}

// Composant de liste
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../store/todo.reducer';
import * as TodoActions from '../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  template: `
    <ul>
      <li *ngFor="let todo of todos$ | async" 
          [class.completed]="todo.completed"
          (click)="toggleTodo(todo.id)">
        {{ todo.text }}
      </li>
    </ul>
  `
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  
  constructor(private store: Store<{ todos: TodoState }>) { }
  
  ngOnInit(): void {
    this.todos$ = this.store.pipe(select(state => state.todos.todos));
  }
  
  toggleTodo(id: number): void {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }
}
```

## Communication Locale entre Composants

Pour les cas simples où des composants sont étroitement liés mais ne nécessitent pas un service ou un state management, Angular offre quelques options supplémentaires.

### Communication via le Composant Parent

Deux composants enfants peuvent communiquer indirectement via leur parent commun :

```typescript
// Parent
@Component({
  selector: 'app-parent',
  template: `
    <div>
      <app-sender (sendData)="handleData($event)"></app-sender>
      <app-receiver [receivedData]="sharedData"></app-receiver>
    </div>
  `
})
export class ParentComponent {
  sharedData: any;
  
  handleData(data: any): void {
    this.sharedData = data;
  }
}

// Premier enfant (émetteur)
@Component({
  selector: 'app-sender',
  template: `
    <button (click)="sendDataToSibling()">Envoyer aux frères</button>
  `
})
export class SenderComponent {
  @Output() sendData = new EventEmitter<any>();
  
  sendDataToSibling(): void {
    this.sendData.emit({ message: 'Bonjour du sender !', timestamp: new Date() });
  }
}

// Deuxième enfant (récepteur)
@Component({
  selector: 'app-receiver',
  template: `
    <div *ngIf="receivedData">
      Message du frère : {{ receivedData.message }}
      ({{ receivedData.timestamp | date:'short' }})
    </div>
  `
})
export class ReceiverComponent {
  @Input() receivedData: any;
}
```

### Partage de Données via Template Reference Variables

Une autre approche simple consiste à utiliser des variables de référence dans le template :

```html
<div>
  <app-counter #counter></app-counter>
  
  <app-controls [counter]="counter"></app-controls>
</div>
```

```typescript
// Composant Counter
@Component({
  selector: 'app-counter',
  template: `<div>Compteur : {{ count }}</div>`
})
export class CounterComponent {
  count = 0;
  
  increment(): void {
    this.count++;
  }
  
  decrement(): void {
    this.count--;
  }
  
  reset(): void {
    this.count = 0;
  }
}

// Composant Controls
@Component({
  selector: 'app-controls',
  template: `
    <button (click)="counter.increment()">+</button>
    <button (click)="counter.decrement()">-</button>
    <button (click)="counter.reset()">Reset</button>
  `
})
export class ControlsComponent {
  @Input() counter!: CounterComponent;
}
```

## Meilleures Pratiques

### Quand Utiliser Chaque Méthode

1. **@Input/@Output**
   - Utilisez pour la communication directe parent-enfant
   - Idéal pour les données simples et les événements ponctuels
   - Meilleure option pour les composants réutilisables

2. **Services**
   - Utilisez pour la communication entre composants sans relation directe
   - Idéal pour les données partagées à travers plusieurs composants
   - Parfait pour l'état local d'une fonctionnalité

3. **ViewChild/ContentChild**
   - Utilisez quand le parent a besoin d'accéder directement aux propriétés ou méthodes de l'enfant
   - Utile pour les composants composites comme les tabs, accordéons, etc.
   - À utiliser avec modération pour maintenir un bon encapsulation

4. **State Management (NgRx)**
   - Utilisez pour les applications de grande taille avec un état complexe
   - Idéal quand de nombreux composants partagent le même état
   - Quand vous avez besoin d'un historique des changements d'état

### Pièges à Éviter

1. **Ne pas se désabonner des observables**
   ```typescript
   // Toujours se désabonner dans ngOnDestroy
   ngOnDestroy(): void {
     this.subscription.unsubscribe();
   }
   ```

2. **Sur-architecturer les petites applications**
   - N'introduisez pas NgRx ou une solution complexe si des services simples suffisent

3. **Détecter les changements manuellement**
   ```typescript
   constructor(private cd: ChangeDetectorRef) { }
   
   someMethod(): void {
     // Si les données sont mises à jour en dehors du cycle de détection
     this.value = newValue;
     this.cd.detectChanges(); // ou this.cd.markForCheck() avec OnPush
   }
   ```

4. **Utiliser OnPush pour l'optimisation**
   ```typescript
   @Component({
     selector: 'app-optimized',
     template: `...`,
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class OptimizedComponent {
     @Input() data: any;
     // Ce composant ne sera rafraîchi que quand les inputs changent
   }
   ```

## Conclusion

La communication entre composants est un aspect fondamental du développement d'applications Angular. Le choix de la méthode appropriée dépend de la relation entre les composants, de la complexité de l'application, et des exigences spécifiques.

Pour les applications simples, les décorateurs `@Input` et `@Output` combinés avec des services partagés sont généralement suffisants. Pour les applications plus complexes avec de nombreux composants et un état partagé, une solution de gestion d'état comme NgRx peut offrir une meilleure maintenabilité et performance.

La clé est de maintenir une architecture claire où les responsabilités de communication sont bien définies, ce qui conduit à des applications plus faciles à comprendre, à tester et à maintenir.
