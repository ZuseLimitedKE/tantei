import z from "zod";

const hexString = z.string().regex(/0x[0-9a-f]/)

export const transactionSchema = z.object({
    blockHash: hexString,
    blockNumber: hexString,
    chainId: hexString,
    from: hexString,
    gas: hexString,
    gasPrice: hexString,
    hash: hexString,
    input: hexString,
    to: hexString,
    nonce: hexString,
    r: hexString,
    s: hexString,
    transactionIndex: hexString,
    type: hexString,
    v: hexString,
    value: hexString
});

export const getTransactionsSchema = z.object({
    result: z.object({
        transactions: transactionSchema.array()
    }),
    jsonrpc: z.string(),
    id: z.number()
});

export const registerUserSchema = z.object({
    address: z.string(),
    evm_address: hexString,
});

export const decodedTransactionsSchema = z.object({
    method: z.string(),
    addresses: z.string().array().optional()
});

export type DecodedTransaction = z.infer<typeof decodedTransactionsSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type Transactions = z.infer<typeof transactionSchema>;