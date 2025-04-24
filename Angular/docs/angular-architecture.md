# Architecture d'application Angular

L'architecture d'une application Angular est cruciale pour sa maintenabilité et son évolutivité. Voici une exploration des modèles architecturaux les plus efficaces pour structurer votre code Angular de manière optimale.

## Feature Modules

Les Feature Modules constituent une approche de découpage modulaire qui permet d'organiser votre application par fonctionnalités.

### Avantages des Feature Modules

- **Découpage logique** : Chaque fonctionnalité est isolée dans son propre module
- **Chargement paresseux** (lazy loading) : Optimisation des performances par chargement à la demande
- **Séparation des responsabilités** : Meilleure organisation du code
- **Réutilisabilité** : Possibilité de réutiliser des fonctionnalités entre applications

### Structure typique

```
src/
├── app/
│   ├── core/             // Services singleton, intercepteurs, guards
│   ├── shared/           // Composants/directives partagés entre modules
│   ├── features/
│   │   ├── feature-a/    // Module fonctionnel A
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── feature-a-routing.module.ts
│   │   │   └── feature-a.module.ts
│   │   └── feature-b/    // Module fonctionnel B
│   ├── app-routing.module.ts
│   └── app.module.ts
```

### Configuration d'un Feature Module avec Lazy Loading

```typescript
// Dans app-routing.module.ts
const routes: Routes = [
  {
    path: 'feature-a',
    loadChildren: () => import('./features/feature-a/feature-a.module')
      .then(m => m.FeatureAModule)
  }
];

// Dans feature-a.module.ts
@NgModule({
  declarations: [
    FeatureAComponent,
    // autres composants
  ],
  imports: [
    CommonModule,
    FeatureARoutingModule,
    SharedModule
  ]
})
export class FeatureAModule { }
```

## Smart Components vs Presentational Components

Cette approche de conception divise les composants selon leur responsabilité.

### Smart Components (Container Components)

Caractéristiques:
- Gèrent l'état et la logique métier
- Interagissent avec les services et le store
- Transmettent des données aux Presentational Components
- Réagissent aux événements des composants enfants

```typescript
@Component({
  selector: 'app-user-dashboard',
  template: `
    <app-user-profile 
      [user]="user$ | async" 
      (updateProfile)="onUpdateProfile($event)">
    </app-user-profile>
    <app-user-activity 
      [activities]="activities$ | async">
    </app-user-activity>
  `
})
export class UserDashboardComponent implements OnInit {
  user$: Observable<User>;
  activities$: Observable<Activity[]>;
  
  constructor(private userService: UserService) {}
  
  ngOnInit() {
    this.user$ = this.userService.getCurrentUser();
    this.activities$ = this.userService.getUserActivities();
  }
  
  onUpdateProfile(userData: UserUpdateData) {
    this.userService.updateUserProfile(userData);
  }
}
```

### Presentational Components (Dumb Components)

Caractéristiques:
- Focalisés sur l'interface utilisateur
- Ne dépendent pas des services
- Reçoivent des données via @Input()
- Émettent des événements via @Output()
- Réutilisables et testables facilement

```typescript
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent {
  @Input() user: User;
  @Output() updateProfile = new EventEmitter<UserUpdateData>();
  
  onSubmit(formData: UserUpdateData) {
    this.updateProfile.emit(formData);
  }
}
```

### Bénéfices de cette séparation

- **Réutilisabilité** : Les composants présentationnels peuvent être réutilisés
- **Testabilité** : Composants plus faciles à tester unitairement 
- **Maintenabilité** : Séparation claire des responsabilités
- **Performance** : Les composants présentationnels peuvent utiliser OnPush
- **Flexibilité** : Adaptabilité à différentes sources de données

## Core Module et Shared Module

### Core Module

Le Core Module contient des services singleton et des composants utilisés exactement une fois dans l'application.

```typescript
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  // Prévient l'importation multiple du module Core
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule est déjà chargé. Importez-le uniquement dans AppModule');
    }
  }
}
```

### Shared Module

Le Shared Module contient des composants, directives et pipes réutilisables à travers différents modules.

```typescript
@NgModule({
  declarations: [
    HighlightDirective,
    TruncatePipe,
    CardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    HighlightDirective,
    TruncatePipe,
    CardComponent
  ]
})
export class SharedModule { }
```

## Architecture basée sur les états

Pour les applications complexes, une architecture centrée sur la gestion des états peut être adoptée.

### Avec NgRx

```
src/
├── app/
│   ├── core/
│   ├── shared/
│   ├── features/
│   │   ├── products/
│   │   │   ├── components/
│   │   │   ├── containers/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   │   ├── actions/
│   │   │   │   ├── effects/
│   │   │   │   ├── reducers/
│   │   │   │   └── selectors/
│   │   │   ├── products-routing.module.ts
│   │   │   └── products.module.ts
```

### Architecture Component Store (plus légère)

Pour des modules nécessitant une gestion d'état mais où NgRx serait trop lourd.

```typescript
@Injectable()
export class TodosStore extends ComponentStore<TodosState> {
  constructor(private todosService: TodosService) {
    super({ todos: [], loading: false });
  }

  // Selectors
  readonly todos$ = this.select(state => state.todos);
  readonly loading$ = this.select(state => state.loading);
  
  // Updaters
  readonly addTodo = this.updater((state, todo: Todo) => ({
    ...state,
    todos: [...state.todos, todo]
  }));
  
  // Effects
  readonly loadTodos = this.effect(() => {
    this.patchState({ loading: true });
    return this.todosService.getTodos().pipe(
      tap(todos => {
        this.patchState({ todos, loading: false });
      })
    );
  });
}
```

## Bonnes pratiques architecturales

1. **Single Responsibility Principle** : Chaque composant/service a une seule responsabilité
2. **Isolation des effets de bord** : Séparer la logique pure des effets secondaires (API, etc.)
3. **Immutabilité** : Favoriser les patterns immutables pour la gestion d'état
4. **Découplage** : Minimiser les dépendances entre modules
5. **Cohérence** : Utiliser des conventions de nommage et structures cohérentes

## Architecture adaptée à la taille du projet

### Petite application
- Module unique avec smart/dumb components
- Services pour la logique partagée
- BehaviorSubject pour l'état si nécessaire

### Application moyenne
- Feature Modules avec lazy loading
- Core et Shared Modules
- Smart/Dumb Components
- Services avec BehaviorSubject ou ComponentStore

### Grande application
- Architecture modulaire complète
- NgRx/NGXS pour la gestion d'état globale
- Façades pour isoler l'utilisation du store
- Design system pour l'interface utilisateur

## Scalabilité et évolution

Pour assurer la scalabilité de votre architecture Angular:

1. **Séparer dès le début** : Anticiper la croissance en séparant les responsabilités
2. **Documentation** : Documenter les choix architecturaux et les patterns utilisés
3. **Tests** : Mettre en place des tests qui valident l'architecture (lint, tests unitaires)
4. **Refactoring progressif** : Refactoriser régulièrement pour éviter la dette technique

En adoptant ces approches architecturales, vous pourrez construire des applications Angular robustes, maintenables et évolutives qui résistent à l'épreuve du temps et à la croissance de votre application.
