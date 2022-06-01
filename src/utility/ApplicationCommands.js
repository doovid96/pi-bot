// src/utility/deployCommands.js

const process = require('process');
const { Client } = require('discord.js');
const fs = require('fs');
const properties = require('../../data/properties.json');

const client = new Client({ intents:[] });

const guildCommandNames = (guildId) => {
  try {
    commandNameList = [];
    const commandFiles = fs.readdirSync(`../../data/ApplicationCommandData/${guildId}`).filter(f => f.endsWith('.json'));
    for (const file of commandFiles) {
      const name = file.split('.')[0];
      commandNameList.push(name);
    }
    return commandNameList;
  } catch (e) {
    console.error(e);
    console.error('guildCommandNames: Unable to get guild command names.')
    return [];
  }
}

const globalCommandNames = () => {
  try {
    commandNameList = [];
    const commandFiles = fs.readdirSync(`../../data/ApplicationCommandData`).filter(f => f.endsWith('.json'));
    for (const file of commandFiles) {
      const name = file.split('.')[0];
      commandNameList.push(name);
    }
    return commandNameList;
  } catch (e) {
    console.error(e);
    console.error('globalCommandNames: Unable to get global command names.');
    return [];
  }
}

const deployGuildApplicationCommands = async (client, guildId) => {
  try {
    let guild = client.guilds.cache.get(guildId);
    if (!guild) {
      throw `Unable to locate guild in cache with guildId (${guildId}).`;
    }
    const commandNames = guildCommandNames(guildId);
    console.log(`Deploying guild application commands for guild (${guild.id})...`);
    for (const commandName of commandNames) {
      const data = require(`../../data/ApplicationCommandData/${guildId}/${commandName}.json`);
      await guild.commands.create(data);
      console.log(`\tCreated guild application command ${data.name} for ${guild.id}`);
    }
    console.log(`Successfully deployed guild application commands for guild ${guild.id}`);
  } catch (e) {
    console.error(e);
    console.error('deployGuildApplicationCommands: Unable to deploy guild application commands.')
  }
}

const deployGlobalApplicationCommands = async (client) => {
  try {
    const commandNames = globalCommandNames();
    console.log('Deploying global application commands...');
    for (const commandName of commandNames) {
      const data = require(`../../data/ApplicationCommandData/${commandName}.json`);
      await client.application.commands.create(data);
      console.log(`\tCreated global application command ${data.name}`);
    }
    console.log('Successfully deployed global application commands');
  } catch (e) {
    console.error(e);
    console.error('deployGlobalApplicationCommands: Unable to deploy global application commands.')
  }
}

const clearGuildApplicationCommands = async (client, guildId) => {
  try {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      throw `Unable to locate guild in cache with guildId (${guildId}).`;
    }
    await guild.commands.set([]);
    console.log(`Cleared guild application commands for ${guildId}`);
  } catch (e) {
    console.error(e);
    console.error('clearGuildApplicationCommands: Unable to clear guild application commands.')
  }
}

const clearGlobalApplicationCommands = async (client) => {
  try {
    await client.application.commands.set([]);
    console.log('Cleared global application commands');
  } catch (e) {
    console.error(e);
    console.error('clearGlobalApplicationCommands: Unable to clear global application commands.')
  }
}

client.on('ready', async (client) => {

  const PremiereId = '189104277380268032';
  const PremiereTestServer = '894694514307006564';
  const ReichenbachId = '524963693201588254';

  await clearGuildApplicationCommands(client, ReichenbachId);
  // await clearGuildApplicationCommands(client, PremiereTestServer);
  // await clearGuildApplicationCommands(client, PremiereId);
  // await clearGlobalApplicationCommands(client);

  await deployGuildApplicationCommands(client, ReichenbachId);
  // await deployGuildApplicationCommands(client, PremiereTestServer);
  // await deployGuildApplicationCommands(client, PremiereId);
  // await deployGlobalApplicationCommands(client);

  process.exit(0);

});

client.login(properties.token);
