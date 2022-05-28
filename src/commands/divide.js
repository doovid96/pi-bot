// src/commands/add.js

const { commandEmbed } = require('../utility/embeds.js');

exports.run = async (interaction) => {
  let value;
  const dividend = interaction.options.getNumber('dividend');
  const divisor = interaction.options.getNumber('divisor');
  value = divisor == 0.0 ? 'Cannot divide by zero.' : `${dividend} / ${divisor} = ${dividend / divisor}`;
  interaction.reply({
    embeds: [commandEmbed(interaction.commandName, value)],
    ephemeral: true
  }).catch(e => console.error(e));
}
