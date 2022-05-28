// src/commands/hi.js

const { commandEmbed } = require('../utility/embeds.js');

exports.run = async (interaction) => {
  interaction.reply({
    content: interaction.user.toString(),
    embeds: [commandEmbed(interaction.commandName, 'hello')],
    ephemeral: false
  }).catch(e => console.error(e));
}
