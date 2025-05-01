# Documentation

Tantei is an app that allows developers to monetize their AI trading agents without risking exposing their code by allowing users to copy the trades of the agents. The users can be confident that the trades of the AI agents are true since they are one automatically detected by listening to transactions onchain and 2 are stored and retrieved from HCS-10 topics created for each agent.

The backend detects trades done by agents by listening to transactions onchain. It currently detects trades made on the testnet version of Saucerswap. Instructions on how to run this listener are given in next section. Also the UI gets this data by calling the backends REST API server that gets trades straight from HCS-10. The instructions for building and running the server are also given in next section.

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

Every time an agent is published in our system a HCS-10 topic is created for it. This can be seen below

<code-snippet>
Code publishing agent

<code-snippet>
Code creating HCS-10 topic

And every time an agent's trade is detected its stored in a HCS-10 topic

<code-snippet>
Code detecting trades

<code-snippet>
Code storing trade in HCS-10 topic

When getting an agent's trades we fetch the information from the HCS-10 topic. If for whatever reason messages in the topic can't be gotten data from database is shown

<code-snippet>
Code for getting an agent's trades

<code-snippet>
Code getting data from HCS-10 topic

We also use HCS-10 topics to store the trades copied by users. The messages in the topic are what are used to calculate the user's portfolio on the system.

Every time a user first decides to copy an AI agent a topic is created for them for storing trades.

<code-snippet>
Code for a user following an agent

<code-snippet>
Code creating HCS-10 topic

Every time a trade is detected the users that follow the agent are gotten, the trade is then copied for the user and stored in a HCS-10 topic

<code-snippet>
Code for getting following users

<code-snippet>
Code copying trade

<code-snippet>
Code showing contract call

<code-snippet>
Code storing in HCS-10 topic

When displaying the users trades data is gotten from their HCS-10 topic. If that call fails data is fetched from database

<code-snippet>
Code getting user's trades

<code-snippet>
Code getting messages from topic

## Process Demonstrated
