const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('./client_secret.json')
const Discord = require ('discord.js');

exports.run = async (client, message, args) => {

    return message.channel.send('Command disabled.')

    var timeNow = new Date();
    var giveawayChannel = "";
    var giveawayEmote = "";
    var googlesheetid = "";
    var sheetnum = 0;

    var hostid = "";
    var MostRecentTime = 0;
    var messageid = "";

    var prize = "";
    var img = "";
    var description = "";
    var winners = 0;
    var platform = "";
    var platformURL = "";
    var thewinners = "";
    var thewinnarrs = [];
    var giveawayhost = "";
    var userMsg = ""
    var reason = ""

    if (!String(args[0]).includes("<@") || String(args[0]).match(/\d{18}/) === null){
        reason = String(args).replace(/,/g, " ")
        reason = reason.replace(/\s\s/g, ", ")
    } else if (args.length === 1){ //Checks if a reason has been submitted
        userMsg = String(args)
    } else {
        userMsg = String(args[0])
        reason = String(args.slice(1)).replace(/,/g, " ")
    }

    if (message.guild.id === "479814309481021441"){ //DD2 Marketplace
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 8 
    }
    if (message.guild.id === "379501550097399810"){ //The Cryo Chamber
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 7 
    }
    if (message.guild.id === '290482343179845643'){ //Juicy Nation
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 6 
    }
    if (message.guild.id === '98499414632448000'){ //Dungeon Defenders
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 5 
    }

    if (userMsg !== "" && message.member.hasPermission('MANAGE_MESSAGES')){
        if (userMsg === `<@${message.author.id}>`){
            hostid = message.author.id
        } else {
            hostid = userMsg.match(/\d+/)
        }
    } else {
        hostid = message.author.id
    }

    /* Find the most recent giveaway started by specified user */
    var doc = new GoogleSpreadsheet(googlesheetid)
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    var sheet = info.worksheets[sheetnum]
    
    var rows = await promisify(sheet.getRows)({
        query: `gahostid = ${hostid}` 
    })

    rows.forEach(row => {
        if (Date.parse(row.giveawayends) > MostRecentTime && row.deleted !== "TRUE"){
            MostRecentTime = Date.parse(row.giveawayends);
            messageid = row.msgid;
        }
    })

    if (!userMsg.includes('@') && userMsg !== ""){ //Checks if the user entered a message id instead
        messageid = userMsg;
    }

    if (messageid === ""){
        message.channel.send("Giveaway message(s) not found.")
        return;
    }

    /* Rerolls the giveaway */
    var doc = new GoogleSpreadsheet(googlesheetid)
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    var sheet = info.worksheets[sheetnum]
    
    var rows = await promisify(sheet.getRows)({
        query: `msgid = ${messageid}` 
    })
    
    rows.forEach(async row => {
        var participants = row.participantids.split(', ')

        row.winners = "";
        prize = row.giveawayprize;
        img = row.imageurl;
        description = row.description;
        winners = row.numberofwinners;
        platform = row.platform;
        platformURL = row.platformurl;
        giveawayhost = row.gahostid;
        giveawayChannel = row.giveawaychannel;
        giveawayEmote = row.emote;

        if (reason !== ""){
            row.reason += `${reason} | `
        }
        
        if (row.participantids === ""){ //Set winners to "Nobody" if nobody participated in the giveaway
            thewinners = "Nobody";
            row.participants = "None";
            row.participantids = "None";
            row.winners = "None";
        } else if (participants.length < winners){ //If the number of people who reacted was less than the amount of winners set
            thewinners = "";
            for (y in participants){
                thewinnarrs.push(participants[y])
                thewinners += `<@${participants[y]}> `;
                row.winners += `${client.users.get(participants[y]).tag} `;
            }
        } else{
            for (var j = 0; j < winners; j++){ //Rolls winner(s)
                var rand = Math.floor(Math.random() * Math.floor(participants.length))
                thewinnarrs.push(participants[rand])
                thewinners += `<@${participants[rand]}> `
                row.winners += `${client.users.get(participants[rand]).tag} `;
                participants.splice(rand,1)
            }
        }
        row.save();
        
        if (row.gahostid !== message.author.id && !message.member.hasPermission('MANAGE_MESSAGES')){
            message.channel.send("You cannot reroll a giveaway hosted by somebody else!")
            return;
        } else if (Date.parse(row.giveawayends) > timeNow){
            message.channel.send("You cannot reroll an ongoing giveaway.")
            return;
        } else {
            row.giveawayends = timeNow;
            row.save();
            //Formatting 
            thewinners = thewinners.replace(/\s*$/, "") //Eliminates the extra space at the end
            thewinners = thewinners.replace(/ /g, ", ") //Replaces all spaces with a comma and a space
            thewinners = thewinners.replace(/,(?=[^,]*$)/, " and"); //Replaces the last comma with "and"
    
            let ended = new Discord.RichEmbed()
                .setColor('ORANGE')
                .setAuthor(platform, platformURL)
                .setTitle(prize)
                .setDescription(description)
                .setThumbnail(img)
                .addField(`Giveaway Ended!`, `Winner(s): ${thewinners}`)
                .addField(`From:`, `<@${giveawayhost}>`, true)
                .addField(`Winners:`, winners, true)
                .setFooter("Rerolled at: " + String(timeNow))
            client.channels.get(giveawayChannel).fetchMessage(messageid).then(msg => {msg.edit(`${giveawayEmote} **GIVEAWAY ENDED** ${giveawayEmote}`, ended);})
            if (thewinners === "Nobody"){
                client.channels.get(giveawayChannel).send(`${thewinners} won the \`${prize}\`... `).then(msg => {row.winmsgids += msg.id})
            } else if (thewinners.includes(",") || thewinners.includes("and")){
                client.channels.get(giveawayChannel).send(`The new winners for the \`${prize}\` are ${thewinners}! Congrats! Contact <@${giveawayhost}> to collect your prize!`).then(msg => {row.winmsgids += `${msg.id},`; row.save()})
            } else {
                client.channels.get(giveawayChannel).send(`The new winner for the \`${prize}\` is ${thewinners}! Congrats! Contact <@${giveawayhost}> to collect your prize!`).then(msg => {row.winmsgids += `${msg.id},`; row.save()})
            }
            message.channel.send("Giveaway successfully rerolled.")
        }

        for (w in thewinnarrs){
            let winner = new Discord.RichEmbed()
                .setColor('ORANGE')
                .setAuthor(platform, platformURL)
                .setTitle(prize)
                .setDescription(description)
                .setThumbnail(img)
                .addField(`Giveaway Ended!`, `Winner(s): ${thewinners}`)
                .addField(`From:`, `<@${giveawayhost}>`, true)
                .addField(`Maximum number of winners:`, winners, true)
                .setFooter("Rerolled at: " + String(timeNow))
            await client.users.get(thewinnarrs[w]).send(`Congratulations, you've won the giveaway held in **${client.channels.get(giveawayChannel).guild.name}**! Here's a summary of the giveaway: `, winner)
            client.users.get(thewinnarrs[w]).send(`Please contact ${client.users.get(giveawayhost).tag} within 24 hours to claim your reward!`)
        }
        //For Hosts
        let winner = new Discord.RichEmbed()
            .setColor('ORANGE')
            .setAuthor(platform, platformURL)
            .setTitle(prize)
            .setDescription(description)
            .setThumbnail(img)
            .addField(`Winner(s): `, thewinners)
            .addField(`Giveaway Host:`, `<@${giveawayhost}>`, true)
            .addField(`Max number of winners:`, winners, true)
            .addBlankField(true)
            .addField(`Participants:`, thewinnarrs.length, true)
            .addField(`Duration:`, `${row.duration} hours`, true)
            .addBlankField(true)
            .setFooter("Rerolled at: " + String(timeNow))
        await client.users.get(giveawayhost).send(`Your giveaway held in **${client.channels.get(giveawayChannel).guild.name}** has been rerolled! Here's a summary of the giveaway: `, winner)
        client.users.get(giveawayhost).send(`Please make arrangements with the new winner(s) to drop off their prizes.`) 
    })
}
