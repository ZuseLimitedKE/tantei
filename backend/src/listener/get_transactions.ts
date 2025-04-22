import axios from "axios";
import { Errors, MyError } from "../constants/errors";
import { getTransactionsSchema, Transactions } from "../schema/transactions";
import "dotenv/config";

export default async function get_transactions(from_block: string): Promise<Transactions[]> {
    try {
        console.log("From block", from_block);
        if (!process.env.HEDERA_JSON_RPC_RELAY) {
            console.log("Setup HEDERA_JSON_RPC_RELAY in env");
            throw new MyError(Errors.INVALID_SETUP);
        }

        const results = await axios.post(process.env.HEDERA_JSON_RPC_RELAY, {
            jsonrpc: "2.0",
            method: "eth_getBlockByNumber",
            id: 341223,
            params: [
                from_block,
                true
            ]
        });

        const parsed = getTransactionsSchema.safeParse(results.data);
        if (parsed.success) {
            const data = parsed.data;
            return data.result.transactions;
        } else {
            console.log(parsed.error);
            throw new MyError(Errors.NOT_GET_TRANSACTIONS)
        }
    } catch(err) {
        if (err instanceof MyError) {
            if (err.message === Errors.INVALID_SETUP || err.message === Errors.NOT_GET_TRANSACTIONS) {
                throw err;
            }
        }

        console.log("Error getting transactions", err);
        throw new MyError(Errors.UNKOWN);
    }
}