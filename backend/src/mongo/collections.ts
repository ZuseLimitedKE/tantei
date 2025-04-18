import client from "./connection";

const dbName = "tantei";
const database = client.db(dbName);

// collection types
export interface USERS {
    address: string
}

// collection names
const userCollection = "users";

export const USERS_COLLECTION = database.collection<USERS>(userCollection);