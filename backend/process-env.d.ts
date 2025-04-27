declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      CONN_STRING: string;
      HEDERA_MIRROR_NODE: string;
      HEDERA_JSON_RPC_RELAY: string;
      FROM_BLOCK: string;
      SWAP_CONTRACT: string;
      HEDERA_OPERATOR_ACCOUNT_ID: string;
      HEDERA_OPERATOR_PRIVATE_KEY: string;
      TOPIC_HEDERA_MIRROR_NODE: string;
    }
  }
}

export { };
