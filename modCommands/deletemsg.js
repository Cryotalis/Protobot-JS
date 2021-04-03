const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if (message.author.id !== '251458435554607114') return
    client.channels.get(args[0]).fetchMessage(args[1]).then(msg => {msg.delete()})

}
