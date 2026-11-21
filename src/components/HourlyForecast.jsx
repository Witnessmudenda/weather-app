function HourlyForecast({ unit }) {
  const hours = [
    { time: "09:00", temp: 28 },
    { time: "12:00", temp: 30 },
    { time: "15:00", temp: 31 },
    { time: "18:00", temp: 29 },
    { time: "21:00", temp: 26 },
    { time: "00:00", temp: 24 },
    { time: "03:00", temp: 23 },
  ];

  const convertTemp = (temp) =>
    unit === "C"
      ? temp
      : Math.round((temp * 9) / 5 + 32);

  return (
    <div className="hourly-cards">
      {hours.map((hour, index) => (
        <div key={index} className="hour-card">
          <h3>{hour.time}</h3>
          <p>
            {convertTemp(hour.temp)}°{unit}
          </p>
        </div>
      ))}
    </div>
  );
}

export default HourlyForecast;