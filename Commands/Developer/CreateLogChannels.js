const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const Client = require("../../Structures/Client");
module.exports = {
   name: 'CreateLogChannels',
   description: 'show the ping of bot',
   developerMode: false,
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
      const { MUTE_LOG, TALENT_LOG, WARN_LOG, JAIL_LOG, BAN_LOG, TAG_LOG, COMMAND_LOG, VOICE_LOG } = client.settings.Channels.LogChannels;
      
      /**
       * 
       * @param {Discord.ReactionEmoji} reaction 
       * @param {Discord.User} user 
       */
      const filter = (reaction, user) => {
        ["✅", "❌"].includes(reaction.name) && user.id == message.author.id;
      }
      embed.setDescription(`${message.author} !${commandName} adli komutu kullanmak istedigine emin misin?`)
      const msg = await message.channel.send({embeds: [embed]}); 
      msg.react("✅");
      msg.react("❌");

      var collector = msg.createReactionCollector({filter: filter, max: 1, time: 15000});
      collector.on("collect", (reaction, user) => {
          if(reaction.emoji.name == "✅"){
              collector.stop();
              message.reply('kuruluyo');
          }
          else {
              msg.reactions.removeAll();
              collector.stop();
              message.reply('Iptal edildi');
          }
      })

      collector.on("end", (reaction) => {
        collector.stop();  
        msg.reactions.removeAll();    
        message.reply('Basarili mesajlariniz siliniyor ve odalar kuruluyor...').then((x) => {
            if(x.deletable){
                setTimeout(() => {
                    x.delete();
                }, 5000);
            }
        })    
      })



   }
};