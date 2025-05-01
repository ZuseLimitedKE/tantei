import { Swaps, HBARforToken, TokenForHbar, TokenForToken } from "./swaps";
import "dotenv/config";
import {
    ContractExecuteTransaction,
    TokenAssociateTransaction,
    Hbar,
    HbarUnit,
    Client
} from '@hashgraph/sdk';
const swap = new Swaps();

async function getWHBAR() {
    try {
        const client = Client.forTestnet().setOperator("0.0.5805516", process.env.OPERATOR_PRIVATE_KEY)
        const depositHbar = Hbar.from(80, HbarUnit.Hbar)

        await new ContractExecuteTransaction()
            .setContractId("0.0.5816542")
            .setPayableAmount(depositHbar)
            .setGas(1000000)
            .setFunction('deposit')
            .execute(client);
    }
    catch (error) {
        console.log("Error occured while getting Wrapped Hbar: ", error);
        throw new Error("Failed to get Wrapped Hbar");
    }
}
// Swap HBar for token
export async function HbarToToken() {

    // getWHBAR();
    console.log("Swapping Hbar for token...");
    const hbarToTokensargs: HBARforToken = {
        amountOutMin: 1_000_000,
        tokenPath: ["0x0000000000000000000000000000000000003aD2", "0x00000000000000000000000000000000000014F5", "0x00000000000000000000000000000000003991eD"],
        toAddress: "0x1ba65df9858d82e66cbf0574964f1704aa8c7ea9",
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        inputHbar: 1_000_000_000
    }
    const h2tResponse = await swap.HBARforToken(hbarToTokensargs);
    console.log("Hbar to Token Response: ", h2tResponse);
}

// Swap token for HBar
export async function TokenToHbar() {
    console.log("Swapping token for Hbar...");
    const tokensToHbarargs: TokenForHbar = {
        amountIn: 100000,
        amountOutMin: 1,
        tokenPath: ["0x000000000000000000000000000000000058441F","0x00000000000000000000000000000000005860C0"],
        toAddress: "0.0.19266",
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    }
    const t2hResponse = await swap.TokensForHBAR(tokensToHbarargs);
    console.log("Token to Hbar Response: ", t2hResponse);
}

// Swap token for token
export async function TokenToToken() {
    console.log("Swapping token for token...");
    const tokensToTokensargs: TokenForToken = {
        amountIn: 1,
        amountOutMin: 1,
        tokenPath: ["0x000000000000000000000000000000000058441F", "0x00000000000000000000000000000000005860C0"],
        toAddress: "0x1ba65df9858d82e66cbf0574964f1704aa8c7ea9",
        deadline: Math.floor(Date.now() / 1000) + 60 * 20
    }
    const t2tResponse = await swap.TokensForTokens(tokensToTokensargs);
    console.log("Token to Token Response: ", t2tResponse);
}