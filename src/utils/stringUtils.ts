/**
 * 字符串转换为16进制
 * @param str
 * @returns
 */
const stringToHex = (str: string) => {
  let hex = '';
  for (let i = 0; i < str.length; i += 1) {
    let hexByte = str.charCodeAt(i).toString(16);
    // Ensure each character's byte is two hexadecimal digits long
    if (hexByte.length % 2 !== 0) {
      hexByte = `0${hexByte}`;
    }
    hex += hexByte;
  }
  // Ensure the output is exactly 16 bytes (32 hexadecimal characters for 128 bits)
  while (hex.length % 2 !== 0 || hex.length / 2 < 16) {
    hex = `00${hex}`;
  }
  return hex;
};

export default stringToHex;
