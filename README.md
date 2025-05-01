# Documentation

Tantei is an app that allows developers to monetize their AI trading agents without risking exposing their code by allowing users to copy the trades of the agents. The users can be confident that the trades of the AI agents are true since they are one automatically detected by listening to transactions onchain and 2 are stored and retrieved from HCS-10 topics created for each agent.

The backend detects trades done by agents by listening to transactions onchain. It currently detects trades made on the testnet version of Saucerswap. Instructions on how to run this listener are given in next section. Also the UI gets this data by calling the backends REST API server that gets trades straight from HCS-10. The instructions for building and running the server are also given in next section.

## Sample HCS-10 topics created

[User HCS-10 topic](https://hashscan.io/testnet/topic/0.0.5931449)

[Agent HCS-10 topic](https://hashscan.io/testnet/topic/0.0.5931426)

## Build Instructions

### Frontend

1. Change directory to the ui directory

```bash
cd ui/
```

2. Install dependencies

```bash
pnpm install
```

3. Populate env variables. NOTE: These are exposed to the client so don't store any sensitive information here.

```env
VITE_REOWN_PROJECT_ID=string //the reown appkit project id
VITE_PROD_BACKEND_URL=string //the url of the production server
VITE_DEV_BACKEND_URL=string //the url of the development server
VITE_ENVIRONMENT=string //the dev environment

```

4. Run the app

```bash
pnpm dev
```

### Backend

1. Change directory to backend directory

```bash
cd backend/
```

2. Use the correct version of node

```bash
nvm use
```

3. Install dependencies

```bash
pnpm install
```

4. Populate env variables. The following env variables are used

```env
PORT=number // PORT the backend REST API will run on
CONN_STRING=string // MongoDB connection string (used to store agent and user details)
HEDERA_MIRROR_NODE=string // Mainnet HEDERA mirrornode
HEDERA_JSON_RPC_RELAY=string // Testnet JSON RPC relay (used to get transactions made on chain)
FROM_BLOCK=number // The block number that the listener should start listening for transactions from
SWAP_CONTRACT=string // EVM address of SaucerSwapV1RouterV3 contract in testnet
HEDERA_TESTNET_OPERATOR_ACCOUNT_ID=string // Account ID of account submitting messages to agent's HCS-10 topics
HEDERA_TESTNET_OPERATOR_PRIVATE_KEY=string // Private key of above account
HEDERA_TESTNET_MIRROR_NODE=string // Testnet mirror node
SWAP_CONTRACT_ID = string // contract ID of SaucerSwapV1RouterV3 contract in testnet used when copying trades
OPERATOR_PRIVATE_KEY = string // private key of account below
OPERATOR_ID = string // account ID of the account copying trades
GAS_LIMIT=number // gas limit used when copying trades
```

5. Build the app

```bash
pnpm build
```

6. Run the trade listener

```bash
pnpm main
```

7. Run the server

```bash
pnpm start
```

## Use of HCS-10

HCS-10 topics are used to store the detected trades of agents on our platform. These trades are what are shown to the user when they are picking an agent to copy trades from. They are also used to calculate the analytics of agents that the user's see on the platform.

**Every time an agent is published in our system a HCS-10 topic is created for it. This can be seen below**

[Code for publishing an agent](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/controllers/agent.ts#L18C3-L35C4)

The code snippet above shows the code for publishing an agent. In the snippet in line 24 you can see the code that creates the topic for the agent, the created topic ID and the other details of the agent are then stored in our database. The function for creating the topic is expanded below

[Code for creating a HCS-10 topic](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/model/smart_contract.ts#L55-L81)

This shows the transaction for creating the topic on chain. It is called when creating a topic for an agent and for a user.

**And every time an agent's trade is detected its stored in a HCS-10 topic**

[Code that listens for transactions onchain](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/listener/main.ts#L49-L70)

The code above fetches the transactions in a block. Passes the transactions to a process_transaction function that will be explained below then moves to the next block.

[Code for processing trades](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/listener/process_transaction.ts#L51-L338)

The code above processes trades by first decoding them in line 53, if the decoded transaction was calling the swapExactETHForTokens method its is processed from line 77 - 158, if its a swapExactTokensForTokens method its processed from lines 158 - 236 and if its a swapExactTokensForETH method its processed from lines 236 - 338. When processing each of this methods the agent that made the transaction is identified, the users following the agent are identified, the trade for the agent is stored in its HCS-10 topic, the trade is copied for the user then the user's trade is stored in their HCS-10 topic.

[Storing and copying trades](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/listener/process_transaction.ts#L46-L157)

In line 46 the agent that created the trade is determined. Line 53 decodes the transaction. Line 71 gets the users the agent follows. Line 123 copies the trade for users. Line 135 stores the users trade and line 354 and 357 stores the agent's trade in HCS-10 and database

**When getting an agent's trades we fetch the information from the HCS-10 topic. If for whatever reason messages in the topic can't be gotten data from database is shown**

[Code for getting trades](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/controllers/swaps.ts#L186-L211)

Line 192 gets trades from topic and database and line 199 processes them

[Code for getting trades from topic](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/controllers/swaps.ts#L38-L72)

Line 48 gets trades from topic. If that call fails the trades are gotten from db in line 55. The function for getting trades from topic is shown below:

[HCS-10 topic fetch messages](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/model/smart_contract.ts#L104-L152)

The code shows how the messages in the topic are gotten from a mirror node

We also use HCS-10 topics to store the trades copied by users. The messages in the topic are what are used to calculate the user's portfolio on the system.

**Every time a user first decides to copy an AI agent a topic is created for them for storing trades.**

[Code for following agent](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/controllers/user.ts#L51-L93)

In line 69 the system checks if the user has already been created for a topic. If not the topic is created below it and the topic ID is stored in the DB at line 77

Every time a trade is detected the users that follow the agent are gotten, the trade is then copied for the user and stored in a HCS-10 topic as shown in the code snippets above. The code that copies the trade is handled by the class methods below:

[Code for copying trade](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/utils/swaps.ts#L51-L160)

The code below handles making HBAR -> Token, Token -> Token and Token -> HBAR swaps in saucerSwap, these are called when copying the trade

**When displaying the users trades data is gotten from their HCS-10 topic. If that call fails data is fetched from database**

[Code for getting user's trades](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/utils/swaps.ts#L51-L160)

The code gets the trades from the HCS-10 topic created for the user. This is shown below.

[Code for getting trades](https://github.com/ZuseLimitedKE/tantei/blob/445b17c70cb5d2ea1b66582c1bd17919d1b2f13f/backend/src/controllers/swaps.ts#L74-L99)

In line 86 the trades are gotten from the topic. If that fails they're gotten from database

## Process Demonstrated
