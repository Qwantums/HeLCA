const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('squad')
		.setDescription('Displays information about specified squadron')
		//  Targets - Shows the squadrons selected target as well as the Fleets (if it is different)
		//  Info - Shows basic information about the squadron
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Displays info about squad')
				.addStringOption(option =>
					option
						.setName('squad')
						.setDescription('Search for information on a specific Squad')
						.setMaxLength(15),
				),
		)
		//	Create
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Creates a new Squadron')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('The display name of your Squadron')
						.setMaxLength(15)
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName('description')
						.setDescription('A summary of what kind of squad you are')
						.setMaxLength(100),
				),
		),
	//	Disband
	//	Join
	//	Leave
	//	Actual script
	async execute(interaction) {
		//	Info
		const usersJSON = JSON.parse(fs.readFileSync('./users.json'));
		if (!usersJSON) {
			throw new Error('/users.json could not be read');
		}
		const jsonSquad = JSON.parse(fs.readFileSync('./squads.json'));
		if (!jsonSquad) {
			throw new Error('/squads.json could not be read');
		}
		if (interaction.options.getSubcommand() === 'info') {
			const autoFinder = usersJSON
				.find(item => item.name === interaction.user.username);
			const squadFinder = jsonSquad
				.find(item => item.name === (interaction.options.getString('squad') ?? autoFinder.squad));
			await interaction.reply(`Name: ${squadFinder.name}\nDescription: ${squadFinder.description}\nCommander: ${squadFinder.commander}\nMembers: ${squadFinder.members}`);
		//	Create
		} else if (interaction.options.getSubcommand() === 'create') {
			//	check if user is already in squad
			const userFinder = usersJSON
				.find(item => item.name === interaction.user.username);
			if (!userFinder) {
				//	read json
				const squadCount = squadsJSON.length;
				if (!squadsJSON) {
					throw new Error('/squads.json could not be read');
				} else if (!squadCount) {
					throw new Error('/squads.json could not be counted');
				} else {
					console.log('Done!');
					//	Construct object
					const squad = {
						name: interaction.options.getString('name'),
						description: interaction.options.getString('description') ?? 'n/a',
						members: 1,
						commander: interaction.user.username,
						fleet: 'N/A',
						id: squadCount + 1,
						vote: null,
					};
					//	Add squad to database
					squadsJSON.push(squad);
					try {
						fs.writeFileSync('./squads.json', JSON.stringify(squadsJSON));
					} catch (err) {
						console.error('Could not save /squads.json Error:', err);
						await interaction.reply('Critical Error! Something really messed up');
						return;
					}
					//	and user
					const userCount = usersJSON.length;
					if (!userCount) {
						throw new Error('/users.json could not be counted');
					} else {
						const user = {
							name: interaction.user.username,
							squad: squad.name,
							id: userCount + 1,
							vote: null,
						};
						usersJSON.push(user);
						try {
							fs.writeFileSync('./users.json', JSON.stringify(usersJSON));
						} catch (err) {
							console.error('Could not save /users.json. Error:', err);
							await interaction.reply('Critical Error! Something really messed up');
							return;
						}
					}
					//	Tell Discord its done
					await interaction.reply(`${squad.name} has been created. Good Helldiving!`);
				}
			} else {
				await interaction.reply('You are already in a squad. Leave your current squad to create a new one.');
				console.log('Someone tried to create a squad while in one!');
			}
		}
	},
};