const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const Client = require("../../Structures/Client");
module.exports = {
   name: "Unregister",
   description: "Kullanıcıyı kayıtsız yapar.",
   developerMode: false,
   permissions: "",
   aliases: ["kayıtsız", "unreg", "unregister"],
   cooldown: 3,
   /**
    * Unregister command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){      
    var Embed            = new MessageEmbed();
    var Member           = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!message.member.roles.cache.get(client.settings.Roles.StaffRoles.Registry.REGISTER) && !client.settings.Roles.StaffRoles.LowStaffs.some(LowRole => message.member.roles.cache.has(LowRole)) && !client.settings.Roles.StaffRoles.HighStaffs.some(HighRole => message.member.roles.cache.has(HighRole)) && !message.member.permissions.has("ADMINISTRATOR")){
        Embed.setDescription(`Kayıtsız işlemi sırasında bir hata oluştu. [\`\`${client.errormsg.Message.NOT_ENOUGH_PERM}\`\`]`)
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
        Embed.setDescription(`Kayıtsız işlemi sırasında bir hata oluştu. [\`\`${client.errormsg.Message.NO_USER}\`\`]`)
        Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
        message.channel.send({embeds: [Embed]}).then((msg) => {
            if(msg.deletable){
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            }
        });
        return;
    }// else if member
    else {
        Embed.setDescription(`${Member} adlı kullanıcı ${message.member} tarafından başarıyla kayıtsız yapıldı.`);
        Embed.setColor(client.settings.EmbedSettings.Colors.SUCCESS_COLOR);
        client.functions.SetUnregister(client, Member);
        message.channel.send({embeds: [Embed]});
    } // else
   }
};