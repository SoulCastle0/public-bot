const Client            = require("../Structures/Client");
const Discord           = require('discord.js');
const quick             = require('quick.db');
const User_DB           = new quick.table('user');
const Staff_DB          = new quick.table('staff');
const Table             = require('table');
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
    return user.avatarURL({dynamic: true, format: 'png'});
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
            await Member.setNickname(`${Name} | ${Age}`);
            await Member.roles.set(Client.settings.Roles.UserRoles.BOY);
            await User_DB.push(`names.${Member.id}`, {name: Name, age: Age, gender: Gender, date: Date.now()});
            
            Staff_DB.add(`registers.${Author.id}.boy`, 1);
            Staff_DB.add(`registers.${Author.id}.total`, 1);
            Staff_DB.add(`points.${Author.id}.boyReg`, client.settings.PointSettings.Registry.BOY);
        };
        if(Gender == "female"){
            await Member.setNickname(`${Name} | ${Age}`);
            await Member.roles.set(Client.settings.Roles.UserRoles.GIRL);
            await User_DB.push(`names.${Member.id}`, {name: Name, age: Age, gender: Gender, date: Date.now()});

            Staff_DB.add(`registers.${Author.id}.girl`, 1);
            Staff_DB.add(`registers.${Author.id}.total`, 1);
            Staff_DB.add(`registers.${Author.id}.girlReg`, client.settings.PointSettings.Registry.GIRL);
        };
        if(Gender !== "female" || Gender !== "male"){
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
    var Titles       = [["ID", "İsim", "Yaş", "Tarih", "Önce"]];
    if(!Member){
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
    } else {
        var Names = User_DB.fetch(`names.${Member.id}`);
        Titles = Titles.concat(Names.map((val, index) => {
            var GetAgo = client.Ago.format(val.date, 'mini');
            return [ 
                `#${index + 1}`,
                `${val.name}`,
                `${val.age}`,
                `[${client.moment(val.date).format("LLL")}]`,
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
                    paddingLeft: 1,
                    alignment: "center"
                },
                4: {
                    paddingLeft: 1,
                },
                5: {
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