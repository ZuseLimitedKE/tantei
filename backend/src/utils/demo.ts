import { Client, ContractExecuteTransaction, ContractFunctionParameters, Hbar } from "@hashgraph/sdk";
import "dotenv/config";
import swaps from "./swaps";

async function demo(amountIn: number, amountOut: number, tokenPath: string[]) {
    try {
        const today = new Date();
        const deadline = today.setMinutes(today.getMinutes() + 5);
        const client = Client.forTestnet().setOperator(process.env.HEDERA_TESTNET_OPERATOR_ACCOUNT_ID, process.env.HEDERA_TESTNET_OPERATOR_PRIVATE_KEY);

        // Try converting from HBAR to WHBAR
        const params = new ContractFunctionParameters()
        params.addUint256(amountIn);
        params.addUint256(amountOut);
        params.addAddressArray(tokenPath);
        params.addAddress("0x1a9c3d84290b4e3d073922a4c93162cd323828ef");
        params.addUint256(deadline);

        console.log("Params", params);

        const response = await new ContractExecuteTransaction()
            .setContractId(process.env.SWAP_CONTRACT_ID)
            .setPayableAmount(Hbar.fromTinybars(amountIn))
            .setGas(Number.parseInt(process.env.GAS_LIMIT))
            .setFunction("swapExactTokensForETH", params)
            .execute(client);

        console.log("Response", response);

        const record = await response.getRecord(client);

        console.log("Record", record);

        const result = record.contractFunctionResult!;

        console.log("Result", result);

        const values: [number[]] = result.getResult(['uint[]']);

        console.log("Values", values);

        const amounts = values[0];
        console.log(amounts[amounts.length - 1]);
    } catch (err) {
        console.error("Error in demo", err);
    }
}

(async () => {
    await demo(
        1000000,
        1646009419,
    [
        "0x0000000000000000000000000000000000003aD2",
        "0x00000000000000000000000000000000000014F5",
        "0x00000000000000000000000000000000003991eD",
    ]
    );
})();