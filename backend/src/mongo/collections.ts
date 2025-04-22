import client from "./connection";

const dbName = "tantei";
const database = client.db(dbName);

// collection types
export interface USERS {
  address: string;
  evm_address: string;
}
export interface AGENTS {
  agent_name: string; //the name of the agent
  strategy_description: string; //descripiton of how the agent works,signals , trading approaches etc.
  strategy_type: string; //the categorized trading approach
  risk_level?: string; //volatility and risk level
  api_endpoint: string; // a secure endpoint where the strategy is hosted
  subscription_fee: number; // how much users will pay to follow the agent
  owner_wallet_address: string; //the address of the user publishing the agent
}
// collection names
const userCollection = "users";
const agentCollection = "agents";
export const USERS_COLLECTION = database.collection<USERS>(userCollection);
export const AGENTS_COLLECTION = database.collection<AGENTS>(agentCollection);
