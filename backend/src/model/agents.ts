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
}
