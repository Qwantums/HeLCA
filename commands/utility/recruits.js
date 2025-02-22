const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recruits')
        .setDescription('Planet statistics')
        .addSubcommandGroup(group =>
            group.setName('info')
                .setDescription('Get information!')
                .addSubcommand(subcommand =>
                    subcommand.setName('planet')
                        .setDescription('Get statistics on a certain planet!')
                        .addStringOption(option =>
                            option.setName('planet')
                                .setDescription('The planet you want stats for')
                                .setRequired(true),
                        ),
                )
                .addSubcommand(subcommand =>
                    subcommand.setName('top')
                        .setDescription('The top 10 planets by recruit count'),
                ),
        ),

    async execute(interaction) {
        await interaction.deferReply();
        //  if (interaction.options.getSubcommand() === 'planet') {
        const casePlanet = interaction.options.getString('planet');
        const planet = casePlanet.toUpperCase();
        const stringyArray = fs.readFileSync('./data/worlds.json', 'utf-8', (err) => {
            if (err) {
                interaction.editReply('Critical Error!');
                throw new Error('Couldnt read worlds.json...', err);
            }
        });
        const parsedArray = JSON.parse(stringyArray);
        const planetObj = parsedArray.find(obj => obj.name === planet);
        if (planetObj === -1) {
            await interaction.editReply(`Could not find ${casePlanet}. Maybe you spelled it wrong?`);
        } else {
            const recruits = planetObj['count'];
            await interaction.editReply(`## **${planet}**\n### Recruits: *${recruits}*`);
        }// else if (interaction.options.getSubcommand() === 'top')
    },
};