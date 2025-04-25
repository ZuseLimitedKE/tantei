import axios from "axios";
import { Errors, MyError } from "../constants/errors";
import { TOKENS, TOKENS_COLLECTION } from "../mongo/collections";
import { TokenId } from "@hashgraph/sdk";
import "dotenv/config";

export interface GetTokenDetails {
  evm_address: string;
}

export class TokenModel {
  async getTokenDetailsFromDatabase(
    args: GetTokenDetails,
  ): Promise<TOKENS | null> {
    try {
      const res = await TOKENS_COLLECTION.findOne({
        evm_address: args.evm_address,
      });
      return res;
    } catch (err) {
      console.log("Error getting token details from db", err);
      throw new MyError(Errors.NOT_GET_TOKEN_DETAILS);
    }
  }

  async getTokenDetailsFromMirrorNode(
    args: GetTokenDetails,
  ): Promise<TOKENS | null> {
    try {
      if (!process.env.HEDERA_MIRROR_NODE) {
        console.log("Set HEDERA_MIRROR_NODE in env");
        throw new MyError(Errors.INVALID_SETUP);
      }

      const tokenID = TokenId.fromSolidityAddress(args.evm_address);
      const tokenIDStr = tokenID.toString();

      const res = await axios.get(
        `${process.env.HEDERA_MIRROR_NODE}api/v1/tokens/${tokenIDStr}`,
      );

      if (res.status === 200) {
        const symbol = res.data?.symbol ?? null;

        if (!symbol) {
          return null;
        }

        return {
          symbol,
          hedera_address: tokenIDStr,
          evm_address: args.evm_address,
        };
      } else {
        console.log("Error in request", res.data);
        throw new MyError(Errors.NOT_GET_TOKEN_DETAILS);
      }
    } catch (err) {
      console.log("Could not get token details from mirror node", err);
      throw new MyError(Errors.NOT_GET_TOKEN_DETAILS);
    }
  }

  async storeToken(args: TOKENS) {
    try {
      await TOKENS_COLLECTION.insertOne(args);
    } catch (err) {
      console.log("Error storing token in db", err);
      throw new MyError(Errors.NOT_STORE_TOKEN);
    }
  }
}

const tokenModel = new TokenModel();
export default tokenModel;
