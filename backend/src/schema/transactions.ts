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
  value: hexString,
});

export const getTransactionsSchema = z.object({
  result: z.object({
    transactions: transactionSchema.array(),
  }),
  jsonrpc: z.string(),
  id: z.number(),
});

export const decodedTransactionsSchema = z.object({
  method: z.string(),
  addresses: z.string().array().nullable(),
  amountOut: z.number().nullable(),
  amountIn: z.number().nullable(),
});

export const accountBalanceSchema = z.object({
  balance: z.object({
    balance: z.number(),
    tokens: z.array(z.object({
      token_id: z.string(),
      balance: z.number()
    }))
  })
});

export type DecodedTransaction = z.infer<typeof decodedTransactionsSchema>;
export type Transactions = z.infer<typeof transactionSchema>;
