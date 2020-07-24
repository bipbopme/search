import axios from 'axios';
import { memoize } from '../../redis';
import pick from 'lodash/pick';

const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

async function getWeatherGeo(location) {
  const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: location,
      appid: OPEN_WEATHER_KEY
    }
  });

  return pick(response.data, ['id', 'name', 'coord']);
}

const getWeatherGeoCached = memoize(getWeatherGeo);

async function getForecast(lat, lon, units = 'metric') {
  const forecast = (
    await axios.get('https://api.openweathermap.org/data/2.5/onecall', {
      params: {
        lat,
        lon,
        exclude: 'minutely',
        appid: OPEN_WEATHER_KEY,
        units
      }
    })
  ).data;

  // Only include the last 24 hours and simplify
  forecast.hourly = forecast.hourly.slice(0, 24).map(h => pick(h, ['temp', 'weather']));

  // Simplify results
  forecast.daily = forecast.daily.map(d => pick(d, ['temp', 'weather']));

  return forecast;
}

const getForecastCached = memoize(getForecast, 10 * 60);

function getWeatherLocationWithCountry(weatherLocation, geo) {
  if (weatherLocation.split(',').length < 3) {
    return `${weatherLocation}, ${geo.country}`;
  } else {
    return weatherLocation;
  }
}

async function getResult({ geo, weatherLocation }) {
  // TODO: This should be based on locale settings rather than geo
  const units = geo.country === 'US' ? 'imperial' : 'metric';
  let lat, lon;

  if (weatherLocation) {
    const weatherGeo = await getWeatherGeoCached(
      getWeatherLocationWithCountry(weatherLocation, geo)
    );
    lat = weatherGeo.coord.lat;
    lon = weatherGeo.coord.lon;
  } else {
    weatherLocation = geo.displayName;
    lat = geo.ll[0];
    lon = geo.ll[1];
  }

  const forecast = await getForecastCached(lat, lon, units);

  return {
    result: {
      id: `weather-${lat}-${lon}`,
      insertIndex: 0,
      ignoreIsNavigational: true,
      type: 'weather',
      forecast,
      location: weatherLocation,
      time: new Date(),
      units
    }
  };
}

async function handleQueryMatch({ geo }) {
  return getResult({ geo });
}

async function handleResultMatch({ geo, patternMatch }) {
  return getResult({ geo, weatherLocation: patternMatch[1] });
}

async function handleIntentMatch({ intent }) {
  const where = intent.slots['B-Place']?.join(' ') || 'your current location';
  const when = intent.slots['B-When']?.join(' ') || 'today';

  return {
    answer: {
      title: 'Weather Intent Demo',
      subtitle: `you want the weather forecast for ${when} in ${where}?`
    }
  };
}

export default {
  name: 'Weather (Answer)',
  description: 'Weather forecasts.',
  matches: [
    {
      query: {
        pattern: /^weather(\s(today|tomorrow|this week))?$/i,
        onMatch: handleQueryMatch
      }
    },
    {
      result: {
        namePattern: /^(.*?) (Weather Forecast and Conditions|10-Day Weather Forecast|Three Day Weather Forecast)/i,
        onMatch: handleResultMatch
      }
    },
    {
      intent: {
        name: 'weather',
        onMatch: handleIntentMatch
      }
    }
  ],
  shouldMatchQueries: ['weather in san francisco'],
  shouldNotMatchQueries: ['']
};
