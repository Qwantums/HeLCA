const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

//  Login
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.login(process.env.DISCORD_TOKEN);

//	Command Parser
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

//	Command Handler (with error handler)
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    }
});

//  API Grabber
async function getData(url = new String, name = new String) {
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
        fs.writeFile(`./data/${name}.json`, stringyJson, function(err) {
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
const timer = 900000;
//  Invasions
getData('https://api.helldivers2.dev/api/v1/planet-events', 'events');
setInterval(() => getData('https://api.helldivers2.dev/api/v1/planet-events', 'events'), timer);
//  Liberations
getData('https://api.helldivers2.dev/api/v1/campaigns', 'campaigns');
setInterval(() => getData('https://api.helldivers2.dev/api/v1/campaigns', 'campaigns'), timer);
//  Assignment Pop-Ups
getData('https://api.helldivers2.dev/api/v1/assignments', 'assignments');
setInterval(() => getData('https://api.helldivers2.dev/api/v1/assignments', 'assignments'), timer);
//  Station Location
getData('https://api.helldivers2.dev/api/v1/space-stations', 'stations');
setInterval(() => getData('https://api.helldivers2.dev/api/v1/space-stations', 'stations'), timer);