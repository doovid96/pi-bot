// src/commands/remindat.js

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const { commandEmbed } = require('../utility/embeds.js');

const getInputTime = (interaction, unitNames) => {
  const input = {};
  for (const name of unitNames) {
    input[name] = interaction.options.getInteger(name);
  }
  return input;
}

const fillTimeValues = (inputTime, unitNames, minIndex, nowDate) => {
  const currentValues = {
    year: nowDate.getUTCFullYear(),
    month: nowDate.getUTCMonth() + 1,
    date: nowDate.getUTCDate(),
    hour: nowDate.getUTCHours(),
    minute: nowDate.getUTCMinutes(),
    second: nowDate.getUTCSeconds()
  };
  const defaultValues = {
    year: 1970,
    month: 1,
    date: 1,
    hour: 0,
    minute: 0,
    second: 0
  };
  for (let i = 0; i < minIndex && i < unitNames.length; ++i) {
    const unit = unitNames[i];
    if (!inputTime[unit]) {
      inputTime[unit] = currentValues[unit];
    }
  }
  for (let i = minIndex + 1; i < unitNames.length; ++i) {
    const unit = unitNames[i];
    if (!inputTime[unit]) {
      inputTime[unit] = defaultValues[unit];
    }
  }
}

const calculateSeconds = (inputTime, nowDate) => {
  const reminderDayjs = dayjs(Date.UTC(inputTime.year, inputTime.month - 1, inputTime.date, inputTime.hour, inputTime.minute, inputTime.second));
  const nowDayjs = dayjs(nowDate);
  return reminderDayjs.diff(nowDayjs, 'second');
}

const stringifyTimeValues = (inputTime, unitNames) => {
  unitNames.forEach(unit => inputTime[unit] = inputTime[unit].toString());
}

exports.run = async (interaction) => {
  const minSeconds = 10;
  const maxSeconds = 24 * 60 * 60;
  const nowDate = new Date();
  const unitNames = ['year', 'month', 'date', 'hour', 'minute', 'second'];
  const inputTime = getInputTime(interaction, unitNames);
  const inputProvided = unitNames.map(name => inputTime[name]).some(number => number != undefined);
  if (!inputProvided) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, 'No input was provided.')],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  const indices = Object.entries(inputTime)
    .filter(pair => pair[1] != null)
    .map(pair => unitNames.findIndex(name => name == pair[0]));
    const minIndex = Math.min(...indices);
  fillTimeValues(inputTime, unitNames, minIndex, nowDate);
  const seconds = calculateSeconds(inputTime, nowDate);
  stringifyTimeValues(inputTime, unitNames);
  if (seconds < 0) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, 'Unsuccessful: This time has passed.', inputTime)],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  if (seconds < minSeconds) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, `Unsuccessful: This time is in ${seconds.toLocaleString()} seconds which is less than the minimum allowed time of ${seconds.toLocaleString()} seconds.`, inputTime)],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  if (seconds > maxSeconds) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, `Unsuccessful: This time is in ${seconds.toLocaleString()} seconds which is more than the maximum allowed time of ${maxSeconds.toLocaleString()} seconds.`, inputTime)],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  interaction.reply({
    embeds: [commandEmbed(interaction.commandName, `Successful: Setting reminder in ${seconds.toLocaleString()} seconds.`, inputTime)],
    ephemeral: true
  }).catch(e => console.error(e));
  setTimeout(() => {
    interaction.user.send({
      embeds: [commandEmbed(interaction.commandName, interaction.options.getString('message', true))]
    }).catch(e => console.error(e));
  }, seconds * 1000);
}
