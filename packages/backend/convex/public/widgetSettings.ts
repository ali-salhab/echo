import { query } from "../_generated/server"
import { v } from "convex/values"

export const getByOrganizationId = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const widgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_organization_id", (q) => {
        return q.eq("organizationId", args.organizationId)
      })
      .unique()
    return widgetSettings
  },
})
