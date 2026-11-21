import { formatTemp, formatWindSpeed } from "../utils/temperature";
import { formatCityDateTime } from "../utils/forecast";

const ICON_BASE = "https://openweathermap.org" + "/img/wn/";

function CurrentWeather({ unit, location, data, todayHighC, todayLowC }) {
  if (!data) return null;

  const cityName = location?.name || data.name;
  const country = location?.country || data.sys?.country || "";
  const state = location?.state ? `, ${location.state}` : "";

  const weatherInfo = data.weather?.[0] || {};
  const description = weatherInfo.description
    ? weatherInfo.description.charAt(0).toUpperCase() +
      weatherInfo.description.slice(1)
    : "Unavailable";

  const iconUrl = weatherInfo.icon
    ? `${ICON_BASE}${weatherInfo.icon}@2x.png`
    : null;

  const localDateTime = formatCityDateTime(data.dt, data.timezone ?? 0);

  return (
    <div className="current-weather">
      <h2>
        {cityName}
        {state}
        {country ? `, ${country}` : ""}
      </h2>

      <p className="local-time">{localDateTime}</p>

      {iconUrl && (
        <img
          src={iconUrl}
          alt={description}
          className="weather-icon"
        />
      )}

      <div className="temperature">
        {formatTemp(data.main?.temp, unit)}
      </div>

      <p>{description}</p>

      <p>Wind: {formatWindSpeed(data.wind?.speed, unit)}</p>

      <p>
        High: {formatTemp(todayHighC, unit)} | Low:{" "}
        {formatTemp(todayLowC, unit)}
      </p>
    </div>
  );
}

export default CurrentWeather;
