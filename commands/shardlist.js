const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('./client_secret.json')
const Discord = require ('discord.js');

exports.run = async (client, message, args) => {
    
    
    var shardName = [];
    var shardDrop = [];
    var shardType = [];
    var shardHero = [];
    var row = 0;
    var table = "";
    
    var userMsg = args.join(' ').toLowerCase();
    var shards = [];
    var params = userMsg.split(' ')
    for (var i = 0; i < params.length; i++){
        params[i] = params[i].charAt(0).toUpperCase() + params[i].substring(1)
    }

    function check (str) {
        return userMsg.includes(str.toLowerCase());
    }

    var doc = new GoogleSpreadsheet(`1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU`)
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    var sheet = info.worksheets[2]
    
    var rows = await promisify(sheet.getRows)({})

    rows.forEach(async row => {
        shardName.push(row.name);
        shardDrop.push(row.drop);
        shardHero.push(row.hero);
        shardType.push(row.type);
    })

    if (!shardDrop.some(check) && !shardHero.some(check)){  //Make sure the user inputs either a Hero or a Chaos level
        message.channel.send("*You must input either a Hero or a Chaos level!*  Invalid input.\n\n**Correct Usage:**\n`dd!shardlist <chaos 0~8> <hero> <type>`");
        return;
    } 

    for (var i = 0; i < shardName.length; i++){
        if (shardDrop.some(check) && !userMsg.includes(shardDrop[i].toLowerCase())){ //Filtering out unwanted results
            continue;
        } 
        if (shardHero.some(check) && !userMsg.includes(shardHero[i].toLowerCase())){ //Filtering out unwanted results
            continue;
        }
        if (shardType.some(check) && !userMsg.includes(shardType[i].toLowerCase())){ //Filtering out unwanted results
            continue;
        }
        shards.push(shardName[i])
    }
    console.log(userMsg)
    console.log(shards.length)
    if (shards.length === 0){
        message.channel.send(`I could not find any \`${userMsg}\` shards.`)
        return;
    }
    if (shards.length > 50) {
        message.channel.send("Your parameters produced a shardlist that is too large for me to display. Please try more specific parameters.")
        return;
    }

    for (var i = 0; i < shards.length/3; i++){
        // maximum characters = 27
        var col1 = shards[i + row]
        var col2 = shards[i + row + 1]
        var col3 = shards[i + row + 2]
        var space1 = "";
        var space2 = "";
        var space3 = "";
        if (typeof col2 === 'undefined'){col2 = "N/A"}
        if (typeof col3 === 'undefined'){col3 = "N/A"}
        for (var j = 0; j < Math.floor((27 - col1.length)/2); j++){
            space1 += " ";
        }
        for (var j = 0; j < Math.floor((27 - col2.length)/2); j++){
            space2 += " ";
        }
        for (var j = 0; j < Math.floor((27 - col3.length)/2); j++){
            space3 += " ";
        }
        if ((space1+col1+space1).length % 2 === 0){col1 += " "}
        if ((space2+col2+space2).length % 2 === 0){col2 += " "}
        if ((space3+col3+space3).length % 2 === 0){col3 += " "}
        table += "`| " + space1 + col1 + space1 + " | " + space2 + col2 + space2 + " | " + space3 + col3 + space3 + " |`\n"
        row += 2; 
    }
    message.channel.send("**Loading .**").then((msg) => {setTimeout(function(){msg.edit("**Loading . .**")},200);setTimeout(function(){msg.edit(`**List of all \`${params.join(' ')}\` shards:** \n${table}`)},200)})
    
}
