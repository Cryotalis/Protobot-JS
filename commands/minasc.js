const Discord = require('discord.js')

exports.run = (client,message,args) => {

    let user = message.author;
    const userMsg = String(args);
    var Asc = 0;
    var floor = 0;
    var analysis = ""
    
    for (i = userMsg.length; i > 0; i--){
        if(userMsg.charAt(i) === ","){
            Asc = userMsg.slice(0,i);
            floor = i;
        }
    }

    var Floor = userMsg.slice(floor+1, userMsg.length);
    var MinAsc = Math.floor(((Floor-30)*4.16 + Math.floor(Asc/50))*3);

    if (Asc <= 0 || Floor <= 0) {
        message.channel.send("Please input a valid Ascension and/or Floor.\n\n**Correct Usage:**\n`dd!minasc [Ascension Level] [Onslaught Floor]`"); 
        return;
    } 
    
    if (Floor > 999 || Asc > 50000) {
        message.channel.send("*Let's face it, you're not going to get to that Ascension and/or Floor.* Please input a valid Ascension and/or Floor.\n\n**Correct Usage:**\n`dd!minasc [Ascension Level] [Onslaught Floor]`"); 
        return;
    }

    var TalCaps = Math.floor(((Floor-30)*4.16 + Math.floor(Asc/50)));

    if (Floor < 30){
        MinAsc = Math.floor((Math.floor(Asc/50))*3);
        TalCaps = Math.floor((Math.floor(Asc/50)))
    }

    if (MinAsc < 250){ //Less than 250
        analysis = "Your Minimum Ascension is way too low to reset. You should push a lot higher in Onslaught to make the grind easier later on."
    } 
    if (MinAsc >= 250 && MinAsc < 500){ //Between 250 to 500
        analysis = "You're making your way to doing your next reset, but you should still continue to push higher in Onslaught before doing so."
    }
    if (MinAsc >= 500 && MinAsc < 600){ //Between 500 and 600
        analysis = "You're probably good to go for your next reset, but I would recommend you go just a bit further."
    }
    if (MinAsc >= 600 && MinAsc < 750){ //Between 600 and 750
        analysis = "You have enough Minimum Ascension for you next reset. Have at it!"
    }
    if (MinAsc > 750) { //Over 750
        analysis = "You have more than enough Minimum Ascension for your next reset. You're a beast, go ham!"
    }

    let embed = new Discord.RichEmbed()
        .setColor('ORANGE')
        .setAuthor(`${user.username}#${user.discriminator}`)
        .setThumbnail(user.displayAvatarURL)
        .setDescription("**Your Ascension: **" + Asc + "\n** Your Floor: **" + Floor + "\n**Your Talent Caps: **" + TalCaps + "\n**Your Minimum Ascension: **" + MinAsc)
        .addField("<:protobot:563244237433602048> My analysis:", analysis)
    message.channel.send(embed)
}

