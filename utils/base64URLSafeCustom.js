const delimiter = "=";
// Fungsi untuk melakukan URL-safe Base64 Encoding tanpa padding
const base64EncodeURLSafe = (data) => {
  return Buffer.from(data + "rpsgames2024/roomId" + delimiter + data, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-") // Mengganti "+" dengan "-"
    .replace(/\//g, "_") // Mengganti "/" dengan "_"
    .replace(/=/g, ""); // Menghapus padding "="
};

const base64DecodeURLSafe = (encodedData) => {
  // Tambahkan padding "=" jika panjang encodedData bukan kelipatan 4
  while (encodedData.length % 4 !== 0) {
    encodedData += "=";
  }

  // Ganti karakter "_" kembali menjadi "/" dan "-" kembali menjadi "+"
  encodedData = encodedData.replace(/_/g, "/").replace(/-/g, "+");

  // Lakukan Base64 Decoding
  const decodedId = Buffer.from(encodedData, "base64").toString("utf-8");

  const parts = decodedId.split(delimiter);
  const decodedRoomId = parts[1];
  return decodedRoomId;
};

module.exports = {base64EncodeURLSafe, base64DecodeURLSafe};
