declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      CONN_STRING: string;
      HEDERA_MIRROR_NODE: string;
      HEDERA_JSON_RPC_RELAY: string;
      FROM_BLOCK: string;
      SWAP_CONTRACT: string;
      HEDERA_TESTNET_OPERATOR_ACCOUNT_ID: string;
      HEDERA_TESTNET_OPERATOR_PRIVATE_KEY: string;
      HEDERA_TESTNET_MIRROR_NODE: string;
      OPERATOR_PRIVATE_KEY: string;
      OPERATOR_ID: string;
      GAS_LIMIT: string;
      SWAP_CONTRACT_ID: string;
    }
  }
}

export { };
