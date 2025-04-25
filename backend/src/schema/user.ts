import z from "zod";

export const registerUserSchema = z.object({
  address: z.string(),
});

export const followAgentSchema = z.object({
  user_hedera_account: z.string(),
  agent_hedera_account: z.string()
})

export type FollowAgent = z.infer<typeof followAgentSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
