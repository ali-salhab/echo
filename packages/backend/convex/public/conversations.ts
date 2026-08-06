import { ConvexError, v } from "convex/values"
import { mutation, query } from "../_generated/server"
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
      return null
    }
    return {
      _id: conversation._id,
      threadId: conversation.threadId,
      status: conversation.status,
    }
  },
})
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
    const threadId = "123"
    const conversationId = await ctx.db.insert("conversations", {
      organizationId: args.organizationId,
      contactSessionId: session._id,
      threadId: threadId,
      status: "unresolved",
    })
    return conversationId
  },
})
