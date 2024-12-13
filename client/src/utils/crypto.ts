import { AES, enc } from "crypto-js";

const secretKey = import.meta.env.VITE_API_ENCRYPT;

export const decryptData = (encryptedData: string) => {
  try {
    const bytes = AES.decrypt(encryptedData, secretKey);
    return bytes.toString(enc.Utf8);
  } catch (error) {
    console.error("Failed to decrypt data", error);
    return null;
  }
};

// Hàm mã hóa
export const encryptData = (data: string) => {
  return AES.encrypt(data, secretKey).toString();
};
