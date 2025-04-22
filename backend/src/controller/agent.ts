import agentModel, { AgentModel } from "../model/agents";
import { AGENTS } from "../mongo/collections";

export class AgentController {
  private agentModel: AgentModel;

  constructor(agentModel: AgentModel) {
    this.agentModel = agentModel;
  }
  async Publish(agent: AGENTS) {
    try {
      await this.agentModel.Publish(agent);
    } catch (error) {
      console.error(" agent controller err:", error);
      throw error;
    }
  }
  async getAllAgents() {
    try {
      return await this.agentModel.GetAllAgents();
    } catch (error) {
      console.error("Agent controller error:", error);
      throw error;
    }
  }

  async getAgentById(agentId: string) {
    try {
      return await this.agentModel.GetAgentById(agentId);
    } catch (error) {
      console.error("Agent controller error:", error);
      throw error;
    }
  }

  async getUserAgents(address: string) {
    try {
      return await this.agentModel.GetUserAgents(address);
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
