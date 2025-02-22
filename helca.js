const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const backup = require('./backup.cjs');
const grabber = require('./apiGrabber.cjs');

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
                content: 'Communist Automata are sapping my CPU! Error...',
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: 'Fascist Termanids are chewing threw my wiring! Error...',
                ephemeral: true,
            });
        }
    }
});

//  Autosave
//  setInterval(backup.autoSave(), 1800000);

//  API Grabber
const timer = 900000;
//  Invasions
grabber.grabAPI('https://api.helldivers2.dev/api/v1/planet-events', 'events');
setInterval(() => grabber.grabAPI('https://api.helldivers2.dev/api/v1/planet-events', 'events'), timer);
/*  Liberations
grabber.getData('https://api.helldivers2.dev/api/v1/campaigns', 'campaigns');
setInterval(() => grabber.getData('https://api.helldivers2.dev/api/v1/campaigns', 'campaigns'), timer);
//  Assignment Pop-Ups
grabber.getData('https://api.helldivers2.dev/api/v1/assignments', 'assignments');
setInterval(() => grabber.getData('https://api.helldivers2.dev/api/v1/assignments', 'assignments'), timer);
//  Station Location
grabber.getData('https://api.helldivers2.dev/api/v1/space-stations', 'stations');
setInterval(() => grabber.getData('https://api.helldivers2.dev/api/v1/space-stations', 'stations'), timer);
*/