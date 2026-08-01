import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values" // استيراد أداة التحقق

export default defineSchema({
  users: defineTable({
    name: v.string(), // استخدام v.string() بدلاً من "string"
    email: v.string(),
  }),
})
