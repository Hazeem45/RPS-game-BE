const formatTimeByTimezoneOffset = (dateObject) => {
  const timeFromDB = dateObject;
  let userOffset = new Date("2024-05-12T13:34:46.567Z").getTimezoneOffset() / 60;
  userOffset = -userOffset;
  let hour = timeFromDB.getUTCHours() + userOffset;
  const minute = timeFromDB.getUTCMinutes();
  let UTC = userOffset > 0 ? `UTC+${userOffset}` : `UTC${userOffset}`;
  if (hour >= 24) {
    hour -= 24;
  } else if (hour < 0) {
    hour += 24;
  }
  const paddedHour = (hour < 10 ? "0" : "") + hour;
  const paddedMinute = (minute < 10 ? "0" : "") + minute;
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    time: `${paddedHour}:${paddedMinute} ${UTC}`,
    userOffset: userOffset,
    userTimeZone: userTimeZone,
  };
};

module.exports = formatTimeByTimezoneOffset;
