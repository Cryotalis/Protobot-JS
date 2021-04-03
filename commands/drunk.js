const Discord = require('discord.js');

exports.run = (client, message, args) => {
	let userMsg = args.join(' ');
	let mockMsg = '';

	for (var i = 0; i < userMsg.length; i++) {
		//Loops through all characters of the input
		let rand = Math.floor(Math.random() * 6); //Pick a random number between 0 and 4, inclusive
		if (rand === 0 && /\w/.test(userMsg.charAt(i))) {
			mockMsg += String.fromCharCode(userMsg.charCodeAt(i) + 1);
		} else {
			mockMsg += userMsg.charAt(i); //Leave the letter alone otherwise
		}
	}
	message.channel.send(mockMsg);
};
