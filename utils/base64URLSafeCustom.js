const delimiter = '=';
// Function to perform URL-safe Base64 Encoding without padding
const base64EncodeURLSafe = (data) => {
  return Buffer.from(data + data + 3 + delimiter + '/roomId?' + delimiter + data, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-') // replace "+" with "-"
    .replace(/\//g, '_') // replace "/" with "_"
    .replace(/=/g, ''); // delete padding "="
};

// Function to decoding
const base64DecodeURLSafe = (encodedData) => {
  // add padding "=" if length encodedData is not a multiple of 4
  while (encodedData.length % 4 !== 0) {
    encodedData += '=';
  }

  // change Character "_" back to "/" and "-" back to "+"
  encodedData = encodedData.replace(/_/g, '/').replace(/-/g, '+');

  // Base64 Decoding
  const decodedId = Buffer.from(encodedData, 'base64').toString('utf-8');

  const parts = decodedId.split(delimiter);
  const trueValue = (parts[0] - 3) / 2;
  const arrayDelimiter = parts[1];
  const decodedRoomId = parts[2];
  if (arrayDelimiter === '/roomId?') {
    if (trueValue.toString() === decodedRoomId) {
      return decodedRoomId;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

module.exports = { base64EncodeURLSafe, base64DecodeURLSafe };
