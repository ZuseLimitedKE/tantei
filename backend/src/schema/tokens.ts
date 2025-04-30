import z from "zod";

export const tokenDetailsSchema = z.object({
    name: z.string(),
    symbol: z.string(),
    token_id: z.string(),
    decimals: z.string().transform((val) => Number.parseInt(val))
});

export type TokenDetails = z.infer<typeof tokenDetailsSchema>;