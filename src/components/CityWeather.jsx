function CityWeather({ unit }) {
  const cities = [
    { name: "Lusaka", temp: 27 },
    { name: "London", temp: 14 },
    { name: "New York", temp: 18 },
  ];

  const convertTemp = (temp) =>
    unit === "C"
      ? temp
      : Math.round((temp * 9) / 5 + 32);

  return (
    <div className="city-weather">
      {cities.map((city, index) => (
        <div key={index} className="city-card">
          <h3>{city.name}</h3>
          <p>
            {convertTemp(city.temp)}°{unit}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CityWeather;