// src/commands/whoami.js

const { whoamiEmbed } = require('../utility/embeds.js')

exports.run = async (interaction) => {
  interaction.reply({
    content: interaction.user.toString(),
    embeds: [whoamiEmbed(interaction.user)],
    ephemeral: true
  })
}
