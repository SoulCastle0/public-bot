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
    else if(!Member){
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
    else if(!User_DB.fetch(`names.${Member.id}`)){
        Embed.setDescription(`Kayıt oluşturulurken bir hata oluştu. [\`\`${client.errormsg.Message.NO_NAMEDATA}\`\`]`)
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
 * Add penal to user
 * @param {Client} client Discord.Client
 * @param {Discord.Message} message Discord.Message
 * @param {Number} penalid penalid
 * @param {Discord.GuildMember} member Discord.GuildMember
 * @param {Discord.User} author message.author
 * @param {String} type type of penal
 * @param {String} reason reason of penal
 * @param {Number} time time of penal
 * @param {Number} throwntime thrown of time
 * @param {Number} endtime end of time
 * @param {String} datatype type of data    
 */
module.exports.AddPenal = (client, message, penalid, member, author, type, reason, time, throwntime, endtime, datatype) => {
    var Penal_ID    = penalid;
    var Member      = member;
    var Author      = author;
    var Type        = type;
    var Reason      = reason;
    var Time        = time;
    var ThrownTime  = throwntime;
    var EndTime     = endtime;
    var DataType    = datatype;
    var Message     = message;
    var Embed       = new Discord.MessageEmbed();
    var Warn_Log    = client.guilds.cache.get(client.settings.ClientSettings.SERVER).channels.cache.get(client.settings.Channels.LogChannels.WARN_LOG);
    var Ban_Log     = client.guilds.cache.get(client.settings.ClientSettings.SERVER).channels.cache.get(client.settings.Channels.LogChannels.BAN_LOG);
    var Jail_Log    = client.guilds.cache.get(client.settings.ClientSettings.SERVER).channels.cache.get(client.settings.Channels.LogChannels.JAIL_LOG);
    var Mute_Log    = client.guilds.cache.get(client.settings.ClientSettings.SERVER).channels.cache.get(client.settings.Channels.LogChannels.MUTE_LOG);

    var PenalDATA   = {
        ID           : Penal_ID,
        Active       : true,
        Member       : Member.id,
        Author       : Author.id,
        Type         : Type,
        Reason       : Reason,
        ThrownTime   : ThrownTime,
        EndTime      : EndTime,
        RemovedBy    : "İşlem yok",
        Date         : Date.now() 
    };
    User_DB.set(`penal.${Penal_ID}`, PenalDATA);
    User_DB.push(`member.${Member.id}.penals`, PenalDATA);

    switch (DataType) {
        case "warn":
            User_DB.add(`member.${Member.id}.warnpoint`, client.settings.PointSettings.Punishment.WARNED);
            User_DB.add(`member.${Member.id}.penalpoints`, client.settings.PointSettings.Punishment.WARNED);
            Penal_DB.push(DataType, {id: Member.id, ID: Penal_ID, EndTime: Date.now() + ms(Time)})
            Staff_DB.add(`points.${Author.id}.warns`, 1);
            Embed.setDescription(`${Member} adlı kullanıcı **uyarıldı**.

            **[YETIKLI]** ${Author} (\`\`${Author.id}\`\`)
            **[UYARILAN]** ${Member} (\`\`${Member.id}\`\`)

            **[SEBEP]** ${Reason}
            **[TARIH]** **${client.moment(Date.now()).format("LLL")}**
            `)
            Embed.setColor(client.settings.EmbedSettings.Colors.SUCCESS_COLOR);
            Warn_Log.send({embeds: [Embed]});
            Message.channel.send({embeds: [Embed]}).then((msg) => {
                if(msg.deletable){
                    setTimeout(() => {
                        msg.delete();
                    }, 7000);
                }
            })
            break;
        case "chatmute": 
            User_DB.add(`member.${Member.id}.penalpoints`, client.settings.PointSettings.Punishment.CHAT_MUTED);
            User_DB.add(`member.${Member.id}.chatmute`, 1);
            Penal_DB.push(`chatmute`, {id: Member.id, ID: Penal_ID, EndTime: Date.now() + ms(Time)})
            Staff_DB.add(`points.${Author.id}.chatmutes`, 1)
            break;
        case "voicemute": 
            User_DB.add(`member.${Member.id}.penalpoints`, client.settings.PointSettings.Punishment.VOICE_MUTED);
            User_DB.add(`member.${Member.id}.voicemute`, 1);
            Penal_DB.push(`voicemute`, {id: Member.id, ID: Penal_ID, EndTime: Date.now() + ms(Time)})
            Staff_DB.add(`points.${Author.id}.voicemutes`, 1)
            break;
        default:
           break;
    }
    quick.add(`penalno.${client.settings.ClientSettings.SERVER}`, 1);
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

