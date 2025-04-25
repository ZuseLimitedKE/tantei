import { FollowAgent } from "../schema/user";
import userModel, { UserModel } from "../model/users";
import { Errors, MyError } from "../constants/errors";
import agentModel, { AgentModel } from "../model/agents";
import { TopicId } from "@hashgraph/sdk";
import { AGENTS } from "../mongo/collections";

export class UserController {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  async register(user_hedera_account: string) {
    try {
      // Check if user exists
      const userID = await this.userModel.getUser({address: user_hedera_account});
      if (!userID) {
        // If not register
        let hederaID: TopicId
        try {
          hederaID = TopicId.fromString(user_hedera_account);
        } catch(err) {
          throw new MyError(Errors.INVALID_HEDERA_ACCOUNT);
        }
        const evm_address = hederaID.toSolidityAddress();
        await this.userModel.register(user_hedera_account, evm_address);
      }
    } catch (err) {
      if (err instanceof MyError) {
        if (err.message === Errors.INVALID_HEDERA_ACCOUNT) {
          throw err;
        }
      }
      console.log("Error registering user", err);
      throw new MyError(Errors.NOT_REGISTER_USER);
    }
  }

  async followAgent(args: FollowAgent, agentModel: AgentModel) {
    try {
      // Check if user exists
      const user = await this.userModel.getUser({address: args.user_hedera_account});
      if (!user) {
        // Register user if doesn't exist
        await this.register(args.user_hedera_account);
      }

      // Check if agent exists
      const agent = await agentModel.GetAgent({hedera_account_id: args.agent_hedera_account});
      if (!agent) {
        throw new MyError(Errors.AGENT_NOT_EXIST);
      }
 
      // Follow agent
      await this.userModel.followAgent(args);
    } catch(err) {
      if (err instanceof MyError) {
        if (err.message === Errors.AGENT_NOT_EXIST || err.message === Errors.INVALID_HEDERA_ACCOUNT) {
          throw err;
        }
      }

      console.error("Error following agent", err);
      throw new MyError(Errors.NOT_FOLLOW_AGENT);
    }
  }

  async getFollowedAgents(user_wallet: string, agentModel: AgentModel): Promise<AGENTS[]> {
    try {
      // Get user
      const user = await this.userModel.getUser({address: user_wallet});

      // If user does not exist return empty list
      if (!user) {
        return [];
      }

      // Return agents
      const agentAddresses = user.agents.map((a) => a.agent);
      const agents = await agentModel.GetAgents({accounts: agentAddresses});
      return agents;
    } catch(err) {
      console.error("Error getting agents followed by user", err);
      throw new MyError(Errors.NOT_GET_FOLLOW_AGENTS);
    }
  }
}

const userController = new UserController(userModel);
export default userController;
