// src/events/ready.js

const { readyEmbed } = require('../utility/embeds.js');
const { beginTaskLoop } = require('../utility/reminders.js');
const { premiereRemindersSheets } = require('../utility/premiere.js');

module.exports = async (client) => {

  client.user.setActivity({
		name: client.properties.ActivityOptions.name,
		type: client.properties.ActivityOptions.type
	});

	const reminders = await premiereRemindersSheets();
	beginTaskLoop(client, reminders)
    .catch(e => {
		  console.error('Unable to send reminders.');
		  console.error(e);
    });

  client.users.fetch(client.properties.owner)
		.then(user => user.send({ content: user.toString(), embeds: [readyEmbed(client)] }))
    .then(console.log('The bot is ready!'))
		.catch(e => console.error(e));
}
