/** @format */
console.clear();

const quick                 = require('quick.db');
const Discord               = require("discord.js");
const Client                = require('./Structures/Client');
const client                = new Client();

client.init(client.settings.ClientSettings.TOKEN);