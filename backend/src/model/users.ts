import { ObjectId } from "mongodb";
import { Errors, MyError } from "../constants/errors";
import { USERS_COLLECTION } from "../mongo/collections";

export class UserModel {
  async register(address: string) {
    try {
      await USERS_COLLECTION.insertOne({ address });
    } catch (err) {
      console.log("Error registering user in db", err);
      throw new MyError(Errors.NOT_REGISTER_USER);
    }
  }

  async getUser(address: string): Promise<ObjectId | null> {
    try {
      const user = await USERS_COLLECTION.findOne({ address });
      return user?._id ?? null;
    } catch (err) {
      console.log("Could not get user from database", err);
      throw new MyError(Errors.NOT_GET_USER);
    }
  }
}

const userModel = new UserModel();
export default userModel;
