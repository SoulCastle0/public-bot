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