const Client            = require("../Structures/Client");
const Discord           = require('discord.js');
const quick             = require('quick.db');

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
 * 
 * @param {Client} client
 * @param {Discord.GuildMember} user 
 * @param {String} name 
 * @param {Number} age 
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
            await quick.push(`names.${Member.id}`, {name: Name, age: Age, gender: Gender, date: Date.now()});
            
            quick.add(`staff.${Author.id}.boy`, 1);
            quick.add(`staff.${Author.id}.total`, 1);
            quick.add(`staff_point.${Author.id}.boyReg`, client.settings.PointSettings.Registry.BOY);
        };
        if(Gender == "female"){
            await Member.setNickname(`${Name} | ${Age}`);
            await Member.roles.set(Client.settings.Roles.UserRoles.GIRL);
            await quick.push(`names.${Member.id}`, {name: Name, age: Age, gender: Gender, date: Date.now()});


            quick.add(`staff.${Author.id}.girl`, 1);
            quick.add(`staff.${Author.id}.total`, 1);
            quick.add(`staff_point.${Author.id}.girlReg`, client.settings.PointSettings.Registry.GIRL);
        };
        if(Gender !== "female" || Gender !== "male"){
            return;
        }
    }
    catch(err) {
        return new Error(`Bir hata oluştu: \n\`\`${err.message}\`\``);
    };
};