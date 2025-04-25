import { Errors, MyError } from "../constants/errors";
import { PAIRS, PAIRS_COLLECTION } from "../mongo/collections";

export class PairsModel {
  async storePair(args: PAIRS) {
    try {
      if (args.pair.length !== 2) {
        throw new MyError(Errors.INVALID_PAIR);
      }

      await PAIRS_COLLECTION.insertOne(args);
    } catch (err) {
      if (err instanceof MyError) {
        if (err.message === Errors.INVALID_PAIR) {
          throw err;
        }
      }

      console.log("Error storing pair", err);
      throw new MyError(Errors.NOT_STORE_PAIR);
    }
  }

  async updatePairPrice(price: number, pair: string[]) {
    try {
      if (pair.length !== 2) {
        throw new MyError(Errors.INVALID_PAIR);
      }

      await PAIRS_COLLECTION.updateOne({ pair }, { $set: { price } });
    } catch (err) {
      if (err instanceof MyError) {
        if (err.message === Errors.INVALID_PAIR) {
          throw err;
        }
      }

      console.log("Could not update pair", err);
      throw new MyError(Errors.NOT_UPDATE_PAIR);
    }
  }

  async getPair(pair: string[]): Promise<PAIRS | null> {
    try {
      if (pair.length !== 2) {
        throw new MyError(Errors.INVALID_PAIR);
      }

      const doc = await PAIRS_COLLECTION.findOne({ pair });
      return doc;
    } catch (err) {
      if (err instanceof MyError) {
        if (err.message === Errors.INVALID_PAIR) {
          throw err;
        }
      }

      console.log("Could not get pair", err);
      throw new MyError(Errors.NOT_GET_PAIR);
    }
  }

  async getAllPairs(): Promise<PAIRS[]> {
    try {
      const pairs: PAIRS[] = [];
      const cursor = PAIRS_COLLECTION.find();
      for await (const doc of cursor) {
        pairs.push(doc);
      }
      
      return pairs;
    } catch(err) {
      console.error("Could not get pairs", err);
      throw new MyError(Errors.NOT_GET_PAIR);
    }
  }
}

const pairsModel = new PairsModel();
export default pairsModel;
