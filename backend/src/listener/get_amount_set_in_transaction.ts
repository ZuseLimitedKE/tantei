import axios from "axios";
import { Errors, MyError } from "../constants/errors";
import "dotenv/config";

export const HBAR_DIVIDER = 100000000;

export default async function getAmountOfHBARSentInTransaction(evm_address: string): Promise<number | null> {
    try {
        if (!process.env.HEDERA_MIRROR_NODE) {
            console.log("Set HEDERA_MIRROR_NODE in env");
            throw new MyError(Errors.INVALID_SETUP);
        }

        const res = await axios.get(`${process.env.HEDERA_MIRROR_NODE}api/v1/contracts/results/${evm_address}`);
        if (res.status !== 200) {
            console.log("Unsuccesful response", res.data);
            throw new MyError(Errors.NOT_GET_AMOUNT_HBAR);
        }

        return res.data?.amount ? res.data.amount / HBAR_DIVIDER : null;
    } catch(err) {
        console.log("Could not get amount of HBAR sent in transaction", err);
        throw new MyError(Errors.NOT_GET_AMOUNT_HBAR);
    }
}