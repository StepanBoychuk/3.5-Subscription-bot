const logger = require("./../logger");
const {
  saveUserLocation,
  saveForecastTime,
  subscribe,
} = require("./commandsHandler");
const Subscription = require("./../models/Subscriptions.js");

const locationResponse = async (msg) => {
  try {
    await saveUserLocation(msg);
    return "Your location has been saved";
  } catch (error) {
    logger.error(error);
    return "Oops! Something wrong. Please, try again later";
  }
};

const timeResponse = async (msg) => {
  try {
    await saveForecastTime(msg);
    return `Your daily forecast time is set to ${msg.text}`;
  } catch (error) {
    logger.error(error);
    return "Oops! Something wrong. Please, try again later";
  }
};

const infoResponse = async (msg) => {
  try {
    const user = await Subscription.findOne({ chat: msg.chat.id });
    let isSubscribe = "You are not subscribed to daily forecast";
    if (user.sendForecast == true) {
      isSubscribe = "You are subscribed to daily forecast";
    }
    return `
      Location: 
      latitude: ${user.location.lat}
      longitude: ${user.location.long} \n
      Daily forecast time: ${user.forecastTime}
      Subscription: ${isSubscribe}
      `;
  } catch (error) {
    logger.error(error);
    return "Oops! Something wrong. Please, try again later";
  }
};

const subscribeResponse = async (msg) => {
  try {
    const user = await Subscription.findOne({ chat: msg.chat.id });
    if (user?.location?.lat && user.forecastTime) {
      await subscribe(msg);
      return user.sendForecast
        ? "You successfully unsubscribed"
        : "You successfully subscribed";
    }
    return "Set your location and daily forecast time first.";
  } catch (error) {
    logger.error(error);
    return "Oops! Something wrong. Please, try again later";
  }
};

module.exports = {
  locationResponse,
  timeResponse,
  infoResponse,
  subscribeResponse,
};
