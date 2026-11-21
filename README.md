# Weather App

A responsive React + Vite weather application that fetches real-time conditions, a 24-hour forecast, a 5-day forecast, and global city summaries using the OpenWeather API.

## Student Information

- **Name:** Witness Mudenda
- **Student ID:** [YOUR_STUDENT_ID]
- **Institution:** Zambia University College of Technology (ZUT)

## Project Links

- **Live Demo:** https://vercel.app
- **GitHub Repository:** https://github.com

## Tech Stack

- **Frontend:** React, Vite, CSS3 (Responsive Grid & Flexbox)
- **API:** OpenWeather Geocoding API (`/geo/1.0/direct`), Current Weather API (`/data/2.5/weather`), and 5-Day / 3-Hour Forecast API (`/data/2.5/forecast`)
- **Deployment:** Vercel

## Local Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com.git
   cd weather-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory based on `.env.example` and add your OpenWeather API key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Data Processing & Forecast Logic

- **City Local Time:** Shifts UTC timestamps using the API's `timezone` offset so every searched city displays its own local clock and calendar dates.
- **24-Hour Forecast:** Displays the next 8 consecutive 3-hour forecast intervals with date badges whenever the timeline starts or crosses midnight.
- **5-Day Forecast:** Groups intervals into 5 distinct local calendar dates starting today, determines the dominant daily weather condition, calculates daily min/max temperatures, and flags days with fewer than 8 intervals as a `Partial forecast`.
- **Temperature Conversion:** Stores raw Celsius values and converts locally (`(°C × 9/5) + 32`) when toggling to `°F` to prevent rounding drift.

## Functional Test Cases

| #   | Test Case                  | Input / Action                   | Expected Result                                                        | Status |
| --- | -------------------------- | -------------------------------- | ---------------------------------------------------------------------- | ------ |
| 1   | Default City Load          | Open application root URL        | Loads Ndola, ZM current weather, 24h, 5-day, and 3 other cities        | Pass   |
| 2   | Valid City Search          | Search `Lusaka` and submit       | Displays Lusaka live weather and updated forecasts                     | Pass   |
| 3   | City Disambiguation        | Search `London`                  | Displays matching options (`London, GB`, `London, CA`, etc.) to select | Pass   |
| 4   | Empty Input Validation     | Click Search with empty input    | Displays validation prompt without breaking current view               | Pass   |
| 5   | Invalid City Error         | Search `xyz123invalid`           | Displays readable error message and Retry button                       | Pass   |
| 6   | Unit Toggle (`°C` to `°F`) | Click `°F` button                | All temperatures and wind speeds convert cleanly without refetching    | Pass   |
| 7   | Unit Toggle (`°F` to `°C`) | Click `°C` button                | All values return accurately to metric units                           | Pass   |
| 8   | 24-Hour Midnight Rollover  | View Next 24 Hours cards         | Displays 8 intervals with date badge where forecast crosses midnight   | Pass   |
| 9   | 5-Day Partial Forecast     | View Today card in 5-Day section | Shows `Partial forecast` label when fewer than 8 intervals remain      | Pass   |
| 10  | Mobile Responsive Layout   | Resize viewport to `< 700px`     | Other Cities stack vertically and 24h cards scroll horizontally        | Pass   |

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
