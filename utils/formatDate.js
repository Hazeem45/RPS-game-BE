const formatDate = (dateString) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [day, month, year] = dateString.split("/");
  const monthIndex = parseInt(month) - 1;
  return `${day} ${months[monthIndex]} ${year}`;
};

module.exports = formatDate;
