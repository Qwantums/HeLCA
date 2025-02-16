const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const VotingSystem = require('voting.js');

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
						.setDescription('The planet you wish to cast your vote for (MAKE SURE YOU SPELL IT RIGHT)'),
				),
		)
		.addSubCommand(subcommand =>
			subcommand
				.setName('current')
				.setDescription('Shows the current community chosen target planet'),
		),

	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'vote') {
			const time = Date.now();
			const id = interaction.user.id;
			const vote = interaction.options.getString('planet');
			VotingSystem.vote(time, id, vote);
		}
		if (interaction.options.getSubcommand() === 'current') {
			
		}
	},
};