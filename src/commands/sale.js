// src/commands/sale.js

const { commandEmbed, saleEmbed } = require('../utility/embeds.js');

exports.run = async (interaction) => {

  const mesos = interaction.options.getInteger('mesos');
  const size = interaction.options.getInteger('size');
  const mvp = interaction.options.getBoolean('mvp');

  const saleErrorEmbed = (error, badArg) => badArg ?
		commandEmbed('sale', error, { arg: badArg }) :
		commandEmbed('sale', error);

  if (mesos < 50) {
    interaction.reply({
      content: interaction.user.toString(),
      embeds: [saleErrorEmbed('Less than 50 mesos not allowed!', mesos)]
    }).catch(e => console.error(e));
    return;
  }
  else if (mesos > 99_999_999_999) {
    interaction.reply({
      content: interaction.user.toString(),
      embeds: [saleErrorEmbed('Over max mesos!', mesos.toLocaleString())]
    }).catch(e => console.error(e));
    return;
  }
  else if (size < 2) {
    interaction.reply({
      content: interaction.user.toString(),
      embeds: [saleErrorEmbed('Party size under 2!', size.toLocaleString())]
    }).catch(e => console.error(e));
    return;
  }
  else if (size > 6) {
    interaction.reply({
      content: interaction.user.toString(),
      embeds: [saleErrorEmbed('Party size over max!', size.toLocaleString())]
    }).catch(e => console.error(e));
    return;
  }

  interaction.reply({
    content: interaction.user.toString(),
    embeds: [saleEmbed(mesos, size, mvp)]
  }).catch (e => console.error(e));

}
