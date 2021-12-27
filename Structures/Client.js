const Discord           = require('discord.js');
const intents           = new Discord.Intents(32767);
const quick             = require('quick.db');
class Client extends Discord.Client {
    constructor(){
        super({intents});

        /** Collections */
        this.commands           = new Discord.Collection();
        this.cooldowns          = new Discord.Collection();
        
        /** Database */
        this.db                 = quick;
        this.functions          = require('../Util/Functions');
        /** Utils */
        this.animation          = require('chalkercli');
        
        /** JSON Files */
        this.settings           = require('../Settings/settings.json');
        this.errorCodes         = require('../Settings/errorCodes.json')
        this.specialEmojis      = require('../Settings/emojis.json');
    }
    async init(token){
        /** Handling Commands&Events */
        ['CommandHandler', 'EventHandler'].forEach(Handler => {
            require(`../Handlers/${Handler}`)(this, Discord);
        })

        /** Login Client */
        this.login(token);
    }
}

module.exports = Client;