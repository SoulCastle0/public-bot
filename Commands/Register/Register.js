const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const Client = require("../../Structures/Client");
module.exports = {
   name: 'Register',
   description: 'show the ping of bot',
   developerMode: false,
   permissions: "",
   aliases: ["erkek", "kadin", "e", "k", "register"],
   cooldown: 3,
   /**
    * Register command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){
      // Declaring MessageEmbed;
      var embed = new MessageEmbed();

      


   }
};