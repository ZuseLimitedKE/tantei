import z from "zod";

const hederaWalletAddressRegex = /^0\.0\.[A-Za-z0-9]+$/

export const registerUserSchema = z.object({
  address: z.string({message: "User address must be a string"}).regex(hederaWalletAddressRegex, {message: "address must be of the form 0.0.xxxx"}),
});

export const followAgentSchema = z.object({
  user_hedera_account: z.string().regex(hederaWalletAddressRegex, {message: "address must be of the form 0.0.xxxx"}),
  agent_hedera_account: z.string().regex(hederaWalletAddressRegex, {message: "address must be of the form 0.0.xxxx"})
})

export type FollowAgent = z.infer<typeof followAgentSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
