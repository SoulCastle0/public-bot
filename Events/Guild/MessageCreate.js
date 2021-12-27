const Discord = require('discord.js');
const Client = require('../../Structures/Client');
module.exports = {
    name: 'messageCreate',
    /**
     * messageCreate event
     * @param {Discord.Message} message 
     * @param {Client} client 
     * @param {Discord} Discord 
     */
    async run(message, client, Discord){
        const embed = new Discord.MessageEmbed()
        const { MUTE_LOG, TALENT_LOG, WARN_LOG, JAIL_LOG, BAN_LOG, TAG_LOG, COMMAND_LOG, VOICE_LOG } = client.settings.Channels.LogChannels;
        if(!message.content.startsWith(client.settings.ClientSettings.PREFIX) || message.author.bot) return;

        const args = message.content.slice(client.settings.ClientSettings.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(Find => Find.aliases && Find.aliases?.includes(commandName));
        
        if(!command) return;
        
        if(command.permissions){
            const AuthorPerm = message.channel.permissionsFor(message.author);
            if(!AuthorPerm || !AuthorPerm.has(command.permissions)){
                embed.setColor('RED');
                embed.setDescription(`Bu komutu çalıştırabilmek için yeterli yetkin bulunmuyor.`);
                message.reply({embeds: [embed]}).then((msg) => {
                    setTimeout(() => {
                        if(msg.deletable){
                            msg.delete();
                        }
                    }, 10000)
                });
            };
        };
        if(command.developerMode){
            if(!client.settings.ClientSettings.DEVELOPERS.includes(message.author.id)){
                embed.setColor('RED');
                embed.setDescription(`Bu komut sadece geliştiricilere açıktır.`);
                return message.reply({embeds: [embed]}).then((msg) => {
                    setTimeout(() => {
                        if(msg.deletable){
                            msg.delete();
                        };
                    }, 10000);
                });
            };
        };


        
        if(!client.cooldowns.has(`${command.name}`)){
            client.cooldowns.set(`${command.name}`, new Discord.Collection());
        };
        const timestamp = client.cooldowns.get(`${command.name}`);
        const cooldown  = (command.cooldown || 1) * 1000;
        
        if(timestamp.has(message.author.id)){
            const exp_time = timestamp.get(message.author.id) + cooldown;
            if(Date.now() < exp_time){
                embed.setColor('RED');
                embed.setDescription(`Tekrar komut kullanabilmek için (\`\`${((exp_time - Date.now()) / 1000).toFixed(1)}\`\`) saniye bekleyin.`);
                return message.channel.send({embeds: [embed]}).then((msg) => {
                    setTimeout(() => {
                        if(msg.deletable){
                            msg.delete();
                        };
                    }, 10000);
                });
            };
        };

        timestamp.set(message.author.id, Date.now());

        try {
            if(!MUTE_LOG || !TALENT_LOG || !WARN_LOG || !JAIL_LOG || !BAN_LOG || !TAG_LOG || !COMMAND_LOG || !VOICE_LOG){
                embed.setDescription(`Log kanalları ayarlanmamış. Otomatik olarak kurmak için \`\`!log-kur\`\` komutunu kullanınız.`);
                embed.setColor('RED');
                message.reply({embeds: [embed]});
                return;
            };
            command.run(message, args, commandName, client, Discord);
            
            var channel = client.guilds.cache.get(client.settings.ClientSettings.SERVER).channels.cache.get(client.settings.Channels.LogChannels.COMMAND_LOG);
            if(!channel) return;
            else {
                embed.setAuthor('Bir komut kullanıldı', client.functions.GetUserAvatar(message.author));
                embed.setColor(client.settings.EmbedSettings.UnBackgroundColor);
                embed.addField(`[KULLANICI]`, `${message.author} (\`\`${message.author.id}\`\`)`);
                embed.addField(`[KOMUT]`, `\`\`\`diff\n- !${commandName}\`\`\`` , true);
                embed.addField('[MESAJA GIT]', `[_Buraya tıklayıp mesaja git_](${GetMessageURL(client, message)})\n**Manuel**\n${GetMessageURL(client, message)}`, false);
                embed.setThumbnail(client.functions.GetUserAvatar(message.author));
                channel.send({embeds: [embed]});
            };
        }
        catch(error) {
            console.log(error);
            embed.setColor('RED');
            embed.setDescription(`**[Komut işlenirken bir hata oluştu]**: 
            \`\`${error.message}\`\`
            
            `);
            message.channel.send({embeds: [embed]}).then((msg) => {
                setTimeout(() => {
                    if(msg.deletable){
                        msg.delete();
                    };
                }, 25000);
            });
        };
    }
};