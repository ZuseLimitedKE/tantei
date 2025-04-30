import Api from "./api";
import type { Token } from "./types";
export function GetTokenAllocation(account_address: string): Promise<Token[]> {
  return Api.get(`/users/tokens/${account_address}`);
}
