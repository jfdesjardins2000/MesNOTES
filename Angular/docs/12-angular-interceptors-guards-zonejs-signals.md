# Interceptors, Guards, zone.js et Signals

Aller à la section :
* [Partie 1: Les Guards en Angular](#guards)
* [Partie 2: Les Interceptors HTTP en Angular](#Interceptors)
* [Partie 3 : Zone.js et la Détection d'Événements dans Angular](#zonejs)
* [Partie 4: Les Signals ](#signals)


---

## Introduction

Les interceptors et guards sont des éléments essentiels pour sécuriser et enrichir les applications Angular. Ces fonctionnalités ont connu une transformation significative avec l'évolution vers l'architecture standalone. Cet article explore en détail ces deux concepts, leur fonctionnement traditionnel et leur implémentation moderne.

<a id="guards"></a>
## Partie 1: Les Guards en Angular

### Concept et Rôle des Guards

Les guards sont des mécanismes de protection des routes qui permettent ou empêchent la navigation de l'utilisateur selon certaines conditions. Ils répondent à des questions cruciales telles que:

- L'utilisateur est-il autorisé à accéder à cette page?
- L'utilisateur peut-il quitter cette page avec des modifications non enregistrées?
- Les données nécessaires sont-elles chargées avant l'affichage de la page?

### Types de Guards Traditionnels

Avant Angular 15, les guards étaient principalement implémentés comme des classes implémentant des interfaces spécifiques:

1. **CanActivate**: Détermine si une route peut être activée
2. **CanActivateChild**: Contrôle l'accès aux routes enfants
3. **CanDeactivate**: Vérifie si l'utilisateur peut quitter une route
4. **CanLoad**: Détermine si un module peut être chargé paresseusement
5. **Resolve**: Pré-charge des données avant d'activer la route

![route-guards](../images/route-guards.png)

### Implémentation Traditionnelle avec NgModule

Avec l'approche NgModule, les guards étaient définis comme des classes avec des interfaces:

```typescript
// auth.guard.ts - Approche NgModule
import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    // Redirection vers la page de connexion
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
```

Puis ils étaient utilisés dans la configuration des routes:

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedChangesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### Guards Fonctionnels (Angular 15+)

À partir d'Angular 15, les guards peuvent être implémentés comme de simples fonctions, ce qui simplifie considérablement le code:

```typescript
// auth.guard.ts - Approche Standalone
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.createUrlTree(['/login'], { 
    queryParams: { returnUrl: state.url }
  });
};
```

Utilisation avec le routage standalone:

```typescript
// routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard]
  }
];
```

### Nouvelles API de Guards (Angular 16+)

Angular 16 a introduit de nouvelles API pour les guards qui remplacent les interfaces précédentes:

```typescript
// admin.guard.ts
import { inject } from '@angular/core';
import { 
  CanActivateFn, 
  CanMatchFn 
} from '@angular/router';
import { AuthService } from './auth.service';

export const canActivateAdmin: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.hasAdminRole();
};

export const canMatchAdmin: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  return authService.hasAdminRole();
};
```

### CanMatch vs CanActivate

Avec Angular 14+, `canMatch` a été introduit comme remplacement de `canLoad`:

- **canActivate**: Vérifie après que la route correspond, mais avant l'activation
- **canMatch**: Vérifie pendant le processus de correspondance des URL, avant même que la route ne soit considérée comme correspondante

```typescript
const routes: Routes = [
  {
    path: 'admin',
    canMatch: [canMatchAdmin], // Vérifié pendant la correspondance des routes
    loadChildren: () => import('./admin/admin.routes').then(r => r.ADMIN_ROUTES)
  }
];
```

### Utilisation Avancée des Guards

#### Guard Combinant Plusieurs Conditions

```typescript
export const complexGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const featureService = inject(FeatureService);
  const router = inject(Router);
  
  // Combinaison de plusieurs conditions
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }
  
  if (!featureService.isFeatureEnabled('admin-panel')) {
    return router.createUrlTree(['/access-denied']);
  }
  
  return true;
};
```

#### Guard avec Observables et Promesses

```typescript
export const asyncGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  try {
    // Attendre une vérification asynchrone
    const hasPermission = await userService.checkPermission(route.params.id);
    
    if (hasPermission) {
      return true;
    } else {
      return router.createUrlTree(['/unauthorized']);
    }
  } catch (error) {
    console.error('Permission check failed', error);
    return router.createUrlTree(['/error']);
  }
};
```

#### Data Resolver Fonctionnel

```typescript
// user-data.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from './user.service';
import { catchError, of } from 'rxjs';

export const userDataResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const userId = route.paramMap.get('id');
  
  return userService.getUser(userId).pipe(
    catchError(() => {
      // Retourner un utilisateur par défaut en cas d'erreur
      return of({ id: userId, name: 'Unknown', role: 'guest' });
    })
  );
};

// Utilisation
const routes: Routes = [
  {
    path: 'users/:id',
    component: UserDetailComponent,
    resolve: { user: userDataResolver }
  }
];
```
---

<a id="Interceptors"></a>

## Partie 2: Les Interceptors HTTP en Angular

### Concept et Rôle des Interceptors

Les interceptors HTTP sont des services qui permettent d'intercepter et de modifier les requêtes HTTP entrantes et sortantes. Ils sont particulièrement utiles pour:

- Ajouter des en-têtes d'authentification (tokens JWT)
- Gérer les erreurs de manière centralisée
- Implémenter des logs ou métriques pour les requêtes
- Gérer les indicateurs de chargement global
- Transformer les réponses

### Interceptors avec NgModule

Dans l'approche traditionnelle, les interceptors étaient implémentés comme des classes avec l'interface `HttpInterceptor`:

```typescript
// auth.interceptor.ts - Approche NgModule
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>, 
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    
    if (token) {
      // Cloner la requête et ajouter le token
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return next.handle(authRequest);
    }
    
    return next.handle(request);
  }
}
```

Puis ils étaient enregistrés dans le module principal:

```typescript
// app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Interceptors avec l'Architecture Standalone

Angular 16+ a introduit une nouvelle façon de configurer les interceptors avec l'approche standalone via la fonction `provideHttpClient`:

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { errorInterceptor } from './app/interceptors/error.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor
      ])
    )
  ]
});
```

Les interceptors sont désormais implémentés sous forme de fonctions:

```typescript
// auth.interceptor.ts - Approche Standalone
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(authReq);
  }
  
  return next(req);
};
```

### Support des Interceptors de Classe Existants

Pour la compatibilité avec les interceptors de classe existants, Angular fournit `withInterceptorsFromDi`:

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { 
  provideHttpClient, 
  withInterceptors, 
  withInterceptorsFromDi 
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { LegacyInterceptor } from './app/interceptors/legacy.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    // Interceptor de classe existant
    { provide: HTTP_INTERCEPTORS, useClass: LegacyInterceptor, multi: true },
    
    provideHttpClient(
      // Nouveaux interceptors fonctionnels
      withInterceptors([authInterceptor]),
      // Support des interceptors de classe
      withInterceptorsFromDi()
    )
  ]
});
```

### Exemples Avancés d'Interceptors

#### Interceptor de Gestion d'Erreurs

```typescript
// error.interceptor.ts
import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError(error => {
      switch (error.status) {
        case HttpStatusCode.Unauthorized:
          notificationService.showError('Session expirée. Veuillez vous reconnecter.');
          router.navigate(['/login']);
          break;
          
        case HttpStatusCode.Forbidden:
          notificationService.showError('Vous n\'avez pas les droits nécessaires.');
          break;
          
        case HttpStatusCode.NotFound:
          notificationService.showError('La ressource demandée n\'existe pas.');
          break;
          
        case HttpStatusCode.InternalServerError:
          notificationService.showError('Une erreur serveur est survenue.');
          break;
          
        default:
          notificationService.showError('Une erreur est survenue.');
      }
      
      return throwError(() => error);
    })
  );
};
```

#### Interceptor de Cache

```typescript
// cache.interceptor.ts
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Ne mettre en cache que les requêtes GET
  if (req.method !== 'GET') {
    return next(req);
  }
  
  const cacheService = inject(CacheService);
  const cachedResponse = cacheService.get(req.url);
  
  // Retourner la réponse en cache si disponible
  if (cachedResponse) {
    return of(cachedResponse);
  }
  
  // Sinon, exécuter la requête et mettre en cache la réponse
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cacheService.set(req.url, event, 60000); // Mettre en cache pour 1 minute
      }
    })
  );
};
```

#### Interceptor de Journalisation

```typescript
// logging.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const loggingService = inject(LoggingService);
  const startTime = Date.now();
  
  loggingService.logInfo(`Request ${req.method} ${req.url} started`);
  
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === 0) { // HttpEventType.Sent
          loggingService.logInfo(`Request ${req.method} ${req.url} sent`);
        }
      },
      error: (error) => {
        loggingService.logError(`Request ${req.method} ${req.url} failed: ${error.message}`);
      }
    }),
    finalize(() => {
      const duration = Date.now() - startTime;
      loggingService.logInfo(`Request ${req.method} ${req.url} completed in ${duration}ms`);
    })
  );
};
```

## Tableau Comparatif: NgModule vs Standalone

| Aspect | Approche NgModule | Approche Standalone |
|--------|------------------|---------------------|
| **Guards** |||
| Type | Classes avec interfaces | Fonctions |
| Injection | Constructor injection | `inject()` function |
| Configuration | Arrays dans les routes | Identique |
| Testabilité | Nécessite TestBed | Plus simple avec des fonctions |
| Syntaxe | Verbose | Concise |
| **Interceptors** |||
| Type | Classes avec interfaces | Fonctions |
| Enregistrement | Via `HTTP_INTERCEPTORS` | Via `withInterceptors()` |
| Configuration | Dans NgModule | Dans la fonction bootstrap |
| Ordre | Contrôlé via ordre des providers | Contrôlé via ordre dans l'array |
| Compatibilité | - | Support des deux approches |

## Chronologie d'Évolution

| Version | Date | Fonctionnalités pour Guards et Interceptors |
|---------|------|-------------------------------------------|
| Angular 2-4 | 2016-2017 | Introduction des guards (CanActivate, etc.) et interceptors basés sur des classes |
| Angular 7 | Oct 2018 | Améliorations des guards (meilleures typages) |
| Angular 14 | Juin 2022 | Introduction de CanMatch (remplaçant CanLoad) |
| Angular 15 | Nov 2022 | Guards fonctionnels introduits |
| Angular 16 | Mai 2023 | `provideHttpClient` et interceptors fonctionnels |
| Angular 17 | Nov 2023 | Approche fonctionnelle recommandée par défaut |

## Migration vers l'Approche Standalone

### Migration des Guards

```typescript
// Étape 1: Garder le guard existant
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(route, state) {
    // Logique existante
  }
}

// Étape 2: Créer une version fonctionnelle
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Même logique que dans la classe
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};

// Étape 3: Mettre à jour les routes pour utiliser la fonction
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard] // Utilisation de la fonction
  }
];
```

### Migration des Interceptors

```typescript
// Étape 1: Garder l'interceptor existant
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  
  intercept(req, next) {
    // Logique existante
  }
}

// Étape 2: Créer une version fonctionnelle
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Même logique que dans la classe
  const token = authService.getToken();
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  
  return next(req);
};

// Étape 3: Configurer l'application pour utiliser l'interceptor fonctionnel
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
});
```

## Bonnes Pratiques

### Pour les Guards

1. **Privilégier les fonctions sur les classes**: Adopter l'approche fonctionnelle pour le code plus concis et maintenable
2. **Séparer les préoccupations**: Chaque guard devrait vérifier une seule condition
3. **Mutualiser la logique**: Créer des fonctions réutilisables pour la logique commune entre guards
4. **Utiliser `inject()` stratégiquement**: Injecter uniquement les services nécessaires
5. **Préférer CanMatch à CanActivate** pour les vérifications de routage précoces

```typescript
// Exemple de mutualisation de logique
const checkAuthentication = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }
  
  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authResult = checkAuthentication();
  if (authResult !== true) return authResult;
  
  const userService = inject(UserService);
  return userService.hasAdminRole();
};
```

### Pour les Interceptors

1. **Ordre des interceptors**: Être attentif à l'ordre de déclaration (le premier déclaré est exécuté en premier)
2. **Transformer plutôt que modifier**: Cloner les requêtes avant modification pour maintenir l'immutabilité
3. **Gérer le cycle de vie complet**: Observer non seulement les réponses réussies mais aussi les erreurs
4. **Optimiser les performances**: Éviter les opérations coûteuses dans les interceptors exécutés pour chaque requête
5. **Conditionner l'interception**: Filtrer les URLs pour n'appliquer l'interceptor qu'aux requêtes pertinentes

```typescript
// Exemple d'interceptor avec filtrage d'URL
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Ignorer les requêtes vers des API externes
  if (!req.url.startsWith('/api')) {
    return next(req);
  }
  
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  
  return next(req);
};
```

## Conclusion

L'évolution des guards et interceptors dans Angular, passant des classes aux fonctions, s'inscrit dans la tendance globale du framework vers une approche plus légère et fonctionnelle. Ces changements offrent plusieurs avantages:

- **Code plus concis**: Réduction de la verbosité avec l'approche fonctionnelle
- **Meilleure testabilité**: Les fonctions sont généralement plus faciles à tester que les classes
- **Performance améliorée**: Optimisation potentielle du tree-shaking
- **Apprentissage facilité**: Concepts plus simples à comprendre pour les nouveaux développeurs

Bien que le support des implémentations basées sur les classes reste présent pour la compatibilité descendante, adopter l'approche fonctionnelle pour les nouveaux développements ou lors des migrations est désormais recommandé. Cette transition s'aligne parfaitement avec l'architecture standalone et la philosophie moderne d'Angular, visant à simplifier le développement tout en maintenant la robustesse et la flexibilité du framework.


---

<a id="zonejs"></a>

# Partie 3 : Zone.js et la Détection d'Événements dans Angular
![zonejs1](../images/zonejs-1.png)

## Qu'est-ce que `zone.js` ?

`zone.js` est une bibliothèque JavaScript utilisée par Angular pour suivre l'exécution de code asynchrone. Elle permet à Angular de savoir **quand le modèle de données a potentiellement changé** et qu'il doit déclencher une **détection de changements** pour mettre à jour l'affichage (DOM).

Angular s'appuie sur `zone.js` pour intercepter des opérations asynchrones comme :
- les événements du DOM (clics, saisies clavier, etc.),
- les timers (`setTimeout`, `setInterval`),
- les appels HTTP (`XMLHttpRequest`, `fetch`),
- les Promesses.

> En interceptant ces actions, `zone.js` permet à Angular de savoir automatiquement **quand** vérifier si l'état de l'application a changé.

## Le rôle de `zone.js` dans Angular

Angular utilise un système de **zones d’exécution** pour surveiller l’activité asynchrone. `zone.js` crée une sorte de "contexte" autour des appels asynchrones.

Quand une tâche asynchrone est terminée (par exemple un clic sur un bouton ou une requête réseau complétée), `zone.js` informe Angular, qui peut alors lancer une **détection des changements** (`Change Detection`).

Cela permet à Angular de mettre à jour automatiquement l'interface utilisateur **sans que le développeur ait besoin de le demander manuellement**.

![zonejs2](../images/zonejs-2.png)


## Exemple 1 : Clic de bouton

Prenons cet exemple :

```ts
@Component({
  selector: 'app-counter',
  template: `
    <button (click)="increment()">Increment</button>
    <p>{{ counter }}</p>
  `
})
export class CounterComponent {
  counter = 0;

  increment() {
    this.counter++;
  }
}
```

Lorsque l'utilisateur clique sur le bouton :

1. `zone.js` intercepte l'événement de clic.
2. Angular exécute `increment()`.
3. `zone.js` informe Angular que quelque chose a pu changer.
4. Angular relance sa détection de changement.
5. Le nouveau `counter` est affiché dans le DOM.

## Exemple 2 : setTimeout

```ts
setTimeout(() => {
  this.counter++;
}, 1000);
```

Même si ce `setTimeout` est externe à Angular, `zone.js` le détecte et force Angular à re-rendre le composant après l’exécution du callback.

## Comment Angular détecte les changements

Angular exécute une "boucle de détection" (`Change Detection`) qui :
1. Parcourt l’arbre des composants à partir du composant racine.
2. Compare les valeurs des propriétés liées au template.
3. Met à jour le DOM si nécessaire.

Cela garantit que l’interface utilisateur est toujours à jour avec l’état de l’application.

---

## Pourquoi c’est utile ?

Sans `zone.js`, Angular ne saurait pas **quand** quelque chose a changé, et tu devrais appeler manuellement une méthode comme `ChangeDetectorRef.detectChanges()` à chaque mise à jour.

Grâce à `zone.js`, Angular peut rester **réactif** tout en offrant une expérience de développement simple et déclarative.

## Peut-on désactiver `zone.js` ?

Oui, avec Angular 16+ et le système **signal-based**, il est possible de désactiver `zone.js` pour optimiser les performances et contrôler manuellement la détection des changements. Cela demande une approche plus fine et explicite.


## ⚠️ Limitations et Problèmes de Performance de `zone.js`

Il semble que zone.js soit un peu problématique au niveau de la performance:
[Angular: Zone.js Is Bad 😟](https://medium.com/coding-required/angular-zone-js-is-bad-d3ae48df98a7)

Bien que `zone.js` facilite la gestion automatique du cycle de vie et de la détection de changements, il peut devenir un **frein à la performance** dans certaines situations.

### Problèmes fréquents :

- **Détection trop fréquente** : chaque événement asynchrone déclenche une vérification du DOM, même si rien n’a changé.
- **Pas de ciblage précis** : Angular vérifie tout l’arbre de composants à partir de la racine, ce qui devient coûteux à grande échelle.
- **UI qui "rame"** : dans des applications riches (tableaux dynamiques, animations complexes), cela peut ralentir les interactions.


## 🔍 Pour savoir si le projet Angular utilise zone.js ou les signals, voici les vérifications simples à faire :

### Vérifier si zone.js est utilisé
#### Regarde dans **angular.json** :
Ouvre le fichier angular.json et cherche une ligne comme celle-ci dans "scripts" (sous architect > build > options ou test > options) :
```json
"scripts": [
  "node_modules/zone.js/dist/zone.js"
]
```
Si tu vois zone.js, alors tu utilises bien Zone.js pour la gestion du changement de détection.

#### Regarde dans **main.ts** :
Tu verras peut-être une ligne comme :
```typescript
import 'zone.js';  // Nécessaire pour Angular
```
* Si tu vois `bootstrapApplication` avec `{ ngZone: 'noop' }` dans les options, ton application utilise probablement les signals sans zone.js
* Si tu n'as pas cette configuration, tu utilises probablement zone.js

#### Vérifier le fichier **package.json**

* La présence de zone.js dans les dépendances indique son utilisation
* Pour les versions récentes d'Angular (17+), zone.js est optionnel si tu utilises les signals

#### Regarde dans tsconfig.app.json :
Si tu vois une ligne comme :
```json
"types": ["zone.js"]
```
C’est un autre indice que Zone.js est bien là.


#### 🧠 Vérifier si les signals sont utilisés

Cherche des imports comme ça :
```typescript
import { signal, computed, effect } from '@angular/core';
```
Si tu trouves ça, alors tu utilises les signals.

Cherche des appels à signal(...) ou computed(...) dans tes composants ou services :

```typescript
count = signal(0);
doubleCount = computed(() => this.count() * 2);
```


#### 🤔 Et si tu veux vraiment savoir ce qu’Angular utilise pour la détection des changements ?

* Angular 17+ permet de désactiver `zone.js` en utilisant le mode `Zone-less` (sans zone), mais **ce n’est pas automatique.**
* Tu peux aussi le vérifier dans `main.ts` avec la configuration de `bootstrapApplication()` :
```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
});
```
* Si tu vois provideZoneChangeDetection(...), tu utilises toujours Zone.js.
* Si tu vois provideSignals(), tu es probablement dans un setup moderne orienté Signals.


#### 🔍 Commandes complémentaires (via le terminal)
Il n'existe pas de commande CLI officielle Angular (ng ...) 
1. Chercher les imports signal dans le code :
```bash
grep -r "signal(" src/
```
2. Chercher les imports zone.js :
```bash
grep -r "zone.js" src/ angular.json
```
3. Tu peux voir si zone.js est installé dans ton projet :
```bash
npm list zone.js
```
4. Quelques autre commandes pour v/rifier:
```bash
# Vérifier si zone.js est présent dans package.json
grep -A 5 "zone.js" package.json

# Rechercher les imports de signals dans les fichiers TypeScript
grep -r "import.*signal" --include="*.ts" ./src

# Vérifier si ngZone: 'noop' est configuré dans main.ts
grep -r "ngZone.*noop" --include="main.ts" ./src
```


<a id="signals"></a>

## Partie 4: Les Signals dans Angular

### Alternatives pour améliorer la performance :

#### ✅ `ChangeDetectionStrategy.OnPush`
Indique à Angular de ne vérifier un composant que lorsque ses `@Input()` changent ou un `Observable` émet une nouvelle valeur.

#### ✅ `NgZone.runOutsideAngular()`
Permet d’exécuter du code (comme des animations ou des timers) sans déclencher de détection de changement.

#### ✅ [**Signals (Angular 16+)**](https://angular.dev/guide/signals)
![angular-signals](../images/signals.png)

**Les "signals" offrent une alternative moderne à `zone.js`**. 
Angular sait précisément quelles parties du DOM doivent être mises à jour, ce qui réduit drastiquement le coût des changements.

![angular-signals2](../images/signals2.png)

Avec cette approche, tu peux même désactiver complètement `zone.js` :

```ts
bootstrapApplication(AppComponent, {
  providers: [],
  zone: 'noop'
});
```

#### ✅ `ChangeDetectorRef`
Permet de contrôler manuellement quand Angular doit détecter les changements (`detectChanges()` ou `markForCheck()`).

---

### Un exemple de Signal :

```ts
// user.component.ts

import { Component, computed, signal } from '@angular/core';

import { DUMMY_USERS } from '../dummy-users';

const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {

  //selectedUser = DUMMY_USERS[randomIndex];
  selectedUser = signal(DUMMY_USERS[randomIndex]);

  // get imagePath(): string {
  //   // Assuming the images are stored in the 'assets/users' directory
  //   // and the avatar property contains the image file name.   
  //   return 'assets/users/' + this.selectedUser.avatar;
  // }

  imagePath = computed(() => {
    return 'assets/users/' + this.selectedUser().avatar;
  });

  onSelectUserClick() {
    const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    
    //this.selectedUser = DUMMY_USERS[randomIndex];
    this.selectedUser.set(DUMMY_USERS[randomIndex]);


    console.log('User selected:', this.selectedUser.name);
    
    // Optionally, you can also update the image path if needed}
     //this.imagePath = 'assets/users/' + this.selectedUser.avatar;
     console.log('Image path:', this.imagePath);
  }
}
```

```html
<!-- user.component.html -->
<div>
    <button (click)="onSelectUserClick()">
      <!-- <img [src]="imagePath" [alt]="selectedUser.name" />
      <span>{{ selectedUser.name }}</span> -->
      <img [src]="imagePath()" [alt]="selectedUser().name" />
      <span>{{ selectedUser().name }}</span>
    </button>
  </div>
  
```

### Explications des différences avec le Signal:
La différence que tu observes dans la syntaxe est due à l'utilisation des signals dans Angular. Voici l'explication :

**Avant les signals (approche traditionnelle)**
```html
<img [src]="imagePath" [alt]="selectedUser.name" />
<span>{{ selectedUser.name }}</span>
```
Dans cette approche, selectedUser était un objet simple et imagePath était soit une propriété, soit un getter. Angular accédait directement à ces propriétés.

**Avec les signals (nouvelle approche)**
```html
<img [src]="imagePath()" [alt]="selectedUser().name" />
<span>{{ selectedUser().name }}</span>
```
Quand tu utilises les signals, tu remarques deux changements importants :

Les parenthèses `()` : Avec les signals, tu dois appeler la fonction pour obtenir la valeur actuelle du signal. C'est pourquoi tu vois `selectedUser()` et `imagePath()` avec des parenthèses.
Accès aux propriétés : Pour accéder à une propriété d'un objet contenu dans un signal, tu dois d'abord **"déballer"** le signal en l'appelant comme une fonction (`selectedUser()`), puis accéder à sa propriété (`.name`).

**Pourquoi cette différence ?**

Les signals sont des **conteneurs réactifs** qui :

* Encapsulent les valeurs
* Notifient les changements
* Suivent les dépendances

Cette approche fonctionnelle **(`signal()` pour lire, `signal.set()` pour écrire)** permet à Angular de mieux suivre les dépendances entre tes données et l'interface utilisateur, ce qui améliore les performances puisque seules les parties de l'interface qui dépendent d'un signal modifié seront mises à jour.

C'est une différence syntaxique fondamentale entre l'approche traditionnelle et l'approche basée sur les signals dans Angular.


### Résumé

`zone.js` est un outil essentiel dans les versions classiques d’Angular. Il agit comme un **agent de surveillance** qui déclenche la détection des changements automatiquement après toute tâche asynchrone. Cela simplifie grandement le développement réactif et la gestion des interactions utilisateur.

Pour les projets où la performance et le contrôle sont critiques, Angular permet désormais de se passer de `zone.js`, en utilisant les **signals** et des stratégies de changement plus précises.

Les Signals représentent une évolution significative dans la façon dont Angular gère la réactivité. Contrairement au change detection traditionnel basé sur `zone.js`, les Signals offrent une approche explicite et performante pour la gestion de l'état.

Les principaux avantages des Signals sont :

* **Performance améliorée** : Le rendu est ciblé uniquement sur les composants qui dépendent des valeurs modifiées
* **Réactivité fine** : Le suivi des dépendances est précis et automatique
* **Syntaxe explicite** : L'utilisation des parenthèses (signal()) rend visible les sources de données réactives
* **Encapsulation** : Les méthodes `.set()`, `.update()` et `.mutate()` contrôlent strictement les modifications
* **Composabilité** : Avec `computed()`, on peut créer des valeurs dérivées qui se mettent à jour automatiquement

La transition vers les Signals marque une nouvelle ère pour Angular, où les applications peuvent devenir plus performantes tout en gardant une architecture prévisible et maintenable, réduisant progressivement la dépendance envers `zone.js` pour la détection des changements.


## Est-il possible d'utiliser zone.js ET les Signals dans un meme projet ?
Oui, il est tout à fait possible d'utiliser zone.js et les Signals simultanément dans un même projet Angular. C'est même l'approche recommandée pour la migration progressive des applications existantes.


**Comment cela fonctionne :**

1. **Coexistence naturelle** : Angular a été conçu pour que les `Signals` et `zone.js` puissent fonctionner ensemble sans conflit.
2. **Migration graduelle** : Tu peux commencer à utiliser les `Signals` dans certains composants tout en laissant d'autres utiliser l'approche traditionnelle avec `zone.js`.
3. **Détection hybride** : Un composant peut même utiliser les deux approches en interne - certaines propriétés peuvent être des Signals tandis que d'autres restent des propriétés standard.


### Exemple d'utilisation mixte :
```ts
@Component({
  selector: 'app-hybrid',
  template: `
    <div>Signal value: {{ counter() }}</div>
    <div>Traditional value: {{ traditionalCounter }}</div>
    <button (click)="increment()">Increment both</button>
  `
})
export class HybridComponent {
  // Signal approach
  counter = signal(0);
  
  // Traditional approach
  traditionalCounter = 0;
  
  increment() {
    // Update signal
    this.counter.update(value => value + 1);
    
    // Update traditional property
    this.traditionalCounter++;
  }
}
```

**Considérations :**

* Pour les **nouveaux développements** dans un projet existant, **privilégier les Signals lorsque c'est possible**
* Pour la maintenance de code existant, tu peux continuer à utiliser l'approche traditionnelle
* Dans les versions récentes d'Angular, tu as le choix d'opter pour un mode "sans zone.js" dans les nouveaux projets, mais ce n'est pas une obligation

L'équipe Angular a conçu cette transition pour être aussi fluide que possible, te permettant d'adopter les Signals à ton propre rythme.


### ZoneLess
Le mode "zoneless" (sans zone.js) est une option importante dans les applications Angular modernes utilisant les Signals. Voici ce qu'il faut savoir sur cette approche :

**Applications Angular sans zone.js**

Le mode "zoneless" permet de construire des applications Angular qui fonctionnent entièrement sans zone.js, en s'appuyant **uniquement sur les Signals et la détection de changement explicite**. Pour configurer une application en mode zoneless :

```ts
// Dans main.ts
bootstrapApplication(AppComponent, {
  providers: [
    { provide: NgZone, useValue: 'noop' }
  ]
});
```

#### Avantages du mode zoneless

1. **Performance améliorée** : Éliminer zone.js réduit la surcharge de surveillance des événements asynchrones
2. **Bundle plus léger** : La taille de l'application est réduite (zone.js représente environ 100 Ko non minifiés)
3. **Détection de changements prévisible**: Les mises à jour de l'UI sont explicites, sans "magie" en arrière-plan
4. **Meilleure interopérabilité** : Évite les conflits potentiels avec des bibliothèques tierces

#### Points d'attention

1. **Gestion manuelle** : Sans zone.js, tu dois gérer explicitement la détection de changements après les opérations asynchrones
2. **Utilisation de ChangeDetectorRef** : Pour les cas où tu as besoin de déclencher manuellement la détection de changements

```ts
constructor(private cdr: ChangeDetectorRef) {}

fetchData() {
  this.http.get('/api/data').subscribe(data => {
    this.data = data;
    this.cdr.detectChanges(); // Nécessaire en mode zoneless
  });
}
```
3. **Migration progressive** : Le passage complet au mode zoneless est généralement recommandé pour les nouvelles applications ou après une migration complète vers les Signals

Le mode zoneless représente l'avenir d'Angular, avec une architecture plus légère et plus prévisible, mais il demande une compréhension plus approfondie du cycle de détection des changements.