import Api from "./api";
import type { PortfolioStats } from "./types";
export function GetPortfolioStats(
  account_address: string,
): Promise<PortfolioStats> {
  return Api.get(`/portfolio/stats/${account_address}`);
}
