const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('./client_secret.json')
const Discord = require ('discord.js');

exports.run = async (client, message, args) => {
    
    var modName = [];
    var modDesc = [];
    var modHero = [];
    var modDrop = [];
    var modType = [];
    var shardName = [];

    function similarity(s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }
        
    function editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        
        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                var newValue = costs[j - 1];
                if (s1.charAt(i - 1) != s2.charAt(j - 1))
                    newValue = Math.min(Math.min(newValue, lastValue),
                    costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
                }
            }
            }
            if (i > 0)
            costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    var doc = new GoogleSpreadsheet(`1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU`)
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    var sheet = info.worksheets[3]
    
    var rows = await promisify(sheet.getRows)({})

    rows.forEach(async row => {
        modName.push(row.name);
        modDesc.push(row.description);
        modHero.push(row.hero);
        modDrop.push(row.drop);
        modType.push(row.type);
    })

    var userMsg = String(args);
    var name = "";
    var desc = "";
    var drop = "";
    var type = "";
    var thumb = "";
    var icon = "";
    var simPerc = 0;
    var checkPerc = 0;
    var sent = false;

    for (var i = 0; i < userMsg.length; i++){
        userMsg = userMsg.replace(",", " ");
        userMsg = userMsg.replace("-", " ");
    }

    function getDescription () {
        name = modName[i];
        desc = modDesc[i];
        drop = modDrop[i];  
        icon = "";
        if (modHero[i].toLowerCase() === "all") {icon = "Any Hero"}
        if (modHero[i].toLowerCase().includes("monk")) {icon += "<:Monk:559241811802193930>"}
        if (modHero[i].toLowerCase().includes("apprentice")) {icon += "<:Apprentice:559236347789967370>"}
        if (modHero[i].toLowerCase().includes("huntress")) {icon += "<:Huntress:560544510367498240>"}
        if (modHero[i].toLowerCase().includes("squire")) {icon += "<:Squire:560544509931290627>"}
        if (modHero[i].toLowerCase().includes("ev")) {icon += "<:SeriesEV2:560544510363435008>"}
        if (modHero[i].toLowerCase().includes("lavamancer")) {icon += "<:Lavamancer:560544510271029258>"}
        if (modHero[i].toLowerCase().includes("abyss lord")) {icon += "<:AbyssLord:560544510267097110>"}
        if (modHero[i].toLowerCase().includes("adept")) {icon += "<:Adept:560544509973495812>"}
        if (modHero[i].toLowerCase().includes("dryad")) {icon += "<:Dryad:560544510409572352>"}
        if (modHero[i].toLowerCase().includes("initiate")) {icon += "<:Initiate:560544510220959774>"}
        if (modHero[i].toLowerCase().includes("gunwitch")) {icon += "<:Gunwitch:560544510308909056>"}
        if (modHero[i].toLowerCase().includes("barbarian")) {icon += "<:Barbarian:560547396136730666>"}
        if (modHero[i].toLowerCase().includes("mystic")) {icon += "<:Mystic:560544510279417876>"} 
        
        if (modType[i] === "Armor"){
            type = "Armor"
            thumb = "https://i.imgur.com/BALqfsN.png"
        } else if (modType[i] === "Weapon"){
            type = "Weapon"
            thumb = "https://i.imgur.com/G1vER0z.png"
        }
        else {
            type = "Relic"
            thumb = "https://i.imgur.com/gG5w2yt.png"
        }   
    }

    for (i = 0; i < modName.length; i++){
        simPerc = Math.round(similarity(modName[i],userMsg)*10000)/100;
        if (userMsg.toLowerCase() === "random"){
            i = Math.floor(Math.random() * Math.floor(modName.length)); 
            message.channel.send("**Your random mod:**");
            getDescription(); 
            sent = true;
            break;
        }
        if (modName[i].toLowerCase() == userMsg.toLowerCase()){
            getDescription();
            sent = true;
            break;
        }
        else if (modName[i].toLowerCase().startsWith(userMsg.toLowerCase())){
            getDescription();
            sent = true;
            break;
        }
        else {
            if (simPerc > checkPerc){getDescription(); checkPerc = simPerc;}
        }  
    }
    if (name == "" || desc == "" || userMsg == ""){
        message.channel.send("Invalid input or mod not found.\n\n**Correct Usage:**\n`dd!mod [Mod Name]/Random`");
        return;
    }
    if (sent == false){message.channel.send("**Did you mean:**")}

    let embed = new Discord.RichEmbed()
        .setColor('ORANGE')
        .setAuthor(name)
        .setThumbnail(thumb)
        .setDescription(desc)
        .addField("Acquisition: ", drop)
        .addField("Useable by: " + icon, "Type: " + type + " mod")
        message.channel.send(embed)

    /* Shards */
    var doc = new GoogleSpreadsheet(`1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU`)
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    var sheet = info.worksheets[2]
    
    var rows = await promisify(sheet.getRows)({})

    rows.forEach(row => {shardName.push(row.name);})

    var userMsg = String(args)
    var simShardPerc = 0;
    var checkShardPerc = 0;
    var name = "";

    for (i = 0; i < shardName.length; i++){
        simShardPerc = Math.round(similarity(shardName[i].toLowerCase(),userMsg.toLowerCase())*10000)/100;
        if (simShardPerc > checkShardPerc){name = shardName[i]; checkShardPerc = simShardPerc;}
    }
    if (checkShardPerc >= 50){
        message.channel.send(`If you were looking for \`${name}\`, please type \`dd!shard ${name}\` instead.`)
    }
}
