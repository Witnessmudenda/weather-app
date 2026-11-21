const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org";

export const geocodeCity = async (query) => {
  if (!API_KEY) {
    throw new Error("Missing API key. Check your .env file and restart Vite.");
  }

  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error("Please enter a city name to search.");
  }

  const res = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(trimmed)}&limit=5&appid=${API_KEY}`
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Invalid or inactive API key. New keys take up to 2 hours to activate.");
    }
    throw new Error("Failed to search for city. Please try again.");
  }

  const locations = await res.json();
  if (!locations || locations.length === 0) {
    throw new Error(`No city found matching "${trimmed}".`);
  }

  return locations;
};

export const fetchWeatherByCoords = async (lat, lon) => {
  if (!API_KEY) {
    throw new Error("Missing API key. Check your .env file and restart Vite.");
  }

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
    fetch(`${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    throw new Error("Unable to retrieve weather data. Check your connection and retry.");
  }

  const [currentData, forecastData] = await Promise.all([
    currentRes.json(),
    forecastRes.json()
  ]);

  return { currentData, forecastData };
};

export const fetchCityWeather = async (cityQuery) => {
  const locations = await geocodeCity(cityQuery);
  const topMatch = locations[0];
  const weather = await fetchWeatherByCoords(topMatch.lat, topMatch.lon);

  return {
    location: topMatch,
    locations,
    ...weather
  };
};
