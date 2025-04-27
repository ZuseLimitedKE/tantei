declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        VITE_OPENAI_API_KEY: string;
        VITE_ENVIRONMENT: string;
      }
    }
  }