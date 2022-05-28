// src/utility/premiere.js

const premiere = require('../../data/premiere.json');
const { getSheetValues } = require('./sheets.js');

async function premiereSheets(workbook) {
	const tables = {};
	for (const name of workbook.worksheets) {
		tables[name] = await getSheetValues({
			id: workbook.id,
			name
		});
	}
	return tables;
}

async function premiereRemindersSheets() {
	return await premiereSheets(premiere.workbooks.reminders);
}

async function premiereMembersSheets() {
	return await premiereSheets(premiere.workbooks.members);
}


module.exports = { premiereRemindersSheets, premiereMembersSheets };
