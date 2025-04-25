import z from "zod";

export const hexString = z.string().regex(/0x[0-9a-f]/);

export const FROM_BLOCK_KEY = "from_block";
