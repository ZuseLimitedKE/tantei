import { AGENTS_COLLECTION, AGENTS } from "../mongo/collections";
import { Errors, MyError } from "../constants/errors";

export class AgentModel {
  async Publish(agent: AGENTS) {
    try {
      await AGENTS_COLLECTION.insertOne(agent);
    } catch (error) {
      throw new MyError("error:" + Errors.NOT_PUBLISH_AGENT);
    }
  }
  async GetUserAgents(address: string): Promise<AGENTS[] | undefined> {
    try {
      const agents: AGENTS[] = [];
      const cursor = AGENTS_COLLECTION.find({ owner_wallet_address: address });
      for await (const doc of cursor) {
        agents.push({
          ...doc,
        });
      }
      return agents;
    } catch (error) {
      console.error(error);
      throw new MyError("error" + Errors.NOT_GET_AGENTS);
    }
  }
}
