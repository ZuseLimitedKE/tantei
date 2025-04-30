import Api from "./api";
import type { TradeData } from "./types";

export function GetUserTrades(account_address: string): Promise<TradeData[]> {
  return Api.get(`/users/trades/${account_address}`);
}
