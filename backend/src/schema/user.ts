import z from "zod";
import { hexString } from "../constants/constants";

export const registerUserSchema = z.object({
  address: z.string(),
  evm_address: hexString,
});

export type RegisterUser = z.infer<typeof registerUserSchema>;
