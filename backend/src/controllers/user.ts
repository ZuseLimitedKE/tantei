import { FollowAgent, RegisterUser } from "../schema/user";
import userModel, { UserModel } from "../model/users";
import { Errors, MyError } from "../constants/errors";
import agentModel, { AgentModel } from "../model/agents";

export class UserController {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  async register(args: RegisterUser) {
    try {
      // Check if user exists
      const userID = await this.userModel.getUser(args);
      if (!userID) {
        // If not register
        await this.userModel.register(args.address, args.evm_address);
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
        throw new MyError(Errors.ACCOUNT_NOT_EXIST);
      }

      // Check if agent exists
      const agent = await agentModel.GetAgent({hedera_account_id: args.agent_hedera_account});
      if (!agent) {
        throw new MyError(Errors.AGENT_NOT_EXIST);
      }
 
      // Follow agent
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

(async () => {
  await userController.followAgent({user_hedera_account: "testAddress", agent_hedera_account: "0xbaruj3-roman-sucks"}, agentModel);
  process.exit(0);
})()
