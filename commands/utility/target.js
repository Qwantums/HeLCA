const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('target')
		.setDescription('Commands related to the community target')
		.addSubcommand(subcommand =>
			subcommand
				.setName('vote')
				.setDescription('Cast your vote on which planet should be the target')
				.addStringOption(option =>
					option
						.setName('planet')
						.setDescription('The planet you wish to cast your vote for'),
				),
		)
		.addSubCommand(subcommand =>
			subcommand
				.setName('current')
				.setDescription('Shows the current community chosen target planet'),
		)
		.addSubCommand(subcommand =>
			subcommand
				.setName('squad')
				.setDescription('Shows the current squad chosen target planet'),
		),

	async execute(interaction) {

	},
};