import { ObjectId } from "mongodb";
import { Errors, MyError } from "../constants/errors";
import userModel, { UserModel } from "../model/users";
import { SWAPS } from "../mongo/collections";
import { AgentModel } from "../model/agents";
import { AgentController } from "./agent";
import { SmartContract } from "../model/smart_contract";
import swapsModel, { SwapsModel } from "../model/swap";

interface AgentTrades {
  time: Date;
  tokenPair: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  profit: number | null;
}

interface GetAgentSwaps {
  id: string;
}

export class SwapsController {
  private model: SwapsModel;

  constructor(model: SwapsModel) {
    this.model = model;
  }

  private async _getSwaps(
    args: GetAgentSwaps,
    agentController: AgentController,
    smartContract: SmartContract,
  ): Promise<SWAPS[]> {
    try {
      const agentDetails = await agentController.getAgentById(args.id);
      if (agentDetails) {
        let swaps: SWAPS[];
        try {
          swaps = await smartContract.getSwapsFromTopic(agentDetails.topic_id);
          return swaps;
        } catch (err) {
          console.log("Could not get swaps from topic", err);
        }

        // Get swaps from database if call from topic fails
        swaps = await this.model.getSwapsFromDB({
          user_evm_address: agentDetails.address,
        });
        return swaps;
      } else {
        throw new MyError(Errors.AGENT_NOT_EXIST);
      }
    } catch (err) {
      if (err instanceof MyError) {
        if (err.message === Errors.AGENT_NOT_EXIST) {
          throw err;
        }
      }

      console.error("Error getting swaps", err);
      throw new MyError(Errors.NOT_GET_SWAPS);
    }
  }

  private _process_swaps(swaps: SWAPS[]): AgentTrades[] {
    try {
      const trades: AgentTrades[] = [];
      const open_trades: SWAPS[] = [];

      let i = 0;
      let s: SWAPS;
      while (true) {
        if (i === swaps.length - 1) {
          break;
        }

        s = swaps[i];
        // Check if there is a pair in open_trades
        const exists = open_trades.some((t) => t.token_pair === s.token_pair);
        if (!exists) {
          // If not insert it to open trades
          open_trades.push(s);
          i++;
        } else {
          // Get the oldest swap with the same pair to see if the swap closes it
          const oldest_swap = open_trades.find(
            (t) => t.token_pair === s.token_pair,
          );

          // If the type of the oldest swap is the same as the new one add new one to open_trades
          if (oldest_swap!.type === s.type) {
            open_trades.push(s);
            i++;
          } else {
            if (oldest_swap!.in.amount === s.in.amount) {
              // Insert closed trade
              trades.push({
                time: oldest_swap!.time,
                tokenPair: oldest_swap!.token_pair.join("/"),
                type: oldest_swap!.type,
                amount: oldest_swap!.in.amount,
                price: oldest_swap!.price,
                profit: s.in.amount - oldest_swap!.in.amount,
              });

              // Remove oldest swap
              const index = open_trades.indexOf(oldest_swap!);
              open_trades.splice(index, 1);
              i++;
            } else if (oldest_swap!.in.amount < s.in.amount) {
              // Insert closed trade
              trades.push({
                time: oldest_swap!.time,
                tokenPair: oldest_swap!.token_pair.join("/"),
                type: oldest_swap!.type,
                amount: oldest_swap!.in.amount,
                price: oldest_swap!.price,
                profit: s.in.amount - oldest_swap!.in.amount,
              });

              // Remove oldest swap
              const index = open_trades.indexOf(oldest_swap!);
              open_trades.splice(index, 1);
            } else {
              oldest_swap!.in.amount = oldest_swap!.in.amount - s.in.amount;
            }
          }
        }
      }

      // Insert remaining open trades to closed trades
      open_trades.forEach((o) => {
        trades.push({
          time: o.time,
          tokenPair: o.token_pair.join("/"),
          type: o.type,
          amount: o.in.amount,
          price: o.price,
          profit: null,
        });
      });
      return trades;
    } catch (err) {
      console.error("Error processing swaps", err);
      throw new MyError(Errors.NOT_PROCESS_SWAPS);
    }
  }

  async getAgentTrades(
    args: GetAgentSwaps,
    agentController: AgentController,
    smartContract: SmartContract,
  ): Promise<AgentTrades[]> {
    try {
      const swaps = await this._getSwaps(args, agentController, smartContract);

      // How to calculate profit
      const trades = this._process_swaps(swaps);
      return trades;
    } catch (err) {
      if (err instanceof MyError) {
        if (err.message === Errors.AGENT_NOT_EXIST) {
          throw err;
        }
      }

      console.log("Error getting account swaps", err);
      throw new MyError(Errors.NOT_GET_SWAPS);
    }
  }
}

const swapsController = new SwapsController(swapsModel);
export default swapsController;
