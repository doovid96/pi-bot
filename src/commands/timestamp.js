// src/commands/timestamp.js

const { timestampEmbed } = require('../utility/embeds.js');

const getCurrentTime = () => {
  const now = new Date();
  return {
		year: now.getUTCFullYear(),
		month: now.getUTCMonth() + 1, // (0,11) + 1
		date: now.getUTCDate(),
		hour: now.getUTCHours(),
		minute: now.getUTCMinutes(),
		second: now.getUTCSeconds()
	};
}

const getInputTime = (interaction) => {
  return {
    year: interaction.options.getInteger('year'),
    month: interaction.options.getInteger('month'),
    date: interaction.options.getInteger('date'),
    hour: interaction.options.getInteger('hour'),
    minute: interaction.options.getInteger('minute'),
    second: interaction.options.getInteger('second')
  };
}

const getDefaultValues = () => {
  return {
    year: 1970,
    month: 1,
    date: 1,
    hour: 0,
    minute: 0,
    second: 0
  };
}

const extractOutput = (unitNames, inputTime) => {
  const output = {};
  for (const unitName of unitNames) {
    const inputValue = inputTime[unitName];
    if (inputValue) {
      output[unitName] = inputValue;
    }
  }
  return output;
}

const setCurrentValues = (output, currentTime, unitNames, minIndex) => {
  for (let i = 0; i < minIndex; ++i) {
    const unitName = unitNames[i];
    if (!Object.keys(output).includes(unitName)) {
      output[unitName] = currentTime[unitName];
    }
  }
}

const setDefaultValues = (output, defaultValues, unitNames, minIndex, defaultedUnits) => {
  for (let i = minIndex + 1; i < unitNames.length; ++i) {
    const unitName = unitNames[i];
    if (!Object.keys(output).includes(unitName)) {
      output[unitName] = defaultValues[unitName];
      defaultedUnits.push(unitName);
    }
  }
}

const sendCurrentTime = (interaction, currentTime, style, verbose) => {
  const options = {
    embeds: [timestampEmbed(currentTime, style, verbose)],
    ephemeral: false
  };
  if (verbose) {
    options.content = 'Displaying the current time.';
  }
  interaction.reply(options).catch(e => console.error(e));
}

const embedContent = (defaultedUnits) => {
  const content = defaultedUnits.length == 1
    ? `${defaultedUnits[0]} has been given a default value.`
    : `${defaultedUnits.slice(0, defaultedUnits.length - 1).join(', ')} and ${defaultedUnits.slice(-1)} have been given default values.`;
  return content.charAt(0).toUpperCase() + content.slice(1);
}

const sendInputTime = (interaction, output, style, defaultedUnits, verbose) => {
  const options = {
    embeds: [timestampEmbed(output, style, verbose)],
    ephemeral: false
  };
  if (verbose) {
    options.content = embedContent(defaultedUnits);
  }
  interaction.reply(options).catch(e => console.error(e));
}

exports.run = async (interaction) => {
  const currentTime = getCurrentTime();
  const inputTime = getInputTime(interaction);
  const defaultValues = getDefaultValues();
  const style = interaction.options.getString('style', true);
  const verbose = interaction.options.getBoolean('verbose') ?? false;
  const unitNames = ['year', 'month', 'date', 'hour', 'minute', 'second'];
  const inputProvided = unitNames.map(unitName => inputTime[unitName]).some(t => t != undefined);
  if (!inputProvided) {
    sendCurrentTime(interaction, currentTime, style, verbose)
    return;
  }
  const output = extractOutput(unitNames, inputTime);
  const minIndex = Math.min(...Object.keys(output).map(inputUnit => unitNames.findIndex(u => u == inputUnit)));
  setCurrentValues(output, currentTime, unitNames, minIndex);
  const defaultedUnits = [];
  setDefaultValues(output, defaultValues, unitNames, minIndex, defaultedUnits);
  sendInputTime(interaction, output, style, defaultedUnits, verbose);
}
