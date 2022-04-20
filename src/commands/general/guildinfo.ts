/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Message } from 'ailurus';
import Command from '../../structs/Command';

export default class PingCommand extends Command {
	constructor() {
		super('guildinfo', {
			aliases: ['gi'],
			description: 'Displays information about the guild',
			example: 'ai!guildinfo'
		});
	}

	public async exec(message: Message) {
		if (!message.guild)
			return message.reply({
				content: 'This command can only be used in a guild!'
			});

		const { guild } = message;

		return message.reply({
			embeds: [
				{
					title: guild.name,
					fields: [
						{
							name: 'ID',
							value: guild.id
						}
					]
				}
			]
		});
	}
}
