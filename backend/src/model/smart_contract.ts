import { AccountId, Client, Hbar, PrivateKey, TopicCreateTransaction, TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import "dotenv/config";
import { Errors, MyError } from "../constants/errors";
import { SWAPS } from "../mongo/collections";

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
}

const smartContract = new SmartContract();
export default smartContract;
(async () => {
    await smartContract.submitMessageToTopic({
        in: {
            amount: 1,
            tokenID: "test",
            symbol: "TEST"
        },
        out: {
            amount: 1,
            tokenID: "test",
            symbol: "TEST"
        },
        time: new Date(),
        token_pair: ["TEST", "TEST"],
        user_evm_address: "TEST",
        price: 1
    }, "0.0.5897088", "Test Agent");
    process.exit(0);
})()