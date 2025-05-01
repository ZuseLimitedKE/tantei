import type { publishAgentType } from "@/types/zod";
import Api from "./api";
import type { AgentData, TradeResponse, PerformanceDataPoint } from "./types";

export const fetchAgents = async (): Promise<AgentData[]> => {
  const res = await fetch(`${import.meta.env.VITE_PROD_BACKEND_URL}/api/v1/agents`);
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
};

export const fetchAgentDetails = async (id: string): Promise<AgentData> => {
  const res = await fetch(`${import.meta.env.VITE_PROD_BACKEND_URL}/api/v1/agents/${id}`);
  if (!res.ok) throw new Error('Agent not found');
  return res.json();
};

export const fetchAgentTrades = async (id: string): Promise<TradeResponse> => {
  const res = await fetch(`${import.meta.env.VITE_PROD_BACKEND_URL}/api/v1/agents/trades/${id}`);
  if (!res.ok) throw new Error('Failed to fetch trades');
  return res.json();
};

export const fetchAgentPerformance = async (id: string): Promise<PerformanceDataPoint[]> => {
  const res = await fetch(`${import.meta.env.VITE_PROD_BACKEND_URL}/api/v1/agents/performance/${id}`);
  if (!res.ok) throw new Error('Failed to fetch performance data');
  return res.json();
};

export function PublishAgent(agent: publishAgentType) {
  return Api.post("/agents", agent);
}

export function GetFollowedAgents(
  account_address: string,
): Promise<AgentData[]> {
  return Api.get(`/users/agents/${account_address}`);
}
