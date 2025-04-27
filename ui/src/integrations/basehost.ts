import "dotenv/config";
export const BASEHOST = process.env.BASEHOST === "DEV" ? "http://localhost:3000" : "https://basehost.dev";
