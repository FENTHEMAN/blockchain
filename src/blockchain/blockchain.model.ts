export interface Account {
    address: string;
    privateCode: string;
}

export type Transaction = {
    from: string;
    amount: number;
    to: string;
};

export interface Block {
    headers: {
        id: string;
        hash: string;
        timestamp: Date;
    };
    body: {
        transactions: Transaction[];
    };
}

export interface Blockchain {
    chain: Block[];
    addBlock: (transactions: Transaction[]) => void;
}
