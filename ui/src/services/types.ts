export interface AgentData {
  id: string;
  name: string;
  avatarUrl: string;
  description: string;
  strategyType: string;
  roi: number;
  roiTimeframe: string;
  riskScore: number;
  followers: number;
  trades: number;
  verified: boolean;
}
