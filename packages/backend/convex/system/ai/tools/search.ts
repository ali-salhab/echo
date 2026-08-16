import { google } from "@ai-sdk/google"
import { createTool } from "@convex-dev/agent"
import { z } from "zod"
import { generateText } from "ai"
import { internal } from "../../../_generated/api"
import { supportAgent } from "../agents/supportAgents"
import rag from "../rag"
import { SEARCH_INTERPRETER_PROMPT } from "../constants"
export const search = createTool({
  description:
    "Search the knowledge base for relevant information to help answer user questions.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("the search query to use for the knowledge base search"),
  }),
  execute: async (ctx, args) => {
    if (!ctx.threadId) {
      return "No threadId found in context. Cannot perform search without a threadId."
    }
    const conversation = await ctx.runQuery(
      internal.system.conversation.getByThreadId,
      {
        threadId: ctx.threadId,
      }
    )
    if (!conversation) {
      return "No conversation found for the given threadId. Cannot perform search without a conversation."
    }
    const orgId = conversation.organizationId
    const searchResults = await rag.search(ctx, {
      query: args.query,
      namespace: `${orgId}`,
      limit: 5,
    })
    const contextText = `Found results in ${searchResults.entries
      .map((e) => {
        return e.title || null
      })
      .filter((t) => {
        return t !== null
      })
      .join(", ")} here is the context:\n\n${searchResults.text}`

    const response = await generateText({
      messages: [
        {
          role: "system",
          content: SEARCH_INTERPRETER_PROMPT,
        },
        {
          role: "user",
          content: `user ask  ${args.query} \n\n\ search results: ${contextText}`,
        },
      ],
      model: google.chat("gemini-3.5-flash-lite"),
    })
    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: response.text,
      },
    })
    return response.text
  },
})
