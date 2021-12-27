const Client            = require("../Structures/Client");
const Discord           = require('discord.js');
/**
 * Getting messageURL
 * @param {Client} client 
 * @param {Discord.Message} message 
 */
module.exports.GetMessageURL = (client, message) => {
    return `https://discord.com/channels/${client.settings.ClientSettings.SERVER}/${message.channel.id}/${message.id}`;
}

/**
 * Getting user avatarURL
 * @param {Discord.User} user 
 */
module.exports.GetUserAvatar = (user) => {
    return user.avatarURL({dynamic: true, format: 'png'});
}

/**
 * 
 * @param {Client} client
 * @param {Discord.GuildMember} user 
 * @param {String} name 
 * @param {Number} age 
 */
module.exports.RegisterUser = (client, user, name, age, gender, author) => {
    var Client          = client;
    var User_DB         = new Client.db.table('user');
    var Staff_DB        = new Client.db.table('staff');
    var Member          = user;
    var Gender          = gender;
    var Name            = name;
    var Age             = age;
    var Author          = author;
    var Datas = {
        ID: Member.id,
        name: Name,
        age: Age,
        gender: Gender,
        author: Author.id,
        date: Date.now()
    };

    try {
        if(gender == "male"){
            Member.setNickname(`${Name} | ${Age}`);
            Member.roles.push(Client.settings.Roles.UserRoles.BOY);
            User_DB.push(`member_${Member.id}.register`, Datas); // push user data to db
            User_DB.push(`member_${Member.id}.names`, {name: Name, age: Age, gender: gender, date: Date.now()}); // push new user name to names collection
            Staff_DB.add(`staff_${Author.id}.male`, 1); // add 1 girl point to staff
        }
        else if(gender == "female"){
            Member.setNickname(`${Name} | ${Age}`);
            Member.roles.set(Client.settings.Roles.UserRoles.GIRL);
            User_DB.push(`member_${Member.id}.register`, Datas); // push user data to db
            User_DB.push(`member_${Member.id}.names`, {name: Name, age: Age, gender: gender, date: Date.now()}); // push new user name to names collection
            Staff_DB.add(`staff_${Author.id}.female`, 1); // add 1 girl point to staff
        } else { 
            return;
        };
    }
    catch(err) {
        return new Error(`Bir hata oluştu: \n\`\`${err.message}\`\``);
    };
}