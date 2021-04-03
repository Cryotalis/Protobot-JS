const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('./client_secret.json')
const Discord = require('discord.js')

exports.run = async (client, message, args) => {

    return message.channel.send('Command disabled.')

    var hostid = "";
    var MostRecentTime = 0;
    var messageid = "";
    var giveawayChannel = ""
    var googlesheetid = ""
    var sheetnum = 0

    var hostid = "";
    var MostRecentTime = 0;
    var messageid = "";
    var winMsgArr = [];
    var msgFound = false;
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
        giveawayChannel = '592970214237274113' //#giveaways
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 8 
    }
    if (message.guild.id === "379501550097399810"){ //The Cryo Chamber
        giveawayChannel = '580992657866752015' //#giveaway-test
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 7 
    }
    if (message.guild.id === '290482343179845643'){ //Juicy Nation
        giveawayChannel = '581647273239379968' //#dd2-giveaways
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 6 
    }
    if (message.guild.id === '98499414632448000'){ //Dungeon Defenders
        giveawayChannel = '348536834202009600' //#giveaways
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
        if (Date.parse(row.giveawayends) > MostRecentTime && row.winners !== "Deleted"){
            MostRecentTime = Date.parse(row.giveawayends);
            messageid = row.msgid;
        }
    })

    if (!userMsg.includes('@') && userMsg !== ""){ //Checks if the user entered in a message id instead 
        messageid = userMsg;
    }

    if (messageid === ""){
        message.channel.send("Giveaway message(s) not found.");
        return;
    }

    /* Deletes the giveaway */
    var doc = new GoogleSpreadsheet(googlesheetid)
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    var sheet = info.worksheets[sheetnum]
    
    var rows = await promisify(sheet.getRows)({
        query: `msgid = ${messageid}`
    })

    rows.forEach(async row => {
        if (message.member.hasPermission('MANAGE_MESSAGES') || message.author.id === row.gahostid){
            if (row.winmsgids === "N/A"){
                return;
            } else {
                client.channels.get(giveawayChannel).fetchMessage(row.msgid).then(msg => msg.delete())
                winMsgArr = row.winmsgids.split(',')
                for (var i = 0; i < winMsgArr.length-1; i++){
                    await client.channels.get(giveawayChannel).fetchMessage(winMsgArr[i]).then(msg => msg.delete())
                }
                if (reason !== ""){
                    row.reason += `${reason} | `
                }
                row.winners = "Deleted"
                row.deleted = "TRUE"
                row.winmsgids = "N/A"
                row.save()
                msgFound = true
                message.channel.send("Giveaway successfully deleted.")
            }
        } else {
            msgFound = true
            message.channel.send("You cannot delete a giveaway hosted by somebody else.")
            return; 
        }
    })

    if (msgFound === false){
        message.channel.send("Giveaway message(s) not found.")
    }
}
