export interface Agent{
    agentAddress: string;
    agentName: string;
    strategy: string;
}
export const tradingAgents: Agent[] = [
    {
        agentAddress: "0xA13f29BcD003d42aE410F62FfEE198F8A12e902B",
        agentName: "TrendSurfer V1",
        strategy: "This agent utilizes a momentum-based trend-following strategy on high-volume altcoins. It identifies medium-term trends using a combination of EMA crossovers (20/50) and volume spikes, confirming entries with RSI above 55. Exits are determined via ATR-based trailing stops to lock in gains while adapting to volatility. Suitable for swing trading across 4H to 1D timeframes."
    },
    {
        agentAddress: "0x3B92cAbC17A34F64Be9d2Ce7bE8D1B10D729ed99",
        agentName: "ScalpXpress",
        strategy: "ScalpXpress executes high-frequency trades based on order book imbalance and short-term momentum bursts. It monitors bid-ask spread shifts, sudden volume upticks, and micro price movements within 1-minute candles. Trades typically last from seconds to a few minutes. Ideal for highly liquid pairs like BTC/USDT and ETH/USDT during peak market hours."
    },
    {
        agentAddress: "0x81Fa9cF68a73bC7E1F7c8a8E6a31f3d84498c772",
        agentName: "GridGuru HBAR",
        strategy: "This agent runs a fully automated grid trading strategy on the HBAR/USDT pair. It places a series of buy and sell limit orders at fixed price intervals to capitalize on sideways or moderately volatile markets. It dynamically adjusts grid spacing based on recent volatility using Bollinger Bands and rebalances every 12 hours to lock profits and redistribute liquidity."
    },
    {
        agentAddress: "0x4D11EfAf50a5C127cb1E65E52f389eA2C33FeC12",
        agentName: "AI-Reversal Finder",
        strategy: "Leverages a lightweight neural network trained on 3 years of crypto price data to identify potential reversal points. Combines candlestick pattern recognition (like hammers and engulfing candles) with MACD divergence and volume anomalies. Prioritizes risk management by using dynamic position sizing and stop losses placed based on recent swing highs/lows."
    },
    {
        agentAddress: "0x92Fc6FDEc59B1C8A39012dD2Ad282c7AeD81EAF3",
        agentName: "NewsPulse AI",
        strategy: "NewsPulse AI scrapes real-time crypto news, Twitter sentiment, and on-chain whale alerts to anticipate short-term price spikes. It assigns sentiment scores and enters trades when a strong positive or negative signal aligns with volume surges. All entries are market orders with tight trailing stop-losses. Ideal for quick reactions to news-driven volatility."
    }
];
