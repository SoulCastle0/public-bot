const { MessageEmbed }       = require("discord.js");
const Discord                = require('discord.js');
const Client                 = require("../../Structures/Client");
const quick                  = require('quick.db');

module.exports = {
   name: "Names",
   description: "Kullanıcının eski isimlerini listeler.",
   developerMode: false,
   permissions: "",
   aliases: ["isimler", "eski-isimler", "old-names"],
   cooldown: 3,
   /**
    * Names command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){      
        var Member       = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        await client.functions.GetNamesOfUser(client, Member, message.author, message);        
   }
};