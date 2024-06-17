const CryptoJS = require('crypto-js');

const encrypt = (data) => {
  const encrypted = CryptoJS.AES.encrypt(data, process.env.ENCRYPTION_KEY, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

const decrypt = (encryptedData) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, process.env.ENCRYPTION_KEY, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
