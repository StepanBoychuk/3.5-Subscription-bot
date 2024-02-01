const Subscription = require("./../models/Subscriptions.js");
const logger = require("./../logger.js");

const saveUserLocation = async (msg) => {
  try {
    let user = await Subscription.findOne({ chat: msg.chat.id });
    if (!user) {
      user = new Subscription({});
    }
    user.chat = msg.chat.id;
    user.location = {
      lat: msg.location.latitude,
      long: msg.location.longitude,
    };
    await user.save();
  } catch (error) {
    logger.error(error);
  }
};

const saveForecastTime = async (msg) => {
  try {
    const user = await Subscription.findOne({ chat: msg.chat.id });
    if (!user) {
      const newUser = new Subscription({
        chat: msg.chat.id,
        forecastTime: msg.text,
      });
      await newUser.save();
      return `Your daily forecast is set for ${msg.text}`;
    }
    user.forecastTime = msg.text;
    await user.save();
    return `Your daily forecast time has been changed to ${msg.text}`;
  } catch (error) {
    logger.error(error);
  }
};

const infoCommand = async (msg) => {
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
  }
};

const subscribe = async (msg) => {
  try {
    let user = await Subscription.findOne({ chat: msg.chat.id });
    user.sendForecast = !user.sendForecast
    await user.save();
    return user.sendForecast ? "You successfully subscribed": "You successfully unsubscribed"
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { saveUserLocation, saveForecastTime, infoCommand, subscribe };
