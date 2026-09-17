import { VapiClient, Vapi } from "@vapi-ai/server-sdk"
import { internal } from "../_generated/api"
import { action } from "../_generated/server"

import { getSecretValue, parseSecretString } from "../lib/secrets"
import { ConvexError } from "convex/values"

export const getPhoneNumbers = action({
  args: {},
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      { organizationId: orgId, service: "vapi" }
    )
    if (!plugin) {
      throw new ConvexError({
        message: "Vapi plugin not found for organization",
        status: 404,
        code: "NOT_FOUND",
      })
    }
    const secretName = plugin.secretName
    const secretValue = await getSecretValue(secretName)
    const secretData = parseSecretString<{
      privateApiKey: string
      publicApiKey: string
    }>(secretValue)
    if (!secretData) {
      throw new ConvexError({
        message: "Failed to parse secret",
        status: 500,
        code: "INTERNAL_ERROR",
      })
    }
    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        message: "Missing API keys in secret",
        status: 500,
        code: "INTERNAL_ERROR",
      })
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    })
    const phoneNumbers = await vapiClient.phoneNumbers.list()
    // Your logic to get phone numbers goes here
    return phoneNumbers
  },
})

export const getAssistants = action({
  args: {},
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      { organizationId: orgId, service: "vapi" }
    )
    if (!plugin) {
      throw new ConvexError({
        message: "Vapi plugin not found for organization",
        status: 404,
        code: "NOT_FOUND",
      })
    }
    const secretName = plugin.secretName
    const secretValue = await getSecretValue(secretName)
    const secretData = parseSecretString<{
      privateApiKey: string
      publicApiKey: string
    }>(secretValue)
    if (!secretData) {
      throw new ConvexError({
        message: "Failed to parse secret",
        status: 500,
        code: "INTERNAL_ERROR",
      })
    }
    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        message: "Missing API keys in secret",
        status: 500,
        code: "INTERNAL_ERROR",
      })
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    })
    const assistants = await vapiClient.assistants.list()
    // Your logic to get assistants goes here
    return assistants
  },
})
