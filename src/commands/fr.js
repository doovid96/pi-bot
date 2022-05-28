// src/commands/fr.js

const { commandEmbed } = require('../utility/embeds.js');
const { frWarningMilliseconds } = require('../utility/reminders.js');

const guilds = {};

exports.run = async (interaction) => {

  const minutes = interaction.options.getInteger('minutes') ?? 2;
  if (minutes < 0 || minutes > 10) {
    interaction.reply({
      content: 'Argument should not be less than 0 and should not be greater than 10.',
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }

  const ms = frWarningMilliseconds(minutes);
  const s = Math.floor(ms/1_000)%60;
  const m = Math.floor(ms/60_000);
  const runner = guilds[interaction.guild.id];
  const timestampInteger = Math.round((interaction.createdTimestamp + ms + minutes* 60_000)/1000);
  const timestamp = `<t:${timestampInteger}:t>`;

  if (interaction.guild.available && Object.keys(guilds).includes(interaction.guild.id)) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, `${runner} may already be planning to run at ${timestamp}.`, { minutes: (m + minutes).toString(), seconds: s.toString() })],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  else if (interaction.guild) {
    guilds[interaction.guild.id] = interaction.user.toString();
  }

  interaction.reply({
    embeds: [commandEmbed(interaction.commandName, `${interaction.user.toString()} may be running the next flag race at ${timestamp}`, { minutes: (m + minutes).toString(), seconds: s.toString() })],
    ephemeral: false
  }).catch(e => console.error(e));
  interaction.user.send({
    embeds: [commandEmbed(interaction.commandName, `A reminder has been set.`, { minutes: m.toString(), seconds: s.toString() })]
  }).catch(e => console.error(e));

  const warning = () => {
    interaction.user.send({
      embeds: [commandEmbed(interaction.commandName, 'Enter soon.', { minutes: minutes.toString() })]
    }).catch(e => console.error(e));
  }
  const enter = () => {
    interaction.user.send({
      embeds: [commandEmbed(interaction.commandName, 'Enter now.')]
    }).catch(e => console.error(e));
    interaction.channel.send({
      embeds: [commandEmbed(interaction.commandName, `${interaction.user.toString()} may be in the flag race lobby.`)]
    }).catch(e => console.error(e));
    delete guilds[interaction.guild.id];
  }

  if (minutes > 0) setTimeout(warning, ms);
  setTimeout(enter, ms + minutes*60_000);

}
