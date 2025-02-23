const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('residence')
        .setDescription('Which planet do you come from?')
        .addStringOption(option =>
            option.setName('planet')
                .setDescription('The planet you are from')
                .setRequired(true),
        ),

    async execute(interaction) {
        //  Load Array
        const start = Date.now();
        await interaction.deferReply();
        const stringyArray = fs.readFileSync('./data/worlds.json', 'utf-8', (err) => {
            if (err) {
                interaction.editReply('Critical Error!');
                throw new Error(`Couldn't read worlds.json...`, err);
            }
        });
        const parsedArray = JSON.parse(stringyArray);
        const casePlanet = interaction.options.getString('planet');
        const planet = casePlanet.toUpperCase();
        const id = parsedArray.findIndex(obj => obj.name === planet);
        //  Check if planet is real
        if (id === -1) {
            await interaction.editReply('Planet not found... Maybe you spelled it wrong?');
            throw new Error('Planet not found...');
        }
        //  Load users
        const bigId = BigInt(interaction.user.id);
        const userId = JSON.parse(bigId);
        const stringyUsers = fs.readFileSync('./data/users.json', 'utf-8', (err) => {
            if (err) {
                interaction.editReply('Critical Error!');
                throw new Error(`Couldn't read users.json...`, err);
            }
        });
        const parsedUsers = await JSON.parse(stringyUsers);
        //  First time user
        if (parsedUsers.findIndex(user => user.discordId === userId) === -1) {
            console.log(`${interaction.user.username} set a planet of residence for the first time!`);
            const newUserUser = {
                helcaId: parsedUsers.length + 1,
                discordId: userId,
                joined: Date.now(),
                home: planet
            };
            const planetObj = await parsedArray.find(obj => obj.name === planet);
            const newArrayUser = await newUserUser[helcaId];
            await parsedUsers.push(newUserUser);
            await planetObj['count'] + 1;
            await planetObj['recruits'].push(newArrayUser);
            const updatedUsers = JSON.stringify(parsedUsers);
            const updatedArray = JSON.stringify(parsedArray);
            fs.writeFileSync('./data/worlds.json', updatedArray, (err) => {
                if (err) {
                    interaction.editReply('Critical Error!');
                    throw new Error(`Couldn't write to worlds.json...`, err);
                }
            });
            console.log('Saved worlds.json!');
            fs.writeFileSync('./data/users.json', updatedUsers, (err) => {
                if (err) {
                    interaction.editReply('Critical Error!');
                    throw new Error(`Couldn't write to users.json...`, err);
                }
            });
            console.log('Saved users.json!');
            const length = parsedUsers.length;
            await interaction.editReply(`Planet of residence set to ${interaction.options.getString('planet')}!\n(・ω<) - Thank you for registering with HeLCA'\n(•◡•) / - Have a democratic day!`);
            if (planetObj['count'] > 1) {
                await interaction.followUp(`## Congratulation Conscript #${length} on registering with HeCLA!\n### We hope to continue to service all your democratic needs.`);
            } else {
                await interaction.followUp(`## Congratulations Conscript #${length}!\n### You are the first Helldiver from **${planetObj.name}** registered with HeLCA. We hope to continue to service all your democratic needs.`);
            }
            const end = Date.now();
            const delta = end - start;
            console.log(`Done! Time elapsed: ${delta}ms`);
        //  Non-first time user
        } else {
            await interaction.editReply('You have already set a home planet. You cant have more than one! (reassigning home planet coming later)');
            console.log('Someone tried to reset their home planet...');
        }
    },
};
