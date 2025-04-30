import z from "zod";
import { hexString } from "../constants/constants";

const hederaWalletAddressRegex = /^0\.0\.[A-Za-z0-9]+$/
export const hederaAddress = z.string({message: "address should be a string"}).regex(hederaWalletAddressRegex);

export const registerUserSchema = z.object({
  address: z.string({ message: "User address must be a string" }).regex(hederaWalletAddressRegex, { message: "address must be of the form 0.0.xxxx" }),
});

export const followAgentSchema = z.object({
  user_hedera_account: z.string({ message: "user account must be a string" }).regex(hederaWalletAddressRegex, { message: "user address must be of the form 0.0.xxxx" }),
  agent_hedera_account: z.string({ message: "agent accoutn must be a string" }).regex(hederaWalletAddressRegex, { message: "agent address must be of the form 0.0.xxxx" })
});

export const evmUserDetailsSchema = z.object({
  account: z.string().regex(hederaWalletAddressRegex),
  alias: z.string(),
  balance: z.object({
    balance: z.number(),
    timestamp: z.string(),
    tokens: z.array(z.object({
      token_id: z.string().regex(hederaWalletAddressRegex),
      balance: z.number(),
    }))
  }),
  deleted: z.boolean(),
  ethereum_nonce: z.number(),
  evm_address: hexString,
});
export type EvmUserDetails = z.infer<typeof evmUserDetailsSchema>;
export type FollowAgent = z.infer<typeof followAgentSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
