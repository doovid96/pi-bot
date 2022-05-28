// src/events/interactionCreate

module.exports = async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { client, commandName } = interaction;
  const command = client.commands.get(commandName);
  command.run(interaction);
}
