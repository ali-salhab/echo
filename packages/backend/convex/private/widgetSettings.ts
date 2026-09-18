import { ConvexError, v } from "convex/values"
import { mutation, query } from "../_generated/server"

export const getOne = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    console.log(identity, "identity")
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

    const widgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_organization_id", (q) => {
        return q.eq("organizationId", orgId)
      })
      .unique()
    return widgetSettings
  },
})

export const upsert = mutation({
  args: {
    greetMessage: v.string(),
    defaultSuggesstions: v.object({
      suggestion1: v.string(),
      suggestion2: v.string(),
      suggestion3: v.string(),
    }),
    vapiSettings: v.object({
      assistantId: v.optional(v.string()),
      PhoneNumber: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    console.log(identity, "identity")
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

    const exiaingWidgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_organization_id", (q) => {
        return q.eq("organizationId", orgId)
      })
      .unique()
    if (exiaingWidgetSettings) {
      // Update existing widget settings
      await ctx.db.patch(exiaingWidgetSettings._id, {
        greetMessage: args.greetMessage,
        defaultSuggestions: args.defaultSuggesstions,
        vapiSettings: args.vapiSettings,
      })
    } else {
      // Insert new widget settings
      await ctx.db.insert("widgetSettings", {
        organizationId: orgId,
        greetMessage: args.greetMessage,
        defaultSuggestions: args.defaultSuggesstions,
        vapiSettings: args.vapiSettings,
      })
    }
  },
})
