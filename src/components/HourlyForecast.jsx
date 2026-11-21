import { formatTemp } from "../utils/temperature";

const ICON_BASE = "https://openweathermap.org" + "/img/wn/";

function HourlyForecast({ unit, hourly = [] }) {
  if (!hourly || !hourly.length) {
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
            src={`${ICON_BASE}${item.icon}.png`}
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
