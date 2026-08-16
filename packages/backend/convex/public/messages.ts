import { ConvexError, v } from "convex/values"
import { action, query } from "../_generated/server"
import { components, internal } from "../_generated/api"
import { supportAgent } from "../system/ai/agents/supportAgents"
// import { search } from "../system/ai/tools/search"
import { paginationOptsValidator } from "convex/server"
import { error } from "console"
import { resolveConversation } from "../system/ai/tools/resolveConversation"
import { escalateConversation } from "../system/ai/tools/escalateConversation"
import { saveMessage } from "@convex-dev/agent"
import { search } from "../system/ai/tools/search"
// import { saveMessage } from "@convex-dev/agent"

// this create fuction will be called by the widget to create a new message in the conversation thread
export const create = action({
  args: {
    prompt: v.string(),
    threadid: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    // here first we validate the session
    const contactSession = await ctx.runQuery(
      internal.system.contactSession.getOne,
      {
        contactSessionId: args.contactSessionId,
      }
    )

    if (!contactSession || contactSession.experiesAt < Date.now()) {
      throw new ConvexError({
        message: "Contact session not found",
        status: 404,
        code: "UNAUTHORIZED",
      })
    }
    // we check if the conversation is valid and not resolved

    const conversation = await ctx.runQuery(
      internal.system.conversation.getByThreadId,
      {
        threadId: args.threadid,
      }
    )
    if (!conversation) {
      throw new ConvexError({
        message: "conversation not found",
        status: 404,
        code: "Not-Found",
      })
    }
    if (conversation.status === "resolved") {
      throw new ConvexError({
        message: "conversation Rsolves",

        code: "BAD_REQUEST",
      })
    }
    const shouldTriggerAgent = conversation.status === "unresolved"

    // TODO IMPLEMENT SUBSCRIPTON CHECK
    // HERE WE WILL CALL THE AI AND RETURN WITH RESPONSE
    if (shouldTriggerAgent) {
      await supportAgent.generateText(
        ctx,
        {
          threadId: args.threadid,
        },
        {
          prompt: args.prompt,
          tools: {
            resolveConversationTool: resolveConversation,
            escalateConversationTool: escalateConversation,
            searchTool: search,
          },
        }
      )
    } else {
      await saveMessage(ctx, components.agent, {
        threadId: args.threadid,
        prompt: args.prompt,
      })
    }
    console.log("here we call the ")
  },
})

export const getMany = query({
  args: {
    threadid: v.string(),
    contactSessionId: v.id("contactSessions"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId)
    if (!contactSession || contactSession.experiesAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "invalid session",
      })
    }
    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadid,
      paginationOpts: args.paginationOpts,
    })

    return paginated
  },
})
