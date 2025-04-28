import Web3 from "web3";
import abi from "../../abi.json";
import { Errors, MyError } from "../constants/errors";
import {
  DecodedTransaction,
  decodedTransactionsSchema,
} from "../schema/transactions";
import "dotenv/config";
import { SmartContract } from "../model/smart_contract";

export async function decode_transactions(input: string, tx_hash: string, smart_contract: SmartContract): Promise<DecodedTransaction> {
  if (!process.env.SWAP_CONTRACT) {
    console.log("Setup SWAP_CONTRACT in env");
    throw new MyError(Errors.INVALID_SETUP);
  }

  const web3 = new Web3();
  const contract = new web3.eth.Contract(abi, process.env.SWAP_CONTRACT);
  let result;

  try {
    result = contract.decodeMethodData(input);
  } catch(err) {
    console.log("Initial decode failed");
    const transaction = await smart_contract.getTransactionDetails(tx_hash);
    if (transaction) {
      result = contract.decodeMethodData(transaction.function_parameters);
    } else {
      console.error("Could not decode transaction input", err);
      throw new MyError(Errors.NOT_DECODE_TRANSACION);
    }
  }

  const data = {
    method: result["__method__"],
    addresses: result["path"] ?? null,
    amountOut: result["amountOutMin"]
      ? Number(result["amountOutMin"] as BigInt)
      : result["amountOut"]
        ? Number(result["amountOut"] as BigInt)
        : null,
    amountIn: result["amountIn"]
      ? Number(result["amountIn"] as BigInt)
      : result["amountInMax"]
        ? Number(result["amountOutMin"] as BigInt)
        : null,
  };

  console.log(result);
  const parsed = decodedTransactionsSchema.safeParse(data);
  if (parsed.success) {
    return parsed.data;
  } else {
    console.log("Issues with data =>", parsed.error);
    throw new MyError(Errors.NOT_DECODE_TRANSACION);
  }
}
