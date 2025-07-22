# Installation
# Projet AngularJS avec Node.js v16.20.2

Ce guide décrit toutes les étapes nécessaires pour créer et exécuter un projet AngularJS localement avec Node.js **v16.20.2**, en utilisant une version compatible de `live-server`.

---

## 📦 Prérequis

- Node.js **v16.20.2** installé sur votre machine
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
npm install angular@1.8.3 --save-dev
```
### 4. Installer Live Server localement
```bash
npm install live-server@1.2.1 --save-dev
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
### 6. Ajouter un script de démarrage dans **package.json**
Dans la section "scripts" :
```bash
{
  "name": "mon-projet-angularjs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "live-server",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "angular": "1.8.3"
  },
  "devDependencies": {
    "live-server": "1.2.1"
  }
}
```
### 7. Dans le dossier .vscode ajouter les fichiers **launch.json** et **tasks.json**

**launch.json**
```json
{
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
Lance le serveur (live-server)
```bash
npm start
```
et Ouvrir le navigateur à l'adresse:
http://localhost:8080

ou ouvrir une session de debugage (F5): (Ctrl+Shft+D)