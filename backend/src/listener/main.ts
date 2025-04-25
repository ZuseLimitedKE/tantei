import "dotenv/config";
import { Errors, MyError } from "../constants/errors";
import lmdb from "../lmdb";
import { FROM_BLOCK_KEY } from "../constants/constants";
import { getHexStringFromBlock } from "./get_hex_start_block";
import get_transactions from "./get_transactions";
import process_transaction from "./process_transaction";
import agentModel from "../model/agents";
import tokensController from "../controllers/tokens";
import swapsModel from "../model/swap";
import pairController from "../controllers/pairs";
import smartContract from "../model/smart_contract";
import sleep from "../constants/helpers";

async function main() {
  try {
    if (!process.env.FROM_BLOCK) {
      console.log("Setup FROM_BLOCK in env");
      throw new MyError(Errors.INVALID_SETUP);
    }

    if (!process.env.SWAP_CONTRACT) {
      console.log("Setup SWAP_CONTRACT in env");
      throw new MyError(Errors.INVALID_SETUP);
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
      try {
        console.log("\nFrom Block =>", fromBlock);
        const fromBlockStr = getHexStringFromBlock(fromBlock);
        const transactions = await get_transactions(fromBlockStr);
        for (const t of transactions) {
          if (t.to === process.env.SWAP_CONTRACT) {
            process_transaction(
              t,
              agentModel,
              tokensController,
              swapsModel,
              pairController,
              smartContract,
            );
          }
        }

        // Update from block variables
        fromBlock++;
        while (true) {
          const latestBlock = await smartContract.getLatestBlock();
          if (fromBlock <= latestBlock) {
            break;
          } else {
            console.log(
              "From block",
              fromBlock,
              "is greater than latest block",
              latestBlock,
              "sleeping abit",
            );
            await sleep(5);
          }
        }

        lmdb.store(FROM_BLOCK_KEY, fromBlock);
      } catch (err) {
        console.log("Error in main", err);
        await sleep(60);
      }
    }
  } catch (err) {
    if (err instanceof MyError) {
      if (err.message === Errors.INVALID_SETUP) {
        throw err;
      } else if (err.message === Errors.NOT_GET_LATEST_BLOCK) {
        console.log("Error getting latest block, timing out then trying again");
        await sleep(5);
      }
    }

    console.log("Error in processing transactions in main", err);
  }
}

(() => {
  main();
})();
