import { FollowAgent } from "../schema/user";
import userModel, { UserModel } from "../model/users";
import { Errors, MyError } from "../constants/errors";
import agentModel, { AgentModel } from "../model/agents";
import { TopicId } from "@hashgraph/sdk";

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
        const hederaID = TopicId.fromString(user_hedera_account);
        const evm_address = hederaID.toSolidityAddress();
        await this.userModel.register(user_hedera_account, evm_address);
      }
    } catch (err) {
      console.log("Error registering user", err);
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
        if (err.message === Errors.ACCOUNT_NOT_EXIST || err.message === Errors.AGENT_NOT_EXIST) {
          throw err;
        }
      }

      console.error("Error following agent", err);
      throw new MyError(Errors.NOT_FOLLOW_AGENT);
    }
  }
}

const userController = new UserController(userModel);
export default userController;
