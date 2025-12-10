import stringToHex from './stringUtils';

const generateRandomString = (length: number): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

/**
 * 随机sm4密钥
 */
const randomSm4Key = (): string => {
  const randomString = stringToHex(generateRandomString(16));
  return randomString;
};

export default randomSm4Key;
