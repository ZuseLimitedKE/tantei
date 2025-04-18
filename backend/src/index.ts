import "dotenv/config";
import Express from "express";
import { Errors, MyError } from "./constants/errors";
const app = Express();

const port = process.env.PORT;
if (!port) {
    console.log("Set PORT in env variables");
    throw new MyError(Errors.INVALID_SETUP);
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})
