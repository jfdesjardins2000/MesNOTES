// Ce code fut  généré par l'IA Copilot
// Ce script utilise Node.js pour parcourir les fichiers d'un projet Angular et 
// créer un graphe des composants en fonction de leurs relations d'utilisation dans les templates HTML. 
// Il génère un fichier JSON contenant ces informations, facilitant ainsi la visualisation des dépendances entre les composants.
//
// Pour utiliser ce script, suivez ces étapes :
// 1. Assurez-vous d'avoir Node.js installé sur votre machine.
// 2. Placez ce script dans le répertoire racine de votre projet Angular, à côté du dossier `src`.
// 3. Exécutez le script avec la commande `node angular-component-tree-noroot.js` dans le terminal.
// 4. Le fichier `angular-component-graph.json` sera créé dans le même répertoire que le script, contenant le graphe des composants.
// 5. Le script affichera également un résumé des relations entre les composants dans la console.
/// Note : Ce script est conçu pour fonctionner avec des projets Angular utilisant TypeScript et HTML pour les composants.
// Il peut nécessiter des ajustements pour s'adapter à des structures de projet spécifiques ou à d'autres langages de template.


const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, "../src");
const componentsDir = path.join(srcDir, "app");
const outputPath = path.join(__dirname, "angular-component-graph.json");

// Maps: selector => { name, htmlPath, tsPath, selector }
const componentMap = new Map();

function walkComponentFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkComponentFiles(fullPath);
    } else if (file.endsWith('.component.ts')) {
      const tsContent = fs.readFileSync(fullPath, 'utf-8');
      const selectorMatch = tsContent.match(/selector:\s*['"](.*?)['"]/);

      if (selectorMatch) {
        const selector = selectorMatch[1];
        const base = file.replace('.component.ts', '');

        const relativeDir = path.relative(srcDir, dir);
        const componentName = relativeDir.replace(/\//g, '\\') + '\\' + base;

        const htmlPath = path.join(dir, `${base}.component.html`);
        const altHtmlPath = path.join(dir, `${base}.html`);
        const actualHtmlPath = fs.existsSync(htmlPath) ? htmlPath : (fs.existsSync(altHtmlPath) ? altHtmlPath : null);

        componentMap.set(selector, {
          name: componentName,
          htmlPath: actualHtmlPath,
          tsPath: fullPath,
          selector
        });
      }
    }
  });
}

function findComponentUsages() {
  const componentUsages = new Map();

  for (const [selector, component] of componentMap.entries()) {
    componentUsages.set(selector, []);
    if (component.htmlPath) {
      try {
        const htmlContent = fs.readFileSync(component.htmlPath, 'utf-8');
        for (const [childSelector, childComponent] of componentMap.entries()) {
          if (selector !== childSelector) {
            const tagRegex = new RegExp(`<${childSelector}(\\s|>|\\/)`, 'gi');
            if (tagRegex.test(htmlContent)) {
              componentUsages.get(childSelector).push(selector);
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Erreur lors de la lecture du fichier HTML pour ${selector}: ${error.message}`);
      }
    }
  }

  return componentUsages;
}

// Exécution principale
walkComponentFiles(componentsDir);
console.log(`🔍 ${componentMap.size} composants Angular trouvés.`);

const componentUsages = findComponentUsages();

// Préparer un format JSON plus simple représentant le graphe des composants
const componentGraph = {};
for (const [selector, parents] of componentUsages.entries()) {
  const componentInfo = componentMap.get(selector);
  componentGraph[selector] = {
    name: componentInfo ? componentInfo.name : 'Nom inconnu',
    parents: parents
  };
}

// Écrire le résultat dans un fichier JSON
fs.writeFileSync(outputPath, JSON.stringify(componentGraph, null, 2), 'utf-8');
console.log(`✅ Graphe des composants Angular écrit dans ${outputPath}`);

// Afficher un résumé
console.log("\nRésumé des relations entre composants (enfants -> parents):");
for (const [selector, parents] of componentUsages.entries()) {
  console.log(`- ${selector} est utilisé par: ${parents.length > 0 ? parents.join(', ') : 'personne'}`);
}