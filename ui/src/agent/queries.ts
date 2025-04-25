import { PromptBuilder } from "./builder"
import { Effect, Either } from "effect"
import { type ModelOutput } from "./model"
import router from "./utils/router"
import { tradingAgents, type Agent } from "./agentData"
export const getAllAgents = async (): Promise<Agent[]> => {
    return tradingAgents
}
export const getAgentByAddress = async (address: string): Promise<Agent | null> => {
    return tradingAgents.find((agent) => agent.agentAddress === address) || null
}
export const getAnswerFromDBQ = async (input: string): Promise<string> => {
    const agents = await getAllAgents()
    const prompt = new PromptBuilder<ModelOutput>(router, 3, true)
    prompt.input({
        promptLevel: `1`,
        instruction: `
    Your name is Tantei, you are an agent, you know everything about the Tantei network, which is network of AI trading agents, Uses can ask you anything about the network, and you will be able to provide them with the information they need. 
    You are also familiar with all the different AI trading agents available on the Tantei network.
    You have been provided with the data of all the agents, your job is to come up with an answer to the question provided
    Your summary should be complete and answer the provided question.
    <documentation>
    ${JSON.stringify(agents, null, 2)}
    </documentation>
        `,
    })

    const build = prompt.build(input)

    const response = await Effect.runPromise(
        Effect.either(
            build
        )
    )

    return Either.match(response, {
        onLeft(left) {
            console.log("Something went wrong ::", left)
            return "Unable to retrieve answer from documentation"
        },
        onRight(right) {
            return right.answer ?? "Unable to retrieve answer from documentation"
        },
    })
}
