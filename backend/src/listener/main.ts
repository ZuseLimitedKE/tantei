import * as ethers from 'ethers'; //V6
import abi from "../../abi.json";
import "dotenv/config";
import { Errors, MyError } from '../constants/errors';
import lmdb from '../lmdb';
import { FROM_BLOCK_KEY } from '../constants/constants';
import { getHexStringFromBlock } from './get_hex_start_block';
import get_transactions from './get_transactions';

async function main() {
    try {
        if (!process.env.FROM_BLOCK) {
            console.log("Setup FROM_BLOCK in env");
            throw new MyError(Errors.INVALID_SETUP)
        }

        // Getting the from block
        let fromBlock: number;
        const storeFrom = await lmdb.read(FROM_BLOCK_KEY);
        const from = Number.parseInt(process.env.FROM_BLOCK);

        // Compare the block in env and the one in lama
        // Use the one that's bigger
        if (storeFrom) {
            const processedStoreFrom = Number.parseInt(storeFrom);
            if (processedStoreFrom > from) {
                fromBlock = processedStoreFrom;
            } else {
                fromBlock = from;
            }
        } else {
            fromBlock = from;
        }

        console.log("\n\nStarting from block =>", fromBlock);

        while (true) {
            console.log("\nFrom Block =>", fromBlock);
            const fromBlockStr = getHexStringFromBlock(fromBlock);
            const transactions = await get_transactions(fromBlockStr);
            for (const t of transactions) {
                if (t.to === "0x00000000000000000000000000000000002e7a5d") {
                    console.log("Transaction found", t);
                }
            }

            // Update from block variables
            fromBlock++;
            lmdb.store(FROM_BLOCK_KEY, fromBlock);
        }
    } catch (err) {
        if (err instanceof MyError) {
            if (err.message === Errors.INVALID_SETUP) {
                throw err;
            }
        }

        console.log("Error in processing transactions in main", err);
    }
}

(() => {
    main();
})();