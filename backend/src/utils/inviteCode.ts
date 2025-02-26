// backend/src/utils/inviteCode.ts
import { prisma } from "../lib/prisma";

export const generateUniqueInviteCode = async (): Promise<string> => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 8;

  // Keep generating codes until we find a unique one
  while (true) {
    let code = "";
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    // Check if code is already in use
    const existingOrg = await prisma.organization.findFirst({
      where: { inviteCode: code },
    });

    if (!existingOrg) {
      return code;
    }
  }
};
