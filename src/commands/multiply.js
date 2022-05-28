// src/commands/add.js

const { commandEmbed } = require('../utility/embeds.js');

exports.run = async (interaction) => {

  const factor1 = interaction.options.getNumber('factor1');
  const factor2 = interaction.options.getNumber('factor2');
  const product = factor1 * factor2;
  const value = `${factor1} x ${factor2} = ${product}`;

  interaction.reply({
    content: interaction.user.toString(),
    embeds: [commandEmbed(interaction.commandName, value)],
    ephemeral: false
  }).catch(e => console.error(e));

}
