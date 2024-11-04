import { randomBytes } from "crypto";
export const generateUniqueHash = (size) => {
    return randomBytes(size).toString("hex");
};
//# sourceMappingURL=hash.js.map