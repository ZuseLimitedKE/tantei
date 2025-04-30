import z from "zod";
import { hexString } from "../constants/constants";

export const transactionSchema = z.object({
  from: hexString,
  hash: hexString,
  input: hexString,
  to: hexString,
  v: hexString,
  value: hexString,
});

export const getTransactionsSchema = z.object({
  result: z.object({
    transactions: z.array(transactionSchema),
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

export const mirrorNodeTransaction = z.object({
  address: z.string(),
  amount: z.number(),
  contract_id: z.string(),
  from: z.string(),
  function_parameters: z.string(),
  to: z.string(),
  hash: z.string(),
})

export type MirrorNodeTransaction = z.infer<typeof mirrorNodeTransaction>;
export type DecodedTransaction = z.infer<typeof decodedTransactionsSchema>;
export type Transactions = z.infer<typeof transactionSchema>;
