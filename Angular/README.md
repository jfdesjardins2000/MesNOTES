# Angular - mes notes

Angular (https://angular.dev/) est un framework JavaScript open-source développé et maintenu par Google. Il permet de créer des applications web dynamiques et réactives, principalement des applications à page unique (SPA). Angular utilise TypeScript (https://www.typescriptlang.org/) comme langage principal, ce qui apporte le typage statique et la programmation orientée objet à JavaScript. Le framework est basé sur une architecture de composants, où chaque élément de l'interface utilisateur est encapsulé dans des composants réutilisables.


Angular est particulièrement apprécié pour les applications d'entreprise complexes nécessitant une structure robuste et maintenable.

Voici les sections disponibles :

1. [Installation](docs/01-angular-install.md)
2. [Composants et Modules](docs/02-angular-modules-components.md)
3. [Templates](docs/03-angular-templates.md)
4. [Data Binding](docs/04-angular-data-binding.md)
5. [Formulaires (Template-driven ou Reactive)](docs/05-angular-forms.md)
6. [Routing](docs/06-angular-routing.md)
7. [Services et Injection de dépendances](docs/07-angular-services.md)
8. [Communication entre composants](docs/08-angular-component-communication.md)
9. [Les directives - Composants, structurelles et d'attribut](docs/09-angular-custom-directives-guide).
10. [Pipes](docs/10-angular-pipes.md)
11. [Observables (RxJS) et Subscriptions](docs/11-angular-promises-rxjs-observables.md)
12. [Interceptors, Guards, zone.js et Signals](docs/12-angular-interceptors-guards-zonejs-signals.md)
13. [Tests](docs/13-angular-tests.md)
14. [Jests Testing Framework](docs/14-angular-tests-jest.md)
15. [Gestion d'état (State Management) dans Angular](docs/15-angular-state-management.md)
16. [Architecture d'application ](docs/16-angular-architecture.md)
17. [Déploiement (Deployment)](docs/17-angular-deploiement.md)
18. [Resources](docs/18-angular-resources.md)

---

## 📌 Notes utiles



# Voici un 🔥 guide express des raccourcis VS Code spécifiquement utiles pour la navigation dans un projet Angular / TypeScript :

✅ Navigation de fichier / code
| Raccourci             | Action                                           |
|-----------------------|--------------------------------------------------|
| `Ctrl + P`            | Aller à un fichier (`app.component.ts`, etc.)    |
| `Ctrl + Tab`          | Aller à un fichier (`app.component.ts`, etc.)    |
| `Ctrl+K, Ctrl+O`      | pour boucler au travers des fichier ts/html/scss d'un composant Angular|
| `Ctrl + Shift + O`    | Aller à un symbole dans le fichier (méthodes)    |
| `Ctrl + T`            | Rechercher un symbole global (composant/service) |
| `F12`                 | Aller à la définition                            |
| `Alt + F12`           | Aperçu de la définition (inline)                 |
| `Ctrl + Click`        | Navigation vers définition (fichier/variable)    |
| `Ctrl + B`            | Toggle sidebar (explorer)                        |


✅Liste d'extensions pour VSCode
[vscode-extensions](../tools/list-extensions.txt)


 ✅ Activer la bonne version de Node via NVM: 
```ps
nvm install 18.20.8
nvm use 18.20.8
```

✅Quand on clone un projet Angular existant ?
 
 Lorsqu'on récupère un projet Angular existant (par exemple, via Git) qui contient déjà un fichier `package.json`, la seule commande à exécuter est :
 
 1. Dans une fenêtre Terminal, 
 2. naviguer dans le dossier dans lequel se trouve le fichier `package.json`
 3. Entrer ensuite la commande:
 ```bash
 npm install
 ```
 Pourquoi juste `npm install` ?

* Lecture de package.json : La commande npm install (sans aucun argument de paquet) lit le fichier `package.json`.
* Installation des dependencies : cette commande installe tous les paquets listés sous la section `dependencies`.
* Installation des devDependencies : Elle installe également tous les paquets listés sous la section `devDependencies`. C'est là que @angular/cli et tous les autres outils de développement nécessaires (comme @angular-devkit/build-angular, typescript, karma, etc.) seront installés.
* Cohérence : `npm install` s'assure que toutes les dépendances du projet, y compris les outils de développement, sont installées aux versions spécifiées ou compatibles avec celles spécifiées dans `package.json`.

✅Favoriser `npx` car cela permet d’utiliser `ng` **sans installation globale**

pour créer un nouveau projet angular avec une version spécifique
```ps
npx @angular/cli@18 new nomprojet
```
- Angular CLI cherche `angular.json` pour fonctionner
- Avec une installation locale `node_modules/.bin` contient tous les exécutables locaux (dont `ng`, `npx`, `tsc`...)

✅ Compiler le projet Angular

Cette commande va exécuter le script dans `package.json build` qui va lancer
```bash
 npm run build 
 ```
qui vient de
```json
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  // ...
},
```

 ✅ Servir le projet dans un browser
 ```bash
 npm run start
 ```

## 🧪 Commandes Angular utiles
Ouvre la fenêtre Terminal

## Génération de composants et services avec Angular CLI

### Composant avec dossier dédié
```bash
# Génère un composant Angular dans un nouveau dossier "un-premier-composant"
npx ng generate component un-premier-composant
```

### Service Angular
```bash
# Génère un service Angular nommé "mon-service" (fichiers créés dans src/app)
npx ng generate service mon-service
```

### Composant sans sous-dossier
```bash
# Génère un composant "header" sans créer de sous-dossier (fichiers dans le dossier courant)
npx ng generate component header --flat
```

### Simulation (dry run) d’un composant sans sous-dossier
```bash
# Simule la génération du composant "mon-composant" sans créer de dossier
# (affiche les fichiers qui seraient créés, sans rien modifier)
npx ng generate component mon-composant --flat --dry-run
```

---

## Abréviations pratiques

| Longue option              | Abrégé  |
|---------------------------|---------|
| `generate`                | `g`     |
| `component`               | `c`     |
| `service`                 | `s`     |
| `--flat`                  | `-f`    |
| `--dry-run`               | `-d`    |
| `--skip-tests`            | `-t`    |

### Exemple avec abréviations :
```bash
npx ng g c nom-composant -f -d
```

> 💡 Utile pour tester une commande sans rien créer.



## Angular cheatsheet
![Angular cheatsheet](images/angular-cli-cheat-sheet.9X-IsgXf_yph9l.webp)

---

