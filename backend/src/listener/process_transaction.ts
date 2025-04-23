import { Transactions } from "../schema/transactions";
import userModel, { UserModel } from "../model/users";
import { decode_transactions } from "./decode_transaction";
import tokensController, { TokensController } from "../controllers/tokens";
import swapsModel, { SwapsModel } from "../model/swap";
import getAmountOfHBARSentInTransaction, { HBAR_DIVIDER } from "./get_amount_set_in_transaction";
import { PairController } from "../controllers/pairs";

// Receive a transaction that has a to address belonging to swap contract
async function process_transaction(transaction: Transactions, userModel: UserModel, tokenController: TokensController, swapsModel: SwapsModel, pairController: PairController) {
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
                        const outputSymbol = outputTokenDetails.symbol;
                        const outputPrice = decoded.amountOut ?? 0;

                        const pair = await pairController.process_transaction_pair({
                            pair: ["HBAR", outputSymbol],
                            price: {
                                "HBAR": (hbarSent ?? 0) * HBAR_DIVIDER,
                                outputSymbol: outputPrice
                            }
                        });

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
                            token_pair: pair.pair,
                            time: new Date(),
                            user_evm_address: transaction.from
                        })
                    } else if (decoded.method.includes("swapExactTokensForTokens")) {
                        console.log("Token -> Token found");

                        const outputSymbol = outputTokenDetails.symbol;
                        const outputPrice = decoded.amountOut ?? 0;
                        const inputSymbol = inputTokenDetails.symbol;
                        const inputPrice = decoded.amountIn ?? 0;

                        const pair = await pairController.process_transaction_pair({
                            pair: [inputSymbol, outputSymbol],
                            price: {
                                inputSymbol: inputPrice,
                                outputSymbol: outputPrice
                            }
                        });

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
                            token_pair: pair.pair,
                            time: new Date(),
                            user_evm_address: transaction.from
                        })
                    } else if (decoded.method.includes("swapExactTokensForETH")) {
                        console.log("Token -> HBAR found");

                        const inputSymbol = inputTokenDetails.symbol;
                        const inputPrice = decoded.amountIn ?? 0;

                        const pair = await pairController.process_transaction_pair({
                            pair: ["HBAR", inputSymbol],
                            price: {
                                "HBAR": decoded.amountOut ?? 0,
                                inputSymbol: inputPrice
                            }
                        });

                        // Token -> HBAR
                        await swapsModel.storeSwapInDB({
                            in: {
                                tokenID: inputTokenDetails.hedera_address,
                                amount: decoded.amountIn ?? 0,
                                symbol: inputTokenDetails.symbol
                            }, 
                            out: {
                                amount: decoded.amountOut ? decoded.amountOut / HBAR_DIVIDER : 0,
                                tokenID: "HBAR",
                                symbol: "HBAR",
                            },
                            token_pair: pair.pair,
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