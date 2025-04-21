import { Transactions } from "../constants/types";
import userModel, { UserModel } from "../model/users";

// Receive a transaction that has a to address belonging to swap contract
async function process_transaction(transaction: Transactions, userModel: UserModel) {
    try {
        // Check if transaction called by an address belonging to user of site
        const user = await userModel.getUser({ evm_address: transaction.to });
        if (user) {
            console.log("user exists");
            // Decode transaction to get method

            // Extract address list

            // Get details of first and last transaction in transaction list

            // Depending on method (HBAR -> Token, Token -> Token, Token -> HBAR)

            // Get amounts of tokens

            // Store where I can retrieve later and in HCS-10
        } else {
            console.log("User does not use platform")
        }
    } catch (err) {
        console.log("Error processing transaction", err);
    }
}

(async () => {
    process_transaction({
        "blockHash": "0x66a01e78f7d3e97d5a8e036b7824aaf5d37cf85f6f8413e874da3bf7dee4ab77",
        "blockNumber": "0x4aa7773",
        "chainId": "0x127",
        "from": "0x00000000000000000000000000000000003be991",
        "gas": "0x32c80",
        "gasPrice": "0x0",
        "hash": "0xde44828541061c97edb87f8ad623824484934ac4ef7680545a49f97a74cdc3c4",
        "input": "0x60d1e85d00000000000000000000000000000000000000000000000000000000003c7f840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000babaecd4000000000000000000000000000000000000000000000000000000000050ffa5ec",
        "nonce": "0x0",
        "r": "0x0",
        "s": "0x0",
        "to": "0xe0373a9fddae28d9fb2b6a8150d4850b389d2493",
        "transactionIndex": "0x5",
        "type": "0x0",
        "v": "0x0",
        "value": "0x0"
    }, userModel);
    process.exit();
})()