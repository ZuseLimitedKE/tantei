import axios from "axios";
import { Errors, MyError } from "../constants/errors";
import { TOKENS, TOKENS_COLLECTION } from "../mongo/collections";
import {TokenId} from "@hashgraph/sdk";
import "dotenv/config";

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
            if (!process.env.HEDERA_MIRROR_NODE) {
                console.log("Set HEDERA_MIRROR_NODE in env");
                throw new MyError(Errors.INVALID_SETUP);
            }

            const tokenID = TokenId.fromSolidityAddress(args.evm_address);
            const tokenIDStr = tokenID.toString();
            
            const res = await axios.get(`${process.env.HEDERA_MIRROR_NODE}api/v1/tokens/${tokenIDStr}`);
            
            if (res.status === 200) {
                const symbol = res.data.symbol;
                return {
                    symbol,
                    hedera_address: tokenIDStr,
                    evm_address: args.evm_address
                }
            } else {
                console.log("Error in request", res.data);
                throw new MyError(Errors.NOT_GET_TOKEN_DETAILS);
            }
        } catch(err) {
            console.log("Could not get token details from mirror node", err);
            throw new MyError(Errors.NOT_GET_TOKEN_DETAILS);
        }
    }


}

const tokenModel = new TokenModel();
export default tokenModel;
(async () => {
    const tokenid = await tokenModel.getTokenDetailsFromMirrorNode({evm_address: "0x000000000000000000000000000000000042b2e0"});
    console.log(tokenid);
    process.exit(0);
})()