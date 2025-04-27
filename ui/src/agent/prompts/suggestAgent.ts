/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";
import { PromptBuilder } from "../builder";
import router from "../utils/router";
import zodToJsonSchema from "zod-to-json-schema";
import { Effect } from "effect";
import type { ModelOutput } from "../model";
import { getAllAgents, getAnswerFromDBQ } from "../queries";
const tradingPrompt = new PromptBuilder<ModelOutput>(router, 5, true);

// const query = z.string();
// const agentAddress = z.string();
const getAnswerFromDB = z.object({
  query: z.string(),
});
tradingPrompt
  .input({
    promptLevel: `1`,
    instruction: `
    Your name is Tantei, you are an agent, you know everything about the Tantei network, which is network of AI trading agents, Uses can ask you anything about the network, and you will be able to provide them with the information they need. 
    You are also familiar with all the different AI trading agents available on the Tantei network.
    Your job is to select a single or multiple tools, that can be used to successfully fetch resources necessary for answering a user inquiry.
    Only recommend agents from our database, and do not come up with your own. Use the tools available to you to answer the user query.
    You are presented with a couple of tools and need to choose which ones you can use to answer the user correctly and completely.
    Your tools include: 
    **getAgentDetailsFromDB** - Use this tool to get all available agents in the network, and their details such as {agentName eg. "High-riser", strategy eg. "This agent operates like this and this.", agentAddress eg. "0x3B92cAbC17A34F64Be9d2Ce7bE8D1B10D729ed99"}. Useful in answering user questions.
    `,
    tools: [
      {
        name: "getAgentDetailsFromDB",
        description:
          "Use this tool to answer a specific question about the agents in the network, or recommend an agent based on user query",
        args: zodToJsonSchema(getAnswerFromDB),
      },
      // {
      //     name: "describeAgent",
      //     description: "Use this tool to describe a specific agent in the network",
      //     args: zodToJsonSchema(agentAddress)
      // },
      // {
      //     name: "suggestAgent",
      //     description: "Use this tool to suggest a specific agent to the user based on user query",
      //     args: zodToJsonSchema(query)
      // },
    ],
  })
  .parse<ModelOutput>((input) => {
    return Effect.tryPromise(async () => {
      const responses = input.toolResponses;
      if (!responses || responses.length == 0)
        throw new Error("No responses were found");
      let outputs: Array<string> = [];
      for (const response of responses) {
        switch (response.name) {
          case "getAgentDetailsFromDB": {
            const parsed = getAnswerFromDB.safeParse(response.args);
            if (!parsed.success) throw new Error("Invalid query");
            const resp = await getAnswerFromDBQ(parsed.data.query);
            outputs.push(resp);
            break;
          }
          // case "describeAgent": {
          //     const parsed = agentAddress.safeParse(response.args)
          //     if (!parsed.success) throw new Error("Invalid agent address");
          //     const resp = await getAgentByAddress(parsed.data)
          //     if (!resp) throw new Error("No agent was found");
          //     outputs.push(JSON.stringify(resp, null, 2))
          //     break;
          // }
          case "suggestAgent": {
            const resp = await getAllAgents();
            outputs.push(JSON.stringify(resp, null, 2));
            break;
          }
          default: {
            throw new Error("No response was chosen");
          }
        }
      }
      return outputs.join("\n\n");
    });
  })
  .input({
    promptLevel: `1`,
    instruction: `
    Summarise the input, so that it's clear, concise and complete.
    `,
  })
  .parse<ModelOutput>((input) =>
    Effect.try(() => {
      if (!input.answer || input.answer.trim().length == 0)
        throw new Error("Invalid output");

      return input;
    }),
  )
  .onStepComplete((artifact) => {
    if (artifact.executor == "prompt") {
      console.log(
        `[${artifact.output?.role ?? "assistant"}] ::`,
        artifact?.output?.answer,
        " ::: \n\n",
        artifact?.output?.toolResponses,
      );
    }
  });
export default tradingPrompt;
