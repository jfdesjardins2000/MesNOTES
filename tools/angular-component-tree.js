// Ce code fut  généré par l'IA Copilot
// Ce script utilise Node.js pour parcourir les fichiers d'un projet Angular et 
// créer un graphe des composants en fonction de leurs relations d'utilisation dans les templates HTML. 
// Il génère un fichier JSON contenant ces informations, facilitant ainsi la visualisation des dépendances entre les composants.
//
// Pour utiliser ce script, suivez ces étapes :
// 1. Assurez-vous d'avoir Node.js installé sur votre machine.
// 2. Placez ce script dans le répertoire racine de votre projet Angular, à côté du dossier `src`.
// 3. Exécutez le script avec la commande `node angular-component-tree.js` dans le terminal.
// 4. Le fichier `angular-component-tree.json` sera créé dans le même répertoire que le script, contenant le graphe des composants.
// 5. Le script affichera également un résumé des relations entre les composants dans la console.
/// Note : Ce script est conçu pour fonctionner avec des projets Angular utilisant TypeScript et HTML pour les composants.
// Il peut nécessiter des ajustements pour s'adapter à des structures de projet spécifiques ou à d'autres langages de template.


const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, "../src");
const componentsDir = path.join(srcDir, "app");
const outputPath = path.join(__dirname, "angular-component-tree.json");

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
        
        // Chemin relatif à partir de src pour le nom du composant
        const relativeDir = path.relative(srcDir, dir);
        const componentName = relativeDir.replace(/\//g, '\\') + '\\' + base;
        
        const htmlPath = path.join(dir, `${base}.component.html`);
        
        // Vérifier d'abord si le fichier HTML existe avec l'extension .component.html
        if (fs.existsSync(htmlPath)) {
          componentMap.set(selector, { 
            name: componentName, 
            htmlPath, 
            tsPath: fullPath, 
            selector 
          });
        } else {
          // Sinon, vérifier avec juste .html
          const altHtmlPath = path.join(dir, `${base}.html`);
          if (fs.existsSync(altHtmlPath)) {
            componentMap.set(selector, { 
              name: componentName, 
              htmlPath: altHtmlPath, 
              tsPath: fullPath, 
              selector 
            });
          }
        }
      }
    }
  });
}

function findComponentUsages() {
  // Pour chaque composant, trouvez où il est utilisé
  const componentUsages = new Map();
  
  for (const [selector, component] of componentMap.entries()) {
    componentUsages.set(selector, []);
  }
  
  for (const [selector, component] of componentMap.entries()) {
    try {
      const htmlContent = fs.readFileSync(component.htmlPath, 'utf-8');
      
      // Chercher tous les autres composants utilisés dans ce template
      for (const [childSelector, childComponent] of componentMap.entries()) {
        if (selector !== childSelector) {
          const tagRegex = new RegExp(`<${childSelector}(\\s|>|\\/)`, 'gi');
          if (tagRegex.test(htmlContent)) {
            // Ce composant (selector) utilise le composant enfant (childSelector)
            componentUsages.get(childSelector).push(selector);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Erreur lors de la lecture du fichier HTML pour ${selector}: ${error.message}`);
    }
  }
  
  return componentUsages;
}

function buildTreeFromRoot(rootSelector, componentUsages) {
  function buildNode(selector) {
    const component = componentMap.get(selector);
    if (!component) return null;
    
    const children = [];
    
    // Trouver tous les composants utilisés dans ce template
    for (const [childSelector, parentSelectors] of componentUsages.entries()) {
      if (parentSelectors.includes(selector)) {
        const childNode = buildNode(childSelector);
        if (childNode) {
          children.push(childNode);
        }
      }
    }
    
    // Convertir le chemin absolu en chemin relatif par rapport à src, puis formater avec '.\src\'
    let relativePath = path.relative(srcDir, component.htmlPath);
    relativePath = '.\\src\\' + relativePath.replace(/\//g, '\\');
    
    return {
      name: component.name,
      selector: selector,
      path: relativePath,
      children: children
    };
  }
  
  return buildNode(rootSelector);
}

// Exécution principale
walkComponentFiles(componentsDir);
console.log(`🔍 ${componentMap.size} composants Angular trouvés.`);

const rootSelector = 'app-root';
if (!componentMap.has(rootSelector)) {
  console.error(`❌ Composant racine '${rootSelector}' non trouvé. Vérifiez votre code ou spécifiez un autre sélecteur racine.`);
  
  // Affichez les composants disponibles
  console.log("Composants disponibles :");
  for (const [selector, component] of componentMap.entries()) {
    console.log(`- ${selector} (${component.name})`);
  }
  
  process.exit(1);
}

// Générer l'arbre des composants
const componentUsages = findComponentUsages();
const componentTree = buildTreeFromRoot(rootSelector, componentUsages);

// Écrire le résultat dans un fichier JSON
fs.writeFileSync(outputPath, JSON.stringify(componentTree, null, 2), 'utf-8');
console.log(`✅ Arbre des composants Angular écrit dans ${outputPath}`);

// Afficher un résumé
console.log("\nRésumé des relations entre composants :");
for (const [selector, parentSelectors] of componentUsages.entries()) {
  console.log(`- ${selector} est utilisé par: ${parentSelectors.length > 0 ? parentSelectors.join(', ') : 'personne (peut-être le composant racine)'}`);
}