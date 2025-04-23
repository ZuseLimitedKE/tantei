export class MyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MyError";
  }
}

export enum Errors {
  INVALID_SETUP = "Invalid server setup",
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
  UNKOWN = "Unkown error",
}
