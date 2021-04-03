const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('./client_secret.json')
const Discord = require ('discord.js');

exports.run = async (client, message, args) => {
    
  if (/prime/i.test(args[0].toString())){
    return message.channel.send({files: ['https://cdn.discordapp.com/attachments/659229575821131787/812229602922725396/unknown.png']})
  }

    var linkAuthor = [];
    var linkName = [];
    var linkDesc = [];
    var linkLink = [];

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
    var sheet = info.worksheets[1]
    
    var rows = await promisify(sheet.getRows)({})

    rows.forEach(async row => {
        linkAuthor.push(row.author);
        linkName.push(row.name);
        linkDesc.push(row.description);
        linkLink.push(row.link);
    })
    
    var userMsg = String(args);
    var author = "";
    var name = "";
    var desc = "";
    var link = "";
    var sent = false;
    var simPerc = 0;
    var checkPerc = 0;
  
    for (var i = 0; i < userMsg.length; i++){
        userMsg = userMsg.replace(",", " ");
        userMsg = userMsg.replace("-", " ");
    }

    function getDescription () {
        author = linkAuthor[i];
        name = linkName[i];
        desc = linkDesc[i];
        link = linkLink[i];  
    }

    for (i = 0; i < linkName.length; i++){
        simPerc = Math.round(similarity(linkName[i],userMsg)*10000)/100;
        if (userMsg.toLowerCase() === "random"){
            i = Math.floor(Math.random() * Math.floor(linkName.length)); 
            message.channel.send("**Your random link:**");
            getDescription(); 
            sent = true;
            break;
        }
        if (linkName[i].toLowerCase() == userMsg.toLowerCase()){
            getDescription();
            sent = true;
            break;
        }
        else if (linkName[i].toLowerCase().startsWith(userMsg.toLowerCase())){
            getDescription();
            sent = true;
            break;
        } 
        else if (linkName[i].toLowerCase().includes(userMsg.toLowerCase())){
            getDescription();
            sent = true;
            break;
        }
        else {
            if (simPerc > checkPerc){getDescription(); checkPerc = simPerc;}
        }  
    }
    if (name == "" || desc == "" || userMsg == ""){
        message.channel.send("Incorrect useage or link not found.\n\n**Correct Usage:**\n`dd!link [Link Name]`");
        return;
    }
    if (sent == false){message.channel.send("**Did you mean:**")}

    let embed = new Discord.RichEmbed()
        .setColor('ORANGE')
        .setAuthor(author)
        .setTitle(name)
        .setURL(link)
        .setDescription(desc)
    message.channel.send(embed)
}
