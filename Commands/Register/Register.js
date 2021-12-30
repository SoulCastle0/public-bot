const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const Client = require("../../Structures/Client");
const axios  = require('axios').default;
module.exports = {
   name: "Register",
   description: "Kullanıcıyı kayıt etmenizi sağlar.",
   developerMode: false,
   permissions: "",
   aliases: ["kayıt", "register", "auto-reg", "regauto", "autoreg", "otokayıt", "ok"],
   cooldown: 3,
   /**
    * Register command
    * @param {Discord.Message} message 
    * @param {string} args 
    * @param {string} commandName 
    * @param {Client} client 
    * @param {Discord} Discord 
    */
   async run(message, args, commandName, client, Discord){
    // banned words from 'https://github.com/acarfx/acarkre' thank you :)
    var BannedWords      = ["amcık","orospu","sikerim","sikik", "amcik", "amına","pezevenk","yavşak", "oç", "piç" ,"ananı","anandır","orospu","evladı","göt","pipi","sokuk","yarrak","siktir","bacını","karını","amk","aq","sik","amq","anaskm","AMK","YARRAK","sıkerım"];
    var Embed            = new MessageEmbed();
    var Member           = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    var Name             = args[1];
    var Age              = args[2];
    var Filter           = (reaction, user) => user.id === message.author.id;
    if(!message.member.roles.cache.get(client.settings.Roles.StaffRoles.Registry.REGISTER) && !client.settings.Roles.StaffRoles.LowStaffs.some(LowRole => message.member.roles.cache.has(LowRole)) && !client.settings.Roles.StaffRoles.HighStaffs.some(HighRole => message.member.roles.cache.has(HighRole)) && !message.member.permissions.has("ADMINISTRATOR")){
        Embed.setDescription(`Kayıt oluşturulurken bir hata oluştu. [\`\`${client.errormsg.Message.NOT_ENOUGH_PERM}\`\`]`)
        Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
        message.channel.send({embeds: [Embed]}).then((msg) => {
            if(msg.deletable){
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            }
        });
        return;  
    }
    else if(!Member) {
        Embed.setDescription(`Kayıt oluşturulurken bir hata oluştu. [\`\`${client.errormsg.Message.NO_USER}\`\`]`)
        Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
        message.channel.send({embeds: [Embed]}).then((msg) => {
            if(msg.deletable){
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            }
        });
        return;
    }
    else if(Member.roles.highest.position >= message.guild.roles.cache.get(client.settings.Roles.StaffRoles.MIN_STAFF).position || !Member.roles.cache.has(client.settings.Roles.UserRoles.UNREGISTER)) {
        Embed.setDescription(`${Member} Kayıt oluşturulurken bir hata oluştu. [\`\`${client.errormsg.Message.ALREADY_REGISTERED_OR_STAFF}\`\`]`)
        Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
        message.channel.send({embeds: [Embed]}).then((msg) => {
            if(msg.deletable){
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            }
        });
        return;
    }
    else if (!Name){
        Embed.setDescription(`Kayıt oluşturulurken bir hata oluştu. [\`\`${client.errormsg.Message.NO_NAME_ARGS}\`\`]`)
        Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
        message.channel.send({embeds: [Embed]}).then((msg) => {
            if(msg.deletable){
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            }
        });
        return;
    }
    else if(BannedWords.some(Word => message.content.toLowerCase().split(" ").includes(Word))){
        Embed.setDescription(`Kayıt oluşturulurken bir hata oluştu. [\`\`${client.errormsg.Message.INVALID_NAME}\`\`]`)
        Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
        message.channel.send({embeds: [Embed]}).then((msg) => {
            if(msg.deletable){
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            }
        });
        return;
    }
    else if(!Age) {
        Embed.setDescription(`Kayıt işlemi başlarken bir hata oluştu. [\`\`${client.errormsg.Message.NO_AGE_ARGS}\`\`]`);
        Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
        message.channel.send({embeds: [Embed]}).then((msg) => {
            if(msg.deletable){
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            }
        });
        return;
    }
    else if(isNaN(Age) || Age > 50) {
        Embed.setDescription(`Kayıt işlemi başlarken bir hata oluştu. [\`\`${client.errormsg.Message.INVALID_AGE}\`\`]`);
        Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
        message.channel.send({embeds: [Embed]}).then((msg) => {
            if(msg.deletable){
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            }
        });
        return;
    } else {

        if(Name.includes("ş")) Name = Name.replace('ş', 's').replace('ü', 'u');
        else if(Name.includes("ğ")) Name = Name.replace('ğ', 'g');
        else if(Name.includes("ü")) Name = Name.replace('ü', 'u');
        else if(Name.includes("İ")) Name = Name.replace('İ', 'i');
        else if(Name.includes("ı")) Name = Name.replace('ı', 'i');
        else if(Name.includes("ç")) Name = Name.replace('ç', 'c').replace('ç', 'c')
    
        var url = `https://api.genderize.io/?name=${Name}`
        axios.get(url, {"method": "GET"}).then(async (x) => {
            if(x.data.gender == "male"){
                Embed.setDescription(`
                ${Member} (\`\`${args[1].charAt(0).toUpperCase().replace('i', 'İ') + args[1].slice(1)} | ${Age}\`\`) adıyla \`\`erkek\`\` olarak kayıt edildi.
                
                **[NOT]** Bu sistem **geliştirme** aşamasındadır. Karşılaştığınız sorunları lütfen geliştiriclere bildiriniz.
                **[KESINLIK]** (\`\`100%\`\`) üzerinden -> (\`\`${Math.floor(x.data.probability * 100)}%\`\`) 
                `);
                Embed.setFooter(client.settings.EmbedSettings.Footer.replace('{guild}', message.guild.name));
                Embed.setColor(client.settings.EmbedSettings.Colors.BOY_COLOR);
                Embed.setAuthor(Member.user.username);
                Embed.setThumbnail(Member.user.avatarURL({dynamic: true}));
                
                await client.functions.RegisterUser(client, Member, args[1].charAt(0).toUpperCase().replace('i', 'İ') + args[1].slice(1), Age, x.data.gender, message.author);
                message.channel.send({embeds: [Embed]});
            } else if(x.data.gender == "female"){
                Embed.setDescription(`
                ${Member} (\`\`${args[1].charAt(0).toUpperCase().replace('i', 'İ') + args[1].slice(1)} | ${Age}\`\`) adıyla \`\`kadın\`\` olarak kayıt edildi.
                
                [NOT] Bu sistem **geliştirme** aşamasındadır. Karşılaştığınız sorunları lütfen geliştiriclere bildiriniz.
                **[KESINLIK]** (\`\`100%\`\`) üzerinden -> (\`\`${Math.floor(x.data.probability * 100)}%\`\`) 
                `);
                Embed.setFooter(client.settings.EmbedSettings.Footer.replace('{guild}', message.guild.name));
                Embed.setColor(client.settings.EmbedSettings.Colors.GIRL_COLOR);
                Embed.setAuthor(Member.user.username);
                Embed.setThumbnail(Member.user.avatarURL({dynamic: true}));
                
                await client.functions.RegisterUser(client, Member, args[1].charAt(0).toUpperCase().replace('i', 'İ') + args[1].slice(1), Age, x.data.gender, message.author.id);
                message.channel.send({embeds: [Embed]});
            } else {

                Embed.setDescription(`${Member} adlı kişi kayıt edilirken cinsiyeti tespit edilemedi.
                \`\`\`CSS\n[Manuel olarak kayıt etmen gerek lütfen cinsiyet belirtmek için emojiye tıkla]\`\`\``)
                Embed.addField('[ERKEK]', client.specialEmojis.REG_BOY_SUCCESSFUL, true)
                Embed.addField('[KADIN]', client.specialEmojis.REG_GIRL_SUCCESSFUL, true)
                var msg = message.channel.send({embeds: [Embed]});
                (await msg).react('921735625160425503'); // erkek
                (await msg).react('921735626305450034'); // kadin
                (await msg).react('921735630919196763'); // iptal
                
                var collector = await (await msg).createReactionCollector({filter: Filter, max: 1});

                collector.on('collect', async (reaction) => {
                    if(reaction.emoji.id == '921735625160425503'){
                        await collector.stop();
                        await (await msg).reactions.removeAll();
                        
                        await client.functions.RegisterUser(client, Member, args[1].charAt(0).toUpperCase().replace('i', 'İ') + args[1].slice(1), Age, 'male', message.author);
                        msg.then(x => {
                            var supra = new MessageEmbed();
                            supra.setDescription(`
                            ${Member} (\`\`${args[1].charAt(0).toUpperCase().replace('i', 'İ') + args[1].slice(1)} | ${Age}\`\`) adıyla \`\`erkek\`\` olarak kayıt edildi.
                            
                            **[NOT]** Bu sistem **geliştirme** aşamasındadır. Karşılaştığınız sorunları lütfen geliştiriclere bildiriniz.`);
                            supra.setFooter(client.settings.EmbedSettings.Footer.replace('{guild}', message.guild.name));
                            supra.setColor(client.settings.EmbedSettings.Colors.BOY_COLOR);
                            supra.setAuthor(Member.user.username);
                            supra.setThumbnail(Member.user.avatarURL({dynamic: true}));
                            x.edit({embeds: [supra]});
                        })
                        return;
                    }
                    else if(reaction.emoji.id == '921735626305450034'){
                        await collector.stop();
                        await (await msg).reactions.removeAll();
                        
                        await client.functions.RegisterUser(client, Member, args[1].charAt(0).toUpperCase().replace('i', 'İ') + args[1].slice(1), Age, 'female', message.author.id);
                        msg.then(x => {
                            var supra = new MessageEmbed();
                            supra.setDescription(`
                            ${Member} (\`\`${args[1].charAt(0).toUpperCase().replace('i', 'İ') + args[1].slice(1)} | ${Age}\`\`) adıyla \`\`kadın\`\` olarak kayıt edildi.
                            
                            **[NOT]** Bu sistem **geliştirme** aşamasındadır. Karşılaştığınız sorunları lütfen geliştiriclere bildiriniz.`);
                            supra.setFooter(client.settings.EmbedSettings.Footer.replace('{guild}', message.guild.name));
                            supra.setColor(client.settings.EmbedSettings.Colors.GIRL_COLOR);
                            supra.setAuthor(Member.user.username);
                            supra.setThumbnail(Member.user.avatarURL({dynamic: true}));
                            x.edit({embeds: [supra]});
                        })

                        return;
                    }
                    else if(reaction.emoji.id == '921735630919196763'){
                        await collector.stop();
                        await (await msg).reactions.removeAll();
                        msg.then(x => {
                            x.delete();
                        })
                        return;
                    }
                });
                
            }
        });
    }
   }
};
