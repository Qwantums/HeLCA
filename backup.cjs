const fs = require('node:fs');
const path = require('node:path');
const BSON = require('bson');

module.exports.autoSave = async function() {
    //  Im not quite sure what I want to do here yet...
    try {
        const dataFolderPath = path.join(__dirname, 'data');
        const dataFiles = fs.readdirSync(dataFolderPath).filter(file => file.endsWith('.json'));
        console.log('Files to backup:', dataFiles);
        let saveObj = [];
        for (const file in dataFiles) {
            const fileName = dataFiles[file];
            console.log(`Reading ${fileName}`);
            const filePath = path.join(dataFolderPath, fileName);
            fs.readFileSync(filePath, 'utf-8', (err, jsonContent) => {
                if (err) {
                    throw new Error('Couldnt read file...', err);
                }
                const jsonData = JSON.parse(jsonContent);
                const pakdData = {
                    file: fileName,
                    data: jsonData
                };
                saveObj.push(pakdData);
            });
        }
        if (Array.isArray(saveObj)) {
            saveObj = { saveObj };
        }
        const timestamp = Date.now();
        const constructedTime = new Date(timestamp).toJSON();
        const filePath = path.join(dataFolderPath, `${constructedTime}.bson`);
        fs.writeFileSync(filePath, bsonData, (err) => {
            if (err) {
                throw new Error('Failed saving backup...', err);
            } else {
                console.log('Backed up JSONs!');
            }
        });
    } catch (err) {
        console.error('Error:', err);
    }
    /*  Saves 1 JSON > 1 JSON
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
            const backPath = path.join(backFolderPath, `${file}`);
            fs.writeFile(backPath, data, (err) => {
                if (err) {
                    throw new Error(`Couldn't read ${filePath}...`, err);
                }
            });
        }
    } catch (err) {
        console.error('Error:', err);
    }
    */
};