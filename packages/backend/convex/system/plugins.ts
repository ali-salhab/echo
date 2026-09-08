import { v } from "convex/values"
import { internalMutation, internalQuery } from "../_generated/server"

export const upsert = internalMutation({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    secretName: v.string(),
  },
  handler: async (ctx, args) => {
    const existingPlugin = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) => {
        return q
          .eq("organizationId", args.organizationId)
          .eq("service", args.service)
      })
      .unique()
    if (existingPlugin) {
      // Update the existing plugin
      await ctx.db.patch(existingPlugin._id, {
        secretName: args.secretName,
        service: args.service,
      })
    } else {
      // Insert a new plugin
      await ctx.db.insert("plugins", {
        organizationId: args.organizationId,
        service: args.service,
        secretName: args.secretName,
      })
    }
  },
})

export const getByOrganizationIdAndService = internalQuery({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) => {
        return q
          .eq("organizationId", args.organizationId)
          .eq("service", args.service)
      })
      .unique()
  },
})
