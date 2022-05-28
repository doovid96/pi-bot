// src/utility/sheets.js

const { google } = require('googleapis');
const sheets = google.sheets('v4');

async function getAuthClient() {
	const auth = new google.auth.GoogleAuth({
//		keyFile: 'D:\\Code\\bots\\js-bot\\data\\credentials.json',
		keyFile: '/home/pi/bots/credentials.json',
		scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
	});
	const authClient = await auth.getClient();
	return authClient;
}

async function getSheetValues({ id, name }) {
	const auth = await getAuthClient();
	const res = await sheets.spreadsheets.values.get({
		spreadsheetId: id,
		auth,
		range: name
	});
	return res.data.values;
}

function headingError({ columnType, worksheetName }) {
	return `Unable to locate necessary ${columnType} headings in ${worksheetName} worksheet.`;
}

module.exports = { getAuthClient, getSheetValues, headingError };
