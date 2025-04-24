import type { publishAgentType } from "@/types/zod";
import Api from "./api";

export function PublishAgent(agent: publishAgentType) {
  return Api.post("/agents", agent);
}
