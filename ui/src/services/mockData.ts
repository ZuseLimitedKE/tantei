import type { AgentData } from "./types";
export const agentAvatars = [
  "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=128&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=128&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=128&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?q=80&w=128&auto=format&fit=crop",
];

// Mock agent data
export const mockAgents: AgentData[] = [
  {
    _id: "hbar-momentum-x",
    agent_name: "HBAR Momentum X",
    strategy_description:
      "Algorithmic strategy that tracks momentum indicators across DEXs to capitalize on HBAR price movements with minimal slippage.",
    strategy_type: "Momentum Trading",
    risk_level: "high",
    subscription_fee: 500,
    owner_wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
    topic_id: "0.0.1234567",
    address: "0x9876543210fedcba9876543210fedcba98765432",
  },
  {
    _id: "hedera-defi-yield",
    agent_name: "Hedera DeFi Yield Hunter",
    strategy_description:
      "Automatically identifies and allocates capital to the highest yield opportunities across the Hedera DeFi ecosystem.",
    strategy_type: "DeFi Yield",
    risk_level: "medium",
    subscription_fee: 300,
    owner_wallet_address: "0x2345678901abcdef2345678901abcdef23456789",
    topic_id: "0.0.2345678",
    address: "0x8765432109fedcba8765432109fedcba87654321",
  },
  {
    _id: "saucerswap-arb",
    agent_name: "SaucerSwap Arbitrageur",
    strategy_description:
      "Exploits price discrepancies between SaucerSwap and other DEXs, executing arbitrage trades for consistent, low-risk returns.",
    strategy_type: "Arbitrage",
    risk_level: "low",
    subscription_fee: 200,
    owner_wallet_address: "0x3456789012abcdef3456789012abcdef34567890",
    topic_id: "0.0.3456789",
    address: "0x7654321098fedcba7654321098fedcba76543210",
  },
];

export interface TradeData {
  id: string;
  agentId: string;
  timestamp: string;
  tokenPair: string;
  direction: "buy" | "sell";
  amount: number;
  price: number;
  profitLoss: number;
  status: "completed" | "open" | "failed";
}

// Generate mock trade history for an agent
export const generateMockTradeHistory = (agentId: string): TradeData[] => {
  const tokens = ["HBAR", "SAUCE", "HSUITE", "DOV", "CREAM"];
  const tradePairs = tokens.map((token) => `${token}/USDC`);

  const randomTrades: TradeData[] = [];

  // Generate between 15-30 trades
  const tradeCount = Math.floor(Math.random() * 16) + 15;

  for (let i = 0; i < tradeCount; i++) {
    const direction = Math.random() > 0.5 ? "buy" : "sell";
    const tokenPair = tradePairs[Math.floor(Math.random() * tradePairs.length)];
    const amount = parseFloat((Math.random() * 1000 + 100).toFixed(2));
    const price = parseFloat((Math.random() * 10).toFixed(4));
    const profitLoss =
      direction === "sell"
        ? parseFloat((Math.random() * 200 - 50).toFixed(2))
        : 0;

    // Create a random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    randomTrades.push({
      id: `trade-${agentId}-${i}`,
      agentId,
      timestamp: date.toISOString(),
      tokenPair,
      direction,
      amount,
      price,
      profitLoss,
      status: "completed",
    });
  }

  // Sort by date, newest first
  return randomTrades.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
};

// Line chart data for agent performance
export interface PerformanceDataPoint {
  date: string;
  value: number;
}

export const generatePerformanceData = (
  days: number = 30,
): PerformanceDataPoint[] => {
  const data: PerformanceDataPoint[] = [];
  const startValue = 100;
  let currentValue = startValue;

  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Random daily change between -3% and +5%
    const change = (Math.random() * 8 - 3) / 100;
    currentValue = currentValue * (1 + change);

    data.push({
      date: date.toISOString().split("T")[0],
      value: parseFloat(currentValue.toFixed(2)),
    });
  }

  return data;
};
