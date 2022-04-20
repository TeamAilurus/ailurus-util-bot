/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Message } from 'ailurus';
import Command from '../../structs/Command';

export default class Eval extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			description: 'emits the sent code - only usable by bot owner',
			example: 'ai!eval <code>',
			hidden: true
		});
	}

	public async exec(message: Message, args: string[]) {
		if (!message.author) return;
		if (message.author.id !== '97470053615673344') return;

		// eslint-disable-next-line
		const clean = (text: unknown) => {
			if (typeof text === 'string') {
				return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
			}
			return text;
		};

		try {
			const code = args.join(' ');
			// eslint-disable-next-line no-eval
			const evaled = eval(code);

			await message.reply({ content: `\`\`\`xl\n${clean(evaled)}\`\`\`` });
		} catch (err) {
			await message.reply({ content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\`` });
		}
	}
}
