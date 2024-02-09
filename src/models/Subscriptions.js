const { Schema, model } = require("mongoose");

const subscriptionSchema = new Schema({
  chat: {
    type: Number,
    // unique: true,
  },
  location: {
    lat: Number,
    long: Number,
  },
  forecastTime: {
    type: String,
  },
  sendForecast: {
    type: Boolean,
    default: false,
  },
});

const Subscription = model("Subscription", subscriptionSchema, "subscriptions");

module.exports = Subscription;
