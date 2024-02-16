const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Oktober", "November", "December"];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  return `${day} ${months[monthIndex]} ${year}`;
};

module.exports = formatDate;
