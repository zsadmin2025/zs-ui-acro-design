import { sm4, sm2 } from 'sm-crypto';
import cryptoStore from '@/store/modules/common/cryptoStore';

// 公钥
const publicKey =
  '04babc11e13cac8eec36457420c5fd7ee5ae2ce21df6a8907dbce8f667750a7069ab6054a6db718daa0b0bb49808db150704dff5d39358513ac472bee04120274e';
// 私钥 实际项目中需要从后端获取
const privateKey =
  '6a487bdb1e5752edbadd893fc21484d2c1f66ef9b062b607c3df3fb839c07efe';

/**
 * SM4加密方法
 * @param data 需要加密的数据
 * @returns
 */
export const sm4Encrypt = (data: any) => {
  const useCryptoStore = cryptoStore();
  return sm4.encrypt(JSON.stringify(data), useCryptoStore.sm4Key);
};

/**
 * SM4解密方法
 * @param data 需要解密的数据
 * @returns
 */
export const sm4Decrypt = (data: string) => {
  const useCryptoStore = cryptoStore();
  const decryptedText = sm4.decrypt(data, useCryptoStore.sm4Key);
  return decryptedText.trim() === '' ? '' : JSON.parse(decryptedText);
};

/**
 * SM2加密方法
 * @param data 需要加密的数据
 * @returns
 */
export const sm2Encrypt = (data: any) => {
  return `04${sm2.doEncrypt(JSON.stringify(data), publicKey, 1)}`;
};

/**
 * SM2解密方法
 * @param data 需要解密的数据
 * @returns
 */
export const sm2Decrypt = (data: string) => {
  return sm2.doDecrypt(data, privateKey);
};
