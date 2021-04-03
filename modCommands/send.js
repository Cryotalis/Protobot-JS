const Discord = require ('discord.js');

exports.run = (client, message, args) => {

    if (message.author.id !== '251458435554607114'){return}
    var juice = "521188110621605899"
    var dd2 = "98499414632448000"
    var cryo = "561263262478368797"

    userMsg = args.join(' ')

    client.channels.get(dd2).send(userMsg)//.then((msg) => {  setTimeout(function(){msg.delete()},3000)  })
    //Juicebags #town-hub: 521188110621605899
    //DD2 #tavern: 98499414632448000
    //CryoChamber #bot-spam: 561263262478368797

}
