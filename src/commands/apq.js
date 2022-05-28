// src/commands/apq.js

const premiere = require('../../data/premiere.json');
const { apqEmbed } = require('../utility/embeds.js');

exports.run = async (interaction) => {

  const image = premiere.images.apq;
  const thumbnail = premiere.images.apple;

  interaction.reply({
    content: interaction.user.toString(),
    embeds: [apqEmbed(image, thumbnail)],
    ephemeral: true
  }).catch(e => console.error(e));

}
