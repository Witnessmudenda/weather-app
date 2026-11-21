import { formatTemp } from "../utils/temperature";

const ICON_BASE = "https://openweathermap.org" + "/img/wn/";

function CityWeather({ unit, cities = [] }) {
  if (!cities || !cities.length) {
    return <p>Loading city summaries...</p>;
  }

  return (
    <div className="city-weather">
      {cities.map((item, index) => {
        const name = item.location?.name || item.currentData?.name;
        const country =
          item.location?.country || item.currentData?.sys?.country || "";
        const tempC = item.currentData?.main?.temp;
        const weatherInfo = item.currentData?.weather?.[0] || {};
        const status = weatherInfo.main || "Unavailable";
        const iconUrl = weatherInfo.icon
          ? `${ICON_BASE}${weatherInfo.icon}.png`
          : null;

        return (
          <div key={`${name}-${country}-${index}`} className="city-card">
            <h3>
              {name}
              {country ? `, ${country}` : ""}
            </h3>

            {iconUrl && <img src={iconUrl} alt={status} />}

            <p className="city-temp">{formatTemp(tempC, unit)}</p>

            <p className="city-status">{status}</p>
          </div>
        );
      })}
    </div>
  );
}

export default CityWeather;
