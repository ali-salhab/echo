import { ConvexError, v } from "convex/values"
import { mutation, query } from "../_generated/server"
import { supportAgent } from "../system/ai/agents/supportAgents"
import {
  saveMessage,
  vMessageDoc,
  vPaginationResult,
  type MessageDoc,
} from "@convex-dev/agent"
import { components } from "../_generated/api"
import { paginationOptsValidator, type PaginationResult } from "convex/server"
import type { Doc } from "../_generated/dataModel"
// we have in the shemas converation table contain contactsessionid so the is one to many relation ship bwtween them

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

export const getMany = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(
      v.union(
        v.literal("unresolved"),
        v.literal("resolved"),
        v.literal("escalated")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    console.log(identity)
    if (identity === null) {
      throw new ConvexError({
        message: "User is not authenticated",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }
    // we set it in clerk dashboard
    const org = identity.o as { id: string }
    const orgId = org?.id
    console.log("------------------ org id ")
    console.log(orgId)
    console.log("--------------------------------")
    if (!orgId) {
      throw new ConvexError({
        message: "User is not in organization",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }
    // conversations table has a relation with contact session table
    // so we can get the contact session id from the conversations table
    // and then we can get the contact session from the contact session table
    // and then we can get the messages from the support agent and then we can
    // return the last message and the contact session along with the conversation

    // one to many relationship between conversations and contact sessions
    // so one contact session can have many conversations but one conversation can only have one contact session
    let conversations: PaginationResult<Doc<"conversations">>
    if (args.status) {
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_status_and_organization_id", (q) => {
          return q
            .eq(
              "status",
              args.status as "unresolved" | "resolved" | "escalated"
            )
            .eq("organizationId", orgId)
        })
        .order("desc")
        .paginate(args.paginationOpts)
    } else {
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_organization_id", (q) => {
          return q.eq("organizationId", orgId)
        })
        .order("desc")
        .paginate(args.paginationOpts)
    }
    const conversationsWithAdditionalData = await Promise.all(
      conversations.page.map(async (conversation) => {
        let lastmessage: MessageDoc | null = null
        const contactSession = await ctx.db.get(conversation.contactSessionId)
        if (!contactSession) {
          return null
        }
        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversation.threadId,
          paginationOpts: { numItems: 1, cursor: null },
        })
        if (messages.page.length > 0) {
          lastmessage = messages.page[0] ?? null
        }

        return {
          ...conversation,
          lastmessage,
          contactSession,
        }
      })
    )
    const validConversations = conversationsWithAdditionalData.filter(
      // this is a type guard to filter out null values from the array
      // if we don't do this, the type of validConversations will be (Doc<"conversations"> & { lastmessage: MessageDoc | null; contactSession: Doc<"contactSessions"> }) | null
      // after use it the reult will be of type (Doc<"conversations"> & { lastmessage: MessageDoc | null; contactSession: Doc<"contactSessions"> })[]

      (conv): conv is NonNullable<typeof conv> => {
        return conv != null
      }
    )
    return {
      ...conversations,
      page: validConversations,
    }
  },
})
