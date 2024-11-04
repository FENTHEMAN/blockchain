import { generateUniqueHash } from "../utils/hash.js";
import { createHash } from "crypto";
export const createBlockchain = () => {
    const blockchain = {
        chain: [
            {
                body: {
                    transactions: [],
                },
                headers: {
                    hash: "",
                    id: generateUniqueHash(6),
                    timestamp: new Date(),
                },
            },
        ],
        addBlock: (transactions) => {
            const id = generateUniqueHash(6);
            const block = {
                headers: {
                    id,
                    hash: createHash("sha256")
                        .update(id +
                        JSON.stringify(transactions) +
                        blockchain.chain[blockchain.chain.length - 1]
                            ?.headers.hash)
                        .digest("hex"),
                    timestamp: new Date(),
                },
                body: {
                    transactions: transactions,
                },
            };
            blockchain.chain.push(block);
        },
    };
    return blockchain;
};
//# sourceMappingURL=blockchain.js.map