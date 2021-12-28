const Discord           = require('discord.js');
const intents           = new Discord.Intents(32767);
const quick             = require('quick.db');
const TimeAgo                = require('javascript-time-ago').default;
const tr_TR                  = require('javascript-time-ago/locale/tr.json');
TimeAgo.addDefaultLocale(tr_TR);
class Client extends Discord.Client {
    constructor(){
        super({intents});

        /** Collections */
        this.commands           = new Discord.Collection();
        this.cooldowns          = new Discord.Collection();
        
        /** Database & Utils*/
        this.db                 = quick;
        this.functions          = require('../Util/Functions');
        this.moment             = require('moment');
        this.Ago                = new TimeAgo('tr-TR')
        /** Utils */
        this.animation          = require('chalkercli');
        
        /** JSON Files */
        this.settings           = require('../Settings/settings.json');
        this.errormsg         = require('../Settings/errorMessages.json')
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