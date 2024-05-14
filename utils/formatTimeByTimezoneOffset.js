const formatTimeByTimezoneOffset = (dateObject) => {
  const timeFromDB = dateObject;
  let userOffset = new Date().getTimezoneOffset() / 60;
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

  return `${paddedHour}:${paddedMinute} ${UTC}`;
};

module.exports = formatTimeByTimezoneOffset;
