import { AGENTS_COLLECTION, AGENTS } from "../mongo/collections";
import { Errors, MyError } from "../constants/errors";
import { ObjectId } from "mongodb";
export class AgentModel {
  //adds a new agent
  async Publish(agent: AGENTS) {
    try {
      await AGENTS_COLLECTION.insertOne(agent);
    } catch (error) {
      throw new MyError("error:" + Errors.NOT_PUBLISH_AGENT);
    }
  }
  //gets all the agents associated with an account
  async GetUserAgents(address: string): Promise<AGENTS[] | null> {
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
      throw new MyError("error" + Errors.NOT_GET_USER_AGENTS);
    }
  }
  // Get all available agents with basic metrics
  async GetAllAgents(): Promise<AGENTS[]> {
    try {
      const agents: AGENTS[] = [];
      const cursor = AGENTS_COLLECTION.find({});

      for await (const doc of cursor) {
        agents.push({
          ...doc,
        });
      }
      return agents;
    } catch (error) {
      console.error(error);
      throw new MyError("error:" + Errors.NOT_GET_AGENTS);
    }
  }

  // Get detailed information about a specific agent
  async GetAgentById(agentId: string): Promise<AGENTS | null> {
    try {
      const agent = await AGENTS_COLLECTION.findOne({
        _id: new ObjectId(agentId),
      });
      return agent;
    } catch (error) {
      console.error(error);
      throw new MyError("error:" + Errors.NOT_GET_AGENT);
    }
  }

  // Get agent from their hedera account id
  async GetAgent(args: { hedera_account_id?: string }): Promise<AGENTS | null> {
    try {
      if (args.hedera_account_id) {
        const agent = await AGENTS_COLLECTION.findOne({
          account_id: args.hedera_account_id,
        });

        return agent;
      }

      return null;
    } catch (err) {
      console.error(err);
      throw new MyError("error:" + Errors.NOT_GET_AGENT);
    }
  }

  // Update agent details
  async UpdateAgent(
    agentId: string,
    updates: Partial<AGENTS>,
  ): Promise<boolean> {
    try {
      const result = await AGENTS_COLLECTION.updateOne(
        { _id: new ObjectId(agentId) },
        { $set: updates },
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error(error);
      throw new MyError("error:" + Errors.NOT_UPDATE_AGENT);
    }
  }

  // Delete an agent
  async DeleteAgent(agentId: string): Promise<boolean> {
    try {
      const result = await AGENTS_COLLECTION.deleteOne({
        _id: new ObjectId(agentId),
      });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(error);
      throw new MyError("error:" + Errors.NOT_DELETE_AGENT);
    }
  }
}
const agentModel = new AgentModel();
export default agentModel;
