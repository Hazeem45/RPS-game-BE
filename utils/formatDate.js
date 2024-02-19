const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Oktober", "November", "December"];

const formatDate = (dateString) => {
  // console.log(typeof dateString);
  let date;
  // receive from database as string
  if (typeof dateString === "string") {
    // Check if the dateString contains slashes (indicating DD/MM/YYYY format)
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      date = new Date(`${year}-${month}-${day}`);
    }
  } else {
    // receive from database from the column (createdAt or updateAt) as object
    date = new Date(dateString);
  }

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Pad single-digit minutes with a leading zero
  const paddedDay = (day < 10 ? "0" : "") + day;

  return `${paddedDay} ${months[monthIndex]} ${year}`;
};

module.exports = formatDate;
