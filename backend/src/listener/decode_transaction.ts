import Web3 from "web3";
import abi from "../../abi.json";
import { Errors, MyError } from "../constants/errors";
import { DecodedTransaction, decodedTransactionsSchema } from "../schema/transactions";
import "dotenv/config";

export function decode_transactions(input: string): DecodedTransaction{
    if (!process.env.SWAP_CONTRACT) {
        console.log("Setup SWAP_CONTRACT in env");
        throw new MyError(Errors.INVALID_SETUP);
    }

    const web3 = new Web3();
    const contract = new web3.eth.Contract(abi, process.env.SWAP_CONTRACT);
    const result = contract.decodeMethodData(input);

    const data = {
        method: result['__method__'],
        addresses: result['path'],
        amountOut: result['amountOutMin'] ? Number(result['amountOutMin'] as BigInt) : result['amountOut'] ? Number(result['amountOut'] as BigInt) : null,
        amountIn: result['amountIn'] ? Number(result['amountIn'] as BigInt): result['amountInMax'] ? Number(result['amountOutMin'] as BigInt): null
    }

    const parsed = decodedTransactionsSchema.safeParse(data);
    if (parsed.success) {
        return parsed.data;
    } else {
        console.log("Issues with data =>", parsed.error);
        throw new MyError(Errors.NOT_DECODE_TRANSACION);
    }
}