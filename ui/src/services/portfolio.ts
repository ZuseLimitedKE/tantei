import Api from "./api";
import type { PortfolioGraphRawData, PortfolioStats } from "./types";
export function GetPortfolioStats(
  account_address: string,
): Promise<PortfolioStats> {
  return Api.get(`/users/portfolio/stats/${account_address}`);
}

export function GetPortfolioGraphData(
  account_address: string,
): Promise<PortfolioGraphRawData[]> {
  return Api.get(`/users/portfolio/performance_history/${account_address}`);
}
