// src/commands/active.js

const premiere = require('../../data/premiere.json');
const { premiereMembersSheets } = require('../utility/premiere.js');
const { headingError } = require('../utility/sheets.js');
const { commandEmbed } = require('../utility/embeds.js');

function getTextIndices(header) {
	const indices = {
		concatenation: header.findIndex((element) => element.toLowerCase() == 'concatenation')
	};
	return indices;
}

function getColumns(rows, indices) {
	const columns = {};
	const columnNames = Object.keys(indices);
	for (const name of columnNames) {
		columns[name] = [];
	}
	for (const row of rows) {
		for (const column of columnNames) {
			columns[column].push(row[indices[column]])
		}
	}
	return columns;
}

function partitionedMembers(_rows) {
	const rows = structuredClone(_rows);
	const header = rows.shift();
	const indices = getTextIndices(header);
	if (Object.values(indices).includes(-1)) {
		console.log(indices);
		throw headingError({ columnType: 'text', worksheetName: 'members' });
	}
	const column = getColumns(rows, indices).concatenation;
	const parts = [];
	const step = 20;
	for (let i = 0; i < column.length; i += step) {
		parts.push(column.slice(i, Math.min(i+step, column.length)).join('\n'));
	}
	return parts;
}

exports.run = async (interaction) => {

  if (!interaction.inGuild()) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, 'Command is not valid outside of a guild.')],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }

  const allow = premiere.allow;
  if (Object.values(allow).findIndex(id => id == interaction.user.id) == -1) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, 'You are not in the allow list.')],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }

	if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
    interaction.reply({
      embeds: [commandEmbed(interaction.commandName, 'You do not have permissions to delete messages in this guild.')],
      ephemeral: true
    }).catch(e => console.error(e));
    return;
  }

  interaction.reply({
    content: 'Working...',
    ephemeral: false
  }).catch(e => console.error(e));

  premiereMembersSheets().then(sheets => {
    const sendList = [
      premiere.images.lead,
      ...partitionedMembers(sheets.Lead),
      premiere.images.juniors,
      ...partitionedMembers(sheets.Juniors),
      premiere.images.members,
      ...partitionedMembers(sheets.Members),
      premiere.images.new,
      ...partitionedMembers(sheets.New)
    ];
    const sendMessages = () => {
      for (const content of sendList) {
        interaction.channel.send('To prevent a ping, send this content first and then edit it after.')
          .then(message => message.edit(content))
          .catch(e => console.error(e));
      }
    };
    interaction.channel.messages.fetch({ limit: sendList.length })
      .then(messages => messages.forEach(m => m.delete()))
      .then(sendMessages)
      .catch(e => console.error(e));
  })

}
