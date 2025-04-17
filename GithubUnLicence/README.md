# 📚 aspnet-sandbox — Dépôt pédagogique

![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)
[Voir la politique de sécurité ➜](./SECURITY.md)

Ce dépôt contient du code d'exemple utilisé à des fins de formation (cours Udemy, tests personnels, démos).

⚠️ **Il ne doit pas être utilisé en production.**  
🛑 **Les dépendances ne seront pas mises à jour.**  
🔐 **Les vulnérabilités signalées seront ignorées volontairement.**

---

## ✅ Mise en place d'une politique pédagogique complète

### 🔹 1. Ajouter une licence libre (The Unlicense)

Crée un fichier `LICENSE` avec le contenu suivant :

> Permet une utilisation, modification, distribution sans restriction.  
> Aucun support ni garantie fournie.

📄 Fichier déjà généré automatiquement.

---

### 🔹 2. Documenter la politique de sécurité

Créer un fichier `SECURITY.md` avec ce contenu :

> Indique clairement que :
> - Le projet est pédagogique
> - Les vulnérabilités ne seront pas corrigées
> - Aucun support de sécurité ne sera assuré

📄 Fichier déjà généré automatiquement.

---

### 🔹 3. Désactiver les alertes Dependabot

Créer le fichier `.github/dependabot.yml` avec :

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "monthly"
    ignore:
      - dependency-name: "*"
  - package-ecosystem: "nuget"
    directory: "/"
    schedule:
      interval: "monthly"
    ignore:
      - dependency-name: "*"
```

📁 Cela empêche GitHub de générer des alertes de sécurité sur ce dépôt.

---

### 🔹 4. Commit & Push

```bash
git add LICENSE SECURITY.md .github/dependabot.yml README.md
git commit -m "Ajout de licence, politique sécurité, désactivation alertes"
git push
```

---

## 🧠 Résumé

| Élément             | Action                                                            |
|---------------------|-------------------------------------------------------------------|
| `LICENSE`           | The Unlicense pour usage libre                                    |
| `SECURITY.md`       | Clarifie qu’il s’agit d’un dépôt de cours                         |
| `dependabot.yml`    | Désactive les alertes sécurité automatiques                       |
| `README.md`         | Documente l’intention pédagogique et les limitations              |

---

> 🔒 Ce dépôt est **figé volontairement** et ne doit pas être utilisé dans un environnement réel.