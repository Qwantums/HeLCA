const { SlashCommandBuilder } = require('discord.js');
const fet = require('node-fetch');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('forceupdate')
		.setDescription('Fetch status about the Galactic War'),
	async execute(interaction) {
		fetch('https://helldiverstrainingmanual.com/api/v1/war/campaign')
		.then(response => response.json())
		.then(json => {
			fs.writeFile('./activecampaigns.json', JSON.stringify(json), err => {
				if (err) {
					throw new Error('Something went wrong.')
				}
				console.log('Campaigns Force Updated!')
			})
		})
		.catch(error => console.error('Error:', error));
		await interaction.reply(`Planetary Campaigns have been force Updated`);
	}
	};