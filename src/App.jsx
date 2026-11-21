import "./App.css";
import CurrentWeather from "./components/CurrentWeather";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Weather App</h1>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search city..."
          />

          <button>Search</button>

          <div className="unit-toggle">
            <button>°C</button>
            <button>°F</button>
          </div>
        </div>
      </header>

      <CurrentWeather />

      <section className="hourly-forecast">
        <h2>Next 24 Hours</h2>

        <div className="hourly-cards">
          <div className="card">09:00 • 28°C</div>
          <div className="card">12:00 • 30°C</div>
          <div className="card">15:00 • 31°C</div>
          <div className="card">18:00 • 29°C</div>
          <div className="card">21:00 • 26°C</div>
          <div className="card">00:00 • 24°C</div>
          <div className="card">03:00 • 23°C</div>
          <div className="card">06:00 • 24°C</div>
        </div>
      </section>

      <section className="daily-forecast">
        <h2>5 Day Forecast</h2>

        <div className="days">
          <div className="card">Mon 30° / 22°</div>
          <div className="card">Tue 31° / 23°</div>
          <div className="card">Wed 29° / 21°</div>
          <div className="card">Thu 28° / 20°</div>
          <div className="card">Fri 30° / 22°</div>
        </div>
      </section>

      <section className="other-cities">
        <h2>Other Cities</h2>

        <div className="cities">
          <div className="card">Lusaka 27°C</div>
          <div className="card">London 14°C</div>
          <div className="card">New York 18°C</div>
        </div>
      </section>
    </div>
  );
}

export default App;