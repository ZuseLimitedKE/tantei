import { Transactions } from "../schema/transactions";
import { decode_transactions } from "./decode_transaction";
import tokensController, { TokensController } from "../controllers/tokens";
import swapsModel, { SwapsModel } from "../model/swap";
import getAmountOfHBARSentInTransaction, {
  HBAR_DIVIDER,
} from "./get_amount_set_in_transaction";
import pairController, { PairController } from "../controllers/pairs";
import agentModel, { AgentModel } from "../model/agents";
import { TopicId } from "@hashgraph/sdk";
import { SWAPS } from "../mongo/collections";
import smartContract, { SmartContract } from "../model/smart_contract";
import { Swaps } from "../utils/swaps";
import { UserModel } from "../model/users";
import { UserController } from "../controllers/user";
import "dotenv/config";

// Receive a transaction that has a to address belonging to swap contract
export default async function process_transaction(
  transaction: Transactions,
  agentModel: AgentModel,
  tokenController: TokensController,
  swapsModel: SwapsModel,
  pairController: PairController,
  smartContract: SmartContract,
  swapMethods: Swaps,
  userController: UserController
) {
  try {
    // Getting hedera account id that called the transaction
    console.log(transaction);
    let user: string | null = null;
    try {
      const userDetails = await smartContract.getUserDetails(transaction.from);
      user = userDetails?.account ?? null;
    } catch (err) {
      try {
        user = TopicId.fromSolidityAddress(transaction.from).toString();
      } catch (err) {
        user = null;
      }
    }
    console.log("User =>", user);
    if (user) {
      console.log("I am here");
      let agent = await agentModel.GetAgent({
        hedera_account_id: user,
      });
      console.log("Agent =>", agent);

      if (agent) {
        // Decode transaction to get method
        const decoded = await decode_transactions(transaction.input, transaction.hash, smartContract);
        console.log("Decoded =>", decoded);

        if (decoded.addresses != null && decoded.addresses.length >= 2) {
          // Get details of first and last transaction in transaction list
          const inputTokenDetails = await tokenController.getToken({
            evm_address: decoded.addresses[0],
          });
          console.log("Input token details =>", inputTokenDetails);
          const outputTokenDetails = await tokenController.getToken({
            evm_address: decoded.addresses[decoded.addresses.length - 1],
          });
          console.log("Output token details ->", outputTokenDetails);

          let swapDetails: SWAPS;
          // Depending on method (HBAR -> Token, Token -> Token, Token -> HBAR)
          if (inputTokenDetails !== null && outputTokenDetails !== null) {
            // Get users that follow agents
            const usersFollowingAgent = await agentModel.GetUsersFollowingAgent({ agent_hedera_id: agent.address });
            const copyAgent = TopicId.fromString(process.env.OPERATOR_ID);
            const userSwapToAddress = copyAgent.toSolidityAddress();
            const today = new Date();
            const deadline = today.setMinutes(today.getMinutes() + 5);

            if (decoded.method.includes("swapExactETHForTokens")) {
              console.log("HBAR -> Token found");
              // HBAR -> Token
              const hbarSent = await getAmountOfHBARSentInTransaction(
                transaction.hash,
              );
              console.log("HBAR sent ->", hbarSent);
              const outputSymbol = outputTokenDetails.symbol;
              const outputPrice = decoded.amountOut ?? 0;

              const price: Record<string, number> = {};
              price["HBAR"] = (hbarSent ?? 0) * HBAR_DIVIDER;
              price[outputSymbol] = outputPrice;
              const pair = await pairController.process_transaction_pair({
                pair: ["HBAR", outputSymbol],
                price
              });

              swapDetails = {
                in: {
                  tokenID: "HBAR",
                  symbol: "HBAR",
                  amount: hbarSent ?? 0,
                },
                out: {
                  tokenID: outputTokenDetails.hedera_address,
                  amount: decoded.amountOut ?? 0,
                  symbol: outputTokenDetails.symbol,
                },
                token_pair: pair.pair,
                time: new Date(),
                user_hedera: user,
                price: pair.price,
                type: "sell",
              };


              // Try making the trade for user
              try {
                for (const followingUser of usersFollowingAgent) {
                  // Copy trade
                  const inputHbar = Math.ceil((hbarSent ?? 0) * (HBAR_DIVIDER / 10));
                  const amountOutMin = Math.ceil(swapDetails.out.amount / 10);

                  // Try the swap
                  await swapMethods.HBARforToken({
                    amountOutMin,
                    tokenPath: decoded.addresses,
                    toAddress: userSwapToAddress,
                    deadline,
                    inputHbar
                  }); swapDetails.out.amount / 10

                  // Store if succesful
                  await userController.storeUserSwap(followingUser, {
                    in: {
                      tokenID: "HBAR",
                      symbol: "HBAR",
                      amount: inputHbar ? inputHbar / HBAR_DIVIDER : 0,
                    },
                    out: {
                      tokenID: outputTokenDetails.hedera_address,
                      amount: amountOutMin,
                      symbol: outputTokenDetails.symbol,
                    },
                    token_pair: pair.pair,
                    time: new Date(),
                    user_hedera: user,
                    price: pair.price,
                    type: "sell",
                  }, smartContract);

                  console.log("Trade for", followingUser, "has been copied");
                }
              } catch (err) {
                console.error("Could not copy trade for user");
              }
            } else if (decoded.method.includes("swapExactTokensForTokens")) {
              console.log("Token -> Token found");

              const outputSymbol = outputTokenDetails.symbol;
              const outputPrice = decoded.amountOut ?? 0;
              const inputSymbol = inputTokenDetails.symbol;
              const inputPrice = decoded.amountIn ?? 0;

              const price: Record<string, number> = {};
              price[inputSymbol] = inputPrice;
              price[outputSymbol] = outputPrice;
              const pair = await pairController.process_transaction_pair({
                pair: [inputSymbol, outputSymbol],
                price,
              });

              // Token -> Token
              swapDetails = {
                in: {
                  tokenID: inputTokenDetails.hedera_address,
                  amount: decoded.amountIn ?? 0,
                  symbol: inputTokenDetails.symbol,
                },
                out: {
                  tokenID: outputTokenDetails.hedera_address,
                  amount: decoded.amountOut ?? 0,
                  symbol: outputTokenDetails.symbol,
                },
                token_pair: pair.pair,
                time: new Date(),
                user_hedera: user,
                price: pair.price,
                type: pair.pair[0] === outputTokenDetails.symbol ? "buy" : "sell",
              };

              // Try making the trade for user
              if (decoded.amountIn && decoded.amountOut) {
                try {
                  for (const followingUser of usersFollowingAgent) {
                    const amountIn = Math.ceil(decoded.amountIn / 10);
                    const amountOut = Math.ceil(decoded.amountOut / 10);
                    await swapMethods.TokensForTokens({
                      amountIn,
                      amountOutMin: amountOut,
                      tokenPath: decoded.addresses,
                      toAddress: userSwapToAddress,
                      deadline
                    });

                    // Store if successfull
                    await userController.storeUserSwap(followingUser, {
                      in: {
                        tokenID: inputTokenDetails.hedera_address,
                        amount: amountIn,
                        symbol: inputTokenDetails.symbol,
                      },
                      out: {
                        tokenID: outputTokenDetails.hedera_address,
                        amount: amountOut,
                        symbol: outputTokenDetails.symbol,
                      },
                      token_pair: pair.pair,
                      time: new Date(),
                      user_hedera: user,
                      price: pair.price,
                      type: pair.pair[0] === outputTokenDetails.symbol ? "buy" : "sell",
                    }, smartContract);
                    console.log("Trade for", followingUser, "has been copied");
                  }
                } catch (err) {
                  console.error("Could not copy trade for user");
                }
              }
            } else if (decoded.method.includes("swapExactTokensForETH")) {
              console.log("Token -> HBAR found");

              const inputSymbol = inputTokenDetails.symbol;
              const inputPrice = decoded.amountIn ?? 0;
              const txDetails = await smartContract.getTransactionDetails(transaction.hash);
              console.log("Tx details", txDetails);

              if (txDetails) {
                try {
                  const userDetails = await smartContract.getUserDetails(txDetails.from);
                  user = userDetails?.account ?? null;
                  console.log("Token -> HBAR user", user);
                } catch (err) {
                  try {
                    user = TopicId.fromSolidityAddress(txDetails.from).toString();
                    console.log(user);
                  } catch (err) {
                    console.log("Could not get user", err);
                    user = null;
                  }
                }

                if (user) {
                  agent = await agentModel.GetAgent({
                    hedera_account_id: user,
                  });

                  if (agent) {
                    console.log("Token -> HBAR agent", agent);
                    const price: Record<string, number> = {};
                    price[inputSymbol] = inputPrice;
                    price["HBAR"] = decoded.amountOut ?? 0;
                    const pair = await pairController.process_transaction_pair({
                      pair: ["HBAR", inputSymbol],
                      price
                    });

                    // Token -> HBAR
                    swapDetails = {
                      in: {
                        tokenID: inputTokenDetails.hedera_address,
                        amount: decoded.amountIn ?? 0,
                        symbol: inputTokenDetails.symbol,
                      },
                      out: {
                        amount: decoded.amountOut
                          ? decoded.amountOut / HBAR_DIVIDER
                          : 0,
                        tokenID: "HBAR",
                        symbol: "HBAR",
                      },
                      token_pair: pair.pair,
                      time: new Date(),
                      user_hedera: user,
                      price: pair.price,
                      type: "buy",
                    };

                    // Trying copying trade
                    if (decoded.amountOut && decoded.amountIn) {
                      try {
                        for (const followingUser of usersFollowingAgent) {
                          const amountIn = Math.ceil(decoded.amountIn / 10);
                          const amountOut = Math.ceil(decoded.amountOut / 10);

                          await swapMethods.TokensForHBAR({
                            amountIn,
                            amountOutMin: amountOut,
                            tokenPath: decoded.addresses,
                            toAddress: userSwapToAddress,
                            deadline,
                          });

                          // Store 
                          await userController.storeUserSwap(followingUser, {
                            in: {
                              tokenID: inputTokenDetails.hedera_address,
                              amount: amountIn,
                              symbol: inputTokenDetails.symbol,
                            },
                            out: {
                              amount: amountOut,
                              tokenID: "HBAR",
                              symbol: "HBAR",
                            },
                            token_pair: pair.pair,
                            time: new Date(),
                            user_hedera: user,
                            price: pair.price,
                            type: "buy",
                          }, smartContract);

                          console.log("Trade for", followingUser, "has been copied");
                        }
                      } catch (err) {
                        console.error("Could not copy trade for user");
                      }
                    }
                  } else {
                    return;
                  }
                } else {
                  console.log("Could not get user");
                  return;
                }
              } else {
                return;
              }
            } else {
              return;
            }

            // Store swap in db
            await swapsModel.storeSwapInDB(swapDetails);

            // Store swap in HCS-10
            await smartContract.submitMessageToTopic(
              swapDetails,
              agent.topic_id,
              `Tantei Agent: ${agent.agent_name} Transaction Record`
            );
          }
        }
      }
    }
  } catch (err) {
    console.log("Error processing transaction", err);
  }
}

// (async () => {
//   await process_transaction({
//     "blockHash": "0x66a01e78f7d3e97d5a8e036b7824aaf5d37cf85f6f8413e874da3bf7dee4ab77",
//     "blockNumber": "0x4aa7773",
//     "chainId": "0x127",
//     // "from": "0x00000000000000000000000000000000003afb5e",
//     "from": "0x00000000000000000000000000000000002e7a5d",
//     "gas": "0x32c80",
//     "gasPrice": "0x0",
//     "hash": "0x4af8c1969f10e752d0d01fb4b3e5248da9e5d3d4f0d8b0f9560b9e311acb5312",
//     "input": "0x0000000000000000",
//     "nonce": "0x0",
//     "r": "0x0",
//     "s": "0x0",
//     "to": "0x00000000000000000000000000000000002e7a5d",
//     "transactionIndex": "0x5",
//     "type": "0x0",
//     "v": "0x0",
//     "value": "0x0"
//   }, agentModel, tokensController, swapsModel, pairController, smartContract);
//   process.exit(0);
// })();
