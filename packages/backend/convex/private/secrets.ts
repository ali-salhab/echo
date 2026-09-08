import { ConvexError, v } from "convex/values"
import { mutation } from "../_generated/server"
import { internal } from "../_generated/api"

export const upsert = mutation({
  args: {
    service: v.union(v.literal("vapi")),
    value: v.any(),
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

    // TODO: check for subscriptions
    await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
      service: args.service,
      value: args.value,
      organizationId: orgId,
    })
    // Implement the logic to upsert the secret for the given service
  },
})
