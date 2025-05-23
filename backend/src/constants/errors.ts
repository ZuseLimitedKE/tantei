export class MyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MyError";
  }
}

export enum Errors {
  INVALID_SETUP = "Invalid server setup",
  INTERNAL_SERVER_ERROR = "Internal server error",
  NOT_REGISTER_USER = "Could not register user",
  NOT_PUBLISH_AGENT = "Could not publish the agent",
  NOT_GET_USER = "Could not get user",
  NOT_GET_USER_AGENTS = "Could not get the agents associated with this account",
  NOT_GET_AGENTS = "Could not  get agents from the DB",
  NOT_GET_AGENT = "Could not get agent",
  NOT_DELETE_AGENT = "Could not delete the agent",
  NOT_UPDATE_AGENT = "Could not update the agent",
  LMDB_STORE = "Could not store in LMDB",
  LMDB_READ = "Could not read from LMDB",
  NOT_GET_TRANSACTIONS = "Could not get transactions",
  NOT_DECODE_TRANSACION = "Could not decode transaction",
  NOT_GET_TOKEN_DETAILS = "Could not get token details",
  NOT_STORE_TOKEN = "Could not store token",
  NOT_STORE_SWAP = "Could not store swap",
  NOT_GET_AMOUNT_HBAR = "Could not get HBAR sent in transaction",
  ACCOUNT_NOT_EXIST = "Account does not exist",
  NOT_GET_SWAPS = "Could not get account's swaps",
  INVALID_PAIR = "A pair should have 2 tokens",
  NOT_STORE_PAIR = "Could not store pair",
  NOT_UPDATE_PAIR = "Could not update pair",
  NOT_GET_PAIR = "Could not get pair",
  NOT_PROCESS_PAIR = "Could not process transaction pair",
  NOT_CREATE_TOPIC = "Could not create topic",
  NOT_SUBMIT_MESSAGE_TOPIC = "Could not submit message to topic",
  NOT_GET_MESSAGES_FROM_TOPIC = "Could not get messages from topic",
  AGENT_NOT_EXIST = "Agent does not exist",
  NOT_PROCESS_SWAPS = "Could not process swaps",
  NOT_GET_LATEST_BLOCK = "Could not get latest block",
  NOT_FOLLOW_AGENT = "Could not follow agent",
  INVALID_HEDERA_ACCOUNT = "Invalid hedera account",
  NOT_GET_FOLLOW_AGENTS = "Could not get followed agents",
  NOT_GET_ROI = "Could not get ROI",
  NOT_GET_PORTFOLIO_VALUE = "Could not get porfolio value",
  NOT_GET_TOKENS = "Could not get tokens",
  NOT_GET_USER_TOKENS = "Could not get user's tokens",
  NOT_GET_PORTFOLIO = "Could not get porfolio",
  NOT_GET_USER_DETAILS = "Could not get user details",
  NOT_GET_TRANSACTION_DETAILS = "Could not get transaction details",
  NOT_UPDATE_USER = "Could not update user",
  NOT_GET_TRADES = "Could not get trades",
  NOT_PROCESS_TRADES = "Could not process trades",
  NOT_GET_PERFORMANCE = "Could not get performance history",
  UNKOWN = "Unkown error",
}
