import { z } from "zod";
import { ObjectId } from "mongodb";

// Helper function to validate ObjectId strings
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const isValidObjectId = (id: string) => objectIdRegex.test(id);

export const AgentSchema = z.object({
  agent_name: z
    .string()
    .min(2, "the agent name must be greater than 2 characters"),
  strategy_description: z.string().min(20, "strategy description is too short"),
  strategy_type: z.string(),
  risk_level: z.string(),
  address: z.string(),
  subscription_fee: z
    .number()
    .gt(0, "the subscription fee must be greater than 0"),
  owner_wallet_address: z.string(),
  account_id: z.string({message: "Hedera account ID must be a string"})
});

export const AgentUpdateSchema = AgentSchema.partial();

export const AgentIdParamSchema = z.object({
  id: z.string().refine(isValidObjectId, {
    message: "Invalid agent ID format",
  }),
});

export type Agent = z.infer<typeof AgentSchema>;
export type AgentUpdate = z.infer<typeof AgentUpdateSchema>;
