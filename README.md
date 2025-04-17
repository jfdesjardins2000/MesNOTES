# MesNOTES
Mes notes sur une foule de sujets en TI


# VS Code
(Ctrl+Shift+V) open preview
(Ctrl+K V) side-by-side 

https://code.visualstudio.com/Docs/languages/markdown


# NVM cheatsheet

Command | Description
---|---
`nvm --version` | Check if `nvm` is installed
`nvm install node` | Installs the latest release of node
`nvm install 14.7.0` | Installs a specific version
`nvm use 12.3` | Uses a specific version of Node
`node -v > .nvmrc` | Creates an nvm configuration file
`nvm use` | Uses the version specified in the `.nvmrc` file
`nvm current` | Displays active version
`nvm ls` | Lists the installed versions
`nvm ls available` | Only show LTS (long-term support) versions
`nvm alias default 18.12` | Sets a default Node version to be used in any new shell (this refers to the latest installed v18.12.x version of node)
`nvm on` | on:Enable / off:desable
`nvm uninstall 17.0.1`| uninstall a version of node

#


# ⚙️ Workflow complet – Démarrer un projet Angular avec NVM et VS Code

## 🧰 Prérequis

- Node.js **géré avec `nvm-windows`** (https://github.com/coreybutler/nvm-windows)
- VS Code installé
- Git installé (facultatif, mais recommandé)

---

## 🧩 Étape 1 – Créer ton dossier de projet

```bash
mkdir mon-projet-angular
cd mon-projet-angular
```

---

## 🧬 Étape 2 – Créer un fichier `.nvmrc` (optionnel mais recommandé)

```bash
echo 18.19.0 > .nvmrc
```

Cela sert à indiquer la version de Node à utiliser dans ce projet.

---

## 🔄 Étape 3 – Activer la bonne version de Node via `nvm`

```bash
nvm install 18.19.0
nvm use 18.19.0
```

💡 Vérifie avec `node -v`

---

## 📦 Étape 4 – Initialiser un projet Node

```bash
npm init -y
```

---

## 🧱 Étape 5 – Installer Angular CLI **(en local)**

```bash
pour une version spécifique (recommandé):                   npm install --save-dev @angular/cli@18
pour installer la derniere version:                         npm install --save-dev @angular/cli
pour installer Angular CLI globalement (non recommandé):    npm install -g @angular/cli
poura le répertoire où les packages globaux sont installés: npm root -g
```

---

## 🛠️ Étape 6 – Créer un nouveau projet Angular (dans le dossier courant)

```bash
npx ng new . --skip-git --skip-install=false --strict
```

> Si tu veux créer le projet dans un sous-dossier : `npx ng new nom-du-projet`

---

## 🧪 Étape 7 – Vérifie le fonctionnement de la CLI Angular

```bash
npx ng version
```

---

## 💻 Étape 8 – Ouvrir le projet dans VS Code

```bash
code .
```

---

## 🐞 Étape 9 – Lancer le serveur Angular en mode debug

```bash
npx ng serve
```

🟢 Tu devrais voir : `✔ Compiled successfully.`  
💡 Accès via `http://localhost:4200`

---

## 🐛 Étape 10 – Déboguer dans VS Code

1. Crée un fichier `.vscode/launch.json` :

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "npx ng serve",
      "type": "chrome",
      "request": "launch",
      "preLaunchTask": "npm: start",
      "url": "http://localhost:4200/"
    },
    {
      "name": "npx ng test",
      "type": "chrome",
      "request": "launch",
      "preLaunchTask": "npm: test",
      "url": "http://localhost:9876/debug.html"
    }
  ]
}
```
2. Modifie le début fichier `package.json` :
```json
{
  "name": "mon-app.ui",
  "version": "0.0.1",
  "scripts": {
    "ng": "ng",
    "start": "npx ng serve",
    "build": "npx ng build",
    "watch": "npx ng build --watch --configuration development",
    "test": "npx ng test"    
  }
```

3. Installe l’extension **Debugger for Chrome** dans VS Code (ou Edge selon ton navigateur)
4. Lance le debug via `F5` ou l’onglet "Run and Debug"


---

## 🔄 Étape 11 – Ajouter la solution dans GitHub
Consulter la page : **Dépôt pédagogique** (https://github.com/jfdesjardins2000/MesNOTES/tree/main/GithubUnLicence) pour Ajouter une licence libre (The Unlicense).

---

## ✅ Tu es prêt à coder 🚀

---

## 📌 Notes utiles

- `npx` permet d’utiliser `ng` sans installation globale
- Angular CLI cherche `angular.json` pour fonctionner
- Ton `node_modules/.bin` contient tous les exécutables locaux (dont `ng`)
