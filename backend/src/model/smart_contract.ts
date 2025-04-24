import { AccountId, Client, Hbar, PrivateKey, TopicCreateTransaction, TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import "dotenv/config";
import { Errors, MyError } from "../constants/errors";
import { SWAPS } from "../mongo/collections";
import axios from "axios";
import { getTopicSchema, swapsSchema } from "../schema/topic";

export class SmartContract {
    private client: Client;
    private operatorID: AccountId;
    private operatorKey: PrivateKey;

    constructor() {
        if (!process.env.HEDERA_OPERATOR_ACCOUNT_ID || !process.env.HEDERA_OPERATOR_PRIVATE_KEY) {
            console.log("Set HEDERA_OPERATOR_ACCOUNT_ID and HEDERA_OPERATOR_PRIVATE_KEY in env");
            throw new MyError(Errors.INVALID_SETUP);
        }

        this.operatorID = AccountId.fromString(process.env.HEDERA_OPERATOR_ACCOUNT_ID);
        this.operatorKey = PrivateKey.fromStringECDSA(process.env.HEDERA_OPERATOR_PRIVATE_KEY);
        this.client = Client.forTestnet().setOperator(this.operatorID, this.operatorKey);
        this.client.setDefaultMaxTransactionFee(new Hbar(10));
    }

    async createTopic(agent_name: string): Promise<string | null> {
        try {
            const topicCreateTx = new TopicCreateTransaction()
                .setTopicMemo(`Topic for Tantei Agent ${agent_name}`)
                .setSubmitKey(PrivateKey.fromStringECDSA(process.env.HEDERA_OPERATOR_PRIVATE_KEY))
                .freezeWith(this.client);

            // Sign transaction
            const topicCreateTxSigned = await topicCreateTx.sign(this.operatorKey);

            // Submit transaction
            const topicCreateTxSubmitted = await topicCreateTxSigned.execute(this.client);

            // Return topic ID
            const topicCreateTxReceipt = await topicCreateTxSubmitted.getReceipt(this.client);
            return topicCreateTxReceipt.topicId?.toString() ?? null
        } catch (err) {
            console.log("Could not create HCS-10 topic", err);
            throw new MyError(Errors.NOT_CREATE_TOPIC);
        }
    }

    async submitMessageToTopic(args: SWAPS, topicID: string, agent_name: string) {
        try {
            const topicMsgSubmitTx = new TopicMessageSubmitTransaction()
                .setTransactionMemo(`$Tantei Agent: ${agent_name} Transaction Record`)
                .setTopicId(topicID)
                .setMessage(JSON.stringify(args))
                .freezeWith(this.client);

            // Sign the transaction 
            const topicMsgSubmitTxSigned = await topicMsgSubmitTx.sign(this.operatorKey);

            // Submit the transaction 
            await topicMsgSubmitTxSigned.execute(this.client);
        } catch (err) {
            console.log("Error submitting message to topic", err);
            throw new MyError(Errors.NOT_SUBMIT_MESSAGE_TOPIC);
        }
    }

    async getSwapsFromTopic(topicID: string): Promise<SWAPS[]> {
        try {
            if (!process.env.TOPIC_HEDERA_MIRROR_NODE) {
                console.log("Set TOPIC_HEDERA_MIRROR_NODE in env");
                throw new MyError(Errors.INVALID_SETUP);
            }

            const res = await axios.get(`${process.env.TOPIC_HEDERA_MIRROR_NODE}api/v1/topics/${topicID}/messages?encoding=base64&order=asc`);
            if (res.status === 200) {
                const parsed = getTopicSchema.safeParse(res.data);
                if (parsed.success) {
                    const data = parsed.data;
                    const swaps: SWAPS[] = [];
                    for (const m of data.messages) {
                        const decodedMessage = atob(m.message);
                        const parsedDecoded = swapsSchema.safeParse(JSON.parse(decodedMessage));
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
        } catch(err) {
            if (err instanceof MyError) {
                if (err.message === Errors.INVALID_SETUP) {
                    throw err;
                }
            }


            console.log("Could not get messages from topic", err);
            throw new MyError(Errors.NOT_GET_MESSAGES_FROM_TOPIC)
        }
    }
}

const smartContract = new SmartContract();
export default smartContract;