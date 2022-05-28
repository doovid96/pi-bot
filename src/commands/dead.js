// src/commands/dead.js

exports.run = async (interaction) => {
  interaction.reply({
    content: '●▅▇█▇▆▅▄▇'
  }).catch(e => console.error(e));
}
