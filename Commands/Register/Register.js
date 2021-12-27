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
    * @param {String[]} args 
    * @param {String} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){
      // Declaring MessageEmbed;
      var Embed       = new MessageEmbed();
      var Member      = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      var Name        = args[1];
      var Age         = args[2]; 
      var isTagged    = client.settings.GuildSettings.isTaggedRegister;
      var Tag         = client.settings.GuildSettings.TAG;

      if(isTagged){
         if(!message.member.user.tag.includes(Tag)){
            Embed.setAuthor(message.author.username, message.author.avatarURL({dynamic: true, format: 'png'}));
            Embed.setDescription(`
            ${Member} (\`\`${Member.id}\`\`) kişinin kullanıcı adında [**${Tag}**] tagı bulunmuyor.
            [Taglı alım durumu]: **${isTagged ? 'Açık' : 'Kapalı'}**
            [Tag]: **${Tag}**
            `);
            Embed.setColor('RED');
            Embed.setFooter(client.settings.EmbedSettings.Footer.replace('{guild}', message.guild.name));
            return message.reply({content: `${message.author}`, embeds: [Embed]});
         }
      }
      




   }
};