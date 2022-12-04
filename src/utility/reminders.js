// src/utility/reminders.js

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { reminderEmbed } = require('./embeds.js');
const { deepEqual } = require('./equality.js');
const { headingError, premiereRemindersSheet } = require('./sheets.js');

dayjs.extend(utc);

function getTextIndices(header) {
	const indices = {
		text: header.findIndex((element) => element.toLowerCase() == 'text'),
		description: header.findIndex((element) => element.toLowerCase() == 'description'),
		message: header.findIndex((element) => element.toLowerCase() == 'message'),
		thumbnail: header.findIndex((element) => element.toLowerCase() == 'thumbnail'),
		image: header.findIndex((element) => element.toLowerCase() == 'image'),
		channel: header.findIndex((element) => element.toLowerCase() == 'channel')
	};
	return indices;
}

function getTimeIndices(header, names) {
	const indices = {};
	names.forEach((name) => {
		indices[name.toLowerCase()] = header.findIndex((e) => e.toLowerCase() == name.toLowerCase());
	});
	return indices;
}

function pushCustom({ reminders, time, data }) {
	const header = data[0];
	const textIndices = getTextIndices(header);
	if (Object.values(textIndices).includes(-1)) {
		throw headingError({ columnType: 'text', worksheetName: 'Custom'});
	}
	const timeColumnNames = ['Year', 'Month', 'Day', 'Hour', 'Minute'];
	const timeIndices = getTimeIndices(header, timeColumnNames);
	if (Object.values(timeIndices).includes(-1)) {
		throw headingError({ columnType: 'time', worksheetName: 'Custom' });
	}
	const now = {
		year: time.getUTCFullYear(),
		month: time.getUTCMonth() % 12 + 1,
		day: time.getUTCDate(),
		hour: time.getUTCHours(),
		minute: time.getUTCMinutes()
	}
	data = data.slice(1);
	for (const row of data) {
		trigger = {
			year: parseInt(row[timeIndices.year]),
			month: parseInt(row[timeIndices.month]),
			day: parseInt(row[timeIndices.day]),
			hour: parseInt(row[timeIndices.hour]),
			minute: parseInt(row[timeIndices.minute])
		}
		if (!deepEqual(now, trigger)) { continue; }
		reminders.push({
			content: row[textIndices.text],
			channel: row[textIndices.channel],
			embed: reminderEmbed({
				title: 'Scheduled Custom Reminder',
				description: row[textIndices.description],
				message: row[textIndices.message],
				thumbnail: row[textIndices.thumbnail],
				image: row[textIndices.image]
			})
		});
	}
}

function pushMonthly({ reminders, time, data }) {
	const header = data[0];
	const textIndices = getTextIndices(header);
	if (Object.values(textIndices).includes(-1)) {
		throw headingError({ columnType: 'text', worksheetName: 'Monthly' });
	}
	const timeColumnNames = ['Day', 'Hour', 'Minute'];
	const timeIndices = getTimeIndices(header, timeColumnNames);
	if (Object.values(timeIndices).includes(-1)) {
		throw headingError({ columnType: 'time', worksheetName: 'Monthly' });
	}
	const now = {
		day: time.getUTCDate(),
		hour: time.getUTCHours(),
		minute: time.getUTCMinutes()
	};
	data = data.slice(1);
	for (const row of data) {
		trigger = {
			day: parseInt(row[timeIndices.day]),
			hour: parseInt(row[timeIndices.hour]),
			minute: parseInt(row[timeIndices.minute])
		}
		if (!deepEqual(now, trigger)) { continue; }
		reminders.push({
			content: row[textIndices.text],
			channel: row[textIndices.channel],
			embed: reminderEmbed({
				title: 'Scheduled Monthly Reminder',
				description: row[textIndices.description],
				message: row[textIndices.message],
				thumbnail: row[textIndices.thumbnail],
				image: row[textIndices.image]
			})
		});
	}
}

function pushWeekly({ reminders, time, data }) {
	const header = data[0];
	const textIndices = getTextIndices(header);
	if (Object.values(textIndices).includes(-1)) {
		throw headingError({ columnType: 'text', worksheetName: 'Weekly' });
	}
	const timeColumnNames = ['Weekday', 'Hour', 'Minute'];
	const timeIndices = getTimeIndices(header, timeColumnNames);
	if (Object.values(timeIndices).includes(-1)) {
		throw headingError({ columnType: 'time', worksheetName: 'Weekly' });
	}
	const now = {
		weekday: time.getUTCDay(),
		hour: time.getUTCHours(),
		minute: time.getUTCMinutes()
	}
	data = data.slice(1);
	for (const row of data) {
		trigger = {
			weekday: (parseInt(row[timeIndices.weekday]) + 1) % 7,
			hour: parseInt(row[timeIndices.hour]),
			minute: parseInt(row[timeIndices.minute])
		}
		if (!deepEqual(now, trigger)) { continue; }
		reminders.push({
			content: row[textIndices.text],
			channel: row[textIndices.channel],
			embed: reminderEmbed({
				title: 'Scheduled Weekly Reminder',
				description: row[textIndices.description],
				message: row[textIndices.message],
				thumbnail: row[textIndices.thumbnail],
				image: row[textIndices.image]
			})
		});
	}
}

function pushDaily({ embeds, time, data }) {
	const header = data[0];
	const textIndices = getTextIndices(header);
	if (Object.values(textIndices).includes(-1)) {
		throw headingError({ columnType: 'text', worksheetName: 'Daily' });
	}
	const timeColumnNames = ['Hour', 'Minute'];
	const timeIndices = getTimeIndices(header, timeColumnNames);
	if (Object.values(timeIndices).includes(-1)) {
		throw headingError({ columnType: 'time', worksheetName: 'Daily' });
	}
	const now = {
		hour: time.getUTCHours(),
		minute: time.getUTCMinutes()
	};
	data = data.slice(1);
	for (const row of data) {
		trigger = {
			hour: parseInt(row[timeIndices.hour]),
			minute: parseInt(row[timeIndices.minute])
		}
		if (!deepEqual(now, trigger)) { continue; }
		reminders.push({
			content: row[textIndices.text],
			channel: row[textIndices.channel],
			embed: reminderEmbed({
				title: 'Scheduled Daily Reminder',
				description: row[textIndices.description],
				message: row[textIndices.message],
				thumbnail: row[textIndices.thumbnail],
				image: row[textIndices.image]
			})
		});
	}
}

function buildReminders({ custom, monthly, weekly, daily }) {
	try {
		const now = new Date(Date.now());
		reminders = []; // (content, channel, embed)
		if (!custom || !custom.length) {
			throw 'Custom reminders failed.';
		}
		else if (!monthly || !monthly.length) {
			throw 'Monthly reminders failed.';
		}
		else if (!weekly || !weekly.length) {
			throw 'Weekly reminders failed.';
		}
		else if (!daily || !daily.length) {
			throw 'Daily reminders failed.';
		}
		pushCustom({ reminders, time: now, data: custom });
		pushMonthly({ reminders, time: now, data: monthly });
		pushWeekly({ reminders, time: now, data: weekly });
		pushDaily({ reminders, time: now, data: daily });
		return reminders;
	} catch (e) {
		console.error('buildReminders failed.');
		console.error(`Error: ${e}`);
		return [];
	}
}

async function sendReminders(client, reminders) {
	for (const reminder of reminders) {
		const channel = await client.channels.fetch(reminder.channel);
		if (!channel) {
			console.log(`No access to channel ${reminder.channel}`);
			return;
		}
		const options = { embeds: [reminder.embed] };
		if (reminder.content.length) {
			options.content = reminder.content;
		}
		channel.send(options).catch(e => console.error(e));
	}
}

async function beginTaskLoop(client, tables) {
	const loop = () => {
		const reminders = buildReminders({
			custom: tables.Custom,
			monthly: tables.Monthly,
			weekly: tables.Weekly,
			daily: tables.Daily
		});
		if (reminders.length) {
			client.timerId = setTimeout(loop, 60*1000);
			sendReminders(client, reminders).catch(e => console.error(e));
		} else {
			client.timerId = setTimeout(loop, 1000);
		}
	}
	loop();
}

function frWarningMilliseconds(minutes) {
	const t0 = dayjs();
	const warningMinute = 30 - minutes;
	let t1 = t0.minute(warningMinute).second(0).millisecond(0);
	if (t0.minute() >= warningMinute) {
		t1 = t1.add(1, 'hour');
	}
	return t1.diff(t0, 'millisecond');
}

module.exports = { beginTaskLoop, frWarningMilliseconds };
