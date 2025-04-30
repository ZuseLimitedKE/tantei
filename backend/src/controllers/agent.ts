import { Errors, MyError } from "../constants/errors";
import agentModel, { AgentModel, AGENTWITHID } from "../model/agents";
import { SmartContract } from "../model/smart_contract";
import { AGENTS } from "../mongo/collections";
import { Agent } from "../schema/agents";

export interface AgentData extends AGENTWITHID {
  num_followers: number
}

export class AgentController {
  private agentModel: AgentModel;

  constructor(agentModel: AgentModel) {
    this.agentModel = agentModel;
  }
  async publish(agent: Agent, smartContract: SmartContract) {
    try {
      // Check if agent with address has already been published
      const agentDb = await this.agentModel.GetAgent({ hedera_account_id: agent.address });
      if (!agentDb) {
        // Create topic for agent
        let topicID = await smartContract.createTopic(`Topic for Tantei Agent ${agent.agent_name}`);
        if (topicID === null) {
          throw new MyError(Errors.NOT_CREATE_TOPIC);
        }

        await this.agentModel.Publish({ ...agent, topic_id: topicID!, time_created: new Date() });
      }
    } catch (error) {
      console.error(" agent controller err:", error);
      throw error;
    }
  }
  async getAllAgents(): Promise<AgentData[]> {
    try {
      const rawAgents = await this.agentModel.GetAllAgents();
      const agents: AgentData[] = [];
      for (const r of rawAgents) {
        const users = await this.agentModel.GetUsersFollowingAgent({agent_hedera_id: r.address});
        agents.push({...r, num_followers: users.length});
      }

      return agents;
    } catch (error) {
      console.error("Agent controller error:", error);
      throw error;
    }
  }

  async getAgentById(agentId: string): Promise<AgentData | null> {
    try {
      const model = await this.agentModel.GetAgentById(agentId);
      if (model) {
        const users = await this.agentModel.GetUsersFollowingAgent({agent_hedera_id: model.address});
        return {...model, num_followers: users.length};
      } else {
        return null
      }
    } catch (error) {
      console.error("Agent controller error:", error);
      throw error;
    }
  }

  async getUserAgents(address: string): Promise<AgentData[]> {
    try {
      const rawAgents = await this.agentModel.GetUserAgents(address);
      const agents: AgentData[] = [];
      for (const r of rawAgents) {
        const users = await this.agentModel.GetUsersFollowingAgent({agent_hedera_id: r.address});
        agents.push({...r, num_followers: users.length});
      }

      return agents;
    } catch (error) {
      console.error("Agent controller error:", error);
      throw error;
    }
  }

  async updateAgent(agentId: string, updates: Partial<AGENTS>) {
    try {
      return await this.agentModel.UpdateAgent(agentId, updates);
    } catch (error) {
      console.error("Agent controller error:", error);
      throw error;
    }
  }

  async deleteAgent(agentId: string) {
    try {
      return await this.agentModel.DeleteAgent(agentId);
    } catch (error) {
      console.error("Agent controller error:", error);
      throw error;
    }
  }
}

const agentController = new AgentController(agentModel);
export default agentController;
