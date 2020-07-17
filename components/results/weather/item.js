import { DateTime } from 'luxon';
import { Line } from 'react-chartjs-2';

function formatNumber(number, maximumFractionDigits = 0) {
  return number.toLocaleString(undefined, {
    maximumFractionDigits: maximumFractionDigits
  });
}

function getHourName(dateTime) {
  return dateTime.toFormat('h a');
}

export default function WeatherItem({ location, time, forecast: { current, daily, hourly } }) {
  const hourlySliced = hourly.slice(0, 24);
  const now = DateTime.fromISO(time);
  const hourlyTemps = hourlySliced.map(h => h.temp);
  const hourlyLabels = hourlySliced.map((h, i) => i.toString());

  return (
    <div className="weatherItem">
      <div className="current">
        <h3 className="location">{location}</h3>
        <div className="status">
          {now.toFormat('EEEE h a')} • {current.weather[0].main}
        </div>
        <div className="details">
          <div className="temperature">
            <img
              src={`/images/icons/weather/${current.weather[0].icon}.svg`}
              width="64"
              heigh="64"
            />
            {formatNumber(current.temp)}°
          </div>
          <div className="more">
            <div class="precipitation">Precipitation: {current.rain?.['1h'] || 0}%</div>
            <div class="wind">Wind: {formatNumber(current.wind_speed)} mph</div>
            <div class="humidity">Humidity: {current.humidity}%</div>
          </div>
        </div>
      </div>
      <div className="hourly">
        <div className="chart">
          <Line
            labels={hourlyLabels}
            data={{
              labels: hourlyLabels,
              datasets: [
                {
                  backgroundColor: '#f1f1f1',
                  borderCapStyle: 'round',
                  borderColor: '#ccc',
                  borderWidth: 2,
                  data: hourlyTemps
                }
              ]
            }}
            options={{
              legend: { display: false },
              scales: {
                xAxes: [{ display: false }],
                yAxes: [{ display: false }]
              },
              elements: {
                point: {
                  radius: 0
                }
              },
              tooltips: { enabled: false },
              hover: { mode: null },
              maintainAspectRatio: false
            }}
            height={75}
          />
        </div>
        <div className="hours">
          {hourlySliced.map((hour, i) =>
            i === 0 || i % (hourlySliced.length / 8) === 0 ? (
              <div className="hour">
                <div className="temp">{formatNumber(hour.temp)}°</div>
                <div className="name">{getHourName(now.plus({ hours: i }))}</div>
              </div>
            ) : null
          )}
        </div>
      </div>
      <div className="days">
        {daily.map((day, i) => (
          <div className="day">
            <div className="name">{now.plus({ days: i }).toFormat('ccc')}</div>
            <div className="icon">
              <img
                src={`/images/icons/weather/${day.weather[0].icon}.svg`}
                height="32"
                width="32"
              />
            </div>
            <div className="high">{formatNumber(day.temp.day)}°</div>
            <div className="low">{formatNumber(day.temp.night)}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}
