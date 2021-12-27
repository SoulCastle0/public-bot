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
      if(isTagged && !Member.user.tag.includes(Tag)){
         // If user has not tag in username
            Embed.setAuthor(message.author.username, client.functions.GetUserAvatar(message.author));
            Embed.setDescription(`
            ${Member} (\`\`${Member.id}\`\`) kişinin kullanıcı adında [**${Tag}**] tagı bulunmuyor.
            [Taglı alım durumu]: **${isTagged ? 'Açık' : 'Kapalı'}**
            [Tag]: **${Tag}**
            `);
            Embed.setColor('RED');
            Embed.setFooter(client.settings.EmbedSettings.Footer.replace('{guild}', message.guild.name));
            return message.reply({content: `${message.author}`, embeds: [Embed]}).then((msg) => {
               setTimeout(() => {
                  if(msg.deletable){
                     msg.delete();
                  }
               }, 5000);
            })
      }; 
      if(!isTagged || !Member.user.tag.includes(Tag)){
         try {
            Embed.setDescription(`[${Member}] adlı kullanıcıyı (\`\` ${Name} ${Age} \`\`) olarak kayıt etmek için lütfen bir cinsiyet seç.`)
            Embed.setColor(client.settings.EmbedSettings.UnBackgroundColor);
            Embed.setFooter(client.settings.EmbedSettings.Footer.replace(`{guild}`, message.guild.name));
            var Collector     = await message.createReactionCollector({filter: Filter, max:1});
            await message.react("921735625160425503");
            await message.react("921735626242543636");
            await message.react("921735630919196763");
         
            Collector.on('collect', async (reaction, user) => {
               if (reaction.emoji.id == "921735625160425503"){
                  await Collector.stop();
                  await Embed.setDescription(`[${Member}] kullanıcısını başarıyla (\`\` ${Name} ${Age}\`\`) adlıyla **erkek** olarak kayıt ettin.`)
                  message.channel.send({embeds: [Embed]})
                  Member.roles.set(client.settings.Roles.UserRoles.BOY);
               }
               else if (reaction.emoji.id == "921735626242543636") {
                  await Collector.stop();   
                  await Embed.setDescription(`[${Member}] kullanıcısını başarıyla (\`\` ${Name} ${Age}\`\`) adlıyla **kadın** olarak kayıt ettin.`)
                  message.channel.send({embeds: [Embed]})
                  Member.roles.set(client.settings.Roles.UserRoles.GIRL);
               }
               else if (reaction.emoji.id == "921735630919196763"){
                  Collector.stop();
                  message.reactions.removeAll();
               }
            }); // Collector collect
            Collector.on("end", async() => {
               await Collector.stop();
               await message.reactions.removeAll();
               Embed.setDescription(`[${Member}] kişisi aramıza katıldı hadi ona **hoş geldin** diyelim!`);
               Embed.setFooter(client.settings.EmbedSettings.Footer.replace(`{guild}`, message.guild.name));
               Embed.setColor(client.settings.EmbedSettings.UnBackgroundColor);

               message.guild.channels.cache.get(client.settings.Channels.PubliChannels.GENERAL_CHAT).send({embeds: [Embed]});
            }); // Collector end  
         } catch (error) {
            console.log(error.message);
         }// catch
      }; // else
   } // run
};