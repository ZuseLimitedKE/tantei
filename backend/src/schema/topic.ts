import z from "zod";

export const swappedTokenDetailsSchema = z.object({
    tokenID: z.string(),
    symbol: z.string(),
    amount: z.number() 
});

export const swapsSchema = z.object({
    in: swappedTokenDetailsSchema,
    out: swappedTokenDetailsSchema,
    time: z.string().transform( arg => new Date( arg ) ),
    user_evm_address: z.string(),
    token_pair: z.array(z.string()).length(2),
    price: z.number()
})

export const getTopicSchema = z.object({
    messages: z.array(z.object({
        message: z.string()
    }))
});