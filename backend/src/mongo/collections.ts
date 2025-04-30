import client from "./connection";

const dbName = "tantei";
const database = client.db(dbName);

// collection types
export interface USERS {
  address: string;
  evm_address: string;
  agents: {agent: string, time: Date}[];
}
export interface AGENTS {
  agent_name: string; //the name of the agent
  strategy_description: string; //descripiton of how the agent works,signals , trading approaches etc.
  strategy_type: string; //the categorized trading approach
  risk_level?: string; //volatility and risk level
  // api_endpoint: string; // a secure endpoint where the strategy is hosted
  subscription_fee: number; // how much users will pay to follow the agent
  owner_wallet_address: string; //the address of the user publishing the agent
  topic_id: string; // Hedera ID of the topic created for the agent
  address: string; // Address
  time_created: Date;
}

export interface TOKENS {
  evm_address: string;
  symbol: string;
  hedera_address: string;
}

export interface PAIRS {
  pair: string[];
  price: number;
}

export interface swappedTokenDetails {
  tokenID: string;
  symbol: string;
  amount: number;
}
export interface SWAPS {
  in: swappedTokenDetails;
  out: swappedTokenDetails;
  time: Date;
  user_hedera: string;
  token_pair: string[];
  type: "buy" | "sell";
  price: number;
}

// collection names
const userCollection = "users";
const agentCollection = "agents";
const tokensCollection = "tokens";
const swapsCollection = "swaps";
const pairsCollection = "pairs";

export const USERS_COLLECTION = database.collection<USERS>(userCollection);
export const AGENTS_COLLECTION = database.collection<AGENTS>(agentCollection);
export const TOKENS_COLLECTION = database.collection<TOKENS>(tokensCollection);
export const SWAPS_COLLECTION = database.collection<SWAPS>(swapsCollection);
export const PAIRS_COLLECTION = database.collection<PAIRS>(pairsCollection);
