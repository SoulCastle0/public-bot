const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const Client = require("../../Structures/Client");
module.exports = {
   name: 'CreateLogChannels',
   description: 'show the ping of bot',
   developerMode: true,
   permissions: "",
   aliases: ["create-logs", "log-create", "log-kur"],
   cooldown: 3,
   /**
    * CreateLogChannels command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){
      // Declaring MessageEmbed;
    const embed = new MessageEmbed();
    var chid = {}
    var logcate = await message.guild.channels.create('loglar', {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [{
                id: message.guild.id,
                allow: ["ADMINISTRATOR"],
                deny: ["VIEW_CHANNEL"]
            }]
        }).then((x) => {
        chid.categoryid = x.id;
    })

    client.settings.GuildSettings.CreateLogChannels.forEach((c) => {
        message.guild.channels.create(c, {
            type: "GUILD_TEXT",     
            parent: chid.categoryid,       
            permissionOverwrites: [{
                id: message.guild.id,
                allow: ["ADMINISTRATOR"],
                deny: "VIEW_CHANNEL"
            }]
        });
    })
   }
};