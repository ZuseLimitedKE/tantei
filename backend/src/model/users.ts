import { ObjectId } from "mongodb";
import { Errors, MyError } from "../constants/errors";
import { USERS_COLLECTION } from "../mongo/collections";

interface getUserArgs {
  address?: string;
  evm_address?: string;
}

export class UserModel {
  async register(address: string, evm_address: string) {
    try {
      await USERS_COLLECTION.insertOne({ address, evm_address });
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
}

const userModel = new UserModel();
export default userModel;
