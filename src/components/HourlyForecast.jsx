function HourlyForecast({ unit, city }) {
  const hourlyData = {
    Ndola: [28, 30, 31, 29, 26, 24, 23],
    Lusaka: [27, 29, 30, 28, 25, 23, 22],
    Kitwe: [26, 28, 29, 27, 24, 22, 21],
    Livingstone: [31, 34, 35, 33, 30, 28, 27],
  };

  const times = [
    "09:00",
    "12:00",
    "15:00",
    "18:00",
    "21:00",
    "00:00",
    "03:00",
  ];

  const temperatures =
    hourlyData[city] || hourlyData["Ndola"];

  const convertTemp = (temp) =>
    unit === "C"
      ? temp
      : Math.round((temp * 9) / 5 + 32);

  return (
    <div className="hourly-cards">
      {times.map((time, index) => (
        <div key={index} className="hour-card">
          <h3>{time}</h3>
          <p>
            {convertTemp(temperatures[index])}°{unit}
          </p>
        </div>
      ))}
    </div>
  );
}

export default HourlyForecast;