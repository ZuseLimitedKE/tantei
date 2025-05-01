import Api from "./api";
import type { PortfolioGraph, PortfolioStats } from "./types";
export function GetPortfolioStats(
  account_address: string,
): Promise<PortfolioStats> {
  return Api.get(`/users/portfolio/stats/${account_address}`);
}

export function GetPortfolioGraphData(
  account_address: string,
): Promise<PortfolioGraph[]> {
  return Api.get(`/users/portfolio/performance_history/${account_address}`);
}
