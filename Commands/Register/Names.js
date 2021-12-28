const { MessageEmbed }       = require("discord.js");
const Discord                = require('discord.js');
const Client                 = require("../../Structures/Client");
const quick                  = require('quick.db');

module.exports = {
   name: "Names",
   description: "Kullanıcının eski isimlerini listeler.",
   developerMode: false,
   permissions: "",
   aliases: ["isimler", "eski-isimler", "old-names"],
   cooldown: 3,
   /**
    * Names command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){      
        var Member       = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        var Names        = quick.fetch(`names.${Member.id}`);
        var Embed        = new MessageEmbed();
        Embed.setDescription(`${message.author} tarafından ${Member} kullanıcısının eski isimleri istendi.`);
        Embed.setAuthor(message.author.username, client.functions.GetUserAvatar(message.author));
        Embed.setColor(client.settings.EmbedSettings.UnBackgroundColor);
        Embed.addField(`İsimler: `, `\`\`\`CSS\n${Names.map((data, index) => `#${index + 1} ${data.name} | ${data.age} [${client.moment(data.date).format("LLL")}]`).join("\n")}\`\`\``, true)
        Embed.setFooter(client.settings.EmbedSettings.Footer);
        message.channel.send({embeds: [Embed]});
   }
};