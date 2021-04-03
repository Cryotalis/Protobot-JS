const Discord = require('discord.js');
const client = new Discord.Client();

const GoogleSpreadsheet = require('google-spreadsheet') //All required for google spreadsheet integration
const {promisify} = require('util')
const creds = require('./giveawayCommands/client_secret.json')

let Parser = require('rss-parser');
let parser = new Parser();
const cron = require('node-cron')
var request = require('request');

let prefix = 'dd!';
let modPrefix = "dd@"
let gaPrefix = 'dd?'

let live = ''
async function databaseSetup () {
    const doc = new GoogleSpreadsheet('1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU')
    await promisify(doc.useServiceAccountAuth)(creds)
    info = await promisify(doc.getInfo)()
    live = await promisify(info.worksheets[8].getRows)()
}
databaseSetup() //Connect to database

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

function updater (startTime, endTime, interval){ //Timer starts when time is below start time and ends when time is below endTime, interval dictates how fast the timer updates 
    setInterval(async () => { 
        var timeNow = new Date();
        for (var j = 0; j < 3; j++) {  
            var giveawayEmote = "";
            var sheetNum = 0;
            sheetNum = j + 5;
            
            var doc = new GoogleSpreadsheet('1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU')
            await promisify(doc.useServiceAccountAuth)(creds)
            var info = await promisify(doc.getInfo)()
            var sheet = info.worksheets[sheetNum]

            var rows = await promisify(sheet.getRows)({
                offset: 1
            })
        
            rows.forEach(row => {
                if (Date.parse(row.giveawayends) < timeNow || Date.parse(row.giveawayends) - timeNow < endTime || Date.parse(row.giveawayends) - timeNow > startTime){
                    return;
                } else {
                    client.channels.get(row.giveawaychannel).fetchMessage(row.msgid).then(async msg => {
                        var prize = "";
                        var img = "";
                        var description = "";
                        var winners = 0;
                        var platform = "";
                        var platformURL = "";
                        var giveawayhost = "";
                        var endDate = "";
                        
                        prize = row.giveawayprize;
                        img = row.imageurl;
                        description = row.description;
                        winners = row.numberofwinners;
                        platform = row.platform;
                        platformURL = row.platformurl;
                        giveawayhost = row.gahostid;
                        endDate = row.giveawayends;
                        giveawayEmote = row.emote;

                        let embed = new Discord.RichEmbed()
                            
                            .setColor('ORANGE')
                            .setAuthor(platform, platformURL)
                            .setTitle(prize)
                            .setDescription(description)
                            .setThumbnail(img)
                            .addField(`React with ${giveawayEmote} to enter!`, `Time remaining: ${dateDiff(timeNow, Date.parse(endDate))}`)
                            .addField(`From:`, `<@${giveawayhost}>`, true)
                            .addField(`Winners:`, winners, true)
                            .setFooter("Ends at: " + String(endDate))
                        msg.edit(`${giveawayEmote} **GIVEAWAY** ${giveawayEmote}`, {embed})
                    })
                }
            })
        }
        
    }, interval) 
}

// Ready means only after this line will the bot react to info received from Discord
client.on('ready', async () => {
    //Tells you when the bot is online. To make the bot come online, do "node ." To get the bot to come offline, do Ctrl + C
    console.log('Protobot is online and ready to go!');
    client.channels.get("577636091834662915").send("**Protobot is now online**");

    client.guilds.get("379501550097399810").channels.get("762948660983496715").edit({ name: `Server Count: ${client.guilds.size}` })
    
    const status = ["dd!help", "bit.ly/Protobot"]; //Array of status messages for the bot to switch through
    var index = 0;

    setInterval(() => {
        client.user.setActivity(status[index]); //Sets bot status
        index++;
        if (index > status.length-1){ //Makes sure status messages get rotated through
            index = 0;
        }
    }, 300000); //Runs every 5 minutes. 
    
    //Contents of the dd!help command. 
      helpMsg = new Discord.RichEmbed()
        .setAuthor("Protobot", "https://i.imgur.com/GkZIG4R.png")
        .setColor('ORANGE')
        .setTitle('Protobot Command List')
        .setDescription("Here is a list of commands for Protobot. Protobot is not case sensitive. Don't include any **[brackets]** when typing commands. **<brackets>** means optional. **#** means any number. **/** means \"or.\"\n ")
        .addField("dd!shard [Shard Name]/Random", "Searches for a Shard and displays information about it, or displays a random shard.")
        .addField("dd!mod [Mod Name]/Random", "Searches for a Mod and displays information about it, or displays a random mod.")
        .addField("dd!minasc [Ascension Level] [Onslaught Floor]", "Calculates your Minimum Ascension and Talent Caps based on Ascension Level and Onslaught Floor.")
        .addField("dd!news", "Displays the latest news post on the DD2 forums.")
        .addField("dd!mastery Tier [1~7]", "Searches for mastery rewards or displays a list of rewards based on tier.")
        .addField("dd!drakenfrost", "Displays information about when Drakenfrost mods rotate as well as which mods are currently in rotation.")
        .addField("dd!shardroll <Number of Shards> <c0~8>", "Rolls a number of shards. Leave number of Shards blank to roll 5 and/or leave Chaos level blank to roll shards from any chaos tier. Input c0 for Campaign.")
        .addField("dd!shardlist <chaos 0~8> <hero> <type>", "Lists every shard from a difficulty. (Capable of listing Campaign to Chaos 8 shards)")
        .addField("dd!help", "Displays all commands currently useable with Protobot.")
        .addField("dd?help", "Displays all giveaway commands currently useable with Protobot.\n\u200B")
        .addField("Protobot Database", "The database from where Protobot pulls information can be found [here](https://docs.google.com/spreadsheets/d/1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU/edit#gid=1815306446). Please contact Cryo if you can contribute any missing information or if you found any errors.")

    gahelpMsg = new Discord.RichEmbed()
        .setAuthor("Protobot", "https://i.imgur.com/GkZIG4R.png")
        .setColor('ORANGE')
        .setTitle('Protobot Giveaway Command List')
        .setDescription("Here is a list of giveaway commands for Protobot. You must have the Manage Messages permission or a role called \"Giveaways\" to use giveaway commands. Protobot is not case sensitive. Don't include any **[brackets]** when typing commands. **<brackets>** means optional. **#** means any number. **/** means \"or.\"\n ")
        .addField("dd?giveaway <#w> <#d> <#h> <PC/PS4/Xbox/All> ", "Starts a giveaway. Type only dd?giveaway for the automated walkthrough, or include options afterwards to quickly start a giveaway with just 1 line. W is winners, D is days, H is hours, platform is self explanatory. The automated walkthrough will time out if the user waits more than 10 minutes.")
        .addField("dd?list", "Lists all ongoing giveaways on this server.")
        .addField("dd?reroll \<\@User/Message ID> <Reason>", "Rerolls a giveaway. Leave user blank to reroll your most recent giveaway, input message ID to reroll a specific giveaway. Moderators may mention a user to reroll that user's most recent giveaway.")
        .addField("dd?delete \<\@User/Message ID> <Reason>", "Rerolls a giveaway. Leave user blank to delete your most recent giveaway, input message ID to delete a specific giveaway. Moderators may mention a user to delete that user's most recent giveaway.")
        .addField("dd?help", "Displays all giveaway commands currently useable with Protobot.\n\u200B")
        .addField("Protobot Database", "The database from where Protobot pulls information can be found [here](https://docs.google.com/spreadsheets/d/1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU/edit#gid=1815306446). Please contact Cryo if you can contribute any missing information or if you found any errors.")
    
    //Updates help command messages pinned by Kaoe in Dungeon Defenders
    client.channels.get("287546233210273792").fetchMessage("564997559819567117").then(msg => msg.edit(helpMsg))
    client.channels.get("287546233210273792").fetchMessage("596056537328255006").then(msg => msg.edit(gahelpMsg))
    client.channels.get("348536834202009600").fetchMessage("594977672556445696").then(msg => msg.edit(gahelpMsg))
    
    setInterval(async () => { //Draws winner for giveaway
        var timeNow = new Date();

        for (var i = 0; i < 4; i++) { 
            var sheetNum = 0;
            sheetNum = i + 5;
            
            var doc = new GoogleSpreadsheet('1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU')
            await promisify(doc.useServiceAccountAuth)(creds)
            var info = await promisify(doc.getInfo)()
            var sheet = info.worksheets[sheetNum]

            var rows = await promisify(sheet.getRows)({
                offset: 1
            })

            rows.forEach(async row => {
                if (Date.parse(row.giveawayends) < timeNow && row.winners === "") {
                    var giveawayChannel = '';
                    var giveawayEmote = ''
                    var giveawaymsg = ""
                    var prize = "";
                    var img = "";
                    var description = "";
                    var winners = 0;
                    var platform = "";
                    var platformURL = "";
                    var giveawayhost = "";
                    var thewinners = ""; 
                    var thewinnarrs = [];
                    var participants = row.participantids.split(', ')

                    row.winners = "";
                    giveawaymsg = row.msgid;
                    prize = row.giveawayprize;
                    img = row.imageurl;
                    description = row.description;
                    winners = row.numberofwinners;
                    platform = row.platform;
                    platformURL = row.platformurl;
                    giveawayhost = row.gahostid;
                    endDate = row.giveawayends;
                    giveawayChannel = row.giveawaychannel;
                    giveawayEmote = row.emote;
                    
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
                        .addField(`Giveaway Ended!`, `Winner(s): ${thewinners}`)//\nTime Remaining: **8** days, **3** hours, **12** minutes`)
                        .addField(`From:`, `<@${giveawayhost}>`, true)
                        .addField(`Winners:`, winners, true)
                        .setFooter("Ended at: " + String(endDate))
                    
                    client.channels.get(giveawayChannel).fetchMessage(giveawaymsg).then(msg => {msg.edit(`${giveawayEmote} **GIVEAWAY ENDED** ${giveawayEmote}`, ended)})
                    if (thewinners === "Nobody"){
                        client.channels.get(giveawayChannel).send(`${thewinners} won the \`${prize}\`... `).then(msg => {row.winmsgids += `${msg.id},`; row.save()})
                    } else {
                        client.channels.get(giveawayChannel).send(`${thewinners} won the \`${prize}\`! Congrats! Contact <@${giveawayhost}> to collect your prize!`).then(msg => {row.winmsgids += `${msg.id},`; row.save()})
                    }

                    //Add in number of participants for the Host, refer to summary image from FragZombie
                    //For Giveaway Winners
                    for (w in thewinnarrs){
                        let winner = new Discord.RichEmbed()
                            .setColor('ORANGE')
                            .setAuthor(platform, platformURL)
                            .setTitle(prize)
                            .setDescription(description)
                            .setThumbnail(img)
                            .addField(`Giveaway Ended!`, `Winner(s): ${thewinners}`)//\nTime Remaining: **8** days, **3** hours, **12** minutes`)
                            .addField(`From:`, `<@${giveawayhost}>`, true)
                            .addField(`Maximum number of winners:`, winners, true)
                            .setFooter("Ended at: " + String(endDate))
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
                        .addField(`Winner(s): `, thewinners)//\nTime Remaining: **8** days, **3** hours, **12** minutes`)
                        .addField(`Giveaway Host:`, `<@${giveawayhost}>`, true)
                        .addBlankField(true)
                        .addField(`Participants:`, participants.length, true)
                        .addField(`Duration:`, `${row.duration}`, true)
                        .addBlankField(true)
                        .setFooter("Ended at: " + String(endDate))
                    await client.users.get(giveawayhost).send(`Your giveaway held in **${client.channels.get(giveawayChannel).guild.name}** has ended! Here's a summary of the giveaway: `, winner)
                    client.users.get(giveawayhost).send(`Please make arrangements with the winner(s) to drop off their prizes.`) 
                }
                if (timeNow - Date.parse(row.giveawayends) > 172800000 && row.deleted === ""){
                    client.channels.get(row.giveawaychannel).fetchMessage(row.msgid).then(msg => {msg.delete()})
                    var winMsgs = row.winmsgids.split(',')
                    winMsgs.pop()
                    for (var i = 0; i < winMsgs.length; i++){
                        client.channels.get(row.giveawaychannel).fetchMessage(winMsgs[i]).then(msg => {msg.delete()})
                    }
                    row.deleted = "TRUE"
                    row.save()
                } 
            }) 
        }  
    }, 5000); 

    updater(2628000000, 3600000, 1800000) //Updates giveaway message every 30 minutes when giveaway duration is less than 1 month, stops when only 1 hour remains
    updater(3600000, 600000, 600000) //Updates giveaway message every 10 minutes when giveaway duration is less than 1 hour, stops when only 10 minutes remain
    updater(600000, 60000, 60000) //Updates giveaway message every 1 minute when giveaway duration is less than 10 minutes, stops when only 1 minute remains
    updater(60000, 0, 5000) //Updates giveaway message every 5 seconds when giveaway duration is less than 1 minute, stops when giveaway ends
    
});


client.on('messageReactionAdd', async (reaction, user) => { //Adds users who react to the giveaway reaction to the list of giveaway entrants 
    if (user.id === '521180443958181889'){
        return;
    }
    if (reaction.message.guild.id === "479814309481021441"){ //DD2MP
        giveawayEmote = '<:juicy:369298517312929802>'
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 8
    }
    if (reaction.message.guild.id === "379501550097399810"){ //The Cryo Chamber
        giveawayEmote = '<:giveaway:579194439776600064>'
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 7 
    }
    if (reaction.message.guild.id === '290482343179845643'){ //Juicy Nation
        giveawayEmote = '<:juicy:369298517312929802>'
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 6 
    }
    if (reaction.message.guild.id === '98499414632448000'){ //Dungeon Defenders
        giveawayEmote = '<:giveaway:579194439776600064>'
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 5 
    }

    const doc = new GoogleSpreadsheet(googlesheetid)
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    const sheet = info.worksheets[sheetnum]

    const rows = await promisify(sheet.getRows)({
        query: `msgid = ${reaction.message.id}` 
    })
    
    if(reaction.emoji.id === String(giveawayEmote.match(/\d+/))){
        rows.forEach(row => {
            if(row.participantids.includes(user.id)){
                return;
            } else if (user.id === row.gahostid){ //Prevents giveaway host from entering their own giveaway
                return;
            } else if (row.winners !== ""){ //Prevents people from entering giveaways that have already ended
                return;
            } else if(row.participantids === ""){ //Grammar
                row.participants += `${user.tag}`
                row.participantids += `${user.id}`;
                row.save();
            } else { //Grammar
                row.participants += `, ${user.tag}`
                row.participantids += `, ${user.id}`;
                row.save();
            }
        })
    }
});

client.on('message', message => {
    if (message.author.bot) return undefined
    if (message.content.toLowerCase().includes("nice")){
        var rand = Math.random()*100
        if (rand >= 80){
            message.react('🧊') //Ice Cube
        }
    }
})

client.on('message', message => {
    if ((message.content.includes('298852720134193162') || message.content.includes('343296248054546432') || message.content.includes('327228052415315968')) && !(message.channel.id === '687107268017389570' || message.channel.id === '253700631485743105')){
        message.channel.send("Please do not use system role pings outside of the looking for group chats.")
    }
})

// Create an event listener for messages
client.on('message', message => { //runs regular commands
    //if (message.channel.id == "98499414632448000"){message.channel.send("Go to bot spam thx"); return;}
    if (!message.content.startsWith(prefix)) return undefined;
    if (message.author.bot) return undefined; //So that the bot doesn't reply to itself
    let msg = message.content.toLowerCase(); //Message's content changed to lowercase letters
    let sender = message.author;
    let args = message.content.slice(prefix.length).trim().split(' '); //Arguments
    let command = args.shift().toLowerCase();  //Shift arguments to lower case

    try { //Runs the commands
        let commands = require(`./commands/${command}.js`);
        commands.run(client, message, args);
    }   catch (e) {
        console.log(e.stack)
    }   finally {
        client.channels.get("577636091834662915").send(`**${message.author.tag}** ran the command \`dd!${command}\` in **${message.guild.name}**`);
    }
    
}); 
client.on('message', message => { //runs mod commands
    if (message.author.bot) return undefined; //So that the bot doesn't reply to itself
    if (!message.content.startsWith(modPrefix)) return undefined;
    if (message.member === null) {return undefined;}
    if (message.member.roles.find(r => r.name == "Patron") || message.member.hasPermission('MANAGE_MESSAGES') || message.author.id === "251458435554607114") {

        let msg = message.content.toLowerCase(); //Message's content changed to lowercase letters
        let sender = message.author;
        let args = message.content.slice(3).trim().split(' '); //Arguments
        let command = args.shift().toLowerCase();  //Shift arguments to lower case

        try { //Runs the commands
            let commands = require(`./modCommands/${command}.js`);
            commands.run(client, message, args);
        }   catch (e) {
            console.log(e.stack)
        }   finally {
            client.channels.get("577636091834662915").send(`**${message.author.tag}** ran the MOD command \`${modPrefix}${command}\` in **${message.guild.name}**`);
        }
    } 
    else {
        message.channel.send("You are not authorized to use this command.");
        return undefined;
    }
});
client.on('message', message => { //runs giveaway commands
    if (message.author.bot) return undefined; //So that the bot doesn't reply to itself
    if (!message.content.startsWith(gaPrefix)) return undefined;
    if (message.member === null) {return undefined;} //If the command was not run in a server
    if (!(message.guild.id === '290482343179845643' || message.guild.id === '98499414632448000')) return message.channel.send('Giveaway commands are not enabled here.')
    if (message.member.roles.find(r => r.id === "733100555521622067")) {return message.channel.send("You have been restricted from using giveaway commands. Contact a moderator if you believe this is in error.")}
    if (message.member.roles.find(r => r.name == "Giveaways") || message.member.hasPermission('MANAGE_MESSAGES') || message.content.includes('dd?list') || message.content.includes('dd?help')) {

        let msg = message.content.toLowerCase(); //Message's content changed to lowercase letters
        let sender = message.author;
        let args = message.content.slice(3).trim().split(' '); //Arguments
        let command = args.shift().toLowerCase();  //Shift arguments to lower case

        try { //Runs the commands
            let commands = require(`./giveawayCommands/${command}.js`);
            commands.run(client, message, args);
        }   catch (e) {
            console.log(e.stack)
        }   finally {
            client.channels.get("577636091834662915").send(`**${message.author.tag}** ran the giveaway command \`${modPrefix}${command}\` in **${message.guild.name}**`);
        }
    } 
    else {
        if (message.guild.id === '98499414632448000') {//DD2
            message.channel.send(`You must have the Manage Messages permission or a role called \"Giveaways\" to use this command! See ${client.channels.get('579190444869550080')} for more information`);
            return undefined;
        } else {
            message.channel.send("You must have the Manage Messages permission or a role called \"Giveaways\" to use this command!");
            return undefined;
        }
    }
});

client.on('message', async message => { //Backer system
    if (message.channel.type === "dm" && message.content.toLowerCase().includes('giveme backer')){
        if (!client.guilds.get('98499414632448000').members.find(member => member.user.id === message.author.id)){
            return message.channel.send('This feature is only available to members of the official Dungeon Defenders Discord server.')
        }
        
        let user = message.author.tag
        let userid = message.author.id
        let dd2Server = "98499414632448000"
        let backerRole = "614205157097472001"
        
        const collector = message.channel.createMessageCollector(m => m.author.id === message.author.id)
        
        client.guilds.get(dd2Server).fetchMembers().then(async () => {
            if (client.guilds.get(dd2Server).members.get(userid).roles.find(r => r.id === backerRole) !== null){
                message.channel.send("You already have the DDA Backer role!");
                return;
            }
    
            var doc = new GoogleSpreadsheet(`1skTudwtjFHgZl5zLYdaMhJ_itcFgujruUrxywY9wr-E`)
            await promisify(doc.useServiceAccountAuth)(creds)
            var info = await promisify(doc.getInfo)()
            var sheet = info.worksheets[0]
    
            const rows = await promisify(sheet.getRows)({
                query: `discordid = ${userid}`
            })
    
            request(`Redacted_URL`, function (error, response, body) {
                if (rows.length !== 0) {
                    message.channel.send("You have already submitted an email for verification. If you would like to submit a different email, please do so below. Note that this will replace the email you previously submitted for verification. `If you'd like to cancel email submission, please type \"cancel\"`.").then(()=>{
                        collector.on('collect', async m => {
                            if (m.content.includes("cancel")){
                                collector.stop()
                                message.channel.send("Email submission cancelled.")
                                return;
                            }
                            if (m.content.includes("@")){
                                collector.stop()
                                message.channel.send("Email received.")
                                rows.forEach(row => {
                                    row.email = m.content
                                    row.save()
                                })
                                return; 
                            } else {
                                message.channel.send("Please submit a valid email address.")
                            }
                        })
                    })  
                }
                else if (body === "1") {
                    client.guilds.get(dd2Server).members.get(userid).addRole(backerRole)
                    message.channel.send("Backer role received. Thanks for being a Dungeon Defenders: Awakened Backer!")
                    return;
                }
                else if (error) {
                    message.channel.send("Special Characters were detected in your name. Please submit your email address so that your backer status can be manually verified by Chromatic Games staff. Thanks for your patience. `If you'd like to cancel email submission, please type \"cancel\"`.").then(()=>{
                        collector.on('collect', async m => {
                            if (m.content.includes("cancel")){
                                collector.stop()
                                message.channel.send("Email submission cancelled.")
                                return;
                            }
                            if (m.content.includes("@")){
                                collector.stop()
                                message.channel.send("Email received.")
                                var row = {discordid: `'${userid}`, discordtag: message.author.tag, email: m.content}
                                await promisify(sheet.addRow)(row)
                                return; 
                            } else {
                                message.channel.send("Please submit a valid email address.")
                            }
                        })
                        
                    })   
                }
                else {
                    message.channel.send("Your Discord tag was not found within the Kickstarter Backer Surveys database. If you believe this is an error, please submit your email address here for verification with Chromatic Games staff. You will manually be given your backer role at a later date if verified. Thanks for your patience. `If you'd like to cancel email submission, please type \"cancel\"`.").then(() => {
                        const collector = message.channel.createMessageCollector(m => m.author.id === message.author.id)
                        collector.on('collect', async m => {
                            if (m.content.includes("cancel")){
                                collector.stop()
                                message.channel.send("Email submission cancelled.")
                                return;
                            }
                            if (m.content.includes("@")){
                                collector.stop()
                                message.channel.send("Email received.")
                                var row = {discordid: `'${userid}`, discordtag: message.author.tag, email: m.content}
                                await promisify(sheet.addRow)(row)
                                return; 
                            } else {
                                message.channel.send("Please submit a valid email address.")
                            }
                        })
                    })
                    return;
                }
            }); 
        })
        

    } else if (message.channel.type === "dm" && message.content.toLowerCase().startsWith('remove backer')) {
        let userid = message.author.id
        let dd2Server = "98499414632448000"
        let backerRole = "614205157097472001"
        
        client.guilds.get(dd2Server).fetchMembers().then(async () => {
            client.guilds.get(dd2Server).members.get(userid).removeRole(backerRole)
            message.channel.send("Backer role removed.")
            return;
        })
    }  
})

client.on('ready', async () => { //Backer system part 2
    
    var doc = new GoogleSpreadsheet(`Redacted_Spreadsheet_ID`)
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    var sheet = info.worksheets[0]

    var rows = "";

    setInterval(async () => {
    rows = await promisify(sheet.getRows)({
        query: `backer != ""`
    })

        rows.forEach(row => {
            if (row.backer.toLowerCase() === "yes") {
                client.users.get(row.discordid).send("Thank you for being a Dungeon Defenders: Awakened Backer! You have been given the DDA Backer role.")
                client.guilds.get("98499414632448000").members.get(row.discordid).addRole("614205157097472001")
                return row.del();
            }
            if (row.backer.toLowerCase() === "no") {
                client.users.get(row.discordid).send("Your email has been manually reviewed and was not found to be on the Kickstarter Backers email list. If you are a Kickstarter Backer, please email Support@Chromatic.Games to verify your order, or message [CG] Philip (<@138862183370063872>) through direct message for additional questions not pertaining to order details.")
                return row.del();
            }
        })
    }, 10000); //Checks every 10 seconds
})

//Update server count if Protobot leaves a guild 
client.on('guildDelete', async guild => {
    client.guilds.get("379501550097399810").channels.get("762948660983496715").edit({name: `Server Count: ${client.guilds.size}`})
    client.channels.get("577636091834662915").send(`:man_walking:  Left server **${guild.name}**`);
})

//Update server count if Protobot joins a guild 
client.on('guildCreate', async guild => {
    client.guilds.get("379501550097399810").channels.get("762948660983496715").edit({ name: `Server Count: ${client.guilds.size}` })
    client.channels.get("577636091834662915").send(`:man_raising_hand:  Joined server **${guild.name}**`);
})

// Logging the bot in
client.login(process.env.TOKEN);

//Dev Tracker
client.on('ready', ()=>{
    setInterval(async () => {
        var doc = new GoogleSpreadsheet('1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU')
            await promisify(doc.useServiceAccountAuth)(creds)
            var info = await promisify(doc.getInfo)()
            var sheet = info.worksheets[9]

            var rows = await promisify(sheet.getRows)({
                offset: 1,
            })

            var cells = await promisify(sheet.getCells)({
                'min-row': 1,
                'max-row': 12,
                'min-col': 1,
                'max-col': 2
            })

            rows.forEach(async row => {
                //Checks for whether or not there is new content
                if (row.copy !== row.posturl){
                    //Limits the length of the description to 300 characters for readability
                    var description = row.description
                    if (description.length > 300){
                        description = row.description.substring(0, 300) + "..."
                    }
                    //Replaces extra unnecessary spaces and line breaks
                    description = description.replace(/\s+/g,' ').trim();
                    if (row.posturl !== "Loading..."){
                        let embed = new Discord.RichEmbed()
                            .setColor("ORANGE")
                            .setAuthor(row.user, row.profpic)
                            .setTitle(`**${row.title}**`)
                            .setDescription(description + ` [Read More](${row.posturl})`)
                            .setThumbnail(row.profpic)
                            .setFooter("Forums", "https://forums.dungeondefenders.com/uploads/monthly_2019_02/favicon.png")
                        client.channels.get('617044439881220326').send(`**${row.content} on ${row.timestamp}**`, embed)
                        client.channels.get('618236421085331486').send(`**${row.content} on ${row.timestamp}**`, embed)
                        client.channels.get('292365035676631051').send(`**${row.content} on ${row.timestamp}**`, embed)
                    }
                    //Updates row.copy, signaling that the new content has been posted
                    if (row.posturl !== "Loading..."){
                        if (row.user === "HiggsBosonic"){cells[2].value = row.posturl; cells[2].save()}
                        if (row.user === "Ice"){cells[4].value = row.posturl; cells[4].save()}
                        if (row.user === "Lawlta"){cells[6].value = row.posturl; cells[6].save()}
                        if (row.user === "Kyled"){cells[8].value = row.posturl; cells[8].save()}
                        if (row.user === "Dani"){cells[10].value = row.posturl; cells[10].save()}
                        if (row.user === "Javahawk"){cells[12].value = row.posturl; cells[12].save()}
                        if (row.user === "ChromaticPhilip"){cells[14].value = row.posturl; cells[14].save()}
                    }  
                }
            })
    
    }, 60000); //Set to 60000
}); 
