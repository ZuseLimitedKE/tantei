import z from "zod";
import { hexString } from "../constants/constants";

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

export const decodedTransactionsSchema = z.object({
    method: z.string().nullable(),
    addresses: z.string().array().nullable(),
    amountOut: z.number().nullable(),
    amountIn: z.number().nullable(),
});

export type DecodedTransaction = z.infer<typeof decodedTransactionsSchema>;
export type Transactions = z.infer<typeof transactionSchema>;