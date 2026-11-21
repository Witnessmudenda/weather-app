# Weather App

A responsive React + Vite weather application that retrieves live current conditions, a 24-hour forecast, a 5-day forecast, and global city weather summaries from the OpenWeather API.

## Student Information

- **Name:** Witness Mudenda
- **Student ID:** 2521886
- **Institution:** Zambia University College of Technology (ZUT)

## Project Links

- **Live Demo URL:** https://vercel.app
- **GitHub Repository URL:** https://github.com

## Technology Stack

- **Frontend Framework:** React 18 with Vite
- **Styling:** CSS3 (Responsive Grid, Flexbox, and media queries)
- **HTTP Client:** Native Fetch API
- **External APIs:** OpenWeather Geocoding API (`/geo/1.0/direct`), Current Weather API (`/data/2.5/weather`), and 5-Day / 3-Hour Forecast API (`/data/2.5/forecast`)
- **Version Control & Hosting:** Git, GitHub, and Vercel

## Implemented Features

- **Default Location Load:** Automatically loads current weather and forecasts for **Ndola, Zambia** on initial page load.
- **Current Weather Display:** Shows city, region/country, local date and time, weather icon, description, wind speed with units (`km/h` or `mph`), and today's estimated high/low temperatures (labelled `Unavailable` if no forecast intervals remain today).
- **Upcoming 24-Hour Forecast:** Displays the next 8 consecutive 3-hour intervals with local times, icons, status labels, temperatures, and date badges whenever the timeline starts or crosses midnight.
- **Five-Day Forecast:** Displays 5 distinct local calendar dates starting today with daily min/max temperatures, dominant weather status, and a `Partial forecast` label whenever fewer than 8 three-hour intervals are available for a day.
- **City Summaries:** Displays live current temperature, icon, and weather status for three additional global cities (**Lusaka, ZM**, **London, GB**, and **New York, US**).
- **Temperature Unit Switching:** Toggle between Celsius (`°C`) and Fahrenheit (`°F`) with clear active-state styling, dynamically updating all current, hourly, daily, and summary temperatures without refetching.
- **City Search & Disambiguation:** Resolves user queries via geocoding, displays region/country options when multiple cities share a name, rejects empty searches, and reports clear feedback when a city is not found.
- **Request Feedback & Error Recovery:** Displays a loading indicator during fetches, clears stale weather data on error so old data is never misattributed to a new search, and provides a **Retry** button.

## Installation & Local Run Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com.git
   cd weather-app
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to a new file named `.env` in the project root:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and replace the placeholder with your OpenWeather API key:
     ```env
     VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
     ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open the local URL printed in the terminal (typically `http://localhost:5173`).

## API Configuration (Local & Deployed)

- **Local Environment:** Vite loads `VITE_OPENWEATHER_API_KEY` from the gitignored `.env` file via `import.meta.env.VITE_OPENWEATHER_API_KEY`. A template `.env.example` file is committed to the repository for reference.
- **Deployed Environment (Vercel):** `VITE_OPENWEATHER_API_KEY` is configured under **Project Settings > Environment Variables** in Vercel so production builds authenticate against OpenWeather without exposing secrets in source control.

## Forecast Aggregation Method

- **Coordinate Resolution:** User queries are first resolved to exact latitude and longitude coordinates using OpenWeather's Geocoding API before requesting current and forecast endpoints.
- **City Local Time Conversion:** All Unix timestamps (`dt`) are shifted by the API's `timezone` offset (in seconds) and formatted in UTC to compute the selected city's exact local time and calendar date independent of the user's device timezone.
- **24-Hour Selection:** Forecast entries are sorted chronologically by timestamp and sliced to the next 8 available 3-hour intervals, flagging date changes across midnight.
- **5-Day Grouping & Daily Status:** Entries are grouped by local calendar date (`YYYY-MM-DD`). For each day (up to 5 distinct dates starting today), the lowest `temp_min` and highest `temp_max` across that day's intervals are calculated. The daily weather status is determined by selecting the **most frequent weather condition** (`weather[0].main`) among that day's intervals. Days with fewer than 8 three-hour intervals are labelled `Partial forecast`.
- **Today's High/Low:** Computed strictly from today's remaining 3-hour forecast intervals; if none remain late at night, `Unavailable` is displayed rather than using current-weather extremes.
- **Unit Conversion:** Raw Celsius values are retained in state and converted locally using $F = \frac{9}{5}C + 32$, rounding only at render time to avoid cumulative rounding drift.

## Known Limitations

- **Free-Tier Forecast Resolution:** OpenWeather's free 5-day / 3-hour endpoint provides 3-hour sample intervals rather than true hourly or full-day astronomical extremes, so daily highs and lows are sample-based estimates.
- **Client-Side API Key Visibility:** Because this is a pure frontend Vite single-page application without a custom backend proxy, `VITE_OPENWEATHER_API_KEY` is bundled into client network requests in the browser.
- **Partial First/Last Days:** Depending on the time of day a query is made, Today and Day 5 will contain fewer than 8 intervals and display as partial forecasts.

## Data Provider Attribution

- Weather data, geocoding, and weather condition icons are provided by **[OpenWeather](https://openweathermap.org)**.

## Credits & Acknowledgements

- **AI Assistance:** Used AI assistance (Google Gemini) for guidance on structuring OpenWeather API service calls, UTC timezone offset calculations, responsive CSS layout adjustments, and troubleshooting Vite/Vercel deployment configuration.
- **Documentation & Tools:** Built with [React](https://react.dev) and [Vite](https://vite.dev), referencing the official [OpenWeather API Documentation](https://openweathermap.orgapi).

## Testing Evidence

### Functional Test Results Table

| #   | Test Case                                                                        | Expected Result                                                                                                                                                     | Actual Result                                                                                                                                    | Status |
| --- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 1   | Initial load displays weather for the default city                               | App opens and automatically displays live current weather, 24h forecast, 5-day forecast, and 3 city summaries for Ndola, ZM                                         | App loaded Ndola, Copperbelt Province, ZM with live temperature, local time, forecasts, and Lusaka/London/New York cards                         | Pass   |
| 2   | A valid city search updates the location, current weather and forecasts together | Searching a valid city (e.g., `Lusaka` or `London`) updates location header, current conditions, 24h cards, and 5-day forecast simultaneously                       | Searching `London` resolved coordinates, displayed disambiguation buttons, and updated all weather and forecast sections together                | Pass   |
| 3   | Empty input and an unknown city produce clear feedback                           | Submitting an empty search or non-existent city (e.g., `xyz123invalid`) shows a clear error message without displaying stale data                                   | Empty input showed `"Please enter a city name before searching."` and unknown input showed `"No city found matching..."` with stale data cleared | Pass   |
| 4   | The 24-hour section displays eight consecutive three-hour forecast entries       | Next 24 Hours displays 8 sequential 3-hour intervals with local times, icons, temperatures, and a date badge across midnight                                        | Displayed 8 consecutive 3-hour cards with date badges marking the start and midnight rollover                                                    | Pass   |
| 5   | The five-day section displays five distinct dates with sensible high/low values  | 5 Day Forecast displays 5 distinct local dates starting with `Today`, dominant status, min/max temps, and `Partial forecast` where `< 8` intervals exist            | Displayed 5 distinct calendar days with accurate min/max ranges and `Partial forecast` badge on partial days                                     | Pass   |
| 6   | Switching units updates every temperature correctly; for example, `0 °C = 32 °F` | Clicking `°F` highlights the active button and converts current, high/low, 24h, 5-day, and other city temperatures accurately; clicking `°C` restores metric values | Toggling between `°C` and `°F` updated all displayed temperatures and wind speeds immediately without rounding drift                             | Pass   |
| 7   | A city in a different time zone displays appropriate local times and dates       | Searching a city in another time zone (e.g., `New York` or `Tokyo`) displays that city's local clock and local forecast dates rather than Zambia time               | Searching `New York` displayed US Eastern local date/time and aligned 24h/5-day intervals to New York's local calendar                           | Pass   |
| 8   | A network or API failure shows an error and allows recovery                      | Simulated offline mode or failed request displays a readable error banner and a functional `Retry` button                                                           | Disconnecting network displayed `"Unable to retrieve weather data..."` with a `Retry` button that reloaded data once reconnected                 | Pass   |
| 9   | The interface remains usable on a mobile-width screen and on a desktop screen    | Desktop shows 3-column Other Cities grid; mobile (`< 700px`) stacks cards cleanly with horizontal scroll on 24h cards and zero page-wide overflow                   | Verified on desktop and mobile (`390px` width); all sections stacked cleanly with readable contrast and no horizontal page overflow              | Pass   |

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
