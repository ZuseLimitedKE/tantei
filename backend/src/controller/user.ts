import userModel, { UserModel } from "../model/users";

export class UserController {
    private userModel: UserModel;

    constructor(userModel: UserModel) {
        this.userModel = userModel;
    }

    async register(address: string) {
        try {
            // Check if user exists
            const userID = await this.userModel.getUser(address);
            if (!userID) {
                // If not register
                await this.userModel.register(address);
            }
        } catch(err) {
            console.log("Error registering user", err);
        }
    }
}

const userController = new UserController(userModel);
export default userController;