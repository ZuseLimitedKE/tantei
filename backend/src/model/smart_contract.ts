import {
  AccountId,
  Client,
  Hbar,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";
import "dotenv/config";
import { Errors, MyError } from "../constants/errors";
import { SWAPS } from "../mongo/collections";
import axios, { AxiosResponse } from "axios";
import { getTopicSchema, swapsSchema } from "../schema/topic";
import { accountBalanceSchema, mirrorNodeTransaction, MirrorNodeTransaction } from "../schema/transactions";
import { HBAR_DIVIDER } from "../listener/get_amount_set_in_transaction";
import { EvmUserDetails, evmUserDetailsSchema } from "../schema/user";
import { TokenDetails, tokenDetailsSchema } from "../schema/tokens";

interface Token {
  name: string,
  symbol: string,
  token: string,
  balance: number
}

export class SmartContract {
  private client: Client;
  private operatorID: AccountId;
  private operatorKey: PrivateKey;

  constructor() {
    if (
      !process.env.HEDERA_TESTNET_OPERATOR_ACCOUNT_ID ||
      !process.env.HEDERA_TESTNET_OPERATOR_PRIVATE_KEY
    ) {
      console.log(
        "Set HEDERA_OPERATOR_ACCOUNT_ID and HEDERA_OPERATOR_PRIVATE_KEY in env",
      );
      throw new MyError(Errors.INVALID_SETUP);
    }

    this.operatorID = AccountId.fromString(
      process.env.HEDERA_TESTNET_OPERATOR_ACCOUNT_ID,
    );
    this.operatorKey = PrivateKey.fromStringECDSA(
      process.env.HEDERA_TESTNET_OPERATOR_PRIVATE_KEY,
    );
    this.client = Client.forTestnet().setOperator(
      this.operatorID,
      this.operatorKey,
    );
    this.client.setDefaultMaxTransactionFee(new Hbar(10));
  }

  async createTopic(memo: string): Promise<string | null> {
    try {
      const topicCreateTx = new TopicCreateTransaction()
        .setTopicMemo(memo)
        .setSubmitKey(
          PrivateKey.fromStringECDSA(process.env.HEDERA_TESTNET_OPERATOR_PRIVATE_KEY),
        )
        .freezeWith(this.client);

      // Sign transaction
      const topicCreateTxSigned = await topicCreateTx.sign(this.operatorKey);

      // Submit transaction
      const topicCreateTxSubmitted = await topicCreateTxSigned.execute(
        this.client,
      );

      // Return topic ID
      const topicCreateTxReceipt = await topicCreateTxSubmitted.getReceipt(
        this.client,
      );
      return topicCreateTxReceipt.topicId?.toString() ?? null;
    } catch (err) {
      console.log("Could not create HCS-10 topic", err);
      throw new MyError(Errors.NOT_CREATE_TOPIC);
    }
  }

  async submitMessageToTopic(args: SWAPS, topicID: string, memo: string) {
    try {
      const topicMsgSubmitTx = new TopicMessageSubmitTransaction()
        .setTransactionMemo(memo)
        .setTopicId(topicID)
        .setMessage(JSON.stringify(args))
        .freezeWith(this.client);

      // Sign the transaction
      const topicMsgSubmitTxSigned = await topicMsgSubmitTx.sign(
        this.operatorKey,
      );

      // Submit the transaction
      await topicMsgSubmitTxSigned.execute(this.client);
    } catch (err) {
      console.log("Error submitting message to topic", err);
      throw new MyError(Errors.NOT_SUBMIT_MESSAGE_TOPIC);
    }
  }

  async getSwapsFromTopic(topicID: string): Promise<SWAPS[]> {
    try {
      if (!process.env.HEDERA_TESTNET_MIRROR_NODE) {
        console.log("Set TOPIC_HEDERA_MIRROR_NODE in env");
        throw new MyError(Errors.INVALID_SETUP);
      }

      const res = await axios.get(
        `${process.env.HEDERA_TESTNET_MIRROR_NODE}api/v1/topics/${topicID}/messages?encoding=base64&order=asc`,
      );
      if (res.status === 200) {
        const parsed = getTopicSchema.safeParse(res.data);
        if (parsed.success) {
          const data = parsed.data;
          const swaps: SWAPS[] = [];
          for (const m of data.messages) {
            const decodedMessage = atob(m.message);
            const parsedDecoded = swapsSchema.safeParse(
              JSON.parse(decodedMessage),
            );
            if (parsedDecoded.success) {
              const decodedData = parsedDecoded.data;
              swaps.push(decodedData);
            } else {
              console.log("Error decoding message", parsedDecoded.error);
              continue;
            }
          }

          return swaps;
        } else {
          console.log("Error parsing data", parsed.error);
          throw new MyError(Errors.NOT_GET_MESSAGES_FROM_TOPIC);
        }
      } else {
        console.log("Error in response", res.data);
        throw new MyError(Errors.NOT_GET_MESSAGES_FROM_TOPIC);
      }
    } catch (err) {
      if (err instanceof MyError) {
        if (err.message === Errors.INVALID_SETUP) {
          throw err;
        }
      }

      console.log("Could not get messages from topic", err);
      throw new MyError(Errors.NOT_GET_MESSAGES_FROM_TOPIC);
    }
  }

  async getLatestBlock(): Promise<number> {
    try {
      const result = await axios.post(`${process.env.HEDERA_JSON_RPC_RELAY}`, {
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        id: 341223,
        params: [],
      });

      if (result.status !== 200) {
        console.log("Error getting latest block", result.data);
        throw new MyError(Errors.NOT_GET_LATEST_BLOCK);
      }

      const hexBlockNumber = result.data.result;
      if (hexBlockNumber) {
        return Number.parseInt(hexBlockNumber, 16);
      } else {
        console.log("Response did not return latest block", result.data);
        throw new MyError(Errors.NOT_GET_LATEST_BLOCK);
      }
    } catch (err) {
      console.error("Error getting latest block", err);
      throw new MyError(Errors.NOT_GET_LATEST_BLOCK);
    }
  }

  async getUserTokens(user_wallet: string): Promise<Token[]> {
    try {
      if (!process.env.HEDERA_MIRROR_NODE) {
        console.error("Set HEDERA_MIRROR_NODE in env");
        throw new MyError(Errors.INVALID_SETUP);
      }

      let result: AxiosResponse;

      try {
        result = await axios.get(`${process.env.HEDERA_MIRROR_NODE}api/v1/accounts/${user_wallet}`);
      } catch (err) {
        try {
          result = await axios.get(`${process.env.HEDERA_TESTNET_MIRROR_NODE}api/v1/accounts/${user_wallet}`);
        } catch (err) {
          console.error("Could not get user's tokens", err);
          throw new MyError(Errors.NOT_GET_USER_TOKENS);
        }
      }

      if (result.status !== 200) {
        console.error("Error in get account data request", result.data);
        throw new MyError(Errors.NOT_GET_USER_TOKENS);
      }

      const parsed = accountBalanceSchema.safeParse(result.data);
      if (parsed.success) {
        const data = parsed.data;
        const tokens: Token[] = [];
        tokens.push({
          name: "HBAR",
          symbol: "HBAR",
          token: "HBAR",
          balance: data.balance.balance / HBAR_DIVIDER
        });

        for (const t of data.balance.tokens) {
          if (t.balance > 0) {
            try {
              const tokenDetails = await smartContract._getTokenDetails(t.token_id);
              tokens.push({
                name: tokenDetails?.name ?? "",
                symbol: tokenDetails?.symbol ?? "",
                // token: t.token_id,
                token: t.token_id,
                balance: tokenDetails?.decimals ? t.balance / (10**tokenDetails.decimals) : t.balance
              })
            } catch (err) {
              console.error("Error getting token details", t);
            }
          }
        }

        return tokens;
      } else {
        console.error("Error parsing data", parsed.error);
        throw new MyError(Errors.NOT_GET_USER_TOKENS);
      }
    } catch (err) {
      console.error("Could not get user's tokens", err);
      throw new MyError(Errors.NOT_GET_USER_TOKENS);
    }
  }

  async getUserDetails(evm_address: string): Promise<EvmUserDetails | null> {
    try {
      if (!process.env.HEDERA_TESTNET_MIRROR_NODE) {
        console.log("Set HEDERA_TESTNET_MIRROR_NODE in env");
        throw new MyError(Errors.INVALID_SETUP);
      }

      const result = await axios.get(`${process.env.HEDERA_TESTNET_MIRROR_NODE}api/v1/accounts/${evm_address}`);
      if (result.status !== 200) {
        console.log("Error in getting result", result.data);
        throw new MyError(Errors.NOT_GET_USER_DETAILS);
      }

      const parsed = evmUserDetailsSchema.safeParse(result.data);
      if (parsed.success) {
        const data = parsed.data;
        return data;
      } else {
        console.log("Error parsing data", parsed.error);
        throw new MyError(Errors.NOT_GET_USER_DETAILS);
      }
    } catch (err) {
      console.log("Error getting user details", err);
      throw new MyError(Errors.NOT_GET_USER_DETAILS);
    }
  }

  async getTransactionDetails(tx_hash: String): Promise<MirrorNodeTransaction | null> {
    try {
      if (!process.env.HEDERA_TESTNET_MIRROR_NODE) {
        console.log("Set HEDERA_TESTNET_MIRROR_NODE in env");
        throw new MyError(Errors.INVALID_SETUP);
      }

      const result = await axios.get(`${process.env.HEDERA_TESTNET_MIRROR_NODE}api/v1/contracts/results/${tx_hash}`);
      if (result.status !== 200) {
        console.log("Error getting info");
        throw new MyError(Errors.NOT_GET_TRANSACTION_DETAILS);
      }

      const parsed = mirrorNodeTransaction.safeParse(result.data);
      if (parsed.success) {
        return parsed.data
      } else {
        return null;
      }
    } catch (err) {
      console.log("Error getting transaction details", err);
      throw new MyError(Errors.NOT_GET_TRANSACTION_DETAILS);
    }
  }

  async _getTokenDetails(hedera_id: string): Promise<TokenDetails | null> {
    try {
      if (!process.env.HEDERA_MIRROR_NODE) {
        console.error("Set HEDERA_MIRROR_NODE in env");
        throw new MyError(Errors.INVALID_SETUP);
      }

      const result = await axios.get(`${process.env.HEDERA_MIRROR_NODE}api/v1/tokens/${hedera_id}`);
      if (result.status !== 200) {
        console.error("Error in request", result.data);
        throw new MyError(Errors.NOT_GET_TOKEN_DETAILS);
      }

      const parsed = tokenDetailsSchema.safeParse(result.data);
      if (parsed.success) {
        const data = parsed.data;
        return data;
      } else {
        console.error("Error parsing", parsed.error);
        throw new MyError(Errors.NOT_GET_TOKEN_DETAILS)
      }
    } catch (err) {
      console.error("Error getting token details", err);
      throw new MyError(Errors.NOT_GET_TOKEN_DETAILS);
    }
  }
}

const smartContract = new SmartContract();
export default smartContract;
