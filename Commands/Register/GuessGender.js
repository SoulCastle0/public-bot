const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const Client = require("../../Structures/Client");
const axios  = require('axios').default;
module.exports = {
   name: "otokayıt",
   description: "",
   developerMode: false,
   permissions: "",
   aliases: [""],
   cooldown: 3,
   /**
    * X command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){
    var Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    var Name = args[1];
    var Age  = args[2];
    if(Name.includes("ş")) Name = Name.replace('ş', 's');
    else if(Name.includes("ğ")) Name = Name.replace('ğ', 'g');
    else if(Name.includes("ü")) Name = Name.replace('ü', 'u');
    else if(Name.includes("ı")) Name = Name.replace('ı', 'i');

    var url = `https://api.genderize.io/?name=${Name}`
    axios.get(url, {"method": "GET"}).then(async (x) => {
        var Embed = new MessageEmbed();
        if(x.data.gender == "male"){
            Embed.setDescription(`
            ${Member} (\`\`${args[1]} | ${Age}\`\`) adıyla \`\`erkek\`\` olarak kayıt edildi.
            
            **[NOT]** Bu sistem **geliştirme** aşamasındadır. Karşılaştığınız sorunları lütfen geliştiriclere bildiriniz.
            **[KESINLIK]** (\`\`1\`\`) üzerinden -> (\`\`${x.data.probability}\`\`) 
            `);
            Embed.setFooter(client.settings.EmbedSettings.Footer.replace('{guild}', message.guild.name));
            Embed.setColor(client.settings.EmbedSettings.Colors.BOY_COLOR);
            Embed.setAuthor(Member.user.username, client.functions.GetUserAvatar(Member));
            
            await client.functions.RegisterUser(client, Member, args[1], Age, x.data.gender, message.author);
            message.channel.send({embeds: [Embed]});
        } else if(x.data.gender == "female"){
            Embed.setDescription(`
            ${Member} (\`\`${args[1]} | ${Age}\`\`) adıyla \`\`kadın\`\` olarak kayıt edildi.
            
            [NOT] Bu sistem **geliştirme** aşamasındadır. Karşılaştığınız sorunları lütfen geliştiriclere bildiriniz.
            **[KESINLIK]** (\`\`1\`\`) üzerinden -> (\`\`${x.data.probability}\`\`) 
            `);
            Embed.setFooter(client.settings.EmbedSettings.Footer.replace('{guild}', message.guild.name));
            Embed.setColor(client.settings.EmbedSettings.Colors.GIRL_COLOR);
            Embed.setAuthor(Member.user.username, client.functions.GetUserAvatar(Member));
            
            await client.functions.RegisterUser(client, Member, args[1], Age, x.data.gender, message.author.id);
            message.channel.send({embeds: [Embed]});
        } else {
            Embed.setDescription(`${Member} kullanıcısını kayıt ederken bir hatayla ile karşılaşıldı.`);
            Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
            Embed.setAuthor(Member.user.username, client.functions.GetUserAvatar(Member));
            
            message.channel.send({embeds: [Embed]});
        }
    });
   }
};