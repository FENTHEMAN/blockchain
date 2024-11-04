import { randomBytes } from "crypto";

export const generateUniqueHash = (size: number) => {
    return randomBytes(size).toString("hex");
};
