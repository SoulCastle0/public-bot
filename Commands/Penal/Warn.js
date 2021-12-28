const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const Client = require("../../Structures/Client");
module.exports = {
   name: "Warn",
   description: "Kullanıcıyı uyarmanızı sağlar.",
   developerMode: false,
   permissions: "",
   aliases: ["warn", 'uyar', "uyarı"],
   cooldown: 3,
   /**
    * X command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){    
      var PenalID          = 1;  
      var Member           = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      var Reason           = args.slice(1).join(" ");
      client.functions.AddPenal(client, message, PenalID, Member, message.author, 'Uyarı', Reason, 'Yok', 'Yok', "Kaldırma işlem yapılamaz", "warn");
   }
};