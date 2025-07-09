const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require('uuid');
const { User } = require("../models");

exports.encrypt = (plainText, secret) => {
    try {
        const keyHash = CryptoJS.MD5(secret);

        const encrypted = CryptoJS.AES.encrypt(plainText, keyHash, {
            iv: CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    } catch (error) {
        return null;
    }
};

exports.decrypt = (encryptedText, workingKey) => {
    try {
        const keyHash = CryptoJS.MD5(workingKey);

        const encryptedWordArray = CryptoJS.enc.Hex.parse(encryptedText);

        const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedWordArray }, keyHash, {
            iv: CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        return null;
    }

};
exports.generateUniqueReferCode = async () => {
  let referCode;
  let isUnique = false;
  while (!isUnique) {
    referCode = uuidv4().substring(0, 8).toUpperCase(); // Generate 8-character code
    const existingUser = await User.findOne({ refer_code: referCode });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return referCode;
};
