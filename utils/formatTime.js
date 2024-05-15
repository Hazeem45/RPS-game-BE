const timeFormatting = (date) => {
  const dateString = date.toISOString();
  const splitedDate = dateString.split("T");
  const splitedTime = splitedDate[1].split(".");
  const time = splitedTime[0].split(":");
  const hour = parseInt(time[0]);
  const minute = parseInt(time[1]);
  const fixedMinute = (minute < 10 ? "0" : "") + minute;
  return `${hour}:${fixedMinute} UTC+0`;
};

module.exports = timeFormatting;
