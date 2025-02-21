const fs = require('node:fs');
const path = require('node:path');
const BSON = require('bson');

module.exports.autoSave = async function() {
    //  Compresses all JSONs > 1 BSON
    const dataFolderPath = path.join(__dirname, 'data');
    const dataFolder = fs.reddir(dataFolderPath);
    const saveObj = [];
    for (const file in dataFolder) {
        const filePath = path.join(dataFolderPath, file);
        const fileName = path.parse(file).name;
        fs.readFile(filePath, 'utf-8', (err, jsonContent) => {
            if (err) {
                throw new Error('Error reading file:', err);
            }
            let jsonData = JSON.parse(jsonContent);
            jsonData = { file: fileName }; //   only works on arrays (works for now but might not l8r)
            saveObj[0].push(jsonData);
        });
    }
    const bsonData = BSON.serialize(saveObj);
    const filePath = path.join(dataFolderPath, 'backup.bson');
    fs.writeFile(filePath, bsonData, (err) => {
        if (err) {
            throw new Error('Error saving backup:', err);
        } else {
            console.log('Backed up JSONs!');
        }
    });

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