// src/commands/checklist.js

const { checklistEmbed } = require('../utility/embeds.js')

exports.run = async (interaction) => {

  const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

  interaction.reply({
    content: interaction.user.toString(),
    embeds: [checklistEmbed()],
    ephemeral
  }).catch(e => console.error(e));


}
