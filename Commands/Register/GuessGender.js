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
    var Name = args[0];
    if(Name.includes("ş")) Name = Name.replace('ş', 's');
    else if(Name.includes("ğ")) Name = Name.replace('ğ', 'g');
    else if(Name.includes("ü")) Name = Name.replace('ü', 'u');
    else if(Name.includes("ı")) Name = Name.replace('ı', 'i');

    var url = `https://api.genderize.io/?name=${Name}`
    axios.get(url, {"method": "GET"}).then(async (x) => {
        var Embed = new MessageEmbed();
        if(x.data.probability < 70){
            var options = ["devam", "yanlış"];
            var Filter = (m) => { m.author.id === message.author.id};
            Embed.setDescription(`${x.data.gender} ${x.data.probability} olarak çıktı. 
            Bu doğru bir cinsiyet mi? Eğer doğruysa \`\`devam\`\` yazın eğer yanlışsa \`\`yanlış\`\` yazın.`);
            Embed.setColor("GREY");
            message.channel.send({embeds: [Embed]});
            var channel = message.channel;
            const col = channel.createMessageCollector(filter, {max: 1, time: 1000 *5 });

            /**
             * @param {Discord.Message} message
             */
            col.on("collect", (message) => {
                // TODO
            })
        }
    });
   }
};