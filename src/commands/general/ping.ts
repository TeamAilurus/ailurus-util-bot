/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Message } from 'ailurus';
import Command from '../../structs/Command';

export default class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping'],
			description: "Shows the bot's Latency to Discord and Bot Latency",
			example: 'ai!ping'
		});
	}

	public async exec(message: Message) {
		return message.reply({
			content: 'Pong!'
		});
	}
}
