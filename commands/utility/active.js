const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('active')
		.setDescription('Reports all current Invasions and Liberation Campaigns'),
	async execute(interaction) {
		try {
			const parsedData = JSON.parse(fs.readFileSync('./jsondata/activecampaigns.json', 'utf8'))
			console.log('JSON Parsed!')
			for (let property in parsedData) 
				await interaction.reply('${property}: ${parsedData[property]}');
		} catch (err) {console.error(err);}
    }
}