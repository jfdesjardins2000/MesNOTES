# AngularJS (https://angularjs.org/)

AngularJS est un framework JavaScript open-source développé par Google, principalement utilisé pour créer des applications web dynamiques côté client (dans le navigateur).

Voici les points clés à connaître :

🔧 Fonctionnalités principales
* Architecture MVC (Model-View-Controller) : Sépare les données (modèle), l’interface utilisateur (vue) et la logique (contrôleur).
* Data Binding bidirectionnel : Les modifications dans l’interface utilisateur mettent à jour automatiquement les données, et vice versa.
* Directives : Permettent d’étendre le HTML avec de nouveaux comportements (ex. : ng-model, ng-repeat, etc.).
* Injection de dépendances : Facilite la gestion des composants et services.
* Templates dynamiques : Utilise des expressions dans le HTML pour afficher des données dynamiquement.

📜 Exemple simple
Voici un petit exemple d'application AngularJS :

```html
<!DOCTYPE html>
<html ng-app="monApp">
<head>
  https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js
</head>
<body ng-controller="MonControleur">
  <h1>{{ message }}</h1>
  <input ng-model="message">
</body>

<script>
  angular.module('monApp', [])
    .controller('MonControleur', function($scope) {
      $scope.message = "Bonjour AngularJS !";
    });
</script>
</html>

 ```

1. [Installation](docs/01-angularjs-install.md)
2. [Data Binding et Directives](docs/02-data-binding-directives.md)

