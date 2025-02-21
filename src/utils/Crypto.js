import CryptoJS from "crypto-js";

export function encrypt(plainText, keyStr) {
    const key = CryptoJS.SHA256(keyStr); // Hash key untuk 256-bit key
    const iv = key.words.slice(0, 4); // IV dari key hash (16 byte)

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: CryptoJS.lib.WordArray.create(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString(); // Hasil base64
}

export function decrypt(encryptedText, keyStr) {
    const key = CryptoJS.SHA256(keyStr); // Hash key untuk 256-bit key
    const iv = key.words.slice(0, 4); // IV dari key hash (16 byte)

    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
        iv: CryptoJS.lib.WordArray.create(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}