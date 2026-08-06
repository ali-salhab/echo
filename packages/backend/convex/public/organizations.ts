import { action } from "../_generated/server"
import { v } from "convex/values"
import { createClerkClient } from "@clerk/backend"
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})
export const validate = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    // console.log("Validating organizationId:", args.organizationId)
    try {
      await clerkClient.organizations.getOrganization({
        organizationId: args.organizationId,
      })
      return { valid: true }
    } catch (error) {
      console.error("Error validating organizationId:", error)
      return { valid: false, error: "organization not found" }
    }
  },
})
