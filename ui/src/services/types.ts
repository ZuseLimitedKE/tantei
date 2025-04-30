export interface PortfolioStats {
  roi: number;
  value: number;
  last_trade: Date | null;
}
export interface AgentData {
  _id: string;
  agent_name: string; //the name of the agent
  strategy_description: string; //descripiton of how the agent works,signals , trading approaches etc.
  strategy_type: string; //the categorized trading approach
  risk_level?: string; //volatility and risk level
  // api_endpoint: string; // a secure endpoint where the strategy is hosted
  subscription_fee: number; // how much users will pay to follow the agent
  owner_wallet_address: string; //the address of the user publishing the agent
  topic_id: string; // Hedera ID of the topic created for the agent
  address: string; // Address
}
export interface Token {
  name: string;
  symbol: string;
  token: string;
  balance: number;
}
export interface TradeData {
  time: string;
  tokenPair: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  profit: number | null; // null means active trade
}
