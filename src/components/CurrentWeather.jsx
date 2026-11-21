function CurrentWeather({ unit }) {
  const tempC = 28;
  const highC = 30;
  const lowC = 22;
  const windSpeed = 12;

  const convertTemp = (temp) => {
    return unit === "C"
      ? temp
      : Math.round((temp * 9) / 5 + 32);
  };

  return (
    <div className="current-weather">
      <h2>Ndola, Zambia</h2>

      <div className="temperature">
        {convertTemp(tempC)}°{unit}
      </div>

      <p>Sunny</p>

      <p>Wind: {windSpeed} km/h</p>

      <p>
        High: {convertTemp(highC)}°{unit} | Low:{" "}
        {convertTemp(lowC)}°{unit}
      </p>
    </div>
  );
}

export default CurrentWeather;