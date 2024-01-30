const getForecast = require("../getWeatherForecast");

const getWindDirection = (degrees) => {
  const direction = [
    "North",
    "Northeast",
    "East",
    "Southeast",
    "South",
    "Southwest",
    "West",
    "Northwest",
  ];
  const index = Math.round(degrees / 45) % 8;
  return direction[index];
};

const formatTime = (Unix_timestap, timezone_offset) => {
  const date = new Date((Unix_timestap + timezone_offset) * 1000);
  return date.toLocaleTimeString("en-US");
};

const weatherForecastHandler = async (lat, long) => {
  const weatherData = await getForecast(lat, long);
  if (!weatherData) {
    return "Oops, something went wrong.";
  }
  const todaysWeather = weatherData.data.daily[0];
  const formattedText = `
    Greetings! Here's your weather forecast for today:\n
    - Sunrise: ${formatTime(
      todaysWeather.sunrise,
      weatherData.data.timezone_offset
    )}
    - Sunset: ${formatTime(
      todaysWeather.sunset,
      weatherData.data.timezone_offset
    )}
    - Moonrise: ${formatTime(
      todaysWeather.moonrise,
      weatherData.data.timezone_offset
    )}
    - Moonset: ${formatTime(
      todaysWeather.moonset,
      weatherData.data.timezone_offset
    )}
    - Summary: ${todaysWeather.summary}
    During the day temperature will range from ${todaysWeather.temp.min}℃ to ${
    todaysWeather.temp.max
  }℃
    - In the morning ${todaysWeather.temp.morn}℃ (Feels like ${
    todaysWeather.feels_like.morn
  }℃)
    - By day ${todaysWeather.temp.day}℃ (Feels like ${
    todaysWeather.feels_like.day
  }℃)
    - In the evening ${todaysWeather.temp.eve}℃ (Feels like ${
    todaysWeather.feels_like.eve
  }℃)
    - At night ${todaysWeather.temp.night}℃ (Feels like ${
    todaysWeather.feels_like.night
  }℃) \n
    - Pressure: ${todaysWeather.pressure}hPa
    - Humidity: ${todaysWeather.humidity}%
    - Dew point: ${todaysWeather.dew_point}℃
    - Wind speed: ${todaysWeather.wind_speed} m/s
    - Wind direction: ${todaysWeather.wind_deg}° (${getWindDirection(
    todaysWeather.wind_deg
  )})
    - Wind gust: ${todaysWeather.wind_gust}
    - Clouds cover: ${todaysWeather.clouds}%
    - UV index: ${todaysWeather.uvi}
    - Probability of precipitation: ${todaysWeather.pop * 100}% \n
    Weather conditions: \n
    - Main weather: ${todaysWeather.weather[0].main}
    - Description: ${todaysWeather.weather[0].description}
    `;
  return formattedText;
};

module.exports = weatherForecastHandler;
