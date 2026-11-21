// Convert Celsius to Fahrenheit locally (Section 5 formula)
export const formatTemp = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) {
    return 'Unavailable';
  }
  const value = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}°${unit}`;
};

// OpenWeather metric wind speed comes in m/s; convert cleanly to km/h (or mph for F)
export const formatWindSpeed = (speedMs, unit = 'C') => {
  if (speedMs === null || speedMs === undefined || Number.isNaN(speedMs)) {
    return 'Unavailable';
  }
  if (unit === 'F') {
    const mph = speedMs * 2.23694;
    return `${Math.round(mph)} mph`;
  }
  const kmh = speedMs * 3.6;
  return `${Math.round(kmh)} km/h`;
};
