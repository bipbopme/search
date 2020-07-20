import { formatNumber } from '../../../lib/utils';
import { DateTime } from 'luxon';
import WeatherDaily from './daily';
import WeatherHourly from './hourly';

export default function WeatherItem({
  location,
  time,
  forecast: { current, daily, hourly, timezone },
  units
}) {
  const startTime = DateTime.fromISO(time, { zone: timezone });
  const scale = units === 'imperial' ? 'F' : 'C';

  return (
    <div className="weatherItem">
      <div className="current">
        <h3 className="location">{location}</h3>
        <div className="status">
          {startTime.toLocaleString({ weekday: 'short', hour: 'numeric' })} •{' '}
          {current.weather[0].main}
        </div>
        <div className="details">
          <div className="temp">
            <img
              src={`/images/icons/weather/${current.weather[0].icon}.svg`}
              width="64"
              heigh="64"
            />
            {formatNumber(current.temp)}
            <span className="scale">°{scale}</span>
          </div>
          <div className="more">
            <div class="precipitation">Precipitation: {current.rain?.['1h'] || 0}%</div>
            <div class="wind">Wind: {formatNumber(current.wind_speed)} mph</div>
            <div class="humidity">Humidity: {current.humidity}%</div>
          </div>
        </div>
      </div>
      <WeatherHourly hourly={hourly} startTime={startTime} />
      <WeatherDaily daily={daily} startTime={startTime} />
    </div>
  );
}
