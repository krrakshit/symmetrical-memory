// backend/src/utils/generateCode.ts
import crypto from "crypto";

// Generate a random join code for organizations
export const generateJoinCode = (length = 8): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomBytes = crypto.randomBytes(length);

  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % characters.length;
    result += characters.charAt(randomIndex);
  }

  return result;
};
