/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Message } from 'ailurus';

interface Options {
	aliases: string[];
	description: string;
	hidden?: boolean;
	example: string;
	contextMenu?: boolean;
	type?: 'MESSAGE' | 'USER' | 'CHAT_INPUT';
}

export default class Command {
	// Options

	public aliases: string[];
	public id: string;
	public description: string;
	public example: string;

	constructor(id: string, { aliases, description, hidden, example, contextMenu, type }: Options) {
		// Love JS making me redefine options 4x
		this.aliases = aliases;
		this.id = id;
		this.description = description;
		this.example = example;
	}

	// eslint-disable-next-line
	public exec(val: Message, args: readonly string[]) {
		throw new Error("Couldn't find exec function.");
	}
}
