const Client            = require("../Structures/Client");
const Discord           = require('discord.js');
const quick             = require('quick.db');
const Table             = require('table');
const ms                = require('ms');
const User_DB           = new quick.table('user');
const Staff_DB          = new quick.table('staff');
const Penal_DB          = new quick.table('penal');
/**
 * Getting messageURL
 * @param {Client} client 
 * @param {Discord.Message} message 
 */
module.exports.GetMessageURL = (client, message) => {
    return `https://discord.com/channels/${client.settings.ClientSettings.SERVER}/${message.channel.id}/${message.id}`;
};

/**
 * Getting user avatarURL
 * @param {Discord.User} user 
 */
module.exports.GetUserAvatar = (user) => {
    return user.avatarURL({dynamic: true});
};

/**
 * Register user
 * @param {Client} client
 * @param {Discord.GuildMember} user 
 * @param {String} name 
 * @param {Number} age 
 * @param {Discord.User} author
 */
module.exports.RegisterUser = async (client, user, name, age, gender, author) => {
    var Client          = client;
    var Member          = user;
    var Gender          = gender;
    var Name            = name;
    var Age             = age;
    var Author          = author;
    
    /* Not need these data for now
    var Datas = {
        ID: Member.id,
        name: Name,
        age: Age,
        gender: Gender,
        author: Author.id,
        date: Date.now()
    };
    */
    try {
        if(Gender == "male"){
            await Member.setNickname(`${Name.charAt(0).toUpperCase().replace('i', 'İ') + Name.slice(1)} | ${Age}`);
            await Member.roles.set(Client.settings.Roles.UserRoles.BOY);
            await User_DB.push(`names.${Member.id}`, {name: Name.charAt(0).toUpperCase().replace('i', 'İ') + Name.slice(1), age: Age, gender: Gender,date: Date.now()});
            
            Staff_DB.add(`registers.${Author.id}.boy`, 1);
            Staff_DB.add(`registers.${Author.id}.total`, 1);
            Staff_DB.add(`points.${Author.id}.boyReg`, client.settings.PointSettings.Registry.BOY);
        };
        if(Gender == "female"){
            await Member.setNickname(`${Name.charAt(0).toUpperCase().replace('i', 'İ') + Name.slice(1)} | ${Age}`);
            await Member.roles.set(Client.settings.Roles.UserRoles.GIRL);
            await User_DB.push(`names.${Member.id}`, {name: Name.charAt(0).toUpperCase().replace('i', 'İ') + Name.slice(1), age: Age, gender:Gender ,date: Date.now()});

            Staff_DB.add(`registers.${Author.id}.girl`, 1);
            Staff_DB.add(`registers.${Author.id}.total`, 1);
            Staff_DB.add(`registers.${Author.id}.girlReg`, client.settings.PointSettings.Registry.GIRL);
        };
        if(Gender !== "female" && Gender !== "male"){
            return;
        }
    }
    catch(err) {
        return new Error(`Bir hata oluştu: \n\`\`${err.message}\`\``);
    };
};

/**
 * This function listing all name of specify user
 * @param {Client} client 
 * @param {Discord.User} user 
 * @param {Discord.User} author 
 * @param {Discord.Message} message
 */
module.exports.GetNamesOfUser = async (client, user, author, message) => {
    var Embed        = new Discord.MessageEmbed();
    var Member       = user;
    var Author       = author;
    var Titles       = [["ID", "İsim", "Yaş", "Tarih", "Cinsiyet","Önce"]];
    if(!message.member.roles.cache.get(client.settings.Roles.StaffRoles.Registry.REGISTER) && !client.settings.Roles.StaffRoles.LowStaffs.some(LowRole => message.member.roles.cache.has(LowRole)) && !client.settings.Roles.StaffRoles.HighStaffs.some(HighRole => message.member.roles.cache.has(HighRole)) && !message.member.permissions.has("ADMINISTRATOR")){
        Embed.setDescription(`İsimler listelenirken bir hata oluştu. [\`\`${client.errormsg.Message.NOT_ENOUGH_PERM}\`\`]`)
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
    else if(!Member){
        Embed.setDescription(`İsimler listelenirken bir hata oluştu. [\`\`${client.errormsg.Message.NO_USER}\`\`]`)
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
    else if(!User_DB.fetch(`names.${Member.id}`)){
        Embed.setDescription(`İsimler listelenirken bir hata oluştu. [\`\`${client.errormsg.Message.NO_NAMEDATA}\`\`]`)
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
        var Names = User_DB.fetch(`names.${Member.id}`);
        Titles = Titles.concat(Names.map((val, index) => {
            var GetAgo = client.Ago.format(val.date, 'mini');
            var _gender = val.gender;
            return [ 
                `#${index + 1}`,
                `${val.name}`,
                `${val.age}`,
                `[${client.moment(val.date).format("DD/MM/YYYY")}]`,
                `${_gender}`,
                `${GetAgo.replace('önce', '')}`
            ];
        }));// Concat
        
        return await message.channel.send({embeds: [new Discord.MessageEmbed().setColor("BLUE").setAuthor(Author.username, Author.avatarURL({dynamic: true, size: 2048})).setDescription(`\n${Member} adlı kullanıcının eski isimleri ${Author} tarafından istenildi.`).addField(`İsimler`, `\`\`\`css\n
${Table.table(Titles, {
            border: Table.getBorderCharacters(`void`),
            columnDefault: {
                paddingLeft: 1,
                paddingRight: 0,
            },
    
            columns: {
                0: {
                    paddingLeft: 1,
                },
                1: {
                    paddingLeft: 1,
                },
                2: {
                    paddingLeft: 1,
                },
                3: {
                    alignment:"center",
                    paddingLeft: 1,
                },
                4: {
                    paddingLeft: 1,
                },
                5: {
                    paddingLeft: 1,
                },
                6: {
                    alignment:"center",
                    paddingLeft: 1,
                    paddingRight: 1
                },
            },
            drawHorizontalLine: (index, size) => {
                return index === 0 || index === 1 || index === size; 
            }
        })}\`\`\``)]});
    }
};

/**
 * Remove all roles from specify member
 * @param {Client} client 
 * @param {Discord.GuildMember} user 
 */
module.exports.SetUnregister = (client, user) => {
    user.setNickname(`İsim | Yaş`)
    return user.roles.set([client.settings.Roles.UserRoles.UNREGISTER]);
}

/**
 * Getting penal id
 * @param {Client} client 
 */
module.exports.GetPenalID = (client) => {
    return quick.get(`penalno.${client.settings.ClientSettings.SERVER}`);
};
module.exports.GetVoiceMute = () => {
    return Penal_DB.get(`voicemute`) || [];
}

module.exports.GetChatMute = () => {
    return Penal_DB.get(`chatmute`) || [];
}
/**
 * Get Member warn point
 * @param {Discord.GuildMember} user 
 */
module.exports.GetMemberWarns = (user) => {
    var Member = user;
    return User_DB.get(`member.${Member.id}.warns`) || 0;
}
/**
 * Sending embed
 * @param {Discord.Message} message Declaring Discord.Message
 * @param {Discord.Channel} channel Message channel which you want to send embed
 * @param {Object} options {EmbedDesc, Color, IsField, FieldTitle, FieldContent, IsInline}
 */
module.exports.SendEmbed = (message, channel, options) => {
    var client               = new Client();
    var Message              = message;
    var Channel              = channel;
    var EmbedDescription     = options.EmbedDesc;
    var EmbedColor           = options.Color;
    var isField              = options.IsField;
    var FieldTitle           = options.FieldTitle;
    var FieldContent         = options.FieldContent;
    var FieldInline          = options.IsInline;
    var Thumbnail            = options.EmbedThumbnail
    var Embed                = new Discord.MessageEmbed().setColor(EmbedColor);
    
    typeof FieldInline !== "undefined" ? FieldInline : false;
    typeof Thumbnail !== "undefined" ? Thumbnail : "https://via.placeholder.com/150";
    if(isField == true) {
        if(options.IsInline == true){
            Embed.setDescription(`${EmbedDescription}`);
            Embed.addField(FieldTitle, FieldContent, FieldInline);
            Embed.setThumbnail(Thumbnail);
            Message.guild.channels.cache.get(Channel.id).send({embeds: [Embed]});
        }
        else {
            Embed.setDescription(`${EmbedDescription}`);
            Embed.addField(FieldTitle, FieldContent, FieldInline);
            Embed.setThumbnail(Thumbnail);
            Message.guild.channels.cache.get(Channel.id).send({embeds: [Embed]});
        }
    }
    else {
        Embed.setDescription(EmbedDescription);
        Embed.setThumbnail(Thumbnail);
        Message.guild.channels.cache.get(Channel.id).send({embeds: [Embed]});
    }
}

/** Penal Functions */

/**
 * Add warn to user
 * @param {Client} client Client
 * @param {Discord.Message} message Discord.Message
 * @param {Discord.GuildMember} user Discord.MemberMention
 * @param {String | String[]} reason Penal reason
 * @param {Discord.Channel} channel The channel which you want to send log message
 * @param {Discord.User} author Message author
 */
module.exports.AddWarn = (client, message, channel, user, reason, author) => {
    var Client       = client;
    var Message      = message;
    var Member       = user;
    var Channel      = channel;
    var Reason       = reason;
    var Author       = author;
    var _date        = Date.now();
    
    Penal_DB.push(`member.${Member.id}.warn`, {member: Member.id, reason: Reason, date: _date, author: Author.id})

    User_DB.add(`member.${Member.id}.warns`, 1); // add 1 warn to user
    User_DB.add(`member.${Member.id}.penalpoints`, client.settings.PointSettings.Punishment.WARNED); // add specify warn point to user
    Staff_DB.add(`points.${Author.id}.warns`, 1); // add 1 warn point to staff
    this.SendEmbed(Message, Channel, {
        EmbedDesc: `<@${Member.id}> adlı kullanıcı başarılı bir şekilde **${Reason}** sebebiyle **__[${client.moment(_date).format("LLL")}]__** tarihinde uyarı aldı.
        
        [TOPLAM UYARI] **${User_DB.fetch(`member.${Member.id}.warns`)}**`, 
        Color: Client.settings.EmbedSettings.Colors.SUCCESS_COLOR,
        EmbedThumbnail: Member.user.avatarURL({dynamic: true})
    })
}
