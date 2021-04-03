const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('./client_secret.json')
const Discord = require ('discord.js');

exports.run = async (client, message, args) => {

    return message.channel.send('Command disabled.')

    var timenow = new Date();
    var emoteicon = "";
    var list = "";
    
    
    function dateDiff(firstDate, secondDate) { //Returns time difference. Shows days, hours, minutes, seconds.
        var toString = ""
        var timeDiff = secondDate - firstDate;
        var diffDays = Math.ceil(timeDiff/86400000); 
        var diffHours = (Math.ceil(timeDiff/3600000)) - ((diffDays-1)*24);
        var diffMins = (Math.ceil(timeDiff/60000)) - ((diffDays-1)*1440) - ((diffHours-1)*60);
        var diffSecs = (Math.ceil(timeDiff/1000)) - ((diffDays-1)*86400) - ((diffHours-1)*3600) - ((diffMins-1)*60);
        diffDays -= 1;
        diffHours -= 1;
        diffMins -= 1;
        if (diffSecs === 60){
            diffMins += 1;
            diffSecs = 0;
        }
        if (diffMins === 60){
            diffHours += 1;
            diffMins = 0;
        }
        if (diffHours === 24){
            diffDays += 1;
            diffHours = 0;
        }
        if (diffDays === 0){diffDays = ""} else {diffDays += " days "}
        if (diffHours === 0){diffHours = ""} else {diffHours += " hours "}
        if (diffMins === 0){diffMins = ""} else {diffMins += " minutes "}
        if (diffSecs === 0){diffSecs = ""} else {diffSecs += " seconds "}
        toString = `${diffDays}${diffHours}${diffMins}${diffSecs}`
        toString = toString.replace(/s /g, "s, ") //replaces "s " with "s, "
        toString = toString.replace(/,(?=[^,]*$)/, "") //removes last comma in the string
        toString = toString.replace(/,(?=[^,]*$)/, " and") //replaces last comma in string with " and"
        return(toString)
    }

    if (message.guild.id === "479814309481021441"){ //DD2MP
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

    const doc = new GoogleSpreadsheet(googlesheetid)
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    const sheet = info.worksheets[sheetnum]
    
    const rows = await promisify(sheet.getRows)({
        query: `winners = ""` 
    })

    rows.forEach(row=>{
        if (row.platform === "PC only") {emoteicon = "<:steam:587542032386490398>"}
        else if (row.platform === "Xbox only") {emoteicon = "<:xbox:587542638153170954>"}
        else if (row.platform === "Ps4 only") {emoteicon = "<:ps4:587542070026174494>"}
        else {emoteicon = "<:monitor:587542102020194306>"}
        list += `${emoteicon} | \`${row.msgid}\` | Prize: **${row.giveawayprize}** | **${row.numberofwinners}** winners | Ends in **${dateDiff(timenow, new Date(Date.parse(row.giveawayends)))}**\n`
    })

    if (list === ""){
        message.channel.send("There are currently no ongoing giveaways in this server.")
    } else {
        message.channel.send(list)
    }

}
