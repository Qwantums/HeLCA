const { SlashCommandBuilder } = require('discord.js');
const fet = require('node-fetch');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('updateplanetlist')
		.setDescription('Updates the planet list JSON'),
	async execute(interaction) {
		fetch('https://helldiverstrainingmanual.com/api/v1/planets')
		.then(response => response.json())
		.then(json => {
			fs.writeFile('./jsondata/planets.json', JSON.stringify(json), err => {
				if (err) {
					throw new Error('Something went wrong.')
				}
				console.log('Planet list updated')
			})
		})
		.catch(error => console.error('Error:', error));
		await interaction.reply(`JSON Updated. Thanks`);
	}
};