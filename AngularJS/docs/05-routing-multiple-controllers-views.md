# 05 - Routing, Multiple Controllers et Views

* [/ Developer Guide/ Component Router](https://docs.angularjs.org/guide/component-router)
* [/ API Reference/ ngRoute](https://docs.angularjs.org/api/ngRoute)


## Structure du projet
```
index.html
app.js
controllers/
  - homeController.js
  - aboutController.js
  - contactController.js
views/
  - home.html
  - about.html
  - contact.html
```

## index.html
```html
<!DOCTYPE html>
<html ng-app="myApp">
<head>
    <title>SPA Example</title>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular-route.min.js"></script>
    <script src="app.js"></script>
    <script src="controllers/homeController.js"></script>
    <script src="controllers/aboutController.js"></script>
    <script src="controllers/contactController.js"></script>
</head>
<body>
    <nav>
        <ul>
            <li><a href="#!/home">Accueil</a></li>
            <li><a href="#!/about">À propos</a></li>
            <li><a href="#!/contact">Contact</a></li>
        </ul>
    </nav>
    
    <div ng-view></div>
</body>
</html>
```

## app.js
```javascript
var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
        })
        .when('/contact', {
            templateUrl: 'views/contact.html',
            controller: 'ContactController'
        })
        .otherwise({
            redirectTo: '/home'
        });
});
```

## controllers/homeController.js
```javascript
app.controller('HomeController', function($scope) {
    $scope.title = 'Bienvenue sur la page d\'accueil';
    $scope.message = 'Ceci est la page principale de notre SPA';
    $scope.items = ['Item 1', 'Item 2', 'Item 3'];
    
    $scope.addItem = function() {
        if($scope.newItem) {
            $scope.items.push($scope.newItem);
            $scope.newItem = '';
        }
    };
});
```

## controllers/aboutController.js
```javascript
app.controller('AboutController', function($scope) {
    $scope.title = 'À propos de nous';
    $scope.description = 'Notre entreprise existe depuis 2020';
    $scope.team = [
        {name: 'Jean', role: 'Développeur'},
        {name: 'Marie', role: 'Designer'},
        {name: 'Paul', role: 'Manager'}
    ];
});
```

## controllers/contactController.js
```javascript
app.controller('ContactController', function($scope) {
    $scope.title = 'Contactez-nous';
    $scope.contact = {};
    
    $scope.submitForm = function() {
        if($scope.contactForm.$valid) {
            alert('Message envoyé: ' + $scope.contact.message);
            $scope.contact = {};
            $scope.contactForm.$setPristine();
        }
    };
});
```

## views/home.html
```html
<div>
    <h1>{{title}}</h1>
    <p>{{message}}</p>
    
    <h3>Liste des éléments:</h3>
    <ul>
        <li ng-repeat="item in items">{{item}}</li>
    </ul>
    
    <form ng-submit="addItem()">
        <input type="text" ng-model="newItem" placeholder="Nouvel élément">
        <button type="submit">Ajouter</button>
    </form>
</div>
```

## views/about.html
```html
<div>
    <h1>{{title}}</h1>
    <p>{{description}}</p>
    
    <h3>Notre équipe:</h3>
    <div ng-repeat="member in team">
        <strong>{{member.name}}</strong> - {{member.role}}
    </div>
</div>
```

## views/contact.html
```html
<div>
    <h1>{{title}}</h1>
    
    <form name="contactForm" ng-submit="submitForm()">
        <div>
            <label>Nom:</label>
            <input type="text" ng-model="contact.name" required>
        </div>
        
        <div>
            <label>Email:</label>
            <input type="email" ng-model="contact.email" required>
        </div>
        
        <div>
            <label>Message:</label>
            <textarea ng-model="contact.message" required></textarea>
        </div>
        
        <button type="submit" ng-disabled="contactForm.$invalid">
            Envoyer
        </button>
    </form>
</div>
```

## Points clés à retenir

### Routing
- `ngRoute` module pour la gestion des routes
- `$routeProvider` pour configurer les routes
- Chaque route associe une URL, un template et un contrôleur

### Controllers
- Chaque contrôleur gère une vue spécifique
- `$scope` pour partager les données entre contrôleur et vue
- Logique métier séparée par fonctionnalité

### Views
- Templates HTML séparés pour chaque page
- Utilisation des directives AngularJS (`ng-repeat`, `ng-model`, etc.)
- Binding bidirectionnel avec `{{}}`

### Navigation
- Utilisation de `#!/` pour les URLs
- `ng-view` directive pour afficher les templates
- Navigation sans rechargement de page