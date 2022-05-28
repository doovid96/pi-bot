// app.js

const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
	]
});

const properties = require('./data/properties.json');
client.properties = properties;

const eventsFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventsFiles) {
	const eventName = file.split('.')[0];
	console.log(`Loading event: ${eventName}`);
	const event = require(`./src/events/${file}`);
	client.on(eventName, event.bind(null));
}

client.commands = new Collection();
const commandsFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandsFiles) {
	const commandName = file.split('.')[0];
	const commandFunction = require(`./src/commands/${file}`);
	console.log(`Loading command: ${commandName}`);
	client.commands.set(commandName, commandFunction);
}

client.login(properties.token);
