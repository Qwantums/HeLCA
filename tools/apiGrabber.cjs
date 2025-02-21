const fs = require('node:fs');

module.exports.grabAPI = async function(url = new String, name = new String) {
    try {
        const start = Date.now();
        console.log(`Attempting to contact ${url} to get ${name}.json`);
        const response = await fetch(url, {
            headers: {
                'accept': 'application/json',
                'X-Super-Client': process.env.IDENTIFIER,
                'X-Super-Contact': process.env.CONTACT,
            },
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        const stringyJson = JSON.stringify(json);
        fs.writeFile(`./data/api/${name}.json`, stringyJson, function(err) {
            if (err) {
                throw new Error(`Couldn't save ${name}.json... trying again later`);
            }
        });
        const end = Date.now();
        const delta = end - start;
        console.log(`Saved ${name}.json in data folder... Elapsed Time: ${delta}ms`);
    } catch (err) {
        console.error(err);
    }
};