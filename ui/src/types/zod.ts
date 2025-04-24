import z from "zod";

export const publishAgentSchema = z.object({
  agent_name: z
    .string()
    .min(2, "the agent name must be greater than 2 characters"),
  strategy_description: z.string().min(20, "strategy description is too short"),
  strategy_type: z.string(),
  risk_level: z.string(),
  address: z
    .string()
    .regex(/^0\.0\.[A-Za-z0-9]+$/, "invalid wallet address format"),
  subscription_fee: z.coerce
    .number()
    .gt(0, "the subscription fee must be greater than 0"),
  owner_wallet_address: z.string(),
});

export type publishAgentType = z.infer<typeof publishAgentSchema>;
