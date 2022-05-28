// src/utility/embeds.js

const { MessageEmbed } = require('discord.js');
const properties = require('../../data/properties.json');
const { temp } = require('./rpi.js');
const dayjs = require('dayjs');

function wrap(text, w) {
	return `${w}${text}${w}`;
}

function templateMessageEmbed() {
	const embed = new MessageEmbed()
		.setAuthor({name: properties.name, iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org'})
		.setTimestamp()
		.setFooter({text: properties.footer, iconURL: 'https://i.imgur.com/AfFp7pu.png'});
	return embed;
}

function reminderEmbed({title, description, message, thumbnail, image}) {
	const embed = new templateMessageEmbed()
		.setColor('#ff0000')
		.setTitle(title)
		.setDescription(description)
		.addField('Message', message);
	if (thumbnail) { embed.setThumbnail(thumbnail); }
	if (image) { embed.setImage(image); }
	return embed;
}

function helpEmbed() {
	const prefix = properties.prefix;
	const embed = templateMessageEmbed()
		.setColor('#00ff00')
		.setTitle('Help')
		.setDescription('Command Examples')
		.addFields(
			{ name: 'ied', value: `\`${prefix}ied 50 40 30 30 20 10 5 5 -5\`` },
			{ name: 'whoami', value: `\`${prefix}whoami\`` },
			{ name: 'sale', value: `\`${prefix}sale 123,456,789 5 mvp\`` },
			{ name: 'time', value: `\`${prefix}time year 2030 month 3 date 5 hour 2 minute 10 second 39\`` },
			{ name: 'timestamp', value: `\`${prefix}timestamp year 2030 month 3 date 5 hour 2 minute 10 second 39\`` }
		);
	return embed;
}


function commandEmbed(title, description, rest = {}) {
	const embed = templateMessageEmbed()
		.setColor('ffffff')
		.setTitle(title)
		.setDescription(description);
	for (const [key, value] of Object.entries(rest)) {
		embed.addField(key, value);
	}
	return embed;
}

function discordTimestamp(timestamp, style = 'f') {
	return `<t:${timestamp}:${style}>`;
}

function timestampSyntax(timestamp, style = 'f') {
	return `\`${discordTimestamp(timestamp, style)}\``;
}

function timestampExample(timestamp, style = 'f') {
	return `\`${timestampSyntax(timestamp, style)}\` shows as ${discordTimestamp(timestamp, style)}.`
}

function timestampEmbed(inputTime, style, verbose) {
	const date = new Date(Date.UTC(0, inputTime.month - 1, inputTime.date, inputTime.hour, inputTime.minute, inputTime.second));
	date.setUTCFullYear(inputTime.year);
	const timestamp = dayjs(date).unix();
	const styleDescription = {
		t: "Short Time",
		T: "Long Time",
		d: "Short Date",
		D: "Long Date",
		f: "Short Date/Time (default)",
		F: "Long Date/Time",
		R: "Relative Time"
	};
	const embed = templateMessageEmbed()
		.setColor('ffff00')
		.setTitle('timestamp');
	if (verbose) {
		embed.setDescription('Number of seconds elapsed since the [Epoch time](https://en.wikipedia.org/wiki/Unix_time).');
		embed.addFields(
			{ name: 'UNIX Timestamp', value: timestamp.toString() },
			{ name: styleDescription[style], value: timestampExample(timestamp, style) },
			{ name: 'year', value: inputTime.year.toString(), inline: true },
			{ name: 'month (1 - 12)', value: inputTime.month.toString(), inline: true },
			{ name: 'date (1 -)', value: inputTime.date.toString(), inline: true },
			{ name: 'hour (0 - 23)', value: inputTime.hour.toString(), inline: true },
			{ name: 'minute (0 - 59)', value: inputTime.minute.toString(), inline: true },
			{ name: 'second (0 - 59)', value: inputTime.second.toString(), inline: true } );
	} else {
		embed.setDescription(discordTimestamp(timestamp, style));
	}
	return embed;
}

function readyEmbed(client) {
	const embed = templateMessageEmbed()
		.setColor('#0099ff')
		.setTitle('Ready')
		.addFields(
			{ name: 'tag', value: wrap(client.user.tag, '`'), inline: true },
			{ name: 'guilds', value: wrap(client.guilds.cache.size.toString(), '`'), inline: true },
			{ name: 'commands', value: [ ...client.commands.keys() ].map((s) => wrap(s, '`')).join(', '), inline: false },
			{ name: 'readyAt', value: wrap(client.readyAt.toString(), '`'), inline: false }
		);
	return embed;
}

function whoamiEmbed(user) {
	const embed = templateMessageEmbed()
		.setColor('#000000')
		.setTitle('User Properties')
		.setURL('https://discord.js.org/#/docs/main/stable/class/User')
		.addFields(
			{ name: 'username', value: wrap(user.username, '`'), inline: true },
			{ name: 'discriminator', value: wrap(user.discriminator, '`'), inline: true },
			{ name: 'tag', value: wrap(user.tag, '`'), inline: true },
			{ name: 'id', value: wrap(user.id, '`'), inline: false },
			{ name: 'createdAt', value: wrap(user.createdAt, '`'), inline: false }
		);
	return embed;
}

function checklistEmbed() {
	configure = [
		'Legion Grid Preset',
		'Hyper Stat Preset',
		'Familiars Preset',
		'Link Skills',
		`Bossing Equipment ~~drop/meso~~`
	];
	consumables = [
		'Extreme Green Potion',
		'Extreme Red Potion',
		'Buff Freezers',
		'Greater Blessing of the Guild',
		'Masur\'s Weather Effect (Ursus)',
		'Attack Buff (e.g. Onyx Apple)',
		'Advanced Boss Rush Boost Potion',
		'Advanced STR/DEX/INT/LUK Potion/Pill X',
		'Candied Apple',
		'MVP Superpower Buff'
	];
	skills = [
		'Takeno\'s Blessing',
		'Yorozu\'s Wisdom',
		'Echo of Hero (or variant)',
		'Advanced Weapon Tempering',
		'Noblesse Skills',
		'Level 275/250 Chair Fame Buff'
	];
	const embed = templateMessageEmbed()
		.setColor('#ffff00')
		.setTitle('Checklist')
		.addFields(
			{ name: 'Configurations', value: configure.join('\n'), inline: false },
			{ name: 'Consumables', value: consumables.join('\n'), inline: false },
			{ name: 'Skills', value: skills.join('\n'), inline: false }
		)
		.setThumbnail('https://cdn.discordapp.com/attachments/265677548497797130/927798095377489942/checkmark.png');
	return embed;
}

function tempEmbed() {
	const embed = templateMessageEmbed()
		.setColor('ff0000')
		.setTitle('temp');
	const c = temp();
	if (!c) {
		embed.setDescription('Unable to read temperature.');
		return embed;
	}
	embed.addFields(
		{ name: 'Celcius', value: c.toString(), inline: true },
		{ name: 'Farenheit', value: (c*1.8+32.0).toFixed(1), inline: true }
	);
	return embed;
}

function saleEmbed(mesos, partySize, isMVP) {
	const tax = isMVP ? 0.03 : 0.05;
	const mesosReceived = mesos*(1.00 - tax);
	const tradeAmount = Math.floor(mesosReceived/(partySize - 0.05));
	const embed = templateMessageEmbed()
		.setColor('#00ff00')
		.setTitle('sale');
	embed.addFields(
		{
			name: 'Trade To Party (mesos)',
			value: `${tradeAmount.toLocaleString()}\n${tradeAmount}`
		},
		{
			name: '\u200B',
			value: '\u200B'
		},
		{
			name: 'Listing Amount (mesos)',
			value: mesos.toLocaleString()
		},
		{
			name: 'Received Amount (mesos)',
			value: Math.floor(mesosReceived).toLocaleString()
		},
		{
			name: 'MVP Discount',
			value: isMVP ? 'applied' : 'not applied',
			inline: false
		},
		{
			name: 'Tax Applied (%)',
			value: (tax*100).toString(),
			inline: true
		},
		{
			name: 'Party Size',
			value: partySize.toLocaleString()
		}
	);
	embed.setThumbnail('https://cdn.discordapp.com/emojis/617213926723158056.png?v=1');
	return embed;
}

function apqEmbed(image, thumbnail) {
	const embed = templateMessageEmbed()
		.setColor('#a020f0')
		.setTitle('apq')
		.setImage(image)
		.setThumbnail(thumbnail);
	return embed;
}

module.exports = { helpEmbed, readyEmbed, reminderEmbed, commandEmbed, whoamiEmbed, checklistEmbed, tempEmbed, saleEmbed, apqEmbed, timestampEmbed };
