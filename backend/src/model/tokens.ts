import { Errors, MyError } from "../constants/errors";
import { TOKENS, TOKENS_COLLECTION } from "../mongo/collections";
import {TokenId} from "@hashgraph/sdk";

interface GetTokenDetails {
    evm_address: string
}

export class TokenModel {
    async getTokenDetailsFromDatabase(args: GetTokenDetails): Promise<TOKENS | null> {
        try {
            const res = await TOKENS_COLLECTION.findOne({evm_address: args.evm_address});
            return res
        } catch(err) {
            console.log("Error getting token details from db", err);
            throw new MyError(Errors.NOT_GET_TOKEN_DETAILS);
        }
    }

    async getTokenDetailsFromMirrorNode(args: GetTokenDetails): Promise<TOKENS> {
        try {
            const tokenID = TokenId.fromSolidityAddress(args.evm_address);
            const tokenIDStr = tokenID.toString();
            console.log(tokenIDStr);
        } catch(err) {
            console.log("Could not get token details from mirror node", err);
            throw new MyError(Errors.NOT_GET_TOKEN_DETAILS);
        }
    }
}

const tokenModel = new TokenModel();
export default tokenModel;
(async () => {
    const tokenid = tokenModel.getTokenDetailsFromMirrorNode({evm_address: "0x000000000000000000000000000000000042b2e0"});
    process.exit(0);
})()