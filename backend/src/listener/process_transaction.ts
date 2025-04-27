import { Transactions } from "../schema/transactions";
import { decode_transactions } from "./decode_transaction";
import tokensController, { TokensController } from "../controllers/tokens";
import swapsModel, { SwapsModel } from "../model/swap";
import getAmountOfHBARSentInTransaction, {
  HBAR_DIVIDER,
} from "./get_amount_set_in_transaction";
import { PairController } from "../controllers/pairs";
import { AgentModel } from "../model/agents";
import { TopicId } from "@hashgraph/sdk";
import { SWAPS } from "../mongo/collections";
import { SmartContract } from "../model/smart_contract";

// Receive a transaction that has a to address belonging to swap contract
export default async function process_transaction(
  transaction: Transactions,
  agentModel: AgentModel,
  tokenController: TokensController,
  swapsModel: SwapsModel,
  pairController: PairController,
  smartContract: SmartContract,
) {
  try {
    // Check if transaction called by an address belonging to user of site
    const hedera_account_id = TopicId.fromSolidityAddress(transaction.from);
    const agent = await agentModel.GetAgent({
      hedera_account_id: hedera_account_id.toString(),
    });
    console.log("Agent =>", agent);

    if (agent) {
      // Decode transaction to get method
      const decoded = decode_transactions(transaction.input);
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
          if (decoded.method.includes("swapExactETHForTokens")) {
            console.log("HBAR -> Token found");
            // HBAR -> Token
            const hbarSent = await getAmountOfHBARSentInTransaction(
              transaction.hash,
            );
            console.log("HBAR sent ->", hbarSent);
            const outputSymbol = outputTokenDetails.symbol;
            const outputPrice = decoded.amountOut ?? 0;

            const pair = await pairController.process_transaction_pair({
              pair: ["HBAR", outputSymbol],
              price: {
                HBAR: (hbarSent ?? 0) * HBAR_DIVIDER,
                outputSymbol: outputPrice,
              },
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
              user_evm_address: transaction.from,
              price: pair.price,
              type: "sell",
            };
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
                outputSymbol: outputPrice,
              },
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
              user_evm_address: transaction.from,
              price: pair.price,
              type: pair.pair[0] === outputTokenDetails.symbol ? "buy" : "sell",
            };
          } else if (decoded.method.includes("swapExactTokensForETH")) {
            console.log("Token -> HBAR found");

            const inputSymbol = inputTokenDetails.symbol;
            const inputPrice = decoded.amountIn ?? 0;

            const pair = await pairController.process_transaction_pair({
              pair: ["HBAR", inputSymbol],
              price: {
                HBAR: decoded.amountOut ?? 0,
                inputSymbol: inputPrice,
              },
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
              user_evm_address: transaction.from,
              price: pair.price,
              type: "buy",
            };
          } else {
            return;
          }

          // Store swap in db
          await swapsModel.storeSwapInDB(swapDetails);

          // Store swap in HCS-10
          await smartContract.submitMessageToTopic(
            swapDetails,
            agent.topic_id,
            agent.agent_name,
          );
        }
      }
    }
  } catch (err) {
    console.log("Error processing transaction", err);
  }
}
