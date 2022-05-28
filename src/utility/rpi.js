// src/utility/rpi.js

const fs = require('fs');

function temp() {
	const input = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp');
	const celcius = (parseInt(input)/1000.0).toFixed(1);
	return celcius;
}

module.exports = { temp };
