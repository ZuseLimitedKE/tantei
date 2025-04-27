import z from "zod";

export const swappedTokenDetailsSchema = z.object({
  tokenID: z.string(),
  symbol: z.string(),
  amount: z.number(),
});

const SWAP_TYPES = ["buy", "sell"] as const;

export const swapsSchema = z.object({
  in: swappedTokenDetailsSchema,
  out: swappedTokenDetailsSchema,
  time: z.string().transform((arg) => new Date(arg)),
  user_evm_address: z.string(),
  token_pair: z.array(z.string()).length(2),
  type: z.enum(SWAP_TYPES),
  price: z.number(),
});

export const getTopicSchema = z.object({
  messages: z.array(
    z.object({
      message: z.string(),
    }),
  ),
});
