// src/commands/ping.js

exports.run = async(interaction) => {

  interaction.reply({
    content: 'pong',
    ephemeral: true
  }).catch(e => console.error(e));

}
