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
    * Warn command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){
      var Embed            = new MessageEmbed();    
      var Member           = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      var Reason           = args.slice(1).join(" ");
      if(!message.member.roles.cache.get(client.settings.Roles.StaffRoles.Penalty.WARN_HAMMER) && !client.settings.Roles.StaffRoles.HighStaffs.some(HighRole => message.member.roles.cache.has(HighRole)) && !message.member.permissions.has("ADMINISTRATOR")){
         Embed.setDescription(`Uyarı eklenirken bir hata oluştu. [\`\`${client.errormsg.Message.NOT_ENOUGH_PERM}\`\`]`)
         Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
         message.channel.send({embeds: [Embed]}).then((msg) => {
             if(msg.deletable){
                 setTimeout(() => {
                     msg.delete();
                 }, 5000);
             }
         });
         return;  
     }
     else if(!Member) {
         Embed.setDescription(`Uyarı eklenirken bir hata oluştu. [\`\`${client.errormsg.Message.NO_USER}\`\`]`)
         Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
         message.channel.send({embeds: [Embed]}).then((msg) => {
             if(msg.deletable){
                 setTimeout(() => {
                     msg.delete();
                 }, 5000);
             }
         });
         return;
     }
     else if (!Reason){
         Embed.setDescription(`Uyarı eklenirken bir hata oluştu. [\`\`${client.errormsg.Message.NO_REASON_ARGS}\`\`]`)
         Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
         message.channel.send({embeds: [Embed]}).then((msg) => {
            if(msg.deletable){
               setTimeout(() => {
                     msg.delete();
               }, 5000);
            }
         });
         return;
     }
     else {
        await client.functions.AddWarn(client, message, message.channel, Member, Reason, message.author);
     }
   }
};