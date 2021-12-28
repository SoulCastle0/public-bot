/** @format */
console.clear();

/** Declaring Client */
const Client                = require('./Structures/Client');
const client                = new Client();
client.moment.locale('tr');
/** Initialize Client */
client.init(client.settings.ClientSettings.TOKEN);