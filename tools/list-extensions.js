// Ce code fut  généré par l'IA Copilot
// Ce script utilise Node.js pour exécuter la commande code --list-extensions,
// qui liste toutes les extensions installées. Ensuite, il écrit ces noms dans un fichier extensions.txt.

// Pour utiliser ce script, suivez ces étapes :

// Assurez-vous d'avoir Node.js installé sur votre machine.
// Exécutez le script avec la commande node list-extensions.js dans le terminal.
// Le fichier extensions.txt sera créé dans le même répertoire que le script.

const fs = require('fs');
const path = require('path');
const outputPath = path.join(__dirname, "list-extensions.txt");
const { exec } = require('child_process');

exec('code --list-extensions', (error, stdout, stderr) => {
    if (error) {
        console.error(`Erreur: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Erreur: ${stderr}`);
        return;
    }

    const extensions = stdout.split('\n').filter(ext => ext);
    fs.writeFileSync(outputPath, extensions.join('\n'), 'utf8');
    console.log('Les noms des extensions ont été exportés dans extensions.txt');
});


