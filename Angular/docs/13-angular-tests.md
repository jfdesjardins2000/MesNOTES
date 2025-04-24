# 🧪 Tester une application Angular

Les tests sont essentiels pour garantir la **qualité**, la **robustesse** et la **maintenabilité** d’une application Angular. Angular fournit un ensemble complet d’outils pour réaliser des **tests unitaires** et **tests d’intégration**.

---

## 📚 Sommaire

- [Pourquoi tester une application Angular ?](#pourquoi-tester-une-application-angular)
- [Les types de tests](#les-types-de-tests)
- [Environnement de test Angular](#environnement-de-test-angular)
- [Tester un composant](#tester-un-composant)
- [Tester un service](#tester-un-service)
- [Tests d’intégration avec HttpClient](#tests-dintegration-avec-httpclient)
- [Bonnes pratiques](#bonnes-pratiques)
- [Conclusion](#conclusion)

---

## Pourquoi tester une application Angular ?

- Garantit le bon fonctionnement du code
- Réduit les régressions lors des changements
- Facilite la maintenance
- Documente le comportement attendu des composants/services

---

## Les types de tests

| Type de test       | Objectif                                      |
|--------------------|-----------------------------------------------|
| Test unitaire      | Tester une unité de code isolée (ex: service) |
| Test d’intégration | Tester plusieurs unités ensemble              |
| Test end-to-end    | Tester l’application comme un utilisateur     |

---

## Environnement de test Angular

Angular utilise **Karma** comme test runner et **Jasmine** comme framework de tests.  

Les fichiers de test ont l’extension `.spec.ts` :

```
app/
  └── my-service.service.ts
  └── my-service.service.spec.ts
```

Pour lancer les tests :

```bash
ng test
```

---

## Tester un composant

Exemple de test unitaire pour un composant :

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## Tester un service

Exemple avec un service simple :

```ts
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait retourner false si non connecté', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });
});
```

---

## Tests d’intégration avec HttpClient

Utilisation de `HttpTestingController` :

```ts
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [UserService]
  });

  service = TestBed.inject(UserService);
  httpMock = TestBed.inject(HttpTestingController);
});

it('devrait récupérer les utilisateurs', () => {
  const dummyUsers = [{ id: 1, name: 'John' }];

  service.getUsers().subscribe(users => {
    expect(users.length).toBe(1);
    expect(users).toEqual(dummyUsers);
  });

  const req = httpMock.expectOne('api/users');
  expect(req.request.method).toBe('GET');
  req.flush(dummyUsers);
});
```

---

## Bonnes pratiques

- Garder les tests simples et ciblés
- Éviter les dépendances réelles (mock, spy, fake)
- Nommer les tests de manière descriptive
- Exécuter les tests automatiquement (CI)

---

## Conclusion

Les tests sont un pilier fondamental d'une application Angular solide.  
➡️ Ils assurent la qualité et évitent les régressions.  
➡️ Angular fournit tous les outils nécessaires pour écrire des tests efficaces.

💡 Conseil : commence par écrire des tests unitaires simples pour tes services avant de tester les composants complexes.

