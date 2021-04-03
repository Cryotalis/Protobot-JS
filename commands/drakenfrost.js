const Discord = require ('discord.js');

exports.run = (client, message, args) => {

    if (!(message.channel.id === '471500604855025684' || message.channel.id === '287546233210273792')){
        return message.channel.send('Please use this command in <#287546233210273792> instead.')
    }

    //var date1 = new Date();
    var nexT = new Date();
    var today = new Date();
    var theDay = new Date(2019, 3, 8, 22, 0, 0);
    var week = 0;
    nexT.setDate(nexT.getDate() + (7-nexT.getDay())%7+1);
    nexT.setHours(5);
    nexT.setMinutes(0);
    nexT.setSeconds(0);
    nexT.setMilliseconds(0);
    var timeDiff = nexT - today; //nexT = the next Monday at 10pm
    var Img = "";
    var findWeek = Math.ceil((today - theDay)/86400000); //Gets the number of days that has passed between theDay and today

    //Calculates time difference
    var diffDays = Math.ceil(timeDiff/86400000); 
    var diffHours = (Math.ceil(timeDiff/3600000)) - ((diffDays-1)*24);
    var diffMins = (Math.ceil(timeDiff/60000)) - ((diffDays-1)*1440) - ((diffHours-1)*60);
    var diffSecs = (Math.ceil(timeDiff/1000)) - ((diffDays-1)*86400) - ((diffHours-1)*3600) - ((diffMins-1)*60);
    
    var Torchbearer = "Torchbearer"
    var FrozenPath = "Frozen Path"
    var Frostfire = "Frostfire Remnants"
    var DlordSoul = "Drakenlord's Soul"
    
    diffHours -= 1;
    diffMins -= 1;
 
    if (diffDays >= 7){ //Limits time difference to within a week
        diffDays -= 7;
        findWeek -= 1;
    }
    
    findWeek = findWeek / 7;

    while (findWeek > 4){ //Limits weeks to 1-4
        findWeek -= 4;
    }
    
    /*Determins whether it is week 1, 2, 3 or 4*/
    if (findWeek <= 1){week = 1}
    if (findWeek > 1 && findWeek <= 2){week = 2}
    if (findWeek > 2 && findWeek <= 3){week = 3}
    if (findWeek > 3 && findWeek <= 4){week = 4}

    if (week == 1){Img = "https://i.imgur.com/pMJ8J5X.png"; Torchbearer = "**Torchbearer**"} //Torchbearer
    if (week == 2){Img = "https://i.imgur.com/r19VbPW.png"; FrozenPath = "**Frozen Path**"} //Frozen Path
    if (week == 3){Img = "https://i.imgur.com/4mHTFMv.png"; Frostfire = "**Frostfire Remnants**"} //Frostfire Remnants
    if (week == 4){Img = "https://i.imgur.com/GXBplZd.png"; DlordSoul = "**Drakenlord's Soul**"} //Drakenlord's Soul

    let embed = new Discord.RichEmbed()
        .setColor('ORANGE')
        .setTitle("__**Time until next rotation:**__")
        .setThumbnail("https://i.imgur.com/BrTSxJu.png")
        .addField("\u200B    " + diffDays + "           " + diffHours + "            " + diffMins + "             " + diffSecs, "Days \u2009 Hours \u2009 Minutes \u2009 Seconds\n\u200B ")
        .addField("Week 1", Torchbearer, true)
        .addField("Week 2", FrozenPath, true)
        .addField("Week 3", Frostfire, true)
        .addField("Week 4", `${DlordSoul}\n\u200B`, true)
        .setImage(Img)
    message.channel.send(embed)
   
}
