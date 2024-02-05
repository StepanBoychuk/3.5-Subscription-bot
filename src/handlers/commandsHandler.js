const Subscription = require("./../models/Subscriptions.js");

const saveUserLocation = async (msg) => {
  let user = await Subscription.findOne({ chat: msg.chat.id });
  if (!user) {
    user = new Subscription({});
  }
  user.chat = msg.chat.id;
  user.location = {
    lat: msg.location.latitude,
    long: msg.location.longitude,
  };
  return await user.save();
};

const saveForecastTime = async (msg) => {
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
  return await user.save();
};

const subscribe = async (msg) => {
  let user = await Subscription.findOne({ chat: msg.chat.id });
  user.sendForecast = !user.sendForecast;
  return await user.save();
};

module.exports = { saveUserLocation, saveForecastTime, subscribe };
