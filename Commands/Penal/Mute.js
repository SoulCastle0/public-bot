const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const Client = require("../../Structures/Client");
const ms     = require('ms');
module.exports = {
   name: "mute",
   description: "Kullanıcıyı uyarmanızı sağlar.",
   developerMode: false,
   permissions: "",
   aliases: ["sustur", "uyarı"],
   cooldown: 3,
   /**
    * Mute command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){
         var PenalDB         = new client.db.table('penal');
         var UserDB          = new client.db.table('user');
         var Staff_DB        = new client.db.table('staff');
         var Embed           = new MessageEmbed();
         var Member          = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
         var Time            = args[1];
         var Reason          = args.slice(2).join(' ') || 'Sebep yok';
         var Filter          = (reaction, user) => ['921735626930417715', '921759954942165022', '921735630919196763'].includes(reaction.emoji.id) && user.id === message.author.id;
         var MuteEndTime     = client.moment(Date.now() + ms(Time)).format("LLL");
         var MuteThrownTime  = client.moment(Date.now()).format("LLL");
         if(!Member) {
            client.functions.SendEmbed(message, message.channel, {EmbedDesc: `Susturma sırasında bir hata oluştu. [\`\`${client.errormsg.Message.SELF_USAGE}\`\`]`});
            return;
         }
         else if(Member.user.bot){
            client.functions.SendEmbed(message, message.channel, {EmbedDesc: `Susturma sırasında bir hata oluştu. [\`\`${client.errormsg.Message.USER_IS_BOT}\`\`]`});
            return;
         }
         else if(!Time && !ms(Time)){
            client.functions.SendEmbed(message, message.channel, {EmbedDesc: `Susturma sırasında bir hata oluştu. [\`\`${client.errormsg.Message.NO_TIME_ARGS}\`\`]`});
            return;
         }
         else {
            Embed.setDescription(`${message.member} lütfen emojilere basarak mute türünü seç.`);
            Embed.setColor(client.settings.EmbedSettings.Colors.WAITING_COLOR);
            Embed.setFooter('İşlem bekleniyor');
            var msg = await message.channel.send({embeds: [Embed]});

            var collector = await msg.createReactionCollector({filter: Filter, max: 1})

            msg.react('921735626930417715'); // v mute
            msg.react('921759954942165022'); // c mute
            msg.react('921735630919196763'); // cancel

            collector.on("collect", (reaction) => {
               if(reaction.emoji.name == "921735626930417715"){
                  if(!message.member.roles.cache.get(client.settings.Roles.StaffRoles.Penalty.VOICE_MUTE_HAMMER) && !client.settings.Roles.StaffRoles.LowStaffs.some(LowRole => message.member.roles.cache.has(LowRole)) && !client.settings.Roles.StaffRoles.HighStaffs.some(HighRole => message.member.roles.cache.has(HighRole)) && !message.member.permissions.has("ADMINISTRATOR")){
                     collector.stop();
                     msg.reactions.removeAll();
                     Embed.setDescription(`Susturma gerçekleştirilirken bir hata oluştu. [\`\`${client.errormsg.Message.NOT_ENOUGH_PERM}\`\`]`);
                     Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
                     message.channel.send({embeds: [Embed]});  
                     return;
                  }
                  else {
                     collector.stop();
                     msg.reactions.removeAll();
                     Embed.setDescription(`${Member}
                     
                     \`\`\`css\n@${Member.user.username} isimli kullanıcı başarıyla mutelendi
                     [YETKILI] ${message.author.username}
                     [KULLANICI] ${Member.user.username}
                     [SEBEP] ${Reason}
                     
                     [SUSTURULMA TARİHİ] ${MuteThrownTime}
                     [SUSTURMANIN BİTECEĞİ TARİH] ${MuteEndTime}
                     \`\`\``)

                     message.channel.send({embeds: [Embed]});
                  }
               }
               else if(reaction.emoji.id == "921759954942165022"){
                  
               }
               else if(reaction.emoji.id == "921735630919196763"){
                  collector.stop();
                  msg.reactions.removeAll();
                  msg.then(x => {
                     if(x.deletable){
                           x.delete();
                     }
                  })
               }
            })
         }
   }
};