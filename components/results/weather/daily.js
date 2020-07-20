import { formatNumber } from '../../../lib/utils';

export default function WeatherDaily({ daily, startTime }) {
  return (
    <div className="days">
      {daily.map((day, i) => (
        <div className="day">
          <div className="name">
            {startTime.plus({ days: i }).toLocaleString({ hour: 'numeric' })}
          </div>
          <div className="icon">
            <img src={`/images/icons/weather/${day.weather[0].icon}.svg`} height="32" width="32" />
          </div>
          <div className="high">{formatNumber(day.temp.day)}°</div>
          <div className="low">{formatNumber(day.temp.night)}°</div>
        </div>
      ))}
    </div>
  );
}
