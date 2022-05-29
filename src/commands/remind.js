// src/commands/timestamp.js

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

const stringifyTimeValues = (inputTime, unitNames) => {
  unitNames.forEach(unit => inputTime[unit] = inputTime[unit].toString());
}

const calculateDelayMilliseconds = (inputTime, nowDate) => {
  const reminderDayjs = dayjs(Date.UTC(inputTime.year, inputTime.month - 1, inputTime.date, inputTime.hour, inputTime.minute, inputTime.second));
  const nowDayjs = dayjs(nowDate);
  return reminderDayjs.diff(nowDayjs, 'millisecond');
}

const remindAt = async (interaction) => {
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
  stringifyTimeValues(inputTime, unitNames);
  const milliseconds = calculateDelayMilliseconds(inputTime, nowDate);
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 0) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, 'This time has passed.', inputTime)],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  else if (seconds < 10) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, `${seconds} until the time you asked for a reminder.`, inputTime)],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  else if (seconds > 60*60*24) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, 'Reminder unsuccessful. Limit of one day.', inputTime)],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  else {
    interaction.reply({
      content: 'Restarts interrupt reminders.',
      embeds: [commandEmbed(interaction.commandName, `Reminder successful.`, inputTime)],
      ephemeral: false
    }).catch(e => console.error(e));
  }
  setTimeout(() => {
    interaction.channel.send({
      content: interaction.user.toString(),
      embeds: [commandEmbed(interaction.commandName, 'Reminding you.')]
    }).catch(e => console.error(e));
  }, milliseconds);
}

const remindIn = async (interaction) => {
  interaction.reply({
    content: 'placeholder',
    ephemeral: true
  }).catch(e => console.log(e));
}

exports.run = async (interaction) => {
  const type = interaction.options.getString('type', true);
  if (type == 'at') {
    remindAt(interaction);
  }
  else if (type == 'in') {
    remindIn(interaction);
  }
}
