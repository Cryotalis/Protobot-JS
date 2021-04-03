const Discord = require('discord.js')

exports.run = (client, message, args) => {

    let embed = new Discord.RichEmbed()
        .setAuthor('Chromatic Games', 'https://i.imgur.com/HPvadlo.png')
        .setTitle('DDA Early Access Roadmap')
        .setImage('https://i.imgur.com/J2VDplx.png')

    message.channel.send(embed)

}