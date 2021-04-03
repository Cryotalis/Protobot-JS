const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('./client_secret.json')
const Discord = require ('discord.js');

exports.run = async (client, message, args) => {
    
    var shardName = [];
    var shardDesc = [];
    var shardUpgr = [];
    var shardDrop = [];
    var shardHero = [];
    var shardType = [];
    var shardGild = [];
    var shardThumb = [];
    var modName = [];

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
    var sheet = info.worksheets[2]
    
    var rows = await promisify(sheet.getRows)({})

    rows.forEach(async row => {
      shardName.push(row.name);
      shardDesc.push(row.description);
      shardUpgr.push(row.upgradelevels);
      shardDrop.push(row.drop);
      shardHero.push(row.hero);
      shardType.push(row.type);
      shardGild.push(row.gilded);
      shardThumb.push(row.image);
    })
    
    var userMsg = String(args);
    var name = "";
    var desc = "";
    var upgr = "";
    var drop = "";
    var gild = "";
    var icon = " ";
    var cImg = "";
    var thumb = "";
    var itype = "";
    var sent = false;
    var simPerc = 0;
    var checkPerc = 0;

    for (var i = 0; i < userMsg.length; i++){
        userMsg = userMsg.replace(",", " ");
    }
    
    function getDescription () {
      name = shardName[i];
      icon = "";
      gild = shardGild[i];
      desc = shardDesc[i];
      upgr = "Upgrade Levels: " + shardUpgr[i];
      drop = shardDrop[i];
      thumb = shardThumb[i]
      if (shardName[i] == "Harbinger's Exile" || shardName[i] == "Skeletal Bind") {
          name = name + " (removed)";
      }
      else{
          name = name;
      }
      if (shardType[i].toLowerCase() == "relic"){
          itype = "Relic";
      }
      if (shardType[i].toLowerCase() == "weapon"){
          itype = "Weapon";
      }
      if (shardType[i].toLowerCase() == "helmet"){
        itype = "Helmet";
      }
      if (shardType[i].toLowerCase() == "chestplate"){
        itype = "Chestplate";
      }
      if (shardType[i].toLowerCase() == "gloves"){
        itype = "Gloves";
      }
      if (shardType[i].toLowerCase() == "boots"){
        itype = "Boots";
      }
      if (shardHero[i].toLowerCase() == "mystic, barbarian"){
        icon = "All heroes except <:Barbarian:560547396136730666> and <:Mystic:560544510279417876>";
        return;
      }
      if (shardHero[i].toLowerCase() === "all") {icon = "Any Hero"; return;}
      if (shardHero[i].toLowerCase().includes("monk")) {icon += "<:Monk:559241811802193930>"}
      if (shardHero[i].toLowerCase().includes("apprentice")) {icon += "<:Apprentice:559236347789967370>"}
      if (shardHero[i].toLowerCase().includes("huntress")) {icon += "<:Huntress:560544510367498240>"}
      if (shardHero[i].toLowerCase().includes("squire")) {icon += "<:Squire:560544509931290627>"}
      if (shardHero[i].toLowerCase().includes("ev")) {icon += "<:SeriesEV2:560544510363435008>"}
      if (shardHero[i].toLowerCase().includes("lavamancer")) {icon += "<:Lavamancer:560544510271029258>"}
      if (shardHero[i].toLowerCase().includes("abyss lord")) {icon += "<:AbyssLord:560544510267097110>"}
      if (shardHero[i].toLowerCase().includes("adept")) {icon += "<:Adept:560544509973495812>"}
      if (shardHero[i].toLowerCase().includes("dryad")) {icon += "<:Dryad:560544510409572352>"}
      if (shardHero[i].toLowerCase().includes("initiate")) {icon += "<:Initiate:560544510220959774>"}
      if (shardHero[i].toLowerCase().includes("gunwitch")) {icon += "<:Gunwitch:560544510308909056>"}
      if (shardHero[i].toLowerCase().includes("barbarian")) {icon += "<:Barbarian:560547396136730666>"}
      if (shardHero[i].toLowerCase().includes("mystic")) {icon += "<:Mystic:560544510279417876>"}   
    }

    for (i = 0; i < shardName.length; i++){
        simPerc = Math.round(similarity(shardName[i],userMsg)*10000)/100;
        if (userMsg.toLowerCase() === "random"){
            i = Math.floor(Math.random() * Math.floor(shardName.length)); 
            message.channel.send("**Your random shard:**");
            getDescription(); 
            sent = true;
            break;
        }
        if (shardName[i].toLowerCase() == userMsg.toLowerCase()){
            getDescription();
            sent = true;
            break;
        }
        else if (shardName[i].toLowerCase().startsWith(userMsg.toLowerCase())){
            getDescription();
            sent = true;
            break;
        }
        else{
            if (simPerc > checkPerc){getDescription(); checkPerc = simPerc;}
        } 
    }

    if (drop == "Campaign"){cImg = "https://i.imgur.com/AUJazgV.png"}
    if (drop == "Chaos 1"){cImg = "https://i.imgur.com/GRrAAWW.png"}
    if (drop == "Chaos 2"){cImg = "https://i.imgur.com/ihTiTNT.png"}
    if (drop == "Chaos 3"){cImg = "https://i.imgur.com/r2lDmq6.png"}
    if (drop == "Chaos 4"){cImg = "https://i.imgur.com/TPbBjeX.png"}
    if (drop == "Chaos 5"){cImg = "https://i.imgur.com/rsBB0ln.png"}
    if (drop == "Chaos 6"){cImg = "https://i.imgur.com/QR2Ox3f.png"}
    if (drop == "Chaos 7"){cImg = "https://i.imgur.com/Pw4LbVx.png"}
    if (drop == "Chaos 8"){cImg = "https://i.imgur.com/vmjFYzR.png"}
    if (drop.endsWith("Stars")){
        cImg = "https://i.imgur.com/vr6Cvgc.png"; 
        drop = "Mastery, " + drop;
    }

    if (name == "" || desc == "" || userMsg == ""){
        message.channel.send("Invalid input or shard not found.\n\n**Correct Usage:**\n`dd!shard [Shard Name]/Random`");
        return;
    }

    if (sent == false){message.channel.send("**Did you mean:**")}
    
    let embed = new Discord.RichEmbed()
        .setColor('ORANGE')
        .setAuthor(name, cImg)
        .setThumbnail(thumb)
        .setDescription(desc)
        .addField("Gilded: ", gild)
        .addField("\nUseable by: " + icon, upgr + " | " + itype + " | " + drop)
    await message.channel.send(embed)

    /* Mods */
    var doc = new GoogleSpreadsheet(`1yOjZhkn9z8dJ8HMD0YSUl7Ijgd9o1KJ62Ecf4SgyTdU`)
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    var sheet = info.worksheets[3]
    
    var rows = await promisify(sheet.getRows)({})

    rows.forEach(row => {modName.push(row.name);})
      var userMsg = String(args)
      var simModPerc = 0;
      var checkModPerc = 0;
      var name = "";

      for (i = 0; i < modName.length; i++){
          simModPerc = Math.round(similarity(modName[i].toLowerCase(),userMsg.toLowerCase())*10000)/100;
          if (simModPerc > checkModPerc){name = modName[i]; checkModPerc = simModPerc;}
      }

      if (checkModPerc >= 50){
          message.channel.send(`If you were looking for \`${name}\`, please type \`dd!mod ${name}\` instead.`)
      } 
}
