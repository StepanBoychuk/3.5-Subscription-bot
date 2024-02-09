const {infoResponse, subscribeResponse} = require('./handlers/messageResponseHandler.js')


const keyboard = [["Subscription", "Info"]]
const infoKeyboard = [["Set time", {text: "Change location", request_location:true}], ["Back"]]

const commands = {
    "/start" : {
        "text": "Greetings! I can send you a daily forecast every day if you subscibe to me. To get started, follow the buttons",
        "options": {
            "keyboard": [[{text: 'Send location', request_location: true, }]],
        }
    },
    "/help": {
        "text": `Here are list of available commands:\n Subscription: to subscripe/unsubscribe from daily forecast.\n Info: information about you subscription. \n Change location: to change location for your forecast. \n Set time: tip on how to set the time of the daily forecast (Just send me the message with time in hh:mm format, f.e 08:00 or 11:45)`,
        "options": {
            "keyboard": []
        }
    },
    "Set time": {
        "text": "Send the time in hh:mm format (f.e. 08:00 or 10:15) at which you would like to receive the forecast",
        "options": {
            "keyboard": [],
        }
    },
    "Subscription": {
        "text": "",
        "options": {
            "keyboard": keyboard,
            "func": subscribeResponse
        }
    },
    "Info": {
        "text": "",
        "options": {
            "keyboard": infoKeyboard,
            "func": infoResponse
        }
    },
    "Back": {
        "text": "Going back",
        "options": {
            "keyboard": keyboard
        }
    }
}

module.exports = {commands, keyboard}