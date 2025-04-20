export class MyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MyError";
  }
}

export enum Errors {
  INVALID_SETUP = "Invalid server setup",
  NOT_REGISTER_USER = "Could not register user",
  NOT_PUBLISH_AGENT = "Could not publish the agent",
  NOT_GET_USER = "Could not get user",
}
