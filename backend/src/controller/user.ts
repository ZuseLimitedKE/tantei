import { RegisterUser } from "../constants/types";
import userModel, { UserModel } from "../model/users";

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
        } catch(err) {
            console.log("Error registering user", err);
        }
    }
}

const userController = new UserController(userModel);
export default userController;