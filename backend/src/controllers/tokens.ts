import { Errors, MyError } from "../constants/errors";
import tokenModel, { GetTokenDetails, TokenModel } from "../model/tokens";
import { TOKENS } from "../mongo/collections";

export class TokensController {
  private model: TokenModel;

  constructor(model: TokenModel) {
    this.model = model;
  }

  async getToken(args: GetTokenDetails): Promise<TOKENS | null> {
    try {
      // Try getting from mongo
      try {
        const details = await this.model.getTokenDetailsFromDatabase(args);
        if (details) {
          return details;
        }
      } catch (err) {
        console.log("Getting from db failed");
      }

      console.log("Getting tokens from mirror node");
      // Try getting from mirror node
      const details = await this.model.getTokenDetailsFromMirrorNode(args);

      // Store in db if not there already
      if (details) {
        await this.model.storeToken(details);
        return details;
      } else {
        return null;
      }
    } catch (err) {
      console.log("Error getting token details", err);
      throw new MyError(Errors.NOT_GET_TOKEN_DETAILS);
    }
  }
}

const tokensController = new TokensController(tokenModel);
export default tokensController;
