// src/commands/ied.js

const { commandEmbed } = require('../utility/embeds.js');

exports.run = async (interaction) => {

  const source1 = interaction.options.getNumber('source1') ?? 0.0;
  const source2 = interaction.options.getNumber('source2') ?? 0.0;
  const source3 = interaction.options.getNumber('source3') ?? 0.0;
  const source4 = interaction.options.getNumber('source4') ?? 0.0;
  const source5 = interaction.options.getNumber('source5') ?? 0.0;
  const source6 = interaction.options.getNumber('source6') ?? 0.0;
  const source7 = interaction.options.getNumber('source7') ?? 0.0;
  const source8 = interaction.options.getNumber('source8') ?? 0.0;
  const source9 = interaction.options.getNumber('source9') ?? 0.0;
  const source10 = interaction.options.getNumber('source10') ?? 0.0;

  const sources = [
      interaction.options.getNumber('source1') ?? 0.0,
      interaction.options.getNumber('source2') ?? 0.0,
      interaction.options.getNumber('source3') ?? 0.0,
      interaction.options.getNumber('source4') ?? 0.0,
      interaction.options.getNumber('source5') ?? 0.0,
      interaction.options.getNumber('source6') ?? 0.0,
      interaction.options.getNumber('source7') ?? 0.0,
      interaction.options.getNumber('source8') ?? 0.0,
      interaction.options.getNumber('source9') ?? 0.0,
      interaction.options.getNumber('source10') ?? 0.0
  ];

  const positiveSources = sources.filter( x => x > 0.0 );
  const negativeSources = sources.filter( x => x < 0.0 );
  if (!positiveSources.length) {
    interaction.reply({
      content: interaction.user.toString(),
      embeds: [commandEmbed(interaction.commandName, 'You must have at least one positive source.')],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }
  let ied = 1 - positiveSources.map(x => 1-x/100.0).reduce((a, b) => a*b, 1.0);
	ied = 1 - (1 - ied) * negativeSources.map(x => 1/(1-x/-100.0)).reduce((a, b) => a*b, 1.0);
  ied = Math.max(ied * 100.0, 0.0).toFixed(2);
  interaction.reply({
    content: interaction.user.toString(),
    embeds: [commandEmbed(interaction.commandName, ied.toString())],
    ephemeral: false
  }).catch(e => console.error(e));

}
