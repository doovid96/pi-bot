// src/commands/subtract.js

const { commandEmbed } = require('../utility/embeds.js');

exports.run = async (interaction) => {

  const minuend = interaction.options.getNumber('minuend');
  const subtrahend = interaction.options.getNumber('subtrahend');
  const difference = minuend - subtrahend;
  const value = `${minuend} - ${subtrahend} = ${difference}`;

  interaction.reply({
    content: interaction.user.toString(),
    embeds: [commandEmbed(interaction.commandName, value)],
    ephemeral: true
  }).catch(e => console.error(e));

}
