import { formatTemp } from "../utils/temperature";

function HourlyForecast({ unit, hourly = [] }) {
  if (!hourly.length) {
    return <p>Hourly forecast unavailable.</p>;
  }

  return (
    <div className="hourly-cards">
      {hourly.map((item) => (
        <div key={item.dt} className="hour-card">
          {item.dateLabel && (
            <span className="date-badge">{item.dateLabel}</span>
          )}
          <h3>{item.time}</h3>
          <img
            src={`https://openweathermap.org{item.icon}.png`}
            alt={item.status}
          />
          <p className="status-text">{item.status}</p>
          <p>{formatTemp(item.tempC, unit)}</p>
        </div>
      ))}
    </div>
  );
}

export default HourlyForecast;
