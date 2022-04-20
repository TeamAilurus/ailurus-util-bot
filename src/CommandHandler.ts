/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Client, Message } from 'ailurus';
import * as path from 'path';
import Command from './structs/Command';
import { readdirRecursive } from './utils';

export default class CommandHandler {
	private commands = new Map<string, Command>();
	private aliases = new Map<string, Command>();
	private commandCategories = new Map<Command, string>();
	private categories: string[] = [];

	constructor(public client: Client, path: string, private prefix: string) {
		void this.init(path, prefix);
	}

	public exec(id: string, message: Message, args: string[]): void {
		if (!this.commands.has(id)) return console.warn('Could not find command id!');
		const command = this.commands.get(id);
		if (command instanceof Command) command.exec(message, args);
	}

	public async init(folder: string, prefix: string): Promise<[Map<string, Command>, string[], Map<Command, string>]> {
		// eslint-disable-next-line no-return-await
		return await new Promise<[Map<string, Command>, string[], Map<Command, string>]>((resolve) => {
			const filepaths = readdirRecursive(folder);

			for (const filepath of filepaths) {
				const resolved = path.resolve(filepath);

				if (!resolved.endsWith('.js')) continue;

				console.log(`./${filepath.replace(/\\/g, '/').replace(/dist\//g, '')}`);

				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const file = require(`./${filepath.replace(/\\/g, '/').replace(/dist\//g, '')}`);

				const arr = resolved.split('\\').length === 1 ? resolved.split('/') : resolved.split('\\');

				const category = arr.length >= 2 ? arr[arr.length - 2] : arr[arr.length - 1];

				const command: Command = new file.default();

				if (this.commands.has(command.id)) throw new Error('DUPLICATE_ID');

				this.commands.set(command.id, command);
				if (!this.categories.includes(category)) this.categories.push(category);
				this.commandCategories.set(command, category);

				if (command instanceof Command) {
					for (const alias of command.aliases) {
						this.aliases.set(alias, command);
					}
				}
			}

			resolve([this.commands, this.categories, this.commandCategories]);

			this.prefix = prefix;

			this.setup();
		});
	}

	private setup() {
		this.client.on('message', (m: Message) => {
			this.handle(m);
		});
	}

	private handle(message: Message) {
		if (!this.prefix) throw new Error("Promise returned from 'init' must be resolved before running handle!");
		const args = message.content.split(/ +/);
		if (!args[0].toLowerCase().startsWith(this.prefix)) return;
		if (this.aliases.has(args[0].toLowerCase().slice(this.prefix.length))) {
			const command = this.aliases.get(args[0].toLowerCase().slice(this.prefix.length));

			if (!command) return;

			command.exec(message, args.slice(1));
		}
	}

	get getCommands(): Map<string, Command> {
		return this.commands;
	}

	get getCommandCategories(): Map<Command, string> {
		return this.commandCategories;
	}

	get getCategories(): string[] {
		return this.categories;
	}

	get getAliases(): Map<string, Command> {
		return this.aliases;
	}

	get getPrefix(): string {
		return this.prefix;
	}
}
