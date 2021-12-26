
const Discord = require('discord.js');
const Client = require('../../Structures/Client');

module.exports = {
    name: 'ready',
    /**
     * @param {Client} client
     * @param {Discord} Discord
     */
    async run(client, Discord){
        client.animation.rainbow(`[BOT HAZIR]:\t${client.user.tag}`);
        client.user.setActivity(`ejs 💚  404`, {type: 'STREAMING', url: 'https://twitch.tv/elraenn'});
    }
}