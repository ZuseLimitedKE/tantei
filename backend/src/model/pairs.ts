import { Errors, MyError } from "../constants/errors";
import { PAIRS, PAIRS_COLLECTION } from "../mongo/collections";

export class PairsModel {
    async storePair(args: PAIRS) {
        try {
            if (args.pair.length !== 2) {
                throw new MyError(Errors.INVALID_PAIR);
            }

            await PAIRS_COLLECTION.insertOne(args);
        } catch(err) {
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
        } catch(err) {
            if (err instanceof MyError) {
                if (err.message === Errors.INVALID_PAIR) {
                    throw err;
                }
            }

            console.log("Could not update pair", err);
        }
    }
}

const pairsModel = new PairsModel();
export default pairsModel;

(async () => {
    await pairsModel.updatePairPrice(
        0.1,
        ["TEST", "TEST2", "TEST3"],
    );
    process.exit(0);
})()