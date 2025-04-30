import { Errors, MyError } from "../constants/errors";
import { SWAPS, SWAPS_COLLECTION, USERS_COLLECTION } from "../mongo/collections";

export interface GetSwaps {
  user_evm_address: string;
}

export interface GetUserSwaps {
  user_hedera_address: string;
}

export class SwapsModel {
  async storeSwapInDB(args: SWAPS) {
    try {
      await SWAPS_COLLECTION.insertOne(args);
    } catch (err) {
      console.log("Error storing swaps in db", err);
      throw new MyError(Errors.NOT_STORE_SWAP);
    }
  }

  async getSwapsFromDB(args: GetSwaps): Promise<SWAPS[]> {
    try {
      const docs = SWAPS_COLLECTION.find(args).sort({ time: "desc" });
      const swaps: SWAPS[] = [];
      for await (const d of docs) {
        swaps.push(d);
      }
      return swaps;
    } catch (err) {
      console.error("Could not get swaps from db", err);
      throw new MyError(Errors.NOT_GET_SWAPS);
    }
  }

  async getUserSwapsFromDB(args: GetUserSwaps): Promise<SWAPS[]> {
    try {
      const user = await USERS_COLLECTION.findOne({address: args.user_hedera_address});
      if (!user) {
        return [];
      } else {
        const swaps = user.trades;
        swaps.sort((a, b) => a.time < b.time ? -1 : 1);
        return swaps;
      }
    } catch(err) {
      console.error("Could not get user swaps from db", err);
      throw new MyError(Errors.NOT_GET_SWAPS);
    }
  }
}

const swapsModel = new SwapsModel();
export default swapsModel;
