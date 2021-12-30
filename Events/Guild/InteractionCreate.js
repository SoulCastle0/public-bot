const Discord = require('discord.js');
const Client = require('../../Structures/Client');
module.exports = {
    name: 'interactionCreate',
    /**
     * interactionCreate event
     * @param {Discord.Interaction} interaction
     */
    async run(interaction){
        // if(interaction.isSelectMenu()){
        //     await interaction.deferUpdate();
        //     interaction.channel.send({
        //         content: `${interaction.values[0]} seçtin`
        //     })
        // }
    }
};