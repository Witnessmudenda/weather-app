// Shift a Unix timestamp (seconds) by the city's timezone offset (seconds)
// Using UTC getters on the shifted Date avoids the user's browser timezone interfering
const getCityLocalDate = (unixSeconds, timezoneOffsetSeconds) => {
  return new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
};

// Format YYYY-MM-DD in the city's local timezone for accurate day grouping
const getLocalDateKey = (unixSeconds, timezoneOffsetSeconds) => {
  const d = getCityLocalDate(unixSeconds, timezoneOffsetSeconds);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format readable local date & time for the Current Weather card (R2)
export const formatCityDateTime = (unixSeconds, timezoneOffsetSeconds) => {
  const d = getCityLocalDate(unixSeconds, timezoneOffsetSeconds);
  const dateStr = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const timeStr = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  return `${dateStr} • ${timeStr}`;
};

// Process next 8 forecast entries (24 hours) with midnight date markers (R3)
export const processHourlyForecast = (forecastList = [], timezoneOffsetSeconds = 0) => {
  const sorted = [...forecastList].sort((a, b) => a.dt - b.dt);
  const nextEight = sorted.slice(0, 8);

  let previousDateKey = null;

  return nextEight.map((item, index) => {
    const localDate = getCityLocalDate(item.dt, timezoneOffsetSeconds);
    const dateKey = getLocalDateKey(item.dt, timezoneOffsetSeconds);

    const time = localDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });

    const shortDate = localDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });

    // Show date on the first card or whenever the date crosses midnight
    const crossesMidnight = index > 0 && dateKey !== previousDateKey;
    previousDateKey = dateKey;

    return {
      dt: item.dt,
      time,
      dateLabel: index === 0 || crossesMidnight ? shortDate : null,
      tempC: item.main?.temp ?? null,
      status: item.weather?.[0]?.main || 'Unknown',
      description: item.weather?.[0]?.description || '',
      icon: item.weather?.[0]?.icon || '01d',
    };
  });
};

// Group forecast entries into 5 distinct local calendar days + get today's High/Low (R2 & R4)
export const processDailyForecast = (
  forecastList = [],
  currentDt,
  timezoneOffsetSeconds = 0
) => {
  const sorted = [...forecastList].sort((a, b) => a.dt - b.dt);
  const todayKey = getLocalDateKey(currentDt, timezoneOffsetSeconds);

  const groupedByDay = new Map();

  // Ensure today is always the first bucket even if 0 forecast slots remain late at night
  groupedByDay.set(todayKey, []);

  sorted.forEach((item) => {
    const key = getLocalDateKey(item.dt, timezoneOffsetSeconds);
    if (!groupedByDay.has(key)) {
      groupedByDay.set(key, []);
    }
    groupedByDay.get(key).push(item);
  });

  // Calculate Today's estimated high/low strictly from today's forecast entries (Section 5 rule 6)
  const todayEntries = groupedByDay.get(todayKey) || [];
  let todayHighC = null;
  let todayLowC = null;

  if (todayEntries.length > 0) {
    todayHighC = Math.max(...todayEntries.map((e) => e.main.temp_max ?? e.main.temp));
    todayLowC = Math.min(...todayEntries.map((e) => e.main.temp_min ?? e.main.temp));
  }

  // Build up to 5 distinct calendar days starting today (R4)
  const fiveDays = Array.from(groupedByDay.entries())
    .slice(0, 5)
    .map(([dateKey, entries], index) => {
      // Parse YYYY-MM-DD safely in UTC for display
      const [y, m, d] = dateKey.split('-').map(Number);
      const displayDate = new Date(Date.UTC(y, m - 1, d));

      const dayLabel =
        index === 0
          ? 'Today'
          : displayDate.toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              timeZone: 'UTC',
            });

      if (entries.length === 0) {
        return {
          dateKey,
          dayLabel,
          minC: null,
          maxC: null,
          status: 'Unavailable',
          icon: null,
          isPartial: true,
        };
      }

      const minC = Math.min(...entries.map((e) => e.main.temp_min ?? e.main.temp));
      const maxC = Math.max(...entries.map((e) => e.main.temp_max ?? e.main.temp));

      // Most frequent weather condition for the day (Section 5 rule 5)
      const statusCounts = {};
      let dominantEntry = entries[0];
      let maxCount = 0;

      entries.forEach((entry) => {
        const condition = entry.weather?.[0]?.main || 'Clear';
        statusCounts[condition] = (statusCounts[condition] || 0) + 1;
        if (statusCounts[condition] > maxCount) {
          maxCount = statusCounts[condition];
          dominantEntry = entry;
        }
      });

      return {
        dateKey,
        dayLabel,
        minC,
        maxC,
        status: dominantEntry.weather?.[0]?.main || 'Unknown',
        icon: dominantEntry.weather?.[0]?.icon || '01d',
        // A full day has 8 three-hour intervals; fewer than 8 means partial day (R4)
        isPartial: entries.length < 8,
      };
    });

  return {
    todayHighC,
    todayLowC,
    fiveDays,
  };
};
