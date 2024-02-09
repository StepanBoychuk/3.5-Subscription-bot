require("dotenv").config();
const logger = require("./logger");
const axios = require("axios");

const getForecast = async (lat, long) => {
  try {
    const weatherForecast = await axios.get(
      "https://api.openweathermap.org/data/3.0/onecall",
      {
        params: {
          appid: process.env.WEATHER_API_KEY,
          lat: lat,
          lon: long,
          units: "metric",
        },
      }
    );
    return weatherForecast;
  } catch (error) {
    logger.error(error);
  }
};

module.exports = getForecast;
