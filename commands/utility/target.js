const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
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
						.setDescription('The planet you wish to cast your vote for (MAKE SURE YOU SPELL IT RIGHT)'),
				),
		)
		.addSubCommand(subcommand =>
			subcommand
				.setName('current')
				.setDescription('Shows the current community chosen target planet'),
		),

	async execute(interaction) {
		const votesJSON = JSON.parse(fs.readFileSync('./votes.json'));
		if (!votesJSON) {
			const start = Date.now();
			console.log('./votes.json not found. Generating new File');
			const tempJSON = {
				user: 'testuser',
				vote: 'testvote',
			};
			fs.writeFileSync('./votes.json', tempJSON);
			const end = Date.now();
			const delta = end - start;
			console.log(`Done! Elapsed time: ${delta} ms`);
		}
		if (interaction.options.getSubcommand() === 'vote') {
			console.log('Filing away vote democratically...');
			const autoFinder = votesJSON.find(item => item.user === interaction.user.username);
			if (!autoFinder) {
				const tempJSON = {
					id: votesJSON.length + 1,
					user: interaction.user.username,
					vote: interaction.options.getString('planet'),
					voteDate: Date.now(),
				};
				votesJSON.push(tempJSON);
				stringyJSON = JSON.stringify(votesJSON);
				fs.writeFileSync('./votes.json', stringyJSON);
				console.log('New user voted!');
				await interaction.reply({
					content: `Thank you for casting your vote for ${interaction.options.getString('planet')}. It will be democratically added to the rest.`,
					ephemeral: true,
				});
			} else if ((autoFinder.voteDate - Date.now()) > 600000) {
				await interaction.reply({
					content: 'You have voted within the last 10 minutes. Please try again later...',
					ephemeral: true,
				});
			} else {
				votesJSON[interaction.user.username]['user'] = interaction.options.getString('planet');
				stringyJSON = JSON.stringify(votesJSON);
				fs.writeFileSync('./votes.json', stringyJSON);
				console.log(`${interaction.user.username} cast their vote again!`);
				await interaction.reply({
					content: `Thank you for casting your vote for ${interaction.options.getString('planet')}. It will be democratically added to the rest.`,
					ephemeral: true,
				});
			}
		} else if (interaction.options.getSubcommand() === 'current') {

		}
	},
};