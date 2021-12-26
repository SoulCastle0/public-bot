const Discord = require('discord.js');
const Client = require('../../Structures/Client');
module.exports = {
    name: 'messageCreate',
    /**
     * 
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
                embed.setDescription(`You dont have the required permissions to run this command`);
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
                embed.setDescription(`This command only developers can use`);
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
                embed.setDescription(`You must wait ${((exp_time - Date.now()) / 1000).toFixed(1)} second to use this command again`);
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
                embed.setDescription(`Log kanallari ayarlanmamis. Otomatik olarak kurmak icin \`\`!log-kur\`\` komutunu kullan`);
                embed.setColor('RED');
                message.reply({embeds: [embed]});
            }
            else if(!channel) return;
            else {
                command.run(message, args, commandName, client, Discord);
                var channel = client.guilds.cache.get(client.settings.ClientSettings.SERVER).channels.cache.get(client.settings.Channels.LogChannels.COMMAND_LOG);
                embed.setTitle('Bir komut kullanildi');
                embed.addField(`[KULLANICI]`, `${message.author} (\`\`${message.author.id}\`\`)`);
                embed.addField(`[KOMUT]`, `\`\`\`diff\n- !${commandName}\`\`\`` , true);
                channel.send({embeds: [embed]});
            }
        }
        catch(error) {
            console.log(error);
            embed.setColor('RED');
            embed.setDescription(`There is an error while running command: ${error.message}`);
            message.channel.send({embeds: [embed]}).then((msg) => {
                setTimeout(() => {
                    if(msg.deletable){
                        msg.delete();
                    };
                }, 10000);
            });
        };
    }
};