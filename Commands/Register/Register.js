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
    var BannedWords      = ["amcık","orospu","piç","sikerim","sikik", "amcik", "amına","pezevenk","yavşak","ananı","anandır","orospu","evladı","göt","pipi","sokuk","yarrak","oç","o ç","siktir","bacını","karını","amk","aq","sik","amq","anaskm","AMK","YARRAK","sıkerım"];
    var Embed            = new MessageEmbed();
    var Member           = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    var Name             = args[1];
    var Age              = args[2];
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
                Embed.setThumbnail(client.functions.GetUserAvatar(Member));
                
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
                Embed.setThumbnail(client.functions.GetUserAvatar(Member));
                
                await client.functions.RegisterUser(client, Member, args[1].charAt(0).toUpperCase().replace('i', 'İ') + args[1].slice(1), Age, x.data.gender, message.author.id);
                message.channel.send({embeds: [Embed]});
            } else {
                Embed.setDescription(`${Member} kullanıcısını kayıt ederken bir hatayla ile karşılaşıldı. [\`\`Geçersiz isim\`\`]`);
                Embed.setColor(client.settings.EmbedSettings.Colors.ERROR_COLOR);
                Embed.setAuthor(Member.user.username);
                Embed.setThumbnail(client.functions.GetUserAvatar(Member));
                
                message.channel.send({embeds: [Embed]});
            }
        });
    }

   }
};