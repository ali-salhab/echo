import { ConvexError, v } from "convex/values"
import { action, mutation, query } from "../_generated/server"
import { components, internal } from "../_generated/api"
import { supportAgent } from "../system/ai/agents/supportAgents"
import { paginationOptsValidator } from "convex/server"
import { error } from "console"
import { saveMessage } from "@convex-dev/agent"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export const enhanceresponse = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        message: "User is not authenticated",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }

    const org = identity.o as { id: string }
    const orgId = org?.id

    if (!orgId) {
      throw new ConvexError({
        message: "User is not in organization",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }
    const response = await generateText({
      model: google.chat("gemini-3.5-flash-lite"),
      messages: [
        {
          role: "system",
          content:
            "Enhance the operator message to be more professional and clear and helpful. while maintaining the original intent and key informations",
        },
        {
          role: "user",
          content: args.prompt,
        },
      ],
    })
    return response.text
  },
})
// this create fuction will be called by the widget to create a new message in the conversation thread
export const create = mutation({
  args: {
    prompt: v.string(),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    // here first we validate the session

    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        message: "User is not authenticated",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }

    const org = identity.o as { id: string }
    const orgId = org?.id

    if (!orgId) {
      throw new ConvexError({
        message: "User is not in organization",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }
    // we check if the conversation is valid and not resolved

    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) {
      throw new ConvexError({
        message: "conversation not found",
        status: 404,
        code: "Not-Found",
      })
    }
    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        message: "conversation does not belong to your organization",
        status: 403,
        code: "FORBIDDEN",
      })
    }
    if (conversation.status === "resolved") {
      throw new ConvexError({
        message: "conversation resolved",
        status: 400,
        code: "BAD_REQUEST",
      })
    }
    if (conversation.status === "unresolved") {
      await ctx.db.patch(args.conversationId, {
        status: "escalated",
      })
    }
    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      agentName: identity.familyName,
      message: {
        role: "assistant",
        content: args.prompt,
      },
    })
  },
})

export const getMany = query({
  args: {
    threadid: v.string(),
    paginationOpts: paginationOptsValidator,
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        message: "User is not authenticated",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }

    const org = identity.o as { id: string }
    const orgId = org?.id

    if (!orgId) {
      throw new ConvexError({
        message: "User is not in organization",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }
    const coversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadid))

      .unique()

    if (!coversation) {
      throw new ConvexError({
        message: "conversation not found",
        status: 404,
        code: "NOT_FOUND",
      })
    }
    if (coversation.organizationId !== orgId) {
      throw new ConvexError({
        message: "conversation does not belong to your organization",
        status: 403,
        code: "FORBIDDEN",
      })
    }
    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadid,
      paginationOpts: args.paginationOpts,
    })

    return paginated
  },
})
