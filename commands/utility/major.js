const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('major')
		.setDescription('Reports the Current Major Order'),
	async execute(interaction) {

    }
}