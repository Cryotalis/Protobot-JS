const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('./client_secret.json')
const Discord = require ('discord.js');

exports.run = (client, message, args) => {

    return message.channel.send('Command disabled.')

    if (message.channel.id === "253332461809827840"){
        message.channel.send("Please use this command in <#287546233210273792> instead.")
        return;
    }

    if (/mondream/i.test(message.author.tag) && message.author.id !== '502525253365399587') {return message.channel.send("🤡")}

    var userMsg = args.join(' ')
    var next1 = false;
    var next2 = true;
    var next3 = true;
    var next4 = true;
    var next5 = true;
    var sent = false;
    var question1 = "Thanks for doing a giveaway! Let's set this thing up! First and foremost, what are you giving away?\nYou may type `cancel` at any time to cancel this giveaway.\n\n`Please enter the giveaway prize.`"
    var question2 = "Cool! Before we move on, would you like to add a description and/or image to your giveaway prize?\n\n`Please enter a description and/or image for your giveaway in one message, or simply enter \"No\" if you don't want to do so. Links to images are also supported.`" 
    var question3 = "Got it. Next, how many winners will there be?\n\n`Please enter the number of winners who will receive a prize.`"
    var question4 = "Okay. How long will the giveaway last?\n\n`Please enter the duration of the giveaway in hours, or enter a duration in days followed immediately by a D and/or in hours followed immediately by an H.`"
    var question5 = "Alrighty. Last but not least, on what platform is the prize redeemable?\n\n`Please enter the platform (PC/PS4/Xbox/All) on which the prize is redeemable. The giveaway will begin subsequently.`"
    var messageid = "";
    var prize = "";
    var img = "";
    var description = "";
    var winners = 0;
    var days = 0;
    var hours = 0;
    var Duration = "";
    var platform = "";
    var platformURL = "";
    var giveawayhost = message.author.id;
    var timeNow = new Date();
    var endDate = new Date();

    var giveawayChannel = ""
    var giveawayEmote = "" 
    var googlesheetid = ""
    var general = ""
    var sheetnum = 0;

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

    if (message.guild.id === '290482343179845643'){ //Juicy Nation
        general = '290482343179845643'
        giveawayChannel = '581647273239379968' //#dd2-giveaways
        giveawayEmote = '<:juicy:369298517312929802>'
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 6 
    }
    if (message.guild.id === '98499414632448000'){ //Dungeon Defenders
        general = '98499414632448000'
        giveawayChannel = '348536834202009600' //#giveaways
        giveawayEmote = '<:giveaway:579194439776600064>'
        googlesheetid = '1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU' //Protobot database
        sheetnum = 5 
    }

    function hasNumber(myString){
        return /\d/.test(myString);
    }
    
    if (userMsg !== ""){ //Quickstart options 
        /* Server specific restriction for DD2 Server */
        if (userMsg.match(/\d+w/i) !== null && parseInt(userMsg.match(/\d+w/i)[0]) > 5 && sheetnum === 5){message.channel.send("You may not have more than 5 winners."); return;}
        if (userMsg.match(/\d+d/i) === null && userMsg.match(/\d+h/i) === null){days = 1; hours = 0} //Defaults to 1 day if giveaway duration not set
        if (userMsg.match(/\d+d/i) === null){} else {
            days += parseInt(userMsg.match(/\d+d/i)[0])
            userMsg = userMsg.replace(userMsg.match(/\d+d/i), '')
        }
        if (userMsg.match(/\d+h/i) === null){
            //Do nothing
        } else if (parseInt(userMsg.match(/\d+h/i)[0]) >= 24){
            var count = -1;
            var remainder = 0;
            for (var i = parseInt(message.content.match(/\d+h/i)[0]); i >24 ; i-=24){
                count ++;
                remainder = i;
            }
            days += count;
            hours += remainder;
            userMsg = userMsg.replace(userMsg.match(/\d+h/i), '')
        } else { 
            hours += parseInt(userMsg.match(/\d+h/i)[0])
            userMsg = userMsg.replace(userMsg.match(/\d+h/i), '')
        } 
        if (userMsg.match(/\d+w/i) === null){winners = 1} else { //Defaults to 1 winner if winners are not set
            winners += parseInt(userMsg.match(/\d+w/i)[0])
            userMsg = userMsg.replace(userMsg.match(/\d+w/i), '')
        }
        /* Defaults to All platforms if platform is not set */
        if (userMsg.match(/PC/i) === null && userMsg.match(/Ps4/i) === null && userMsg.match(/Xbox/i) === null && userMsg.match(/All/i) === null){
            platform = "All Platforms";
            platformURL = "https://i.imgur.com/wbyTrgL.png"
        }
        if (userMsg.toLowerCase().includes("pc")){
            platform = "PC only";
            platformURL = "https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/steam-512.png"
        }
        if (userMsg.toLowerCase().includes("xbox")){
            platform = "Xbox only";
            platformURL = "http://pluspng.com/img-png/xbox-png-xbox-logo-png-1220.png"
        }
        if (userMsg.toLowerCase().includes("ps4")){
            platform = "Ps4 only";
            platformURL = "https://image.flaticon.com/icons/png/512/901/901269.png"
        }
        if (userMsg.toLowerCase().includes("all") || (userMsg.toLowerCase().includes("pc") && userMsg.toLowerCase().includes("xbox") && userMsg.toLowerCase().includes("ps4"))){
            platform = "All Platforms";
            platformURL = "https://i.imgur.com/wbyTrgL.png"
        }
        /* Removing Platform name from title of giveaway */
        userMsg = userMsg.replace(userMsg.match(/PC/i), '')
        userMsg = userMsg.replace(userMsg.match(/Ps4/i), '')
        userMsg = userMsg.replace(userMsg.match(/Xbox/i), '')
        userMsg = userMsg.replace(userMsg.match(/All/i), '')

        prize = userMsg
        endDate.setDate(endDate.getDate() + days)
        endDate.setHours(endDate.getHours() + hours)
        /* Grammar */
        if (days === 0 && hours === 0){ //This part should never happen
            Duration = "0 hours" 
        } else if (days === 0){
            Duration = `${hours} hours`
        } else if (hours === 0){
            Duration = `${days} days`
        } else {
            Duration = `${days} days, ${hours} hours`
        }

        let embed = new Discord.RichEmbed()
            .setColor('ORANGE')
            .setAuthor(platform, platformURL)
            .setTitle(prize)
            .setDescription(description)
            .setThumbnail(img)
            .addField(`React with ${giveawayEmote} to enter!`, `Time remaining: ${dateDiff(timeNow, endDate)}`)//\nTime Remaining: **8** days, **3** hours, **12** minutes`)
            .addField(`From:`, `<@${giveawayhost}>`, true)
            .addField(`Winners:`, winners, true)
            .setFooter("Ends at: " + String(endDate))

        client.channels.get(giveawayChannel).send(`${giveawayEmote} **GIVEAWAY** ${giveawayEmote}`, embed).then(async msg => {
            messageid = msg.id;
            msg.react(String(giveawayEmote.match(/\d+/)));

            const doc = new GoogleSpreadsheet(googlesheetid)
            await promisify(doc.useServiceAccountAuth)(creds)
            const info = await promisify(doc.getInfo)()
            const sheet = info.worksheets[sheetnum]
            const row = {
                msgid: messageid,
                giveaway_host: client.users.get(giveawayhost).tag,
                gahostid: giveawayhost,
                giveaway_prize: prize,
                description: description,
                imageurl: img,
                platform: platform,
                platformurl: platformURL,
                giveawayends: endDate,
                number_of_winners: winners,
                emote: giveawayEmote,
                giveaway_channel: giveawayChannel,
                duration: Duration,
            }
            await promisify(sheet.addRow)(row)

        })
        message.channel.send(`The giveaway for the \`${prize}\` is now starting in <#${giveawayChannel}>!`)
        client.channels.get(general).send(`A new giveaway hosted by <@${giveawayhost}> is now starting in <#348536834202009600>!`)
    } else {
        message.channel.send(question1)
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id); //Only responds to the user who initiated the command
        
        collector.on('collect', message => {
            if (message.content.includes("cancel")){ //Cancels the giveaway if user types cancel
                message.channel.send("Giveaway canceled 😔")
                sent = true
                collector.stop()
                return;
            }
            if (next1 == false){ // The prize
                if (message.content.includes("cancel")){
                    // Do nothing
                } else {
                    prize = String(message.content);
                    next1 = true;
                    setTimeout(function(){next2 = false; message.channel.send(question2);}, 1000)
                }
            }
            if (next2 == false){ // Description and/or Image
                if (message.content.includes("cancel")){
                    // Do nothing
                } else {
                    description = message.content.replace(message.content.match(/n\/a/i), "");
                    description = description.replace(message.content.match(/nope/i), "");
                    description = description.replace(message.content.match(/no/i), "");
                    if (typeof message.embeds[0] !== 'undefined') {
                        description = description.replace(String(message.embeds[0].url), "")
                        img += String(message.embeds[0].url)
                    }
                    img += String(message.attachments.map(image => image.url))
                    next2 = true;
                    setTimeout(function(){next3 = false; message.channel.send(question3);}, 1000)
                }
            }
            if (next3 == false){ // The amount of winners
                var validWinners = true;
                if (message.content.includes("cancel")){
                    // Do nothing
                } else if (message.content.match(/\d+/i) !== null && parseInt(message.content.match(/\d+/i)[0]) > 5 && sheetnum === 5) {
                    message.channel.send("You may not have more than 5 winners. Please enter a **valid number** of winners.")
                    validWinners = false;
                } else if (message.content.match(/\d+/) !== null && message.content.match(/\d+/)[0] > 5 && sheetnum === 5) {
                    message.channel.send("You may not have more than 5 winners. Please enter a **valid number** of winners.")
                    validWinners = false;
                } else if (message.content.match(/\d+/i) !== null && hasNumber(message) && (message.content.match(/\d+/)[0]) >= 1 && validWinners === true){
                    winners += parseInt(message.content.match(/\d+/)[0])
                    next3 = true;
                    setTimeout(function(){next4 = false; message.channel.send(question4)}, 1000)
                } else {
                    message.channel.send("Please enter a **valid number** of winners.")
                }
            }
            if (next4 == false){ // The duration of the giveaway
                if (message.content.includes("cancel")){
                    // Do nothing
                } else if (message.content.match(/\d+/) !== null && hasNumber(message) && (message.content.match(/\d+/)[0] >=1 || parseInt(message.content.match(/\d+d/i)[0]) >= 1 || parseInt(message.content.match(/\d+h/i)[0] >= 1))){
                    if (message.content.match(/\d+d/i) === null){} else {
                        days += parseInt(message.content.match(/\d+d/i)[0])
                    }
                    if (message.content.match(/\d+h/i) === null){
                        //Do nothing
                    } else if (parseInt(message.content.match(/\d+h/i)[0]) >= 24){
                        var count = -1;
                        var remainder = 0;
                        for (var i = parseInt(message.content.match(/\d+h/i)[0]); i >24 ; i-=24){
                            count ++;
                            remainder = i;
                        }
                        days += count;
                        hours += remainder;
                    } else {
                        hours += parseInt(message.content.match(/\d+h/i)[0])
                    }
                    if (message.content.match(/\d+d/i) === null && message.content.match(/\d+h/i) === null){
                        hours += parseInt(message.content.match(/\d+/)[0])
                    }
                    next4 = true;
                    setTimeout(function(){next5 = false; message.channel.send(question5)}, 1000)
                } else {
                    message.channel.send("Please input a valid **number** of days and/or hours.")
                }
            }
            if (next5 == false){ // The platform 
                if (message.content.includes("cancel")){
                    // Do nothing
                } else if (message.content.toLowerCase().includes("pc") || message.content.toLowerCase().includes("xbox") || message.content.toLowerCase().includes("ps4") || message.content.toLowerCase().includes("all") ){
                    sent = true;
                    message.channel.send(`Done! The giveaway for the \`${prize}\` is now starting in <#${giveawayChannel}>!`)
                    client.channels.get(general).send(`A new giveaway hosted by <@${giveawayhost}> is now starting in <#348536834202009600>!`)
                    collector.stop(); //Stops collecting messages
                    /* Sets the platform */
                    if (message.content.toLowerCase().includes("pc")){
                        platform = "PC only";
                        platformURL = "https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/steam-512.png"
                    }
                    if (message.content.toLowerCase().includes("xbox")){
                        platform = "Xbox only";
                        platformURL = "http://pluspng.com/img-png/xbox-png-xbox-logo-png-1220.png"
                    }
                    if (message.content.toLowerCase().includes("ps4")){
                        platform = "Ps4 only";
                        platformURL = "https://image.flaticon.com/icons/png/512/901/901269.png"
                    }
                    if (message.content.toLowerCase().includes("all") || (message.content.toLowerCase().includes("pc") && message.content.toLowerCase().includes("xbox") && message.content.toLowerCase().includes("ps4"))){
                        platform = "All Platforms";
                        platformURL = "https://i.imgur.com/wbyTrgL.png"
                    }
                    endDate.setDate(endDate.getDate() + days)
                    endDate.setHours(endDate.getHours() + hours)

                    if (days === 0 && hours === 0){ //This part should never happen
                        Duration = "0 hours" 
                    } else if (days === 0){
                        Duration = `${hours} hours`
                    } else if (hours === 0){
                        Duration = `${days} days`
                    } else {
                        Duration = `${days} days, ${hours} hours`
                    }
                    
                    let embed = new Discord.RichEmbed()
                        .setColor('ORANGE')
                        .setAuthor(platform, platformURL)
                        .setTitle(prize)
                        .setDescription(description)
                        .setThumbnail(img)
                        .addField(`React with ${giveawayEmote} to enter!`, `Time remaining: ${dateDiff(timeNow, endDate)}`)//\nTime Remaining: **8** days, **3** hours, **12** minutes`)
                        .addField(`From:`, `<@${giveawayhost}>`, true)
                        .addField(`Winners:`, winners, true)
                        .setFooter("Ends at: " + String(endDate))

                    client.channels.get(giveawayChannel).send(`${giveawayEmote} **GIVEAWAY** ${giveawayEmote}`, embed).then(async msg => {
                        messageid = msg.id;
                        msg.react(String(giveawayEmote.match(/\d+/)));

                        const doc = new GoogleSpreadsheet(googlesheetid)
                        await promisify(doc.useServiceAccountAuth)(creds)
                        const info = await promisify(doc.getInfo)()
                        const sheet = info.worksheets[sheetnum]
                        const row = {
                            msgid: messageid,
                            giveaway_host: client.users.get(giveawayhost).tag,
                            gahostid: giveawayhost,
                            giveaway_prize: prize,
                            description: description,
                            imageurl: img,
                            platform: platform,
                            platformurl: platformURL,
                            giveawayends: endDate,
                            number_of_winners: winners,
                            emote: giveawayEmote,
                            giveaway_channel: giveawayChannel,
                            duration: Duration,
                        }
                        await promisify(sheet.addRow)(row)

                    })
                } else {
                    message.channel.send("Please enter a valid platform. Valid platforms: `PC, Ps4, Xbox, All.`")
                }
            }
        })
        setTimeout(() => {
            if (sent === false){
                collector.stop()
                message.channel.send(`<@${message.author.id}>You took too long to respond! I gave you 10 minutes!\n\n**Things you can do in 10 minutes:**\n1. Make your bed.\n2. Shower and get ready.\n3. Call your mom.\n4. Play a Chaos 7 match. \n5. Start a giveaway.`)
            }
        }, 600000);
    }  
}
