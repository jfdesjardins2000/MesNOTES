# 04 - 🧩 Services

* [/ Developer Guide/ Services](https://docs.angularjs.org/guide/services)
* [/ API Reference/ ng/ service components in ng](https://docs.angularjs.org/api/ng/service)


## Introduction aux Services

Les services dans AngularJS sont des objets singleton qui fournissent des fonctionnalités spécifiques à votre application. Ils sont utilisés pour organiser et partager du code à travers différents composants de votre application.

### Caractéristiques des Services
- **Singleton** : Une seule instance par application
- **Lazy loading** : Instancié seulement quand nécessaire
- **Injectable** : Peut être injecté dans contrôleurs, directives, filtres, etc.
- **Réutilisable** : Partagé entre différents composants

---

## Services Built-in les Plus Utilisés


### 1. **$http** - Service de Requêtes HTTP

Le service `$http` est utilisé pour effectuer des requêtes AJAX vers des serveurs.

#### Syntaxe de base
```javascript
$http({
    method: 'GET',
    url: '/api/data'
}).then(function(response) {
    // Succès
    console.log(response.data);
}, function(error) {
    // Erreur
    console.log(error);
});
```

#### Méthodes raccourcies
```javascript
// GET
$http.get('/api/users').then(function(response) {
    $scope.users = response.data;
});

// POST
$http.post('/api/users', userData).then(function(response) {
    console.log('Utilisateur créé:', response.data);
});

// PUT
$http.put('/api/users/1', updatedData).then(function(response) {
    console.log('Utilisateur mis à jour');
});

// DELETE
$http.delete('/api/users/1').then(function(response) {
    console.log('Utilisateur supprimé');
});
```

#### Configuration globale
```javascript
app.config(['$httpProvider', function($httpProvider) {
    // Headers par défaut
    $httpProvider.defaults.headers.common['Authorization'] = 'Bearer token';
    
    // Interceptors
    $httpProvider.interceptors.push('myInterceptor');
}]);
```

#### Exemple pratique
```javascript
app.controller('UserController', ['$scope', '$http', function($scope, $http) {
    $scope.users = [];
    $scope.loading = false;
    
    $scope.loadUsers = function() {
        $scope.loading = true;
        $http.get('/api/users')
            .then(function(response) {
                $scope.users = response.data;
            })
            .catch(function(error) {
                console.error('Erreur:', error);
            })
            .finally(function() {
                $scope.loading = false;
            });
    };
}]);
```

---

### 2. **$filter** - Service de Filtrage

Le service `$filter` permet d'utiliser les filtres AngularJS dans le code JavaScript.

#### Utilisation de base
```javascript
app.controller('MyController', ['$scope', '$filter', function($scope, $filter) {
    var data = [
        { name: 'John', age: 25 },
        { name: 'Jane', age: 30 },
        { name: 'Bob', age: 20 }
    ];
    
    // Filtrer par âge
    $scope.adults = $filter('filter')(data, { age: '!20' });
    
    // Ordonner par nom
    $scope.sortedUsers = $filter('orderBy')(data, 'name');
    
    // Formatage de date
    $scope.today = $filter('date')(new Date(), 'dd/MM/yyyy');
    
    // Formatage de devise
    $scope.price = $filter('currency')(99.99, '€');
    
    // Limitation du nombre d'éléments
    $scope.firstTwo = $filter('limitTo')(data, 2);
}]);
```

#### Filtres couramment utilisés
```javascript
// Date
$filter('date')(dateValue, 'short'); // 12/31/20 12:00 AM
$filter('date')(dateValue, 'fullDate'); // Thursday, December 31, 2020

// Nombre
$filter('number')(1234.56, 2); // 1,234.56

// JSON
$filter('json')(objectValue); // Chaîne JSON formatée

// Uppercase/Lowercase
$filter('uppercase')('hello'); // HELLO
$filter('lowercase')('WORLD'); // world
```

---

### 3. **$interval** - Service de Temporisation

Le service `$interval` est l'équivalent AngularJS de `setInterval()` avec gestion automatique du cycle de digest.

#### Syntaxe de base
```javascript
app.controller('TimerController', ['$scope', '$interval', function($scope, $interval) {
    $scope.counter = 0;
    var timer;
    
    $scope.startTimer = function() {
        timer = $interval(function() {
            $scope.counter++;
        }, 1000); // Toutes les 1000ms (1 seconde)
    };
    
    $scope.stopTimer = function() {
        if (timer) {
            $interval.cancel(timer);
            timer = null;
        }
    };
    
    // Nettoyage lors de la destruction du scope
    $scope.$on('$destroy', function() {
        if (timer) {
            $interval.cancel(timer);
        }
    });
}]);
```

#### Exemple d'horloge en temps réel
```javascript
app.controller('ClockController', ['$scope', '$interval', function($scope, $interval) {
    $scope.currentTime = new Date();
    
    var clock = $interval(function() {
        $scope.currentTime = new Date();
    }, 1000);
    
    $scope.$on('$destroy', function() {
        $interval.cancel(clock);
    });
}]);
```

---

### 4. **$timeout** - Service de Temporisation Unique

Le service `$timeout` est l'équivalent AngularJS de `setTimeout()`.

#### Utilisation
```javascript
app.controller('DelayController', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.message = '';
    
    $scope.showMessage = function() {
        $scope.message = 'Chargement...';
        
        $timeout(function() {
            $scope.message = 'Opération terminée !';
        }, 2000); // Après 2 secondes
    };
    
    // Avec promesse
    var promise = $timeout(function() {
        $scope.delayedAction();
    }, 1000);
    
    // Annuler si nécessaire
    $timeout.cancel(promise);
}]);
```

---

### 5. **$log** - Service de Logging

Le service `$log` fournit des méthodes de logging avec possibilité de désactivation en production.

#### Méthodes disponibles
```javascript
app.controller('LogController', ['$scope', '$log', function($scope, $log) {
    $log.debug('Message de debug');
    $log.info('Information générale');
    $log.warn('Avertissement');
    $log.error('Erreur critique');
    $log.log('Message simple');
}]);
```

#### Configuration
```javascript
app.config(['$logProvider', function($logProvider) {
    // Désactiver les logs de debug en production
    $logProvider.debugEnabled(false);
}]);
```

---

### 6. **$location** - Service de Navigation

Le service `$location` permet de manipuler l'URL du navigateur.

#### Méthodes principales
```javascript
app.controller('NavController', ['$scope', '$location', function($scope, $location) {
    // Obtenir l'URL actuelle
    $scope.currentPath = $location.path();
    
    // Naviguer vers une nouvelle page
    $scope.goToPage = function(path) {
        $location.path(path);
    };
    
    // Obtenir les paramètres de requête
    $scope.searchParams = $location.search();
    
    // Définir des paramètres de requête
    $location.search('param', 'value');
    
    // Obtenir le hash
    $scope.hash = $location.hash();
}]);
```

---

### 7. **$rootScope** - Scope Racine

Le service `$rootScope` est le scope parent de tous les autres scopes.

#### Utilisation pour communication globale
```javascript
app.controller('PublisherController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.sendGlobalMessage = function() {
        $rootScope.$broadcast('globalMessage', {
            text: 'Message global !',
            timestamp: new Date()
        });
    };
}]);

app.controller('SubscriberController', ['$scope', function($scope) {
    $scope.$on('globalMessage', function(event, data) {
        $scope.receivedMessage = data.text;
        console.log('Message reçu:', data);
    });
}]);
```

---

### 8. **$window** - Service Window

Le service `$window` est un wrapper autour de l'objet `window` global, facilitant les tests.

#### Utilisation
```javascript
app.controller('WindowController', ['$scope', '$window', function($scope, $window) {
    $scope.showAlert = function(message) {
        $window.alert(message);
    };
    
    $scope.openNewWindow = function(url) {
        $window.open(url, '_blank');
    };
    
    $scope.scrollToTop = function() {
        $window.scrollTo(0, 0);
    };
    
    // Obtenir les dimensions de la fenêtre
    $scope.windowWidth = $window.innerWidth;
    $scope.windowHeight = $window.innerHeight;
}]);
```

---

### 9. **$document** - Service Document

Le service `$document` est un wrapper autour de l'objet `document`.

#### Utilisation
```javascript
app.controller('DocumentController', ['$scope', '$document', function($scope, $document) {
    $scope.changeTitle = function(newTitle) {
        $document[0].title = newTitle;
    };
    
    $scope.focusElement = function(elementId) {
        var element = $document[0].getElementById(elementId);
        if (element) {
            element.focus();
        }
    };
}]);
```

---

## Créer des Services Personnalisés

### Méthode 1: service()
```javascript
app.service('UserService', ['$http', function($http) {
    this.getUsers = function() {
        return $http.get('/api/users');
    };
    
    this.createUser = function(userData) {
        return $http.post('/api/users', userData);
    };
    
    this.deleteUser = function(userId) {
        return $http.delete('/api/users/' + userId);
    };
}]);
```

### Méthode 2: factory()
```javascript
app.factory('DataService', ['$http', function($http) {
    var service = {};
    var cache = {};
    
    service.getData = function(key) {
        if (cache[key]) {
            return Promise.resolve(cache[key]);
        }
        
        return $http.get('/api/data/' + key).then(function(response) {
            cache[key] = response.data;
            return response.data;
        });
    };
    
    service.clearCache = function() {
        cache = {};
    };
    
    return service;
}]);
```

### Méthode 3: provider()
```javascript
app.provider('ConfigService', function() {
    var config = {
        apiUrl: '/api',
        timeout: 5000
    };
    
    // Configuration (phase config)
    this.setApiUrl = function(url) {
        config.apiUrl = url;
    };
    
    this.setTimeout = function(timeout) {
        config.timeout = timeout;
    };
    
    // Service (phase run)
    this.$get = ['$http', function($http) {
        return {
            getConfig: function() {
                return config;
            },
            makeRequest: function(endpoint) {
                return $http({
                    url: config.apiUrl + endpoint,
                    timeout: config.timeout
                });
            }
        };
    }];
});

// Configuration
app.config(['ConfigServiceProvider', function(ConfigServiceProvider) {
    ConfigServiceProvider.setApiUrl('https://api.example.com');
    ConfigServiceProvider.setTimeout(10000);
}]);
```

---

## Injection de Dépendances

### Méthodes d'injection
```javascript
// 1. Injection par paramètre (peut être minifiée)
app.controller('MyController', function($scope, $http) {
    // Code du contrôleur
});

// 2. Injection par tableau (safe pour minification)
app.controller('MyController', ['$scope', '$http', function($scope, $http) {
    // Code du contrôleur
}]);

// 3. Propriété $inject
function MyController($scope, $http) {
    // Code du contrôleur
}
MyController.$inject = ['$scope', '$http'];
app.controller('MyController', MyController);
```

---

## Bonnes Pratiques

### 1. Organisation des Services
```javascript
// Séparer par domaine fonctionnel
app.service('AuthService', [...]);
app.service('UserService', [...]);
app.service('ProductService', [...]);
```

### 2. Gestion des Erreurs
```javascript
app.service('ApiService', ['$http', '$log', function($http, $log) {
    this.request = function(config) {
        return $http(config).catch(function(error) {
            $log.error('Erreur API:', error);
            throw error;
        });
    };
}]);
```

### 3. Retourner des Promesses
```javascript
app.service('DataService', ['$http', '$q', function($http, $q) {
    this.processData = function(data) {
        var deferred = $q.defer();
        
        // Traitement asynchrone
        setTimeout(function() {
            try {
                var result = processComplexData(data);
                deferred.resolve(result);
            } catch (error) {
                deferred.reject(error);
            }
        }, 1000);
        
        return deferred.promise;
    };
}]);
```

### 4. Tests Unitaires
```javascript
describe('UserService', function() {
    var UserService, $httpBackend;
    
    beforeEach(module('myApp'));
    
    beforeEach(inject(function(_UserService_, _$httpBackend_) {
        UserService = _UserService_;
        $httpBackend = _$httpBackend_;
    }));
    
    it('should get users', function() {
        var mockUsers = [{ id: 1, name: 'John' }];
        $httpBackend.expectGET('/api/users').respond(mockUsers);
        
        UserService.getUsers().then(function(response) {
            expect(response.data).toEqual(mockUsers);
        });
        
        $httpBackend.flush();
    });
});
```

---

# ⚙️ AngularJS – Création de Service Custom

Dans AngularJS, un **service custom** est un service que vous créez vous-même pour répondre aux besoins spécifiques de votre application. Ces services sont des singletons injectés par Angular via l'injection de dépendances.

---

## 🧠 Pourquoi créer un service custom ?

- Centraliser des règles métiers (ex: calculs, transformations).
- Réutiliser du code dans plusieurs contrôleurs, directives ou composants.
- Accéder à des API ou gérer des données partagées.

---

## 🧱 Exemple : Créer un Service de gestion d’utilisateurs

### 1. Créer le service

```javascript
angular.module('monApp', [])
  .service('UtilisateurService', function() {
    var utilisateurs = [];

    this.ajouter = function(nom) {
      utilisateurs.push({ nom: nom });
    };

    this.lister = function() {
      return utilisateurs;
    };

    this.vider = function() {
      utilisateurs = [];
    };
  });
```

---

### 2. Utiliser le service dans un contrôleur

```javascript
angular.module('monApp')
  .controller('UtilisateurCtrl', function($scope, UtilisateurService) {
    $scope.nom = "";

    $scope.ajouterUtilisateur = function() {
      UtilisateurService.ajouter($scope.nom);
      $scope.nom = "";
    };

    $scope.getUtilisateurs = function() {
      return UtilisateurService.lister();
    };

    $scope.viderUtilisateurs = function() {
      UtilisateurService.vider();
    };
  });
```

---

### 3. Exemple HTML

```html
<div ng-controller="UtilisateurCtrl">
  <input type="text" ng-model="nom" placeholder="Nom">
  <button ng-click="ajouterUtilisateur()">Ajouter</button>
  <button ng-click="viderUtilisateurs()">Vider</button>

  <ul>
    <li ng-repeat="u in getUtilisateurs()">{{u.nom}}</li>
  </ul>
</div>
```

---

## 🧰 Bonnes pratiques

- Un service ne devrait **pas manipuler le DOM**.
- Garder les responsabilités **simples et bien définies**.
- Préférer les services aux contrôleurs pour la logique métier complexe.

---

## ✅ Résumé

| Élément                | But                                      |
|------------------------|-------------------------------------------|
| `service()`            | Crée un service custom (fonction constructeur) |
| `factory()`            | Crée un service avec une fonction retournant un objet |
| Réutilisation          | Oui, via injection de dépendances         |
| Scope de vie           | Singleton (instancié une seule fois)      |

---

## Récapitulatif des Services AngularJS 

Les services AngularJS sont essentiels pour :
- **$http** : Requêtes AJAX et communication avec APIs
- **$filter** : Transformation et filtrage des données
- **$interval/$timeout** : Gestion du temps et actions différées
- **$log** : Logging et debugging
- **$location** : Navigation et manipulation d'URL
- **$rootScope** : Communication globale entre composants
- **$window/$document** : Accès aux objets globaux du navigateur

Utilisez ces services pour créer des applications robustes et maintenables !

Un service custom bien conçu rend votre application **plus modulaire**, **réutilisable** et **testable**.

