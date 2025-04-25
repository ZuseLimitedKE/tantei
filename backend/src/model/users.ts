import { ObjectId } from "mongodb";
import { Errors, MyError } from "../constants/errors";
import { USERS_COLLECTION } from "../mongo/collections";
import { FollowAgent } from "../schema/user";

interface getUserArgs {
  address?: string;
  evm_address?: string;
}

export class UserModel {
  async register(address: string, evm_address: string) {
    try {
      await USERS_COLLECTION.insertOne({ address, evm_address, agents: [] });
    } catch (err) {
      console.log("Error registering user in db", err);
      throw new MyError(Errors.NOT_REGISTER_USER);
    }
  }

  async getUser(args: getUserArgs): Promise<ObjectId | null> {
    try {
      const user = await USERS_COLLECTION.findOne(args);
      return user?._id ?? null;
    } catch (err) {
      console.log("Could not get user from database", err);
      throw new MyError(Errors.NOT_GET_USER);
    }
  }

  async followAgent(args: FollowAgent) {
    try {
      const user = await USERS_COLLECTION.findOne({address: args.user_hedera_account});
      if (user) {
        user?.agents.push(args.agent_hedera_account);
        await USERS_COLLECTION.replaceOne({_id: user._id}, user);
      }
    } catch(err) {
      console.error("Could not follow agent", err);
      throw new MyError(Errors.NOT_FOLLOW_AGENT)
    }
  }
}

const userModel = new UserModel();
export default userModel;
