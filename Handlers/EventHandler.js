const { readdirSync } = require('fs');
const Discord = require('discord.js')
const ascii    = require('ascii-table');
const Client = require('../Structures/Client');
const table   = new ascii('Event Handler');
table.setHeading(`Event`, `Status`);

/**
 * 
 * @param {Client} client 
 * @param {Discord} Discord 
 */
module.exports = (client, Discord) => {
   const EventFolders = readdirSync('./Events');
   for(let folder of EventFolders){
      const EventFiles = readdirSync(`./Events/${folder}`).filter(Filter => Filter.endsWith('.js'));

      for(let file of EventFiles){
         const event = require(`../Events/${folder}/${file}`);

         if(event.once){
            client.once(event.name, (...args) => event.run(...args, client, Discord));
         }
         else {
            client.on(event.name, (...args) => event.run(...args, client, Discord));
         }
         table.addRow(event.name, ` -> Success`);
      }
   }
   console.log(table.toString())
}