const { readdirSync } = require('fs');
const Discord = require('discord.js');
const ascii   = require('ascii-table');
const Client = require('../Structures/Client');
const table   = new ascii('Command Handler');
table.setHeading(`Command`, `Status`);

/**
 * 
 * @param {Client} client 
 * @param {Discord} Discord 
 */
module.exports = (client, Discord) => {
   const CommandsFolder = readdirSync(`./Commands`);
   for(let folder of CommandsFolder){
      const CommandFiles = readdirSync(`./Commands/${folder}`).filter(Filter => Filter.endsWith('.js'));

      for(let file of CommandFiles){
         const command = require(`../Commands/${folder}/${file}`);
         client.commands.set(command.name, command);
         if(command){
            table.addRow(command.name, ` -> Success`);
         }
         else {
            table.addRow(command.name, ` -> Error`);
         }
      }
   }
   console.log(table.toString());
}