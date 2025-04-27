declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        VITE_OPENAI_API_KEY: string;
        BASE_HOST: string;
      }
    }
  }