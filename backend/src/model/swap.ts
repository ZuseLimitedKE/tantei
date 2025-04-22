import { Errors, MyError } from "../constants/errors";
import { SWAPS, SWAPS_COLLECTION } from "../mongo/collections";

export class SwapsModel {
    async storeSwapInDB(args: SWAPS) {
        try {
            await SWAPS_COLLECTION.insertOne(args);
        } catch(err) {
            console.log("Error storing swaps in db", err);
            throw new MyError(Errors.NOT_STORE_SWAP);
        }
    }
}

const swapsModel = new SwapsModel();
export default swapsModel;