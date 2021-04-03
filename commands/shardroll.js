const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('./client_secret.json')
const Discord = require ('discord.js');

exports.run = async (client, message, args) => {
    
    if (message.channel.id === "253332461809827840"){
        message.channel.send("Please use this command in <#287546233210273792> instead.")
        return;
    }
    
    var shardName = [];
    var shardDrop = [];
    var c0 = [];
    var c1 = [];
    var c2 = [];
    var c3 = [];
    var c4 = [];
    var c5 = [];
    var c6 = [];
    var c7 = [];
    var c8 = [];

    var doc = new GoogleSpreadsheet(`1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU`)
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    var sheet = info.worksheets[2]
    
    var rows = await promisify(sheet.getRows)({}) 

    rows.forEach(async row => {
        shardName.push(row.name);
        shardDrop.push(row.drop);
    })
    
    var userMsg = String(args);
    var shards = [];

    var args1 = 0;
    var floor = 0;
    
    for (i = userMsg.length; i > 0; i--){
        if(userMsg.charAt(i) === ","){
            args1 = userMsg.slice(0,i);
            floor = i;
        }
    }

    var args2 = userMsg.slice(floor+1, userMsg.length);
    if (userMsg > 20 || args1 > 20){message.channel.send("I cannot open more than 20 shards at a time."); return;}

    if (args1 !== "" && args2 !== ""){/*Do Nothing*/}
    else if (userMsg.toLowerCase() === "c0"){args2 = "c0"; args1 = 5;}
    else if (userMsg.toLowerCase() === "c1"){args2 = "c1"; args1 = 5;}
    else if (userMsg.toLowerCase() === "c2"){args2 = "c2"; args1 = 5;}
    else if (userMsg.toLowerCase() === "c3"){args2 = "c3"; args1 = 5;}
    else if (userMsg.toLowerCase() === "c4"){args2 = "c4"; args1 = 5;}
    else if (userMsg.toLowerCase() === "c5"){args2 = "c5"; args1 = 5;}
    else if (userMsg.toLowerCase() === "c6"){args2 = "c6"; args1 = 5;}
    else if (userMsg.toLowerCase() === "c7"){args2 = "c7"; args1 = 5;}
    else if (userMsg.toLowerCase() === "c8"){args2 = "c8"; args1 = 5;}
    else {args1 = 5;}

    for (var i = 0; i < shardName.length; i++){
        if (shardDrop[i] === "Campaign"){c0.push(shardName[i])}
        if (shardDrop[i] === "Chaos 1"){c1.push(shardName[i])}
        if (shardDrop[i] === "Chaos 2"){c2.push(shardName[i])}
        if (shardDrop[i] === "Chaos 3"){c3.push(shardName[i])}
        if (shardDrop[i] === "Chaos 4"){c4.push(shardName[i])}
        if (shardDrop[i] === "Chaos 5"){c5.push(shardName[i])}
        if (shardDrop[i] === "Chaos 6"){c6.push(shardName[i])}
        if (shardDrop[i] === "Chaos 7"){c7.push(shardName[i])}
        if (shardDrop[i] === "Chaos 8"){c8.push(shardName[i])}
    }

    if (args2.toLowerCase() === "c0"){
        for (var i = 0; i < args1; i++){
            var rand = Math.floor(Math.random() * Math.floor(c0.length)); 
            shards.push(c0[rand])
        }
    }
    else if (args2.toLowerCase() === "c1"){
        for (var i = 0; i < args1; i++){
            var rand = Math.floor(Math.random() * Math.floor(c1.length)); 
            shards.push(c1[rand])
        }
    }
    else if (args2.toLowerCase() === "c2"){
        for (var i = 0; i < args1; i++){
            var rand = Math.floor(Math.random() * Math.floor(c2.length)); 
            shards.push(c2[rand])
        }
    }
    else if (args2.toLowerCase() === "c3"){
        for (var i = 0; i < args1; i++){
            var rand = Math.floor(Math.random() * Math.floor(c3.length)); 
            shards.push(c3[rand])
        }
    }
    else if (args2.toLowerCase() === "c4"){
        for (var i = 0; i < args1; i++){
            var rand = Math.floor(Math.random() * Math.floor(c4.length)); 
            shards.push(c4[rand])
        }
    }
    else if (args2.toLowerCase() === "c5"){
        for (var i = 0; i < args1; i++){
            var rand = Math.floor(Math.random() * Math.floor(c5.length)); 
            shards.push(c5[rand])
        }
    }
    else if (args2.toLowerCase() === "c6"){
        for (var i = 0; i < args1; i++){
            var rand = Math.floor(Math.random() * Math.floor(c6.length)); 
            shards.push(c6[rand])
        }
    }
    else if (args2.toLowerCase() === "c7"){
        for (var i = 0; i < args1; i++){
            var rand = Math.floor(Math.random() * Math.floor(c7.length)); 
            shards.push(c7[rand])
        }
    }
    else if (args2.toLowerCase() === "c8"){
        for (var i = 0; i < args1; i++){
            var rand = Math.floor(Math.random() * Math.floor(c8.length)); 
            shards.push(c8[rand])
        }
    }
    else {
        for (var i = 0; i < userMsg; i++){
            var rand = Math.floor(Math.random() * Math.floor(shardName.length)); 
            shards.push(shardName[rand])
        }
    }

    if (shards.length <= 0){
        message.channel.send("Invalid input.\n\n**Correct Usage:**\n`dd!shardroll <Number of Shards> <c0~8>`")
        return;
    }
    message.channel.send(shards) 
}
