import { Client } from 'ailurus';
import 'dotenv/config';
import CommandHandler from './CommandHandler';

const client = new Client({
	intents: 131071
});

client.login();

new CommandHandler(client, './dist/commands/', '$');
