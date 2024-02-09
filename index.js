require("dotenv").config();
const logger = require("./src/logger");
const telegramBot = require("node-telegram-bot-api");
const { commands, keyboard } = require("./src/commands");
const mongoose = require("mongoose");
const cron = require("node-cron");
const Subscription = require("./src/models/Subscriptions.js");
const weatherForecastHandler = require("./src/handlers/weatherForecastHandler.js");
const {
  locationResponse,
  timeResponse,
} = require("./src/handlers/messageResponseHandler.js");

const token = process.env.TELEGRAM_TOKEN;

const bot = new telegramBot(token, { polling: true });

bot.on("polling_error", logger.error);

bot.on("location", async (msg) => {
  const user = await Subscription.findOne({ chat: msg.chat.id });
  let keyboardButton = keyboard;
  if (!user) {
    keyboardButton = [["Set time"]];
  }
  bot.sendMessage(msg.chat.id, await locationResponse(msg), {
    reply_markup: {
      keyboard: keyboardButton,
    },
  });
});

bot.on("text", async (msg) => {
  if (commands[msg.text]) {
    if (commands[msg.text].options.func) {
      return bot.sendMessage(
        msg.chat.id,
        await commands[msg.text].options.func(msg),
        {
          reply_markup: {
            keyboard: commands[msg.text].options.keyboard,
          },
        }
      );
    }
    return bot.sendMessage(msg.chat.id, commands[msg.text].text, {
      reply_markup: {
        keyboard: commands[msg.text].options.keyboard,
      },
    });
  }
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  if (timeRegex.test(msg.text)) {
    return bot.sendMessage(msg.chat.id, await timeResponse(msg), {
      reply_markup: {
        keyboard: keyboard,
      },
    });
  }
  return bot.sendMessage(msg.chat.id, "Unexpected command. Try /help.")
});

cron.schedule("* * * * *", async () => {
  const currentTime = new Date()
    .toLocaleTimeString("en-US", { hour12: false })
    .slice(0, 5);
  const users = await Subscription.find({ forecastTime: currentTime });
  if (users[0]) {
    users.forEach(async (user) => {
      if (user.sendForecast == true) {
        bot.sendMessage(
          user.chat,
          await weatherForecastHandler(user.location.lat, user.location.long)
        );
      }
    });
  }
});

mongoose
  .connect(
    `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  )
  .catch((error) => logger.error(error))
  .then(() => console.log("MongoDB connected"));
