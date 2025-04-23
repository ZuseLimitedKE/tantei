import { Errors, MyError } from "../constants/errors";
import userModel, { UserModel } from "../model/users"

interface AccountSwaps {

}

interface GetAccountSwaps {
    account_id: string
}

export class SwapsController {
    async getAccountSwaps(args: GetAccountSwaps, userModel: UserModel): Promise<AccountSwaps[]> {
        try {
            // Check if account exists
            const account = await userModel.getUser({address: args.account_id});
            if (!account) {
                throw new MyError(Errors.ACCOUNT_NOT_EXIST);
            }

            return [];
        } catch(err) {
            if (err instanceof MyError) {
                if (err.message === Errors.ACCOUNT_NOT_EXIST) {
                    throw err;
                }
            }

            console.log("Error getting account swaps", err);
            throw new MyError(Errors.NOT_GET_SWAPS);
        }
    }
}

const swapsController = new SwapsController();
export default swapsController;

(async () => {
    const swaps = await swapsController.getAccountSwaps({account_id: "sfsdfsdf"}, userModel);
    console.log(swaps);
})()