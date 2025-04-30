//Implements Saucerswap swaps
import {
    ContractFunctionParameters,
    ContractExecuteTransaction,
    Client,
    Hbar

} from '@hashgraph/sdk';
import { assert } from 'console';
import "dotenv/config";
import smartContract from '../model/smart_contract';
export interface HBARforToken {
    amountOutMin: number;
    tokenPath: string[];
    toAddress: string;
    deadline: number;
    inputHbar: number;
}
export interface TokenForHbar {
    amountIn: number;
    amountOutMin: number;
    tokenPath: string[];
    toAddress: string;
    deadline: number;
    inputHbar: number;
}
export interface TokenForToken {
    amountIn: number;
    amountOutMin: number;
    tokenPath: string[];
    toAddress: string;
    deadline: number;
}
export class Swaps {
    client: Client;
    OPERATOR_PRIVATE_KEY = process.env.OPERATOR_PRIVATE_KEY;
    OPERATOR_ID = process.env.OPERATOR_ID;
    CONTRACT_ID = process.env.SWAP_CONTRACT_ID;
    GAS_LIMIT = parseInt(process.env.GAS_LIMIT || "1000000", 10);
    constructor() {
        if (!process.env.OPERATOR_PRIVATE_KEY || !process.env.OPERATOR_ID || !process.env.SWAP_CONTRACT_ID) {
            throw new Error("Missing required environment variables: OPERATOR_PRIVATE_KEY or OPERATOR_ID");
        }
        this.client = Client.forTestnet().setOperator(this.OPERATOR_ID, this.OPERATOR_PRIVATE_KEY);
    }
    /**
     * Swaps Hbar for token
     * @param args - The arguments for the swap
     * @returns - The amount of tokens received
     * @throws Error if the swap fails
     */
    async HBARforToken(args: HBARforToken) {
        try {
            assert(args.inputHbar > 0, "Input Hbar must be greater than 0");
            
            const params = new ContractFunctionParameters()
            params.addUint256(args.amountOutMin);
            params.addAddressArray(args.tokenPath);
            params.addAddress(args.toAddress);
            params.addUint256(args.deadline);
            const response = this.executeSwapEth("swapExactETHForTokens", params, args.inputHbar);
        }
        catch (error) {
            console.log("Error occured while swapping Hbar for token: ", error);
            throw new Error("Error occured while swapping Hbar for token");
        }
    }
    /**
     * Swaps Hbar for token
     * @param args - The arguments for the swap
     * @returns - The amount of tokens received
     */
    async TokensForHBAR(args: TokenForHbar) {
        try {
            //Check that user has base token
            const userTokens = await smartContract.getUserTokens(args.toAddress);
            const baseToken = userTokens.find((token: { token: string; balance: number }) => token.token === args.tokenPath[0]);
            if (!baseToken) {
                throw new Error("User does not have base token");
            }
            if (baseToken.balance < args.amountIn) {
                throw new Error("User does not have enough base token");
            }

            const params = new ContractFunctionParameters()
            params.addUint256(args.amountIn);
            params.addUint256(args.amountOutMin);
            params.addAddressArray(args.tokenPath);
            params.addAddress(args.toAddress);
            params.addUint256(args.deadline);
            const response = this.executeSwapEth("swapExactTokensForETH", params, args.inputHbar);
            return response;
        }
        catch (error) {
            console.log("Error occured while swapping token for Hbar: ", error);
            throw new Error("Error occured while swapping token for Hbar");
        }

    }
    /**
     * Swaps token for token
     * @param args - The arguments for the swap
     * @returns The amount of tokens received
     * @throws Error if the swap fails
     */
    async TokensForTokens(args: TokenForToken) {
        try {
            const params = new ContractFunctionParameters()
            params.addUint256(args.amountIn);
            params.addUint256(args.amountOutMin);
            params.addAddressArray(args.tokenPath);
            params.addAddress(args.toAddress);
            params.addUint256(args.deadline);
            const response = this.executeSwap("swapExactTokensForTokens", params);
            return response;

        }
        catch (error) {
            console.log("Error occured while swapping token for token: ", error);
            throw new Error("Error occured while swapping token for token");
        }
    }
    private async executeSwap(functionName: string, params: ContractFunctionParameters) {
        try {
            const response = await new ContractExecuteTransaction()
                .setContractId(this.CONTRACT_ID)
                .setGas(this.GAS_LIMIT)
                .setFunction(functionName, params)
                .execute(this.client);

            const record = await response.getRecord(this.client);
            const result = record.contractFunctionResult!;
            const values: [number[]] = result.getResult(['uint[]']);
            const amounts = values[0];
            return amounts[amounts.length - 1];
        } catch (error) {
            console.error(`Error executing ${functionName} swap:`, error);
            throw error;
        }
    }
    private async executeSwapEth(functionName: string, params: ContractFunctionParameters, inputHbar: number) {
        try {
            const response = await new ContractExecuteTransaction()
                .setContractId(this.CONTRACT_ID)
                .setGas(this.GAS_LIMIT)
                .setPayableAmount(Hbar.fromTinybars(inputHbar))
                .setFunction(functionName, params)
                .execute(this.client);

            const record = await response.getRecord(this.client);
            const result = record.contractFunctionResult!;
            const values: [number[]] = result.getResult(['uint[]']);
            const amounts = values[0];
            return amounts[amounts.length - 1];
        } catch (error) {
            console.error(`Error executing swapExactETHForTokens swap:`, error);
            throw error;
        }
    }
}