// src/commands/discriminator.js

const { commandEmbed } = require('../utility/embeds.js');

exports.run = async (interaction) => {
  interaction.reply({
    content: interaction.user.toString(),
    embeds: [commandEmbed(interaction.commandName, interaction.user.discriminator)],
    ephemeral: true
  }).catch(e => console.error(e));
}
