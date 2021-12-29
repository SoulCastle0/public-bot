const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const Client = require("../../Structures/Client");
module.exports = {
   name: "mute",
   description: "Kullanıcıyı uyarmanızı sağlar.",
   developerMode: false,
   permissions: "",
   aliases: ["sustur", "uyarı"],
   cooldown: 3,
   /**
    * Warn command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){    
        /// TODO
   }
};