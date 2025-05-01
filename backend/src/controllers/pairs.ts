import { Errors, MyError } from "../constants/errors";
import pairsModel, { PairsModel } from "../model/pairs";
import { PAIRS } from "../mongo/collections";

interface ProcessPair {
  pair: string[];
  price: Record<string, number>;
}

export class PairController {
  private model: PairsModel;

  constructor(model: PairsModel) {
    this.model = model;
  }

  async process_transaction_pair(args: ProcessPair): Promise<PAIRS> {
    try {
      // Check if pair exists
      const pair = await this.model.getPair(args.pair);

      if (pair) {
        // Update pair price
        const base = pair.pair[0] as string;
        const quote = pair.pair[1] as string;
        const price = args.price[quote] / args.price[base];
        await this.model.updatePairPrice(price, args.pair);

        // Return
        return {
          pair: pair.pair,
          price,
        };
      } else {
        const base = args.pair[0] as string;
        const quote = args.pair[1] as string;
        const price = args.price[quote] / args.price[base];

        // If not create pair record
        const pair = {
          pair: args.pair,
          price,
        };
        await this.model.storePair(pair);

        // Return created record
        return pair;
      }
    } catch (err) {
      if (err instanceof MyError) {
        if (err.message === Errors.INVALID_PAIR) {
          throw err;
        }
      }

      console.log("Error processing transaction pair", err);
      throw new MyError(Errors.NOT_PROCESS_PAIR);
    }
  }
}

const pairController = new PairController(pairsModel);
export default pairController;
