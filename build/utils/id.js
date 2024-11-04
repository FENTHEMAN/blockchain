import { randomBytes } from "crypto";
export const generateId = (size) => {
    return randomBytes(size).toString("hex");
};
//# sourceMappingURL=id.js.map