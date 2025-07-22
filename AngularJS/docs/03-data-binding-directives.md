# Les méthodes de liaison de données en Angular

 # A revoir avec GPT

Angular propose un système puissant de liaison de données (data binding) qui permet de connecter les données du composant TypeScript avec l'interface utilisateur HTML. Ce document explore les différentes méthodes disponibles et leurs cas d'utilisation.

## Interpolation `{{ }}`

L'interpolation est la méthode la plus simple pour afficher des valeurs dynamiques dans le template HTML.



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
