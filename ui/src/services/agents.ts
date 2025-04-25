import type { publishAgentType } from "@/types/zod";
import Api from "./api";
import type { AgentData } from "./types";

export function PublishAgent(agent: publishAgentType) {
  return Api.post("/agents", agent);
}

export function GetFollowedAgents(
  account_address: string,
): Promise<AgentData[]> {
  return Api.post(`/users/agents/${account_address}`);
}
