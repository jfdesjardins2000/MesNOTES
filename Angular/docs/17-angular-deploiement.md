# Déploiement d'applications Angular

Le déploiement est l'étape finale du cycle de développement qui permet de rendre votre application Angular accessible aux utilisateurs. Ce guide explore les différentes stratégies et plateformes pour déployer efficacement vos applications Angular.

## Préparation au déploiement

Avant de déployer une application Angular, plusieurs étapes de préparation sont nécessaires :


### 1. Build de production

La première étape consiste à générer une version optimisée de votre application :

```bash
npx ng build --configuration production
```

Cette commande :
- Compile votre code TypeScript en JavaScript
- Optimise le code (minification, tree-shaking)
- Génère des bundles avec des hashes pour l'invalidation du cache
- Active l'AOT (Ahead-of-Time) compilation
- Désactive les outils de développement

Le résultat se trouve dans le dossier `dist/[nom-projet]`.

#### angular.json
La configuration qui détermine où se trouve le dossier de sortie (dist/[nom-projet]) est définie dans le fichier **angular.json** à la racine de votre projet Angular. C'est un fichier de configuration central pour tout projet Angular qui définit de nombreux paramètres, dont l'emplacement des fichiers générés lors de la compilation.
Voici comment cette configuration est généralement structurée dans le fichier angular.json :

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "nom-projet": {           // Nom de votre projet
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/nom-projet",   // Voici la configuration du chemin de sortie
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            // ... autres options
          },
          "configurations": {
            "production": {
              // Options spécifiques à la production
              "outputHashing": "all",
              // ... autres options de production
            },
            "development": {
              // Options spécifiques au développement
            }
          },
          "defaultConfiguration": "production"
        },
        // ... autres architectes (serve, test, etc.)
      }
    }
  }
}
```


### 2. Configuration d'environnement

Angular utilise des fichiers d'environnement pour gérer les variables selon le contexte d'exécution :

```typescript
// .../src/environments/environment.ts (développement)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// .../src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.monapp.com/api'
};
```

### 3. Optimisations supplémentaires

#### Service Workers pour PWA

Pour transformer votre application en [PWA (Progressive Web App)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app) :

Une Progressive Web App (PWA), c’est une application web améliorée qui combine le meilleur du web et des applications mobiles natives. Elle est développée avec des technologies web classiques (HTML, CSS, JS), mais elle peut :

- fonctionner hors ligne,

- être installée sur l'écran d'accueil,

- envoyer des notifications push,

- offrir une expérience rapide et fluide, même avec une mauvaise connexion.

```bash
npx ng add @angular/pwa
```

## Plateformes de déploiement

### 1. Services d'hébergement statique

#### [Firebase Hosting](https://firebase.google.com/)

Firebase est une solution populaire pour les applications Angular :

```bash
# Installation des outils Firebase
npm install -g firebase-tools

# Connexion à votre compte
firebase login

# Initialisation du projet
firebase init

# Déploiement
firebase deploy
```

Configuration dans `firebase.json` :

```json
{
  "hosting": {
    "public": "dist/[nom-projet]",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### [Netlify](https://www.netlify.com/)

Netlify offre un déploiement facile avec intégration continue :

1. Créez un compte sur Netlify
2. Connectez votre dépôt GitHub/GitLab/Bitbucket
3. Configurez les paramètres de build :
   - Build command: `ng build --configuration production`
   - Publish directory: `dist/[nom-projet]`

Vous pouvez également utiliser un fichier `netlify.toml` à la racine du projet :

```toml
[build]
  command = "ng build --configuration production"
  publish = "dist/[nom-projet]"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel

Vercel est particulièrement adapté pour les applications Next.js, mais fonctionne très bien avec Angular :

1. Installez Vercel CLI : `npm i -g vercel`
2. Exécutez `vercel` à la racine du projet
3. Suivez les instructions

Configuration dans `vercel.json` :

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "ng build --configuration production",
        "outputDirectory": "dist/[nom-projet]"
      }
    }
  ],
  "routes": [
    {
      "src": "/(assets|favicon.ico)/(.*)",
      "dest": "/assets/$2"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### [GitHub Pages](https://pages.github.com/)

Pour déployer sur GitHub Pages :

1. Installez le package : `ng add angular-cli-ghpages`
2. Déployez : `ng deploy --base-href=/<repository-name>/`

### 2. Services cloud

#### [AWS Amplify](https://aws.amazon.com/fr/amplify/)

AWS Amplify simplifie le déploiement Angular sur l'infrastructure AWS :

1. Installez Amplify CLI : `npm install -g @aws-amplify/cli`
2. Configurez Amplify : `amplify configure`
3. Initialisez Amplify dans votre projet : `amplify init`
4. Ajoutez l'hébergement : `amplify add hosting`
5. Déployez : `amplify publish`

#### [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/)

https://learn.microsoft.com/en-us/azure/?product=web

Pour déployer sur Azure :

1. Créez une ressource Static Web App dans le portail Azure
2. Connectez votre dépôt GitHub/GitLab
3. Configurez les paramètres de build :
   - Build command: `ng build --configuration production`
   - Output location: `dist/[nom-projet]`

Configuration dans le fichier `staticwebapp.config.json` :

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.css", "/*.js"]
  }
}
```

#### [Google Cloud Platform](https://cloud.google.com/)

Pour déployer sur GCP :

1. Créez un projet GCP
2. Activez Cloud Storage et Cloud Run
3. Déployez avec gcloud CLI :

```bash
gsutil rsync -R dist/[nom-projet] gs://[bucket-name]/
```

### 3. Serveurs traditionnels

#### Serveur [Node.js](https://nodejs.org/en/) avec [Express](https://expressjs.com/)

Pour les applications avec backend ou SSR :

```javascript
// server.js
const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'dist/[nom-projet]')));

// Rediriger toutes les requêtes vers index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/[nom-projet]/index.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
```

Démarrez avec : `node server.js`

#### Serveur [Nginx](https://nginx.org/en/)

Configuration dans `nginx.conf` :

```
server {
  listen 80;
  server_name example.com;
  root /var/www/[nom-projet];
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  # Cache des assets
  location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000";
  }
}
```

## Stratégies de déploiement avancées

### CI/CD (Intégration et déploiement continus)

Automatisez le déploiement avec des pipelines CI/CD.

#### GitHub Actions

Exemple de workflow `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]
    
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build:prod
        
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

#### GitLab CI/CD

Exemple de configuration `.gitlab-ci.yml` :

```yaml
image: node:16

stages:
  - build
  - deploy

cache:
  paths:
    - node_modules/

build:
  stage: build
  script:
    - npm ci
    - npm run build:prod
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - npm install -g firebase-tools
    - firebase deploy --token $FIREBASE_TOKEN
  only:
    - main
```

### Déploiement blue-green

Cette stratégie implique deux environnements identiques (bleu et vert) :

1. Le trafic est dirigé vers l'environnement actif (bleu)
2. Le nouvel environnement (vert) est mis à jour et testé
3. Le trafic est redirigé vers le nouvel environnement
4. L'ancien environnement est gardé en réserve pour un rollback rapide

### Déploiement canary

Le déploiement canary consiste à déployer progressivement :

1. La nouvelle version est déployée sur un sous-ensemble de serveurs
2. Un petit pourcentage d'utilisateurs accède à la nouvelle version
3. Si les métriques sont bonnes, le pourcentage augmente progressivement
4. En cas de problème, le trafic est redirigé vers l'ancienne version

## Sécurité et optimisation

### Sécurisation des applications Angular déployées

- **Entêtes HTTP** : Configurez les entêtes de sécurité comme Content-Security-Policy
- **HTTPS** : Activez-le sur tous vos environnements
- **Angular Security** : Utilisez le sanitizer intégré pour prévenir les attaques XSS

### Optimisation des performances

- **Lazy loading** des modules pour réduire le bundle initial
- **Preloading** des modules pour améliorer la navigation
- **Compression gzip/Brotli** pour réduire la taille des fichiers
- **CDN** pour les assets statiques

## Surveillance et maintenance

### Surveillance des performances

- **Google Analytics** pour suivre l'utilisation
- **Application Insights** pour surveiller les performances
- **Sentry** pour capturer les erreurs front-end

### Mise à jour régulière

- Maintenez les dépendances à jour avec `ng update`
- Planifiez des mises à jour régulières d'Angular

## Conclusion

Le déploiement d'applications Angular offre de nombreuses options adaptées à différents besoins. Pour les projets simples, les plateformes d'hébergement statique comme Firebase, Netlify ou Vercel offrent une solution rapide et efficace. Pour les projets plus complexes nécessitant un backend ou du SSR, les services cloud comme AWS, Azure ou GCP, ou les serveurs traditionnels peuvent être plus appropriés.

Quelle que soit la stratégie choisie, l'automatisation du processus de déploiement via des pipelines CI/CD est fortement recommandée pour garantir la fiabilité et la cohérence des déploiements.
