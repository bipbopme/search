import { formatNumber } from '../../../lib/utils';
import { Line } from 'react-chartjs-2';

function getHourName(dateTime) {
  return dateTime.toLocaleString({ hour: 'numeric' });
}

export default function WeatherHourly({ hourly, startTime }) {
  const hourlyTemps = hourly.map(h => h.temp);
  const hourlyLabels = hourly.map((h, i) => i.toString());

  return (
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
        {hourly.map((hour, i) =>
          i === 0 || i % (hourly.length / 8) === 0 ? (
            <div className="hour">
              <div className="temp">{formatNumber(hour.temp)}°</div>
              <div className="name">{getHourName(startTime.plus({ hours: i }))}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
