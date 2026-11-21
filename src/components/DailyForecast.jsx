import { formatTemp } from "../utils/temperature";

const ICON_BASE = "https://openweathermap.org" + "/img/wn/";

function DailyForecast({ unit, days = [] }) {
  if (!days || !days.length) {
    return <p>Five-day forecast unavailable.</p>;
  }

  return (
    <div className="daily-cards">
      {days.map((day) => (
        <div key={day.dateKey} className="day-card">
          <h3>{day.dayLabel}</h3>

          {day.icon && (
            <img
              src={`${ICON_BASE}${day.icon}.png`}
              alt={day.status}
            />
          )}

          <p className="status-text">{day.status}</p>

          <p>
            {formatTemp(day.maxC, unit)} / {formatTemp(day.minC, unit)}
          </p>

          {day.isPartial && (
            <small className="partial-label">Partial forecast</small>
          )}
        </div>
      ))}
    </div>
  );
}

export default DailyForecast;
