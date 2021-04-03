const Discord = require('discord.js')

exports.run = (client, message, args) => {

    args = args.map(e => parseFloat(e))

    let rating = 0
    let ratingEmbed = new Discord.RichEmbed()
        .setTitle('Item Rating Calculator')
        .setColor('ORANGE')
        .addField('Your Stat:', args[0], true)

    if (args.length === 2){
        ratingEmbed.setDescription('You are currently using the **shorthand** item rating.\nFormula: `Your Stat/Max Stat`')
        rating = args[0]/args[1]
        ratingEmbed.addField('Max Stat:', args[1], true)
    } else if (args.length === 3) {
        ratingEmbed.setDescription('You are currently using the **in game** item rating.\nFormula: `(Your Stat - Min Stat)/(Max Stat - Min Stat)`')
        rating = (args[0] - args[1])/(args[2] - args[1])
        ratingEmbed.addField('Stat Range:', `${args[1]}~${args[2]}`, true)
    }

    rating = `${(rating*100).toFixed(2)}%`
    ratingEmbed.addField('Item Rating:', rating)

    message.channel.send(ratingEmbed)
}