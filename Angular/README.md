# Angular - mes notes



## Installer nvm (Node Version Manager)

![nvm-install](images/nvm-install.png)

1.	Va sur : https://github.com/coreybutler/nvm-windows/releases
2.	Télécharge le nvm-setup.exe et installe 
3.	Installation dans : C:\Users\desje13\AppData\Local\nvm

## NVM cheatsheet

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

## 🧩 Étape 1 – Créer un dossier de projet

```bash
mkdir mon-projet-angular
cd mon-projet-angular
```

---

## 🔄 Étape 2 – Activer la bonne version de Node via `nvm`

par exemple, pour utiliser node v18.20.8
```bash
nvm install 18.20.8
nvm use 18.20.8
```
---

## 🧱 Étape 3 – Créer un projet Angular (qui va inclure Angular CLI) via npx  **(en local)**

```bash
pour une version spécifique (recommandé):                   npx @angular/cli@18 new nom-du-projet

pour installer la derniere version:                         npm install --save-dev @angular/cli
pour installer Angular CLI globalement (non recommandé):    npm install -g @angular/cli
pour savoir où le répertoire où les packages globaux sont installés: npm root -g
```
---

## 🧪 Étape 4 – Vérifier le fonctionnement de la CLI Angular

```bash
cd nom-du-projet
npx ng version
```

---

## 💻 Étape 5 – Ouvrir le projet dans VS Code

```bash
code .
```

---

## 🐞 Étape 6 – Lancer la compilation et le serveur Angular en mode debug

```bash
npx ng build
npx ng serve
```

🟢 Tu devrais voir : `✔ Compiled successfully.`  
💡 Accès via `http://localhost:4200`

---

## 🐛 Étape 7 – Déboguer dans VS Code

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

## 🔄 Étape 8 – Ajouter la solution dans GitHub
Consulter la page : **Dépôt pédagogique** (https://github.com/jfdesjardins2000/MesNOTES/tree/main/GithubUnLicence) pour Ajouter une licence libre (The Unlicense).

---

## ✅ Tu es prêt à coder 🚀

---

## 📌 Notes utiles

- `npx` permet d’utiliser `ng` sans installation globale
- Angular CLI cherche `angular.json` pour fonctionner
- Ton `node_modules/.bin` contient tous les exécutables locaux (dont `ng`)

## Angular cheatsheet
![Angular cheatsheet](images/angular-cli-cheat-sheet.9X-IsgXf_yph9l.webp)
