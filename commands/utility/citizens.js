const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('citizens')
        .setDescription('Planet statistics')
        /*.addSubcommandGroup(options =>
            options.addSubcommand(option =>
                option.setName('planet')
                    .setDescription('How many Helldivers are from this planet?')
                    */.addStringOption(option =>
                        option.setName('planet')
                            .setDescription('The planet you want stats for')
                            .setRequired(true),
                    ),/*
            )
                .addSubcommand(option =>
                    option.setName('top')
                        .setDescription('Top 10 recruiting planets'),
                ),
        ),*/

    async execute(interaction) {
        await interaction.deferReply();
        //if (interaction.options.getSubcommand() === 'planet') {
        const casePlanet = interaction.options.getString('planet');
        const planet = casePlanet.toUpperCase();
        const stringyArray = fs.readFileSync('./data/homeworlds.json', 'utf-8', (err) => {
            if (err) {
                interaction.editReply('Critical Error!');
                throw new Error(`Couldn't read homeworlds.json...`, err);
            }
        });
        const parsedArray = JSON.parse(stringyArray);
        const planetObj = parsedArray.find(obj => obj.name === planet);
        if (planetObj === -1) {
            await interaction.editReply(`Could not find ${casePlanet}. Maybe you spelled it wrong?`);
        } else {
            const recruits = planetObj['declaredHome'].length;
            await interaction.editReply(`## **${planet}**\n### Recruits: *${recruits}*`);
        }// else if (interaction.optoins.getSubcommand() === 'top')
    },
};