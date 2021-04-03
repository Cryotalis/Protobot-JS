const Discord = require('discord.js');

exports.run = (client, message, args) => {

    message.channel.send('Pinging...').then((msg) => 
    {msg.edit("Pong! - Time: **" + (Date.now() - msg.createdTimestamp ) + "ms**")});    

}
