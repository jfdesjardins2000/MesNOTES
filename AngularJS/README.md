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

 # Projet AngularJS avec Node.js v10.13.0

Ce guide décrit toutes les étapes nécessaires pour créer et exécuter un projet AngularJS localement avec Node.js **v10.13.0**, en utilisant une version compatible de `http-server`.

---

## 📦 Prérequis

- Node.js **v10.13.0** installé sur votre machine
- npm (inclus avec Node.js)

---

## 🛠️ Étapes de mise en place

### 1. Créer un dossier de projet
```bash
mkdir mon-projet-angularjs
cd mon-projet-angularjs
```
### 2. Initialiser un projet Node.js
```bash
npm init -y
```
### 3. Installer AngularJS localement
```bash
npm install angular
```
### 4. Installer une version compatible de http-server
```bash
npm install http-server@0.12.3 --save-dev
```
### 5. Créer les fichiers de base
**index.html**
```html
<!DOCTYPE html>
<html ng-app="monApp">
<head>
  <meta charset="UTF-8">
  <title>Mon Projet AngularJS</title>
  <script src="node_modules/angular/angular.min.js"></script>
  <script src="app.js"></script>
</head>
<body ng-controller="MonControleur">
  <h1>{{ message }}</h1>
</body>
</html>
```
**app.js**
```javascript
angular.module('monApp', [])
  .controller('MonControleur', function($scope) {
    $scope.message = "Bonjour depuis AngularJS !";
  });
```
### 6. Ajouter un script de démarrage dans package.json
Dans la section "scripts" :
```bash
"scripts": {
  "start": "http-server ."
}
```
### 7. Dans le dossier .vscode ajouter les fichiers launch.json et tasks.json

**launch.json**
```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Start Chrome against localhost",
            "type": "chrome",
            "request": "launch",
            "preLaunchTask": "npm: start",
            "url": "http://localhost:8080"            
        }
    ]
}
```
**tasks.json**
```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "npm: start",
            "type": "npm",
            "script": "start",
            "problemMatcher": [],
            "detail": "Run the start script defined in package.json"
        }
    ]
}
```

Ouvrir le navigateur à l'adresse:
http://localhost:8080

ou ouvrir une session de debugage: (Ctrl+Shft+D)

