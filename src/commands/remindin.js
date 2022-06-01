// src/commands/remindin.js

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const { commandEmbed } = require('../utility/embeds.js');

const getInputTime = (interaction, unitNames) => {
  const input = {};
  for (const name of unitNames) {
    input[name] = interaction.options.getInteger(name, false) ?? 0;
  }
  return input;
}

const inputTimeToSeconds = (inputTime) => {
  return (inputTime.hours * 60 * 60)
    + (inputTime.minutes * 60)
    + inputTime.seconds;
}

const stringifyTimeValues = (inputTime, unitNames) => {
  unitNames.forEach(unit => inputTime[unit] = inputTime[unit].toString());
}

exports.run = async (interaction) => {
  const minSeconds = 10;
  const maxSeconds = 24 * 60 * 60;
  const unitNames = ['hours', 'minutes', 'seconds'];
  const inputTime = getInputTime(interaction, unitNames);
  const seconds = inputTimeToSeconds(inputTime);
  if (seconds < minSeconds) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, `Unsuccessful: Minimum of ${minSeconds.toLocaleString()} seconds.`)],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  if (seconds > maxSeconds) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, `Unsuccessful: Maximum of ${maxSeconds.toLocaleString()} seconds.`)],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  stringifyTimeValues(inputTime, unitNames);
  interaction.reply({
    embeds: [commandEmbed(interaction.commandName, `Successful: Sending reminder in ${seconds.toLocaleString()} seconds.`, inputTime)],
    ephemeral: false
  }).catch(e => console.error(e));
  setTimeout(() => {
    interaction.user.send({
      embeds: [commandEmbed(interaction.commandName, interaction.options.getString('message', true))]
    }).catch(e => console.error(e));
  }, seconds * 1000);
}
