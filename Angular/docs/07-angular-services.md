# Services et Injection de dépendances avec Angular

Les services Angular sont essentiels pour séparer la logique métier de la logique d’interface. Grâce à l’injection de dépendance :

- les services sont facilement réutilisables,
- testables indépendamment,
- et instanciés efficacement par Angular.

Angular offre plusieurs méthodes pour accéder aux données JSON provenant d'API REST. Ce document explore les différentes approches, leurs avantages et cas d'utilisation spécifiques.

## Table des matières
- [Qu’est-ce qu’un service ?](#quest-ce-quun-service-)
- [Créer un service](#créer-un-service)
- [L'injection de dépendance](#linjection-de-dépendance)
- [Portée des services](#portée-des-services)
- [Injection dans d'autres services](#injection-dans-dautres-services)
- [Tester un service](#tester-un-service)
- [Le service HttpClient](#le-service-httpclient)
- [Méthodes de requêtes HTTP](#méthodes-de-requêtes-http)
- [Gestion des réponses avec RxJS](#gestion-des-réponses-avec-rxjs)
- [Intercepteurs HTTP](#intercepteurs-http)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Services de données](#services-de-données)
- [Caching des données](#caching-des-données)
- [Environnements de développement](#environnements-de-développement)
- [Comparaison des approches](#comparaison-des-approches)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Qu’est-ce qu’un service ?

Un **service** est une classe contenant de la logique métier ou des fonctionnalités partagées, comme :

- des appels HTTP
- des opérations de journalisation (logs)
- des calculs complexes
- de la gestion d'état

Les services sont instanciés et injectés par Angular grâce à son système de DI.

---

## Créer un service

Utilise Angular CLI pour générer un service :

```bash
ng generate service data
```

Cela crée automatiquement un fichier `data.service.ts` :

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getMessage(): string {
    return 'Bonjour depuis le service !';
  }
}
```

---

## L'injection de dépendance

Angular injecte automatiquement un service dans le constructeur d’un composant :

```ts
import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  template: `<p>{{ message }}</p>`
})
export class AppComponent {
  message = '';

  constructor(private dataService: DataService) {
    this.message = this.dataService.getMessage();
  }
}
```

---

## Portée des services

| Emplacement | Portée |
|-------------|--------|
| `providedIn: 'root'` (par défaut) | Singleton global |
| `providers: []` dans un module | Portée limitée au module |
| `providers: []` dans un composant | Nouvelle instance propre à ce composant |

**Exemple : portée locale dans un composant**
```ts
@Component({
  selector: 'app-child',
  providers: [DataService],
  ...
})
```

---

## Injection dans d'autres services

Un service peut utiliser un autre service. Il suffit de l’injecter comme dans un composant :

```ts
@Injectable({
  providedIn: 'root'
})
export class LogService {
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  constructor(private logService: LogService) {}

  doSomething() {
    this.logService.log('Action effectuée.');
  }
}
```

---

## Tester un service

Angular fournit des outils intégrés pour tester les services avec `TestBed`.

**Exemple de test unitaire simple :**

```ts
import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should return a greeting', () => {
    expect(service.getMessage()).toBe('Bonjour depuis le service !');
  });
});
```

---
## Le service HttpClient

Le `HttpClient` est le service principal d'Angular pour effectuer des requêtes HTTP.

### Configuration

Pour l'utiliser, vous devez d'abord importer `HttpClientModule` dans votre module principal :

```typescript
// app.module.ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  // ...
})
export class AppModule { }
```

### Injection du service

Ensuite, injectez le service `HttpClient` dans vos composants ou services :

```typescript
// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.example.com/data';

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
```

## Méthodes de requêtes HTTP

`HttpClient` propose différentes méthodes correspondant aux verbes HTTP.

### GET - Récupérer des données

```typescript
// Récupérer tous les utilisateurs
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('https://api.example.com/users');
}

// Récupérer un utilisateur spécifique
getUser(id: number): Observable<User> {
  return this.http.get<User>(`https://api.example.com/users/${id}`);
}

// Avec des paramètres de requête
getUsersWithParams(page: number, limit: number): Observable<User[]> {
  const params = { page: page.toString(), limit: limit.toString() };
  return this.http.get<User[]>('https://api.example.com/users', { params });
}
```

### POST - Créer des données

```typescript
// Créer un nouvel utilisateur
createUser(user: User): Observable<User> {
  return this.http.post<User>('https://api.example.com/users', user);
}

// Avec des en-têtes personnalisés
createUserWithHeaders(user: User): Observable<User> {
  const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer token123' };
  return this.http.post<User>('https://api.example.com/users', user, { headers });
}
```

### PUT - Mettre à jour des données complètes

```typescript
// Mettre à jour un utilisateur existant (remplacement complet)
updateUser(id: number, user: User): Observable<User> {
  return this.http.put<User>(`https://api.example.com/users/${id}`, user);
}
```

### PATCH - Mettre à jour partiellement des données

```typescript
// Mettre à jour certains champs d'un utilisateur
patchUser(id: number, partialUser: Partial<User>): Observable<User> {
  return this.http.patch<User>(`https://api.example.com/users/${id}`, partialUser);
}
```

### DELETE - Supprimer des données

```typescript
// Supprimer un utilisateur
deleteUser(id: number): Observable<void> {
  return this.http.delete<void>(`https://api.example.com/users/${id}`);
}
```

### Options de requête

Vous pouvez configurer vos requêtes avec plusieurs options :

```typescript
getUsersWithOptions(): Observable<User[]> {
  return this.http.get<User[]>('https://api.example.com/users', {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.authToken
    }),
    params: new HttpParams()
      .set('page', '1')
      .set('limit', '10'),
    responseType: 'json',
    observe: 'response', // Pour obtenir la réponse HTTP complète
    reportProgress: true // Pour suivre la progression
  });
}
```

## Gestion des réponses avec RxJS

Les requêtes HTTP retournent des Observables, ce qui vous permet d'utiliser les opérateurs RxJS pour transformer et manipuler les données.

### Transformation des données

```typescript
getUserNames(): Observable<string[]> {
  return this.http.get<User[]>('https://api.example.com/users')
    .pipe(
      map(users => users.map(user => user.name))
    );
}
```

### Requêtes simultanées

```typescript
// Exécuter plusieurs requêtes en parallèle
getMultipleData(): Observable<[User[], Product[]]> {
  const users$ = this.http.get<User[]>('https://api.example.com/users');
  const products$ = this.http.get<Product[]>('https://api.example.com/products');
  
  return forkJoin([users$, products$]);
}
```

### Requêtes séquentielles

```typescript
// Exécuter des requêtes l'une après l'autre, en utilisant le résultat de la première
getUserWithPosts(userId: number): Observable<{user: User, posts: Post[]}> {
  return this.http.get<User>(`https://api.example.com/users/${userId}`)
    .pipe(
      switchMap(user => {
        return this.http.get<Post[]>(`https://api.example.com/users/${userId}/posts`)
          .pipe(
            map(posts => ({ user, posts }))
          );
      })
    );
}
```

### Réessai automatique

```typescript
getDataWithRetry(): Observable<any> {
  return this.http.get('https://api.example.com/data')
    .pipe(
      retry(3), // Réessayer 3 fois en cas d'échec
      catchError(this.handleError)
    );
}
```

## Intercepteurs HTTP

Les intercepteurs permettent de manipuler les requêtes et les réponses HTTP de manière globale.

### Création d'un intercepteur

```typescript
// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupérer le token depuis le stockage local
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      // Cloner la requête pour ajouter l'en-tête d'autorisation
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
```

### Enregistrement de l'intercepteur

```typescript
// app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
```

### Exemples d'intercepteurs utiles

#### Intercepteur de chargement

```typescript
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.show();
    
    return next.handle(req).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}
```

#### Intercepteur de cache

```typescript
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, HttpResponse<any>>();
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ne mettre en cache que les requêtes GET
    if (req.method !== 'GET') {
      return next.handle(req);
    }
    
    const cachedResponse = this.cache.get(req.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse.clone());
    }
    
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.urlWithParams, event.clone());
        }
      })
    );
  }
}
```

## Gestion des erreurs

La gestion des erreurs est cruciale lors des appels API.

### Gestion basique des erreurs

```typescript
getData(): Observable<any> {
  return this.http.get('https://api.example.com/data')
    .pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données:', error);
        return throwError(() => new Error('Échec de la récupération des données. Veuillez réessayer.'));
      })
    );
}
```

### Service de gestion d'erreurs centralisé

```typescript
// error.service.ts
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue s'est produite';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
        default:
          errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
      }
    }
    
    // Journalisation, notification, etc.
    console.error(errorMessage);
    
    return throwError(() => new Error(errorMessage));
  }
}
```

### Intercepteur d'erreurs global

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Rediriger vers la page de connexion
          this.router.navigate(['/login']);
        }
        
        return throwError(() => error);
      })
    );
  }
}
```

## Services de données

Il est recommandé de créer des services dédiés pour interagir avec les API REST.

### Structure de base d'un service

```typescript
// user.service.ts
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.example.com/users';
  
  constructor(private http: HttpClient) { }
  
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  
  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  
  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Utilisation du service dans un composant

```typescript
// user-list.component.ts
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  
  constructor(private userService: UserService) { }
  
  ngOnInit(): void {
    this.loading = true;
    this.userService.getAll().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        console.error(err);
      }
    });
  }
  
  deleteUser(id: number): void {
    this.userService.delete(id).subscribe({
      next: () => {
        // Filtrer l'utilisateur supprimé de la liste
        this.users = this.users.filter(user => user.id !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
      }
    });
  }
}
```

## Caching des données

La mise en cache des données peut améliorer considérablement les performances.

### Cache simple avec RxJS

```typescript
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.example.com/products';
  private productsCache$: Observable<Product[]> | null = null;
  
  constructor(private http: HttpClient) { }
  
  getProducts(): Observable<Product[]> {
    if (!this.productsCache$) {
      this.productsCache$ = this.http.get<Product[]>(this.apiUrl).pipe(
        shareReplay(1) // Conserver le dernier résultat en mémoire
      );
    }
    
    return this.productsCache$;
  }
  
  // Méthode pour forcer le rafraîchissement du cache
  refreshProducts(): Observable<Product[]> {
    this.productsCache$ = null;
    return this.getProducts();
  }
}
```

### Cache avec expiration

```typescript
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, {
    data: any,
    expiresAt: number
  }>();
  
  constructor() { }
  
  get(key: string): any {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Vérifier si le cache a expiré
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key: string, data: any, ttl: number = 60000): void {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { data, expiresAt });
  }
  
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}
```

### Mise en œuvre du service de cache

```typescript
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }
  
  getData(forceRefresh = false): Observable<any[]> {
    const cacheKey = 'api_data';
    const cachedData = this.cacheService.get(cacheKey);
    
    if (cachedData && !forceRefresh) {
      return of(cachedData);
    }
    
    return this.http.get<any[]>('https://api.example.com/data').pipe(
      tap(data => {
        // Mettre en cache pendant 5 minutes
        this.cacheService.set(cacheKey, data, 5 * 60 * 1000);
      })
    );
  }
}
```

## Environnements de développement

Angular permet de configurer différents environnements pour vos API.

### Configuration des environnements

```typescript
// environments/environment.ts (développement)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com'
};
```

### Utilisation dans les services

```typescript
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/data`);
  }
}
```

## Comparaison des approches

| Approche | Avantages | Inconvénients | Cas d'utilisation |
|----------|-----------|---------------|-------------------|
| **HttpClient basique** | Simple, intégré à Angular | Peu structuré pour les grands projets | Petites applications, prototypes |
| **Services dédiés** | Organisation claire, réutilisable | Un peu plus de boilerplate | Applications de toute taille |
| **Intercepteurs** | Traitement global, DRY | Peut être difficile à déboguer | Authentification, journalisation, gestion d'erreurs |
| **Cache RxJS** | Évite les requêtes redondantes | Complexité accrue | Données qui changent peu |
| **State Management** (NgRx, etc.) | Gestion complète de l'état, débogage | Courbe d'apprentissage, verbosité | Applications complexes avec de nombreuses interdépendances |

## Bonnes pratiques

### Structure et organisation

1. **Créer des interfaces** pour typer vos données :
   ```typescript
   interface User {
     id: number;
     name: string;
     email: string;
     role: 'admin' | 'user';
   }
   ```

2. **Centraliser les URL API** dans des constantes ou des environnements :
   ```typescript
   const API_ENDPOINTS = {
     users: `${environment.apiUrl}/users`,
     products: `${environment.apiUrl}/products`,
     orders: `${environment.apiUrl}/orders`
   };
   ```

3. **Organiser les services par domaine** fonctionnel plutôt que par type technique

### Performance et fiabilité

1. **Annuler les requêtes** en cours lorsque cela est pertinent :
   ```typescript
   ngOnInit(): void {
     this.searchSubscription = this.searchForm.valueChanges.pipe(
       debounceTime(300),
       switchMap(term => this.searchService.search(term))
     ).subscribe(results => this.results = results);
   }
   
   ngOnDestroy(): void {
     if (this.searchSubscription) {
       this.searchSubscription.unsubscribe();
     }
   }
   ```

2. **Utiliser des opérateurs RxJS** appropriés :
   - `switchMap` pour les requêtes où seule la dernière réponse est pertinente
   - `mergeMap` pour les requêtes parallèles indépendantes
   - `concatMap` pour les requêtes qui doivent être séquentielles
   - `exhaustMap` pour ignorer les nouvelles requêtes tant que la précédente n'est pas terminée

3. **Implémenter le caching** pour les données fréquemment utilisées qui changent rarement

4. **Gérer les erreurs** à tous les niveaux

### Sécurité

1. **Valider les données** côté client avant de les envoyer

2. **Ne jamais faire confiance** aux données reçues sans validation

3. **Utiliser des intercepteurs** pour l'authentification et la sécurisation des requêtes

4. **Éviter de stocker** des informations sensibles dans le localStorage ou sessionStorage

### Tests

1. **Utiliser HttpTestingController** pour tester les services API :
   ```typescript
   describe('UserService', () => {
     let service: UserService;
     let httpMock: HttpTestingController;
     
     beforeEach(() => {
       TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [UserService]
       });
       
       service = TestBed.inject(UserService);
       httpMock = TestBed.inject(HttpTestingController);
     });
     
     it('should fetch users', () => {
       const mockUsers: User[] = [
         { id: 1, name: 'John', email: 'john@example.com', role: 'user' }
       ];
       
       service.getAll().subscribe(users => {
         expect(users).toEqual(mockUsers);
       });
       
       const req = httpMock.expectOne('https://api.example.com/users');
       expect(req.request.method).toBe('GET');
       req.flush(mockUsers);
     });
   });
   ```

2. **Mocker les services** API dans les tests de composants

En suivant ces approches et bonnes pratiques, vous pourrez créer des applications Angular robustes qui interagissent efficacement avec des API REST.