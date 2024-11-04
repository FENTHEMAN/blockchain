import { generateUniqueHash } from "../utils/hash.js";
import { Block, Blockchain, Transaction } from "./blockchain.model.js";
import { createHash } from "crypto";

export const createBlockchain = (): Blockchain => {
    const blockchain: Blockchain = {
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
        addBlock: (transactions: Transaction[]) => {
            const id = generateUniqueHash(6);
            const block: Block = {
                headers: {
                    id,
                    hash: createHash("sha256")
                        .update(
                            id +
                                JSON.stringify(transactions) +
                                blockchain.chain[blockchain.chain.length - 1]
                                    ?.headers.hash
                        )
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
