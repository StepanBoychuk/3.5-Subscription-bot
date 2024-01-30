const Subscription = require("./../models/Subscriptions.js");
const logger = require("./../logger.js");

const saveUserLocation = async (msg) => {
  try {
    const user = await Subscription.findOne({ chat: msg.chat.id });
    if (!user) {
      const newUser = new Subscription({
        chat: msg.chat.id,
        location: {
          lat: msg.location.latitude,
          long: msg.location.longitude,
        },
      });
      await newUser.save();
      return "Your location has been successfully saved.";
    }
    user.location.lat = msg.location.latitude;
    user.location.long = msg.location.longitude;
    await user.save();
    return "Your location has been successfully updated.";
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
    return `Your daily forecast has been changed to ${msg.text}`;
  } catch (error) {
    logger.error(error);
  }
};

const infoCommand = async (msg) => {
  try {
    const user = await Subscription.findOne({ chat: msg.chat.id });
    if (!user) {
      return "You didn't leave any information. Try /help.";
    }
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
    const user = await Subscription.findOne({ chat: msg.chat.id });
    if (!user || !user.location || !user.forecastTime) {
      return "Please, add location and time first. For more information press info or type /help";
    }
    if (user.sendForecast == false) {
      user.sendForecast = true;
      await user.save();
      return "You successfully subscribed";
    }
    if (user.sendForecast == true) {
      user.sendForecast = false;
      await user.save();
      return "You successfully unsubscibed";
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { saveUserLocation, saveForecastTime, infoCommand, subscribe };
