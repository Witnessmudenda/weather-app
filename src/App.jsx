import { useState, useEffect, useCallback } from "react";
import "./App.css";

import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import CityWeather from "./components/CityWeather";

import {
  geocodeCity,
  fetchWeatherByCoords,
  fetchCityWeather,
} from "./services/weatherService";
import {
  processHourlyForecast,
  processDailyForecast,
} from "./utils/forecast";

const OTHER_CITY_QUERIES = ["Lusaka,ZM", "London,GB", "New York,US"];

function App() {
  const [unit, setUnit] = useState("C");
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [matchingLocations, setMatchingLocations] = useState([]);

  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [todayHighLow, setTodayHighLow] = useState({ highC: null, lowC: null });

  const [otherCities, setOtherCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load weather for a resolved location object { name, state, country, lat, lon }
  const loadWeatherForLocation = useCallback(async (location) => {
    setLoading(true);
    setError("");

    try {
      const { currentData, forecastData } = await fetchWeatherByCoords(
        location.lat,
        location.lon
      );

      const timezoneOffset = currentData.timezone ?? 0;
      const hourly = processHourlyForecast(forecastData.list, timezoneOffset);
      const { todayHighC, todayLowC, fiveDays } = processDailyForecast(
        forecastData.list,
        currentData.dt,
        timezoneOffset
      );

      setSelectedLocation(location);
      setCurrentWeather(currentData);
      setHourlyData(hourly);
      setDailyData(fiveDays);
      setTodayHighLow({ highC: todayHighC, lowC: todayLowC });
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      setError(err.message || "Failed to load weather data.");
      // R8: Never present old weather as if it belongs to a newly searched city
      setCurrentWeather(null);
      setHourlyData([]);
      setDailyData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search handler (R7)
  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();

    if (!trimmed) {
      setError("Please enter a city name before searching.");
      return;
    }

    setLoading(true);
    setError("");
    setMatchingLocations([]);

    try {
      const locations = await geocodeCity(trimmed);
      if (locations.length > 1) {
        setMatchingLocations(locations);
      }
      await loadWeatherForLocation(locations[0]);
    } catch (err) {
      setError(err.message || "City not found.");
      setCurrentWeather(null);
      setHourlyData([]);
      setDailyData([]);
      setLoading(false);
    }
  };

  // Initial load: Default city (Ndola, ZM) + 3 city summaries (R1 & R5)
  useEffect(() => {
    const initApp = async () => {
      try {
        const defaultLocations = await geocodeCity("Ndola,ZM");
        await loadWeatherForLocation(defaultLocations[0]);
      } catch (err) {
        setError(err.message || "Could not load default city weather.");
        setLoading(false);
      }

      // Fetch 3 other cities independently so one failure doesn't block the main view
      const results = await Promise.allSettled(
        OTHER_CITY_QUERIES.map((q) => fetchCityWeather(q))
      );
      const loadedCities = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
      setOtherCities(loadedCities);
    };

    initApp();
  }, [loadWeatherForLocation]);

  const handleRetry = () => {
    if (selectedLocation) {
      loadWeatherForLocation(selectedLocation);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Weather App</h1>

        <form className="search-section" onSubmit={handleSearch}>
          <input
            type="text"
            aria-label="Search city"
            placeholder="Search city (e.g., Ndola, London)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            Search
          </button>

          <div className="unit-toggle" role="group" aria-label="Temperature unit">
            <button
              type="button"
              className={unit === "C" ? "active-unit" : ""}
              aria-pressed={unit === "C"}
              onClick={() => setUnit("C")}
            >
              °C
            </button>

            <button
              type="button"
              className={unit === "F" ? "active-unit" : ""}
              aria-pressed={unit === "F"}
              onClick={() => setUnit("F")}
            >
              °F
            </button>
          </div>
        </form>

        {/* R7: Allow distinguishing cities with the same name */}
        {matchingLocations.length > 1 && (
          <div className="city-disambiguation">
            <span>Did you mean: </span>
            {matchingLocations.map((loc, idx) => (
              <button
                key={`${loc.lat}-${loc.lon}-${idx}`}
                type="button"
                onClick={() => loadWeatherForLocation(loc)}
              >
                {loc.name}
                {loc.state ? `, ${loc.state}` : ""}, {loc.country}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* R8: Loading & Error states */}
      {loading && <p className="status-message">Loading weather data...</p>}

      {error && (
        <div className="error-banner" role="alert">
          <p>{error}</p>
          <button type="button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && currentWeather && (
        <>
          <CurrentWeather
            unit={unit}
            location={selectedLocation}
            data={currentWeather}
            todayHighC={todayHighLow.highC}
            todayLowC={todayHighLow.lowC}
          />

          <section className="hourly-forecast">
            <h2>Next 24 Hours</h2>
            <HourlyForecast unit={unit} hourly={hourlyData} />
          </section>

          <section className="daily-forecast">
            <h2>5 Day Forecast</h2>
            <DailyForecast unit={unit} days={dailyData} />
          </section>
        </>
      )}

      <section className="other-cities">
        <h2>Other Cities</h2>
        <CityWeather unit={unit} cities={otherCities} />
      </section>

      <footer className="footer">
        <p>
          Weather data provided by{" "}
          <a
            href="https://openweathermap.org"
            target="_blank"
            rel="noreferrer"
          >
            OpenWeather
          </a>
          {lastUpdated ? ` • Last updated at ${lastUpdated}` : ""}
        </p>
      </footer>
    </div>
  );
}

export default App;
