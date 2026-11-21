import { useState } from "react";
import "./App.css";

import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import CityWeather from "./components/CityWeather";

function App() {
  const [unit, setUnit] = useState("C");
  const [city, setCity] = useState("Ndola");

  return (
    <div className="app">
      <header className="header">
        <h1>Weather App</h1>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button>Search</button>

          <div className="unit-toggle">
            <button
              className={unit === "C" ? "active-unit" : ""}
              onClick={() => setUnit("C")}
            >
              °C
            </button>

            <button
              className={unit === "F" ? "active-unit" : ""}
              onClick={() => setUnit("F")}
            >
              °F
            </button>
          </div>
        </div>
      </header>

      <CurrentWeather
        unit={unit}
        city={city}
      />

      <section className="hourly-forecast">
        <h2>Next 24 Hours</h2>
        <HourlyForecast unit={unit} />
      </section>

      <section className="daily-forecast">
        <h2>5 Day Forecast</h2>
        <DailyForecast unit={unit} />
      </section>

      <section className="other-cities">
        <h2>Other Cities</h2>
        <CityWeather unit={unit} />
      </section>
    </div>
  );
}

export default App;