const Discord = require('discord.js')

exports.run = (client, message, args ) => {
    
    const userMsg = String(args);
    var MockMsg = "";
    
    for (var i = 0; i < userMsg.length; i++){ //loops through every letter of the input
        var random = Math.floor(Math.random()*3);
        if (random == 0){
            MockMsg += userMsg.charAt(i).toUpperCase(); //Capitalizes the letter with a random chance
        }
        else {
            MockMsg += userMsg.charAt(i);
        }
        MockMsg = MockMsg.replace(",", " "); //removes commas separating the words
    }
    for (var i = 0; i < userMsg.length;i++){ //replaces the commas that the user inputted; this cannot be combined with the above function
        MockMsg = MockMsg.replace("  ", ", ")  
    }
   
    message.channel.send(MockMsg);

}
