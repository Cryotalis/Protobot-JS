const Discord = require('discord.js');

exports.run = (client, message, args) => {
    return
    if(isNaN(args[0])) return message.channel.send('Please provide a valid amount to purge or delete messages.');
    if(args[0] > 100) return message.channel.send('Cannot delete more than 100 messages at a time.');
    message.channel.bulkDelete(args[0]);
}
