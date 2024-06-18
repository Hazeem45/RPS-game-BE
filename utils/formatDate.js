const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const splitFormatDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  const monthIndex = parseInt(month) - 1;
  return `${day} ${months[monthIndex]} ${year}`;
};

const getFormatDate = (date) => {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();

  // Pad single-digit minutes with a leading zero
  const paddedDay = (day < 10 ? '0' : '') + day;
  const paddedHour = (hour < 10 ? '0' : '') + hour;
  const paddedMinute = (minute < 10 ? '0' : '') + minute;

  return {
    date: `${paddedDay} ${months[monthIndex]} ${year}`,
    time: `${paddedHour}:${paddedMinute} ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
  };
};

module.exports = { splitFormatDate, getFormatDate };
