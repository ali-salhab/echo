import { ConvexError, v } from "convex/values"
import { mutation, query } from "../_generated/server"
import { supportAgent } from "../system/ai/agents/supportAgents"
import { saveMessage } from "@convex-dev/agent"
import { components } from "../_generated/api"
// we have in the shemas converation table contain contactsessionid so the is one to many relation ship bwtween them
export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId)
    if (!session || session.experiesAt < Date.now()) {
      throw new ConvexError({
        message: "Contact session is invalid or expired",
        status: 400,
        code: "UNAUTHORIZED",
      })
    }

    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) {
      throw new ConvexError({
        message: "Conversation not found",
        status: 404,
        code: "NOT_FOUND",
      })
    }
    if (conversation.contactSessionId !== session._id) {
      throw new ConvexError({
        message: "Contact session is invalid or expired",
        status: 400,
        code: "UNAUTHORIZED",
      })
    }
    // we retun the conversation belong to this threasd and the contact session id to make sure that the user is authorized to access this conversation
    return {
      _id: conversation._id,
      threadId: conversation.threadId,
      status: conversation.status,
    }
  },
})
//
export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId)
    if (!session || session.experiesAt < Date.now()) {
      throw new ConvexError({
        message: "Contact session is invalid or expired",
        status: 400,
        code: "UNAUTHORIZED",
      })
    }
    // TODO: replace once functionality for thread creating is present
    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.organizationId,
    })

    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: "assistant",
        // TODO: latery modify to widget settings initial message
        content: "hello how are you today",
      },
    })
    const conversationId = await ctx.db.insert("conversations", {
      organizationId: args.organizationId,
      contactSessionId: session._id,
      threadId: threadId,
      status: "unresolved",
    })
    return conversationId
  },
})
