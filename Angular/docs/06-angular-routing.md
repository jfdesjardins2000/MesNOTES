# Le Routing en Angular: De NgModule à Standalone

## Introduction au Routing Angular

Le système de routage est une fonctionnalité essentielle d'Angular qui permet de naviguer entre différentes vues sans rechargement complet de la page. Il s'agit d'un élément fondamental pour la création d'applications à page unique (SPA). Comme pour d'autres aspects du framework, le routing a connu une évolution significative avec l'introduction des composants standalone.

## Principes Fondamentaux du Routing

Avant d'explorer l'évolution du routing, rappelons les concepts clés qui demeurent constants:

- **Routes**: Définitions qui associent un chemin URL à un composant
- **RouterOutlet**: Directive où les composants associés aux routes sont rendus
- **RouterLink**: Directive pour créer des liens de navigation
- **Navigation programmatique**: Utilisation du service Router pour naviguer via le code
- **Paramètres de route**: Transmission de données via l'URL
- **Guards**: Protection des routes selon certaines conditions
- **Lazy loading**: Chargement à la demande des modules ou composants

## Routing avec NgModule (Approche Traditionnelle)

### Configuration du Module de Routage

Traditionnellement, les routes Angular étaient définies dans un module de routage dédié:

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) 
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### Intégration dans le Module Principal

Ce module de routage était ensuite importé dans le module principal de l'application:

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    ProductDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Modules de Fonctionnalités avec Sous-Routes

Pour les fonctionnalités chargées paresseusement, chaque module définissait ses propres routes:

```typescript
// admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: UserManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

// admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
```

### Limitations de l'Approche NgModule

Cette organisation traditionnelle présentait plusieurs inconvénients:

1. **Verbosité excessive**: Nécessité de créer et maintenir plusieurs fichiers de module
2. **Complexité structurelle**: Structure imbriquée difficile à suivre dans les grandes applications
3. **Fragmentation du routing**: Configuration de routes dispersée à travers différents modules
4. **Couplage élevé**: Fort couplage entre les modules et leurs routes
5. **Limitations du tree-shaking**: Optimisation moins efficace du code non utilisé

## Routing avec Composants Standalone (Nouvelle Approche)

### Introduction du Routing Standalone

Angular 14 a introduit les composants standalone, mais c'est avec Angular 16 (mai 2023) que le support complet du routing standalone a été finalisé. Cette approche simplifie considérablement la configuration du routage.

### Configuration au Niveau Application

Avec les composants standalone, la configuration du routage au niveau application se fait directement dans le fichier principal:

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { ProductsComponent } from './app/products/products.component';
import { ProductDetailComponent } from './app/product-detail/product-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { 
    path: 'admin', 
    loadChildren: () => import('./app/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
});
```

### Composant Racine

Le composant racine devient également standalone:

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent { }
```

### Routes pour Fonctionnalités Chargées Paresseusement

Les routes pour les fonctionnalités chargées paresseusement sont désormais définies dans des fichiers de routes dédiés plutôt que dans des modules:

```typescript
// admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: UserManagementComponent }
];
```

### Lazy Loading de Composants Standalone

Angular 16+ permet le chargement paresseux de composants individuels, pas seulement de groupes de routes:

```typescript
const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
  }
];
```

### Évolution des Fonctionnalités du Router

#### Fournisseurs de Routing

Angular 16 a introduit de nouvelles fonctions pour configurer le router:

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, 
      withPreloading(PreloadAllModules),
      withDebugTracing(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    )
  ]
});
```

#### Guards Fonctionnels

Les guards ont évolué vers une approche fonctionnelle plus simple:

```typescript
// Ancienne approche avec classe
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return this.isLoggedIn();
  }
}

// Nouvelle approche fonctionnelle
export const authGuard = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

// Utilisation
const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminComponent
  }
];
```

## Tableau Comparatif des Approches de Routing

| Aspect | Approche NgModule | Approche Standalone |
|--------|------------------|---------------------|
| Configuration | Distribuée entre modules | Centralisée ou organisée par fonctionnalité |
| Structure de fichiers | Modules + composants | Principalement composants + fichiers routes |
| Lazy loading | Au niveau module | Module ou composant individuel |
| Guards | Classes avec interfaces | Fonctions ou classes |
| Bootstrapping | Via module racine | Direct avec providers |
| Verbosité | Élevée | Réduite |
| Maintenabilité | Plus complexe | Plus simple |
| Tree-shaking | Moins efficace | Plus efficace |

## Évolution Chronologique du Routing

| Version | Date | Fonctionnalités de Routing |
|---------|------|----------------------------|
| Angular 2 | Sept 2016 | Router initial basé sur NgModule |
| Angular 4 | Mars 2017 | Guards et resolvers améliorés |
| Angular 7 | Oct 2018 | Router scroll position restoration |
| Angular 8 | Mai 2019 | Importation dynamique pour lazy loading |
| Angular 13 | Nov 2021 | Chargement plus performant des modules |
| Angular 14 | Juin 2022 | Preview des composants standalone |
| Angular 15 | Nov 2022 | Guards fonctionnels |
| Angular 16 | Mai 2023 | Support complet du routing standalone, provideRouter |
| Angular 17 | Nov 2023 | Routing standalone par défaut, performances améliorées |

## Migration du Routing NgModule vers Standalone

La migration du système de routing d'une application existante vers l'approche standalone peut s'effectuer progressivement:

### Étape 1: Convertir les Composants en Standalone

```typescript
// Avant
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent { }

// Après
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent { }
```

### Étape 2: Migrer les Routes de Module vers Fichiers de Routes

```typescript
// Extraire de admin.module.ts vers admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: UserManagementComponent }
];
```

### Étape 3: Utiliser provideRouter dans le bootstrap

```typescript
// Remplacer le AppModule par bootstrapApplication
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    // autres providers...
  ]
});
```

### Étape 4: Convertir les Guards en Fonctions

```typescript
// Convertir de classes en fonctions
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated() 
    ? true 
    : router.createUrlTree(['/login']);
};
```

## Bonnes Pratiques du Routing Standalone

1. **Organiser les routes par domaine fonctionnel**:

```typescript
// Définir les routes dans des fichiers par fonctionnalité
// products/products.routes.ts
export const PRODUCT_ROUTES: Routes = [...];

// orders/orders.routes.ts
export const ORDER_ROUTES: Routes = [...];

// Combiner dans le fichier principal
const routes: Routes = [
  { path: 'products', children: PRODUCT_ROUTES },
  { path: 'orders', children: ORDER_ROUTES }
];
```

2. **Extraire la logique complexe de navigation dans des services**:

```typescript
@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router) {}
  
  navigateToProductDetails(productId: string, options?: NavigationOptions): void {
    this.router.navigate(['/products', productId], options);
  }
}
```

3. **Utiliser des routes constants pour éviter les erreurs de frappe**:

```typescript
// routes-constants.ts
export const ROUTES = {
  HOME: '',
  PRODUCTS: 'products',
  PRODUCT_DETAIL: (id: string) => `products/${id}`,
  ADMIN: 'admin'
};

// Utilisation
this.router.navigate([ROUTES.PRODUCT_DETAIL(product.id)]);
```

4. **Configurer des stratégies de préchargement**:

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withPreloading(QuickLinkStrategy), // Stratégie personnalisée ou PreloadAllModules
      withDebugTracing() // Activer uniquement en développement
    )
  ]
});
```

## Avenir du Routing Angular

L'évolution du routing Angular se poursuit avec des améliorations prévues:

1. **Performances accrues**: Optimisations continues du temps de navigation
2. **API plus déclaratives**: Simplification accrue de la configuration
3. **Intégration avec Signals**: Réactivité améliorée des routes via le système de signals
4. **Gestion d'état optimisée**: Meilleure intégration avec les gestionnaires d'état

## Conclusion

La transition du routing basé sur NgModule vers l'approche standalone représente une simplification majeure dans le développement Angular. Les bénéfices incluent:

- **Réduction de la verbosité**: Configuration de routing plus concise
- **Meilleure organisation**: Structure de code plus claire et intuitive
- **Lazy loading granulaire**: Chargement optimisé au niveau composant
- **Meilleure testabilité**: Fonctions plus faciles à tester que les classes

Bien que l'approche NgModule reste supportée pour la compatibilité descendante, l'approche standalone est désormais recommandée pour tous les nouveaux projets Angular et pour la migration progressive des applications existantes. Cette évolution reflète l'engagement continu d'Angular à améliorer l'expérience des développeurs tout en préservant les performances et la scalabilité qui ont fait sa réputation.
