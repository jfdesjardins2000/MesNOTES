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

 ✅ Activer la bonne version de Node via nvm: 
```ps
nvm install 18.20.8
nvm use 18.20.8
```
✅Favoriser `npx` car cela permet d’utiliser `ng` **sans installation globale**
```ps
npx @angular/cli@18 new nomprojet
```
- Angular CLI cherche `angular.json` pour fonctionner
- Avec une installation locale `node_modules/.bin` contient tous les exécutables locaux (dont `ng`, `npx`, `tsc`...)



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

### Exemple avec abréviations :
```bash
npx ng g c nom-composant -f -d
```

> 💡 Utile pour tester une commande sans rien créer.



## Angular cheatsheet
![Angular cheatsheet](images/angular-cli-cheat-sheet.9X-IsgXf_yph9l.webp)

---

