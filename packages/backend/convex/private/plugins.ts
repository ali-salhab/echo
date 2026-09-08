import { mutation, query } from "../_generated/server"
import { ConvexError, v } from "convex/values"
export const getOne = query({
  args: {
    service: v.union(v.literal("vapi")),
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
    return await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) => {
        return q.eq("organizationId", orgId).eq("service", args.service)
      })
  },
})

export const remove = mutation({
  args: {
    service: v.union(v.literal("vapi")),
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
    const existingPlugin = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) => {
        return q.eq("organizationId", orgId).eq("service", args.service)
      })
      .unique()
    if (!existingPlugin) {
      throw new ConvexError({
        message: "Plugin not found",
        status: 404,
        code: "NOT_FOUND",
      })
    }
    await ctx.db.delete(existingPlugin._id)
  },
})
