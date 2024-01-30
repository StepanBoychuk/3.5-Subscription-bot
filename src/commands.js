const { infoCommand, subscribe } = require('./handlers/commandsHandler.js')

const keyboard = [['Time', {text: 'Send location', request_location: true}, "Subscription"], ['Info']]

const commands = {
    "/start" : {
        "text": "Greetings! I can send you a daily forecast every day if you subscibe to me. To confirm you subscription, please click on keyboard. For more information type /help",
        "options": {
            "keyboard": keyboard,
        }
    },
    "/help": {
        "text": `Here are list of available commands:\n Time: to set time of your daily forecast.\n Send location: will send your current location.\n Subscription: to subscripe/unsubscribe from daily forecast.\n Info: information about you subscription.`,
        "options": {
            "keyboard": keyboard
        }
    },
    "Time": {
        "text": "Send the time in hh:mm format (f.e. 08:00 or 10:15) at which you would like to receive the forecast",
        "options": {
            "keyboard": keyboard,
        }
    },
    "Subscription": {
        "text": subscribe,
        "options": {
            "keyboard": keyboard
        }
    },
    "Info": {
        "text": infoCommand,
        "options": {
            "keyboard": keyboard
        }
    }
}

module.exports = commands