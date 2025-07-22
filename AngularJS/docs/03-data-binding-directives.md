# AngularJS — Data Binding et Directives

AngularJS fournit un système puissant de **liaison de données (data-binding)** et de **directives** qui permet de créer des interfaces utilisateurs dynamiques avec peu de code. 
---

## 🔁 Data Binding (liaison de données)

La liaison de données en AngularJS permet de **synchroniser automatiquement** le modèle (JavaScript) et la vue (HTML).

### 🔹 Liaison unidirectionnelle (`{{ }}`)

Elle permet d'afficher une valeur du modèle dans la vue :

```html
<p>{{ nom }}</p>
```

Dans le contrôleur :

```javascript
$scope.nom = "Jean";
```

### 🔹 Liaison bidirectionnelle (`ng-model`)

Permet de lier un champ de formulaire à une variable du modèle. Toute modification se reflète des deux côtés.

```html
<input type="text" ng-model="nom">
<p>Bonjour {{ nom }}</p>
```

---

## 🧩 Directives AngularJS

Les **directives** sont des attributs HTML spéciaux (ou balises) qui ajoutent des comportements dynamiques à vos éléments HTML.

### 🔹 Directives intégrées

| Directive     | Description |
|---------------|-------------|
| `ng-model`    | Lier une variable à un champ de formulaire |
| `ng-bind`     | Afficher une valeur (équivalent à `{{ }}`) |
| `ng-repeat`   | Répéter un élément pour chaque élément d'une liste |
| `ng-if`       | Afficher un élément si une condition est vraie |
| `ng-show` / `ng-hide` | Afficher ou masquer un élément dynamiquement |
| `ng-click`    | Réagir à un clic de l'utilisateur |

### 🔹 Exemple : `ng-repeat`

```html
<ul>
  <li ng-repeat="fruit in fruits">{{ fruit }}</li>
</ul>
```

Dans le contrôleur :

```javascript
$scope.fruits = ["Pomme", "Banane", "Mangue"];
```

---

## 🔧 Exemple complet

```html
<!DOCTYPE html>
<html ng-app="monApp">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
  <script>
    angular.module('monApp', [])
      .controller('MainCtrl', function($scope) {
        $scope.nom = "Alice";
        $scope.fruits = ["Pomme", "Banane", "Mangue"];
      });
  </script>
</head>
<body ng-controller="MainCtrl">
  <input ng-model="nom">
  <h1>Bonjour {{ nom }} !</h1>

  <ul>
    <li ng-repeat="fruit in fruits">{{ fruit }}</li>
  </ul>
</body>
</html>
```

---

## ✅ Résumé

| Concept             | But                                         |
|---------------------|----------------------------------------------|
| `{{ variable }}`    | Affiche une valeur du modèle dans la vue     |
| `ng-model`          | Liaison bidirectionnelle                     |
| `ng-repeat`         | Boucle sur un tableau                        |
| `ng-click`          | Gérer un clic utilisateur                    |
| `ng-if`, `ng-show`  | Contrôle d'affichage conditionnel            |

---

AngularJS vous permet de créer rapidement des interfaces dynamiques grâce à un système de directives puissantes et une liaison des données intuitive.



# Comparaison entre `$scope` dans AngularJS et les objets équivalents en ASP.NET MVC

Dans **AngularJS**, on utilise souvent `$scope` pour lier des données entre le contrôleur et la vue.

En **ASP.NET MVC**, les objets équivalents pour passer des données du contrôleur vers la vue sont :

## 🔹 `ViewBag`

- Objet **dynamique**.
- Permet de passer des données du contrôleur à la vue sans déclaration de type.
- Syntaxe dans le contrôleur :
  ```csharp
  ViewBag.Titre = "Bonjour";
  ```
- Utilisation dans la vue Razor :
  ```razor
  <h1>@ViewBag.Titre</h1>
  ```

## 🔹 `ViewData`

- C’est un **dictionnaire** (`ViewDataDictionary`) avec des paires clé-valeur.
- Syntaxe dans le contrôleur :
  ```csharp
  ViewData["Titre"] = "Bonjour";
  ```
- Utilisation dans la vue Razor :
  ```razor
  <h1>@ViewData["Titre"]</h1>
  ```

## ⚠️ Différences entre `$scope` (AngularJS) et `ViewBag`/`ViewData` (ASP.NET MVC)

| Caractéristique                 | AngularJS (`$scope`)                          | ASP.NET MVC (`ViewBag` / `ViewData`)       |
|-------------------------------|-----------------------------------------------|--------------------------------------------|
| Utilisation principale         | Liaison bidirectionnelle (two-way binding)   | Passage de données du contrôleur à la vue  |
| Portée                         | Côté client (navigateur)                     | Côté serveur (C#)                          |
| Dynamique ou typé              | Dynamique                                    | `ViewBag` = dynamique, `ViewData` = dictionnaire |
| Actualisation dynamique de l’UI | Oui, via le data-binding AngularJS          | Non, données figées à la génération HTML   |

---

## ✅ Recommandation : Utiliser un `ViewModel`

Pour une solution plus propre et fortement typée, on peut utiliser un modèle de vue (`ViewModel`).

### Exemple de ViewModel

```csharp
public class MonViewModel
{
    public string Titre { get; set; }
    public int Nombre { get; set; }
}
```

### Contrôleur

```csharp
public ActionResult Index()
{
    var model = new MonViewModel
    {
        Titre = "Bonjour",
        Nombre = 42
    };

    return View(model);
}
```

### Vue Razor

```razor
@model MonViewModel

<h1>@Model.Titre</h1>
<p>Nombre : @Model.Nombre</p>
```

---

## ✅ Résumé

| Fonction                             | AngularJS       | ASP.NET MVC                   |
|--------------------------------------|------------------|--------------------------------|
| Lier les données à la vue            | `$scope`         | `ViewBag`, `ViewData`, `Model` |
| Liaison bidirectionnelle             | Oui              | Non                           |
| Typage fort                          | Non              | Oui (avec `Model`)            |
| Portée                               | Côté client      | Côté serveur                  |
