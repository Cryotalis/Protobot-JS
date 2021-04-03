const GoogleSpreadsheet = require('google-spreadsheet')
const {promisify} = require('util')
const creds = require('./client_secret.json')
const Discord = require ('discord.js');

exports.run = async (client, message, args) => {
            
    var userMsg = args.join(' ');
    userMsg = userMsg.replace(/tier/gi, "")  
    userMsg = userMsg.replace(/\s/g, "")
    var img = "";
    
    if (userMsg === "1"){img = "https://i.imgur.com/ZEHMB68.png"}
    if (userMsg === "2"){img = "https://i.imgur.com/7GI0SRl.png"}
    if (userMsg === "3"){img = "https://i.imgur.com/iYpct8h.png"}
    if (userMsg === "4"){img = "https://i.imgur.com/gg9u4hY.png"}
    if (userMsg === "5"){img = "https://i.imgur.com/z2krbXR.png"}
    if (userMsg === "6"){img = "https://i.imgur.com/YTodsqh.png"}
    if (userMsg === "7"){img = "https://i.imgur.com/1abEGKw.png"}

    if (img == ""){
        message.channel.send("Please input a valid tier.\n\n**CorrectUseage:**\n`dd!mastery [Tier 1~7]`")
        return;
    }
    
    let embed = new Discord.RichEmbed()
        .setColor('ORANGE')
        .setAuthor(`${message.author.tag}`)
        .setTitle("Tier " + userMsg)
        .setImage(img)
    message.channel.send(embed)
    
}
