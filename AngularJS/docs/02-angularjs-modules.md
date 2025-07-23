# 02 - Modules

* [/ Developer Guide/ Modules](https://docs.angularjs.org/guide/module)
* [/ API Reference/ ng/ type components in ng/ angular.Module](https://docs.angularjs.org/api/ng/type/angular.Module)

Les **modules AngularJS** sont un concept fondamental dans AngularJS (version 1.x). Ils servent à organiser votre application en différentes parties logiques — ce qui facilite la lisibilité, la maintenance et la réutilisation du code.

## 🧱 Qu’est-ce qu’un module AngularJS ?

Un module AngularJS est une conteneur pour les différentes composantes de votre application :

* Contrôleurs
* Services
* Filtres
* Directives
* Constantes / valeurs
* Configurations / run blocks

```javascript
angular.module('nomDuModule', [/* modules dépendants */]);
```
## 📌 Pourquoi utiliser des modules ?
* Regrouper logiquement les fonctionnalités
* Gérer les dépendances entre composants
* Charger uniquement ce dont on a besoin (modularité)
* Réutiliser des modules dans plusieurs projets

## 🔧 Création d’un module
Exemple simple :
```javascript
var app = angular.module('monApp', []);
```
Ici, `monApp` est le nom du module. Le tableau `[]` signifie qu’il n’a aucune dépendance à d’autres modules.

## 🔁 Déclaration de dépendances
Vous pouvez injecter d’autres modules :
```javascript
var app = angular.module('monApp', ['ngRoute', 'autreModule']);
```
Cela signifie que `monApp` dépend :
* du module AngularJS `ngRoute`
* d’un autre module personnalisé `autreModule`

## 💡 Ajouter un contrôleur à un module
```javascript
angular.module('monApp', [])
  .controller('MonCtrl', function($scope) {
    $scope.message = "Bonjour depuis le contrôleur !";
  });
```
##🧩 Exemple complet
```html
<!DOCTYPE html>
<html ng-app="monApp">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
  <script>
    var app = angular.module('monApp', []);

    app.controller('HelloCtrl', function($scope) {
      $scope.nom = "Jean";
    });
  </script>
</head>
<body ng-controller="HelloCtrl">
  <h1>Bonjour {{ nom }} !</h1>
</body>
</html>
```

## 🧪 Module vs Application principale
Le module que vous définissez devient ***l’application AngularJS principale*** si vous le référencez dans `ng-app`.

Exemple :
```html
<html ng-app="monApp">
```

## ⚠️ À ne pas confondre avec...
| AngularJS             | Angular (2+)            |
| --------------------- | ----------------------- |
| `angular.module(...)` | `@NgModule({...})`      |
| JavaScript 100%       | TypeScript + Decorators |
| Pas de CLI            | Utilise Angular CLI     |

## ✅ Résumé
| Élément                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| `angular.module(...)`     | Crée ou récupère un module                   |
| Paramètre `[]`            | Liste des modules dont il dépend             |
| `.controller`, `.service` | Attache des composants au module             |
| `ng-app="monModule"`      | Définit le module principal de l’application |
