
import type { AgentData } from "@/components/agents/AgentCard";

// Mock agent data
export const mockAgents: AgentData[] = [
  {
    id: "hbar-momentum-x",
    name: "HBAR Momentum X",
    avatarUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=128&auto=format&fit=crop",
    description: "Algorithmic strategy that tracks momentum indicators across DEXs to capitalize on HBAR price movements with minimal slippage.",
    strategyType: "Momentum Trading",
    roi: 32.4,
    roiTimeframe: "30d",
    riskScore: 6,
    followers: 2874,
    trades: 164,
    verified: true
  },
  {
    id: "hedera-defi-yield",
    name: "Hedera DeFi Yield Hunter",
    avatarUrl: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=128&auto=format&fit=crop",
    description: "Automatically identifies and allocates capital to the highest yield opportunities across the Hedera DeFi ecosystem.",
    strategyType: "DeFi Yield",
    roi: 18.7,
    roiTimeframe: "30d",
    riskScore: 4,
    followers: 1459,
    trades: 217,
    verified: true
  },
  {
    id: "saucerswap-arb",
    name: "SaucerSwap Arbitrageur",
    avatarUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=128&auto=format&fit=crop",
    description: "Exploits price discrepancies between SaucerSwap and other DEXs, executing arbitrage trades for consistent, low-risk returns.",
    strategyType: "Arbitrage",
    roi: 9.2,
    roiTimeframe: "30d",
    riskScore: 2,
    followers: 3105,
    trades: 483,
    verified: true
  },
  {
    id: "hbar-swing-trader",
    name: "HBAR Swing Trader",
    avatarUrl: "https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?q=80&w=128&auto=format&fit=crop",
    description: "Capitalizes on medium-term price movements in HBAR using technical analysis and market sentiment indicators.",
    strategyType: "Swing Trading",
    roi: 41.5,
    roiTimeframe: "30d",
    riskScore: 7,
    followers: 926,
    trades: 87,
    verified: false
  },
  {
    id: "hashgraph-scalper",
    name: "Hashgraph Scalper",
    avatarUrl: "https://images.unsplash.com/photo-1614853735426-4be54638d1dd?q=80&w=128&auto=format&fit=crop",
    description: "High-frequency trading bot that exploits small price gaps in HBAR and other Hedera-based assets for quick profits.",
    strategyType: "Scalping",
    roi: 27.3,
    roiTimeframe: "30d",
    riskScore: 8,
    followers: 542,
    trades: 346,
    verified: false
  },
  {
    id: "hedera-trend-follower",
    name: "Hedera Trend Follower",
    avatarUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=128&auto=format&fit=crop",
    description: "Uses advanced trend detection algorithms to identify and follow established market trends across the Hedera ecosystem.",
    strategyType: "Trend Following",
    roi: 15.8,
    roiTimeframe: "30d",
    riskScore: 5,
    followers: 1273,
    trades: 132,
    verified: true
  },
  {
    id: "hashpack-hedger",
    name: "HashPack Hedger",
    avatarUrl: "https://images.unsplash.com/photo-1621501103258-3e132c689a49?q=80&w=128&auto=format&fit=crop",
    description: "Risk-managed strategy that maintains exposure to HBAR while hedging against downside with algorithmic position management.",
    strategyType: "Hedging",
    roi: 7.9,
    roiTimeframe: "30d",
    riskScore: 3,
    followers: 867,
    trades: 104,
    verified: false
  },
  {
    id: "hbar-dca-optimizer",
    name: "HBAR DCA Optimizer",
    avatarUrl: "https://images.unsplash.com/photo-1607893378714-007fd47c8719?q=80&w=128&auto=format&fit=crop",
    description: "Smart dollar-cost averaging strategy that optimizes buy-ins based on volatility indicators and market conditions.",
    strategyType: "DCA Strategy",
    roi: 12.4,
    roiTimeframe: "30d",
    riskScore: 2,
    followers: 1892,
    trades: 58,
    verified: true
  }
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
  const tradePairs = tokens.map(token => `${token}/USDC`);
  
  const randomTrades: TradeData[] = [];
  
  // Generate between 15-30 trades
  const tradeCount = Math.floor(Math.random() * 16) + 15;
  
  for (let i = 0; i < tradeCount; i++) {
    const direction = Math.random() > 0.5 ? "buy" : "sell";
    const tokenPair = tradePairs[Math.floor(Math.random() * tradePairs.length)];
    const amount = parseFloat((Math.random() * 1000 + 100).toFixed(2));
    const price = parseFloat((Math.random() * 10).toFixed(4));
    const profitLoss = direction === "sell" 
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
      status: "completed"
    });
  }
  
  // Sort by date, newest first
  return randomTrades.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Line chart data for agent performance
export interface PerformanceDataPoint {
  date: string;
  value: number;
}

export const generatePerformanceData = (days: number = 30): PerformanceDataPoint[] => {
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
      date: date.toISOString().split('T')[0],
      value: parseFloat(currentValue.toFixed(2))
    });
  }
  
  return data;
};
