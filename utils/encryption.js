const CryptoJS = require("crypto-js");

// Fungsi untuk melakukan enkripsi
const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, process.env.ENCRYPTION_KEY).toString();
};

// Fungsi untuk melakukan dekripsi
const decrypt = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {encrypt, decrypt};
