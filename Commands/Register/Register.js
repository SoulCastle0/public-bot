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
      var Filter      = (reaction, user) => { user.id == message.author.id };
      if(isTagged){
         // If user has not tag in username
         if(!message.member.user.tag.includes(Tag)){
            Embed.setAuthor(message.author.username, client.functions.GetUserAvatar(message.author));
            Embed.setDescription(`
            ${Member} (\`\`${Member.id}\`\`) kişinin kullanıcı adında [**${Tag}**] tagı bulunmuyor.
            [Taglı alım durumu]: **${isTagged ? 'Açık' : 'Kapalı'}**
            [Tag]: **${Tag}**
            `);
            Embed.setColor('RED');
            Embed.setFooter(client.settings.EmbedSettings.Footer.replace('{guild}', message.guild.name));
            return message.reply({content: `${message.author}`, embeds: [Embed]});
         } 
         // If have
         else {
            try {
               Embed.setColor(client.settings.EmbedSettings.UnBackgroundColor);
               Embed.setFooter(client.settings.EmbedSettings.Footer.replace(`{guild}`, message.guild.name));
               var Message       = message.channel.send({embeds: [Embed]})
               var Collector     = await Message.createReactionCollector({filter: Filter, max: 1, maxEmojis: 2});
   
               await Message.react("921735625160425503");
               await Message.react("921735626242543636");
               Collector.on('collect', async (reaction, user) => {
                  if (reaction.emoji.name == "921735625160425503"){
                     Collector.stop();
                     Member.roles.set(client.settings.Roles.UserRoles.BOY);
                  }
                  else if (reaction.emoji.name == "921735626242543636") {
                     Collector.stop();   
                     Member.roles.set(client.settings.Roles.UserRoles.GIRL);
                  };
               }); // Collector collect
               Collector.on("end", async () => {
                  Message.reactions.removeAll();
                  Embed.setDescription(`[${Member}] kişisi aramıza katıldı hadi ona **hoş geldin** diyelim!`);
                  Embed.setFooter(client.settings.EmbedSettings.Footer.replace(`{guild}`, message.guild.name));
                  Embed.setColor(client.settings.EmbedSettings.UnBackgroundColor);
   
                  message.guild.channels.cache.get(client.settings.Channels.PubliChannels.GENERAL_CHAT).send({embeds: [Embed]});
               }); // Collector end  
            } catch (error) {
               console.log(error.message);
            }// catch
         }; // else
      }
      else {
         try {
            Embed.setDescription(`${Member} adlı kullanıcıyı ${Name} ${Age} adıyle kayıt etmek istiyorsun. Devam etmek için lütfen bir cinsiyet belirle.`)
            Embed.setColor(client.settings.EmbedSettings.UnBackgroundColor);
            Embed.setFooter(client.settings.EmbedSettings.Footer.replace(`{guild}`, message.guild.name));
            var Message       = await message.channel.send({embeds: [Embed]})
            var Collector     = Message.createReactionCollector({filter: Filter, max: 1, time: 15000});

            await Message.react("921735625160425503");
            await Message.react("921735626242543636");
            Collector.on('collect', async (reaction, user) => {
               if (reaction.emoji.name == "921735625160425503"){
                  Collector.stop();
                  if(Member.roles.cache.map(x => x.id === client.settings.Roles.UserRoles.GIRL)){
                     Member.roles.set(client.settings.Roles.UserRoles.BOY);
                  } else {
                     Member.roles.add(client.settings.Roles.UserRoles.BOY[0]);
                     Member.roles.add(client.settings.Roles.UserRoles.BOY[1]);
                     Member.roles.remove(client.settings.Roles.UserRoles.UNREGISTER);
                  };
               }
               else if (reaction.emoji.name == "921735626242543636") {
                  Collector.stop();
                  if(Member.roles.cache.map(x => x.id === client.settings.Roles.UserRoles.BOY)){
                     Member.roles.set(client.settings.Roles.UserRoles.GIRL);
                  } else {
                     Member.roles.add(client.settings.Roles.UserRoles.GIRL[0]);
                     Member.roles.add(client.settings.Roles.UserRoles.GIRL[1]);
                     Member.roles.remove(client.settings.Roles.UserRoles.UNREGISTER);
                  };
               };
            }); // Collector collect
            Collector.on("end", async () => {
               await Message.reactions.removeAll();
               Embed.setDescription(`[${Member}] kişisi aramıza katıldı hadi ona **hoş geldin** diyelim!`);
               Embed.setFooter(client.settings.EmbedSettings.Footer.replace(`{guild}`, message.guild.name));
               Embed.setColor(client.settings.EmbedSettings.UnBackgroundColor);

               message.guild.channels.cache.get(client.settings.Channels.PubliChannels.GENERAL_CHAT).send({embeds: [Embed]});
            }); // Collector end  
         } catch (error) {
            console.log(error.message);
         }// catch         
      }; // if tagged
   } // run
};