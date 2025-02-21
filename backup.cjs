const fs = require('node:fs');
const path = require('node:path');

module.exports.autoSave = async function() {
    const dataPath = path.join(__dirname, 'data');
    const backFolderPath = path.join(dataPath, 'backup');
    const dataFile = fs.readdirSync(dataPath).filter(file => file.endsWith('.json'));
    try {
        for (const file of dataFile) {
            const filePath = path.join(dataPath, file);
            const data = fs.readFile(filePath, 'utf-8', (err) => {
                if (err) {
                    throw new Error(`Couldn't read ${filePath}...`, err);
                }
            });
            const backPath = path.join(backFolderPath, `${file}.backup`);
            fs.writeFile(backPath, data, (err) => {
                if (err) {
                    throw new Error(`Couldn't read ${filePath}...`, err);
                }
            });
        }
    } catch (err) {
        console.error('Error:', err);
    }
};