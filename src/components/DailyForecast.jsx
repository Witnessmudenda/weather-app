function DailyForecast({ unit }) {
  const forecast = [
    { day: "Mon", high: 30, low: 22 },
    { day: "Tue", high: 31, low: 23 },
    { day: "Wed", high: 29, low: 21 },
    { day: "Thu", high: 28, low: 20 },
    { day: "Fri", high: 30, low: 22 },
  ];

  const convertTemp = (temp) =>
    unit === "C"
      ? temp
      : Math.round((temp * 9) / 5 + 32);

  return (
    <div className="daily-cards">
      {forecast.map((item, index) => (
        <div key={index} className="day-card">
          <h3>{item.day}</h3>
          <p>
            {convertTemp(item.high)}° / {convertTemp(item.low)}°{unit}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DailyForecast;