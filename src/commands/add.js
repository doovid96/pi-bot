// src/commands/add.js

const { commandEmbed } = require('../utility/embeds.js');

exports.run = async (interaction) => {

  const addend1 = interaction.options.getNumber('addend1', true);
  const addend2 = interaction.options.getNumber('addend2', true);
  const sum = addend1 + addend2;
  const value = `${addend1} + ${addend2} = ${sum}`;

  interaction.reply({
    content: interaction.user.toString(),
    embeds: [commandEmbed(interaction.commandName, value)],
    ephemeral: true
  }).catch(e => console.error(e));

}
