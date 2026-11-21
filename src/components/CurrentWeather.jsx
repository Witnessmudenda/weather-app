function CurrentWeather({ unit, city }) {
  const weatherData = {
    "Ndola": {
      temp: 28,
      high: 30,
      low: 22,
      condition: "Sunny",
      wind: 12,
    },
    "Lusaka": {
      temp: 27,
      high: 29,
      low: 21,
      condition: "Partly Cloudy",
      wind: 10,
    },
    "Kitwe": {
      temp: 26,
      high: 28,
      low: 20,
      condition: "Cloudy",
      wind: 8,
    },
    "Livingstone": {
      temp: 31,
      high: 34,
      low: 25,
      condition: "Hot",
      wind: 15,
    },
  };

  const cityName = city.replace(", ZM", "").trim();

  const data = weatherData[cityName] || weatherData["Ndola"];

  const convertTemp = (temp) =>
    unit === "C"
      ? temp
      : Math.round((temp * 9) / 5 + 32);

  return (
    <div className="current-weather">
      <h2>{city}, Zambia</h2>

      <div className="temperature">
        {convertTemp(data.temp)}°{unit}
      </div>

      <p>{data.condition}</p>

      <p>Wind: {data.wind} km/h</p>

      <p>
        High: {convertTemp(data.high)}°{unit} |
        Low: {convertTemp(data.low)}°{unit}
      </p>
    </div>
  );
}

export default CurrentWeather;