import { z } from "zod"
import { createTool } from "@convex-dev/agent"
import { internal } from "../../../_generated/api"
import { supportAgent } from "../agents/supportAgents"

export const escalateConversation = createTool({
  description: "Escalate a conversation",

  inputSchema: z.object({}),

  // المعامل الأول هو السياق ctx، والمعامل الثاني هو المدخلات args
  execute: async (ctx): Promise<any> => {
    if (!ctx.threadId) {
      return "Thread ID is not available in the context."
    }
    await ctx.runMutation(internal.system.conversation.escalate, {
      threadId: ctx.threadId,
    })
    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "Conversation has been escalated to human operator",
      },
    })
    return "Conversation has been escalated to human operator"
  },
})
