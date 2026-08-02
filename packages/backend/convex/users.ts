import { query, mutation } from "./_generated/server"

export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect()
    return users
  },
})

export const add = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("we called added ")
    const identity = await ctx.auth.getUserIdentity()
    console.log("identity", identity)

    const orgId = identity?.o?.id as string | undefined
    console.log("orgId", orgId)
    if (!identity) {
      throw new Error("User is not authenticated")
    }
    if (!orgId) {
      throw new Error("User does not belong to an organization")
    }
    const user = await ctx.db.insert("users", {
      name: "New User",
      email: "newuser@example.com",
    })
    return user
  },
})
