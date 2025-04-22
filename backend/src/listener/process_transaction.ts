import { Transactions } from "../schema/transactions";
import userModel, { UserModel } from "../model/users";
import { decode_transactions } from "./decode_transaction";
import tokensController, { TokensController } from "../controllers/tokens";
import swapsModel, { SwapsModel } from "../model/swap";
import getAmountOfHBARSentInTransaction from "./get_amount_set_in_transaction";

// Receive a transaction that has a to address belonging to swap contract
async function process_transaction(transaction: Transactions, userModel: UserModel, tokenController: TokensController, swapsModel: SwapsModel) {
    try {
        // Check if transaction called by an address belonging to user of site
        const user = await userModel.getUser({ evm_address: transaction.from });
        console.log("User =>", user);
        if (user) {
            // Decode transaction to get method
            const decoded = decode_transactions(transaction.input);
            console.log("Decoded =>", decoded);
            if (decoded.addresses != null && decoded.addresses.length >= 2) {
                // Get details of first and last transaction in transaction list
                const inputTokenDetails = await tokenController.getToken({ evm_address: decoded.addresses[0]});
                console.log("Input token details =>", inputTokenDetails);
                const outputTokenDetails = await tokenController.getToken({evm_address: decoded.addresses[decoded.addresses.length - 1]});
                console.log("Output token details ->", outputTokenDetails);

                // Depending on method (HBAR -> Token, Token -> Token, Token -> HBAR)
                if (inputTokenDetails !== null && outputTokenDetails !== null) {
                    if (decoded.method.includes("swapExactETHForTokens")) {
                        console.log("HBAR -> Token found");
                        // HBAR -> Token
                        const hbarSent = await getAmountOfHBARSentInTransaction(transaction.hash);
                        console.log("HBAR sent ->", hbarSent); 
                        await swapsModel.storeSwapInDB({
                            in: {
                                tokenID: "HBAR",
                                symbol: "HBAR",
                                amount: hbarSent ?? 0
                            },
                            out: {
                                tokenID: outputTokenDetails.hedera_address,
                                amount: decoded.amountOut ?? 0,
                                symbol: outputTokenDetails.symbol
                            },
                            time: new Date(),
                            user_evm_address: transaction.from
                        })
                    } else if (decoded.method.includes("swapExactTokensForTokens")) {
                        console.log("Token -> Token found");
                        // Token -> Token
                        await swapsModel.storeSwapInDB({
                            in: {
                                tokenID: inputTokenDetails.hedera_address,
                                amount: decoded.amountIn ?? 0,
                                symbol: inputTokenDetails.symbol
                            }, 
                            out: {
                                tokenID: outputTokenDetails.hedera_address,
                                amount: decoded.amountOut ?? 0,
                                symbol: outputTokenDetails.symbol
                            },
                            time: new Date(),
                            user_evm_address: transaction.from
                        })
                    } else if (decoded.method.includes("swapExactTokensForETH")) {
                        console.log("Token -> HBAR found");
                        // Token -> HBAR
                        await swapsModel.storeSwapInDB({
                            in: {
                                tokenID: inputTokenDetails.hedera_address,
                                amount: decoded.amountIn ?? 0,
                                symbol: inputTokenDetails.symbol
                            }, 
                            out: {
                                tokenID: outputTokenDetails.hedera_address,
                                amount: decoded.amountOut ?? 0,
                                symbol: outputTokenDetails.symbol
                            },
                            time: new Date(),
                            user_evm_address: transaction.from
                        })
                    }
                    console.log("Stored succesfully");
                }

                // Store where I can retrieve later and in HCS-10
            }
        }
    } catch (err) {
        console.log("Error processing transaction", err);
    }
}