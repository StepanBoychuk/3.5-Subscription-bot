require("dotenv").config();
const logger = require("./src/logger");
const telegramBot = require("node-telegram-bot-api");
const commands = require("./src/commands");
const mongoose = require("mongoose");
const cron = require("node-cron");
const Subscription = require("./src/models/Subscriptions.js");
const weatherForecastHandler = require("./src/handlers/weatherForecastHandler.js");
const {
  saveUserLocation,
  saveForecastTime,
} = require("./src/handlers/commandsHandler.js");

const token = process.env.TELEGRAM_TOKEN;

const bot = new telegramBot(token, { polling: true });

bot.on("polling_error", logger.error);

bot.on("location", async (msg) => {
  bot.sendMessage(msg.chat.id, await saveUserLocation(msg));
});

bot.on("text", async (msg) => {
  if (commands[msg.text]) {
    if (typeof commands[msg.text].text == "function") {
      return bot.sendMessage(msg.chat.id, await commands[msg.text].text(msg), {
        reply_markup: {
          keyboard: commands[msg.text].options.keyboard,
        },
      });
    }
    return bot.sendMessage(msg.chat.id, await commands[msg.text].text, {
      reply_markup: {
        keyboard: commands[msg.text].options.keyboard,
      },
    });
  }
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  if (timeRegex.test(msg.text)) {
    return bot.sendMessage(msg.chat.id, await saveForecastTime(msg));
  }
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
  .catch((error) => console.error(error))
  .then(() => console.log("MongoDB connected"));
