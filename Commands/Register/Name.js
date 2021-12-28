const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const Client = require("../../Structures/Client");
module.exports = {
   name: "Name",
   description: "Kullanıcının ismini değiştirir",
   developerMode: false,
   permissions: "",
   aliases: ["isim", 'nick', 'change-name', 'isim-değiştir'],
   cooldown: 3,
   /**
    *  command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){      
    var Embed            = new MessageEmbed();
    var Member           = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    var Name             = args[1];
    var Age              = args[2];
    if(!message.member.roles.cache.get(client.settings.Roles.StaffRoles.Registry.REGISTER) && !client.settings.Roles.StaffRoles.LowStaffs.some(LowRole => message.member.roles.cache.has(LowRole)) && !client.settings.Roles.StaffRoles.HighStaffs.some(HighRole => message.member.roles.cache.has(HighRole)) && !message.member.permissions.has("ADMINISTRATOR")){
        Embed.setDescription(`İsim değiştirilirken bir hata oluştu. [\`\`${client.errormsg.Message.NOT_ENOUGH_PERM}\`\`]`)
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
        Embed.setDescription(`İsim değiştirilirken bir hata oluştu. [\`\`${client.errormsg.Message.NO_USER}\`\`]`)
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
    else if(!Member.manageable || Member.roles.highest.position >= message.guild.roles.cache.get(client.settings.Roles.StaffRoles.MIN_STAFF).position || !Member.roles.cache.has(client.settings.Roles.UserRoles.UNREGISTER)) {
        Embed.setDescription(`${Member} İsim değiştirilirken bir hata oluştu. [\`\`${client.errormsg.Message.ALREADY_REGISTERED_OR_STAFF}\`\`]`)
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
    else if (!Name){
        Embed.setDescription(`İsim değiştirilirken bir hata oluştu. [\`\`${client.errormsg.Message.NO_NAME_ARGS}\`\`]`)
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
    else if(!Age) {
        Embed.setDescription(`İsim değiştiriliken bir hata oluştu. [\`\`${client.errormsg.Message.NO_AGE_ARGS}\`\`]`);
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
    else if(isNaN(Age) || Age > 50) {
        Embed.setDescription(`İsim değiştiriliken bir hata oluştu. [\`\`${client.errormsg.Message.INVALID_AGE}\`\`]`);
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
        var UserDB = new client.db.table('user');
        Embed.setDescription(`${Member} adlı kişinin adı değiştirildi. Yeni adı [${Name} ${Age}]`);
        Embed.setColor(client.settings.EmbedSettings.Colors.SUCCESS_COLOR);
        Embed.setFooter(client.settings.EmbedSettings.Footer.replace('{guild}', message.guild.name));
        message.channel.send({embeds: [Embed]});

        await Member.setNickname(`${Name} | ${Age}`);
        UserDB.push(`names.${Member.id}`, { name: Member, age: Age, date: Date.now()});
    } 
   }
};