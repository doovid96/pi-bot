// src/commands/refresh.js

const premiere = require('../../data/premiere.json');
const { commandEmbed } = require('../utility/embeds.js');
const { beginTaskLoop } = require('../utility/reminders.js');
const { premiereRemindersSheets } = require('../utility/premiere.js');

exports.run = async (interaction) => {

  const allow = premiere.allow;
  if (Object.values(allow).findIndex(id => id == interaction.user.id) == -1) {
    interaction.reply({
      content: interaction.user.toString(),
      embeds: [commandEmbed(interaction.commandName, 'You do not have permission to refresh reminders.')],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }

  if (interaction.client.timerId != undefined) {
    clearInterval(interaction.client.timerId);
  }
  premiereRemindersSheets().then(reminders => {
    beginTaskLoop(interaction.client, reminders);
    interaction.reply({
      content: interaction.user.toString(),
      embeds: [commandEmbed(interaction.commandName, 'Reminders have been refreshed.')],
      ephemeral: false
    }).catch(e => console.error(e));
  }, (err) => {
    console.error('Unable to refresh reminders.');
    console.error(err);
  });

}
