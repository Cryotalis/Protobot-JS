const Discord = require('discord.js')

exports.run = (client, message, args) => {

    return message.channel.send('Command disabled.')

    if (message.channel.id === "253332461809827840"){
        message.channel.send("Please use this command in <#287546233210273792> instead.")
        return;
    }
    
    message.channel.send(gahelpMsg)

}
