import { FollowAgent } from "../schema/user";
import userModel, { UserModel } from "../model/users";
import { Errors, MyError } from "../constants/errors";
import agentModel, { AgentModel, AGENTWITHID } from "../model/agents";
import { TopicId } from "@hashgraph/sdk";
import { AGENTS } from "../mongo/collections";
import swapsController, { AgentTrades, SwapsController } from "./swaps";
import agentController, { AgentController } from "./agent";
import smartContract, { SmartContract } from "../model/smart_contract";
import pairsModel, { PairsModel } from "../model/pairs";
import tokenModel, { TokenModel } from "../model/tokens";

interface PotfolioStats {
  roi: number,
  value: number,
  last_trade: Date | null
}
export class UserController {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  async register(user_hedera_account: string) {
    try {
      // Check if user exists
      const userID = await this.userModel.getUser({ address: user_hedera_account });
      if (!userID) {
        // If not register
        let hederaID: TopicId
        try {
          hederaID = TopicId.fromString(user_hedera_account);
        } catch (err) {
          throw new MyError(Errors.INVALID_HEDERA_ACCOUNT);
        }
        const evm_address = hederaID.toSolidityAddress();
        await this.userModel.register(user_hedera_account, evm_address);
      }
    } catch (err) {
      if (err instanceof MyError) {
        if (err.message === Errors.INVALID_HEDERA_ACCOUNT) {
          throw err;
        }
      }
      console.log("Error registering user", err);
      throw new MyError(Errors.NOT_REGISTER_USER);
    }
  }

  async followAgent(args: FollowAgent, agentModel: AgentModel) {
    try {
      // Check if user exists
      const user = await this.userModel.getUser({ address: args.user_hedera_account });
      if (!user) {
        // Register user if doesn't exist
        await this.register(args.user_hedera_account);
      }

      // Check if agent exists
      const agent = await agentModel.GetAgent({ hedera_account_id: args.agent_hedera_account });
      if (!agent) {
        throw new MyError(Errors.AGENT_NOT_EXIST);
      }

      // Follow agent
      await this.userModel.followAgent(args);
    } catch (err) {
      if (err instanceof MyError) {
        if (err.message === Errors.AGENT_NOT_EXIST || err.message === Errors.INVALID_HEDERA_ACCOUNT) {
          throw err;
        }
      }

      console.error("Error following agent", err);
      throw new MyError(Errors.NOT_FOLLOW_AGENT);
    }
  }

  async getFollowedAgents(user_wallet: string, agentModel: AgentModel): Promise<AGENTWITHID[]> {
    try {
      // Get user
      const user = await this.userModel.getUser({ address: user_wallet });

      // If user does not exist return empty list
      if (!user) {
        return [];
      }

      // Return agents
      const agentAddresses = user.agents.map((a) => a.agent);
      const agents = await agentModel.GetAgents({ accounts: agentAddresses });
      return agents;
    } catch (err) {
      console.error("Error getting agents followed by user", err);
      throw new MyError(Errors.NOT_GET_FOLLOW_AGENTS);
    }
  }

  private async _getROIAndLastTrade(user_wallet: string, agentController: AgentController, smart_contract: SmartContract, agentModel: AgentModel): Promise<{ roi: number, last_trade: Date | null }> {
    try {
      // Get users agents
      const agents = await this.getFollowedAgents(user_wallet, agentModel);
      if (agents.length === 0) {
        return { roi: 0, last_trade: new Date() };
      }

      // Get closed trades for agents that user followed
      const trades: AgentTrades[] = [];
      for (let a of agents) {
        const a_id = a._id;
        const a_trades = await swapsController.getAgentTrades({ id: a_id }, agentController, smart_contract);

        if (a_trades.length < 1) {
          continue;
        }
        const a_closed_trades = a_trades.filter((t) => t.profit !== null);
        trades.push(...a_closed_trades);
      }


      // If no trades return default value
      if (trades.length < 1) {
        return { roi: 0, last_trade: null }
      }
      
      // Do profits / invested * 100
      let totalInvested = 0;
      let totalProfit = 0;
      trades.forEach((t) => {
        totalInvested += t.amount * t.price;
        totalProfit += t.amount * (t.profit ?? 0);
      })
      let latestTrade: Date
      latestTrade = trades[0].time;
      for (const t of trades) {
        if (t.time > latestTrade) {
          latestTrade = t.time;
        }
      }

      return { roi: (totalProfit / totalInvested) * 100, last_trade: latestTrade };
    } catch (err) {
      console.error("Could not get ROI", err);
      throw new MyError(Errors.NOT_GET_ROI);
    }
  }

  private async _getPortfolioValue(user_wallet: string, pairModel: PairsModel, tokensModel: TokenModel, smart_contract: SmartContract): Promise<number> {
    try {
      const prices = await pairModel.getAllPairs();
      const tokens = await tokensModel.getAllTokens();
      const user_tokens = await smart_contract.getUserTokens(user_wallet);
      let portfolio_value: number = 0;

      for (const token of user_tokens) {
        if (token.token === "HBAR") {
          portfolio_value += token.balance;
        } else {
          const symbol_known = tokens.find((t) => t.hedera_address === token.token);
          if (symbol_known) {
            const price_known = prices.find((p) => p.pair.includes("HBAR") && p.pair.includes(symbol_known.symbol));
            if (price_known) {
              portfolio_value += price_known.price * token.balance;
            } else {
              portfolio_value += 0;
            }
          } else {
            portfolio_value += 0;
          }
        }
      }

      return portfolio_value;
    } catch (err) {
      console.error("Could not get porfolio value", err);
      throw new MyError(Errors.NOT_GET_PORTFOLIO_VALUE);
    }
  }

  async getPortfolioStats(user_wallet: string, agentController: AgentController, smart_contract: SmartContract, pairModel: PairsModel, tokensModel: TokenModel, agentModel: AgentModel): Promise<PotfolioStats> {
    try {
      const { roi, last_trade } = await this._getROIAndLastTrade(user_wallet, agentController, smart_contract, agentModel);
      const portfolio_value = await this._getPortfolioValue(user_wallet, pairModel, tokensModel, smart_contract);

      return {
        roi,
        value: portfolio_value,
        last_trade
      }
    } catch (err) {
      console.error("Could not get portfolio stats", err);
      throw new MyError(Errors.NOT_GET_PORTFOLIO);
    }
  }
}

const userController = new UserController(userModel);
export default userController;