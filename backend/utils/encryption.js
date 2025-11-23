const crypto = require("crypto");

// Use a secret key from environment or generate one
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-32-char-secret-key-here!!"; // Must be 32 chars
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // For AES, this is always 16

// Ensure key is exactly 32 bytes
const getKey = () => {
  const key = Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32), "utf8");
  return key;
};

const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return text; // Return original if encryption fails
  }
};

const decrypt = (text) => {
  try {
    const parts = text.split(":");
    if (parts.length !== 2) {
      // If not encrypted format, return as is (for backward compatibility)
      return text;
    }
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return text; // Return original if decryption fails
  }
};

module.exports = { encrypt, decrypt };


